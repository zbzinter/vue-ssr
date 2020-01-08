<!-- 旁路走势table -->
<template>
  <div>
    <Table
      :columns="columns1"
      :data="getTransferArrData"
      size="small"
      center
    >
      <template
        slot="draw"
        slot-scope="{ row, index }"
      >
        <span v-if="index !== getTransferArrData.length -1">{{ row.draw }}</span>
        <span v-else>
          <i
            v-for="(item, index) in objVal[`${type}Desc`]"
            :key="index"
            :class="(item === '赢' || item === '大') ? 'red' : (item === '输'||item === '小') ? 'green' : 'black'"
          >{{ item }}</i>
        </span>
      </template>
      <template
        slot="draw"
        slot-scope="{ row, index }"
      >
        <span v-if="index !== getTransferArrData.length -1">{{ row.draw }}</span>
        <div v-else>
          <span>
            <i
              v-for="(item, ind) in objVal.asiaDesc"
              :key="ind"
              :class="item === '赢' ? 'red' : item === '输' ? 'green' : 'black'"
            >{{ item }}</i>
          </span>
        </div>
      </template>
      <template
        slot="dxLargeRate"
        slot-scope="{ row, index }"
      >
        <span v-if="index !== getTransferArrData.length -1">{{ row.dxLargeRate }}</span>
        <div v-else>
          <span class="size">
            <i
              v-for="(item, ind) in objVal.dxDesc"
              :key="ind"
              :class="item === '大' ? 'red' : item === '小' ? 'green' : 'black'"
            >{{ item }}</i>
          </span>
        </div>
      </template>
    </Table>
  </div>
</template>

<script>
import { Decimal } from 'decimal.js'
import {Table} from 'iview'
export default {
  name: 'TrendTable',
  components: {
    Table
  },
  props: [
    'titles',
    'objVal'
  ],
  data () {
    return {
      'rowTitle': {
        All: '总场数',
        Host: '主场',
        Guest: '客场'
      }
    }
  },
  computed: {
    isEmpty(){
      return !(this.objVal && Object.keys(this.objVal).length)
    },
    titleName() {
      return [' ', '比赛', '赢盘', '走盘', '输盘', '赢盘率', '大球', '大球率', '小球', '小球率']
    },
    columns1 () {
      let { titleName } = this
      return [  
        {
          title: titleName[0],
          key: 'name',
          width: 60,
          render: (h, {row})=>{
            return h('span', {
            }, this.format(row.name))
          }
        },
        {
          title: titleName[1],
          key: 'count',
          width: 50,
          align: 'center',
          render: (h, {row, index})=>{
            return h('span', {
            }, index !== this.getTransferArrData.length -1 ? this.format(row.count) : '')
          }
        },
        {
          title: titleName[2],
          key: 'win',
          width: 50,
          align: 'center',
          render: (h, {row, index, column})=>{
            return h('span', {
            }, index !== this.getTransferArrData.length -1 ? this.format(row.win) : '')
          }
        },
        {
          title: titleName[3],
          slot: 'draw',
          align: 'center',
          className: 'draw',
          width: 50
        },
        {
          title: titleName[4],
          key: 'lost',
          width: 50,
          align: 'center',
          ellipsis: true,
          tooltip: true,
          render: (h, {row, index})=>{
            return h('span', {
            }, index !== this.getTransferArrData.length -1 ? this.format(row.lost) : '')
          }
        },
        {
          title: titleName[5],
          key: 'tapeRate',
          minWidth: 60,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row, index})=>{
            return h('span', {
            }, index !== this.getTransferArrData.length -1 ? this.format(row.tapeRate) : '')
          }
        },
        {
          title: titleName[6],
          key: 'dxLarge',
          minWidth: 60,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row, index})=>{
            return h('span', {
            }, index !== this.getTransferArrData.length -1 ? this.format(row.dxLarge) : '')
          }
        },
        {
          title: titleName[7],
          slot: 'dxLargeRate',
          className: 'dxLargeRate',
          minWidth: 60,
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: titleName[8],
          key: 'dxSmall',
          minWidth: 60,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row, index})=>{
            return h('span', {
            }, index !== this.getTransferArrData.length -1 ? this.format(row.dxSmall) : '')
          }
        },
        {
          title: titleName[9],
          key: 'dxSmallRate',
          minWidth: 60,
          ellipsis: true,
          tooltip: true,
          render: (h, {row, index})=>{
            return h('span', {
            }, index !== this.getTransferArrData.length -1 ? this.format(row.dxSmallRate) : '')
          }
        }
      ]
    },
    getTransferArrData(){
      let {getPercent, objVal, type, rowTitle} = this
      if (!Object.keys(objVal).length) return []
      let getTransferArrData = []
      let $ind = 0
      for (let [index, item] of Object.entries(rowTitle)) {
        getTransferArrData[$ind] = getTransferArrData[$ind] || {}
        getTransferArrData[$ind] = {
          name: item,
          count: objVal[`asia${index}Win`] + objVal[`asia${index}Draw`] + objVal[`asia${index}Lost`],
          win: objVal[`asia${index}Win`],
          lost: objVal[`asia${index}Lost`],
          draw: objVal[`asia${index}Draw`],
          tapeRate: getPercent(objVal[`asia${index}Win`], (objVal.asiaAllWin + objVal.asiaAllDraw + objVal.asiaAlllost)),
          dxLarge: objVal[`dx${index}Win`],
          dxLargeRate: getPercent(objVal[`dx${index}Win`], (objVal[`dx${index}Win`] + objVal[`dx${index}Draw`] + objVal[`dx${index}Lost`])),
          dxSmall: objVal[`dx${index}Lost`],
          dxSmallRate: getPercent(objVal[`dx${index}Lost`], (objVal[`dx${index}Win`] + objVal[`dx${index}Draw`] + objVal[`dx${index}Lost`]))
        }
        $ind++
      }
      objVal.asiaDesc = objVal.asiaDesc.substr(0, 6)
      objVal.dxDesc = objVal.dxDesc.substr(0, 6)
      getTransferArrData.push({
        name: '近6场',
        count: 6,
        asiaDesc: objVal.asiaDesc
      })
      return getTransferArrData
    }
  },
  watch: {

  },
  created () {
  },
  mounted () {

  },
  methods: {
    getPercent (num, total) {
      return total ? `${new Decimal(num*100).dividedBy(total).toFixed(1)}%` : '-'
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
@import '../../Common/detail.scss';
.ellipsis{
		overflow: hidden;
		text-overflow: ellipsis;
    white-space: nowrap;
};
  i{
    font-style: normal
  }
  .red{
    color: #F06151;
  }
  .blue{
    color: #3683FF;

  }
  .green{
    color: #80A963;
  }
  table.recent-table{
    width: 100%;
    thead{
      th{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        text-align: left;
        height: 42px;
        line-height: 42px;
        background: #FAFAFA;
        &:nth-of-type(1){
          padding-left: 14px;
          border-radius: 31px 0 0 31px;
        }
        &:nth-last-of-type(1){
          border-radius: 0 31px 31px 0;
        }
      }
    }
    tbody{
      tr{
        &:nth-of-type(1){
          td>div{
            margin-top: 30px;
          }
        }
        &:not(:last-child){
          td>div{
            padding-bottom: 29px;
          }
        }
      td{
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #333333;
          letter-spacing: 0;
          >div{
            min-width: 50px;
            padding-right: 10px;
          }
          &:nth-of-type(1){
            padding-left: 14px;
            letter-spacing: 0;
            div{
              width: 65px;
            }
          }
        }
      }
    }
  }
  .statistics{
    padding: 24px 0 0 14px;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #848484;
    letter-spacing: 0;
    span{
      display:inline-block;
      &:not(.notmr){
        margin-right: 6px;
      }
    }
    .size{
      float: right;
    }
  }
  /deep/ {
    .ivu-table-cell{
      padding-left: 8px;
      padding-right: 8px;
    }
    tr:nth-last-of-type(1){
      td{
        border-right: 0;
      }
      td.draw, td.dxLargeRate{
        position: relative;
        .ivu-table-cell{
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          line-height: 40px;
          word-break: break-all;
          white-space: nowrap;
        }
      }
    }
  }
</style> 