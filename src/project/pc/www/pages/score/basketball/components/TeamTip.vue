<template>
  <div
    class="team-content"
  >
    <div
      class="progress-section"
    >
      <ul class="progress-list">
        <li>
          <div class="left-item">
            <TotalProgress
              position="right"
              :percent="byDivide(info.guestTwPnt, (info.guestTwPnt + info.hostTwPnt )) * 100"
            >
              {{ info.guestTwPnt || 0 }}
            </TotalProgress>
          </div>
          <p class="center-item">
            两分球
          </p>
          <div class="right-item">
            <TotalProgress
              position="left"
              :percent="byDivide(info.hostTwPnt, (info.guestTwPnt + info.hostTwPnt )) * 100"
            >
              {{ info.hostTwPnt || 0 }}
            </TotalProgress>
          </div>
        </li>

        <li>
          <div class="left-item">
            <TotalProgress
              position="right"
              :percent="byDivide(info.guestThrPnt, (info.guestThrPnt + info.hostThrPnt )) * 100"
            >
              {{ info.guestThrPnt || 0 }}
            </TotalProgress>
          </div>
          <p class="center-item">
            三分球
          </p>
          <div class="right-item">
            <TotalProgress
              position="left"
              :percent="byDivide(info.hostThrPnt, (info.guestThrPnt + info.hostThrPnt )) * 100"
            >
              {{ info.hostThrPnt || 0 }}
            </TotalProgress>
          </div>
        </li>

        <li>
          <div class="left-item">
            <TotalProgress
              position="right"
              :percent="byDivide(info.guestPnlty, (info.guestPnlty + info.hostPnlty )) * 100"
            >
              {{ info.guestPnlty || 0 }}
            </TotalProgress>
          </div>
          <p class="center-item">
            罚球得分
          </p>
          <div class="right-item">
            <TotalProgress
              position="left"
              :percent="byDivide(info.hostPnlty, (info.guestPnlty + info.hostPnlty )) * 100"
            >
              {{ info.hostPnlty || 0 }}
            </TotalProgress>
          </div>
        </li>

        <li>
          <div class="left-item">
            <TotalProgress
              position="right"
              :percent="byDivide(info.guestShtRt, (info.guestShtRt + info.hostShtRt )) * 100"
            >
              {{ info.guestShtRt || 0 }}
            </TotalProgress>
          </div>
          <p class="center-item">
            投篮命中率
          </p>
          <div class="right-item">
            <TotalProgress
              position="left"
              :percent="byDivide(info.hostShtRt, (info.guestShtRt + info.hostShtRt )) * 100"
            >
              {{ info.hostShtRt || 0 }}
            </TotalProgress>
          </div>
        </li>

        <li>
          <div class="left-item">
            <TotalProgress
              position="right"
              :percent="byDivide(info.guestFoul, (info.guestFoul + info.hostFoul )) * 100"
            >
              {{ info.guestFoul || 0 }}
            </TotalProgress>
          </div>
          <p class="center-item">
            犯规
          </p>
          <div class="right-item">
            <TotalProgress
              position="left"
              :percent="byDivide(info.hostFoul, (info.guestFoul + info.hostFoul )) * 100"
            >
              {{ info.hostFoul || 0 }}
            </TotalProgress>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import TotalProgress from '../../../../components/TotalProgress'
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
    },
    match: {
      type: Object,
      default: () => {
        return {
        }
      }
    }
  },
  computed: {
    isShowInfoTech(){
      let { guestTwPnt, hostPnlty} = this.info || {}
      return guestTwPnt || hostPnlty
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
  width: 405px;
  background: rgba(0, 0, 0, 0.85);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.09);
  border-radius: 4px;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  padding: 16px 0;
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
      width: 85px;
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
