<template>
  <div>
    <competition-area :area-data="area" />
    <ranking
      :season-list="seasonList"
      @statistic="getStatisticData"
    />
    <home-statistic :statistic-data="statisticData" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CompetitionArea from './components/Area'
import Ranking from './components/home/Ranking'
import HomeStatistic from './components/home/HomeStatistic'
import mixins from './mixins'

export default {
  components: {
    CompetitionArea,
    Ranking,
    HomeStatistic,
  },
  mixins: [mixins],
  data () {
    return {
      activeIndex: 1,
      name: '',
      area: [],
      statisticData: []
    }
  },
  computed: {
    ...mapGetters(['ballType', 'currentSeasonId'])
  },
  watch: {
    ballType: {
      handler(val) {
        this.getCurrentId()
      },
      immediate: true
    }
  },
  methods: {
    getCurrentId() {
      this.$store.dispatch('GetCurrentId',{val:this.ballType, vm: this}).then((val) => {
        this.getArea()
      }).catch()
    },

    getArea() {
      this.$get('v9/'+this.ballType.toLowerCase()+'/section/teams', {
        seasonId: this.currentSeasonId
      })
        .then((res) => {
          const {code, data} = res
          if (this.$judgeCode(code)) { 
            this.area = data
            // this.$store.commit('setAreaData', this.area)
          } else {
            this.area = []
          }
        })
    },

    getStatisticData({seasonId, groupId}) {
      this.$get('v9/basketball/playerRank', {
        seasonId,
        groupId,
        statType: '24,59,60,61,62'
      })
        .then((res) => {
          const {code, data} = res
          if (this.$judgeCode(code)) { 
            let isHasVal = Array.isArray(data.stats) && data.stats.every(item=>Array.isArray(item.stats) && item.stats.length)
            this.statisticData = isHasVal ? data.stats : []
          } else {
            this.statisticData = []
          }
        })
    }
  },
  
}
</script>
