// 其他公共api

// import FetchBase from '@utils/core/FetchBase'
// import { publicUrls } from '@config/urlConf'
// import { getProjectInfo } from '@business/projectInfo'
// import devServiceInfo from 'devServiceInfo'
import { successCondition, msgKeys, getServerConf, loginInvalidCondition } from '@config/apiConf'
import { serviceInfoSessionId } from '@config/storageIds'
// import { toLogin, logout } from '@business/user'

// const http = new FetchBase()

// 存储api数据的sessionStorage标识
// const serviceInfoSessionId = '__serviceInfoSessionId__'

// 同步获取api地址信息
// export function getServiceInfo() {
//   return JSON.parse(sessionStorage.getItem(serviceInfoSessionId))
// }

// 保存api地址信息
/*export function setServiceInfo(info) {
  sessionStorage.setItem(serviceInfoSessionId, JSON.stringify(info))
}*/

/*// 异步获取api地址信息
export function fetchServiceInfo() {
  return new Promise((resolve, reject) => {

    let { apiInfo } = getServerConf()
    //setServiceInfo(apiInfo)
    resolve(apiInfo)

    //   http.toGet(publicUrls['apiHost']).then(res => {
    //   //   setServiceInfo(res)
    //   //   resolve(res)
    //   // }).catch(err => {
    //   //   reject(err)
    //   // })
  })
}*/

/**
 * [checkResponse fetch请求结果是否正确判断处理]
 * @param  {object}  res          [请求结果]
 * @param  {Boolean} [isTip=true] [是否自动处理错误，如登陆失效后自动跳转到登陆页]
 * @return {object}               [判断结果对象]
 */
export function checkResponse(res, conf = {}) {
  let isCorrect = true
  let msg = '系统异常，请稍后重试！'
  let successKey = Object.keys(res).find(item => Object.keys(successCondition).includes(item))
  if (typeof res === 'object') {
    let msgKey = Object.keys(res).find(item => msgKeys.includes(item))

    // if (successKey && (res[successKey] != successCondition[successKey] && res[successKey] != 100200)) {
    //   // let { isTip, loginUrl, backUrl } = conf
    //   // if (res[successKey] == loginInvalidCondition[successKey]) {
    //   //   if (isTip) {
    //   //     logout(isTip, loginUrl, backUrl)
    //   //   } else {
    //   //     logout(isTip, loginUrl, backUrl)
    //   //   }
    //   // }
    //   isCorrect = false
    // }

    if (msgKey && res[msgKey]) {
      msg = res[msgKey]
    }

  }
  return {
    isCorrect,
    msg,
    code: res[successKey]
  }
}

// 检查TOKEN是否过期
export function checkToken(res) {
  // 112002, "TOKEN信息不存在."
  // 112003, "TOKEN信息无效."
  let isValid = true
  if (res && (res.code === 112002 || res.code === 112003)) {
    isValid = false
  }
  return isValid
}


