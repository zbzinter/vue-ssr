
<template>
  <div class="page-inner clearfix">
    <div class="left-content fl">
      <CompetitionMenu @switchCompetition="switchCompetition" />
    </div>
    <div class="right-content fl">
      <Header
        :league-id="id"
        @selectSeasonId="getSeasonId"
      />
      <div class="content">
        <Menu
          mode="horizontal"
          theme="light"
          :active-name="tabActive"
          @on-select="handleTab"
        >
          <MenuItem name="1">
            赛程赛果
          </MenuItem>
          <MenuItem name="2">
            {{ type === 1 ? '联赛' : '杯赛' }}之最
          </MenuItem>
          <MenuItem name="3">
            球队榜
          </MenuItem>
          <MenuItem name="4">
            球员榜
          </MenuItem>
        </Menu>
        <div
          v-for="(item, key) in componentsObj"
          :key="key"
        >
          <div v-if="tabActive === key">
            <component
              :is="item"
              :ref="item"
              :league-id="id"
            />
          </div>
        </div>
        <div v-if="tabActive === '1'">
          <Scoreboard
            ref="scoreBoard"
            :league-id="id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CompetitionMenu from './components/Menu'
import {
  Menu,
  MenuItem
} from 'iview'

import Header from './components/CompetitionHeader'
import CompetitionResult from './components/CompetitionResult'
import LeagueHigh from './components/LeagueHigh'
import TeamList from './components/TeamList'
import TeamNumberList from './components/TeamNumberList'
import Scoreboard from './components/Scoreboard'

export default {
  components: {
    Menu,
    Header,
    MenuItem,
    CompetitionMenu,
    Scoreboard,
    'CompetitionResult': CompetitionResult,
    'LeagueHigh': LeagueHigh,
    'TeamList': TeamList,
    'TeamNumberList': TeamNumberList
  },
  data() {
    return {
      type: 1, // 1 联赛，2 杯赛
      id: 0, // 欧冠
      seasonId: 0,
      tabActive: '1',
      componentsName: 'CompetitionResult',
      componentsObj: {
        '1': 'CompetitionResult',
        '2': 'LeagueHigh',
        '3': 'TeamList',
        '4': 'TeamNumberList',
      }
    }
  },
  mounted() {
    

    const timer = setTimeout(() => {
      if (this.$route.query.id) {
        this.id = Number(this.$route.query.id)
        this.seasonId = Number(this.$route.query.seasonId)
        this.type = Number(this.$route.query.type)
        this.$store.commit('setLeagueCupType',  this.type)
      } else {
        // 默认写死
        this.id = 2
        this.seasonId = 21
        this.type = 2
      }
      this.$store.commit('setLeagueCupType',  this.type)
      this.$store.commit('setLeagueId',  this.id)
      clearTimeout(timer)
    }, 300)
   
  },
  methods: {
    switchCompetition({ type, id, seasonId}) {
      this.tabActive = '1'
      this.type = type
      this.id = id
      this.seasonId = seasonId
      this.$store.commit('setLeagueCupType', type)
      this.$store.commit('setLeagueId', id)
      this.$store.commit('setSeasonId', seasonId)
     
    },

    handleTab(index) {
      this.tabActive = index
      this.$store.commit('setSeasonId', this.seasonId)
      this.$store.commit('setLeagueId', this.id)
      this.componentsName = this.componentsObj[this.tabActive]
    },

    getSeasonId(val) {
      this.seasonId = val
      this.componentsName = this.componentsObj[this.tabActive]
      this.$refs[this.componentsName][0].resetAndInit()
      if (this.tabActive === '1') {
        this.$refs.scoreBoard.init()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.page-inner {
  margin-top: 50px;
}
.left-content {
  margin-right: 20px;
  width: 210px;
}
.right-content {
  background: #fff;
  width: 970px;
  .content {
    padding: 0 40px;
    margin-bottom: 40px;
    /deep/ .ivu-menu-light {
      z-index: 1;
    }
  }
}
</style>
