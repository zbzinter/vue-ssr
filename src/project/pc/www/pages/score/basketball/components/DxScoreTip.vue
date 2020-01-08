<!-- 大小popper窗 -->
<template>
  <div
    ref="matchItem"
    class="rang-score"
  >
    <Poptip
      v-if="isvisible"
      placement="bottom"
      trigger="hover"
      @on-popper-show="debounceMouseoverOdds(getOddsLogData, 100)()"
    >
      <!-- hover -->
      <a
        href="javascript:"
        class="ref-hover" 
      />
      <span class="big-small__first">{{ bigBall ? '大' + bigBall : '' }}</span>
      <span :class="getColor(3, 1)">
        {{ setZhiShu(match, ['valueForType1', 'value0ForType1'], 'dx') }}
        <i
          :class="[getIconClass(3, 1), 'iconfont']" 
        />
      </span>
      <div
        slot="content"
        class="select-content"
      >
        <Table
          :columns="columns"
          size="small"
          :data="isShowPopper ? getTransferArrData : []" 
          :no-data-text="noDataText"
        />
      </div>
    </Poptip>
    <div
      v-else
      class="wrap-dx"
    >
      <span class="big-small__first">{{ bigBall ? '大' + bigBall : '' }}</span>
      <span :class="getColor(3, 1)">
        {{ setZhiShu(match, ['valueForType1', 'value0ForType1'], 'dx') }}
        <i
          :class="[getIconClass(3, 1), 'iconfont']" 
        />
      </span>
    </div>
  </div>
</template>

<script>
import { Poptip, Table } from 'iview'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions } = createNamespacedHelpers('odds')
export default {
  components: {
    Poptip,
    Table
  },
  props: [
    'setZhiShu',
    'concede',
    'getColor',
    'getIconClass',
    'match',
    'typeId',
    'bookId',
    'bigBall',
    'isvisible'
  ],
  data () {
    return {
      timer: null,
      isShowPopper: false,
    }
  },
  computed: {
    ...mapState(['tempOddsLogData']),
    noDataText(){
      let text = !this.isShowPopper ? '加载中...' : '暂无数据'
      return text
    },
    getTransferArrData(){
      if (!Object.keys(this.tempOddsLogData).length) return []
      return this.tempOddsLogData.slice(0, 5) || []
    },
    columns () {
      return [  
        {
          title: '大分',
          key: 'team1Val',
          width: 95,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
              class: row.team1ValClass
            }, row.team1Val)
          }
        },
        {
          title: '盘口',
          key: 'pan',
          width: 110,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
              class: row.panClass
            }, row.pan)
          }
        },
        {
          title: '小分',
          key: 'team2Val',
          width: 95,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
              class: row.team2ValClass
            }, row.team2Val)
          }
        },
        {
          title: '时间',
          key: 'matchTime',
          width: 110,
          render: (h, {row})=>{
            return h('span', {
            }, row.oddTime ? this.format(this.dayjs(row.oddTime).format('HH:mm')) : '')
          }
        }
      ]
    }
  },
  watch: {
    tempOddsLogData(val){
      this.tempOddsLogData.forEach((item, index) => {
        item.team1Val = item.valueForType2 || item.value0ForType2
        item.pan = item.ovalue || item.ovalue0
        item.team2Val = item.valueForType1 || item.value0ForType1
        let team1preVal = this.tempOddsLogData[Math.min(index+1, this.tempOddsLogData.length -1)].valueForType2 || this.tempOddsLogData[Math.min(index+1, this.tempOddsLogData.length -1)].value0ForType2
        item.team1ValClass = this.setCompareColor(item.team1Val, team1preVal)
        let team2preVal = this.tempOddsLogData[Math.min(index+1, this.tempOddsLogData.length -1)].valueForType1 || this.tempOddsLogData[Math.min(index+1, this.tempOddsLogData.length -1)].value0ForType1
        item.team2ValClass = this.setCompareColor(item.team2Val, team2preVal)
        let panPreVal = this.tempOddsLogData[Math.min(index+1, this.tempOddsLogData.length -1)].ovalue || this.tempOddsLogData[Math.min(index+1, this.tempOddsLogData.length -1)].ovalue0
        item.panClass = this.setCompareColor(item.pan, panPreVal)
      })
    }
  },
  created () {
    this.matchData = this.match
  },
  methods: {
    ...mapActions(['getOddsLogApi']),
    debounceMouseoverOdds(fn,delay) { // 禁止高频触发
      this.timer = null
      return ()=> {
        if(this.timer){
          clearTimeout(this.timer) 
        }
        this.timer = setTimeout(fn, delay)
      }
    },
    getOddsLogData(){
      this.isShowPopper = false
      this.getOddsLogApi({
        matchId: this.match.matchId, 
        bookId: this.bookId,
        typeId: this.typeId,
        $get: this.$get
      }).then((res)=>{
        // let {data} = res
        // if(Array.isArray(data)){
        //   if(!this.match.odds) this.$set(this.match, 'odds', {})
        //   if(data.length) {
        //     let lastItem = data[0]
        //     this.$set(this.match.odds, lastItem.typeId, lastItem)
        //   }
        // }
        this.isShowPopper = true
      })
    },
    setCompareColor(currentVal, preVal){
      let current = parseFloat(currentVal)
      let pre = parseFloat(preVal)
      if (current > pre) {
        return 'red'
      } else if (current < pre) {
        return 'green'
      }
    },
    format(val, maxFloat, Fixed){
      if(!maxFloat) return (val || val === 0) ? val : '-'
      if(maxFloat && !Fixed) { // 最大浮点,仅对有小数点的数字处理成maxFloat
        val = /^\d+\./.test(val) ?  (+val).toFixed(maxFloat) : val
        return val
      }
      if(/^\d+/.test(val)) {
        val = (+val).toFixed(1)
        return val
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .rang-score{
    position: relative;
    cursor: pointer;
    .c-red, /deep/ .red {
      color: #E15756;
      font-weight: 600;
      &:hover{
        opacity: 0.8;
      }
    }
    .c-green, /deep/ .green {
      color: #4DA183;
    }
	.iconca_el, .iconca_ei {
		font-size: 12px;
    vertical-align: middle;
    &::before{
      @keyframes changeOdd{
        50%{opacity: 0.1;}
      }
      animation: changeOdd .5s linear .1s 5;
      animation-fill-mode:forwards;
    }
		&.iconca_ei {
			color: #E15756;
		}
		&.iconca_el {
			color: #4DA183;
		}
	}
    .rang-score__first {
      display: inline-block;
      width: 60px;
      text-align: left;
      color: #E4742F;
    }
    /deep/ {
      .ivu-poptip-arrow{
        display: none;
      }
      .ivu-poptip-inner{
        background: transparent;
        box-shadow: none;
      }
      .ivu-table td, th{
        background: rgba(0, 0, 0, 0.85);
        color: #ffffff;
      }
      .ivu-poptip, .ivu-poptip-rel{
        width: 100%;
      }
      .ref-hover{
        position: absolute;
        left: 0;
        right: 0;
        top: -50px;
        bottom: -5px;
        z-index: 1;
        
      }
    }
    .select-content {
      width: 412px;
      background: rgba(0, 0, 0, 0.85);
      box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.09);
      border-radius: 4px;
      font-size: 12px;
      color: #ffffff;
      text-align: center;
    }
  }

  .rang-score {
    font-weight: 600;
    background: #fcfcfc;
    border-right: none;
    width: 130px;
    &__first {
      font-size: 12px;
      color: #E4742F;
      letter-spacing: 0;
      width: 49px;
      display: inline-block;
    }
    .ivu-poptip-rel > span {
      float: left;
      width: 50%;
    }
  }
  .big-small-new{
    .wrap-dx{
      display: inline-block;
      width: 100%;
      span {
        float: left;
        width: 50%;
      }
    }
  }
</style>
