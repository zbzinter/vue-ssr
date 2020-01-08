<template>
  <div class="video-box">
    <iframe
      v-if="liveType === 1"
      :src="animUrl"
      width="100%"
      height="100%"
      frameborder="0"
      scrolling="no"
    />
    <VideoInner
      v-if="liveType === 2"
      :match-data="matchData"
    />
    <VideoAnchor
      v-if="liveType === 3 && Object.keys(anchorInfo).length > 0"
      :match-data="matchData"
      :anchor-info="anchorInfo"
    />
  </div>
</template>
<script>
import VideoInner from './video-inner'
import VideoAnchor from './video-anchor'
import { autoUrlHttp } from '@utils/utils'
export default {
  components: {
    VideoInner,
    VideoAnchor
  },
  props: {
    matchData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    liveType: {
      type: Number,
      default: 0 // 3是视频
    },
    anchorInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    animUrl() {
      return autoUrlHttp(this.matchData.animUrl)
    }
  },
}
</script>
<style lang="postcss" scoped>
.video-box {
  width: 1090px;
  height: 614px;
  position: relative;
  background: #000;
}
</style>