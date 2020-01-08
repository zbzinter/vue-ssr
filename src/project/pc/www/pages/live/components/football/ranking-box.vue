<template>
  <div class="ranking-box">
    <!-- tab -->
    <ul class="ranking-tab">
      <li 
        v-for="item in tab"
        :key="item.key"
        :class="{cur: curTab === item.key}"
        @click="tabClick(item.key)"
      >
        <span>{{ item.name }}</span>
      </li>
    </ul>
    <!-- 内容 -->
    <div class="content">
      <RankingList
        v-if="curTab === 1"
        :season-id="matchData.seasonId"
      />
      <ShooterList
        v-if="curTab === 2"
        :season-id="matchData.seasonId"
      />
      <AssistsList
        v-if="curTab === 3"
        :season-id="matchData.seasonId"
      />
    </div>
  </div>
</template>
<script>
import RankingList from './ranking-list'
import ShooterList from './shooter-list'
import AssistsList from './assists-list'
export default {
  components: {
    RankingList,
    ShooterList,
    AssistsList
  },
  props: ['matchData'],
  data() {
    return {
      tab: [
        {
          key: 1,
          name: '积分'
        },
        {
          key: 2,
          name: '射手'
        },
        {
          key: 3,
          name: '助攻'
        },
      ],
      curTab: 1,
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
.ranking-box {
  margin-left: 1106px;
  background: #fff;
  .ranking-tab {
    height: 58px;
    line-height: 58px;
    border-bottom: 1px solid #f1f1f1;
    li {
      width: 33.33%;
      height: 100%;
      float: left;
      cursor: pointer;
      text-align: center;
      span {
        display: inline-block;
        height: 100%;
        color: #666;
      }
      &.cur {
        font-size: 16px;
        font-weight: bold;
        span {
          color: #3683ff;
          font-weight: bold;
          border-bottom: 2px solid #3683ff;
        }
      }
      &:hover span {
        color: #3683ff;
      }
    }
  }
}
</style>