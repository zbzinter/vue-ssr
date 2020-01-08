<!-- 欧指 -->
<template>
  <div class="ouzhi">
    <div class="content">
      <div class="filter">
        <div class="row1">
          <i-button
            class="show-btn"
            type="primary"
            size="small"
            @click="selectBetCompany('全部公司')"
          >
            显示全部
          </i-button>
          <i-button
            class="save-btn"
            size="small"
            @click="saveChecked()"
          >
            保留
          </i-button>
          <i-button
            class="hide-btn"
            size="small"
            @click="hideChecked()"
          >
            隐藏
          </i-button>
          <span class="all">共计<i>{{ getVuexFilterOdds.length }}</i>家</span>
          <span class="hide">隐藏<i class="red">{{ getVuexFilterOdds.length - oddsData.length }}</i>家</span>
        </div>
        <div class="row2">
          <span
            :class="['w-100', 'all-select']"
          >全选</span>
          <span class="w-160">
            全部公司
          </span>
          <!-- <Select
            v-model="model1"
            class="w-160"
            size="small"
            placeholder="全部公司"
            @on-change="selectBetCompany"
          >
            <Option value="全部公司">
              全部公司
            </Option>
            <Option
              v-for="item in betCompanyList"
              :key="item.bookName"
              :value="item.bookName"
            >
              {{ item.bookName }}
            </Option>
          </Select> -->
          <span class="w-160">即时指数</span>
          <Checkbox
            v-model="isEarlyPan"
            class="w-160"
          >
            显示初指
          </Checkbox>
          <span style="width: 265px">即时概率（%）</span>
          <span style="width: 170px;text-align:right">返还率</span>
        </div>
      </div>
      <div class="table">
        <OuzhiTable
          :ischeck="ischeck"
          :is-early-pan="isEarlyPan"
          :odds-data="oddsData"
          :selected.sync="selected"
          @toCheck="toCheck"
        />
        <OuzhiTable
          :ischeck="ischeck"
          :is-early-pan="isEarlyPan"
          type="math"
          :odds-data="oddsData"
          :selected.sync="selected"
          @toCheck="toCheck"
        />
      </div>
    </div>
    <div class="math" />
  </div>
</template>
<script>
import {Button, Select, Option, Checkbox} from 'iview'
import OuzhiTable from './basketballOuzhiTable'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapGetters } = createNamespacedHelpers('odds')
import MixinsOddsPush from '../../mixins/MixinsOddsPush.js'
export default {
  components: {
    IButton: Button,
    Select, 
    Option,
    Checkbox,
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
      selected: []
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
      this.oddsData = this.getVuexFilterOdds
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
      if(this.oddsData.find(val => item.matchId === val.matchId && item.ischeck)){
        this.selected = [...this.selected.push(item)]
      }
    },
    selectBetCompany (val) {
      if (val === '全部公司') {
        this.oddsData = [...this.getVuexFilterOdds]
        this.oddsData.forEach(item=>{
          this.$set(item, '_checked', false)
        })
        this.selected = []
        return
      }
      this.oddsData = this.getVuexFilterOdds.filter(item => {
        return item.bookName === val
      })
    },
    saveChecked () {
      if (!this.selected.length) return
      this.oddsData =  this.oddsData.filter(item => {
        let bookId = this.selected.find(val=> val.bookId === item.bookId)
        if(bookId) this.$set(item, '_checked', true)
        return bookId
      })
    },
    hideChecked () {
      if (!this.selected.length) return
      this.oddsData =  this.oddsData.filter(item => {
        this.$set(item, '_checked', false)
        return !this.selected.find(val=> val.bookId === item.bookId)
      })
      this.dropCheck()
    },
    dropCheck () {
      this.$emit('update:selected', [])
      this.oddsData.forEach(item => item.ischeck = false)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../Common/odds.scss';
@import '@/project/pc/www/public/checkbox.scss';
i{
  font-style:normal;
}
.ouzhi{
  margin: 0 auto;
  width: 1200px;
  .w-100{
    width: 82px;
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
    background: #fff;
    padding: 0 30px 40px;
    .filter{
      overflow: hidden;
      .row1{
        // padding-left: 20px;
        margin: 30px 0;
        .show-btn, .hide-btn, .save-btn{
          padding: 0px 18px 1px;
          border-radius: 4px;
          font-size: 14px;
          font-family: PingFangSC-Regular;
          &.show-btn{
            background: #3683FF;
          }
          &.hide-btn{
            background: #fff;
            margin-left: 20px;
            margin-right: 20px;
          }
          &.save-btn{
            background: #fff;
            margin-left: 20px;
          }
        }
        .all, .hide{
          font-size: 12px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #333333;
          letter-spacing: 0;
          line-height: 17px;
        }
      }
      .row2{
        background: #fafafa;
        padding: 10px 0;
        border: 1px solid #dcdee2;
        border-bottom: 0;
        span{
          display: inline-block;
          text-align: center;
        }
      }
    }

  }
}
</style>
