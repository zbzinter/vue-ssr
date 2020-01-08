import Http from '@utils/Http'
const http = new Http()

const anchor = {
  state: {
  },
  getters: {

  },
  mutations: {
  },
  actions: {
    // 比赛分类
    GetCompetitionClassify({ commit }, { sportId, vm }) {
      return new Promise((resolve, reject) => {
        vm.$get('/v9/sport/ndays/leagues', { sportId })
          .then(res => {
            const { code, data: { leagues }, msg } = res
            if (vm.$judgeCode(code)) {
              leagues.map(item => {
                item.isSelect = false
              })
              resolve(leagues)
            } else {
              reject(msg)
            }
          })
      })
    },

    // 比赛分类
    GetCompetitionList({ commit }, { days, startDate, leagueId, sportId, vm }) {
      return new Promise((resolve, reject) => {
        let param = {}
        if (leagueId) {
          param = { leagueId, sportId }
        } else {
          param = { sportId }
        }
        if (startDate) {
          param.startDate = startDate
        }
        if (days) {
          param.days = 1
        }
        vm.$get('/v9/league/ndays/matches', { ...param, limit: 1000 })
          .then(res => {
            const { code, data: { matches }, msg } = res
            if (vm.$judgeCode(code)) {
              matches.map(item => {
                item.isSelect = false
              })
              resolve(matches)
            } else {
              reject([])
              vm.$error(msg)
            }
          })
      })
    },

    GetAnchorInfo({ commit }, { uid, token }) {
      return new Promise((resolve, reject) => {
        http.$get('jmfen-sport-usercenter/v1/user/info/' + uid, {
          apiType: 'gw',
          body: {
            token: token
          }
        }).then((res) => {
          const { code, data, msg } = res
          if (code === 100200) {
            resolve(data)
          } else {
            reject(msg)
          }
        })
      })
    },


    GetAnchorSetInfo({ commit, dispatch }, { uids, vm }) {
      return new Promise(async (resolve, reject) => {
        const result = await dispatch('GainAndJudgeAnchors', { uids, vm }, { root: true })
        const roomId = result[0].room_id || ''
        if (!roomId) {
          reject()
          vm.$error('未获取roomId')
          return
        }
        http.$get('v0.1/room/detail', {
          apiType: 'anchor',
          body: {
            roomId
          }
        }).then((res) => {
          const { code, data, msg } = res
          if (vm.$judgeCode(code) && data) {
            resolve(data)
          } else {
            reject(msg)
            vm.$error('获取房间信息有误')
          }
        })

      })
    },

    GetApplyAnchorInfo({ commit }, { uid, vm }) {
      return new Promise(async (resolve, reject) => {
        http.$get('v2.2/anchorApplys', {
          apiType: 'anchor',
          body: {
            uid
          }
        }).then((res) => {
          const { code, data, msg } = res
          if (vm.$judgeCode(code) && data) {
            resolve(data)
          } else {
            reject(msg)
            vm.$error('获取用户申请主播的接口有误')
          }
        })

      })
    },
  }
}

export default anchor