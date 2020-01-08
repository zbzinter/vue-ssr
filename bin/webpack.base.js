/**
 * webpack base config
 */
const fs = require('fs')
const CopyWebpackPlugin = require('webpack-copy-plugin')

const {
  VueLoaderPlugin
} = require('vue-loader')

const {
  srcPath,
  projectPath,
  commPath,
  configPath,
  defaultHtmlPath,
  defaultFaviconPath,
  manifestFilePath,
  distPath,
  mockPath,
  codeType,
  resolve
  // sep,
} = require('./projectInfo')

// html模板文件路径
const htmlPath = `${projectPath}/index.html`
const faviconPath = `${projectPath}/favicon.ico`

// 默认html文件路径
const template = fs.existsSync(htmlPath) ? `${projectPath}/index.html` : defaultHtmlPath

// 默认favicon文件路径
const favicon = fs.existsSync(faviconPath) ? faviconPath : defaultFaviconPath

let baseCssLoader = [
  'vue-style-loader',
  'css-loader'
]

// pc项目不使用 px2rem-loader，可根据实际情况添加
if (codeType !== 'pc') {
  baseCssLoader.push(
    {
      loader: 'px2rem-loader',
      options: {
        remUni: 75,
        remPrecision: 8
      }
    })
}

const plugins = [

  new VueLoaderPlugin(),

  // 拷贝static目录文件 dirs?
  new CopyWebpackPlugin({
    dirs: [{
      from: `${projectPath}/static`,
      to: `${distPath}/static`,
      toType: 'dir'
    }]
  })
]

const alias = {
  vue$: 'vue/dist/vue.esm.js',
  '@': `${srcPath}`,
  '@src': projectPath,  // pc/www
  '@pages': `${projectPath}/pages`,  // pc/www
  '@service': `${projectPath}/services/modules`,
  '@comm': commPath,
  '@business': `${commPath}/business`,
  '@components': `${commPath}/components`,
  '@public': `${commPath}/public`,
  '@utils': `${commPath}/utils`,
  '@vues': `${commPath}/vues`,
  '@config': configPath,
  '@mockPath': mockPath
}

const rules = [{
  test: /\.vue$/,
  use: [
    {
      loader: 'vue-loader'
    },
    {
      loader: 'iview-loader',
      options: {
        prefix: false
      }
    }
  ]
}, {
  test: /\.pug$/,
  use: ['pug-html-loader']
}, {
  test: /\.js$/,
  use: ['babel-loader'],
  include: [
    resolve('src'),
    resolve('test'),
    resolve('node_modules/vue-echarts'),
    resolve('node_modules/resize-detector')
  ]
}, {
  test: /\.(css|postcss)$/,
  use: [...baseCssLoader, 'postcss-loader']
}, {
  test: /\.styl/,
  use: [...baseCssLoader, 'postcss-loader', 'stylus-loader']
}, {
  test: /\.(scss|sass)$/,
  use: [...baseCssLoader, 'sass-loader', {
    loader: 'sass-resources-loader',
    options: {
      resources: [resolve('src/project/pc/www/public/variable.scss')]
    }
  }]
}, {
  test: /\.(less)$/,
  use: [...baseCssLoader, 'less-loader']
}, {
  // 图片文件处理
  test: /\.(png|jpg|jpeg|gif|svg|svgz)(\?.+)?$/,
  exclude: [resolve('src/project/pc/www/assets/*.mp3')],
  use: [{
    loader: 'url-loader',
    options: {
      // 8kb以内采用base64处理
      limit: 8000,
      name: 'assets/[name].[hash:8].[ext]'
    }
  }]
}, {
  // 字体文件处理
  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
  use: [{
    loader: 'url-loader',
    options: {
      limit: 8000,
      name: 'fonts/[name].[hash:8].[ext]'
    }
  }]
},
{
  test: /\.mp3(\?.*)?$/,
  loader: 'url-loader',
  options: {
    limit: 10000,
    name: 'assets/[name].[hash:8].[ext]'
  }
},
{
  // 匹配 *.worker.js
  test: /\.worker\.js$/,
  use: {
    loader: 'shared-worker-loader',
    options: {
      name: '[name]:[hash:8].js',
      //publicPath: `${projectPath}/worker/`,
      //inline: true
    }
  }
}
]

module.exports = {
  /* entry: {
    polyfills: 'isomorphic-fetch',
    main: `${projectPath}/main.js`
  }, */
  extensions: ['.tsx', '.ts', '.js', '.vue', '.css'],
  module: {
    rules
  },
  alias,
  plugins,
  template,
  favicon,
  manifestFilePath
}
