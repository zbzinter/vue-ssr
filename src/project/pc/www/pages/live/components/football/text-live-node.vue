<template>
  <div class="text-live-node">
    <div class="team-title clearfix">
      <div class="fl box">
        <span class="name">{{ matchData.hostTeamName }}</span>
        <DefaultImg
          :src="matchData.hostTeamLogo"
          :default-url="defaultImg.football"
          class="logo"
        />
      </div>
      <div class="fr box">
        <DefaultImg
          :src="matchData.guestTeamLogo"
          :default-url="defaultImg.football"
          class="logo"
        />
        <span class="name">{{ matchData.guestTeamName }}</span>
      </div>
    </div>
    <div class="live-content">
      <!-- <div 
        v-if="eventAll && eventAll.length"
      > -->
      <div v-if="1==1">
        <!-- 内容 -->
        <div class="scroll">
          <div
            v-for="event in eventAll" 
            :key="event.eventId"
            class="list clearfix"
            :class="event.team === 1 ? 'list-left' : 'list-right'"
          >
            <div
              v-show="event.occurTime!==null"
              class="time"
            >
              {{ getTime(event.occurTime) }}'
            </div>
            <div class="icon">
              <i
                class="iconfont"
                :class="iconMap[event.typeId] || 'iconbw_ff'"
              />
            </div>
            <div class="con">
              <div
                class="des"
                v-html="event.content"
              />
            </div>
          </div>
        </div>
        <!-- 图例说明 -->
        <div class="marginal-data clearfix">
          <div class="inner">
            <div class="title">
              图例说明
            </div>
            <div class="icon-list">
              <div
                v-for="(item, index) in marginalData"
                :key="index"
                class="icon-item"
              >
                <img
                  :src="item.img"
                  alt=""
                >
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="no-data"
      >
        暂无事件直播数据
      </div>
    </div>
  </div>
</template>
<script>
import MqttBase from '@utils/MqttBase'
export default {
  components: {
  },
  props: ['matchData'],
  data() {
    return {
      timer: null,
      eventAll: '',
      iconMap: {
        9: 'an_bg',
        12: 'ao_bj',
        18: 'aq_bj',
        21: 'as_bj',
        22: 'ar_bj',
        23: 'at_bj',
        30: 'am_bj',
        34: 'au_bi iconau_bi',
      },
      mqtt: null,
      topic: '',
      // 图例说明
      marginalData: [
        {
          name: '角球',
          img: require('../../../../assets/score/football/am_bj.png')
        },
        {
          name: '入球',
          img: require('../../../../assets/score/football/an_bj.png')
        },
        {
          name: '点球',
          img: require('../../../../assets/score/football/ao_bj.png')
        },
        {
          name: '乌龙球',
          img: require('../../../../assets/score/football/ap_bj.png')
        },
        {
          name: '红牌',
          img: require('../../../../assets/score/football/ar_bj.png')
        },
        {
          name: '黄牌',
          img: require('../../../../assets/score/football/aq_bj.png')
        },
        {
          name: '两黄变红',
          img: require('../../../../assets/score/football/as_bj.png')
        },
        {
          name: '换人',
          img: require('../../../../assets/score/football/at_bj.png')
        },
        {
          name: '受伤',
          img: require('../../../../assets/score/football/au_bi.png')
        }
      ]
    }
  },
  created () {
    this.getAllMatchEvent()
    this.timer = window.setInterval(()=>{
      this.getAllMatchEvent()
    }, 10000)
  },
  beforeDestroy () {
    window.clearInterval(this.timer)
    this.mqtt.unsubscribe(this.topic)
  },
  methods: {
    getAllMatchEvent(){
      this.$get('/v5/matchEvent/all', { matchId: this.matchData.matchId }).then(res => {
        this.eventAll = res.data.events
        // this.topic = ['topic_mq/match/' + this.matchData.matchId + '/eventPhrase']
      // this.setMqtt()
      })
    },
    getTime (currentTime) {
      let time = Math.floor(currentTime / 60)
      return isNaN(time) ? '' : time
    },
    setMqtt () {
      this.mqtt = new MqttBase(this.getMessage)
      this.mqtt.subscribe(this.topic)
    },
    // text-live-node
    getMessage (topic, mqttMsg) {
      if (/^(8|9|18|22|23|30|34)$/.test(mqttMsg.typeId) || /乌龙球/.test(mqttMsg.content)) {
        mqttMsg.content = mqttMsg.content.replace('{team1}', this.matchData.hostTeamName )
        mqttMsg.content = mqttMsg.content.replace('{team2}', this.matchData.guestTeamName )
        if(mqttMsg.occurTime === 0) mqttMsg.occurTime = null
        this.eventAll.unshift(mqttMsg)
      }
    }
  }
}
</script>
<style lang="postcss" scoped>
.an_bg {
  background: url('../../../../assets/score/football/an_bj.png');
}
.aq_bj {
  background: url('../../../../assets/score/football/aq_bj.png');
}
.ar_bj, .iconas_bj {
  background: url('../../../../assets/score/football/ar_bj.png');
}
.ao_bj {
  background: url('../../../../assets/score/football/ao_bj.png');
}
.ap_bj {
  background: url('../../../../assets/score/football/ap_bj.png');
}
.am_bj {
  background: url('../../../../assets/score/football/am_bj.png');
}
.at_bj {
  background: url('../../../../assets/score/football/at_bj.png');
}
.no-data {
  text-align: center;
  background: #fff;
  padding: 30px 0;
  font-size: 16px;
  position: relative;
}
.text-live-node {
  padding: 25px 14px;
  .team-title {
    margin-bottom: 40px;
    .box.fl {
      text-align: right;
      .name {
        color: #3683FF;
        margin-right: 24px;
      }
    }
    .box.fr {
      .name {
        color: #E15756;
        margin-left: 24px;
      }
    }
    .box {
      width: 390px;
      .name {
        font-size: 16px;
        font-weight: bold;
        color: #333333;
        max-width: 410px;
        line-height: 34px;
        display: inline-block;
        vertical-align: middle;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .logo {
        width: 34px;
        height: 34px;
      }
    }
  }
  .live-content {
    position: relative;
    &:before {
      content: "";
      width: 0;
      height: 100%;
      border-left: 1px dashed #ddd;
      position: absolute;
      right: 50%;
      top: 0;
      z-index: 0;
    }
    .scroll {
      height: 550px;
      padding-bottom: 40px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        width: 6px;
        background: #d8d8d8;
      }
      &::-webkit-scrollbar-thumb {
        background: #3683ff;
      }
    }
    .list {
      width: 50%;
      min-height: 48px;
      margin-top: 38px;
      position: relative;
      display: table;
      .icon i {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 20px;
        height: 20px;
        text-align: center;
        background-size: contain;
        transform: translate(-50%, -50%);
      }
      &.list-left {
        float: left;
        text-align: right;
        padding-right: 96px;
        margin-left: 24px;
        .icon {
          right: 0;
          
        }
        .time {
          right: 48px;
          text-align: left;
          padding-left: 8px;
        }
      }
      &.list-right {
        float: right;
        padding-left: 96px;
        margin-right: 24px;
        .icon {
          left: 0;
        }
        .time {
          left: 48px;
          text-align: right;
          padding-right: 8px;
        }
      }
      .con {
        display: table-cell;
        vertical-align: middle;
      }
      .icon {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        overflow: hidden;
        background: #f5f5f5;
        position: absolute;
        top: 50%;
        margin-top: -24px;
      }
      .title {
        font-size: 18px;
        color: #333;
        line-height: 25px;
        margin-bottom: 8px;
      }
      .des {
        font-size: 14px;
        color: #666;
        line-height: 20px;
      }
      .time {
        width: 48px;
        height: 48px;
        line-height: 48px;
        position: absolute;
        top: 50%;
        margin-top: -24px;
      }
    }
    .marginal-data {
      padding-top: 30px;
      background: #fff;
      position: relative;
      z-index: 2;
      margin: 0px -14px -25px -14px;
      .inner {
        height: 60px;
        line-height: 60px;
        border-top: 1px dashed #ccc;
        .title {
          float: left;
          font-size: 14px;
          color: #666666;
          padding: 0 60px 0 30px;
        }
        .icon-item {
          float: left;
          margin-right: 20px;
          img {
            width: 18px;
            height: 18px;
            margin-right: 8px;
          }
          span {
            font-size: 12px;
            color: #666666;
          }
        }
      }
    }
  }
}
.iconau_bi {
  color: #f44d4d;
}
</style>