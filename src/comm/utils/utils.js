

import { getProjectConf } from '@utils/env'


const { isDev } = getProjectConf()


// 生成不重复签名
export function createRandomId() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + S4() + S4()
}

export function getUUID() {
  let d = Date.now()
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (
      c == 'x'
        ? r
        : (r & 0x3 | 0x8)).toString(16)
  })
  return uuid
}

// 非生产环境下console才生效
export function p(...info) {
  if (isDev && window.console) {
    console.log(...info)
  }
}

// 判断变量，字符串，数组，对象是否为空
export function isEmpty(obj) {
  if (typeof obj === 'undefined') {
    return true
  }

  if (typeof obj === 'string' && obj.trim() === '') {
    return true
  }

  if (typeof obj === 'object') {
    if (obj === null) {
      return true
    }

    if (Array.isArray(obj) && obj.length === 0) {
      return true
    }

    let keyArr = Object.keys(obj)
    if (keyArr && keyArr.length === 0) {
      return true
    }
  }
  return false
}

/**
 * deepCopy 深拷贝对象或数组
 * @param {object|array} 对象或数组
 */
export function deepCopy(obj) {
  if (Array.isArray(obj)) {
    return obj.reduce((pre, next) => {
      pre.push(deepCopy(next))
      return pre
    }, [])
  } else if (obj && typeof obj === 'object') {
    return Object.keys(obj).reduce((pre, next) => {
      if (obj.hasOwnProperty(next)) { // 过滤继承属性
        pre[next] = deepCopy(obj[next])
      }
      return pre
    }, {})
  } else {
    return obj
  }
}

/**
 * deepAssign 合并多个对象
 * @param  {...object} 一个或多个对象
 */
export function deepAssign(...objs) {
  return objs.reduce((pre, next) => {
    Object.keys(next).forEach(key => {
      let nextValue = next[key]
      if (pre.hasOwnProperty(key)) {
        let preValue = pre[key]
        if (typeof preValue === typeof nextValue) {
          if (Array.isArray(nextValue)) { // array replace
            pre[key] = deepCopy(nextValue)
          } else if (typeof nextValue === 'object') {
            pre[key] = deepAssign(preValue, nextValue)
          } else {
            pre[key] = nextValue
          }
        } else {
          pre[key] = deepCopy(nextValue)
        }
      } else {
        pre[key] = deepCopy(nextValue)
      }
    })
    return pre
  }, {})
}


// 动态创建script标签，creatScript().then(do something)
export function creatScript(url) {
  return new Promise((resolve, reject) => {
    let head = document.getElementsByTagName('head')[0]
    let script = document.createElement('script')
    script.onload = function () {
      resolve()
    }
    script.src = url
    head.appendChild(script)
  }).catch(err => {
    p(`创建${url}失败,error:${err}`)
  })
}

export function getPositionTop(node) { // 获取元素到顶部距离
  let top = node.offsetTop
  let parent = node.offsetParent
  while (parent != null) {
    top += parent.offsetTop
    parent = parent.offsetParent
  }
  return top // 所有的父元素top和
}


// dataURI数据转blob对象
export function dataURItoBlob(base64Data) {
  let byteString
  if (base64Data.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(base64Data.split(',')[1])
  else
    byteString = unescape(base64Data.split(',')[1])
  let mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0]
  let ia = new Uint8Array(byteString.length)
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }
  return new Blob([ia], { type: mimeString })
}

export const defaultImg = {
  logo: require('@src/assets/default_team_logo.png'),
  football: require('@src/assets/img_team_football_avatar.png'),
  basketball: require('@src/assets/img_team_basketball_avatar.png'),
  baseball: require('@src/assets/img_team_baseball_avatar.png'),
  tennis: require('@src/assets/img_team_tennis.png'),
  tennisBoy: require('@src/assets/img_team_tennis_boy.png'),
  tennisGirl: require('@src/assets/img_team_tennis_girl.png'),
  player: require('@src/assets/default_player.png'),
  playerImg: require('@src/assets/zhenrong_icon_nopic.png'),
  // 用户头像
  avatar: require('@src/assets/default_user.png'),
  // 直播列表默认图片
  liveList: require('@src/assets/live/default_live_list_img.png'),
}

// 自动适配http和https
export function autoUrlHttp(url) {
  if (!url) return ''
  return url.slice(url.indexOf('//'))
}

export function throttle(fn, wait) {
  let timer
  return function () {
    if (!timer) {
      timer = setTimeout(() => {
        timer = null
        fn.apply(this, arguments)
      }, wait)
    }
  }
}

// 获取设备系统
export function getDeviceOS() {
  let name = ''
  const userAgent = window.navigator.userAgent
  
  if(userAgent.indexOf('Android') != -1){
    name = 'Android'
  }else if(userAgent.indexOf('iPhone') != -1){
    name = 'iPhone'
  }else if(userAgent.indexOf('SymbianOS') != -1){
    name = 'SymbianOS'
  }else if(userAgent.indexOf('Windows Phone') != -1){
    name = 'Windows Phone'
  }else if(userAgent.indexOf('iPad') != -1){
    name = 'iPad'
  }else if(userAgent.indexOf('iPod') != -1){
    name = 'iPod'
  }else if (userAgent.indexOf('Windows NT 10.0')!= -1){
    name = 'Windows 10'
  }else if (userAgent.indexOf('Windows NT 6.2') != -1){
    name = 'Windows 8'
  }else if (userAgent.indexOf('Windows NT 6.1') != -1){
    name = 'Windows 7'
  }else if (userAgent.indexOf('Windows NT 6.0') != -1){
    name = 'Windows Vista'
  }else if (userAgent.indexOf('Windows NT 5.1') != -1){
    name = 'Windows XP'
  }else if (userAgent.indexOf('Windows NT 5.0') != -1){
    name = 'Windows 2000'
  }else if (userAgent.indexOf('Mac') != -1){
    name = 'Mac'
  }else if (userAgent.indexOf('X11') != -1){
    name = 'UNIX'
  }else if (userAgent.indexOf('Linux') != -1){
    name = 'Linux'
  }
  return name
}

// 获取当前网络类型
// 网络类型 1-有线 2-wifi 3-4G 4-3G 5-2G
export function getNetworkType() {
  const ua = navigator.userAgent
  let networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other'
  networkStr = networkStr.toLowerCase().replace('nettype/', '')
  let networkType = 1
  switch (networkStr) {
  case 'wifi':
    networkType = 2
    break
  case '4g':
    networkType = 3
    break
  case '3g':
  case '3gnet':
    networkType = 4
    break
  case '2g':
    networkType = 5
    break
  }
  return networkType
}

export function compress(img) {
  let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    width = img.width,
    height = img.height
  canvas.width = width
  canvas.height = height
  // 铺底色
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0, width, height)
  //进行压缩
  return canvas.toDataURL('image/jpeg', 0.8)
}