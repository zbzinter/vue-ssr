export default {
  loadingNum: 0,
  // 导航状态，1 白底，2 黑底
  navStatus: 1,
  secondNavTemp: 0,
  // 显示登录框
  showLoginModal: false,
  // 全局登录框中定位到注册还是登录 1登录，2注册
  globalLoginOrRegister: 1,
  tip: {
    timmer: null,
    isShow: false,
    msg: ''
  },
  // 用户基本信息
  commUserInfo: {},
  // 会员信息
  commMemberInfo: {},
  noHeader: true
}
