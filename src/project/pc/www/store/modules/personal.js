
const personal = {
  state: {
    anchorInfo: {},
  },
  getters: {
    getAnchorInfo(state) {
      return state.anchorInfo
    },
  },
  mutations: {
    setAnchorInfo(state, val) {
      state.anchorInfo = val
    },
  },
  actions: {
    // 获取主播列表 以及判断是否是主播
    GainAndJudgeAnchors({ commit }, { uids, vm }) {
      return new Promise((resolve, reject) => {
        vm.$get('/v0.1/anchors', {
          apiType: 'anchor',
          body: {
            uids
          }
        })
          .then(res => {
            const { code, data, msg } = res
            if (vm.$judgeCode(code) && data && data.length) {
              commit('setAnchorInfo', data[0])
              resolve(data)
            } else {
              console.log('无主播信息')
              reject(msg)
            }
          })
      })
    },

    // 修改个人中心个人信息
    EditPersonalInfo({ commit }, { param, vm }) {

      return new Promise((resolve, reject) => {
        vm.$get('jmfen-sport-usercenter/v1/user/personal/' + param.uid, {
          apiType: 'gw',
          body: {
            ...param
          }
        })
          .then(res => {
            if (res.code === 100200) {
              resolve(res)
            } else {
              reject(res.msg)
              vm.$error(res.msg)
            }
          })
      })
    },
  }
}

export default personal