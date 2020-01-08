<template>
  <div class="event-score">
    <div class="score-box">
      <div class="team">
        <div class="name ellipsis">
          {{ matchData.guestTeamName }}
        </div>
        <DefaultImg
          class="logo"
          :src="matchData.guestTeamLogo"
          :default-url="defaultImg.basketball"
        />
      </div>
      <div
        class="score number"
        :class="getTeamColor(2)"
      >
        {{ (scoreTotalObj.Current || {}).team2 || 0 }}
      </div>
      <div class="content">
        <dl>
          <dt>球队</dt>
          <dd>{{ matchData.guestTeamName }}</dd>
          <dd>{{ matchData.hostTeamName }}</dd>
        </dl>
        <dl>
          <dt>第一节</dt>
          <dd>{{ (scoreTotalObj.Period1 || {}).team2 }}</dd>
          <dd>{{ (scoreTotalObj.Period1 || {}).team1 }}</dd>
        </dl>
        <dl>
          <dt>第二节</dt>
          <dd>{{ (scoreTotalObj.Period2 || {}).team2 }}</dd>
          <dd>{{ (scoreTotalObj.Period2 || {}).team1 }}</dd>
        </dl>
        <dl>
          <dt>第三节</dt>
          <dd>{{ (scoreTotalObj.Period3 || {}).team2 }}</dd>
          <dd>{{ (scoreTotalObj.Period3 || {}).team1 }}</dd>
        </dl>
        <dl>
          <dt>第四节</dt>
          <dd>{{ (scoreTotalObj.Period4 || {}).team2 }}</dd>
          <dd>{{ (scoreTotalObj.Period4 || {}).team1 }}</dd>
        </dl>
        <dl v-if="scoreTotalObj.Overtime">
          <dt>加时</dt>
          <dd>{{ (scoreTotalObj.Overtime || {}).team2 }}</dd>
          <dd>{{ (scoreTotalObj.Overtime || {}).team1 }}</dd>
        </dl>
      </div>
      <div
        class="score number host" 
        :class="getTeamColor(1)"
      >
        {{ (scoreTotalObj.Current || {}).team1 || 0 }}
      </div>
      <div class="team host">
        <div class="name ellipsis">
          {{ matchData.hostTeamName }}
        </div>
        <DefaultImg
          class="logo"
          :src="matchData.hostTeamLogo"
          :default-url="defaultImg.basketball"
        />
      </div>
    </div>
  </div>
</template>
<script>
import DefaultImg from '@src/components/DefaultImg'
import MqttBase from '@utils/MqttBase'
import { getHHmmTime } from '@utils/dateFormate'
export default {
  filters: {
    formatMatchTime(val) {
      return getHHmmTime(val)
    }
  },
  components: {
    DefaultImg
  },
  props: {
    matchData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      // 得分总计
      scoreTotalObj: {},
      // mqtt
      mqtt: null,
      // 订阅聊天地址
      subscribePath: null,
    }
  },
  mounted() {
    this.init()
  },
  destroyed(){
    this.mqtt.unsubscribe(this.subscribePath)
  },
  methods: {
    init() {
      // 获取 篮球比赛得分统计
      this.getContrast()
      // 订阅直播
      this.setMqtt()
    },
    getContrast() {
      this.$get('/v5/match/contrast/basketball', {
        matchId: this.$route.query.id,
      }).then(res => {
        const { code, data={}} = res
        if (code === 200) {
          this.scoreTotalObj = data
        }
      })
    },
    setMqtt(){
      const mqtt = new MqttBase(this.getMessage)
      this.mqtt = mqtt
      this.subscribePath = `topic_mq/match/${this.query.id}/matchScoreBasketball`
      this.mqtt.subscribe(this.subscribePath)
    },
    // 处理消息
    getMessage(topic, mqttMsg = {}) {
      if(topic.indexOf(this.subscribePath) !== -1) {
        this.scoreTotalObj = mqttMsg
      }
    },
    getTeamColor(type) {
      const team1 = (this.scoreTotalObj.Current || {}).team1 || 0
      const team2 = (this.scoreTotalObj.Current || {}).team2 || 0
      if(type === 1) {
        return team1 < team2 ? 'little' : ''
      } else {
        return team2 < team1 ? 'little' : ''
      }
    }
    
  }
}
</script>
<style lang="postcss" scoped>
.event-score {
  text-align: center;
  .time-box {
    height: 34px;
    line-height: 34px;
    text-align: center;
    font-size: 12px;
    color: #666666;
    .time {
      color: #E15756;
      margin-left: 25px;
    }
  }
  .score-box {
    overflow: hidden;
    padding: 35px 25px;
    .team {
      float: left;
      width: 150px;
      &.host .name {
        color: #3683FF;
      }
      .name {
        font-size: 20px;
        color: #E15756;
        font-weight: bold;
      }
      .logo {
        display: block;
        width: 60px;
        height: 60px;
        margin: 16px auto 0 auto;
      }
    }
    .score {
      float: left;
      width: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 60px;
      color: #333333;
      &.little {
        /* text-align: right; */
        color: #666;
      }
    }
    .content {
      float: left;
      padding-top: 10px;
      dl {
        float: left;
        width: 80px;
        &:first-child {
          width: 120px;
        }
        dt {
          color: #666;
          font-size: 14px;
          line-height: 20px;
          padding-bottom: 6px;
        }
        dd {
          font-size: 12px;
          color: #333;
          line-height: 18px;
          margin-top: 16px;
        }
      }
    }
  }
}
</style>