<template>
  <div class="warn">
    &nbsp;
  </div>
</template>
<script>

import MqttBase from '@utils/MqttBase'
import { getQueryString } from '@utils/url'

let _self
export default {
  data() {
    return {
      uid: '',
      token: '',
      topic: ['100405', '100408', '100409'],
      mqtt: null
    }
  },
  mounted() {
    _self = this

    window.obsLogin = function (uid, token) {
      if(token) {
        localStorage.setItem('token', token)
      }
    }
    window.obsSendMsg = function () {
      return 1
    }

    window.onRecvNoticeMsg = function (val) {
      return val || 2
    }

    this.uid = getQueryString('uid', location.href)
    this.token = getQueryString('token', location.href)
    
    this.init()
  },
  destroyed(){
    if (this.mqtt) {
      this.mqtt.unsubscribe(this.topic)
    }
  },
  methods: {
    init() {
      if (localStorage.getItem('token') && localStorage.getItem('userInfo')) {
        new QWebChannel(qt.webChannelTransport, function(channel) {
          window.channelObs = channel.objects.obs
          _self.setMqtt()
        })
      } else {
        this.$get('jmfen-sport-usercenter/v1/user/info/' + this.uid, {
          apiType: 'gw',
          headers: {
            'Authorization': 'Bearer ' + this.token
          },
          body: {
            token: this.token
          }
        }).then((res) => {
          const { code, data } = res
          if (code === 100200) {
            localStorage.setItem('uid', this.uid)
            localStorage.setItem('token', this.token)
            localStorage.setItem('userInfo', JSON.stringify(data))
            window.location.reload()
          }
        })
      }
      
      // 通知obs可以调我们的全局方法
      window.channelObs.onObsWebInitFinish('ok')
    },

    setMqtt() {
      this.mqtt = null
      this.mqtt = new MqttBase(this.getMessage)
      this.mqtt.subscribe(this.topic, null, 'p2p')
    },
    getMessage (topic, mqttMsg) {
      if ('100405' === String(mqttMsg.type)) {
        window.channelObs.onRecvWarningMsg('1')
      }

      if ('100408' === String(mqttMsg.type)) {
        const msg = JSON.parse(mqttMsg.msg)
        window.channelObs.onRecvViolateMsg(msg.warning_content)
      }

      // 主播禁播和复播
      if ('100409' === String(mqttMsg.type)) {
        window.channelObs.onRecvAnchorForbidMsg(mqttMsg.msg)
      }
    },

    // 给obs发消息
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
