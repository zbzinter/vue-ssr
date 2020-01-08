

const income = {
  state: {
    balance: '',
    isBind: 0
  },
  getters: {
    getBalance(state) {
      return state.balance
    },
    getIsBind(state) {
      return state.isBind
    },
  },
  mutations: {
    setBalance(state, val) {
      state.balance = val
    },
    setIsBind(state, val) {
      state.isBind = val
    },
  },
  actions: {

    // 获取余额
    GetBalance({ commit }, { id, vm }) {
      return new Promise((resolve, reject) => {
        vm.$get('/v2/anchors/commissions/' + id, {
          apiType: 'goShop',
        })
          .then(res => {
            const { code, data, msg } = res
            if (vm.$judgeCode(code)) {
              commit('setBalance', res.data.current_commission)
              resolve(data)
            } else {
              reject(msg)
            }
          }).catch((e) => {
            reject(e)
          })
      })
    },

    // 获取银行卡号  是否绑定
    GetBankInfo({ commit }, { id, vm }) {

      return new Promise((resolve, reject) => {
        vm.$get('v2/members/banks/info/' + id, {
          apiType: 'goShop',
          body: {
            user_id: id
          }
        })
          .then(res => {
            const { code, data, msg, timemap } = res
            if (vm.$judgeCode(code) && data) {
              data.isBind = data.bank_account ? '1' : '0'
              data.timemap = timemap
              commit('setIsBind', data.isBind)
              resolve(data)
            } else {
              commit('setIsBind', '0')
              reject(msg)
            }
          }).catch((e) => {
            commit('setIsBind', '0')
            reject(e)
          })
      })
    },
  }
}

export default income