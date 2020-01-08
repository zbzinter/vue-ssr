<template>
  <div>
    <div
      id="dplayer"
      class="video-box"
    />
  </div>
</template>
<script>

import DPlayer from 'dplayer'
import { getQueryString } from '@utils/url'

export default {
  data() {
    return {
      uid: '',
      token: '',
    }
  },
  mounted() {
    this.uid = getQueryString('uid', location.href)
    this.token = getQueryString('token', location.href)
    this.init()
  },
  methods: {
    init() {
      // if (localStorage.getItem('token') && localStorage.getItem('userInfo')) {
      //   new QWebChannel(qt.webChannelTransport, function(channel) {
      //     window.channelObs = channel.objects.obs
      //   })
      // } else {
      //   this.$get('jmfen-sport-usercenter/v1/user/info/' + this.uid, {
      //     apiType: 'gw',
      //     headers: {
      //       'Authorization': 'Bearer ' + this.token
      //     },
      //     body: {
      //       token: this.token
      //     }
      //   }).then((res) => {
      //     const { code, data } = res
      //     if (code === 100200) {
      //       localStorage.setItem('uid', this.uid)
      //       localStorage.setItem('token', this.token)
      //       localStorage.setItem('userInfo', JSON.stringify(data))
      //       window.location.reload()
      //     }
      //   })
      // }
      // new QWebChannel(qt.webChannelTransport, function(channel) {
      //   window.channelObs = channel.objects.obs
      // })

      new DPlayer({
        container: document.getElementById('dplayer'),
        screenshot: true,
        video: {
          url: 'https://static.qiuhui.com/video/291238303t48.mp4'
        }
      })
            
    },

    obsSendMsg() {
      if (window.channelObs) {
        window.channelObs.obsSendMsg('oooooooo')
      } else {
        window.channelObs.obsSendMsg('暂无数据')
      }
    }
  },
}
</script>


<style lang="scss" scoped>

.dplayer-video {
  width: 100px;
  height: 100px;
}
</style>