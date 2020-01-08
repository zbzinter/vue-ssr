import Http from '@utils/Http'
const http = new Http()

// 直播列表
const liveList = {
  namespaced: true,
  state: {
    // 直播标签分类
    liveListTags: [],
    // 列表数据
    listData: []
  },
  getters: {
    liveListTags(state) {
      return state.liveListTags
    },
    listData(state) {
      return state.listData
    },
  },
  mutations: {
    setListData(state, val) {
      state.listData = val
    },
    resetListData(state) {
      state.listData = []
    }
  },
  actions: {
    getLiveListAndTags({ state }) {
      const defaultNav = [{
        tag_id: 0,
        name: '全部',
      }]
      const getTags = http.$get('v0.1/roomtags', {
        apiType: 'anchor',
        body: {},
      })
      const getRooms = http.$get('v0.2/rooms', {
        apiType: 'anchor',
        body: {
          roomTagId: '',
          page: 1,
          size: 20
        },
      })
      return new Promise(resolve => {
        Promise.all([getTags, getRooms]).then(values => {
          // tags
          const tagRes = values[0]
          if(tagRes.code === 200 && tagRes.data) {
            const _nav = tagRes.data.filter(item => item.display === 1)
            const navs = [...defaultNav, ..._nav]
            state.liveListTags = navs
          }
          // rooms
          const roomRes = values[1]
          if(roomRes.code === 200 && roomRes.data) {
            state.listData = roomRes.data.rows
          }
          resolve(values)
        })
      })
    }
  }
}

export default liveList