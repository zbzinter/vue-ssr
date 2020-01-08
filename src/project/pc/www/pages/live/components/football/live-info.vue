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
      <TextLive
        v-if="curTab === 1"
        :match-data="matchData"
      />
      <TeamLineup
        v-if="curTab === 2"
        :match-data="matchData"
      />
    </div>
  </div>
</template>
<script>
import TextLive from './text-live'
import TeamLineup from './team-lineup'
export default {
  components: {
    TextLive,
    TeamLineup
  },
  props: ['matchData'],
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
          name: '首发阵容'
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