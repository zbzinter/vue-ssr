import Http from '@utils/Http'
const http = new Http()

import { getServerConf } from '@config/apiConf'
const bannerUrl = getServerConf().apiInfo.java
const newsUrl = getServerConf().apiInfo.newsUrl
export default {
  namespaced: true,
  state: {
    recommendation: [],
    banner: [],
    photos: [],
    god: [],
    matchData: [],
    bannerHandle: [],
    recomNewsList: [],
    feedbackTypeList: [],
  },
  mutations: {
    setFeedbackTypeList(state, val) {
      state.feedbackTypeList = val
    }
  },
  actions: {
    getHomeDate({ state }) {
      let res = http.$get(bannerUrl + '/v1/web/recom/list', {
        headers: {
          'Authorization': '',
        }
      })
      let matchesRes = http.$get(bannerUrl + '/v1/app/recom/list', {
        headers: {
          'Authorization': '',
        }
      })
      // 体坛快讯
      let url = `&pageSize=30&currentPage=1&isWeb=1&articleType=`
      let sportNewsRes= http.$get(newsUrl + `/information/v1/187/?${url}` )
      return new Promise(resolve => {
        Promise.all([res, matchesRes,sportNewsRes]).then(values => {
          state.matchData = values[1].data.match || []
          const { code, data } = values[0]
          if (code === 200) {
            let list = data.banner
            let array=data.featured
            let newArray=[]
            newArray[0]=array.slice(0,1)
            newArray[1]=array.slice(1,3)
            newArray[2]=array.slice(3,5)
            newArray[3]=array.slice(5,10)
            state.recommendation =newArray
            //老接口兼容新接口  老接口中ceefaxId等效于新接口中 articleId
            if (list && list.length) {
              list.filter((item) => {
                item.articleId = item.ceefaxId
              })
              state.banner = list
            }
            if (data.anchor && data.anchor.length > 6) {
              state.photos = data.anchor.slice(0, 6)
            } else {
              state.photos = data.anchor
            }
            // 热门直播
            state.god = data.god ? data.god.slice(0, 8) : []
          }
          if( values[2].code===200|| values[2].code===100200){

            let array=values[2].data.records
            array.sort(function(a,b){
              return b.articleViewCount-a.articleViewCount
            })
            let newArray=[]
            newArray[0]=array.slice(0,1)
            newArray[1]=array.slice(1,5)
            newArray[2]=array.slice(5,8)
            state.recomNewsList=newArray

          }
          resolve(values)
        })
      })
    },
    getFeedbackType({ commit }) {
      return new Promise(resolve => {
        http.$get(bannerUrl + '/feedback/catalog/v1/list', {
          headers: {
            'Authorization': '',
          }
        }).then(res => {
          const { records = [] } = res.data
          commit('setFeedbackTypeList', records)
          resolve(res)
        })
      })
    }
  },
  getters: {
    recommendation(state) {
      return state.recommendation
    },
    banner(state) {
      return state.banner
    },

    photos(state) {
      return state.photos
    },
    god(state) {
      return state.god
    },
    matchData(state) {
      return state.matchData
    },
    recomNewsList(state) {
      return state.recomNewsList
    },
    displayFeedbackType(state) {
      return state.feedbackTypeList.filter(item => item.display === 1)
    },
  }
}