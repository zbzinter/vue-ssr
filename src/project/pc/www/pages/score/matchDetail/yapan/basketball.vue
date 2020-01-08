<!-- 让分 -->
<template>
  <div class="yapan">
    <div class="header">
      <span>公司</span>
      <span>初指</span>
      <span>即时</span>
    </div>
    <Table
      :columns="columns"
      :data="getVuexFilterOdds"
      size="small"
    >
      <template
        slot="valueForType2"
        slot-scope="{ row }"
      >
        <span :class="setColor(row.value0ForType2, row.valueForType2)">{{ row.valueForType2 }}</span>
      </template>
      <template
        slot="ovalue"
        slot-scope="{ row }"
      >
        <span :class="[setColor(row.ovalue0, row.ovalue), 'mid']">{{ row.ovalue }}</span>
      </template>
      <template
        slot="valueForType1"
        slot-scope="{ row }"
      >
        <span :class="setColor(row.value0ForType1, row.valueForType1)">{{ row.valueForType1 }}</span>
      </template>
      <template
        slot="look"
        slot-scope="{ row }"
      >
        <span
          class="red look-info"
          @click="() => $router.openNewPage(`/score/detail/basketball/zhishu/${matchData.matchId}?type=yapan&bookId=${row.bookId}&typeId=${row.typeId}`)"
        >查看</span>
      </template>
    </Table>
  </div>
</template>

<script>
import {Table} from 'iview'
import MixinsOddsPush from '../../mixins/MixinsOddsPush.js'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapGetters } = createNamespacedHelpers('odds')

export default {
  components: {
    Table
  },
  mixins: [MixinsOddsPush],
  props: [
    'matchData'
  ],
  data () {
    return {
      ischeck: false,
      isEarlyPan: false,
      titles: ['', '客队', '盘口', '主队', '客队', '盘口', '主队', ''],
      oddsData: []
    }
  },
  computed: {
    ...mapState(['tempOddsData']),
    ...mapGetters(['filterOddsArr']),
    getVuexFilterOdds () {
      return this.filterOddsArr({$set: this.$set,typeId:1, matchData: this.matchData})
    },
    columns () {
      let columns = [  
        {
          title: ' ',
          key: 'bookName',
          width: 160,
          className: 'b-r book-name',
          align: 'center',
          tooltip: true
        },
        {
          title: '客队',
          width: 160,
          align: 'center',
          key: 'value0ForType2'
        },
        {
          title: '盘口',
          width: 160,
          align: 'center',
          key: 'ovalue0'
        },
        {
          title: '主队',
          key: 'value0ForType1',
          width: 160,
          className: 'b-r',
          align: 'center'
        },
        {
          title: '客队',
          slot: 'valueForType2',
          width: 160,
          align: 'center'
        },
        {
          title: '盘口',
          className: 'red',
          slot: 'ovalue',
          align: 'center'
        },
        {
          title: '主队',
          className: 'b-r',
          slot: 'valueForType1',
          align: 'center'
        },
        {
          title: ' ',
          className: 'red',
          slot: 'look',
          align: 'center'
        }
      ]
      return columns
    }
  },
  created () {
    this.getOddsApi({matchId: this.matchData.matchId, $get: this.$get})
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
    }
  }
}
</script>

<style scoped lang="scss">
@import '../Common/odds.scss';
@import '../Common/oddsPush.scss';
.yapan{
  margin: 0 auto;
  width: 1200px;
  padding: 40px 30px;
  background: #fff;
  .header{
    background-color: #fafafa;
    border-top: 1px solid #dcdee2;
    border-left: 1px solid #dcdee2;
    border-right: 1px solid #dcdee2;
    span{
      display: inline-block;
      text-align: center;
      height: 40px;
      line-height: 40px;
      &:nth-of-type(1){
        width: 160px;
      }
      &:nth-of-type(2){
        width: 480px;
      }
      &:nth-of-type(3){
        width: 480px;
      }
    }
    
  }
  /deep/ {
    .look-info{
      cursor: pointer;
    }
    .ivu-table-wrapper{
      border-top: 0;
    }
    th.b-r{
      border-right: 0;
    }
    .b-r{
      border-right:1px solid #eaeaea;
    }
    .ivu-table th{
      background-color: transparent;
    }
    .ivu-table-body tr:nth-child(2n-1) td,  .ivu-table-fixed-body tr:nth-child(2n) td{
      background-color:#fafafa
    }
    .ivu-table-wrapper{
      .ivu-table-header{
        background: #F8F8F8;
      }
      th{
        color: #666;
        font-weight: normal;
      }
      tbody{
        tr{
          &:nth-child(odd){
            td{
              background: #ffffff;
            }
          }
          &:nth-child(even){
            td{
              background: #fafafa;
            }
          }
        }
        td{
          color: #333;
        }
        td.book-name{
          color: #666;
        }
        .ivu-table-cell{
          height: 100%;
          >div{
            height: 100%;
          }
          span{
            display: block;
            line-height: 40px;
          }
        }
      }
    }
  }
}
</style>
