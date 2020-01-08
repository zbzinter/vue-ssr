/**
 * webpack production config
 */
// const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
//const CleanWebpackPlugin = require('clean-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('webpack-copy-plugin')
const TerserPlugin = require('terser-webpack-plugin-legacy')

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
  // srcPath,
  distPath,
  dllDistPath,
  // isMock,
  dll_version,
  resolve,
  apiType,
  codeType,
  shortPath,
  commPath,
  cdnServer
  // ...other
} = require('./projectInfo')
module.exports = {
  mode: 'production',
  //entry,
  output: {
    filename: 'chunk/[name].[chunkhash:8].js',
    chunkFilename: 'chunk/[id].[chunkhash:8].js', // chunkFilename用来打包require.ensure方法中引入的模块
    path: distPath,
    globalObject: 'this',
    //publicPath:  '/' // 可配置cdn
    publicPath: `${cdnServer}/` // 可配置cdn
  },
  resolve: {
    extensions,
    alias: {
      ...alias,
      '@envFile': `${commPath}/utils/production.js`
    }
  },
  devtool: false,
  module: confModule,
  plugins: [

    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require(manifestFilePath)
    }),

    ...plugins,

    // 首先清除release目录内容
    /* new CleanWebpackPlugin([distPath], {
      root: resolve('/')
    }), */

    // 打包后不需要此项，暂时使用
    new CopyWebpackPlugin({
      dirs: [{
        from: dllDistPath,
        to: `${distPath}/dll`,
        toType: 'dir'
      }]
    }),

    new HtmlWebpackPlugin({
      template,
      filename: 'template.html',
      // 打包后不需要此项，应为正式环境文件地址，暂时使用
      dllFilePath: `${cdnServer}/dll/vues.${dll_version}.min.js`,
      dllUcimFilePath: `${cdnServer}/dll/ucim/ucim.${dll_version}.min.js?v=` + new Date().valueOf(),
      cdnServer,
      ts: new Date().valueOf(),
      favicon,
      chunks: []
    }),

    new webpack.DefinePlugin({
      'process.env.DEV_ENV': JSON.stringify(process.env.DEV_ENV),
      'process.env.PROJECT_CONF': JSON.stringify({
        isMock: false,
        isDev: false,
        apiType,
        codeType,
        shortPath
      })
    }),

    // css文件压缩
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true,
        autoprefixer: {
          remove: false
        }
      }
    })
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            drop_console: false,
            drop_debugger: true,
            pure_funcs: ['console.log']
          },
        },
      }),
    ],
  },
}
