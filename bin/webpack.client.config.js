const merge = require('webpack-merge')
const developmentConfig = require('./webpack.development')
const productionConfig = require('./webpack.production')
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const { projectPath } = require('./projectInfo')
const isProd = process.env.RUN_MODE !== 'hot'

module.exports = merge(isProd  ? productionConfig : developmentConfig, {
  entry: {
    polyfills: 'isomorphic-fetch',
    main: `${projectPath}/entry.client.js`
  },
  plugins: [
    // 此插件在输出目录中
    // 生成 `vue-ssr-client-manifest.json`。
    new VueSSRClientPlugin()
  ]
})