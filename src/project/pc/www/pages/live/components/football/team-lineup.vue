<template>
  <div class="team-lineup">
    <div
      v-if="!hostTeamList.length"
      class="no-data"
    >
      <p>没有阵容数据</p>
    </div>

    <div v-else>
      <!-- 球队 -->
      <div class="team-title">
        <div class="t-left-box">
          <b class="name">{{ teamLineUp.hostTeamName }} {{ handleFormation(teamLineUp.hostFormation) }}</b>
          <DefaultImg
            :src="teamLineUp.hostTeamLogo"
            :default-url="defaultImg.football"
            class="team-logo"
          />
        </div>
        <div class="t-right-box">
          <DefaultImg
            :src="teamLineUp.guestTeamLogo"
            :default-url="defaultImg.football"
            class="team-logo"
          />
          <b class="name">{{ teamLineUp.guestTeamName }} {{ handleFormation(teamLineUp.guestFormation) }}</b>
        </div>
      </div>

      <!-- 阵型图 -->
      <LineupMap :lineupData="teamLineUp"></LineupMap>
      <!-- 首发阵容 -->
      <div
        v-for="(item, index) in maxLineupLength"
        :key="'lineup'+index"
        class="t-list"
      >
        <div class="t-left-box">
          <div class="t-list-item">
            {{ hostTeamList[index]|renderField('shirtNumber') }}-{{ hostTeamList[index]|renderField('playerName') }}
          </div>
          <div class="t-list-item">
            {{ handlePosition(hostTeamList[index]) }}
          </div>
        </div>
        <div class="t-right-box">
          <div class="t-list-item">
            {{ handlePosition(guestTeamList[index]) }}
          </div>
          <div class="t-list-item">
            {{ hostTeamList[index]|renderField('shirtNumber') }}-{{ (guestTeamList[index] || {}).playerName }}
          </div>
        </div>
      </div>

      <!-- 替补球员 -->
      <div class="sub-title">
        <h2 class="fl">替补球员</h2>
        <h2 class="fr">替补球员</h2>
      </div>
      <div
        v-for="(item, index) in maxSubLength"
        :key="'sub'+index"
        class="t-list"
      >
        <div class="t-left-box">
          <div class="t-list-item">
            {{ hostSubstitute[index]|renderField('shirtNumber') }}-{{ hostSubstitute[index]|renderField('playerName') }}
          </div>
        </div>
        <div class="t-right-box">
          <div class="t-list-item">
            {{ guestSubstitute[index]|renderField('shirtNumber') }}-{{ guestSubstitute[index]|renderField('playerName') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import LineupMap from './lineup-map'
import { Promise } from 'q';
export default {
  components: {
    LineupMap
  },
  filters: {
    renderField: function(item, field) {
      if(!item) {
        return ''
      }
      return item[field]
    }
  },
  data() {
    return {
      query: {},
      // 阵容数据
      teamLineUp: {},
      allPlayers: [],
      // 阵容最大数
      maxLineupLength: 0,
      // 替补最大数
      maxSubLength: 0,
      // 主队阵容
      hostTeamList: [],
      // 主队替补(总球员-阵容)
      hostSubstitute: [],
      // 客队阵容
      guestTeamList: [],
      // 客队阵容(总球员-阵容)
      guestSubstitute: [],
      positionMap: {
        '0': '守门员',
        '1': '后卫',
        '2': '后腰',
        '3': '中场',
        '4': '前腰',
        '5': '前锋',
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init () {
      this.getParams()
      // 获取阵容数据
      const p1 = this.$get('/v4/matchLineup/getMatchLineup', {
        matchId: this.query.id
      })

      // 获取比赛历史事件
      const p2 = this.$get('/v4/matchEvent/getMatchEventAndCount', {
        matchId: this.query.id
      })

      Promise.all([p1, p2]).then(resArr => {
        this.handleLineup(resArr[0])
        this.handleEvent(resArr[1])
      })
    },
    handleLineup(res) {
      if (res.data) {
        this.teamLineUp = res.data || {}
        // 处理阵容数据
        const host = this.teamLineUp.hostTeamMatchLineupList || []
        const guest = this.teamLineUp.guestTeamMatchLineupList || []
        this.allPlayers = host.concat(guest)
        // 主队
        if(host.length) {
          host.forEach(item => {
            if(item.substitute === 1) {
              this.hostTeamList.push(item)
            } else {
              this.hostSubstitute.push(item)
            }
          })
        }

        // 客队
        if(guest.length) {
          guest.forEach(item => {
            if(item.substitute === 1) {
              this.guestTeamList.push(item)
            } else {
              this.guestSubstitute.push(item)
            }
          })
        }

        // 计算阵容和替补最大数量
        const hostLength = this.hostTeamList.length
        const guestLength = this.guestTeamList.length
        const hostSubLength = this.hostSubstitute.length
        const guestSubLength = this.guestSubstitute.length
        // 最大阵容
        this.maxLineupLength = hostLength > guestLength ?  hostLength : guestLength
        // 最大替补
        this.maxSubLength = hostSubLength > guestSubLength ?  hostSubLength : guestSubLength
      }
    },
    handleEvent(res) {
      const eventList = res.data.matchEventList || []
      eventList.forEach(event => {
        this.allPlayers.forEach(player => {
          if (event.playerId === player.playerId || (event.typeId === 23 && event.playerId2 == player.playerId)) {
            // 判断是否存在该事件
            if (player[event.typeId]) {
              player[event.typeId].count += 1
              player[event.typeId].time.push(event.time)
            } else {
              player[event.typeId] = {
                typeName: event.typeName,
                count: 1,
                time: [event.time]
              }
            }
          }
        })
      })
    },
    // 存储页面参数
    getParams() {
      this.query = this.$route.query || {}
    },
    // 处理阵型显示
    handleFormation(data) {
      let ret = ''
      if (data) {
        if (data.indexOf('-') > -1) { // 4-4-2
          ret = `(${data})`
        } else { // 442
          let tmp = data.split('').join('-')
          ret = `(${tmp})`
        }
      }
      return ret
    },
    handlePosition(player) {
      let ret = ''
      if (player && player.position === 0 || player.position > 0) {
        ret = this.positionMap[player] || ''
      }
      return ret
    }
  }
}
</script>
<style lang="postcss" scoped>
.no-data {
  font-size: 16px;
  text-align: center;
  padding: 100px 0;
}
.team-lineup {
  padding-bottom: 60px;
  position: relative;
  .t-left-box {
    width: 260px;
    height: 100%;
    float: left;
    text-align: right;
  }
  .t-right-box {
    width: 260px;
    float: right;
  }
  .t-content-box {
    width: 200px;
    height: 100%;
    float: left;
    text-align: center;
  }
  .team-title {
    height: 90px;
    line-height: 90px;
    overflow: hidden;
    border-bottom: 1px solid #eef3f8;
    .name {
      color: #333;
      font-size: 16px;
    }
    .team-logo {
      width: 36px;
      height: 36px;
    }
    .t-left-box .name {
      margin-right: 20px;
    }
    .t-right-box .name {
      margin-left: 20px;
    }
  }
  .sub-title {
    height: 80px;
    line-height: 80px;
    padding: 0 200px;
    font-size: 16px;
    text-align: center;
    border-bottom: 1px solid #eef3f8;
  }
  .t-list {
    height: 50px;
    line-height: 50px;
    overflow: hidden;
    border-bottom: 1px solid #eef3f8;
    .player-name,
    .t-list-item {
      display: inline-block;
      max-width: 150px;
      vertical-align: middle;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .player-name {
        max-width: 100px;
      }
      .iconfont {
        vertical-align: middle;
      }
    }
    .down {
      color: rgba(98, 149, 0, 1);
    }
    .up {
      color: rgba(225, 87, 86, 1);
    }
    .t-left-box .t-list-item{
      margin-left: 35px;
    }
    .t-right-box .t-list-item{
      margin-right: 35px;
    }
  }
}
</style>