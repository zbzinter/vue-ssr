<template>
  <div class="ranking-box">
    <!-- tab -->
    <ul class="ranking-tab">
      <li 
        v-for="item in tab"
        :key="item.key"
        :class="{cur: curTab === item.key, full: tab.length === 1}"
        @click="tabClick(item.key)"
      >
        <span>{{ item.name }}</span>
      </li>
    </ul>
    <!-- 内容 -->
    <div class="content">
      <div v-if="matchData.leagueId !== 580">
        <NoData v-if="!data || !data.length" />
        <div
          v-for="(item, index) in data"
          :key="index"
        >
          <div class="group">
            {{ item.groupName }}
          </div>
          <RankingList :data="item.stat" />
        </div>
      </div>
      <RankingList
        v-else
        :data="teamRank[curTab-1]"
      />
    </div>
  </div>
</template>
<script>
import RankingList from './ranking-list'
export default {
  components: {
    RankingList
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
      tab: [
        {
          key: 1,
          name: '积分榜'
        }
      ],
      curTab: 1,
      // 东西部
      teamRank: [],
      // 积分榜/分组
      data: []
    }
  },
  created() {
    this.getTeamRank()
  },
  methods: {
    tabClick(key) {
      this.curTab = key
    },
    // 积分榜
    getTeamRank() {
      this.$get('v4/league/teamRank', {
        seasonId: this.matchData.seasonId,
        page: 1,
        limit: 30,
      }).then(res => {
        const { code, data=[] } = res
        if(code === 200 && data.length) {
          // nba 分东部西部
          if(this.matchData.leagueId === 580) {
            this.tab = []
            data.forEach((item, index) => {
              if(data.length > 1) {
                this.tab.push({
                  key: index+1,
                  name: item.groupName
                })
              }
              this.teamRank.push(item.stat || [])
            })
          } else {
            this.data = data
          }
        }
      })
    },
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
    padding: 0 30px;
    border-bottom: 1px solid #f1f1f1;
    li {
      width: 50%;
      height: 100%;
      float: left;
      cursor: pointer;
      text-align: center;
      &.full {
        width: 100%;
      }
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
  .content {
    .group {
      background: #f2f2f2;
      text-align: center;
      font-size: 14px;
      color: #333333;
      line-height: 1;
      padding-top: 10px;
    }
  }
}
</style>