<!-- 指数详情 -->
<template>
  <div class="tab-content">
    <div class="wrap-echarts">
      <div
        :id="`${tabValue}-line`"
        class="echarts"
      />
    </div>
    <!-- <h3 class="title">
      <span>{{ typeText }}</span>
    </h3> -->
    <div class="fl left-data">
      <div class="explain">
        <span class="img">      
          <img
            class="icon-img"
            :src="tabValue === 'yapan' ? imgUrl1 : imgUrl2"
            alt=""
          >
          {{ typeText }}变化
        </span>
        <div class="state">
          <span>说明：</span>
          <span class="early"><i />初指</span> 
          <span class="instant"><i />即时盘</span> 
          <span class="draw"><i />走地盘</span> 
        </div>
      </div>
      <ul class="data-ul">
        <li
          v-for="(item, index) in tempOddsLogData"
          :key="index"
        >
          <span class="date">{{ dayjs(item.oddTime).format('MM-DD') }}</span>
          <span class="time">{{ dayjs(item.oddTime).format('HH:mm') }}</span>
          <span class="data1">{{ item.ovalue || item.ovalue0 }}</span>
          <Tooltip
            :content="`客队：${item.valueForType2 || item.value0ForType2}`"
            placement="left"
          >
            <div class="wrap-bg">
              <span
                :class="['bg', {'early': index === getTransferArrData.length-1, 'instant': item.typeId <= 3 && item.valueForType2 && index !== getTransferArrData.length-1}]"
                :style="{width: `${(item.valueForType1*100)/maxOdd}%`}"
              />
            </div>
          </Tooltip>
          <span class="data2">{{ item.valueForType1 || item.value0ForType1 }} 
            <i
              v-show="index === getTransferArrData.length-1"
              class="blue"
            >(初盘)
            </i>
          </span>
        </li>
      </ul>
    </div>
    <div class="fr right-data">
      <Table
        :columns="columns"
        :data="getTransferArrData"
        size="small"
      >
        <template
          slot="status"
          slot-scope="{ row, index }"
        >
          <div class="status bb">
            <span v-if="row.typeId > 3 && index !== getTransferArrData.length-1">滚</span>
            <span
              v-if="row.typeId <= 3 && row.valueForType2 && index !== getTransferArrData.length-1"
              class="red"
            >即</span>
            <span
              v-if="(row.typeId <= 3 && (row.valueForType2 && row.value0ForType2)) || index === getTransferArrData.length-1"
              class="green"
            >初盘</span>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import { Table, Tooltip } from 'iview'
import oddsjs from '../../mixins/MixinsOdds'
export default {
  components: {
    Table,
    Tooltip
  },
  mixins: [oddsjs],
  props: [
    'tabValue',
    'typeText',
    'tempOddsLogData',
    'matchData'
  ],
  data () {
    let that = this
    return {
      imgUrl1: require('../../../../assets/score/eo_fj.png'),
      imgUrl2: require('../../../../assets/score/eq_fj.png'),
      oddTimeArr: [],
      ovalueArr: [],
      lineOptions: {
        grid: {
          x: 60,
          y: 82
        },
        tooltip: {
          trigger: 'axis',
          confine: true,
          show: true,
          axisPointer: {
            triggerOn: 'mousemove'
          },
          formatter: (params)=>{
            let item = that.tempOddsLogData[params[0].dataIndex]
            if(!item) return
            return `
            客队：${item.valueForType2 || item.value0ForType2}<br>
            盘口：${item.ovalueNum || item.ovalue0}<br>
            主队：${item.valueForType1 || item.value0ForType1}<br>
            时间：${this.dayjs(item.oddTime).format('MM-DD HH:mm')}
            `
          }
        },
        xAxis: {
          left:0,
          x:0,
          type: 'category',
          // boundaryGap: false,
          data: [1,2,3,4],
          axisLine : {
            show: false
          },
          axisTick : {
            show: false
          },
          axisLabel : {
            color: '#999'
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          axisLine : {
            show: false
          },
          axisTick : {
            show: false
          },
          axisLabel : {
            color: '#999'
          },
          splitLine: {
            show: true,
            lineStyle:{
              color: ['#EAEAEA'],
              type: 'dashed'
            }
          },
        },
        series: [{
          left:0,
          x:0,
          data: [],
          type: 'line',
          smooth:true,
          symbol: 'emptyCircle',
          showSymbol: true,
          sampling: 'average',
        }]
      }
    }
  },
  computed: {
    maxOdd () {
      let maxArr = this.tempOddsLogData.reduce((total, item) => {
        total.push(item.valueForType1)
        return total
      }, [])
      return Math.max.apply(null, maxArr)
    },
    columns () {
      return [  
        {
          title: this.matchData.guestTeamName,
          key: 'team1Val',
          width: 120,
          tooltip: true,
          align: 'center',
          renderHeader: (h)=>{
            return h('span', {
              class: 'ellipsis'
            }, this.format(this.matchData.guestTeamName))
          },
          render: (h, {row})=>{
            return h('span', {
              class: row.team1ValClass
            }, row.team1Val)
          }
        },
        {
          title: '盘口',
          key: 'pan',
          width: 60,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
              class: row.panClass
            }, row.pan)
          }
        },
        {
          title: this.matchData.hostTeamName,
          key: 'team2Val',
          width: 120,
          align: 'center',
          renderHeader: (h, {row})=>{
            return h('span', {
              class: 'ellipsis'
            }, this.format(this.matchData.hostTeamName))
          },
          render: (h, {row})=>{
            return h('span', {
              class: row.team2ValClass
            }, row.team2Val)
          }
        },
        {
          title: '变化时间',
          key: 'matchTime',
          width: 100,
          render: (h, {row})=>{
            return h('span', {
            }, this.format(this.dayjs(row.oddTime).format('MM-DD HH:mm')))
          }
        },
        {
          title: '状态',
          slot: 'status',
          className: 'status-cell',
          key: 'goal',
          ellipsis: true,
          tooltip: true
        }
      ]
    },
    getTransferArrData(){
      if (!Object.keys(this.tempOddsLogData).length) return []
      return this.tempOddsLogData
    }
  },
  watch: {
    tempOddsLogData(val){
      this.oddTimeArr = []
      this.ovalueArr = []
      this.tempOddsLogData.forEach((item, index) => {
        let time = `${this.dayjs(item.oddTime).format('MM-DD')} ${this.dayjs(item.oddTime).format('HH:mm')}`
        this.oddTimeArr.push(time)
        this.ovalueArr.push(item.ovalueNum)
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
      this.lineOptions.xAxis.data = this.oddTimeArr
      this.lineOptions.series[0].data = this.ovalueArr
      this.excuteEcharts()
    }
  },
  mounted () {
    this.$nextTick(()=>{
      this.excuteEcharts()
    })
  },
  methods: {
    format(val){
      return (val || val === 0) ? val : '-'
    },
    excuteEcharts(){
      let ele = document.getElementById(`${this.tabValue}-line`)
      if(!ele) return
      var myChart = this.echarts.init(ele)
      myChart.clear()
      myChart.setOption(this.lineOptions)
    }
  }
}
</script>

<style scoped lang="scss">

      $red: #E15756;
      $blue: #3683FF;
      $green: #4DA183;
      /deep/ {
        tbody{
          tr{
            td:nth-child(1), td:nth-child(2), td:nth-child(3) {
              .red{
                color: $red
              }
              .blue{
                color: $blue
              }
              .green{
                color: $green
              }
            }
          }
        }
      }
.br{
  border-right: 1px solid #eee;
}
.blue{
  color: $blue;
}
i{
  font-style: normal;
}
.tab-content{
  margin: 0 30px;
  background: #fff;
  position: relative;
  padding-bottom: 60px;
  overflow: hidden;
  .back{
    position: absolute;
    right: 0;
    color: #2d8cf0;
    padding: 8px;
    cursor: pointer;
    z-index: 1
  }
  .wrap-echarts{
    border: 1px solid #EAEAEA;
    margin-top: 24px;
    margin-bottom: 40px;
  }
  .echarts {
    width: 100%;
    height: 400px;
  }
  h3{
    text-align: center;
    position: relative;
    top: -25px;
  }
  .explain{
    margin: 0 20px 0 60px;
    span{
      &.img{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #3683FF;
        img{
          width: 22px;
        }
      }
    }
    .state{
      display: inline-block;
      margin-left: 60px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #72819A;
      line-height: 13px;
      span{
        i{
          display: inline-block;
          width: 10px;
          height: 10px;
          box-sizing: border-box;
          border: 2.5px solid #fff;
          margin: 0 8px 0 6px;
          border-radius: 10px;
        }
        &.early i{
          border-color: $green;
          // background: $green !important
        }
        &.instant i{
          border-color: $red;
          // background: $red !important
        }
        &.draw i{
          border-color: $blue;
          // background: $blue !important
        }
        &+span{
          margin-right: 14px;
        }
      }
    }
  }
  .data-ul{
    margin: 20px 20px 20px 60px;
    li{
      height: 30px;
      .wrap-bg{
          display: inline-block;
          width: 200px;
          margin-right: 16px;
      }
      span{
        display: inline-block;
        &.date, &.time{
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #666666;
        }
        &.data1{
          margin-left: 25px;
          width: 45px;
        }
        &.data1, &.data2{
          font-family: PingFangSC-Medium;
          font-size: 12px;
          color: #666666;
          .blue{
            color: $blue;
          }
        }
        &.bg{
          background: $blue;
          width: 100%;
          height: 22px;
          vertical-align: middle;
          margin-left: 6px;
          margin-right: 6px;
          &.early{
            background: $green !important
          }
          &.instant{
            background: $red !important
          }
        }
      }
    }
  }
  .left-data, .right-data{
    width: 50%;
    &.right-data{
      width: 502px;
      padding: 0 25px;
      box-sizing: border-box;
      table{
        width:100%;
        border: 1px solid #eee;
        text-align: center;
        th{
          background: #f7f7f8;
          height: 40px;
          line-height: 40px;
        }
        td{
          height: 30px;
          line-height: 30px;
        }
      }
      /deep/ {
        .ivu-table-cell{
          padding-left: 6px;
          padding-right: 6px;
        }
        .ivu-table th{
          background-color: transparent;
          span{
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666666;
            font-weight: normal;
          }
        }
        td{
          height: 28px;
        }
          td.status-cell{
            .ivu-table-cell{
              padding: 0;
              height: 100%;
              div{
                height: 100%;
              }
            }
            .status{
              height: 100%;
              color: #fff;
              span{
                display: inline-block;
                width: 100%;
                background: $blue;
                height: 100%;
                text-align: center;
                line-height: 28px;
                &.red{
                  background: $red
                }
                &.green{
                  background: $green
                }
              }
            }
          }
      }
    }
  }
  // /deep/{
  //   .ivu-poptip-arrow:after {
  //     border-left-color: rgba(0,0,0,0.5)
  //   }
  //   .ivu-poptip-inner {      
  //     background-color: rgba(0,0,0,0.5);
  //   }
  //   .ivu-poptip-body-content-inner{
  //     color: #fff;

  //   }
  // }
}
</style>
