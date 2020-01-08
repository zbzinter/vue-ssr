

const wsProtocol = location.protocol.startsWith('https') ? 'wss' : 'ws'


export default {
  // 活动类型接口前缀
  pc: 'https://api.dev.qiuhui.com/',

  // 版本类型接口前缀
  // app: 'https://api.dev.qiuhui.com/',

  // mqtt建立连接地址
  mqttConnect: `${wsProtocol}:mqtt-cn-mp90zryi40c.mqtt.aliyuncs.com`,

  // 神盾类型接口前缀
  // manage: 'https://api.dev.qiuhui.com/',

  // 当期所在环境，该项为前端定义，dev开发环境，test测试环境，prod生产环境
  env: 'dev'
}