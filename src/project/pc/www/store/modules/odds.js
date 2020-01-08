const odds = {
  namespaced: true,
  state: {
    tempOddsData: [],
    tempOddsLogData: [],
    matchData: {}
  },
  getters: {
    filterOddsArr: (state) => ({typeId, matchData}) => { // 过滤出对应的亚、欧、大的值
      let { sportId } = matchData
      let filterOddsArr = []
      let rollTypeId
      switch (typeId) {
      case 1: rollTypeId=121;break
      case 2: rollTypeId=128;break
      case 3: rollTypeId=122;break
      }
      state.tempOddsData.forEach(item => {
        let findItem = Array.isArray(item.coOddsWithMatchList) && item.coOddsWithMatchList.find(val => val.typeId === typeId)
        // if(sportId === 2) { // 滚球ID,篮球有滚球显示滚球，没有就显示即盘的指数

        // }
        let rollFindItem = Array.isArray(item.coOddsWithMatchList) && item.coOddsWithMatchList.find(val => val.typeId === rollTypeId)
        !findItem && rollFindItem && (findItem = {})
        findItem && rollFindItem && (findItem = Object.assign(findItem, {
          valueForType1: rollFindItem.valueForType1,
          valueForType2: rollFindItem.valueForType2,
          valueForTypeX: rollFindItem.valueForTypeX,
          ovalue: rollFindItem.ovalue
        }))
        if (findItem) {
          item.oddObj = Object.assign(findItem, {
            ischeck: false,
            bookId: item.bookId,
            bookName: item.bookName
          })
          filterOddsArr.push(item.oddObj)
        }
      })
      return filterOddsArr
    }
  },
  mutations: {
    setOddsData(state, Arr) {
      state.tempOddsData = [...Arr]
    },
    setOddsLogData(state, Arr) {
      state.tempOddsLogData = [...Arr]
    },
    setMatchData(state, Obj) {
      state.matchData = {...Obj}
    }
  },
  actions: {
    async getOddsApi({ commit, state }, params) { // 获取赔率
      let res = await params.$get('/v5/odds/getOdds', {matchId: params.matchId})
      if (res.data) {
        commit('setOddsData', res.data)
      }
      return res
    },
    async getOddsLogApi({ commit }, {matchId, bookId, typeId, $get}) { // 获取赔率
      let res = await $get('/v5/odds/getOddsLog', {
        matchId,
        bookId,
        typeId
      }).catch(function(error) {
        commit('setOddsLogData', [])
      })
      if (res.data) {
        if(Array.isArray(res.data)){
          res.data = res.data.filter(Boolean)
        } else {
          res.data = []
        }
        commit('setOddsLogData', res.data)
      }
      return res
    },
    async matchDataApi({ commit, state }, {matchId, $get}) { // 获取matchData
      let res = await $get('/v5/match/match', {
        id: matchId
      })
      if (res.data) {
        commit('setMatchData', res.data)
      }
      return res
    }
  }
}

export default odds