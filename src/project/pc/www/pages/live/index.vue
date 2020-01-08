<template>
  <div
    v-if="showMain"
    class="live-container"
  >
    <div class="live-top">
      <div class="live-inner-content">
        <!-- 盘口数据 -->
        <HandicapData
          v-if="sportId === 1 || sportId === 2 || sportId === 5"
          :match-data="matchData"
        />
        <!-- 不是足球、篮球、网球赛事的时候显示广告栏 -->
        <div
          v-else
          class="live-top-ad"
        >
          <img
            src="../../assets/live/h-ad.png"
            alt=""
          >
        </div>

        <div class="video-index-main clearfix">
          <div class="video-left">
            <!-- 如果是主播房间，显示主播信息，否则显示动画与视频的切换tab -->
            <AnchorInfo
              v-if="liveType === 3"
              :anchor-info="anchorInfo"
            />
            <AniVideoTab
              v-else 
              :live-type="liveType"
              :has-video="hasVideo"
              :has-ani="hasAni"
              @switchLiveType="switchLiveType"
            />
            <!-- 视频/动画 -->
            <VideoBox
              :live-type="liveType"
              :match-data="matchData"
              :anchor-info="anchorInfo"
            />
            <!-- 礼物 -->
            <GiftList
              v-if="liveType === 3"
              :match-data="matchData"
              :anchor-info="anchorInfo"
            />
          </div>
          <div class="video-right">
            <!-- 聊天室和推荐 -->
            <ChatBox
              :live-type="liveType"
              :has-video="hasVideo"
              :has-ani="hasAni"
              :match-data="matchData"
              :anchor-id="anchroId"
              :announcement="announcement"
              :sensitive-word="sensitiveWord"
              @switchLiveType="switchLiveType"
              @initSensitive="initSensitive"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="live-inner-content live-main clearfix">
      <!-- 左侧内容 -->
      <div class="left-content">
        <!-- 猜球 -->
        <GuessBall v-if="showGuess && isARoom" />

        <!-- 文字直播和球队阵容 -->
        <FootbalLiveInfo
          v-if="sportId === 1"
          :match-data="matchData"
        />
        <BasketballCountBox
          v-if="sportId === 2"
          :match-data="matchData"
        />
      </div>
      <!-- 排行榜 -->
      <FootbalRankingBox 
        v-if="sportId === 1"
        :match-data="matchData"
      />
      <BasketballRankingBox
        v-if="sportId === 2"
        :match-data="matchData"
      />
    </div>
    <!-- 侧边工具栏 -->
    <side-tools :no-o-player="true" />
  </div>
</template>
<script>
import { creatScript } from '@utils/utils'
import { videoFlvUrl, videoHlsUrl } from '@utils/env'
import VideoBox from './components/video-box'
import ChatBox from './components/chat-box'
import HandicapData from './components/handicap-data'
import FootbalRankingBox from './components/football/ranking-box'
import FootbalLiveInfo from './components/football/live-info'
import BasketballCountBox from './components/basketball/count-box'
import BasketballRankingBox from './components/basketball/ranking-box'
import GuessBall from './components/guess-ball'
import AnchorInfo from './components/anchor-info'
import AniVideoTab from './components/ani-video-tab'
import GiftList from './components/gift-list'
import MqttBase from '@utils/MqttBase'
import liveMixins from '../../mixins/live'
import SideTools from '../home/components/SideTools'
export default {
  components: {
    SideTools,
    VideoBox,
    ChatBox,
    HandicapData,
    FootbalRankingBox,
    FootbalLiveInfo,
    BasketballCountBox,
    BasketballRankingBox,
    GuessBall,
    AniVideoTab,
    AnchorInfo,
    GiftList
  },
  mixins: [liveMixins],
  data() {
    return {
      mqtt: null,
      // 比赛基础信息
      matchData: {},
      // 直播类型 1动画、2视频、3主播
      liveType: 1,
      // url参数
      query: {},
      // 是否有视频
      hasVideo: false,
      // 是否有动画
      hasAni: false,
      // 当前是否是主播房间
      isARoom: false,
      // 主播详情
      anchorInfo: {},
      // 赛事类型 1足球，2篮球
      sportId: 0,
      // 订阅聊天地址
      subscribePath: null,
      // 是否显示竞猜
      showGuess: false,
      // 显示主体，做loading
      showMain: false,
      // 特殊字符，禁言提示内容
      sensitiveWord: {},
      //公告
      announcement:false,
      //主播id
      anchroId:0
    }
  },
  watch: {
    matchData() {
      this.getShowMain()
    },
    anchorInfo() {
      this.getShowMain()
    }
  },
  mounted() {
    this.init()
  },
  destroyed(){
    this.G_SetNav(1)
    this.mqtt.unsubscribe(this.subscribePath)
  },
  methods: {
    init() {
      creatScript(videoFlvUrl()).then(() => {
        creatScript(videoHlsUrl()).then(() => {
          this.loadData()
        })
      })
    },
    loadData () {
      // 获取matchData初始数据
      this.getParams()
      // 参数判断 如果没有id 或者 roomId 返回首页
      this.checkParams()
      this.G_SetNav(2)
      // 是否是主播
      this.isARoom = !!this.query.roomId
      // 获取单场赛事详情 1519268
      if(this.judgeMatchId(this.$route.query)) {
        this.getMatchDetail()
      }
      // 获取主播房间信息
      if(this.isARoom) {
        this.getAnchorRoomInfo(this.query.roomId)
      }
      // 订阅聊天地址
      if (this.query.roomId) {
        this.subscribePath = 'live_' + this.query.roomId
      } else {
        this.subscribePath = 'match_' + this.query.id
      }

      // 是否有显示竞猜
      this.getGuessingSetting()

      // this.$nextTick(() => {
      //   // 订阅
      //   this.setMqtt()
      // })
    },
    getShowMain() {
      let matchShow = true,
        anchorShow = true
      if(this.judgeMatchId(this.$route.query)) {
        matchShow = this.matchData && Object.keys(this.matchData).length
      }
      if(this.query.roomId) {
        anchorShow = this.anchorInfo && Object.keys(this.anchorInfo).length
      }
      this.showMain = matchShow && anchorShow
      // 因为需要判断当前用户是不是当前房间的主播，所以等房间详情请求完成后再订阅
      if(this.showMain) {
        this.setMqtt()
      }
    },
    initSensitive(){
      this.sensitiveWord = {}
    },
    setMqtt(){
      this.mqtt = new MqttBase(this.getMessage)
      // 判读是否是主播
      const isAc = (this.anchorInfo.anchor || {}).uid === this.commUserInfo.uid
      this.mqtt.subscribe(this.subscribePath, '', isAc ? 'livecreator' : '')
    },
    // 处理消息 chat-room
    getMessage(topic, mqttMsg = {}) {
      // 猜球开关是通过聊天室消息推送过来的
      if(mqttMsg.type === '100401') {
        this.showGuess = mqttMsg.msg === '1'
      }
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
      // 接收通告礼物
      if(mqttMsg.type === '100406' && mqttMsg.msg) {
        const _giftMsg = JSON.parse(mqttMsg.msg)
        
        // 如果是当前房间的礼物，则忽略
        if(_giftMsg.receive_uid === (this.anchorInfo.anchor || {}).uid) return
        this.$store.commit('addNoticeGifts', _giftMsg)
        this.startNoticeGift()
      }

      // 主播违规提醒
      if(mqttMsg.type === '100405' && mqttMsg.msg) {
        const _warning = JSON.parse(mqttMsg.msg)
        this.msg.info({
          type: 3,
          message: _warning.warning_content,
          duration: 3000
        })
      }
      // 聊天消息
      if (!mqttMsg.content) return
      if(topic.indexOf(this.subscribePath) !== -1) {
        if(mqttMsg.msgType == 99){
          this.sensitiveWord = mqttMsg
          return
        }
        // if(mqttMsg.msgType == 5 && isNaN(Number(mqttMsg.userId))){
        if(mqttMsg.msgType == 5 && mqttMsg.guest){
          return
        }
        // 聊天室
        this.$store.commit('setLiveChatMsg', mqttMsg)
        // 弹幕 99:用户禁言消息、非法字符等系统提示消息
        if(mqttMsg.msgType !== 99) {
          this.$store.commit('addBarrageMsg', mqttMsg)
        }
      }
    },
    switchLiveType(params) {
      this.liveType = params.key
      if(params.roomId) {
        this.getAnchorRoomInfo(params.roomId)
      }
    },
    checkParams() {
      if(!this.query.id && !this.query.roomId) {
        this.$tip('参数不正确')
        setTimeout(() => {
          this.$router.push({
            path: '/'
          })
        }, 1500)
      }
    },
    // 存储页面参数
    getParams() {
      this.query = this.$route.query || {}
    },
    // 获取赛事详情
    getMatchDetail() {
      this.$get('/v5/match/match', {
        id: this.query.id
      }).then(res => {
        if (res.data) {
          const videoTab = this.query.videoTab
          this.matchData = res.data || {}
          this.sportId = this.matchData.sportId
          // 是否有视频
          if(this.matchData.liveFlvUrl || this.matchData.liveFlvUrl) {
            this.hasVideo = true
            this.liveType = 2
          }
          // 如果有动画，优先播放动画
          if(this.matchData.animUrl) {
            this.hasAni = true
            this.liveType = 1
          }
          // 根据videoTab参数来定位动画与视频tab
          if(videoTab) {
            if(this.hasAni && videoTab === '1') {
              this.liveType = 1
            }
            if(this.hasVideo && videoTab === '2') {
              this.liveType = 2
            }
          }
          // 是否是主播房间
          if(this.query.roomId) {
            this.liveType = 3
          }
        }
      })
    },
    // 获取主播房间信息
    getAnchorRoomInfo(roomId) {
      this.$get('/v0.1/room/detail', {
        apiType: 'anchor',
        body: {
          roomId,
          uid: this.getUserInfo().uid || ''
        }
      }).then(res => {
        const { code, data } = res
        if (code === 200) {
          this.anchorInfo = data || {}
          this.liveType = 3
          this.anchroId = this.anchorInfo.anchor? this.anchorInfo.anchor.uid:0
          this.announcement = this.anchorInfo.announcement
        }
      })
    },
    // 获取竞猜开关
    getGuessingSetting() {
      this.$get('/v0.1/guessing/guessingSetting', {
        apiType: 'anchor',
      }).then(res => {
        const { code, data } = res
        if (code === 200) {
          this.showGuess = data.settingFlag === '1'
        }
      })
    }
  }
}
</script>
<style lang="postcss" scoped>
.live-inner-content {
  width: 1440px;
  margin: 0 auto;
}
.live-container {
  min-width: 1440px;
  .live-top-ad {
    img {
      display: block;
      width: 100%;
      height: 124px;
    }
  }
  .video-index-main {
    margin-top: 10px;
    .video-left {
      width: 1090px;
      float: left; 
    }
    .video-right {
      width: 334px;
      float: right;
      background: #fff;
    }
  }
  .live-main {
    margin-top: 10px;
    .left-content {
      width: 1090px;
      float: left;
    }
  }
}
</style>