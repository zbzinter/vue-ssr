<template>
  <div class="handicap-data">
    <div class="handicap-title">
      {{ matchData.matchTime|formatTime }} <span
        v-if="matchData.sportId === 1 || matchData.sportId === 5"
        class="round"
      >{{ matchData.leagueName }}{{ matchData.round }}</span>
    </div>

    <!-- 网球 -->
    <div
      v-if="matchData.sportId === 5"
      class="content tennis-content"
    >
      <div class="fl team">
        <div class="user-list">
          <DefaultImg
            :src="matchData.hostTeamLogo"
            :default-url="defaultImg.tennis"
            class="team-logo"
          />
          <DefaultImg
            v-if="isDouble"
            :default-url="defaultImg.tennis"
            class="team-logo double-left"
          />
        </div>
        <div
          class="name-list"
          :class="{double: isDouble}"
        >
          <span class="team-name">{{ splitName(matchData.hostTeamName)[0] }}</span>
          <span
            v-if="isDouble"
            class="team-name"
          >{{ splitName(matchData.hostTeamName)[1] }}</span>
        </div>
      </div>
      <div class="fr team">
        <div
          class="name-list right-name-list"
          :class="{double: isDouble}"
        >
          <span class="team-name">{{ splitName(matchData.guestTeamName)[0] }}</span>
          <span
            v-if="isDouble"
            class="team-name"
          >{{ splitName(matchData.guestTeamName)[1] }}</span>
        </div>
        <div class="user-list">
          <DefaultImg
            :src="matchData.guestTeamLogo"
            :default-url="defaultImg.tennis"
            class="team-logo"
          />
          <DefaultImg
            v-if="isDouble"
            class="team-logo double-right"
            :default-url="defaultImg.tennis"
          />
        </div>
      </div>
      <div class="data-box">
        <div class="list-title">
          <p>初</p>
          <p>即</p>
        </div>
        <dl 
          class="list"
        >
          <dt>欧指</dt>
          <dd>
            <span class="cell">{{ getOdd(oddsData[1], 'value0ForType1') }}</span>
            <span class="cell">{{ getOdd(oddsData[1], 'value0ForType2') }}</span>
          </dd>
          <dd>
            <span class="cell">{{ getOdd(oddList[0], 'valueForType1') }}</span>
            <span class="cell">{{ getOdd(oddList[0], 'valueForType2') }}</span>
          </dd>
        </dl>
      </div>
    </div>

    <!-- 篮球和足球 -->
    <div
      v-else
      class="content"
    >
      <div class="fl team">
        <DefaultImg
          :src="matchData.sportId === 1 ? matchData.hostTeamLogo : matchData.guestTeamLogo"
          :default-url="getDefaultTeamLogo(matchData.sportId)"
          class="team-logo"
        />
        <span class="team-name">{{ matchData.sportId === 1 ? matchData.hostTeamName : matchData.guestTeamName }} <span v-if="matchData.sportId === 2">（客）</span></span>
      </div>
      <div class="fr team">
        <span class="team-name"><span v-if="matchData.sportId === 2">（主）</span>{{ matchData.sportId === 1 ? matchData.guestTeamName : matchData.hostTeamName }}</span>
        <DefaultImg
          :src="matchData.sportId === 1 ? matchData.guestTeamLogo : matchData.hostTeamLogo"
          :default-url="getDefaultTeamLogo(matchData.sportId)"
          class="team-logo"
        />
      </div>
      <div class="data-box">
        <div class="list-title">
          <p>初</p>
          <p>即</p>
        </div>
        <dl 
          v-for="(e, index) in [0,1,2]"
          :key="index"
          class="list"
        >
          <dt>{{ titles[matchData.sportId][index] }}</dt>
          <dd
            v-for="(item, index2) in [0,1]"
            :key="index2"
          >
            <span
              v-if="matchData.sportId === 1"
              class="cell"
            >{{ getOdd(oddList[index], index2 === 0 ? 'value0ForType1' : 'valueForType1' ) }}</span>
            <span
              v-if="matchData.sportId === 2"
              class="cell"
            >{{ getOdd(oddList[index], index2 === 0 ? 'value0ForType2' : 'valueForType2') }}</span>
            <span class="cell">{{ getOdd(oddList[index], index2 === 0 ? index === 0 ? 'value0ForTypeX' : 'ovalue0' : index === 0 ? 'valueForTypeX' : 'ovalue') }}</span>
            <span
              v-if="matchData.sportId === 2"
              class="cell"
            >{{ getOdd(oddList[index], index2 === 0 ? 'value0ForType1' : 'valueForType1' ) }}</span>
            <span
              v-if="matchData.sportId === 1"
              class="cell"
            >{{ getOdd(oddList[index], index2 === 0 ? 'value0ForType2' : 'valueForType2') }}</span>
          </dd>
        </dl>
      </div>   
    </div>
  </div>
</template>
<script>

//          即时     滚球
// typeId 1 让球 对应 121
// typeId 2 欧指 对应 128
// typeId 3 大小球 对应122
// 赛事进行时,滚球替换即时  ovalue ovalueNum valueForType1 valueForType2 valueForTypeX

import dayjs from 'dayjs'
import MqttBase from '@utils/MqttBase'
export default {
  filters: {
    formatTime: function(date) {
      return dayjs(date).format('MM月DD日 HH:mm')
    }
  },
  props: {
    matchData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      titles: {
        1: ['欧指', '让球', '大小球'],
        2: ['欧指', '让分', '总分']  
      },
      oddsData: [],
      topic: ''
    }
  },
  computed: {
    isDouble() {
      return this.splitName(this.matchData.hostTeamName).length > 1
    },
    oddList () {
      let arr = []
      let oddsData = [...this.oddsData]
      if (this.matchData.matchStatus === 2) {
        // arr = [this.oddsData[3], this.oddsData[4], this.oddsData[5]]
        let obj = {
          1: 3,
          0: 4,
          2: 5
        }
        Object.keys(obj).forEach(item => {
          const arrText = ['ovalue', 'ovalueNum', 'valueForType1', 'valueForType2', 'valueForTypeX']
          arrText.forEach(e => {
            if (oddsData[item]) {
              oddsData[item][e] = oddsData[obj[item]][e]
            }
          })
        })
        arr = [oddsData[1], oddsData[0], oddsData[2]]
      } else {
        arr = [this.oddsData[1], this.oddsData[0], this.oddsData[2]]
      }
      return arr
    }
  },
  created () {
    this.$get('/v8/queryOdd', {
      matchId: this.matchData.matchId,
      bookId: 31
    }).then(res => {
      this.oddsData = res.data && res.data.filter(Boolean);
      [1,2,3,121,128,122].forEach((item) => {
        res.data && res.data.forEach(e => {
          if (e && e.typeId === item) {
            this.oddsData.push(e)
          }
        })
      })
        
    })

  },
  mounted () {
    this.topic = 'topic_mq/match/' + this.matchData.matchId + '/compareOdds'
    this.setMqtt()
  },
  beforeDestroy () {
    this.mqtt.unsubscribe(this.topic)
  },
  methods: {
    getOdd (obj, attr) {
      if (obj) {
        return obj[attr] || '-'
      }
      return '-'
    },
    setMqtt() {
      const mqtt = new MqttBase(this.getMessage)
      this.mqtt = mqtt
      this.mqtt.subscribe(this.topic)
    },
    getMessage (topic, mqttMsg) {
      if (mqttMsg.bookId === 31) {
        [1,2,3,121,128,122].forEach((item, index) => {
          if (Number(item) === Number(mqttMsg.typeId)) {
            this.oddsData[index] = Object.assign(this.oddsData[index] || {}, mqttMsg)
          }
        })
      }
    },
    // 网球，球员名称分割
    splitName(name) {
      if(!name) return ['-']
      return name.split('/')
    },
  }
}
</script>
<style lang="postcss" scoped>
.handicap-data {
  height: 124px;
  .handicap-title {
    height: 46px;
    line-height: 46px;
    text-align: center;
    color: #666;
    font-size: 16px;
    .round {
      margin-left: 18px;
    }
  }
  .content {
    height: 78px;
    background: #fff url(../../../assets/live/handicap-bg.png) no-repeat center center / auto 66px;
    /* 网球 */
    &.tennis-content {
      .team {
        .user-list {
          float: left;
          margin: 0 24px;
          .team-logo {
            float: left;
            width: 50px;
            height: 50px;
            border-radius: 50px;
            border: 2px solid rgba(255,255,255,0.60);
            margin: 14px 0 0 0;
            position: relative;
            &.double-left {
              margin-left: -15px;
            }
            &.double-right {
              margin-right: -15px;
            }
          }
        }
        .name-list {
          float: left;
          margin: 0 -4px;
          height: 100%;
          &.right-name-list {
            text-align: right;
          }
          &.double {
            padding-top: 13px;
            .team-name {
              line-height: 26px;
            }
          }
          .team-name {
            font-size: 18px;
            max-width: 290px;
            float: none;
            display: block;
          }
        }
      }
    }
    .team {
      .team-logo {
        float: left;
        width: 60px;
        height: 60px;
        margin: 9px 20px 0 24px;
      }
      .team-name {
        float: left;
        max-width: 190px;
        display: inline-block;
        font-size: 20px;
        color: #333;
        font-weight: bold;
        line-height: 78px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .data-box {
      text-align: center;
      padding-top: 6px;
      .list-title {
        display: inline-block;
        padding-top: 22px;
        vertical-align: top;
        margin-right: -15px;
        p {
          height: 22px;
          line-height: 22px;
          font-size: 12px;
          color: #333;
        }
      }
      .list {
        display: inline-block;
        padding: 0 20px;
        dt,
        dd {
          height: 22px;
          line-height: 22px;
          overflow: hidden;
          font-size: 12px;
          color: #333;
          .cell {
            min-width: 40px;
            color: #666;
            float: left;
          }
        }
      }
    }
  }
}
</style>