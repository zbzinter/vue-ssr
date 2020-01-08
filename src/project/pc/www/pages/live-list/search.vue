<!-- 主播 -->
<template>
  <div class="anchor-page">
    <SearchNav
      :search-text="searchText"
      :nav-number="navNumber"
      @toggleNav="toggleNav"
      @search="search"
    />
    <!-- 直播间 -->
    <List
      v-if="curId === 1"
      :list-data="listData"
    />
    <!-- 主播 -->
    <AnchorList
      v-else
      :anchor-data="anchorData"
    />
  </div>
</template>

<script>
import SearchNav from './components/search-nav'
import List from './components/list'
import AnchorList from './components/anchor-list'
export default {
  components: {
    SearchNav,
    List,
    AnchorList
  },
  data () {
    return {
      type: 'home',
      searchText: null,
      curId: 1,
      // 房间列表
      listData: [],
      // 主播列表
      anchorData: [],
      // 每个标签的数据 1:直播间，2:主播
      navNumber: {
        1: 0,
        2: 0
      }
    }
  },
  created () {
    if(this.$route.query.key) {
      this.searchText = this.$route.query.key
      this.search(this.searchText)
    }
  },
  methods: {
    search(key) {
      // 搜索直播间
      this.$get('v0.1/rooms/search', {
        apiType: 'anchor',
        body: {
          searchKey: key
        }
      }).then(res => {
        const {code, data = []} = res
        if(code === 200) {
          this.listData = data
          this.navNumber[1] = data.length
        }
      })
      // 搜索主播
      this.$get('v0.1/anchors/search', {
        apiType: 'anchor',
        body: {
          searchKey: key
        }
      }).then(res => {
        const {code, data = []} = res
        if(code === 200) {
          this.anchorData = data
          this.navNumber[2] = data.length
        }
      })

    },
    toggleNav(id) {
      this.curId = id
    }
  }
}
</script>

<style scoped lang="scss">
.no-data {
  font-size: 16px;
  padding: 100px;
  text-align: center;
}
.anchor-page {
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
