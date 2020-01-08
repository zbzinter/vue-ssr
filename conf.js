let cdnServer = ''
switch (process.env.DEV_ENV) {
case 'sit':
  cdnServer = ''
  break
case 'uat':
  cdnServer = 'https://cdn.uat.qiuhui.com'
  break
case 'pro':
  cdnServer = 'https://cdn.qiuhui.com'
  break
}
module.exports = {

  // 项目简写路径（忽略 src/project 部分）
  project: 'pc/www', // activity, app, document, manage

  // 接口类型（api:比赛数据, scoreadmin:比分后台, multimedia: 上传文件, 用户中心: gw等）
  // 默认 api
  apiType: 'api',

  // 代码类型（pc, mobile, wechat等）
  // 默认pc
  codeType: 'pc',

  // devServer运行端口号（同时运行多个项目时，可修改该项为不同值，避免互相冲突）
  devServerPort: 8808,

  // 是否启用mock功能
  isMock: false,

  // 启用mock方式：
  // 1. json为读取本地json文件方式
  // 2. node为本地node服务，该形式需启用node服务（npm run mock）
  // 3. ''为不启用mock功能
  // mockType: 'json', // node, json, ''

  // mock服务端口号
  // mockPort: '3000',

  // 本地ip地址前缀(自动获取地址会获取多个，不准确)
  localIp: '192.168.101',

  // dll版本
  dll_version: '1.0.0',

  // cdn加速地址
  cdnServer
}
