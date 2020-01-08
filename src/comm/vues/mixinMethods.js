import Vue from 'vue'
import { mapActions, mapMutations } from 'vuex'
import Http from '@utils/Http'
// import Native from '@utils/Native'
// import { getProjectInfo } from '@business/projectInfo'
import { checkResponse, checkToken } from '@business/serviceInfo'
// import { user, login, setTitle } from '@business/user'
import { p } from '@utils/utils'

// const native = new Native()

// 特殊接口参数
const specialKeys = [
  'apiType',
  'headers',
  'body',
  'serviceInfo',
  'method',
  'isConsole',
  'isTip',
  'isLoading',
  'loginUrl'
]
export default (methods = {}, conf) => {

  const http = new Http(conf)

  Vue.mixin({
    methods: {
      ...mapMutations(['G_SetNav']),
      ...mapMutations(['G_SetLogin']),
      ...mapMutations(['G_SetUserInfo']),
      ...mapMutations(['G_SetMemberInfo']),
      // $user(info, isAppLogin) {
      //   return user(info, isAppLogin)
      // },
      // $login(isLogin = true, loginUrl, backUrl = location.href) {
      //   return login(isLogin, loginUrl, backUrl = location.href)
      // },
      // $setTitle(title) {
      //   setTitle(title)
      // },
      $fetch(api, data = {}, method = 'post', options) {
        return new Promise((resolve, reject) => {

          if (typeof data === 'object' && Object.keys(data).some(item => specialKeys.includes(item))) {
            conf = {
              ...conf,
              ...data
            }
          }

          let {
            isTip = true,
            isLoading = true
          } = conf

          // 显示loading
          if (isLoading) {
            this.$loading(true)
          }
          http[`$${method}`](api, data, options).then(res => {
            if (isLoading) {
              this.$loading(false)
            }

            // 判断fetch结果是否正确
            let { isCorrect, msg, code } = checkResponse(res, conf)
            if (isCorrect) {
              // 处理公共错误
              // fetchSuccss(res)
              resolve(res)
            } else {
              if (isTip) {
                // if (!/152001/.test(code)) this.$tip(msg)
                const isValid = checkToken(res)
                if (!isValid) {
                  // this.$tip('登录已过期，请重新登录')
                  localStorage.clear()
                  // localStorage.removeItem('token')
                  // localStorage.removeItem('userInfo')
                  // setTimeout(() => {
                  //   window.location.href = window.location.origin
                  // }, 1500)
                }
                reject(res)
              } else {
                resolve(res)
              }
            }
          }).catch(err => {
            // 异常处理
            if (isLoading) {
              this.$loading(false)
            }
            // this.$tip(
            //   typeof err === 'string'
            //     ? err
            //     : '网络异常，请稍后再试！')

            reject(err)
          })
        })
      },
      $get(api, data) {
        return this.$fetch(api, data, 'get')
      },
      $post(api, data) {
        return this.$fetch(api, data)
      },
      $upload(api, data, options) {
        // options [其他请求配置，如apiType，headers，params等]
        return this.$fetch(api, data, 'upload', options)
      },
      $put(api, data) {
        return this.$fetch(api, data, 'put')
      },
      $del(api, data) {
        return this.$fetch(api, data, 'del')
      },
      $tip(msg, seconds) {
        return new Promise((resolve, reject) => {
          this.G_SetTip({
            msg,
            seconds,
            callback: () => {
              resolve()
            }
          })
        })
      },
      ...mapActions(['G_SetTip']), // 混合全局错误提示方法
      ...mapMutations({
        '$loading': 'G_SetLoading' // 混合全局loading方法
      }),
      ...methods,
    }
  })
}
