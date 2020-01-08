<!-- 主播 -->
<template>
  <div class="anchor-page">
    <Nav @toggleNavs="toggleNavs" />
    <List :list-data="listData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Nav from './components/nav'
import List from './components/list'
let loadingMoreTimer = null
export default {
  components: {
    Nav,
    List
  },
  data() {
    return {
      // 是否还可以加载更多
      loadingMore: true,
      loading: false,
      // 是否可以滚动
      isScroll: true,
      page: 1,
      size: 20,
      roomTagId: '',
    }
  },
  computed: {
    ...mapGetters({
      listData: 'liveList/listData'
    })
  },
  asyncData ({ store }) {
    return store.dispatch('liveList/getLiveListAndTags')
  },
  mounted() {
    document.addEventListener('scroll', this.scrollMoreData, false)
  },
  destroyed() {
    document.removeEventListener('scroll', this.scrollMoreData, false)
  },
  methods: {
    // 切换tab
    toggleNavs(id) {
      this.page = 1
      this.roomTagId = id || ''
      this.$store.commit('liveList/resetListData')
      this.getListData()
    },
    getListData() {
      const params = {
        page: this.page,
        size: this.size,
        roomTagId: this.roomTagId
      }
      this.$get('v0.2/rooms', {
        apiType: 'anchor',
        body: params,
      }).then(res => {
        const {code, data} = res
        this.loading = false
        if(code === 200 && data) {
          const _map = new Map()
          const _data = data.rows || []
          const allData = [...this.listData, ..._data]
          const newData = allData.filter(arr => !_map.has(arr.uid) && _map.set(arr.uid, 1))
          this.loadingMore = this.page < data.pages
          this.$store.commit('liveList/setListData', newData)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    scrollMoreData() {
      if(this.loading || !this.loadingMore || loadingMoreTimer) return
      const scrollTopHeight = document.documentElement.scrollTop || document.body.scrollTop //滚动高度
      const clientHeight = document.documentElement.clientHeight || window.screen.availHeight //屏幕可用工作区高度
      const offsetHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)

      if ((scrollTopHeight + clientHeight) + 500 >= offsetHeight) {
        if(loadingMoreTimer) return
        loadingMoreTimer = setTimeout(() => {
          this.loading = true
          this.page ++
          this.getListData()
          clearTimeout(loadingMoreTimer)
        }, 300)
      }
    },
  },
}
</script>

<style scoped lang="scss">
.anchor-page{
  overflow: hidden;
  margin: auto;
  width: 1200px;
  background-color: #fff;
  margin-top: 33px;
  h2{
    font-family: PingFangSC-Semibold;
    font-size: 24px;
    color: #333333;
    letter-spacing: 0;
    padding: 40px 16px 0;
    line-height: 33px;
  }
}
</style>
