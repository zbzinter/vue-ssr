<!-- 主播页导航 -->
<template>
  <div class="navs">
    <ul>
      <li
        v-for="(item, index) in navs"
        :key="index"
        :class="['nav', {'active': currId === item.id}]"
        @click="goNav(item.id)"
      >
        <span class="text">{{ item.name }}</span>
        <span class="value">(<i>{{ navNumber[item.id] }}</i>)</span>
      </li>
    </ul>
    <div class="search">
      <div
        v-if="searchContent"
        class="text"
      >
        搜索关于“<i>{{ searchContent }}</i>”相关
      </div>
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
export default {
  props: {
    searchText: {
      type: String,
      default: ''
    },
    navNumber: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data () {
    return {
      currId: 1,
      isFocus: false,
      searchContent: '',
      defaultText: '搜索',
      navs: [
        {
          id: 1,
          name: '直播间'
        },
        {
          id: 2,
          name: '主播'
        },
      ]
    }
  },
  created () {
    this.searchContent = this.searchText
  },
  methods: {
    goNav (id) {
      if(this.currId === id) return
      this.currId = id
      this.$emit('toggleNav', id)
    },
    sureSearch() {
      if(!this.isFocus) return
      this.$emit('search', this.searchContent)
    },
    blurInput() {
      this.isFocus = false
    },
    focusInput() {
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
    font-size: 16px;
    color: #333333;
    letter-spacing: 0;
    position: relative;
    &:nth-of-type(1){
      margin-left: 39px;
    }
    &.active span.text{
      position: relative;
      font-size: 16px;
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
        color: #999;
        letter-spacing: 0;
        margin-right: 20px;
        i{
          color: #3683FF;
        }
      }
      &.input {
        position: relative;
        input {
          width: 160px;
          background: #FAFAFA;
          border: 1px solid #F1F1F1;
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
