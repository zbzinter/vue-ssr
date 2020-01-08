<template>
  <div>
    <p
      v-if="type === 2"
      class="title"
    >
      积分榜
    </p>
    <div
      v-if="type === 2"
      class="tab mb"
    >
      <span
        v-for="(item, index) in title"
        :key="index"
        :class="activeIndex === index ? 'active' : ''"
        class="tab-name"
        @click="tabClick(index)"
      >{{ item.name }}</span>
    </div>
    <div class="content">
      <div
        v-show="type === 2"
        class="spin-article"
      >
        <Spin
          v-if="spinShow"
          fix
        >
          <Icon
            type="ios-loading"
            size="18"
            class="spin-icon-load"
          />
          <div>Loading</div>
        </Spin>
        <!-- 杯赛 -->
        <div
          v-for="(item, index) in data"
          :key="index"
        >
          <p class="table-title">
            {{ item.groupName }}
          </p>
          <Table
            border
            stripe
            :columns="score"
            :data="item.stat"
          >
            <template
              slot="win"
              slot-scope="{ row }"
            >
              {{ row.goals - row.loseGoals }}
            </template>
            <template
              slot="goalAvg"
              slot-scope="{ row }"
            >
              {{ calcAverage(row.goals, row.totalNum) }}
            </template>
            <template
              slot="loseAvg"
              slot-scope="{ row }"
            >
              {{ calcAverage(row.loseGoals, row.totalNum) }}
            </template>
            <template
              slot="winRate"
              slot-scope="{ row }"
            >
              {{ calcAverage(row.goals - row.loseGoals, row.totalNum) }}
            </template>
          </Table>
        </div>
      </div>
      <div
        v-show="type === 1"
        class="spin-article"
      >
        <Spin
          v-if="spinShow"
          fix
        >
          <Icon
            type="ios-loading"
            size="18"
            class="spin-icon-load"
          />
          <div>Loading</div>
        </Spin>
        <!-- 联赛积分榜 -->
        <div
          v-for="(item, index) in queryLeagueRankData"
          id="scoreboard"
          :key="index"
          class="scoreboard"
        >
          <h3 class="title">
            积分榜 {{ queryLeagueRankData.length>1 && item.groupName ? `(${item.groupName})` : '' }}
          </h3>
          <div class="wrap-inner">
            <ScoreboardTable
              :table-data="item.stat"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import ScoreboardTable from '@src/pages/score/matchDetail/analyze/widget/ScoreboardTable.vue'

import {
  Table,
  Spin,
  Icon
} from 'iview'

import mixins from '../mixins'

export default {
  components: {
    Table,
    Spin,
    Icon,
    ScoreboardTable
  },
  mixins: [mixins],
  props: {
    leagueId: {
      default: 0,
      type: Number
    },
  },
  data() {
    return {
      title: [
        { name: '总积分' },
      ],
      activeIndex: 0,
      data: [],
      type: 0, // 1 联赛，2 杯赛
      spinShow: false,
      queryLeagueRankData: [],
      seasonId: 0,
      titles: ['排名', '球队', '比赛', '胜', '平', '负', '得', '失', '净胜', '胜率', '平率', '负率', '均得', '均失', '积分'],
    }
  },
  watch: {
    leagueId : {
      handler: function() {
        this.type = this.$store.getters.leagueCupType || 2
        this.seasonId = this.$store.getters.seasonId
        this.navTab()
        this.tabClick(0)
      },
      deep: true
    },
  },
  mounted() {
    this.init()
  },
  methods: {

    init() {
      this.type = this.$store.getters.leagueCupType
      this.seasonId = this.$store.getters.seasonId
      this.navTab()
      this.tabClick(0)
    },

    navTab() {
      this. title = [
        { name: '总积分' },
      ]
      if (this.type === 1) {
        this.title.push( { name: '主场积分' })
        this.title.push( { name: '客场积分' })
      }
    },

    tabClick(index) {
      this.activeIndex = index
      if (this.type === 1) {
        this.getQueryLeagueRank(0)
      }

      if (this.type === 2) {
        this.getCupScore()
      }
    },
    calcAverage(num, total) {
      let ret = ''
      if (total === 0) {
        ret = '-'
      } else {
        ret = (num / total).toFixed(2)
      }
      return ret
    },

    getScoreboard() {
      if (this.type === 2) {
        this.getCupScore()
      }

      if (this.type === 1) {
        this.getQueryLeagueRank(0)
      }
    },

    async getCupScore() {
      this.spinShow = true
      this.data = []
      try {
        const {code, data} = await this.$get('v4/league/teamRank', {
          seasonId: this.$store.getters.seasonId || 21,
        })
       
        if (this.$judgeCode(code) && data.length) {
          this.data = data
        }
      } catch(e) {
        new Error(e)
      }
      this.spinShow = false
    },

    async getQueryLeagueRank(index) {
      this.activeIndex = index
      this.spinShow = true
      try {
        const {code, data} = await this.$get('/v4/league/teamRank', {
          seasonId: this.$store.getters.seasonId,
          type: this.activeIndex + 1
        })
        if (this.$judgeCode(code) && data && data.length) {
          this.queryLeagueRankData = data
        }
      } catch(e) {
        new Error(e)
      }
      this.spinShow = false
    }

  }
}
</script>

<style lang="scss" scoped>
.title {
  font-family: PingFangSC-Semibold;
  font-size: 24px;
  color: #333333;
  display: inline-block;
  height: 33px;
  line-height: 33px;
  margin-bottom: 20px;
}


.tab-name {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  text-align: center;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  padding: 3px 18px;
  display: inline-block;
  margin-right: 16px;
  cursor: pointer;
  &:hover {
    color: #3683FF;
  }
}

.active {
  background: #3683FF;
  color: #fff;
  border: none;
  &:hover {
    color: #fff;
  }
}

.table-title {
  font-family: PingFangSC-Semibold;
  text-align: left;
  font-size: 16px;
  letter-spacing: 0;
  padding: 20px 0 12px 0;
  color: #3683FF;
}

/deep/ .score-board {
  margin: 0;
}

/deep/ .ivu-table-cell {
  padding: 0 10px;
}


/deep/ td.win-column {
  color: #e15756;
  font-weight: 600;
}

/deep/ td.lose-column {
  color: #4CAF50;;
  font-weight: 600;
}

</style>
