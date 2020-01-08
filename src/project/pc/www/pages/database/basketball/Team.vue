
<template>
  <div class="database team">
    <p class="title">
      联盟领先
    </p>
    <div class="mt">
      <team-statistic :team-statistic="teamStatistic" />
      <div v-if="ballType === 'NBA'">
        <competition-area :area-data="areaData" />  
      </div>
      <div v-if="ballType === 'CBA'">
        <competition-area :area-data="area" />  
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import TeamStatistic from './components/TeamStatistic'
import CompetitionArea from './components/Area'
import mixins from './mixins'

export default {
  components: {
    TeamStatistic,
    CompetitionArea,
  },
  mixins: [mixins],
  data () {
    return {
      name: '',
      teamStatistic: [],
      area: []
    }
  },
  computed: {
    ...mapGetters(['ballType', 'areaData'])
  },
  watch: {
    ballType: {
      handler(val) {
      },
      immediate: true
    }
  },
  mounted () {

  },
  methods: {
    
    // 球队技术排名
    getTeamStatisticScore() {
      this.$get('v9/basketball/teamStat', {}).then(res => {
        this.teamStatistic = res.data.stats
      })
    },

    selectBallType() {
      this.$get('v9/'+this.ballType.toLowerCase()+'/section/teams', {
        seasonId: this.seasonId
      })
        .then((res) => {
          const {code, data} = res
          if (this.$judgeCode(code)) { 
            this.area = data
          } else {
            this.area = []
          }
        })
    }
  },
  
}
</script>

<style scoped lang="scss">
.team {
  background: #fff;
  padding-left: 40px;
  .title {
    font-size: 18px;
    font-weight: bold;
    color: #666;
    line-height: 25px;
    padding: 20px 0 12px 0;
  }
}
</style>
