<!-- 右侧固定的滚动栏 -->
<template>
  <ul :class="['right-sidebar']">
    <li
      v-for="(nav, id) in rightNavs"
      :key="id"
      :class="['nav', {'active': navSideActiveId === id}]"
      @click="locateTo(id)"
    >
      {{ nav }}
    </li>
  </ul>
</template>

<script>
import { getPositionTop } from '@utils/utils'
export default {
  props: [
    'rightNavs'
  ],
  data () {
    return {
      isClickScroll: false,
      scrollTimer: null,
      bufferScroll: null,
      navSideActiveId: null
    }
  },
  created () {
    this.navSideActiveId = Object.keys(this.rightNavs)[0]
  },
  mounted () {
    window.addEventListener('scroll', this.scrollHandler)
  },
  beforeDestroy () {
    clearInterval(this.bufferScroll)
    clearTimeout(this.scrollTimer)
    window.removeEventListener('scroll', this.scrollHandler)
  },
  methods: {
    scrollHandler () {
      if(this.scrollTimer){
        clearTimeout(this.scrollTimer)
      }
      if (this.isClickScroll) return
      this.scrollTimer = setTimeout(()=>{ // 防抖
        let curScrollTop = document.documentElement.scrollTop || document.body.scrollTop
        let scrollNumArr = []
        let $index = -1
        for (const [key, item, ind] of Object.entries(this.rightNavs)) {
          $index ++
          if(!document.getElementById(key)) continue
          scrollNumArr[$index] = getPositionTop(document.getElementById(key)) - 62
        }
        let findIndex = scrollNumArr.findIndex((item, index) => (curScrollTop > item && curScrollTop<scrollNumArr[index+1]) || curScrollTop === item)
        if (curScrollTop>scrollNumArr[scrollNumArr.length-1]) findIndex = scrollNumArr.length-1
        this.navSideActiveId = Object.keys(this.rightNavs)[Math.max(findIndex, 0)]
      }, 200)
    },
    locateTo (id) {
      this.isClickScroll = true
      if (this.navSideActiveId === id) return
      this.navSideActiveId = id
      let $ele = document.getElementById(id)
      let scrollToTarget = getPositionTop($ele) - 62 // 模块距离顶部的距离
      let curScrollTop = document.documentElement.scrollTop || document.body.scrollTop
      let time = 20
      let down = scrollToTarget > curScrollTop
      let up = scrollToTarget < curScrollTop
      clearInterval(this.bufferScroll)
      this.bufferScroll = setInterval(()=>{ // 滚动缓冲
        let speed = (scrollToTarget-curScrollTop)/2
        speed = down ? Math.ceil(speed) : up ? Math.floor(speed) : speed
        if(!speed){
          this.isClickScroll = false
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
    .right-sidebar{
      position: fixed;
      left: 50%;
      margin-left: 640px;
      top: 404px;
      background: #FFFFFF;
      box-shadow: 0 0 8px 0 rgba(185,185,185,0.33);
      border-radius: 4px;
      padding: 28px 0;
      z-index: 999;
      li{
        white-space: nowrap;
        padding: 10px 36px 10px 37px;
        cursor: pointer;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        &:not(:last-child){
          margin-bottom: 15px;
        }
        &.active{
          color: #3683FF;
          cursor: default;
          background: #EDF4FF;
        }
      }
    }
</style>
