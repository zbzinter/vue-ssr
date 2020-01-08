/**
 * webpack development config
 */

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const getIp = require('get-ip')
const CopyWebpackPlugin = require('webpack-copy-plugin')

const {
  //entry,
  extensions,
  alias,
  module: confModule,
  plugins,
  template,
  favicon,
  manifestFilePath
} = require('./webpack.base.js')

const {
  distPath,
  dllDistPath,
  isMock = false,
  apiType,
  codeType,
  shortPath,
  dll_version,
  commPath,
  // resolve,
  devServerPort,
  localIp
  // ...other
} = require('./projectInfo')

let IPs = getIp()
const defaultIp = '0.0.0.0'

IPs = Array.isArray(IPs) && IPs.length > 0 ? IPs : [defaultIp]

const ip = IPs.find(item => item.includes(localIp)) || defaultIp

module.exports = {
  mode: 'development',
  //entry,
  output: {
    filename: 'chunk/[name].[hash:8].js',
    chunkFilename: 'chunk/[id].[hash:8].js', // chunkFilename用来打包require.ensure方法中引入的模块
    path: distPath,
    globalObject: 'this',
    publicPath: '/' //webpack-dev-server访问的路径
  },
  resolve: {
    extensions,
    alias: {
      ...alias,
      '@envFile': `${commPath}/utils/development.js`
    }
  },
  module: confModule,
  plugins: [
    ...plugins,

    new webpack.DllReferencePlugin({
      manifest: require(manifestFilePath)
    }),

    // 开发环境拷贝dll目录文件至dll目录
    new CopyWebpackPlugin({
      dirs: [
        {
          from: dllDistPath,
          to: `${distPath}/dll`,
          toType: 'dir'
        }
      ]
    }),

    new HtmlWebpackPlugin({
      template,
      filename: 'template.html',
      dllFilePath: `/dll/vues.${dll_version}.min.js`,
      dllUcimFilePath: `/dll/ucim/ucim.${dll_version}.min.js?v=` + new Date().valueOf(),
      cdnServer: '',
      ts: new Date().valueOf(),
      favicon,
      chunks: []
    }),

    new webpack.DefinePlugin({
      'process.env.DEV_ENV': JSON.stringify(process.env.DEV_ENV),
      'process.env.PROJECT_CONF': JSON.stringify({
        isMock,
        apiType,
        codeType,
        isDev: true,
        shortPath
      })
    })
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: distPath,
    // 获取本地ip地址，默认值  0.0.0.0
    host: ip,
    port: devServerPort || 8888,
    publicPath: '/',
    inline: true,
    noInfo: true,
    historyApiFallback: true,
    clientLogLevel: 'warning',
    // 跳过域名检查
    disableHostCheck: true,
  }
}
