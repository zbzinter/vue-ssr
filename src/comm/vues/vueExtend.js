import Vue from 'vue'
import { p, isEmpty, deepAssign } from '@utils/utils'
import { getQueryString, jsonToParams, getUrlDir } from '@utils/url'


export default (vueExtends = {}) => {
  try {
    // Vue扩展G_Utils全局工具方法对象
    Object.defineProperty(Vue.prototype, '$utils', {
      value: {
        p,
        isEmpty,
        deepAssign,
        getQueryString,
        jsonToParams,
        getUrlDir,
        // isApp: isApp(),
        // isWechat: isWechat(),
        // isAndroid: isAndroid(),
        // isIOS: isIOS()
      }
    })
  } catch (error) { }


  // 自定义扩展
  Object.keys(vueExtends).forEach(item => {
    Object.defineProperty(Vue.prototype, item, { value: vueExtends[item] })
  })

}
