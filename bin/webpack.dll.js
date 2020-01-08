/**
 * webpack development config
 */

const webpack = require('webpack')
// 如果需要打包公共vue文件的时候可启用
// const { VueLoaderPlugin } = require('vue-loader')

const {
  extensions,
  alias,
  module: confModule,
  dllDistPath,
  dll_version
} = require('./projectInfo')


module.exports = {
  mode: 'production',
  entry: {
    vues: ['vue/dist/vue.esm.js', 'vue-router', 'vuex'],
    // utils: []  // 其他公共内容，暂无
  },
  output: {
    filename: `[name].${dll_version}.min.js`,
    chunkFilename: 'chunk/[name].[hash:8].js', // chunkFilename用来打包require.ensure方法中引入的模块
    path: dllDistPath,
    library: '[name]_[chunkhash:8]'
  },
  resolve: {
    extensions,
    alias
  },
  module: confModule,
  plugins: [
    // new VueLoaderPlugin(),
    new webpack.DllPlugin({
      path: `${dllDistPath}/[name]_manifest.${dll_version}.json`,
      name: '[name]_[chunkhash:8]',
      context: __dirname
    })
  ]
}
