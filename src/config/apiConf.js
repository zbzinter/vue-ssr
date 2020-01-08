import { getDevEnv, getEnv, uploadUrl } from '@utils/env'
export const successCondition = {
  // 请求成功的条件
  code: 200,
  // respCode: '0000'
}

export const loginInvalidCondition = {
  // 登录态失效的条件
  // respCode: 'BSC10005'
}

// 提示语字段
export const msgKeys = ['message', 'msg']

// 获取当前服务器信息
export function getServerConf() {
  // 开发环境默认接口类型
  let mqttUrl = 'wss:mqtt-cn-mp90zryi40c.mqtt.aliyuncs.com'
  let mqttToken = null
  let type = getDevEnv()

  //  开发及测试环境mqtt配置项
  if (type === 'dev' || type === 'sit') {
    mqttUrl = 'wss:mq.dev.qiuhui.com/ws'
    mqttToken = { username: 'admin', password: '123456' }
  }

  if (type) type = type === 'pro' ? '' : `${type}.`

  // im api地址设置
  let ucimUrl = `https://imapi.${type}qiuhui.com`
  if (type === 'uat.') ucimUrl = 'https://imapi.qiuhui.com'

  return {
    type,

    apiInfo: {

      // 比赛数据 API
      api: getDevEnv() === 'local' ? 'http://192.168.101.150:3333' : `https://gw.${type}qiuhui.com/jmfen-sport-scoreapiv2/`,
      oldApi: `https://gw.${type}qiuhui.com/jmfen-sport-scoreapi/`, // 临时加一个
      // api: 'https://api.uat.qiuhui.com',

      // 比分后台 API
      scoreadmin: `https://scoreadmin.${type}qiuhui.com`,

      // 上传文件 API
      multimedia: uploadUrl(),

      // 用户中心 API
      gw: `https://gw.${type}qiuhui.com`,

      // 通知中心 API
      notice: `https://notice.${type}qiuhui.com`,

      // 运营管理后台 API
      backend: `https://backend.${type}qiuhui.com`,

      // 运营管理前端
      admin: `https://admin.${type}qiuhui.com`,

      // 统计 API
      stats: `https://stats.${type}qiuhui.com`,

      // 赛事配置 API
      sportconfig: `https://sportconfig.${type}qiuhui.com`,

      // 主播个人中心
      anchor: `https://gw.${type}qiuhui.com/jmfen-live`,

      // ucim  通信系统
      ucimUrl,

      // news 资讯
      newsUrl: `https://gw.${type}qiuhui.com/jmfen-sport-cms`,
      // newsUrl: 'https://cms.dev.qiuhui.com'

      // banner
      java: `https://gw.${type}qiuhui.com/jmfen-sport-backend-admin`,

      // shop 商城/会员
      shop: `https://gw.${type}qiuhui.com/jmfen-sport-shopapi`,

      // go语言 会员
      goShop: `https://gw.${type}qiuhui.com/jmfen-go-shopapi`,
    },
    webInfo: {
      pc: `https://www.${type}qiuhui.com`,
      m: `https://m.${type}qiuhui.com`
    },
    mqttInfo: {
      mqttUrl,
      mqttToken
    }
  }
}







// 临时处理api信息
// export const wwwApiInfo = {
//   // 活动类型接口前缀
//   pc: 'https://zpc.qiuhui.com/',

//   // 版本类型接口前缀
//   // app: 'https://api.dev.qiuhui.com/',

//   // mqtt建立连接地址
//   // mqttConnect: `${wsProtocol}:mqtt-cn-mp90zryi40c.mqtt.aliyuncs.com`,

//   // 神盾类型接口前缀
//   // manage: 'https://api.dev.qiuhui.com/',

//   // 当期所在环境，该项为前端定义，dev开发环境，test测试环境，prod生产环境
//   env: 'dev'
// }

// // 临时处理api信息
// export const devApiInfo = {
//   // 活动类型接口前缀
//   pc: 'https://api.dev.qiuhui.com/',

//   // 版本类型接口前缀
//   // app: 'https://api.dev.qiuhui.com/',

//   // mqtt建立连接地址
//   // mqttConnect: `${wsProtocol}:mqtt-cn-mp90zryi40c.mqtt.aliyuncs.com`,

//   // 神盾类型接口前缀
//   // manage: 'https://api.dev.qiuhui.com/',

//   // 当期所在环境，该项为前端定义，dev开发环境，test测试环境，prod生产环境
//   env: 'dev'
// }
