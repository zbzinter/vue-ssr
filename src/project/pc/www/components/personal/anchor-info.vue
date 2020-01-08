<template>
  <div>
    <header class="clearfix header-info">
      <div class="fl">
        <default-img
          class="logo"
          :src="commUserInfo.img"
        />
      </div>
      <div class="fl info">
        <p>{{ commUserInfo.nickName || '-' }}</p>
        <span>我的粉丝</span>
        <span class="warn">{{ info.fans }}</span>
        <span class="live-hour">
          直播时长：
          <span class="warn">{{ (info.online_second/(60*60)).toFixed(2) }}</span> 时
        </span>
        <br>
        <span>
          赛事预约：已预约
          <span class="warn">{{ info.appointment || 0 }}</span> 场比赛
        </span>
        <span
          v-if="isShow"
          class="order"
          @click="order"
        >预约</span>
        <br>
        <span v-if="showGuessball">
          竞猜管理：有
          <span class="warn">{{ guessBallCount || 0 }}</span> 场竞猜还未结算
        </span>
        <span
          v-if="showGuessball"
          class="order"
          @click="guessBall"
        >结算</span>
      </div>
      <div class="fr">
        <span class="room-id block">房间ID：{{ roomId }}</span>
        <span
          class="block btn-basic"
          @click="enterRoom"
        >进入房间</span>
      </div>
    </header>
  </div>
</template>

<script>
import DefaultImg from '@src/components/DefaultImg'
import { mapActions } from 'vuex'

export default {
  components: {
    DefaultImg
  },
  props: {
    isShow: {
      default: false,
      type: Boolean
    },
    showGuessball: {
      default: false,
      type: Boolean
    },
    personInfo: {
      default: () => {},
      type: Object
    }
  },
  data() {
    return {
      info: {
        nickName: '',
        image: '',
        fans: 0,
        online_second: 0,
        appointment: ''
      },
      guessBallCount: 0,
      uid: '',
      playUrl: '',
      matchId: '',
      roomId: ''
    }
  },
  mounted() {
    this.init()
    this.getGuessBallCount()
  },
  methods: {
    ...mapActions(['GetAnchorInfo', 'GetAnchorSetInfo']),

    init() {
      this.GetAnchorInfo({
        uid: this.getUserInfo().uid,
        token: localStorage.getItem('token')
      }).then(data => {
        this.info = Object.assign(this.info, data)
      })
      this.getAnchorSetInfo()
    },

    getAnchorSetInfo() {
      return new Promise((resolve, reject) => {
        this.GetAnchorSetInfo({ uids: this.getUserInfo().uid, vm: this }).then(
          result => {
            if (!result.room_id) {
              this.$error('请求个人信息有误')
              reject()
            }
            resolve(result)
            this.info.online_second = result.online_second
            this.info.image = result.anchor.user_img
            this.info.fans = result.attention_count
            this.matchId = result.match_id
            this.roomId = result.room_id
            this.getPlayUrl()
            this.getOrderNum()
          }
        )
      })
    },

    // 统计直播间预约场次
    getOrderNum() {
      this.$get('v0.1/reservas/count', {
        apiType: 'anchor',
        body: {
          roomId: this.roomId
        }
      }).then(res => {
        const { code, data } = res
        if (this.$judgeCode(code)) {
          this.info.appointment = data
        }
      })
    },

    getPlayUrl() {
      this.playUrl = `${window.location.host}/live/detail?id=${this.matchId}&roomId=${this.roomId}`
    },

    enterRoom() {
      const routerData = this.$router.resolve({
        path: '/live/detail',
        query: { id: this.matchId, roomId: this.roomId }
      })
      window.open(routerData.href, '_blank')
    },

    startLive() {
      const routerData = this.$router.resolve({
        path: '/live/detail',
        query: { id: this.matchId, roomId: this.roomId }
      })
      window.open(routerData.href, '_blank')
    },

    order() {
      this.$router.push({
        path: '/personal/private'
      })
    },

    guessBall() {
      this.$router.push({
        path: '/personal/guess-ball-manage'
      })
    },

    getGuessBallCount() {
      this.$get('v0.2/anchorUsers/guessingCompetitions/count', {
        apiType: 'anchor',
        body: {
          uid: this.getUserInfo().uid
        }
      }).then(res => {
        if (res.data.unsettled_accounts) {
          this.guessBallCount = res.data.unsettled_accounts
        }
      })
    },

    getParam() {
      return {
        user_img: this.info.image,
        nickname: this.info.nickName
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.header-info {
  margin: 30px 40px 50px 40px;
  height: 120px;
  background: #fff;
}

.logo {
  display: inline-block;
  width: 116px;
  height: 116px;
  border-radius: 58px;
}
.info {
  padding-left: 20px;
  p {
    padding-top: 12px;
    font-size: 20px;
    line-height: 30px;
    color: #333333;
  }
  span {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    line-height: 17px;
  }
  .live-hour {
    padding-left: 36px;
  }
  .order {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    line-height: 17px;
    padding-left: 15px;
    color: #3683ff;
    cursor: pointer;
  }
  .warn {
    color: #ffa029;
  }
}

.s-live {
  border: 1px solid #3884ff;
  border-radius: 4px;
  font-size: 14px;
  color: #3683ff;
}

.room-id {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  text-align: right;
  line-height: 22px;
  margin-top: 30px;
  margin-bottom: 6px;
}

.btn-basic {
  width: 110px;
  height: 40px;
  border-radius: 4px;
  border: 1px solid #3884ff;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #3683ff;
  text-align: center;
  line-height: 40px;
  cursor: pointer;
  &:hover {
    color: #fff;
    background: #3683ff;
  }
}
</style>
