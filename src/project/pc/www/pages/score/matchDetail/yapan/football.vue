<!-- 让分 -->
<template>
  <div class="yapan">
    <Table
      class="data-table"
      :columns="columns(1)"
      :data="oddsData"
      @on-select="checkedHandler"
      @on-select-cancel="checkedCancelHandler"
    />
    <div class="bg" />
    <Table
      v-if="setAllComputedVal(1).length"
      class="statistics-table"
      :columns="columns(2)"
      :data="setAllComputedVal(1)"
      @on-select="checkedHandler"
      @on-select-cancel="checkedCancelHandler"
    />
    <FilterColumn
      :odds-data.sync="oddsData"
      :selected.sync="selected"
      :match-data="matchData"
      :type-id="1"
    />
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapGetters } = createNamespacedHelpers('odds')
import {Table} from 'iview'
import FilterColumn from '../Common/FilterColumn'
import oddsjs from '../../mixins/MixinsOdds'
import MixinsOddsPush from '../../mixins/MixinsOddsPush.js'
export default {
  components: {
    Table,
    FilterColumn
  },
  mixins: [oddsjs, MixinsOddsPush],
  props: [
    'matchData'
  ],
  data () {
    return {
      ischeck: false,
      isEarlyPan: false,
      titles: ['', '客队', '盘口', '主队', '客队', '盘口', '主队', ''],
      selected: [],
      oddsData: []
    }
  },
  computed: {
    ...mapState(['tempOddsData']),
    ...mapGetters(['filterOddsArr']),
    getVuexFilterOdds(){
      return this.filterOddsArr({$set: this.$set,typeId:1, matchData: this.matchData})
    },
    columns(){
      return (type)=>{
        return [
          {
            title: '选择',
            type: 'selection',
            width: 50,
            align: 'center',
            className: 'b-r',
            renderHeader: (h, params)=>{
              return h('span', {
              }, '全选')
            }
          },
          {
            title: '公司',
            key: 'bookName',
            width: 140,
            className: 'b-r',
            align: 'left',
            ellipsis: true
          },
          {
            title: '主队',
            key: 'valueForType1',
            width: 120,
            align: 'center',
            render: (h, {row, column, index})=>{
              return h('span', {
                class: this.setColor(row.value0ForType1, row.valueForType1)
              }, this.format(row.valueForType1))
            }
          },
          {
            title: '即时盘',
            key: 'ovalue',
            minWidth: 120,
            align: 'center',
            render: (h, {row, column, index})=>{
              return h('span', {
                class: `${this.setColor(row.ovalue0Num, row.ovalueNum)} mid`
              }, this.format(row.ovalue))
            }
          },
          {
            title: '客队',
            key: 'valueForType2',
            width: 120,
            align: 'center',
            className: 'b-r',
            render: (h, {row, column, index})=>{
              return h('span', {
                class: this.setColor(row.value0ForType2, row.valueForType2)
              }, this.format(row.valueForType2))
            }
          },
          {
            title: '主队',
            key: 'value0ForType1',
            width: 120,
            align: 'center',
            render: (h, {row})=>{
              return h('span', {}, this.format(row.value0ForType1))
            }
          },
          {
            title: '初始盘',
            key: 'ovalue0',
            width: 120,
            align: 'center',
            render: (h, {row})=>{
              return h('span', {}, this.format(row.ovalue0))
            }
          },
          {
            title: '客队',
            key: 'value0ForType2',
            width: 120,
            className: 'b-r',
            align: 'center',
            render: (h, {row})=>{
              return h('span', {}, this.format(row.value0ForType2))
            }
          },
          {
            title: '变化时间',
            key: 'value0ForType2',
            width: 120,
            className: 'b-r',
            align: 'center',
            render: (h, {row, column, index})=>{
              return h('span', {
              }, this.format(type === 1 ? this.dayjs(row.createTime).format('MM-DD HH:mm') : ''))
            }
          },
          {
            title: ' ',
            key: 'look',
            align: 'center',
            minWidth: 80,
            render: (h, {row, column, index})=>{
              return h('router-link', {
                attrs: {
                  target: '_blank',
                },
                props: {
                  to: `/score/detail/football/zhishu/${this.matchData.matchId}?type=${'yapan'}&bookId=${row.bookId}&typeId=${row.typeId}&bookName=${row.bookName}`
                }
              }, type === 1 ? '查看' : '')
            }
          }
        ]
      }}
  },
  created () {
    this.getOddsApi({matchId: this.matchData.matchId, $get: this.$get}).then((res)=>{
      this.oddsData = [...this.getVuexFilterOdds]

    })
  },
  methods: {
    ...mapActions(['getOddsApi']),
    setColor (front = 0, back = 0) { // 即盘的颜色设置
      front = parseFloat(front)
      back = parseFloat(back)
      if (back > front) {
        return 'iconca_ei'
      } else if (back < front) {
        return 'iconca_el'
      }
    },
    checkedHandler(selectedItems){
      this.selected = selectedItems
    },
    checkedCancelHandler(selectedItems){
      this.selected = selectedItems
    }
  }
}
</script>

<style scoped lang="scss">
@import '../Common/oddsPush.scss';
.yapan{
  position: relative;
  margin: 0 auto;
  width: 1200px;
  padding-bottom: 28px;
  background-color: #fff;
  .bg{
    height: 30px;
    border-bottom: 1px solid #EAEAEA;
  }
}
$gray: #dedede;
$bg-gray: #f7f7f8;
/deep/ {
  .green{
        color: #4DA183      
    }
    .red{
        color: #E15756
    }
  .ivu-table-wrapper{
    border: 0
  }
  .b-r{
    border-right:1px solid $gray;
  }
  .ivu-table:after{
    width: 0
  }
  thead, tbody{
    tr{
      th.b-r{
        border-right: 0
      }
      td:nth-of-type(1),th:nth-of-type(1){
        border-right: 0;
        div{
          padding-right: 0;
        }
      }
      td:nth-of-type(2),th:nth-of-type(2){
        border-left: 0;
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
  .data-table{
    tbody{
      tr:nth-of-type(2n-1){
        td{
          background: #FAFAFA 
        }
      }
      .ivu-table-cell{
        height: 100%;
        >span, a, label{
          display: block;
          line-height: 48px;
        }
      }
    }
  }
  .statistics-table{
    background: #FAFAFA;
    .ivu-table-header{
      display: none
    }
    .ivu-table-tbody{
      tr{
        td{
          background: #FAFAFA;
          &:nth-of-type(1) div{
            visibility: hidden;
          }
        }
      }
    }
  }
}

</style>
