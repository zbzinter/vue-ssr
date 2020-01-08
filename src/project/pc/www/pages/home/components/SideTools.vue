<template>
  <div
    class="side-tools"
    :class="{'has-back-top': backTopVisible}"
  >
    <div
      class="tools-item"
      @mouseenter="showQrcode=true"
      @mouseleave="showQrcode=false"
    >
      <img src="../../../assets/home/scan-qrcode.png">
      <div class="word">
        <p>下载</p>
        <p>APP</p>
      </div>
    </div>
    <div
      v-if="!noOPlayer"
      class="tools-item become-anchor"
      @click="wantToShow"
    >
      <img src="../../../assets/home/begin_to_show.png">
      <div class="word">
        <p>我要</p>
        <p>开播</p>
      </div>
    </div>
    <div
      class="tools-item feedback"
      @click="goFeedback"
    >
      <img src="../../../assets/home/feedback.png">
      <div class="word">
        <p>意见</p>
        <p>反馈</p>
      </div>
    </div>
    <div
      v-show="backTopVisible"
      class="tools-item back-top"
      @click="backTop"
    >
      <img src="../../../assets/home/index_icon_top_normal.svg">
      <div class="word">
        <p>回顶部</p>
      </div>
    </div>
    <!-- 鼠标滑过弹出二维码 -->
    <div
      v-show="showQrcode"
      class="qrcode-area"
    >
      <span>扫一扫下载APP</span>
      <img
        class="qrcode"
        src="../../../assets/home/download-qrcode.png"
      >
    </div>
  </div>
</template>

<script>
import { _throttle } from '@utils/common'
import { mapActions } from 'vuex'
export default {
  props: ['noOPlayer', 'immediateTop'],
  data() {
    return {
      showQrcode: false,
      backTopVisible: false,
      scrollFunc: null
    }
  },
  mounted() {
    this.scrollFunc = _throttle(this.handleScroll, 300)
    window.addEventListener('scroll', this.scrollFunc)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scrollFunc)
  },
  methods: {
    ...mapActions([
      'GainAndJudgeAnchors',
    ]),
    goFeedback() {
      this.$router.openNewPage({
        path: '/feedback'
      })
    },
    backTop() {
      if(this.immediateTop) {
        let wrapEle = document.documentElement || document.body
        wrapEle.scrollTop = 0
        return
      }
      let scrollTop =  document.documentElement.scrollTop
      if (scrollTop < 100) {
        document.documentElement.scrollTop = 0
      } else {
        document.documentElement.scrollTop = scrollTop - 100
        requestAnimationFrame(this.backTop)
      }
    },
    handleScroll() {
      const scrollTop = document.documentElement.scrollTop
      this.backTopVisible = scrollTop > 500
    },
    /*
     * 1、未实名认证点击我要开播，先弹出登录，登录后跳转至个人中心，实名认证页面，提示用户先去实名认证，已登录不用弹出登录框
     * 2、已实名认证，但是没有开播，点击我要开播，先弹出登录，登录后跳转至个人中心，“我要开播”页面，已登录不用弹登录框
     * 3、已实名认证，已是主播，点击我要开播，跳转至个人中心“直播设置”页
     */
    async wantToShow() {
      // 有token代表已登录
      let token
      try {
        token = localStorage.getItem('token')
      } catch (error) {
        token=undefined
      }
      //const token = localStorage.getItem('token')
      if (!token) {
        this.G_SetLogin({
          show: true,
          type: 1
        })
        return
      }
      const userInfo = this.getUserInfo()
      // certFlag判断是否实名认证
      if (userInfo.certFlag < 1) {
        this.$tip('您还未实名认证，请先实名认证！')
        setTimeout(() => {
          this.$router.push('/personal/identity')
        }, 1500)
        return
      } else if (userInfo.certFlag === 1) {
        try {
          const anchors = await this.GainAndJudgeAnchors({uids: String(userInfo.uid), vm: this})
          if (anchors.length > 0) {
            this.$router.push('/personal/set')
          }
        } catch (error) {
          this.$router.push('/personal/set-simple')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.side-tools{
  position: fixed;
  right: 0;
  bottom: 150px;
  z-index: 10;
  border-radius: 2px;
  box-shadow: 0 0 12px 0 rgba(0,0,0,0.08);
  .tools-item{
    position: relative;
    width: 48px;
    height: 48px;
    overflow: hidden;
    background: #FFFFFF;
    cursor: pointer;
    &:after{
      content: '';
      position: absolute;
      top: -20px;
      bottom: -20px;
      left: -20px;
      right: -20px;
      width: 0;
      height: 0;
      border-radius: 50%;
      margin: auto;
      background: #3683FF;
      opacity: 0;
      z-index: 1;
      transition: all 0.3s ease;
    }
    .word{
      position: absolute;
      opacity: 0;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 10px 0;
      z-index: 2;
    }
    img{
      width: 48px;
      opacity: 1;
      transition: opacity 0.5s ease;
    }
    &.back-top{
      text-align: center;
      border-radius: 0 0 2px 2px;
      .word{
        padding: 17px 0;
      }
    }
    &:hover{
      .word{
        opacity: 1;
        width: 48px;
        font-size: 12px;
        color: #ffffff;
        text-align: center;
        transition: opacity 0.3s ease;
        p{
          line-height: 14px;
        }
      }
      img{
        opacity: 0;
      }
      &:after{
        width: 68px;
        height: 68px;
        opacity: 1;
      }
    }
  }
  .qrcode-area{
    position: absolute;
    left: -148px;
    top: 0;
    width: 140px;
    height: 166px;
    padding: 20px;
    text-align: center;
    box-sizing: border-box;
    background: #FFFFFF;
    box-shadow: 0 0 12px 0 rgba(0,0,0,0.08);
    border-radius: 2px;
    span{
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #666666;
    }
    img{
      width: 100px;
      height: 100px;
      margin-top: 10px;
      border-radius: 1px;
    }
    &:after{
      content: '';
      position: absolute;
      right: -3px;
      top: 20px;
      width: 8px;
      height: 8px;
      transform: rotate(45deg);
      background: #ffffff;
      box-shadow: 0 0 12px 0 rgba(0,0,0,0.08);
    }
  }
}
.has-back-top{
  bottom: 102px;
}
</style>