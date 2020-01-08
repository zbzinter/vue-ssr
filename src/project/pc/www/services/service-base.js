

import axios from 'axios'
import _ from 'lodash'
import { Message } from 'iview'

/**
 * @constructor Service
 * @description common service class for axios ajax
 * @param {Object} axios options
 * @example Class YourService extends Service
 */
export default class Service {
  constructor(options) {
    options = options || {}
    const Authorization = process ? '' : localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : 'Basic YXBwOmFwcA=='
    this.options = _.merge(
      {
        baseURL: '',
        timeout: 0,
        headers: {
          Authorization
        }
      },
      options
    )

    this.http = this.createInstance(this.options)
    this.setRequestInterceptor()
    this.setResponseInterceptor()
  }

  /**
   * @description create axios instance
   * @param {Object} options axios instance options
   * @return {Object} axios instance
   */
  createInstance(options) {
    const opt = Object.prototype.toString
      .call(options)
      .slice(8, -1)
      .toLowerCase() === 'object' ? options : {}

    return axios.create(opt)
  }

  /**
   * @description set request interceptor, only the last interceptor will be reserved
   * @param {Function} success request success callback handler
   * @param {Function} error request error callbach handler
   * @return {Object} xmlHttpRequest config / config error
   */
  setRequestInterceptor(success, error) {
    // if request interceptor setted then eject it
    if (typeof this._requestInterceptor !== 'undefined') {
      this.http.interceptors.request.eject(this._requestInterceptor)
    }

    this._requestInterceptor = this.http.interceptors.request.use(
      config => {
        if (typeof success === 'function') {
          success(config)
        }
        return config
      },
      err => {
        if (typeof error === 'function') {
          error(err)
        }
        return Promise.reject(err)
      }
    )
  }

  /**
   * @description set response interceptor, only the last interceptor will be reserved
   * @param {Function} success response success callback handler
   * @param {Function} error response error callbach handler
   * @return {Object} xmlHttpRequest response / xmlHttpRequest error
   */
  setResponseInterceptor(success, error) {
    // if response interceptor setted then eject it
    if (typeof this._responseInterceptor !== 'undefined') {
      this.http.interceptors.response.eject(this._responseInterceptor)
    }

    this._responseInterceptor = this.http.interceptors.response.use(
      response => {
        if (typeof success === 'function') {
          return success(response.data)
        } else if (Number(response.status) !== 200) {
          const message =
            response && response.message ? response.message : '接口请求报错'
          Message.error(message)
        } else if (Number(response.status) === 200) {
          return response.data
        }
        return response.data
      },
      err => {
        if (typeof error === 'function') {
          error(err)
        } else {
          Message.error('请求超时, 请重试!')
        }
        return Promise.reject(err)
      }
    )
  }
}

