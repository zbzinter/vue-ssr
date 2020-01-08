<!-- 让分盘路比较table 、总分盘路比较 -->
<template>
  <div class="tape-table">
    <Table
      :columns="columns1"
      :data="getTransferArrData"
      size="small"
      border
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
    </Table>
    <Modal
      v-model="isShowModal"
      width="1000"
      @on-ok="sure"
      @on-cancel="cancel"
    >
      <div class="table">
        <Table
          stripe
          :columns="columns2"
          :data="dialogData" 
        />
      </div>
    </Modal>
  </div>
</template>

<script>
import { Decimal } from 'decimal.js'
import {Modal,Table} from 'iview'
import mixins from '../mixins'
export default {
  name: 'TapeCompareTable',
  components: {
    Modal,
    Table
  },
  mixins: [mixins],
  props: [
    'matchData',
    'titles',
    'objVal',
    'type', // dx,asia
    'teamType',
    'isAllFiled' // 全场或者半场
  ],
  data () {
    return {
      isShowModal: false,
      'rowTitle': {
        All: '总',
        Host: '主',
        Guest: '客',
        
      },
      dialogData: []
    }
  },
  computed: {
    titleName() {
      let titleName = []
      if(this.type === 'asia'){
        titleName = [this.isAllFiled ? '全场' : '半场', '赛', '赢盘', '走水', '输盘', '赢盘率', '详情']
      } else if(this.type === 'dx'){
        titleName = [this.isAllFiled ? '全场' : '半场', '赛', '大分', '走水', '小分', '大分率', '详情']
      }
      return titleName
    },
    isEmpty(){
      return !(this.objVal && Object.keys(this.objVal).length)
    },
    way(){
      if(!this.isAllFiled) { // 半场
        return this.type === 'asia' ? 13 : this.type === 'dx' ? 14 : null
      }
      return this.type === 'asia' ? 1 : this.type === 'dx' ? 3 : null
    },
    teamId(){
      return this.teamType === 'host' ? this.matchData.hostTeamId : this.teamType === 'guest' ? this.matchData.guestTeamId: ''
    },
    columns2() {
      return [
        {
          title: '赛事',
          key: 'leagueName'
        },
        {
          title: '比赛时间',
          key: 'time'
        },
        {
          title: '客队',
          key: 'guestTeamName'
        },
        {
          title: '比分',
          key: 'score'
        },
        {
          title: '主队',
          key: 'hostTeamName'
        },
        {
          title: '总分',
          key: 'total'
        },
        {
          title: '盘口',
          key: 'dxRate'
        },
        {
          title: '盘路',
          key: 'dxDesc'
        }
      ]
    },
    columns1 () {
      let { titleName } = this
      return [  
        {
          title: titleName[0],
          key: 'name',
          width: 70,
          render: (h, {row})=>{
            return h('span', {
            }, this.format(row.name))
          }
        },
        {
          title: titleName[1],
          key: 'count',
          width: 60,
          render: (h, {row})=>{
            return h('span', {
            }, this.format(row.count))
          }
        },
        {
          title: titleName[2],
          key: 'win',
          width: 65,
          render: (h, {row, index, column})=>{
            return h('span', {
            }, index !== this.getTransferArrData.length -1 ? this.format(row.win) : '')
          }
        },
        {
          title: titleName[3],
          key: 'draw',
          slot: 'draw',
          className: 'draw',
          width: 65
        },
        {
          title: titleName[4],
          key: 'lost',
          width: 65,
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
          width: 100,
          ellipsis: true,
          tooltip: true,
          render: (h, {row})=>{
            return h('span', {
            }, this.format(row.tapeRate))
          }
        },
        {
          title: titleName[6],
          className: 'detail',
          key: 'detail',
          ellipsis: true,
          tooltip: true,
          render: (h, {row, index})=>{
            return h('div', {
              class: 'red',
              on: {
                click:()=>{
                  let len = index !== this.getTransferArrData.length -1 ? 10 : 6
                  this.lookInfo(len)
                }
              }
            }, '查看')
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
          count: objVal[`${type}${index}Win`] + objVal[`${type}${index}Draw`] + objVal[`${type}${index}Lost`],
          win: objVal[`${type}${index}Win`],
          lost: objVal[`${type}${index}Lost`],
          draw: objVal[`${type}${index}Draw`],
          tapeRate: getPercent(objVal[`${type}${index}Win`], (objVal[`${type}${index}Win`] + objVal[`${type}${index}Draw`] + objVal[`${type}${index}Lost`]))
        }
        $ind++
      }
      objVal[`${type}Desc`] = objVal[`${type}Desc`].substr(0, 6)
      getTransferArrData.push({
        name: '近6场',
        count: 6
      })
      return getTransferArrData
    }
  },
  methods: {
    getPercent (num, total) {
      return total ? `${new Decimal(num*100).dividedBy(total).toFixed(1)}%` : '-'
    },
    lookInfo (size) {
      this.getQueryMatchOddTrend(size)
    },
    getQueryMatchOddTrend (size = 10) { // 让分和大小分 历史相同盘口接口
      let filed = this.isAllFiled ? 1 : 2
      let params = {
        matchId: this.matchData.matchId,
        type: filed,
        teamId: this.teamId,
        detail: true,
        size
      }
      if(this.$requireParams({matchId: this.matchData.matchId, teamId: this.teamId})) return
      return this.$get('/v7/queryMatchOddTrend', params).then(res => {
        this.isShowModal = true
        if (res.data && res.data.sameOddMatch) {
          res.data.sameOddMatch.forEach(item => {
            item.time = this.dayjs(item.matchTime).format('YYYY-MM-DD')
            item.score = `${item.guestTeamScore}-${item.hostTeamScore}`
            item.total = item.guestTeamScore + item.hostTeamScore
            // if(this.way === 1 || this.way === 13) {
            //   item.asiaRate = item.rate
            // }
            // if(this.way === 3 || this.way === 14) {
            //   item.dxRate = item.rate
            // }
            this.addItem({item, teamId: this.teamId, sportType: 'basketball'})
          })
          this.dialogData = res.data.sameOddMatch
        }
      })
    },
    sure () {
    },
    cancel () {
    }
  }
}
</script>
<style scoped lang="scss">

.br{
  border-right: 1px solid #eee;
}
.bb{
  border-bottom: 1px solid #eee;
}
.ellipsis{
		overflow: hidden;
		text-overflow: ellipsis;
    white-space: nowrap;
}
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
  .guest-team, .host-team{
      .tape-table:nth-of-type(2) .ivu-table-wrapper{
        border-bottom: 0;
      }
      .tape-table:nth-of-type(3) .ivu-table-wrapper{
        border-top: 0;
      }
  }

  .table{
    margin: 40px 0 10px;
  }
  /deep/ {
    .ivu-table-wrapper, td, th{
      border-color: #F5F5F5
    }
    .ivu-table:before, .ivu-table:after{
      background-color: #F5F5F5
    }
    .ivu-table-wrapper{
      .red{
        color: #F06151;
      }
      .blue{
        color: #3683FF;

      }
      .green{
        color: #80A963;
      }
      td, th{
        text-align: center;
      }
      tbody{
        tr{
          td{
            &.detail{
                cursor: pointer;
              }
            }
        }
        tr:nth-last-of-type(1){
          td:nth-child(3),td:nth-child(4){
            border-right: 0;
          }
          td.draw{
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
    }
  }
  @import '../../../Common/detail.scss';
</style> 