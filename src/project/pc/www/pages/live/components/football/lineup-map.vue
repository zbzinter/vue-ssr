<template>
  <!-- 阵型图 -->
  <div class="lineup-map">
    <!-- 主队有阵型 -->
    <div class="lineup host-lineup" v-if="hostFormation">
      <div class="goalkeeper-container">
        <div class="player" :data-num="hostPlayers[0].shirtNumber || '?'">
          <img class="player-logo" src="../../../../assets/default-ball-yellow.png" />
          <p class="player-name">{{ hostPlayers[0].playerName || hostPlayers[0].playerEnName }}</p>
          <PlayerEventList :player="hostPlayers[0]"></PlayerEventList>
        </div>
      </div>
      <div class="player-container">
        <div class="row" v-for="(col, index1) in hostFormation">
          <div
            class="player"
            v-for="(player, index2) in new Array(parseInt(col))"
            :data-num="getHostPlayer(index1, index2).shirtNumber || '?'"
          >
            <img class="player-logo" src="../../../../assets/default-ball-blue.png" />
            <p
              class="player-name"
            >{{ getHostPlayer(index1, index2).playerName || getHostPlayer(index1, index2).playerEnName }}</p>

            <PlayerEventList :player="getHostPlayer(index1, index2)"></PlayerEventList>
          </div>
        </div>
      </div>
    </div>
    <!-- 主队无阵型 -->
    <div id="host-no-formation" v-else>
      <div class="player" v-for="(item,index) in hostPlayers" :data-num="hostPlayers[index].shirtNumber || '?'">
        <img v-if="index === 0" class="player-logo" src="../../../../assets/default-ball-yellow.png" />
        <img v-else class="player-logo" src="../../../../assets/default-ball-blue.png" />
        <p class="player-name">{{ hostPlayers[index].playerName || hostPlayers[index].playerEnName }}</p>
        <PlayerEventList :player="hostPlayers[index]"></PlayerEventList>
      </div>
    </div>

    <!-- 客队有阵型 -->
    <div class="lineup guest-lineup" v-if="guestFormation">
      <div class="player-container">
        <div class="row" v-for="(col, index1) in guestFormation" :key="index1">
          <div
            class="player"
            v-for="(player, index2) in new Array(parseInt(col))"
            :data-num="getGuestPlayer(index1, index2).shirtNumber || '?'"
            :key="index2"
          >
            <img class="player-logo" src="../../../../assets/default-ball-red.png" />
            <p
              class="player-name"
            >{{ getGuestPlayer(index1, index2).playerName || getGuestPlayer(index1, index2).playerEnName }}</p>

            <PlayerEventList :player="getGuestPlayer(index1, index2)"></PlayerEventList>
          </div>
        </div>
      </div>
      <div class="goalkeeper-container">
        <div class="player" :data-num="guestPlayers[0].shirtNumber || '?'">
          <img class="player-logo" src="../../../../assets/default-ball-yellow.png" />
          <p class="player-name">{{ guestPlayers[0].playerName || guestPlayers[0].playerEnName }}</p>
          <PlayerEventList :player="guestPlayers[0]"></PlayerEventList>
        </div>
      </div>
    </div>
    <!-- 客队无阵型 -->
    <div id="host-no-formation" v-else>
      <div class="player" v-for="(item,index) in guestPlayers" :data-num="guestPlayers[index].shirtNumber || '?'">
        <img v-if="index === 0" class="player-logo" src="../../../../assets/default-ball-yellow.png" />
        <img v-else class="player-logo" src="../../../../assets/default-ball-blue.png" />
        <p class="player-name">{{ guestPlayers[index].playerName || guestPlayers[index].playerEnName }}</p>
        <PlayerEventList :player="guestPlayers[index]"></PlayerEventList>
      </div>
    </div>
  </div>
</template>
<script>
import PlayerEventList from './player-event-list'
export default {
  props: ["lineupData"],
  data() {
    return {
      // 阵容数据
      teamLineUp: {},
      eventTypes: {
        goal: 9,
        penaltyKick: 10,
        assist: 11,
        ownGoal: 12,
        yellow: 18,
        doubleYellow: 21,
        red: 22,
        substitution: 23
      }
    }
  },
  components: {
    PlayerEventList
  },
  computed: {
    hostFormation() {
      const formation = this.lineupData.hostFormation
      if (formation) {
        if (formation.indexOf('-') > -1) {
          return formation.split('-')
        } else {
          return formation.split('')
        }
      }
      return ''
    },
    guestFormation() {
      const formation = this.lineupData.guestFormation
      if (formation) {
        if (formation.indexOf('-') > -1) {
          return formation.split('-').reverse()
        } else {
          return formation.split('').reverse()
        }
      }
      return ''
    },
    hostPlayers() {
      return this.lineupData.hostTeamMatchLineupList.filter(player => {
        return player.substitute === 0
      })
    },
    guestPlayers() {
      return this.lineupData.guestTeamMatchLineupList.filter(player => {
        return player.substitute === 0
      })
    }
  },
  methods: {
    getHostPlayer(index1, index2) {
      let count = 0
      for (let i = 0; i < index1; i++) {
        count += parseInt(this.hostFormation[i])
      }
      return this.hostPlayers[count + index2 + 1]
    },
    getGuestPlayer(index1, index2) {
      let count = 0
      for (let i = 0; i < index1; i++) {
        count += parseInt(this.guestFormation[i])
      }
      let base = 11 - (parseInt(this.guestFormation[index1]) + count)
      return this.guestPlayers[base + index2]
    }
  }
}
</script>
<style lang="postcss" scoped>
.lineup-map {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 420px;
  height: 831px;
  background-image: url("../../../../assets/footballmap.png");
  background-size: contain;
  .lineup {
    height: 50%;
    .player {
      position: relative;
      display: inline-block;
      width: 82px;
      vertical-align: top;
      img {
        width: 36px;
      }
      p {
        height: 38px;
      }
      &:after {
        content: attr(data-num);
        position: absolute;
        color: #ffffff;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
    .goalkeeper-container {
      text-align: center;
      .player {
        &:after {
          color: #333333;
        }
      }
    }
    .player-container {
      .row {
        text-align: center;
      }
    }
  }
  #host-no-formation, #guest-no-formation{
    height: 50%;
    .player {
      position: relative;
      display: inline-block;
      width: 180px;
      vertical-align: top;
      text-align: center;
      img {
        width: 36px;
      }
      &:after {
        content: attr(data-num);
        position: absolute;
        color: #ffffff;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
}
</style>