const log4js = require('log4js')
const path = require('path')
const fs = require('fs')
const basePath = process.platform ==='linux'?'/var/log/sport/www':path.join(__dirname,'../logs')
var errorPath = path.join(basePath, './errors')
var resPath = path.join(basePath, './responses')

var errorFilename = path.join(errorPath, './error')
var resFilename = path.join(resPath, './response')

var confirmPath = function (pathStr) {
  if (!fs.existsSync(pathStr)) {
    fs.mkdirSync(pathStr)
    console.log('createPath:' + pathStr)
  }
}

log4js.configure({
  appenders: {
    errorLog: {
      type: 'dateFile', //日志类型
      filename: errorFilename, //日志输出位置
      alwaysIncludePattern: true, //是否总是有后缀名
      pattern: 'yyyy-MM-dd.log' //后缀，每天创建一个新的日志文件
    },
    responseLog: {
      type: 'dateFile',
      filename: resFilename,
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd.log'
    }
  },
  categories: {
    errorLog: { appenders: ['errorLog'], level: 'error' },
    responseLog: { appenders: ['responseLog'], level: 'info' },
    default: { appenders: ['responseLog', 'errorLog',], level: 'trace' }
  },
  pm2: true,
  pm2InstanceVar: 'INSTANCE_ID',
  //disableClustering: true
})
if (basePath) {
  confirmPath(basePath)
  confirmPath(errorPath)
  //confirmPath(resPath)
}
module.exports = log4js