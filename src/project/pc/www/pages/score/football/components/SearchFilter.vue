<!-- 搜索过滤 -->
<template>
  <div class="select-border query-team">
    <span
      v-if="!isShowSearch"
      class="tip"
      @click="isShowSearch = !isShowSearch"
    >
      <i class="iconfont iconRectangleCopy3" />
      <span>搜索</span>
    </span>

    <div
      v-else
      class="down"
      @keyup.enter="searchLocation('next')"
    >
      <div class="text-box">
        <input
          id="quer-team-text"
          v-model.trim="queryVal"
          class="w-200"
          name="query-team"
          type="text"
          placeholder="搜索赛事名称或球队名称"
          @keyup="search($event)"
        >
      </div>
      <div class="text-right">
        <i
          v-if="queryVal"
          class="count"
        >{{ searchedIndex+1 }}/{{ searchedNum }}</i> 
        <i
          class="iconfont iconpackup"
          @click="searchLocation('pre')"
        />
        <i
          class="iconfont iconunfold"
          @click="searchLocation('next')"
        /> 
        <i
          class="iconfont iconclose"
          @click="isShowSearch = !isShowSearch"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getPositionTop } from '@utils/utils'
export default {
  props: {
    // 当前页面的数据
    mainList: {
      type: null,
      default: () => {}
    },
    // 通过操作置顶的数据
    topList: {
      type: null,
      default: () => []
    },
  },
  data () {
    return {
      tempQueryVal: '',
      queryVal: '',
      isShowSearch: false,
      searchedList: [],
      searchedNum: null, // 被搜索到的总数量
      searchedIndex: -1, // 被搜索到的当前位置
    }
  },
  watch:{
    ['topList.length'](){
      if(!this.queryVal) return
      this.search()
    }
  },
  beforeDestroy () {
    clearInterval(this.bufferScroll)
  },
  methods: {
    search(e){
      let inputVal = e ? e.target.value.trim() : this.queryVal
      this.searchedList = []
      this.searchedNum = 0
      this.tempQueryVal !== this.queryVal && (this.searchedIndex = -1)
      if(!inputVal.length){
        this.searchedNum = null
      }
      if(Object.prototype.toString.call(this.mainList) === '[object Object]') {
        // for (const [index, item] of Object.entries(this.mainList)) {
        //   this.disposeItem(item, inputVal)
        // }
        let {going, uncoming, finished, unknown} = this.mainList
        this.disposeItem([].concat(this.topList, going, uncoming, finished, unknown), inputVal)
      }
      if(Object.prototype.toString.call(this.mainList) === '[object Array]') {
        this.disposeItem([].concat(this.mainList), inputVal)
      }
      this.tempQueryVal = this.queryVal
    },
    disposeItem(item, inputVal){
      Array.isArray(item) && item.forEach(arrItem =>{
        let rowSearchVal = arrItem.leagueName + arrItem.hostTeamName + arrItem.guestTeamName
        if(arrItem.isSearched) this.$delete(arrItem, 'isSearched')
        if(new RegExp(inputVal, 'g').test(rowSearchVal) && this.searchedNum !== null){ // 被搜索的设置
          this.$set(arrItem, 'isSearched', true)
          this.searchedNum++
          this.searchedList.push(arrItem)
        }
      })
    },
    async searchLocation(type){
      if(type === 'pre') {
        this.searchedIndex <= 0 ? (this.searchedIndex = this.searchedList.length-1) : (this.searchedIndex--)
      } else if(type === 'next') {
        this.searchedIndex >= (this.searchedList.length-1) ? (this.searchedIndex = 0) : (this.searchedIndex++)
      }
      this.searchedList.forEach((item, index) =>{
        if(item.curSearched) this.$delete(item, 'curSearched')
        if(index === this.searchedIndex) {
          this.$set(item, 'curSearched', true)
        }
      })
      await this.$nextTick(()=>{})
      this.locateTo()
    },
    locateTo(){
      let scrollToTarget = getPositionTop(document.getElementById('cur-searched')) - 104 // 模块距离顶部的距离
      let curScrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let time = 50
      let down = scrollToTarget > curScrollTop
      let up = scrollToTarget < curScrollTop
      clearInterval(this.bufferScroll)
      this.bufferScroll = setInterval(()=>{ // 滚动缓冲
        let speed = (scrollToTarget-curScrollTop)/2
        speed = down ? Math.ceil(speed) : up ? Math.floor(speed) : speed
        if(!speed){
          clearInterval(this.bufferScroll)
        }else{
          curScrollTop = document.documentElement.scrollTop = document.body.scrollTop = (curScrollTop + speed)          
        }
      }, time)
    }
  }
}
</script>

<style scoped lang="scss">
.query-team{
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.09);
  height: 44px;
  line-height: 44px;
  .tip{
      display: inline-block;
      padding-left: 5px;
      width: 60px;
      cursor: pointer;
      transition: color .4s;
      .iconRectangleCopy3:before{
          color: #999
        }
      &:hover{
        color: #000;
        .iconRectangleCopy3:before{
          color: #000
        }
      }
  }
  .down{
    .text-box, .text-right{
      display: inline-block;
      line-height: 44px;
      height: 44px;
      &.text-box{
        vertical-align: top;
        input{
          vertical-align: baseline;
          margin-right: 36px;
          padding-left: 8px;
          border-radius: 4px 0 0 4px;
        }
      }
      &.text-right{
        position: relative;
        padding: 0 6px;
        .count{
          position: absolute;
          right: 100%;
          padding: 0 6px;
          color: #999;
          font-style: normal;
          font-size: 14px;
          white-space: nowrap;
        }
        &::before{
          content: ' ';
          position: absolute;
          left: 0;
          top: 8px;
          bottom: 8px;
          border-left: 1px solid #ececec;
        }
        .iconfont{
          display: inline-block;
          cursor: pointer;
          &:hover{
            color: $blue;
          }
          &::before{
            font-size: 20px;
          }
          &.iconclose{
            position: relative;
            top: -1px;
            &::before{
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
