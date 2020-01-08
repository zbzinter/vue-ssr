
const database = {
  state: {
    ballType: 'NBA',
    homeAndTeam: 'home',
    areaData: [],
    currentSeasonId: '',
    leagueId: 0,
    leagueCupType: 0,
    seasonId: 0,
  },
  getters: {
    ballType(state) {
      return state.ballType
    },

    homeAndTeam(state) {
      return state.homeAndTeam
    },

    areaData(state) {
      return state.areaData || []
    },

    currentSeasonId(state) {
      return state.currentSeasonId
    },

    leagueId(state) {
      return state.leagueId
    },

    leagueCupType(state) {
      return state.leagueCupType
    },

    seasonId(state) {
      return state.seasonId
    }

  },
  mutations: {
    setBallType(state, val) {
      state.ballType = val
    },
    setHomeAndTeam(state, val) {
      state.homeAndTeam = val
    },
    setAreaData(state, val) {
      state.areaData = val
    },
    setCurrentSeasonId(state, val) {
      state.currentSeasonId = val
    },
    setLeagueId(state, val) {
      state.leagueId = val
    },
    setLeagueCupType(state, val) {
      state.leagueCupType = val
    },

    setSeasonId(state, val) {
      state.seasonId = val
    }
  },
  actions: {
    GetCurrentId({ commit }, { val, vm }) {
      return new Promise((resolve, reject) => {
        vm.$get('v9/basketball/season/current', { leagueName: val }).then(res => {
          const { code, data: { seasonId }, msg } = res
          if (vm.$judgeCode(code)) {
            commit('setCurrentSeasonId', seasonId)
            localStorage.setItem('seasonId', seasonId)
            resolve(seasonId)
          } else {
            vm.$error(msg)
          }
        }).catch((e) => {
          reject(e)
        })

      })
    }
  }

}

export default database