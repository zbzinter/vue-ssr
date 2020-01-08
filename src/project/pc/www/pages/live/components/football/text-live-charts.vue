<template>
  <div class="text-live-charts clearfix">
    <div class="duration">
      <span v-if="matchData.matchStatus == 1">比赛未开始</span>
      <span v-if="matchData.matchStatus == 3">比赛已结束</span>
      <span v-if="matchData.matchStatus == 4">比赛已{{ matchData.matchStatusDesc }}</span>
      <div v-if="matchData.matchStatus == 2">
        <span>正在进行中</span>
        <span class="red">{{ Math.floor(timePlayed/60) }}'</span>
      </div>
    </div>
    <div class="d-table charts-box">
      <div class="d-table-cell team-box team-left">
        <div class="d-table-cell team-info">
          <div class="name ellipsis">
            {{ matchData.hostTeamName }}
          </div>
          <DefaultImg
            :src="matchData.hostTeamLogo"
            :default-url="defaultImg.football"
            class="logo"
          />
        </div>
        <div class="d-table-cell fraction">
          <div class="inner number">
            {{ matchData.hostTeamNormalScore || 0 }}
          </div>
        </div>
        <!-- 红黄牌 -->
        <div class="cards clearfix">
          <div class="card-item corner">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#iconam_bj" />
            </svg>
            <span>{{ (soccerData.cornerKicks || {}).team1 || 0 }}</span>
          </div>
          <div class="card-item red">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#iconar_bj" />
            </svg>
            <span>{{ (soccerData.redCards || {}).team1 || 0 }}</span>
          </div>
          <div class="card-item yellow">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#iconaq_bj" />
            </svg>
            <span>{{ (soccerData.yellowCards || {}).team1 || 0 }}</span>
          </div>
        </div>
      </div>
      <div class="d-table-cell charts-list">
        <!-- 技术数据 -->
        <ChartRow
          v-if="soccerData.possession"
          title="控球率"
          :data="soccerData.possession"
          util="%"
        />
        <ChartRow
          v-if="soccerData.attack"
          title="进攻"
          :data="soccerData.attack"
        />
        <ChartRow
          v-if="soccerData.dangerAttack"
          title="危险进攻"
          :data="soccerData.dangerAttack"
        />
        <ChartRow
          v-if="soccerData.shootOnGoal"
          title="射正球门"
          :data="soccerData.shootOnGoal"
        />
        <ChartRow
          v-if="soccerData.shootOffGoal"
          title="射偏球门"
          :data="soccerData.shootOffGoal"
        />
      </div>
      <div class="d-table-cell team-box team-right">
        <div class="d-table-cell fraction">
          <div class="inner number">
            {{ matchData.guestTeamNormalScore || 0 }}
          </div>
        </div>
        <div class="d-table-cell team-info">
          <div class="name red ellipsis">
            {{ matchData.guestTeamName }}
          </div>
          <DefaultImg
            :src="matchData.guestTeamLogo"
            :default-url="defaultImg.football"
            class="logo"
          />
        </div>
        <!-- 红黄牌 -->
        <div class="cards right clearfix">
          <div class="card-item corner">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#iconam_bj" />
            </svg>
            <span>{{ (soccerData.cornerKicks || {}).team2 || 0 }}</span>
          </div>
          <div class="card-item red">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#iconar_bj" />
            </svg>
            <span>{{ (soccerData.redCards || {}).team2 || 0 }}</span>
          </div>
          <div class="card-item yellow">
            <svg
              class="svg-icon"
              aria-hidden="true"
            >
              <use xlink:href="#iconaq_bj" />
            </svg>
            <span>{{ (soccerData.yellowCards || {}).team2 || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import MqttBase from '@utils/MqttBase'
import ChartRow from './charts-row'
export default {
  components: {
    ChartRow
  },
  props: ['matchData'],
  data() {
    return {
      mqtt: null,
      timeMqtt: null,
      // 页面参数
      query: {},
      // 统计数据
      soccerData: {},
      // 订阅技术数据地址
      subscribePath: '',
      // 订阅比赛时长数据
      subscribeTimePath: '',
      // 比赛时长
      timePlayed: 0,
      timer: null,
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    this.mqtt.unsubscribe(this.subscribePath)
  },
  methods: {
    init() {
      // 获取matchData初始数据
      this.getParams()
      // 技术统计数据
      this.getSoccerData()
      // 开启mqtt获取推送数据
      this.setMqtt()

      // 比赛时长
      this.timePlayed = this.matchData.timePlayed ? Number(this.matchData.timePlayed) : 0
      this.setTimePlayed()
    },
    // 获取技术统计历史数据
    getSoccerData () {
      this.$get('/v5/match/contrast/soccer', {
        matchId: this.query.id || 1519268
      }).then(res => {
        if (res.data) {
          this.soccerData = res.data || {}
        }
      })
    },
    // 存储页面参数
    getParams() {
      this.query = this.$route.query || {}
    },
    // 设置比赛时长
    setTimePlayed() {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.timePlayed += 60
      }, 1000 * 60)
    },
    // 订阅足球技术时时数据
    setMqtt(){
      const mqtt = new MqttBase(this.getMessage)
      this.mqtt = mqtt
      this.subscribePath = `topic_mq/match/${this.query.id}/statisticsSoccer`
      this.mqtt.subscribe(this.subscribePath)
    },
    // 处理消息 text-live-charts
    getMessage(topic, val) {
      if(topic.indexOf(this.subscribePath) !== -1){
        if (typeof val == 'object' && Object.keys(val).length > 1) {
          this.soccerData = Object.assign(this.soccerData, val)
          // 时间
          this.timePlayed = val.time ? Number(val.time) : this.timePlayed
          this.setTimePlayed()
        }
      }
    },
  }
}
</script>
<style lang="postcss" scoped>
.d-table {
  display: table;
}
.d-table-cell {
  display: table-cell;
  vertical-align: middle;
}
.text-live-charts {
  padding-bottom: 18px;
  border-bottom: 1px dashed #CCCCCC;
  .duration {
    height: 40px;
    line-height: 40px;
    text-align: center;
    margin-bottom: -6px;
    span {
      font-size: 12px;
      color: #666;
      &.red {
        color: #E15756;
        margin-left: 2px;
      }
    }
  }
  .charts-box {
    .team-box {
      text-align: center;
      .team-info {
        .name {
          width: 120px;
          font-size: 20px;
          color: #3683FF;
          margin-bottom: 16px;
          display: block;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &.red {
            color: #E15756;
          }
        }
        .logo {
          width: 60px;
          height: 60px;
        }
      }
      .fraction {
        width: 100px;
        .inner {
          width: 100px;
          font-size: 60px;
          font-weight: bold;
          color: #333;
          overflow: hidden;
          line-height: 70px;
        }
      }
      .cards {
        padding: 10px 0 0 25px;
        &.right {
          .card-item {
            float: right;
            margin-left: 12px;
            margin-right: 0;
          }
        }
        .card-item {
          float: left;
          margin-right: 12px;
          &:last-child {
            margin-right: 0;
          }
          .svg-icon {
            font-size: 18px;
            margin-right: 4px;
          }
          span {
            font-size: 14px;
            color: #666666;
          }
        }
      }
    }
    .team-left {
      .team-info {
        padding-left: 25px;
        margin-right: 70px;
      }
    }
    .team-right {
      padding-right: 25px;
      .team-info {
        margin-left: 70px;
      }
    }
    .charts-list {
      width: 620px;
      font-size: 12px;
    }
  }
}
</style>