const analyze = {
  namespaced: true,
  state: {
    queryOddByMatchIds: []
  },
  mutations: {
    addOdd(state, obj) {
      state.queryOddByMatchIds.push(obj)
    },
    resetOdd(state) {
      state.queryOddByMatchIds = []
    }
  }
}

export default analyze