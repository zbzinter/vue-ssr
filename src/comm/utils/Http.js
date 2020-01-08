/**
 * [fetch 请求封装]
 */


import FetchBase from '@utils/core/FetchBase'
import { fetchServiceInfo, toMock } from '@envFile'
import { deepAssign, p } from '@utils/utils'
import { getProjectConf } from '@utils/env'
import { checkToken } from '@business/serviceInfo'

const {
  isDev,
  isMock,
  apiType: envApiType
} = getProjectConf()

const isUseMock = isDev && isMock

// 特殊接口参数
const specialKeys = ['apiType', 'headers', 'body', 'serviceInfo', 'method', 'timeout']

/**
 * [options 请求全局配置]
 * @example
 * {
 *  serviceInfo: {},
 *  apiType: 'app',
 *  body: {},
 *  headers: {}
 * }
 * @type {Object}
 */
export default class Http extends FetchBase {
  constructor(options = {}) {
    super(options)
    this.publicOptions = { ...options }
    this.init()
  }

  /**
   * 初始化 获取serviceInfo信息
   */
  init() {
    if (isUseMock) {
      p('---------- mock功能已启用 ----------')
    }
  }

  /**
   *
   * @param {string} url  接口地址
   * @param {object} options  配置信息
   * @param  {Boolean} [isMixHeaders=false] [是否需要混合默认headers]
   */
  $get(url, options, isMixHeaders = false) {
    return this.$fetch(url, options, 'toGet', isMixHeaders)
  }

  $post(url, options, isMixHeaders = false) {
    return this.$fetch(url, options, 'toPost', isMixHeaders)
  }

  $upload(url, options, isMixHeaders = false) {
    return this.$fetch(url, options, 'toUpload', isMixHeaders)
  }

  $put(url, options, isMixHeaders = false) {
    return this.$fetch(url, options, 'toPut', isMixHeaders)
  }

  $del(url, options, isMixHeaders = false) {
    return this.$fetch(url, options, 'toDelete', isMixHeaders)
  }

  /**
   * [$fetch 请求统一入口]
   * @param  {string}  url                 [接口地址]
   * @param  {object}  options             [请求配置]
   * @param  {string}  fnName              [请求函数名]
   * @param  {Boolean} [isMixHeaders=false] [是否需要混合默认headers]
   * @return {function}                    [请求promise]
   */
  $fetch(url, options, method, isMixHeaders = false) {
    let { serviceInfo, headers, body, apiType } = this.getFetchOptions(options, isMixHeaders)
    let reqUrl = ''
    return fetchServiceInfo().then((res = {}) => {
      const mixServiceInfo = deepAssign(res, serviceInfo)
      // mock处理
      if (isUseMock) {
        return toMock(url, mixServiceInfo, apiType)
      }
      reqUrl = this.getUrl(url, mixServiceInfo, apiType)
      return new Promise((resolve, reject) => {
        this[method](reqUrl, { headers, body }).then(res => {
          const isValid = checkToken(res)
          if (!isValid) {
            // Message.info('登录已过期，请重新登录')
            localStorage.clear()
            // localStorage.removeItem('token')
            // localStorage.removeItem('userInfo')
            // setTimeout(() => {
            //   window.location.href = window.location.origin
            // }, 1500)
          }
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    })
  }

  /**
   * [getFetchOptions 获得请求配置信息]
   * @param  {object}  options             [请求配置]
   * @param  {Boolean} [isMixHeaders=false] [是否需要混合默认headers]
   * @return {object}                      [请求配置信息]
   */
  getFetchOptions(options, isMixHeaders = false) {
    let { publicOptions } = this
    const mixOptions = deepAssign(publicOptions, this.formatOptions(options))

    let {
      apiType = envApiType,
      serviceInfo = {},
      headers = {},
      body
    } = mixOptions

    // 全局token 
    /* const newHeaders = {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      ...headers
    } */

    let newHeaders
    // 全局token 
    try {
      newHeaders = {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        ...headers
      }
    } catch (error) {
      newHeaders = {
        ...headers
      }
    }
    return {
      apiType,
      serviceInfo,
      headers: isMixHeaders
        ? this.mixHeaders(newHeaders)
        : newHeaders,
      body: this.mixBody(body)
    }
  }

  /**
   * [getUrl description]
   * @param  {string}  url       [接口地址]
   * @param  {string} mixServiceInfo [混合后的接口信息]
   * @param  {string} apiType    [接口类型]
   * @return {string}            [完整接口地址]
   */
  getUrl(url, mixServiceInfo, apiType) {
    if (url.search(/^https?/) > -1) {
      return url
    }

    url = url.replace(/^\/+/, '')

    let typeUrl = mixServiceInfo[apiType]
    if (typeof typeUrl === 'undefined') {
      throw new Error('type is not in serviceInfo')
    }
    typeUrl = `${typeUrl.replace(/\/+$/, '')}`
    return url
      ? `${typeUrl}/${url}`
      : typeUrl
  }

  // 格式化options
  formatOptions(options = {}) {

    if (typeof options === 'string') {
      return { body: options }
    }
    let isFindSpecial = Object.keys(options).some(key => specialKeys.includes(key))
    if (isFindSpecial) {
      return {
        ...options
      }
    }

    return {
      body: {
        ...options
      }
    }
  }

  // 合并默认参数
  mixBody(body = {}) {
    if (typeof body === 'string') {
      return body
    }

    return body
  }

  // 未设置Content-type， 则设置默认Content-type
  // 默认为： 'Content-type': 'application/json; charset=UTF-8'
  mixHeaders(headers = {}) {
    // let { token } = user()
    let isHadContentType = Object.keys(headers).some(item => item.toLocaleLowerCase() === 'content-type')
    if (!isHadContentType) {
      headers = {
        ...headers,
        'Content-type': 'application/json; charset=UTF-8'
      }
    }
    // if (token) {
    //   headers = {
    //     token,
    //     ...headers
    //   }
    // }
    return {
      ...headers
    }
  }

}
