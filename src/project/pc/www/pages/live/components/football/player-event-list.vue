<template>
  <div class="player-event-list">
    <div class="first-line">
      <span class="yellow-card" v-if="hasYellowCard(player)"></span>
      <span class="red-card" v-if="player[22]"></span>
      <span class="yellow-red-card" v-if="player[21]"></span>
      <p class="substitution" v-if="player[23]">
        <span>{{ getTime(player[23].time) }}</span>
      </p>
    </div>
    <div class="second-line">
      <span class="player-goal" v-if="getGoal(player)" :class="{'has-bg': getGoal(player) > 1}">{{ getGoal(player) > 1 ? 'x' + getGoal(player) : '' }}</span>
      <span class="own-goal" v-if="getOwnGoal(player)" :class="{'has-bg': getOwnGoal(player) > 1}">{{ getOwnGoal(player) > 1 ? 'x' + getOwnGoal(player) : '' }}</span>
      <span class="penalty-kick" v-if="getPenaltyKick(player)" :class="{'has-bg': getPenaltyKick(player) > 1}">{{ getPenaltyKick(player) > 1 ? 'x' + getPenaltyKick(player) : '' }}</span>
      <span class="assist" v-if="getAssist(player)" :class="{'has-bg': getAssist(player) > 1}">{{ getAssist(player) > 1 ? 'x' + getAssist(player) : '' }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: ['player'],
  data() {
    return {
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
  methods: {
    getGoal(player) {
      let goal = player && player[this.eventTypes.goal]
      let count = goal ? goal.count : 0
      return count
    },
    getOwnGoal(player) {
      let ownGoal = player && player[this.eventTypes.ownGoal]
      let count = ownGoal ? ownGoal.count : 0
      return count
    },
    getPenaltyKick(player) {
      let penaltyKick = player && player[this.eventTypes.penaltyKick]
      let count = penaltyKick ? penaltyKick.count : 0
      return count
    },
    getAssist(player) {
      let assist = player && player[this.eventTypes.assist]
      let count = assist ? assist.count : 0
      return count
    },
    getTime (data) {
      let temp = data
      if (Array.isArray(data)) {
        temp = data[data.length - 1]
      }
      return Math.floor(temp / 60) + "'"
    },
    hasYellowCard(obj) {
      return !obj[this.eventTypes.doubleYellow] && !obj[this.eventTypes.red] && obj[this.eventTypes.yellow]
    }
  }
}
</script>
<style lang="postcss" scoped>
.player-event-list {
  position: absolute;
  left: 60px;
  top: 0;
  .first-line{
    height: 22px;
    .yellow-card, .red-card, .yellow-red-card{
      position: relative;
      &:after{
        content: '';
        display: inline-block;
        width: 12px;
        height: 16px;
        border-radius: 2px;
        background: #FC9925;
        margin: 0;
      }
    }
    .red-card{
      &:after{
        background: #F22F74;
      }
    }
    .yellow-red-card{
      &:before{
        content: '';
        display: inline-block;
        width: 12px;
        height: 16px;
        border-radius: 2px;
        background: #FC9925;
      }
      &:after{
        position: absolute;
        left: 4px;
        top: 2px;
        background: #F22F74;
      }
    }
    .substitution{
      &:before{
        content: '↕';
      }
    }
  }

  .second-line{
    height: 22px;
    .player-goal{
      &:after{
        content: '进'
      }
    }
    .own-goal{
      &:after{
        content: '乌'
      }
    }
    .penalty-kick{
      &:after{
        content: '点'
      }
    }
    .assist{
      &:after{
        content: '助'
      }
    }
  }
}
</style>