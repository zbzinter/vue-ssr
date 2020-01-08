<template>
  <div class="live-container">
    <div class="live-top">
      <div class="live-box clearfix">
        <!-- 视频/动画 -->
        <VideoBox
          v-if="matchData"
          :match-data="matchData"
          :live-type="liveType"
        />
      </div>
    </div>
  </div>
</template>
<script>
import VideoBox from './components/video-box'
export default {
  components: {
    VideoBox
  },
  data() {
    return {
      // 比赛基础信息
      matchData: '',
      // 直播类型 1动画、2视频、3主播
      liveType: 1,
      // url参数
      query: {},
      // 是否有视频
      hasVideo: false
    }
  },
  created() {
    this.init()
  },
  destroyed(){
    this.G_SetNav(1)
  },
  methods: {
    init () {
      // 获取matchData初始数据
      this.getParams()
      this.G_SetNav(2)

      // 隐藏导航
      document.querySelector('.header').style.display = 'none'
      document.querySelector('.footer').style.display = 'none'

      // todo
      this.$get('/v5/match/match', {
        id: this.query.id || 1519268
      }).then(res => {
        if (res.data) {
          this.matchData = res.data || {}
          // 是否有视频
          if(this.matchData.liveFlvUrl || this.matchData.liveFlvUrl) {
            this.hasVideo = true
            this.liveType = 2
          }
        }
      })
    },
    switchLiveType(params) {
      this.liveType = params
    },
    // 存储页面参数
    getParams() {
      this.query = this.$route.query || {}
    },
  }
}
</script>
<style lang="postcss" scoped>
</style>