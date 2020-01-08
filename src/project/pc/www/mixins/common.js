
import { mapState, mapActions } from 'vuex'
import { defaultImg } from '@utils/utils'
import Http from '@utils/Http'
const http = new Http()

export default {
  computed: {
    // 用户信息
    ...mapState(['commUserInfo']),
    // 会员信息
    ...mapState(['commMemberInfo'])
  },
  data() {
    return {
      codeText: '获取验证码',
      // 倒计时时间
      totalTime: 60,
      // 倒计时是否正在进行
      countDownStart: false,
      // url 参数
      query: {},
      errorTip: '',
      codeFlag: true,
      codeSuccess: false
    }
  },
  watch: {
    errorTip: {
      handler: function () {
        const timer = setTimeout(() => {
          this.errorTip = ''
          clearInterval(timer)
        }, 3000)
      },
      deep: true
    },
    codeSuccess: {
      handler: function () {
        const timer = setTimeout(() => {
          this.codeSuccess = false
          clearInterval(timer)
        }, 3000)
      },
      deep: true
    }
  },
  methods: {

    // 更新用户信息
    ...mapActions(['G_GetUserInfo']),

    // 更新会员信息
    ...mapActions(['G_GetMemberInfo']),

    // 路由返回
    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push('/')
      }
    },

    // 存储页面参数
    getParams() {
      this.query = this.$route.query || {}
    },

    // 清除某个data值为空
    clearValue(name) {
      if (!name) return
      this[name] = ''
    },

    // 查看密码
    viewPassword(name) {
      if (!name) return
      this[name] = !this[name]
    },
    // 获取localStorage用户信息
    getUserInfo() {
      const _userData = localStorage.getItem('userInfo') || '{}'
      return JSON.parse(_userData)
    },

    // 验证手机号
    mobileVerify(rule, value, callback) {
      const telRegx = /^1[3456789]\d{9}$/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!telRegx.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    },

    // 验证手机号
    validatePhoneNum(value) {
      const telRegx = /^1[3456789]\d{9}$/
      if (!value) {
        this.errorTip = '请输入手机号'
        return false
      }
      if (!telRegx.test(value)) {
        this.errorTip = '请输入正确的手机号'
        return false
      }
      return true
    },

    // 验证密码复杂度,包含数字和字母
    newPwdVerify(rule, value, callback) {
      const pwdReg = new RegExp('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$')
      if (!pwdReg.test(value)) {
        callback(new Error('请设置6-20位字母数字组合密码'))
      } else {
        callback()
      }
    },

    // 验证密码复杂度,包含数字和字母
    newPwdVerifyHelper(value) {
      const pwdReg = new RegExp('^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$')
      if (!value) {
        this.errorTip = '请输入密码'
        return false
      }
      if (!pwdReg.test(value)) {
        this.errorTip = '请设置6-20位字母数字组合密码'
        return false
      }
      return true
    },

    // 验证邮箱
    emailVerify(rule, value, callback) {
      const emailReg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
      if (value === '') {
        callback(new Error('请输入邮箱地址'))
      } else if (!emailReg.test(value)) {
        callback(new Error('请输入正确的邮箱地址'))
      } else {
        callback()
      }
    },

    async validateCode(params) {
      if (!this.codeFlag) {
        return
      }
      const telRegx = /^1[3456789]\d{9}$/
      if (params && params.phone) {
        if (!telRegx.test(params.phone)) {
          this.errorTip = '请输入正确的手机号'
          return false
        }
      }

      const code = await this.getPhoneCode({
        ...params
      })
      let timer = setInterval(() => {
        this.totalTime--
        this.codeText = `重新获取(${this.totalTime}s)`
        this.codeFlag = true
        if (this.totalTime <= 0) {
          clearInterval(timer)
          this.codeText = '重新获取'
          this.codeFlag = false
          this.totalTime = 60
        }
      }, 1000)

    },

    /**
     * 获取手机验证码
     * @param {String} formRef [所在表单form 的ref名称]
     * @param {String} field [手机号字段，发送验证码前验证]
     * @param {Object} params [发送短信的参数]
     */
    getPhoneCode(params) {
      http.$get('jmfen-sport-usercenter/app/send/code', {
        apiType: 'gw',
        headers: {
          'Authorization': 'Basic YXBwOmFwcA=='
        },
        body: params
      }).then((res) => {
        const { code, data, msg } = res
        if (this.$judgeCode(code) && data) {
          this.codeSuccess = true
        } else {
          this.errorTip = msg
        }
      })
    },

    // 更新用户和会员信息
    updateUserAndMember(params) {
      this.G_GetUserInfo(params)
      this.G_GetMemberInfo(params)
    },

    // 我要直播、申请直播
    wantToLive() {
      // 如果没有实名认证，提示后跳转到认证页面

      if (this.getUserInfo().certFlag < 1) {
        this.$tip('您还未实名认证，请先实名认证！')
        setTimeout(() => {
          this.$router.push('/personal/identity')
        }, 1500)
      } else {
        const set = localStorage.getItem('set')
        if (set === '1') {
          this.$router.push('/personal/set')
        } else {
          this.$router.push('/personal/set-simple')
        }
      }
    },

    // start 第三方登录方法
    QQLogin(redirectUrl) {
      this.G_SetLogin(false)
      this.clearSession()
      // 存储第三方登录类型
      sessionStorage.setItem('third-type', '1')
      window.QC.Login.showPopup({
        appId: '101571123',
        redirectURI: redirectUrl || this.getRedirectUrl()
      })
    },
    WXLogin(redirectUrl) {
      this.clearSession()
      const appId = 'wx9ce596bd77b83ac3'
      const redirect_url = encodeURI(redirectUrl || this.getRedirectUrl())
      const _url = `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${redirect_url}&response_type=code&scope=snsapi_login&state=wx#wechat_redirect`
      window.open(_url, 'blank')
    },

    WBLogin(redirectUrl) {
      this.clearSession()
      const appKey = '879060799'
      const redirect_url = encodeURI(redirectUrl || this.getRedirectUrl())
      const _url = `https://api.weibo.com/oauth2/authorize?client_id=${appKey}&response_type=code&state=wb&redirect_uri=${redirect_url}`
      window.open(_url, 'blank')
    },

    // 清除标记重复登录sessionStorage
    clearSession() {
      sessionStorage.removeItem('WX_LOGIN')
      sessionStorage.removeItem('WEIBO_LOGIN')
    },

    // 获取回调地址-当前域名
    getRedirectUrl() {
      return window.location.origin
    },
    // end 第三方登录方法

    // 获取默认球队LOGO
    getDefaultTeamLogo(type) {
      switch (type) {
      case 1:
        return defaultImg.football
      case 2:
        return defaultImg.basketball
      default:
        return defaultImg.logo
      }
    }

  }
}