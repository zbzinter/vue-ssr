<!-- 欧指table -->
<template>
  <div :class="{'table-math':type === 'math'}">
    <Table
      :columns="columns"
      :data="getTransferArrData"
      size="small"
      :class="{double: isEarlyPan, 'math-table':type === 'math'}"
      stripe
      @on-select="checkedItemHandler"
      @on-select-cancel="checkedItemHandler"
      @on-select-all="checkedItemHandler"
    >
      <template
        slot="host"
        slot-scope="{ row }"
      >
        <div
          v-show="isEarlyPan"
          class="b-b"
        >
          {{ format(row.value0ForType1) }}
        </div>
        <div :class="setColor(type !== 'math' && row.value0ForType1, row.valueForType1)">
          {{ format(row.valueForType1) }}
        </div>
      </template>
      <template
        slot="draw"
        slot-scope="{ row }"
      >
        <div
          v-show="isEarlyPan"
          class="b-b"
        >
          {{ format(row.value0ForTypeX) }}
        </div>
        <div :class="[setColor(type !== 'math' && row.value0ForTypeX, row.valueForTypeX), 'mid']">
          {{ format(row.valueForTypeX) }}
        </div>
      </template>
      <template
        slot="guest"
        slot-scope="{ row }"
      >
        <div
          v-show="isEarlyPan"
          class="b-b"
        >
          {{ format(row.value0ForType2) }}
        </div>
        <div :class="setColor(type !== 'math' && row.value0ForType2, row.valueForType2)">
          {{ format(row.valueForType2) }}
        </div>
      </template>
      <template
        slot="hostRate"
        slot-scope="{ row }"
      >
        <div
          v-show="isEarlyPan"
          class="b-b"
        >
          {{ format(getRate(getReturnRete(row, 'early'), row.value0ForType1)) }}
        </div>
        <div>
          {{ format(getRate(getReturnRete(row, 'instant'), row.valueForType1)) }}
        </div>
      </template>
      <template
        slot="drawRate"
        slot-scope="{ row }"
      >
        <div
          v-show="isEarlyPan"
          class="b-b"
        >
          {{ format(getRate(getReturnRete(row, 'early'), row.value0ForTypeX)) }}
        </div>
        <div>
          {{ format(getRate(getReturnRete(row, 'instant'), row.valueForTypeX)) }}
        </div>
      </template>
      <template
        slot="guestRate"
        slot-scope="{ row }"
      >
        <div
          v-show="isEarlyPan"
          class="b-b"
        >
          {{ format(getRate(getReturnRete(row, 'early'), row.value0ForType2)) }}
        </div>
        <div>
          {{ format(getRate(getReturnRete(row, 'instant'), row.valueForType2)) }}
        </div>
      </template>
      <template
        slot="returnRate"
        slot-scope="{ row }"
      >
        <div
          v-show="isEarlyPan"
          class="b-b"
        >
          {{ format(getReturnRete(row, 'early')) }}
        </div>
        <div>
          {{ format(getReturnRete(row, 'instant')) }}
        </div>
      </template>
    </Table>
  </div>
</template>

<script>
import { Decimal } from 'decimal.js'
import oddsjs from '../../mixins/MixinsOdds'
import {Table} from 'iview'
export default {
  components: {
    Table
  },
  mixins: [
    oddsjs
  ],
  props: [
    'ischeck',
    'isEarlyPan',
    'type',
    'oddsData',
    'isAllcheck',
    'matchData',
    'selected'
  ],
  data () {
    return {
      math: ['最高', '最低', '平均']
    }
  },
  computed: {
    getTransferArrData(){
      return (this.type === 'math' ? this.setAllComputedVal() : this.tableData) || []
    },
    tableData () {
      if(this.type === 'math') return this.math
      return this.oddsData || []
    },
    columns () {
      let noMath = this.type !== 'math'
      let columns = [  
        {
          title: noMath ? '公司' : ' ',
          key: 'bookName',
          width: noMath ? 140 : 190,
          className: 'b-r book-name row-pd',
          align: 'left',
          ellipsis: true,
          render: (h, {row})=>{
            return h('div', {}, noMath ? row.bookName : `${row.oupeiName}值`)
          }
          // slot: 'bookName'
        },
        {
          title: '类型',
          width: 80,
          className: 'b-r',
          align: 'center',
          render: (h, {row})=>{
            return h('div', [
              h('div', {class: 'b-b'}, '初盘'),
              h('div', {}, '即时'),
            ])
          }
        },
        {
          title: '主胜',
          width: 120,
          className: '',
          align: 'center',
          slot: 'host'
        },
        {
          title: '平',
          width: 100,
          align: 'center',
          slot: 'draw'
        },
        {
          title: '客胜',
          width: 120,
          align: 'center',
          className: 'b-r',
          slot: 'guest'
        },
        {
          title: '主胜率',
          className: '',
          slot: 'hostRate',
          width: 120,
          align: 'center'
        },
        {
          title: '和率',
          className: '',
          slot: 'drawRate',
          width: 100,
          align: 'center'
        },
        {
          title: '客胜率',
          slot: 'guestRate',
          width: 120,
          className: 'b-r',
          align: 'center'
        },
        {
          title: '返还率',
          slot: 'returnRate',
          className: 'b-r',
          align: 'center'
        },
        {
          title: ' ',
          align: 'center',
          render: (h, {row})=>{
            return h('router-link', {
              attrs: {
                target: '_blank',
              },
              props: {
                to: `/score/detail/football/zhishu/${this.matchData.matchId}?type=${'oupei'}&bookId=${row.bookId}&typeId=${row.typeId}&bookName=${row.bookName}`
              }
            }, this.type != 'math' ? '查看' : '')
          }
        }
      ]
      if(noMath){
        columns.unshift(
          {
            title: '选择',
            type: 'selection',
            width: 50,
            align: 'center',
            className: 'row-pd selection'
          },
        )
      }
      return columns || []
    }
  },
  watch: {
  },
  created () {
  },
  mounted () {

  },
  methods: {
    checkedItemHandler(selectedItems){
      this.$emit('update:selected', selectedItems)
    },
    getRate(getReturnRete, odds){
      getReturnRete = parseFloat(getReturnRete)/100
      return odds ? `${new Decimal(getReturnRete*100).dividedBy(odds).toFixed(2)}%` : ''
    },
    // getRate (item, front, type) { // 客胜率、主胜率、和率
    //   let frontVal = parseFloat(item[front])
    //   let total
    //   if (type === 'early') {
    //     total = parseFloat(item.value0ForType1) + parseFloat(item.value0ForType2) + parseFloat(item.value0ForTypeX)
    //   } if (type === 'instant') {
    //     total = parseFloat(item.valueForType1) + parseFloat(item.valueForType2) + parseFloat(item.valueForTypeX)
    //   } 
    //   return total ? `${new Decimal(frontVal*100).dividedBy(total).toFixed(2)}%` : ''
    // },
    isNoData (arr) {
      return arr.every(item=>{
        return item || item === 0
      })
    },
    setColor (front = 0, back = 0) { // 即盘的颜色设置
      front = parseFloat(front)
      back = parseFloat(back)
      if (back > front) {
        return 'iconca_ei'
      } else if (back < front) {
        return 'iconca_el'
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../Common/oddsPush.scss';
$gray: #dedede;
$bg-gray: #f7f7f8;
    .green{
        color: #4DA183      
    }
    .red{
        color: #E15756
    }
  .w-80{
    width: 80px;
  }
  .w-180{
    width: 180px;
  }
  .w-100{
    width: 100px;
  }
  .w-120{
    width: 120px;
  }
  .w-220{
    width: 220px;
  }
  .w-320{
    width: 320px;
  }
.b-r{
  border-right:1px solid $gray;
}
.ic_checked_cf{
  display:inline-block;
  width: 14px;
  height: 14px;
  background: url(../../../../assets/score/football/bt_cg.png) center center no-repeat;
  background-size: 100% auto;
  background-repeat: no-repeat;
}
.iconbs_cf{
  font-family: 'iconfont';
  font-size: 14px;
}
    table{
      width: 100%;
      th{
        background: $bg-gray;
        padding: 8px 0;

      }
      tr{
        &:nth-of-type(2n-1){
          background: #fff;
        }
        td{
          &.is-check{
            cursor: pointer;
            text-align: left;
            padding-left: 48px;
            span.checked {
              margin-right: 24px;
              text-align: left;
              vertical-align: middle;
            }
          }
          &.middle{
            vertical-align: middle;
          }
          padding: 8px 0;
          border-bottom: 1px solid $gray;
        }
      }
      text-align: center;
    }
.table-math{
  margin-top: 30px;
}
/deep/ {
  .ivu-table-wrapper{
    border: 0
  }
  .ivu-table:after{
    width: 0
  }
  .ivu-table-small td{
    height: 40px;
  }
  .double{
    .ivu-table-small td{
      height: auto;
      line-height: 36px;
    }
  }
.ivu-table th{
  height: 40px;
  background-color: #fafafa;
}
td:nth-of-type(1),th:nth-of-type(1){
  border-right: 0;
  div{
    padding-right: 0;
  }
}
// .ivu-table-body tr:nth-child(2n-1) td,  .ivu-table-fixed-body tr:nth-child(2n) td{
//   background-color:#fafafa
// }
  .ivu-table-wrapper{
    tbody{
      td{
        padding: 0;
      }
      .ivu-table-cell{
        padding: 0;
      }
      .b-r{
        border-right:1px solid #eaeaea;
      }
      .b-b{
        border-bottom:1px solid #eaeaea;
        height: 36px;
      }
      td.book-name{
        color: #666;
      }
    }
    .ivu-table-header{
      font-weight: normal;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
    }
    &.math-table{
      border-top: 1px solid #dcdee2;
      .ivu-table-header{
        display: none;
      }
      .row-pd{
        padding-left: 30px;
      }
      td{
        background: #fafafa;
      }
    }
    .row-pd{
      padding-left: 18px;
      padding-right: 18px;
      &.selection{
        padding-right: 0;
      }
    }
  }

  thead .ivu-table-cell-with-selection{
    display: none
  }
  .ic_checked_cf{
    display:inline-block;
    width: 14px;
    height: 14px;
    background: url(../../../../assets/score/football/bt_cg.png) center center no-repeat;
    background-size: 100% auto;
    background-repeat: no-repeat;
  }
  .iconbs_cf{
    font-family: 'iconfont';
    font-size: 14px;
  }
  .ivu-checkbox{
    &.ivu-checkbox-checked{
      .ivu-checkbox-inner{
        background-color: transparent;
        @extend .ic_checked_cf;
        &:after{
          display: none;
        }
        &:before{
          display: none;
        }
      }
    }
    .ivu-checkbox-focus{
      box-shadow: none
    }
    .ivu-checkbox-inner{
      transition: none;
      background-color: transparent;
      border: 0;
      @extend .iconbs_cf;
      &:before{
        content: "\e632"
      }
    }
  }
}
</style>
