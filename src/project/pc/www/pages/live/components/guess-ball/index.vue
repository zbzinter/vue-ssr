<template>
  <div class="guess-ball">
    <div class="header clearfix">
      <div class="fl tab">
        <div class="logo">
          <i class="iconfont iconimg_caiqiu" />
        </div>
        <span class="cur">猜最终结果</span>
      </div>
      <div class="fr nav">
        <span @click="jumpNewPage('/personal/guess-ball', true)">我的猜球 <i class="iconfont iconbq_ee" /></span>
        <!-- <span @click="jumpNewPage('/personal/property', true)">获得球豆 <i class="iconfont iconbq_ee" /></span> -->
        <span @click="jumpNewPage('/rules/guess-ball')">玩法说明 <i class="iconfont iconbq_ee" /></span>
      </div>
    </div>

    <!-- 暂无竞猜 -->
    <div
      v-if="!guessObj"
      class="no-data"
    >
      <img
        src="../../../../assets/live/img_zanwucaiqiu.png"
        alt=""
      >
      <p>主播暂未发起猜球</p>
    </div>

    <!-- 竞猜详情 -->
    <div
      v-else
      class="content"
      :class="{
        going: guessObj.status === 1,
        pause: guessObj.status === 2,
        flat: guessObj.status === 3,
        end: guessObj.status === 4,
      }"
    >
      <div class="guessing">
        <div class="tit">
          {{ guessObj.theme }}
        </div>
        <ul
          id="guessBalTeam"
          class="team clearfix"
        >
          <li class="team-a">
            <div
              class="inner"
              @click="handleTeam('a')"
            >
              <div class="top">
                <span>{{ guessObj.option_a }}</span>
              </div>
              <div class="bot">
                <img
                  src="../../../../assets/live/img_qiudou.png"
                  alt=""
                >
                <span>球豆共{{ guessObj.option_a_beans|filterBeans }}</span>
                <small v-if="getParticipator(guessObj.option, 'a')">（已参与）</small>
              </div>
              <!-- 是否正确 -->
              <img
                v-if="guessObj.victory_side === 'a'"
                class="correct"
                src="../../../../assets/live/img_zhengque.png"
                alt=""
              >
            </div>
            <div class="process fr">
              <div
                class="bar fl"
                :style="{width: getProcess(guessObj, 'option_a_beans')}"
              />
            </div>
            <SelectBallGold
              v-if="selectedTeam === 'a'"
              :team="selectedTeam"
              :guess-id="guessObj.guess_id"
              @closeBox="closeBox"
              @updateGuess="getGuessMsg"
            />
          </li>
          <li class="team-b">
            <div
              class="inner"
              @click="handleTeam('b')"
            >
              <div class="top">
                <span>{{ guessObj.option_b }}</span>
              </div>
              <div class="bot">
                <img
                  src="../../../../assets/live/img_qiudou.png"
                  alt=""
                >
                <span>球豆共{{ guessObj.option_b_beans|filterBeans }}</span>
                <small v-if="getParticipator(guessObj.option, 'b')">（已参与）</small>
              </div>
              <!-- 是否正确 -->
              <img
                v-if="guessObj.victory_side === 'b'"
                class="correct"
                src="../../../../assets/live/img_zhengque.png"
                alt=""
              >
            </div>
            <div class="process fl">
              <div
                class="bar fl"
                :style="{width: getProcess(guessObj, 'option_b_beans')}"
              />
            </div>
            <SelectBallGold
              v-if="selectedTeam === 'b'"
              :team="selectedTeam"
              :guess-id="guessObj.guess_id"
              @closeBox="closeBox"
              @updateGuess="getGuessMsg"
            />
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import MqttBase from '@utils/MqttBase'
import SelectBallGold from './select-ball-gold'
export default {
  components: {
    SelectBallGold
  },
  filters: {
    filterBeans(val) {
      if (!val) return 0
      if (val >= 10000) {
        val += ''
        // 截取万位做为整数
        const frist_init = val.slice(0, val.length - 4)
        // 截取千位做为小数
        const last_four = val.substr(val.length - 4)
        const last =
          last_four.slice(0, 1) === '0' ? '' : '.' + last_four.slice(0, 1)
        return `${frist_init}${last}w`
      } else {
        return val
      }
    }
  },
  data() {
    return {
      mqtt: null,
      // 订阅聊天地址
      subscribePath: null,
      // 默认球豆列表
      defulatBall: [100, 200, 500, 1000, 2000],
      // 竞猜信息
      guessObj: null,
      // 当前房间id
      roomId: null,
      // 当前选择的队伍 a | b
      selectedTeam: ''
    }
  },
  destroyed(){
    if(this.subscribePath) {
      this.mqtt.unsubscribe(this.subscribePath)
    }
  },
  mounted() {
    this.init()
    // 点击document 关闭弹窗
    document.addEventListener('click', e => {
      const guessBalTeam = document.getElementById('guessBalTeam')
      if (guessBalTeam && !guessBalTeam.contains(e.target)) {
        this.selectedTeam = ''
      }
    })
  },
  methods: {
    init() {
      // 获取竞猜信息
      this.roomId = this.$route.query.roomId
      if (this.roomId) {
        this.getGuessMsg(true)
      }
    },
    // 获取竞猜信息
    getGuessMsg(mqtt) {
      this.$get('/v0.2/rooms/guessingCompetitions', {
        apiType: 'anchor',
        body: {
          uid: localStorage.getItem('uid') || '',
          room_id: this.roomId
        }
      }).then(res => {
        if (res.code === 200) {
          // 如果没有竞猜信息 data = null
          this.guessObj = res.data
          // 订阅
          if (this.guessObj && mqtt) {
            this.subscribePath = this.guessObj.channel_topic
            this.setMqtt()
          }
        }
      })
    },
    setMqtt() {
      this.mqtt = new MqttBase(this.getMessage)
      this.mqtt.subscribe(this.subscribePath, '', true)
    },
    // 处理消息
    getMessage(topic, mqttMsg = {}) {
      if (topic.indexOf(this.subscribePath) !== -1) {
        if (mqttMsg.type === '100400' && mqttMsg.msg) {
          const _newMsg = JSON.parse(mqttMsg.msg)
          this.guessObj = Object.assign(this.guessObj, _newMsg)

          // 如果是流局和结算，更新用户球豆
          if (_newMsg.status === 3 || _newMsg.status === 4) {
            this.updateUserAndMember({
              uid: localStorage.getItem('uid'),
              token: localStorage.getItem('token')
            })
          }
        }
      }
    },
    handleTeam(teamTag) {
      // 只在进行中的猜球才能下注
      if (this.guessObj.status !== 1) return
      // 判断是否登录
      if (!this.commUserInfo.uid) {
        this.G_SetLogin(true)
        return
      }
      this.selectedTeam = teamTag
    },
    // 关闭当前下注框
    closeBox() {
      this.selectedTeam = ''
    },
    // 判断参与下注的队伍
    getParticipator(option, cur) {
      if (!option) return
      return option.indexOf(cur) !== -1
    },
    // 获取当前下注的进度条
    getProcess(guessObj, field) {
      return (
        (guessObj[field] /
          (guessObj.option_a_beans + guessObj.option_b_beans)) *
          100 +
        '%'
      )
    },
    // 打开新页面
    jumpNewPage(path, needLogin) {
      if (needLogin && !this.commUserInfo.uid) {
        this.G_SetLogin(true)
        return
      }
      this.$router.openNewPage(path)
    }
  }
}
</script>
<style lang="scss" scoped>
.no-data {
  height: 220px;
  position: relative;
  text-align: center;
  padding-top: 50px;
  border-top: 2px solid #3c86f6;
  background: url(../../../../assets/live/img_dingbulan_act.png) no-repeat
    center top;
  p {
    font-size: 13px;
    color: #858ab7;
    padding-top: 15px;
  }
}
.guess-ball {
  background: #fff;
  margin-bottom: 10px;
  .header {
    height: 66px;
    line-height: 66px;
    font-weight: bold;
    .tab {
      font-size: 16px;
      color: #333333;
      .logo {
        float: left;
        width: 95px;
        height: 30px;
        position: relative;
        margin: 21px 40px 0 16px;
        .iconfont {
          color: #3683ff;
          font-weight: normal;
          font-size: 30px;
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      span {
        float: left;
      }
      .cur {
        color: $blue;
        font-size: 20px;
        height: 66px;
        border-bottom: 4px solid $blue;
      }
    }
    .nav {
      font-size: 14px;
      color: #717171;
      padding-right: 30px;
      span {
        float: left;
        margin-left: 36px;
        cursor: pointer;
        &:hover {
          color: $blue;
        }
        i {
          font-size: 12px;
        }
      }
    }
  }
  .content {
    height: 220px;
    position: relative;
    border-top: 2px solid #3c86f6;
    background: url(../../../../assets/live/img_dingbulan_act.png) no-repeat
      center top;
    // 封盘和结束，刘海
    &.pause,
    &.flat,
    &.end {
      border-color: #ccc;
      background: url(../../../../assets/live/img_dingbulan_oact.png) no-repeat
        center top;
    }
    // 进行中,角标
    &.going .guessing {
      background: url(../../../../assets/live/img_jinxin.png) no-repeat left top;
    }
    // 已封盘
    &.pause {
      // 角标
      .guessing {
        background: url(../../../../assets/live/img_fengpan.png) no-repeat left
          top;
        .team li.team-a .inner {
          background: url(../../../../assets/live/img_duiwu_oact.png) no-repeat
            right top;
        }
        .team li.team-b .inner {
          background: url(../../../../assets/live/img_duiwu2_oact.png) no-repeat
            right top;
        }
      }
    }
    // 流局
    &.flat {
      // 角标
      .guessing {
        background: url(../../../../assets/live/img_flat.png) no-repeat left top;
        .team li.team-a .inner {
          background: url(../../../../assets/live/img_duiwu_oact.png) no-repeat
            right top;
        }
        .team li.team-b .inner {
          background: url(../../../../assets/live/img_duiwu2_oact.png) no-repeat
            right top;
        }
      }
    }
    // 已结算
    &.end {
      // 角标
      .guessing {
        background: url(../../../../assets/live/img_jiesuan.png) no-repeat left
          top;
        .team li.team-a .inner {
          background: url(../../../../assets/live/img_duiwu_oact.png) no-repeat
            right top;
        }
        .team li.team-b .inner {
          background: url(../../../../assets/live/img_duiwu2_oact.png) no-repeat
            right top;
        }
      }
    }
    .guessing {
      text-align: center;
      .tit {
        font-size: 16px;
        color: #202020;
        height: 70px;
        line-height: 70px;
      }
      .team {
        li {
          width: 378px;
          display: inline-block;
          margin: 0 25px;
          vertical-align: middle;
          position: relative;
          padding-bottom: 20px;
          .inner {
            height: 92px;
            cursor: pointer;
            position: relative;
            .top {
              height: 42px;
              line-height: 42px;
              img {
                width: 22px;
                height: 22px;
                margin-right: 5px;
              }
              span {
                font-size: 14px;
                color: #ffffff;
              }
            }
            .bot {
              height: 50px;
              line-height: 50px;
              span {
                font-size: 16px;
                color: #ffffff;
              }
              small {
                color: #fff;
                opacity: 0.7;
              }
            }
            .correct {
              position: absolute;
              right: -27px;
              top: -27px;
            }
          }
          // 比例条
          .process {
            width: 356px;
            height: 6px;
            margin-top: 24px;
            background: #d8d8d8;
            .bar {
              height: 6px;
              float: left;
              background: #ffa029;
            }
          }
          &.team-a .inner {
            background: url(../../../../assets/live/img_duiwu_act.png) no-repeat
              right top;
          }
          &.team-b .inner {
            background: url(../../../../assets/live/img_duiwu2_act.png)
              no-repeat right top;
          }
        }
      }
    }
  }
}
.bet-box {
  .list {
    li {
      float: left;
      width: 90px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      margin: 10px 10px 0 0;
      border: 1px solid #ddd;
      &.cur {
        color: #3683ff;
        border-color: #3683ff;
      }
    }
  }
}
</style>