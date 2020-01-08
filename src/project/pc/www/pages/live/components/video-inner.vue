<template>
  <div class="video-wrap">
    <div
      id="player"
      class="video-inner"
    />
    <!-- 未开始 -->
    <NotStarted v-if="isNotStarted" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import NotStarted from './not-started'
import 'dplayer/dist/DPlayer.min.css'
let DPlayer = null
export default {
  components: {
    NotStarted
  },
  props: {
    matchData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    newMessage: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      // url参数
      query: {},
      // 是否未开播，暂停等，显示推荐主播
      isNotStarted: false,
      // 视频配置
      videoPlayer: null,
      videoOptions: {
        container: null,
        autoplay: true,
        live: true,
        theme: '#FADFA3',
        loop: false,
        lang: 'zh-cn',
        screenshot: true,
        hotkey: true,
        preload: 'auto',
        volume: 0.7,
        mutex: true,
        video: {
          quality: [],
          defaultQuality: 0
        },
        danmaku: true,
        apiBackend: {
          read: function (endpoint) {
            // 设置加载完成
            endpoint.success()
            // callback()
          },
          send: function () {
            // 如果需要手动发送旦暮，在这里
            // callback()
          }
        },
        contextmenu: [],
      }
    }
  },
  computed: {
    ...mapGetters(['barrageMsg'])
  },
  watch: {
    barrageMsg: {
      handler (list) {
        this.pushMessage(list)
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getParams()
      this.loadingJs()
      // 组装视频源
      if(this.matchData.liveFlvUrl) {
        // const _url = this.matchData.liveFlvUrl
        const _url = this.matchData.liveFlvUrl.slice(this.matchData.liveFlvUrl.indexOf('//'))
        this.videoOptions.video.quality.push({
          url: _url,
          name: '高清',
          type: 'auto'
        })
      }
      // 超清
      if(this.matchData.liveM3u8Url) {
        // const _url = this.matchData.liveM3u8Url
        const _url = this.matchData.liveM3u8Url.slice(this.matchData.liveM3u8Url.indexOf('//'))
        this.videoOptions.video.quality.push({
          url: _url,
          name: '超清',
          type: 'auto'
        })
      }
      // 播放元素
      this.videoOptions.container = document.getElementById('player')
      this.videoPlayer = new DPlayer(this.videoOptions)
      this.videoPlayer.play()

      setTimeout(() => {
        this.$nextTick(() => {
          this.videoError()
        })
      })
      
    },
    loadingJs() {
      DPlayer = require('dplayer')
    },
    videoError() {
      // 视频地址错误
      this.videoPlayer.on('emptied', () => {
        this.isNotStarted = true
      })
      // 开始播放
      this.videoPlayer.on('play', () => {
        this.isNotStarted = false
      })
      // 加载错误
      this.videoPlayer.on('error', () => {
        this.isNotStarted = true
      })
      // 播放完毕
      this.videoPlayer.on('ended', () => {
        this.isNotStarted = true
      })
    },
    // 存储页面参数
    getParams() {
      this.query = this.$route.query || {}
    },
    // push消息
    pushMessage(msgList) {
      const lastMsg = msgList.slice(-1)[0]
      const hiddenType = lastMsg.msgType !== 1 && lastMsg.msgType !== 2 && lastMsg.msgType !== '0'
      if(!lastMsg || !lastMsg.msgType || hiddenType) return
      const danmaku = {
        text: lastMsg.content,
        color: '#fff',
        type: 'right'
      }
      this.videoPlayer.danmaku.draw(danmaku)
    }
  }
}
</script>
<style lang="postcss" scoped>
.video-wrap {
  height: 100%;
}
.video-inner {
  width: 100%;
  height: 100%;
  /* 隐藏右键功能 */
  >>>.dplayer-menu {
    display: none !important;
  }
  >>>.dplayer-comment {
    display: none !important;
  }
}
</style>