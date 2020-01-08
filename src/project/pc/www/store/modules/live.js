
const live = {
  state: {
    // 聊天室tab
    chatBoxTab: 1,
    // 聊天消息
    liveChatMsg: [],
    // 弹幕消息
    barrageMsg: [],
    // 大礼物堆栈
    bigGifts: [],
    // 小礼物堆栈
    smallGifts: [],
    // 通告礼物堆栈
    noticeGifts: [],
    // 篮球文字直播模块-显示与隐藏
    showTextLiveBasket: true,
  },
  getters: {
    chatBoxTab(state) {
      return state.chatBoxTab
    },
    liveChatMsg(state) {
      return state.liveChatMsg
    },
    barrageMsg(state) {
      return state.barrageMsg
    },
    bigGifts(state) {
      return state.bigGifts
    },
    smallGifts(state) {
      return state.smallGifts
    },
    noticeGifts(state) {
      return state.noticeGifts
    },
    showTextLiveBasket(state) {
      return state.showTextLiveBasket
    },
  },
  mutations: {
    // 聊天室tab
    setChatBoxTab(state, val) {
      state.chatBoxTab = val
    },
    // 聊天消息
    setLiveChatMsg(state, val) {
      state.liveChatMsg.push(val)
    },
    //聊天消息固定默认条数
    setLiveChatMstShift(state,val){
      state.liveChatMsg.splice(0,val)
    },
    // 弹幕消息
    addBarrageMsg(state, val) {
      state.barrageMsg.push(val)
    },
    delBarrageMsg(state) {
      state.barrageMsg.pop()
    },
    // 大礼物
    addBigGifts(state, val) {
      state.bigGifts.push(val)
    },
    delBigGifts(state) {
      state.bigGifts.pop()
    },
    // 小礼物
    addSmallGifts(state, val) {
      state.smallGifts.push(val)
    },
    delSmallGifts(state) {
      state.smallGifts.pop()
    },
    // 通告礼物
    addNoticeGifts(state, val) {
      state.noticeGifts.push(val)
    },
    delNoticeGifts(state) {
      state.noticeGifts.pop()
    },
    // 显示与隐藏篮球文字直播
    toggleTextLiveBasket(state, val) {
      state.showTextLiveBasket = val
    },

  },
  actions: {
  }

}

export default live