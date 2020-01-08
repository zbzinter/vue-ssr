const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const express = require('express')
const microcache = require('route-cache')
const compression = require('compression')
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')

const isProd = process.env.RUN_MODE !== 'hot'

var log4js = require('./server/log_config')

var errorLog = log4js.getLogger('errorLog')
var resLog = log4js.getLogger('responseLog')

const DEV_ENV = process.argv[2]

process.env.DEV_ENV = DEV_ENV

let cdnServer = ''
switch (process.env.DEV_ENV) {
case 'sit':
  cdnServer = 'https://cdn.sit.qiuhui.com'
  break
case 'uat':
  cdnServer = 'https://cdn.uat.qiuhui.com'
  break
case 'pro':
  cdnServer = 'https://cdn.qiuhui.com'
  break
}
const ts = new Date().valueOf()

let { dll_version } = require('./conf')
const dllFilePath = `${cdnServer}/dll/vues.${dll_version}.min.js`
const dllUcimFilePath = `${cdnServer}/dll/ucim/ucim.${dll_version}.min.js?` + ts

const lruCache = new LRU({
  max: 100,
  maxAge: 1000 * 20
})

const app = express()

const routerLru = {
  '/index': 1 * 60,
  '/news': 30,
  '/news/187': 30,
  '/live-list': 10,
  '/score/football': 5 * 60,
  '/score/basketball': 5 * 60,
  '/score/tennis': 5 * 60,
  '/score/baseball': 5 * 60,
  '/database/football': 5 * 60
}

function getLruTime(url) {
  return routerLru[url] || 30
}

function createRenderer(bundle, options) {
  return createBundleRenderer(bundle, Object.assign(options, {
    runInNewContext: false
  }))
}

let renderer
let readyPromise

if (isProd) {
  let templatePath = resolve('./www/template.html')
  const template = fs.readFileSync(templatePath, 'utf-8')
  const bundle = require('./www/vue-ssr-server-bundle.json')
  const clientManifest = require('./www/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
} else {
  const devPath = resolve('./src/ssrDefault.html')
  let ssrTemplate = fs.readFileSync(resolve('./src/default.html'), 'utf-8')
  fs.writeFileSync(devPath, ssrTemplate.replace(/<%= htmlWebpackPlugin.options.cdnServer %>/g, cdnServer)
    .replace(/<%= htmlWebpackPlugin.options.ts %>/g, ts)
    .replace(/<%= htmlWebpackPlugin.options.dllFilePath %>/g, dllFilePath)
    .replace(/<%= htmlWebpackPlugin.options.dllUcimFilePath %>/g, dllUcimFilePath))
  readyPromise = require('./bin/setup-dev-server')(
    app,
    devPath,
    (bundle, options) => {
      renderer = createRenderer(bundle, {
        ...options,
        // clientManifest: require('./www/vue-ssr-client-manifest.json')
      })
    }
  )
}

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 30 : 0
})
app.use(compression({ threshold: 0 }))
app.use('/', serve('./www', true))

//设置路由缓存，同一个客户端10秒之内重复刷新的时候返回304
app.use(microcache.cacheSeconds(10, req => isProd && req.originalUrl))

function render(req, res) {
  const s = Date.now()
  res.setHeader('Content-Type', 'text/html')

  const handleError = err => {
    let errText = ''
    let errReason = ''
    if (err.url) {
      res.redirect(err.url)
    } else if (err.code === 408) {
      res.status(408).send('408 | 请求超时')
      errReason = '408 | 请求超时'
    } else if (err.code === 404) {
      res.status(404).send('404 | Page Not Found')
      errReason = '404 | Page Not Found'
    } else {
      res.redirect('/error')
      //res.status(500).send('500 | Internal Server Error')
      errReason = err.stack||err
    }
    errText =
      `error during render : ${req.url}
      原因：${errReason}
      **************** response log end **************`
    console.log(errText)
    errorLog.error(errText)
  }

  const context = {
    url: req.url
  }
  const hit = lruCache.get(req.url)
  if (hit && isProd) {
    console.log(`lru request: ${Date.now() - s}ms`)
    return res.send(hit)
  }

  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    lruCache.set(req.url, html, getLruTime(req.url) * 1000)
    res.send(html)
    if (isProd) return
    console.log(`whole request: ${Date.now() - s}ms`)
  })
}

process.on('unhandledRejection', (reason, p) => {
  p.catch(err => {
    console.log('error：', err)
    let errText =
    `
     路由地址：${reqUrl} 
     未处理的rejection ${err.stack||err}
     原因：${reason}}
    **************** response log end **************`
    console.log(errText)
    errorLog.error(errText)
  })
})
let reqUrl=''
app.get('*', isProd ? render : (req, res) => {
  reqUrl=req.url
  readyPromise.then(() => render(req, res))
})

const port = process.env.PORT || 8012
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
