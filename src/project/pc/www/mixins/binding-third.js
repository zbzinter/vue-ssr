import Http from '@utils/Http'
const http = new Http()

export default {
  data() {
    return {
      query: {},
      // 是否显示弹窗
      showBinding: false,
      // 存储token 绑定手机号用 
      tokenToBindPhone: '',
    }
  },
  mounted() {
    this.getParams()
    this.bindInit()
  },
  methods: {
    // 初始化
    bindInit() {
      // 获取第三方类型
      const type = sessionStorage.getItem('third-type')
      // qq
      if (type === '1') {
        // 清除第三方类型，避免重复认证
        sessionStorage.removeItem('third-type')
        this.qqInit()
      }
      // 微信
      else if (this.query.code && this.query.state === 'wx' && sessionStorage.getItem('WX_LOGIN') !== '1') {
        this.weixinInit(this.query.code)
      }
      // 微博
      else if (this.query.code && this.query.state === 'wb' && sessionStorage.getItem('WEIBO_LOGIN') !== '1') {
        this.weiboInit(this.query.code)
      }
    },
    // 存储页面参数
    getParams() {
      this.query = this.$route.query || {}
    },
    // 获取回调地址-当前域名
    getRedirectUrl() {
      return window.location.origin + '/index'
    },
    // qq登录初始化
    qqInit() {
      const _this = this
      // 判断登录状态、获取信息
      const check = window.QC.Login.check()
      if (check) {
        window.QC.api('get_user_info', {}).success(function (s) {
          window.QC.Login.getMe(function (openId) {
            const _params = {
              thirdKey: openId,
              thirdType: 'QQ',
              displayName: s.data.nickname,
              imageUrl: encodeURIComponent(s.data.figureurl_qq),
            }
            // 判断是否有登录，有登录就绑定第三方帐号，没有登录就用第三方登录
            if (localStorage.getItem('token')) {
              _this.bindThird('QQ', _params)
            } else {
              _this.thirdLogin('QQ', _params)
            }
          })
        }).error(function () {
          //失败回调
          this.loginError('QQ')
        })
      } else {
        this.loginError('QQ')
      }
    },
    // 微信登录初始化
    weixinInit(code) {
      sessionStorage.setItem('WX_LOGIN', '1')
      this.getParamsInfo('WX', code)
    },
    // 微博登录初始化
    weiboInit(code) {
      sessionStorage.setItem('WEIBO_LOGIN', '1')
      this.getParamsInfo('WEIBO', code)
    },
    getParamsInfo(type, code) {
      // 获取参数
      const _this = this
      this.$get('/jmfen-sport-passport/third/' + type + '/' + code, {
        apiType: 'gw',
        headers: {
          'Authorization': 'Basic YXBwOmFwcA=='
        },
      }).then(res => {
        const { code, data = {} } = res
        if (code === 100200) {
          const _params = {
            thirdKey: data.openId,
            thirdType: type,
            displayName: data.nickName,
            imageUrl: encodeURIComponent(data.avatar),
          }
          // 判断是否有登录，有登录就绑定第三方帐号，没有登录就用第三方登录
          if (localStorage.getItem('token')) {
            _this.bindThird(type, _params)
          } else {
            _this.thirdLogin(type, _params)
          }
        }
      })
    },
    // 登录失败
    loginError(type = '第三方') {
      this.$error(`${type}授权失败，请重新登录`)
      setTimeout(() => {
        this.$router.push({
          path: '/'
        })
      }, 500)
    },
    // 绑定第三方帐号
    bindThird(type, params) {
      http.$get('jmfen-sport-usercenter/v1/user/bind/' + type, {
        apiType: 'gw',
        body: params
      }).then(res => {
        if (res.code === 100200) {
          // 更新用户信息
          this.updateUserAndMember({
            uid: localStorage.getItem('uid'),
            token: localStorage.getItem('token')
          })
        } else {
          this.$error(res.msg)
        }
      })
    },
    // 第三方应用登录
    thirdLogin(type, params) {
      http.$get('jmfen-sport-passport/app/bind/' + type, {
        apiType: 'gw',
        headers: {
          'Authorization': 'Basic YXBwOmFwcA=='
        },
        body: params
      }).then(res => {
        if (res.code === 100200) {
          const data = res.data || {}
          // 存储token 绑定手机号用
          this.tokenToBindPhone = data.token
          // 已经绑定过手机号
          if (data.mobile) {
            // 有mobile字段代表已经绑定过手机号，登录后回到首页
            localStorage.setItem('token', data.token)
            localStorage.setItem('uid', data.uid)
            // 更新用户信息
            this.updateUserAndMember({
              uid: data.uid,
              token: data.token
            })
          } else {
            // 没有mobile字段需要绑定手机号-弹窗
            this.showBinding = true
          }
        } else {
          this.$error(res.msg)
        }
      })
    },
  }
}
