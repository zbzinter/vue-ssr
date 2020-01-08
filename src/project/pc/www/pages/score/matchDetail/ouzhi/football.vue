<!-- 欧指 -->
<template>
  <div class="ouzhi">
    <div class="content">
      <div class="table">
        <OuzhiTable
          :ischeck="ischeck"
          :is-early-pan="isEarlyPan"
          :odds-data="oddsData"
          :is-allcheck="isAllcheck"
          :match-data="matchData"
          :selected.sync="selected"
          @toCheck="toCheck"
        />
        <OuzhiTable
          :ischeck="ischeck"
          :is-early-pan="isEarlyPan"
          type="math"
          :odds-data="oddsData"
          :is-allcheck="isAllcheck"
          :match-data="matchData"
          :selected.sync="selected"
          @toCheck="toCheck"
        />
      </div>
    </div>
    <div class="math" />
    <FilterColumn
      :odds-data.sync="oddsData"
      :selected.sync="selected"
      :match-data="matchData"
      :type-id="2"
    />
  </div>
</template>
<script>
import OuzhiTable from './footballOuzhiTable'
import FilterColumn from '../Common/FilterColumn'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapGetters } = createNamespacedHelpers('odds')
import MixinsOddsPush from '../../mixins/MixinsOddsPush.js'
export default {
  components: {
    FilterColumn,
    OuzhiTable
  },
  mixins: [MixinsOddsPush],
  props: [
    'matchData'
  ],
  data () {
    return {
      model1: '全部公司',
      ischeck: false,
      isAllcheck: false,
      isEarlyPan: true,
      oddsData: [],
      betCompany: '',
      selected:[]
    }
  },
  computed: {
    ...mapState(['tempOddsData']),
    ...mapGetters(['filterOddsArr']),
    getVuexFilterOdds () {
      return this.filterOddsArr({$set: this.$set,typeId:2, matchData: this.matchData})
    },
    betCompanyList () { // 获取联队leagueName
      if(!this.getVuexFilterOdds.length) return []
      let leagueName = this.getVuexFilterOdds.reduce((total,item)=> {
        total.push({
          bookId: item.bookId,
          bookName: item.bookName
        })
        return total
      },[])
      return [...new Set(leagueName)] || []
    },
  },
  created () {
    this.getOddsApi({matchId: this.matchData.matchId, $get: this.$get}).then((res)=>{
      this.oddsData = [...this.getVuexFilterOdds]
    })
  },
  methods: {
    ...mapActions(['getOddsApi']),
    toCheck(item){
      if(item === 0) {
        this.isAllcheck = !this.isAllcheck
        this.oddsData.forEach(item => {
          this.$set(item, 'ischeck', this.isAllcheck)
        })
        return
      }
      item.ischeck = this.$set(item, 'ischeck', !item.ischeck)
      let findIndex = this.oddsData.findIndex(val => item.matchId === val.matchId)
      if(item.ischeck){
        this.selected.push(item)
        this.selected = [...new Set(this.selected)]
      } else {
        this.selected.splice(findIndex, 1)
      }
    },
    hideChecked () {
      if (!this.selected.length) return
      this.oddsData =  this.oddsData.filter(item => {
        return item && !item.ischeck
      })
      this.dropCheck()
    },
    selectBetCompany (val) {
      if (val === '全部公司') {
        this.oddsData = [...this.getVuexFilterOdds]
        return
      }
      this.oddsData = this.getVuexFilterOdds.filter(item => {
        return item.bookName === val
      })
    },
    dropCheck () {
      this.tempOddsData.forEach(item => item.ischeck = false)
    }
  }
}
</script>

<style scoped lang="scss">
i{
  font-style:normal;
}
.ouzhi{
  margin: 0 auto;
  width: 1200px;
  position: relative;
  box-shadow: 0 6px 24px 0 rgba(0, 0, 0, 0.03);
  .w-100{
    width: 100px;
  }
  .w-160{
    width: 160px;
  }
  .w-260{
    width: 260px;
  }
  .w-320{
    width: 320px;
  }
  .content{
    .filter{
      padding: 24px 0 0;
      .row1{
        display: none;
        padding-left: 20px;

      }
      .row2{
        display: none;
        background: #dedede;
        padding: 10px 0;
        span.all-select{
          cursor: pointer;
        }
        span{
          display: inline-block;
          text-align: center;
        }
        margin-top: 20px;
      }
    }
    .table{
      background: #fff;
    }
  }
}
</style>
