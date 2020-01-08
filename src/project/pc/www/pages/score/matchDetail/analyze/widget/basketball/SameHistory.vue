<!-- 让分盘路比较 、总分盘路比较 下的相同历史盘口 -->
<template>
  <div class="same-table" v-if="arrVal && arrVal.length > 0">
    <div class="head">
      <!-- <span class="title-name">相同历史盘口</span> -->
      <span class="team-name">{{ teamName }}</span>
      <Select
        v-model="tapeSize"
        size="small"
        style="width:100px"
      >
        <Option
          v-for="item in fieldTimeArr"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </Option>
      </Select>
    </div>
    <Table
      :columns="columns"
      :data="getTransferArrData"
      size="small"
      class="no-border"
    >
      <template
        slot="guestTeamName"
        slot-scope="{ row }"
      >
        <Tooltip :content="row.guestTeamName">
          <div class="team-name">
            <span class="ellipsis">{{ row.guestTeamName }}</span>
            <defaultImg
              :src="row.guestTeamLogo"
              :default-url="defaultImg.basketball"
            />
          </div>
        </Tooltip>
      </template>
      <template
        slot="score"
        slot-scope="{ row }"
      >
        <div>
          <span>{{ row.hostTeamScore }}</span>
          <i>:</i>
          <span>{{ row.guestTeamScore }}</span>
        </div>
      </template>
      <template
        slot="hostTeamName"
        slot-scope="{ row }"
      >
        <Tooltip :content="row.hostTeamName">
          <div class="team-name">
            <defaultImg
              :src="row.guestTeamLogo"
              :default-url="defaultImg.basketball"
            />
            <span class="ellipsis">{{ row.hostTeamName }}</span>
          </div>
        </Tooltip>
      </template>
    </Table>
  </div>
</template>

<script>
import { Decimal } from 'decimal.js'
import mixins from '../mixins.js'
import {Table, Tooltip} from 'iview'
import DefaultImg from '@src/components/DefaultImg'
import {
  Select,
  Option
} from 'iview'
export default {
  name: 'SameHistory',
  components: {
    Select,
    Option,
    Table,
    DefaultImg,
    Tooltip
  },
  mixins: [mixins],
  props: [
    'arrVal',
    'teamName',
    'selfId',
    'way'
  ],
  data () {
    return {
      'rowTitle': {
        All: '总场数',
        Host: '主场',
        Guest: '客场'
      },
      title: ['赛事', '时间', '客队', '比分', '主队', '胜负', '分差', '盘口', '盘路'],
      tapeSize: 5,
    }
  },
  computed: {
    isEmpty(){
      return !(this.arrVal && Object.keys(this.arrVal).length)
    },
    getTransferArrData(){
      Array.isArray(this.arrVal) && this.arrVal.forEach(item => {
        this.addItem({item, teamId: this.selfId, sportId: 'basketball'})
      })
      return this.arrVal
    },
    columns () {
      return [  
        {
          title: '赛事',
          key: 'leagueName',
          width: 120,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '时间',
          key: 'matchTime',
          width: 120,
          render: (h, {row})=>{
            return h('span', {
            }, this.format(this.dayjs(row.matchTime).format('YYYY-MM-DD')))
          }
        },
        {
          title: '客队',
          key: 'guestTeamName',
          slot: 'guestTeamName',
          width: 200,
          ellipsis: true,
          tooltip: true,
          className: 'guest-team',
          align: 'right'
        },
        {
          title: '比分',
          slot: 'score',
          key: 'lost',
          width: 80,
          align: 'center'
        },
        {
          title: '主队',
          slot: 'hostTeamName',
          className: 'red',
          key: 'goal',
          width: 200,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '胜负',
          className: 'red',
          key: 'winLosDesc',
          width: 90,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
              class: row.winLos
            }, this.format(row.winLosDesc))
          }
        },
        {
          title: '分差',
          className: 'red',
          key: 'goalDiff',
          width: 90,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(row.hostTeamScore - row.guestTeamScore))
          }
        },
        {
          title: '盘口',
          key: 'rate',
          width: 90,
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
            }, this.format(row.rate))
          }
        },
        {
          title: '盘路',
          key: 'tapeDesc',
          ellipsis: true,
          tooltip: true,
          align: 'center',
          render: (h, {row})=>{
            return h('span', {
              class: row.tape
            }, this.format(row.tapeDesc))
          }
        },
      ]
    }
  },
  watch: {
    tapeSize(val){
      this.$parent.getQueryHistorySameOdd(this.way, val)
    }
  },
  methods: {
    getPercent (num, total) {
      return total ? `${new Decimal(num*100).dividedBy(total).toFixed(1)}%` : '-'
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../../Common/detail.scss';
      $red: #E15756;
      $blue: #3683FF;
      $green: #80A963;
      .ellipsis{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      };
  i{
    font-style: normal
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
  .same-table+.same-table{
    margin-top: 36px;
  }
  .same-table{
    margin-top: 30px;
    .head{
      padding: 0 0 14px;
      span, >div{
        vertical-align: middle;
      }
      .title-name{
        font-size: 16px;
        font-weight: 600;
      }
      .team-name{
        margin-right: 10px;
        color: $blue;
        letter-spacing: 0;
        line-height: 24px;
        display: inline-block;
        vertical-align: sub;
        font-family: PingFangSC-Semibold;
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
  /deep/ {
    .ivu-table-wrapper{
      overflow: visible;
      .team-name{
        span, img{
          vertical-align: middle;
        }
        img{
          width: 24px;
          height: 24px;
        }
        span{
          display: inline-block;
          max-width: 135px;
        }
      }
    }
  }
</style> 