<template>
  <div class="obs-chat">
    <ChatRoom
      v-if="anchorId"
      :is-obs="true"
      :anchor-id="anchorId"
    />
  </div>
</template>
<script>
import ChatRoom from './components/chat-room'
import MqttBase from '@utils/MqttBase'

export default {
  components: {
    ChatRoom
  },
  data() {
    return {
      mqtt: null,
      // 订阅聊天地址
      subscribePath: null,
      anchorId: '',
    }
  },
  mounted() {
    this.obsInit()
    this.init()
  },
  destroyed(){
    this.mqtt.unsubscribe(this.subscribePath)
  },
  methods: {
    init () {
      this.getParams()
      // 去掉body 最小宽
      document.body.style.minWidth = '0px'
      document.getElementsByClassName('app-main')[0].style.minHeight = '0px'

      // 存store 
      const _userInfo = localStorage.getItem('userInfo')
      if(_userInfo) {
        this.G_SetUserInfo(JSON.parse(_userInfo))
        this.anchorId = JSON.parse(_userInfo).uid
      }
      
      // 订阅聊天地址
      if (this.query.roomId) {
        this.subscribePath = 'live_' + this.query.roomId
      } else {
        this.subscribePath = 'match_' + this.query.id
      }
      // 订阅
      this.setMqtt()
      
      // 提供给obs调用的函数，用来接收token userInfo信息
      window.startObsInit = function(token, userInfo){
        // 如果已经登录 就跳过
        if(localStorage.getItem('token') && localStorage.getItem('userInfo')) {
          return
        }
        if(token && userInfo) {
          localStorage.setItem('token', token)
          localStorage.setItem('userInfo', userInfo)
          window.location.reload()
        }
      }

      // 通知obs可以调我们的全局方法
      window.channelChatRoom.onObsWebInitFinish('ok')
    },
    // obs-init
    obsInit() {
      new QWebChannel(qt.webChannelTransport, function(channel) {
        window.channelChatRoom = channel.objects.chatRoom
      })
    },
    // 存储页面参数
    getParams() {
      this.query = this.$route.query || {}
    },
    setMqtt(){
      this.mqtt = new MqttBase(this.getMessage)
      this.mqtt.subscribe(this.subscribePath)
    },
    // 处理消息 chat-room
    getMessage(topic, mqttMsg = {}) {
      // 接收礼物消息
      if(mqttMsg.type === '100403' && mqttMsg.msg) {
        const _giftMsg = JSON.parse(mqttMsg.msg)
        // 如果当前用户自己送的礼物，则忽略
        if(_giftMsg.send_uid === this.commUserInfo.uid) return
        if(_giftMsg.gift_type_id == 1) {
          // 小礼物
          this.$store.commit('addSmallGifts', _giftMsg)
          this.startSmallGift()
        } else {
          // 大礼物
          this.$store.commit('addBigGifts', _giftMsg)
          this.startBigGift()
        }
      }
      // 聊天消息
      if (!mqttMsg.content) return
      if(topic.indexOf(this.subscribePath) !== -1) {
        // 聊天室
        this.$store.commit('setLiveChatMsg', mqttMsg)
        // 弹幕 99:用户禁言消息、非法字符等系统提示消息
        if(mqttMsg.msgType !== 99) {
          this.$store.commit('addBarrageMsg', mqttMsg)
        }
      }
    },
  }
}
</script>
<style lang="postcss" scoped>
.obs-chat {
  width: 100vw;
  background: #000;
}
</style>