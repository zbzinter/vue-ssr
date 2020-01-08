<template>
  <div
    v-if="guestStateList.length || hostStateList.length || stateList.length"
    class="event-stat clearfix"
  >
    <div class="fl circle-wrap">
      <iCircle
        v-for="(guestState, index) in guestStateList"
        :key="index"
        :percent="parseInt(guestState.value*100)"
        :size="circleSize"
        :stroke-width="strokeWidth"
        :trail-width="trailWidth"
        :stroke-color="guestTeamColor"
      >
        <div class="circle-box">
          <p>{{ guestState.title }}</p>
          <p>命中率</p>
          <span class="b">{{ parseInt(guestState.value*100) }}%</span>
        </div>
      </iCircle>
    </div>
    <div class="fl chart-wrap">
      <ChartsRow
        v-for="(item, index) in stateList"
        :key="index"
        class="chart-row"
        :title="item.title"
        :data="item"
      />
    </div>
    <div class="fr circle-wrap">
      <iCircle
        v-for="(hostState, index) in hostStateList"
        :key="index"
        :percent="parseInt(hostState.value*100)"
        :size="circleSize"
        :stroke-width="strokeWidth"
        :trail-width="trailWidth"
        :stroke-color="hostTeamColor"
      >
        <div class="circle-box host">
          <p>{{ hostState.title }}</p>
          <p>命中率</p>
          <span class="b">{{ parseInt(hostState.value*100) }}%</span>
        </div>
      </iCircle>
    </div>
  </div>
</template>
<script>
import { Circle } from 'iview'
import MqttBase from '@utils/MqttBase'
import ChartsRow from './charts-row'
export default {
  components: {
    iCircle: Circle,
    ChartsRow
  },
  props: {
  },
  data() {
    return {
      mqtt: null,
      // 订阅地址
      subscribePath: null,
      // 进度环大小
      circleSize: 90,
      // 进度环的线宽
      strokeWidth: 8,
      // 进度环背景的线宽
      trailWidth: 6,
      // 客队颜色
      guestTeamColor: '#E15756',
      // 主队颜色
      hostTeamColor: '#3683FF',
      // 客队命中率统计列表
      guestStateList: [],
      // 主队命中率统计列表
      hostStateList: [],
      // 技术统计列表
      stateList: []
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
      this.$get('v7/queryBasketballTeamStat', {
        matchId: this.$route.query.id,
      }).then(res => {
        const { code, data={} } = res
        if(code === 200 && data) {
          this.assembleData(data)
        }
      })
      this.setMqtt()
    },
    setMqtt(){
      this.subscribePath = `topic_mq/match/${this.$route.query.id}/basketballStatic`
      this.mqtt = new MqttBase(this.getMessage)
      this.mqtt.subscribe(this.subscribePath)
    },
    // 处理消息 chat-room
    getMessage(topic, mqttMsg = {}) {
      if(topic.indexOf(this.subscribePath) !== -1) {
        this.assembleData(mqttMsg)
      }
    },
    // 组装数据
    assembleData(data) {
      data = data || {}
      this.guestStateList = []
      this.hostStateList = []
      this.stateList = []
      // 投篮命中率
      if(data.guestShtRt || data.hostShtRt) {
        this.guestStateList.push({
          title: '投篮',
          value: data.guestShtRt || 0
        })
        this.hostStateList.push({
          title: '投篮',
          value: data.hostShtRt || 0
        })
      }
      // 罚球命中率
      if(data.guestPnltyRt || data.hostPnltyRt) {
        this.guestStateList.push({
          title: '罚球',
          value: data.guestPnltyRt || 0
        })
        this.hostStateList.push({
          title: '罚球',
          value: data.hostPnltyRt || 0
        })
      }
      // 三分命中率
      if(data.guestThrPntRt || data.hostThrPntRt) {
        this.guestStateList.push({
          title: '三分',
          value: data.guestThrPntRt || 0
        })
        this.hostStateList.push({
          title: '三分',
          value: data.hostThrPntRt || 0
        })
      }

      ///// 其他技术统计
      // 篮板
      if(data.guestRbnd || data.hostRbnd) {
        this.stateList.push({
          title: '篮板',
          team1: data.guestRbnd || 0,
          team2: data.hostRbnd || 0
        })
      }

      // 助攻
      if(data.guestAssist || data.hostAssist) {
        this.stateList.push({
          title: '助攻',
          team1: data.guestAssist || 0,
          team2: data.hostAssist || 0
        })
      }
      // 抢断
      if(data.guestSteal || data.hostSteal) {
        this.stateList.push({
          title: '抢断',
          team1: data.guestSteal || 0,
          team2: data.hostSteal || 0
        })
      }
      // 盖帽
      if(data.guestBlckSht || data.hostBlckSht) {
        this.stateList.push({
          title: '盖帽',
          team1: data.guestBlckSht || 0,
          team2: data.hostBlckSht || 0
        })
      }
      // 失误
      if(data.guestTurnover || data.hostTurnover) {
        this.stateList.push({
          title: '失误',
          team1: data.guestTurnover || 0,
          team2: data.hostTurnover || 0
        })
      }
      // 罚球
      if(data.guestPnlty || data.hostPnlty) {
        this.stateList.push({
          title: '罚球',
          team1: data.guestPnlty || 0,
          team2: data.hostPnlty || 0
        })
      }
      // 三分
      if(data.guestThrPnt || data.hostThrPnt) {
        this.stateList.push({
          title: '三分',
          team1: data.guestThrPnt || 0,
          team2: data.hostThrPnt || 0
        })
      }
      // 犯规
      if(data.guestFoul || data.hostFoul) {
        this.stateList.push({
          title: '犯规',
          team1: data.guestFoul || 0,
          team2: data.hostFoul || 0
        })
      }
    }
  }
}
</script>
<style lang="postcss" scoped>
.event-stat {
  padding: 60px 50px 40px 50px;
  border-top: 1px dashed #CCCCCC;
  .circle-wrap {
    width: 90px;
    min-height: 90px;
    .ivu-chart-circle {
      margin-bottom: 40px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .circle-box {
      &.host .b {
        color: #3683FF;
      }
      p {
        font-size: 12px;
        color: #333;
        line-height: 18px;
      }
      .b {
        display: block;
        font-size: 16px;
        padding-top: 2px;
        font-weight: bold;
        color: #E15756;
      }
    }
  }
  .chart-wrap {
    width: 700px;
    margin-left: 65px;
    .chart-row {
      &:nth-child(3n) {
        margin-bottom: 40px;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}
</style>