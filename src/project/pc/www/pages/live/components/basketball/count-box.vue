<template>
  <div class="live-info">
    <!-- tab -->
    <ul class="live-info-tab">
      <li 
        v-for="item in tab"
        :key="item.key"
        :class="{cur: curTab === item.key}"
        @click="tabClick(item.key)"
      >
        {{ item.name }}
      </li>
    </ul>
    <!-- 内容 -->
    <div class="content">
      <!-- 赛事赛况 -->
      <EventAction
        v-if="curTab === 1"
        :match-data="matchData"
      />
      <!-- 技术统计 -->
      <PlayerState
        v-if="curTab === 2" 
        :match-data="matchData"
      />
    </div>
  </div>
</template>
<script>
import PlayerState from './player-state'
import EventAction from './event-action'
export default {
  components: {
    PlayerState,
    EventAction,
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
      curTab: 1,
      tab: [
        {
          key: 1,
          name: '赛事赛况'
        },
        {
          key: 2,
          name: '技术统计'
        }
      ]
    }
  },
  methods: {
    tabClick(key) {
      this.curTab = key
    }
  }
}
</script>
<style lang="postcss" scoped>
.live-info {
  background: #fff;
  .live-info-tab {
    height: 66px;
    line-height: 66px;
    border-bottom: 1px solid #f1f1f1;
    padding-left: 30px;
    li {
      float: left;
      height: 66px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      color: #333;
      margin-right: 36px;
      &:hover {
        color: #3683FF;
      }
      &.cur {
        color: #3683FF;
        font-size: 20px;
        border-bottom: 4px solid #3683FF;
      }
    }
  }
}
</style>