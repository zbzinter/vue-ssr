import {
  G_SetLoading,
  G_SetInit,
  G_SetTip,
  G_SetNav,
  G_SetLogin,
  G_SetUserInfo,
  G_SetMemberInfo,
} from '@vues/store/mutation-types'

export default {
  /*
  ** 登录弹窗
  ** params {} || boolean
    {
      show: boolean  显示或者隐藏弹窗
      type: number  1登录、2注册
    }
  */
  [G_SetLogin](state, params = false) {
    // 传boolean时，直接显示或者隐藏弹窗
    if (typeof params === 'boolean') {
      state.showLoginModal = params
      state.globalLoginOrRegister = 1
    } else {
      state.showLoginModal = params.show
      state.globalLoginOrRegister = params.type
    }
  },
  // 用户信息
  [G_SetUserInfo](state, info = {}) {
    if (info.uid) {
      if (info.mobile) {
        info.hiddenMobile = info.mobile.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
      }
      if (info.certId) {
        info.hiddenCertId = info.certId.replace(/^(\d{4})\d{10}(\d+)/, '$1****$2')
      }
    }
    state.commUserInfo = info
  },
  // 会员信息
  [G_SetMemberInfo](state, info = {}) {
    state.commMemberInfo = info
  },
  // 设置导航 status 1 白底，2黑底
  [G_SetNav](state, status = 1) {
    state.navStatus = status
  },
  [G_SetInit](state) {

    // 页面初始化操作
    let {
      timmer
    } = state.tip

    // 清除loading
    state.loadingNum = 0

    // 清除tip定时器
    state.tip.isShow = false
    clearTimeout(timmer)
  },
  [G_SetLoading](state, status = true) {
    // 设置loading状态
    let {
      loadingNum
    } = state
    loadingNum = status ?
      loadingNum + 1 :
      loadingNum - 1
    state.loadingNum = loadingNum < 0 ?
      0 :
      loadingNum
  },
  [G_SetTip](state, {
    msg,
    timmer
  }) {
    // 页面提示设置
    let {
      timmer: tipTimmer
    } = state.tip
    clearTimeout(tipTimmer)

    if (typeof timmer === 'undefined') {
      let text = '服务器异常，请稍后重试！'
      if (typeof msg === 'string' && msg.trim() !== '') {
        text = msg
      }
      if (typeof msg === 'object' && msg.toString() !== '') {
        text = msg.toString()
      }
      state.tip.isShow = true
      state.tip.msg = text
      state.tip.timmer = timmer
    } else {
      state.tip.isShow = false
    }
  },
  reSecondNavTemp(state, index = 0) {
    state.secondNavTemp = index
  }
}