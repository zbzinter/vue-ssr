<template>
  <div class="team-content">
    <div class="team-vs">
      <div class="vs-left">
        <p class="team-name">
          {{ hostTeamName }}
        </p>
        <ul
          v-if="filterMatchEvent.length"
          class="match-list"
        >
          <li
            v-for="(item, index) in filterMatchEvent"
            :key="index"
          >
            <div v-if="item.team == 1">
              <p>
                {{ item.playerName ? item.playerName : '' }}{{ (item.typeId == 23 && item.playerName) ? '↑' : '' }}
                <span
                  v-if="item.typeId == 8 || item.typeId == 12"
                  class="ic_ao_bj"
                />
                <span
                  v-if="item.typeId == 9"
                  class="ic_an_bj"
                />
                <!-- <span
                  v-if="item.typeId == 18"
                  class="ic_aq_bj"
                /> -->
                <span
                  v-if="item.typeId == 21"
                  class="ic_as_bj"
                />
                <span
                  v-if="item.typeId == 22"
                  class="ic_ar_bj"
                />
                <span
                  v-if="item.typeId == 23"
                  class="ic_at_bj"
                />
                <span
                  v-if="item.typeId == 30"
                  class="ic_am_bj"
                />
              </p>
              <p
                v-if="item.playerName2 && item.typeId == 9"
                class="line2-text"
              >
                (助攻：{{ item.playerName2 }}})
              </p>
              <p
                v-if="item.playerName2 && item.typeId == 23"
                class="line2-text"
              >
                {{ item.playerName2 }}↓
              </p>
            </div>
          </li>
        </ul>
      </div>
      <div class="vs-middle">
        <p class="vs-text">
          vs
        </p>
        <ul
          v-if="filterMatchEvent.length"
          class="point-list"
        >
          <li
            v-for="(item, index) in filterMatchEvent"
            :key="index"
          >
            <p>{{ !isNaN(item.time) ? parseInt(item.time/60) : '' }}`</p>
          </li>
        </ul>
      </div>
      <div class="vs-right">
        <p class="team-name">
          {{ guestTeamName }}
        </p>
        <ul
          v-if="filterMatchEvent.length"
          class="match-list"
        >
          <li
            v-for="(item, index) in filterMatchEvent"
            :key="index"
          >
            <div v-if="item.team == 2">
              <p>
                <span
                  v-if="item.typeId == 8 || item.typeId == 12"
                  class="ic_ao_bj"
                />
                <span
                  v-if="item.typeId == 9"
                  class="ic_an_bj"
                />
                <!-- <span
                  v-if="item.typeId == 18"
                  class="ic_aq_bj"
                /> -->
                <span
                  v-if="item.typeId == 21"
                  class="ic_as_bj"
                />
                <span
                  v-if="item.typeId == 22"
                  class="ic_ar_bj"
                />
                <span
                  v-if="item.typeId == 23"
                  class="ic_at_bj"
                />
                <span
                  v-if="item.typeId == 30"
                  class="ic_am_bj"
                />
                {{ item.playerName ? item.playerName : '' }}{{ (item.typeId == 23 && item.playerName) ? '↑' : '' }}
              </p>
              <p
                v-if="item.playerName2 && item.typeId == 9"
                class="line2-text-right"
              >
                (助攻：{{ item.playerName2 }}})
              </p>
              <p
                v-if="item.playerName2 && item.typeId == 23"
                class="line2-text-right"
              >
                {{ item.playerName2 }}↓
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <p
      v-if="isShowInfoTech"
      class="progress-title"
    >
      技术统计
    </p>
    <div
      v-if="isShowInfoTech"
      class="progress-section"
    >
      <ul class="progress-list">
        <li v-if="info.tech.possession">
          <div class="left-item">
            <TotalProgress
              position="right"
              :percent="byDivide(info.tech.possession.team1, (info.tech.possession.team1 + info.tech.possession.team2 )) * 100"
            >
              {{ info.tech.possession.team1 }}%
            </TotalProgress>
          </div>
          <p class="center-item">
            控球率
          </p>
          <div class="right-item">
            <TotalProgress
              position="left"
              :percent="byDivide(info.tech.possession.team2, (info.tech.possession.team1 + info.tech.possession.team2 )) * 100"
            >
              {{ info.tech.possession.team2 }}%
            </TotalProgress>
          </div>
        </li>

        <li v-if="info.tech.shootOnGoal">
          <div class="left-item">
            <TotalProgress
              position="right"
              :percent="byDivide((info.tech.shootOnGoal.team1 + info.tech.shootOffGoal.team1), (info.tech.shootOnGoal.team1 + info.tech.shootOffGoal.team1 + info.tech.shootOnGoal.team2 + info.tech.shootOffGoal.team2)) * 100"
            >
              {{ info.tech.shootOnGoal.team1 + info.tech.shootOffGoal.team1 }}
            </TotalProgress>
          </div>
          <p class="center-item">
            射门
          </p>
          <div class="right-item">
            <TotalProgress
              position="left"
              :percent="byDivide((info.tech.shootOnGoal.team2 + info.tech.shootOffGoal.team2), (info.tech.shootOnGoal.team1 + info.tech.shootOffGoal.team1 + info.tech.shootOnGoal.team2 + info.tech.shootOffGoal.team2)) * 100"
            >
              {{ info.tech.shootOnGoal.team2 + info.tech.shootOffGoal.team2 }}
            </TotalProgress>
          </div>
        </li>
        <li v-if="info.tech.shootOnGoal">
          <div class="left-item">
            <TotalProgress
              position="right"
              :percent="byDivide(info.tech.shootOnGoal.team1, (info.tech.shootOnGoal.team1 + info.tech.shootOnGoal.team2)) * 100"
            >
              {{ info.tech.shootOnGoal.team1 }}
            </TotalProgress>
          </div>
          <p class="center-item">
            射正
          </p>
          <div class="right-item">
            <TotalProgress
              position="left"
              :percent="byDivide(info.tech.shootOnGoal.team2, (info.tech.shootOnGoal.team1 + info.tech.shootOnGoal.team2)) * 100"
            >
              {{ info.tech.shootOnGoal.team2 }}
            </TotalProgress>
          </div>
        </li>

        <li v-if="info.tech.cornerKicks">
          <div class="left-item">
            <TotalProgress
              position="right"
              :percent="byDivide(info.tech.cornerKicks.team1, (info.tech.cornerKicks.team1 + info.tech.cornerKicks.team2 )) * 100"
            >
              {{ info.tech.cornerKicks.team1 }}
            </TotalProgress>
          </div>
          <p class="center-item">
            角球
          </p>
          <div class="right-item">
            <TotalProgress
              position="left"
              :percent="byDivide(info.tech.cornerKicks.team2, (info.tech.cornerKicks.team1 + info.tech.cornerKicks.team2 )) * 100"
            >
              {{ info.tech.cornerKicks.team2 }}
            </TotalProgress>
          </div>
        </li>

        <li v-if="info.tech.yellowCards">
          <div class="left-item">
            <TotalProgress
              position="right"
              :percent="byDivide(info.tech.yellowCards.team1, (info.tech.yellowCards.team1 + info.tech.yellowCards.team2)) * 100"
            >
              {{ info.tech.yellowCards.team1 }}
            </TotalProgress>
          </div>
          <p class="center-item">
            黄牌
          </p>
          <div class="right-item">
            <TotalProgress
              position="left"
              :percent="byDivide(info.tech.yellowCards.team2, (info.tech.yellowCards.team1 + info.tech.yellowCards.team2 )) * 100"
            >
              {{ info.tech.yellowCards.team2 }}
            </TotalProgress>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import TotalProgress from './TotalProgress'
export default {
  components: {
    TotalProgress
  },
  props: {
    hostTeamName: {
      type: String,
      default: ''
    },
    guestTeamName: {
      type: String,
      default: ''
    },
    info: {
      type: Object,
      default: () => {
        return {
          tech: {},
          matchEvent: []
        }
      }
    }
  },
  computed: {
    isShowInfoTech(){
      let { possession, shootOnGoal, cornerKicks, yellowCards} = this.info.tech || {}
      return possession || shootOnGoal || cornerKicks || yellowCards
    },
    filterMatchEvent(){
      if(this.info && Array.isArray(this.info.matchEvent) && this.info.matchEvent.length) {
        return this.info.matchEvent.filter(item=>item.typeId!==18)
      }
      return []
    }
  },
  methods: {
    byDivide (front, back) {
      return (front + back) ? front / (front + back) : 0
    }
  }
}
</script>
<style lang="scss" scoped>
.progress-title {
  font-size: 14px;
  color: #ffffff;
  line-height: 32px;
  text-align: center;
  background: #333333;
}
.team-content {
  width: 383px;
  background: rgba(0, 0, 0, 0.85);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.09);
  border-radius: 4px;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  padding: 0 0 20px 0;
}

.progress-list {
  li {
    overflow: hidden;
    font-size: 14px;
    color: #ffffff;
    line-height: 20px;
    padding: 5px 0;
    border-bottom: solid 1px #333333;
    margin: 0 29px;
    &:last-child {
      border: none;
    }
    .left-item {
      float: left;
    }
    .center-item {
      float: left;
      width: 58px;
      text-align: center;
    }
    .right-item {
      float: left;
    }
  }
}
.team-vs {
  overflow: hidden;
  padding: 26px 15px 0 15px;
  .vs-left,
  .vs-right {
    width: 150px;
    float: left;
  }
  .vs-left {
    text-align: right;
    margin-right: 12px;
  }
  .vs-middle {
    width: 28px;
    float: left;
    text-align: center;
  }
  .vs-right {
    text-align: left;
    margin-left: 12px;
  }
  .team-name {
    font-size: 16px;
    color: #ffffff;
    line-height: 22px;
    @include ellipsis(150px);
  }
  .vs-text {
    font-size: 17px;
    color: #e13f3d;
    line-height: 22px;
  }
  .match-list {
    padding-top: 28px;
    li {
      height: 41px;
      font-size: 12px;
      color: #ffffff;
      line-height: 15px;
      p {
        white-space: normal;
        font-family: PingFangSC-Regular;
        font-size: 12px;
      }
    }
  }

  .point-list {
    li {
      margin-top: 21px;
      $radius:20px;
      &:first-child {
        p {
          position: relative;
          &::before {
            content: '';
            position: absolute;
            left: 50%;
            top: -$radius;
            z-index: 0;
            width: 1px;
            height: 31px;
            background: #ffffff;
            background: url('../assets/vs_line.png') center top no-repeat;
          }
        }
      }

      &:last-child {
        margin-bottom: 31px;
        p::after {
          background: url('../assets/vs_line.png') center bottom no-repeat;
        }
      }

      p {
        width: $radius;
        height: $radius;
        border-radius: 50%;
        background: #ffffff;
        text-align: center;
        line-height: $radius;
        font-size: 12px;
        color: #333333;
        position: relative;
        &::after {
          content: '';
          position: absolute;
          left: 50%;
          top: $radius;
          z-index: 0;
          width: 1px;
          height: 31px;
          background: #ffffff;
        }
      }
    }
  }
}

/* 
红牌 ic_ar_bj
黄牌 ic_aq_bj
换人 ic_at_bj
角球 ic_am_bj
进球 ic_an_bj  1
进点球 ic_ao_bj
进乌龙球 ic_ap_bj
2黄变1红 ic_as_bj */

.ic_ar_bj,
.ic_aq_bj,
.ic_at_bj,
.ic_am_bj,
.ic_an_bj,
.ic_ao_bj,
.ic_ap_bj,
.ic_as_bj {
  font-size: 14px;
  display: inline-block;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background-position: center bottom;
  width: 14px;
  height: 1.1em;
  margin-bottom:-2px;
}
.ic_ar_bj {
  background-image: url(../assets/score/football/ar_bj.png);
}
.ic_aq_bj {
  background-image: url(../assets/score/football/aq_bj.png);
}
.ic_at_bj {
  background-image: url(../assets/score/football/at_bj.png);
}
.ic_am_bj {
  background-image: url(../assets/score/football/am_bj.png);
}
.ic_an_bj {
  background-image: url(../assets/score/football/an_bj.png);
}
.ic_ao_bj {
  background-image: url(../assets/score/football/ao_bj.png);
}
.ic_ap_bj {
  background-image: url(../assets/score/football/ap_bj.png);
}
.ic_as_bj {
  background-image: url(../assets/score/football/as_bj.png);
}

.line2-text {
  padding-right: 14px;
  white-space:pre-wrap;
}
.line2-text-right{
    padding-left: 14px;
  white-space:pre-wrap;
}
</style>
