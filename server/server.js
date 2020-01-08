const fs = require('fs')
const path = require('path')
const LRU = require('lru-cache')
const express = require('express')
const microcache = require('route-cache')
const compression = require('compression')
const resolve = file => path.resolve(__dirname, file)
const { createBundleRenderer } = require('vue-server-renderer')

var log4js = require('./log_config')

var errorLog = log4js.getLogger('errorLog')

const isProd = process.env.RUN_MODE !== 'hot'

const lruCache = new LRU({
  max: 100,
  maxAge: 1000 * 20
})

const app = express()

const routerLru = {
  '/index': 5 * 60,
  '/news': 5 * 60,
  '/news/187': 5 * 60,
  '/live-list': 10
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

let templatePath = resolve('../www/template.html')
const template = fs.readFileSync(templatePath, 'utf-8')
const bundle = require('../www/vue-ssr-server-bundle.json')
const clientManifest = require('../www/vue-ssr-client-manifest.json')
renderer = createRenderer(bundle, {
  template,
  clientManifest
})

const serve = (path, cache) => express.static(resolve(path), {
  maxAge: cache && isProd ? 1000 * 30 : 0
})
app.use(compression({ threshold: 0 }))
app.use('/', serve('../www', true))

//设置路由缓存，同一个客户端10秒之内重复刷新的时候返回304
app.use(microcache.cacheSeconds(10, req => isProd && req.originalUrl))

let reqUrl=''

function render(req, res) {
  const s = Date.now()

  res.setHeader('Content-Type', 'text/html')

  const handleError = err => {
    let errText = ''
    let errReason = ''
    if (err.url) {
      res.redirect(err.url)
    } else if (err.code === 408) {
      errReason = '408 | 请求超时'
      res.status(408).send(errReason)
    } else if (err.code === 404) {
      errReason = '404 | Page Not Found'
      res.status(404).send(errReason)
    } else {
      //res.redirect('/error')
      errReason = err.stack||err
      res.status(500).send('500 | Internal Server Error')
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
  reqUrl=req.url
  const hit = lruCache.get(req.url)
  if (hit) {
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

app.get('*', render)

const port = process.env.PORT || 8012
app.listen(port, () => {
  console.log(`server started at localhost:${port}`)
})
