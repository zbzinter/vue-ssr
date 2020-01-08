<!-- 主播页导航 -->
<template>
  <div class="navs">
    <ul>
      <li
        v-for="(item, index) in liveListTags"
        :key="index"
        :class="['nav', {'active': currNav === item.tag_id}]"
        @click="goNav(item.tag_id)"
      >
        <span class="text">{{ item.name }}</span>
      </li>
    </ul>
    <div class="search">
      <div class="input">
        <i
          class="iconah_df iconfont"
          @click="sureSearch"
        />
        <input
          v-model="searchContent"
          class="iconfont"
          type="text"
          :placeholder="defaultText"
          @blur="blurInput"
          @focus="focusInput"
          @keyup.enter="sureSearch"
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      currNav: 0,
      isFocus: false,
      searchContent: '',
      defaultText: '搜索',
      navs: [
        {
          tag_id: 0,
          name: '全部',
        },
      ]
    }
  },
  computed: {
    ...mapGetters({
      liveListTags: 'liveList/liveListTags'
    })
  },
  created () {
    this.init()
  },
  methods: {
    init() {
      this.$get('v0.1/roomtags', {
        apiType: 'anchor',
        body: {},
      }).then(res => {
        const {code, data = []} = res
        if(code === 200 && data.length) {
          const _nav = data.filter(item => item.display === 1)
          this.navs = [...this.navs, ..._nav]
        }
      })
    },
    goNav (id) {
      if(this.currNav === id) return
      this.currNav = id
      this.$emit('toggleNavs', id)
    },
    sureSearch() {
      if(!this.isFocus) return
      const routeData = this.$router.resolve({
        path: '/live-list/search',
        query: {
          key: this.searchContent
        }
      })
      window.open(routeData.href, '_blank')
    },
    blurInput () {
      this.isFocus = false
    },
    focusInput () {
      this.isFocus = true
    }
  }
}
</script>

<style scoped lang="scss">
$blue:#3683FF;
$height: 50px;
i{
  font-style: normal
}
.navs{
  height: $height;
  border-bottom: 1px solid #EAEAEA;
  li{
    float: left;
    margin-right: 32px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
    position: relative;
    &:nth-of-type(1){
      margin-left: 39px;
    }
    &.active span.text{
      position: relative;
      font-size: 18px;
      color: $blue;
      font-weight: bold;
      cursor: default;
      &:after{
        position: absolute;
        content: '';
        height: 4px;
        background: $blue;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
    span{
      display: inline-block;
      vertical-align: middle;
      height: $height;
      line-height: $height;
      &.text{
        font-family: PingFangSC-Medium;
        cursor: pointer;
      }
      &.value{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        margin-left: 4px;
        margin-right: 4px;
      }
    }
  }
  .search{
    height: $height;
    line-height: $height;
    float: right;
    margin-right: 16px;
    .text, .input{
      float: left;
      &.text{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        margin-right: 20px;
        i{
          color: #F5AA58;
        }
      }
      &.input {
        position: relative;
        input {
          width: 160px;
          background: #FAFAFA;
          border-radius: 20px;
          height: 34px;
          line-height: 34px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #999999;
          padding: 0 40px 0 14px;
        }
        i {
          position: absolute;
          right: 14px;
          color: #999;
        }
      }      
    }


  }
}
</style>
