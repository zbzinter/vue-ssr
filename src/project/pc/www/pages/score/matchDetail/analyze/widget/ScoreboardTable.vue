<!-- 联赛积分榜table -->
<template>
  <div class="score-board">
    <ul class="navs">
      <li
        v-for="(nav, index) in scoreboardNavs"
        :key="index"
        :class="[{'active': scoreboardNavActiveIndex === index}]"
        @click="goNav(index, 'scoreboardNavActiveIndex')"
      >
        {{ nav }}
      </li>
    </ul>
    <Table
      class="no-border"
      :columns="columns"
      :data="setTableData"
      size="small"
    >
      <template
        slot="teamName"
        slot-scope="{ row }"
      >
        <div class="team-name">
          <default-img
            class="logo"
            :src="row.teamLogo"
            :default-url="defaultImg.football"
          />
          <span class="name ellipsis">{{ row.teamName }}</span>
        </div>
      </template>
    </Table>
  <!-- 杯赛类型没有数据，暂时隐藏了 -->
  <!-- <ul class="desc-text" v-else>
    <li v-for="(item, index) in descList" :key="index">
      <i :class="item.color"></i>
      <span>{{item.text}}</span>
    </li>
  </ul> -->
  </div>
</template>

<script>
import { Decimal } from 'decimal.js'
import DefaultImg from '@src/components/DefaultImg'
import {Table} from 'iview'
export default {
  name: 'ScoreboardTable',
  components: {
    Table,
    DefaultImg
  },
  props: [
    'titles',
    'tableData'
  ],
  data () {
    return {
      scoreboardNavs: ['总积分榜', '主场积分榜', '客场积分榜'],
      scoreboardNavActiveIndex: 0,
      descList: [
        {
          text: '自由杯资格赛',
          color: 'red'
        },
        {
          text: '自由杯附加赛',
          color: 'yellow'
        },
        {
          text: '降级球队',
          color: 'gray'
        },
        {
          text: '其他',
          color: 'blue1'
        }
      ]
    }
  },
  computed: {
    setTableData(){
      this.tableData.forEach(item => {
        let total = item.winNum + item.drawNum + item.loseNum
        let getAvgTotal = item.goals + item.loseGoals
        item.matchNum = item.winNum + item.drawNum + item.loseNum
        item.neatWin = item.goals - item.loseGoals
        item.winRate = total ? `${new Decimal(item.winNum*100).dividedBy(total).toFixed(2)}%` : '-'
        item.drawRate = total ? `${new Decimal(item.drawNum*100).dividedBy(total).toFixed(2)}%` : '-'
        item.lostRate = total ? `${new Decimal(item.loseNum*100).dividedBy(total).toFixed(2)}%` : '-'
        item.avgWin = item.matchNum ? `${new Decimal(item.goals).dividedBy(item.matchNum).toFixed(2)}` : '-'
        item.avgLose = item.matchNum ? `${new Decimal(item.loseGoals).dividedBy(item.matchNum).toFixed(2)}` : '-'
      })
      return this.tableData
    },
    columns () {
      return [  
        {
          title: '排名',
          key: 'rank',
          width: 80,
          align: 'center'
        },
        {
          title: '球队',
          slot: 'teamName',
          width: 140,
          align: 'left'
        },
        {
          title: '比赛',
          key: 'matchNum',
          width: 60,
          align: 'center'
        },
        {
          title: '胜',
          key: 'winNum',
          width: 60,
          align: 'center'
        },
        {
          title: '平',
          key: 'drawNum',
          width: 60,
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: '负',
          key: 'loseNum',
          width: 55,
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: '得',
          key: 'goals',
          width: 60,
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: '失',
          key: 'loseGoals',
          width: 60,
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: '净胜',
          key: 'neatWin',
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
        {
          title: '胜率',
          key: 'winRate',
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },{
          title: '平率',
          key: 'drawRate',
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },{
          title: '负率',
          key: 'lostRate',
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },{
          title: '均得',
          key: 'avgWin',
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },{
          title: '均失',
          key: 'avgLose',
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },{
          title: '积分',
          key: 'score',
          ellipsis: true,
          tooltip: true,
          align: 'center'
        },
      ]
    }
  },
  methods: {
    goNav(index, navActiveIndex = 'navActiveIndex') {
      if(index !== 0 && navActiveIndex === 'navActiveIndex') {
        this.$tip('暂未开发，敬请期待')
        return
      }
      this[navActiveIndex] = index
      if(navActiveIndex === 'scoreboardNavActiveIndex'){
        this.$parent.getQueryLeagueRank(index+1)
      }
    },
  }
}
</script>

<style scoped lang="scss">
@import '../../Common/detail.scss';
$red: #F06151;
$blue: #3683FF;
$blue1: #3F7EDB;
$green: #80A963;
$yellow: #F8C258;
$gray: #B9BFBB;
.ellipsis{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
};
  i{
    font-style: normal
  }
  .red{
    color: $red;
  }
  .blue{
    color: $blue;

  }
  .green{
    color: $green;
  }
  .yellow{
    color: $yellow;
  }
  .score-board{
    margin: 0 16px;
  }
  ul.desc-text{
    padding: 24px 310px 0;
    overflow: hidden;
    li{
      float: left;
      margin-right: 76px;
      font-size: 12px;
      &:last-child{
        margin-right: 0;
      }
      span,i {
        vertical-align: middle;
      }
      i{
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 6px;
        margin-right: 10px;
        &.red{
          background: $red;
        }
        &.yellow{
          background: $yellow;
        }
        &.gray{
          background: $gray;
        }
        &.blue1{
          background: $blue1;
        }
      }
    }
  }
  .navs{
    height: 28px;
    margin: 0 28px 10px;
    li{
      height: 28px;
      line-height: 28px;
      float: left;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #5E5E5E;
      letter-spacing: 0;
      margin-right: 26px;
      line-height: 28px;
      padding: 0 9px;
      cursor: pointer;
      position: relative;
      text-align: center;
      &.active{
        background: $blue;
        color:#fff;
        cursor: default;
        border-radius: 14px;
      }
    }
  }
  /deep/ {
    .ivu-table-wrapper{
      tbody{
        td{
          height: 52px;
          line-height: 52px;
        }
      }
    }
    .ivu-table-cell{
      padding-left: 8px;
      padding-right: 8px;
    }
    .team-name{
      img{
        width: 24px;
        height: 24px;
        vertical-align: middle;
      }
      .name{
        display: inline-block;
        max-width: 90px;
        vertical-align: middle;
      }
    }
  }
</style>
