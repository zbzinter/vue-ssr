<!-- 欧指table -->
<template>
  <div :class="{'table-math':type === 'math'}">
    <Table
      :columns="columns"
      :data="getTransferArrData"
      size="small"
      :class="{double: isEarlyPan}"
      @on-select="checkedItemHandler"
      @on-select-cancel="checkedItemHandler"
      @on-select-all="checkedItemHandler"
    >
      <template
        slot="bookName"
        slot-scope="{ row }"
      >
        <div v-if="type !== 'math'">
          {{ row.bookName }}
        </div>
        <div v-else>
          <div>初盘{{ row.bookName }}值</div>
          <div v-show="isEarlyPan">
            即时{{ row.bookName }}值
          </div>
        </div>
      </template>
      <template
        slot="guest"
        slot-scope="{ row }"
      >
        <div v-show="isEarlyPan">
          {{ row.value0ForType2 }}
        </div>
        <div :class="setColor(type !== 'math' && row.value0ForType2, row.valueForType2)">
          {{ row.valueForType2 }}
        </div>
      </template>
      <template
        slot="host"
        slot-scope="{ row }"
      >
        <div v-show="isEarlyPan">
          {{ row.value0ForType1 }}
        </div>
        <div :class="setColor(type !== 'math' && row.value0ForType1, row.valueForType1)">
          {{ row.valueForType1 }}
        </div>
      </template>
      <template
        slot="guestRate"
        slot-scope="{ row }"
      >
        <div v-show="isEarlyPan">
          {{ getRate(row, 'value0ForType2', 'early') }}
        </div>
        <div>
          {{ getRate(row, 'valueForType2', 'instant') }}
        </div>
      </template>
      <template
        slot="hostRate"
        slot-scope="{ row }"
      >
        <div v-show="isEarlyPan">
          {{ getRate(row, 'value0ForType1', 'early') }}
        </div>
        <div>
          {{ getRate(row, 'valueForType1', 'instant') }}
        </div>
      </template>
      <template
        slot="returnRate"
        slot-scope="{ row }"
      >
        <div v-show="isEarlyPan">
          {{ getReturnRete(row, 'value0ForType1', 'value0ForType2') }}
        </div>
        <div>
          {{ getReturnRete(row, 'valueForType1', 'valueForType2') }}
        </div>
      </template>
    </Table>
  </div>
</template>

<script>
import { Decimal } from 'decimal.js'
import {Table} from 'iview'
export default {
  components: {
    Table
  },
  props: [
    'selected',
    'ischeck',
    'isEarlyPan',
    'type',
    'oddsData',
    'isAllcheck'
  ],
  data () {
    return {
      math: ['最高', '最低', '平均']
    }
  },
  computed: {
    getTransferArrData(){
      return this.type === 'math' ? this.setAllComputedVal : this.tableData
    },
    tableData () {
      if(this.type === 'math') return this.math
      return this.oddsData || []
    },
    setAllComputedVal () { // 欧指的最高、最低、平均
      let reArr = []
      let guestEarly = this.getComputedVal('value0ForType2')
      let hostEarly = this.getComputedVal('value0ForType1')
      let guestInstant= this.getComputedVal('valueForType2')
      let hostInstant = this.getComputedVal('valueForType1')
      reArr[0] = {
        value0ForType2: guestEarly[0],
        value0ForType1: hostEarly[0],
        valueForType2: guestInstant[0],
        valueForType1: hostInstant[0],
        bookName: '最高'
      }
      reArr[1] = {
        value0ForType2: guestEarly[guestEarly.length -1 || 0],
        value0ForType1: hostEarly[hostEarly.length -1 || 0],
        valueForType2: guestInstant[guestInstant.length -1 || 0],
        valueForType1: hostInstant[hostInstant.length -1 || 0],
        bookName: '最低'
      }
      reArr[2] = {
        value0ForType2: this.getComputedAvgVal(reArr[0].value0ForType2, reArr[1].value0ForType2),
        value0ForType1: this.getComputedAvgVal(reArr[0].value0ForType1, reArr[1].value0ForType1),
        valueForType2: this.getComputedAvgVal(reArr[0].valueForType2, reArr[1].valueForType2),
        valueForType1: this.getComputedAvgVal(reArr[0].valueForType1, reArr[1].valueForType1),
        bookName: '平均'
      }
      return reArr
    },
    columns () {
      let noMath = this.type !== 'math'
      let columns = [  
        {
          title: noMath ? '公司' : ' ',
          key: 'bookName',
          width: noMath ? 160 : 240,
          className: 'b-r book-name',
          align: 'center',
          ellipsis: true,
          slot: 'bookName'
        },
        {
          title: '客胜',
          width: 160,
          align: 'center',
          slot: 'guest'
        },
        {
          title: '主胜',
          width: 160,
          className: 'b-r',
          align: 'center',
          slot: 'host'
        },
        {
          title: '客胜率',
          slot: 'guestRate',
          width: 160,
          align: 'center'
        },
        {
          title: '主胜率',
          className: 'b-r',
          slot: 'hostRate',
          width: 160,
          align: 'center'
        },
        {
          title: ' ',
          className: 'red',
          slot: 'returnRate',
          align: 'center'
        }
      ]
      if(noMath){
        columns.unshift(
          {
            title: '选择',
            type: 'selection',
            width: 80,
            align: 'center',
            className: 'b-r'
          },
        )
      }
      return columns
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
    getRate (item, front, type) { // 客胜率、主胜率
      let frontVal = parseFloat(item[front])
      let total
      if (type === 'early') {
        total = parseFloat(item.value0ForType1) + parseFloat(item.value0ForType2)
      } if (type === 'instant') {
        total = parseFloat(item.valueForType1) + parseFloat(item.valueForType2)
      } 
      return total ? `${(100-new Decimal(frontVal*100).dividedBy(total)).toFixed(2)}%` : ''
    },
    getReturnRete (item, host, guest) { // 返还率 =（主赔*客赔）/（主赔+客赔）
      if(!item[host] || !item[guest]) return
      let front = new Decimal(item[host]).mul(item[guest])
      let back = new Decimal(item[host]).plus(item[guest])
      return back ? `${new Decimal(100*front).dividedBy(back).toFixed(2)}%` : '-'
    },
    setColor (front = 0, back = 0) { // 即盘的颜色设置
      front = parseFloat(front)
      back = parseFloat(back)
      if (back > front) {
        return 'iconca_ei'
      } else if (back < front) {
        return 'iconca_el'
      }
    },
    getComputedVal (sortName, type = 'max') { // 最高、最低
      let sortArr = this.oddsData && this.oddsData.slice().sort(function(a, b){
        if (type === 'max') return b[sortName] - a[sortName] // 升序，取第一个
        if (type === 'min') return a[sortName] - b[sortName]
      })
      let sortNameArr = sortArr.reduce((total, item) => {
        total.push(item[sortName])
        return total
      }, []).filter(item => (item !== '' && item !== null && item !== undefined))
      return sortNameArr
    },
    getComputedAvgVal (max, min) { // 平均值
      if (!max || !min) return
      let avg = new Decimal(Number(max)).plus(Number(min)).dividedBy(2).toFixed(2)
      return  avg
    }
  }
}
</script>

<style scoped lang="scss">
@import '../Common/oddsPush.scss';
$gray: #fafafa;
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
  .w-100{
    width: 80px;
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
.b-r{
  border-right:1px solid #eaeaea;
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
          }
          &.middle{
            vertical-align: middle;
          }
          padding: 8px 0;
          border-bottom: 1px solid $gray;
          // vertical-align: middle;
          // >div{
          //   min-height: 20px;
          // }
        }
      }
      text-align: center;
    }
.table-math{
  margin-top: 30px;
}
/deep/ {
  .b-r{
    border-right:1px solid #eaeaea;
  }
  .ivu-table-small td{
    
    height: 40px;
  }
  .double{
    .ivu-table-small td{
      padding: 6px 0;
      height: auto;
    }
  }
.ivu-table th{
  background-color: transparent;
}
.ivu-table-body tr:nth-child(2n-1) td,  .ivu-table-fixed-body tr:nth-child(2n) td{
  background-color:#fafafa
}
  .ivu-table-wrapper{
    tbody{
      td.book-name{
        color: #666;
      }
    }
  }
}
</style>
