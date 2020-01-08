import Http from '@utils/Http'
const http = new Http()
import { getServerConf } from '@config/apiConf'

let newsUrl = getServerConf().apiInfo.newsUrl
export default {
  namespaced: true,
  state: {
    tabList: [],
    List: [],
    newsLists: [],
    total: 0,
    newsDetail: {},
    newsDetailTitle: '球会体育',
    articleContent: '球会体育',
    recommendNewsList: [],
    articleList: [],
    stats: [],
    fetchStatus: 2,
  },
  mutations: {

  },
  actions: {

    getNewsData({ state }, obj) {
      //服务器渲染调用
      if(!process.browser||obj.client){
        const tabsRes = http.$get(newsUrl + '/information/v1/table')
        const newsListRes = http.$get(newsUrl + `/information/v1/${obj.channelId}?&pageSize=10&currentPage=1&isWeb=1&articleType=${obj.articleType}`)
        const recomendNewsRes = http.$get(newsUrl + '/information/v1/sportExpress')
        const teamRankRes = http.$get('v4/league/teamRank?seasonId=88')
        return new Promise(resolve => {
          Promise.all([tabsRes, newsListRes, recomendNewsRes, teamRankRes]).then(values => {
            const { code, data } = values[0]
            if (code === 200) {
              let array = []
              const matchName = '赛事'
              const name = '视频'
              data[0].subChannels.forEach(item => {
                if ((item.name !== name) && (item.channelTitle !== matchName)) {
                  array.push(item)
                }
              })
              const newArray=[array.slice(0,12),array.slice(12,array.length)]
              state.tabList = newArray
              state.List = array
            }

            if (values[1].code === 200 || values[1].code === 100200) {
              state.newsLists = values[1].data.records
              state.total = values[1].data.total
            }
            if (values[2].code === 200 || values[2].code === 100200) {
              let data = values[2].data
              if (data && data.length > 4) {
                state.recommendNewsList = data.slice(0, 4)
                state.articleList = data.slice(4)
              } else if (data) {
                state.recommendNewsList = data
              }

            }

            if (values[3].code === 200) {

              let array = values[3].data[0].stat
              array = array.filter((item, index) => index < 10)
              state.stats = array
              if (array.length > 0) {
                state.fetchStatus = 1
              } else {
                state.fetchStatus = 2
              }
            } else {
              state.fetchStatus = 2
            }

            resolve(values)
          })
        })
      }else{
        state.newsLists = []
        state.total = 0
        const newsListRes = http.$get(newsUrl + `/information/v1/${obj.channelId}?&pageSize=10&currentPage=${obj.currentPage}&isWeb=1&articleType=${obj.articleType}`)
        return new Promise(resolve => {
          Promise.all([newsListRes]).then(values => {
            const { code, data } = values[0]
            if (code === 200) {
              state.newsLists = data.records
              state.total = data.total
            }
            resolve(values)
          })

        })
      }

    },

    getNewsDetail({ state }, obj) {
      if(!process.browser||obj.client){
        const res = http.$get(newsUrl + `/article/v1/detail/${obj.channelId}/${obj.articleId}`)
        const recomendNewsRes = http.$get(newsUrl + `/information/v1/recommend?channelId=${obj.channelId}&articleId=${obj.articleId}&limit=10`)
        return new Promise(resolve => {
          Promise.all([res, recomendNewsRes]).then(values => {
            const {code, data} = values[0]
            if (code === 200 || code === 100200) {
              if (!data.mediaPath) {
                let str = data.articleContent
                let newContent = str ? str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
                  //capture,返回每个匹配的字符串
                  let newStr = `<img data-src="${capture}" />`
                  return newStr
                }) : ''
                let strNew = newContent.replace(/\s?(class|style)=('|").*?('|")/igm, '')
                state.articleContent = strNew
                state.newsDetail = data
              } else {
                state.newsDetail = data
              }
            }
            if (values[1].code === 200 || values[1].code === 100200) {
              let data = values[1].data
              if (data && data.length > 4) {
                state.recommendNewsList = data.slice(0, 4)
                state.articleList = data.slice(4)
              } else if (data) {
                state.recommendNewsList = data
              }
            }
            resolve(values)
          })

        })
      }else{
        const res = http.$get(newsUrl + `/article/v1/detail/${obj.channelId}/${obj.articleId}`)
        return new Promise(resolve => {
          Promise.all([res]).then(values => {
            const {code, data} = values[0]
            if (code === 200 || code === 100200) {
              if (!data.mediaPath) {
                let str = data.articleContent
                let newContent = str ? str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, (match, capture) => {
                  //capture,返回每个匹配的字符串
                  let newStr = `<img data-src="${capture}" />`
                  return newStr
                }) : ''
                let strNew = newContent.replace(/\s?(class|style)=('|").*?('|")/igm, '')
                state.articleContent = strNew
                state.newsDetail = data
              } else {
                state.newsDetail = data
              }
            }
            resolve(values)
          })

        })
      }
    },

  },
  getters: {
    tabList(state) {
      return state.tabList
    },
    List(state){
      return state.List
    },
    newsLists(state) {
      return state.newsLists
    },
    newsDetail(state) {
      return state.newsDetail
    },
    newsDetailTitle(state) {
      return state.newsDetailTitle
    },
    articleContent(state){
      return state.articleContent
    },
    recommendNewsList(state) {
      return state.recommendNewsList
    },
    articleList(state) {
      return state.articleList
    },
    total(state) {
      return state.total
    },
    stats(state) {
      return state.stats
    },
    fetchStatus(state) {
      return state.fetchStatus
    },

  }
}