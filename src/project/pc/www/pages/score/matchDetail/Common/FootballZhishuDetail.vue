<!-- 指数详情 -->
<template>
  <div class="zhishu">
    <!-- <div
      class="back"
      @click="goBack()"
    >
      返回指数
    </div>
    <h2>
      <span>【 {{ typeText }} 】</span> {{ matchData.guestTeamName }} VS {{ matchData.hostTeamName }} 指数变化图
    </h2> -->
    <div class="header">
      <div class="bet-name">
        {{ $route.query.bookName }}
      </div>
      <div class="team-info">
        <div class="name">
          <span class="host">{{ matchData.hostTeamName }}</span>
          <span class="vs">vs</span>
          <span class="guest">{{ matchData.guestTeamName }}</span>
        </div>
        <div class="info">
          <span class="league">
            {{ matchData.leagueName }}
          </span>
          <span class="time">
            比赛开始时间:{{ dayjs(matchData.matchTime).format("YYYY-MM-DD HH:mm") }}
          </span>
        </div>
      </div>
    </div>
    <Tabs
      :value="tabValue"
      :animated="false"
      @on-click="toggle"
    >
      <div
        class="exhibition"
      >
        <span><i />滚球盘</span>
        <span><i />即时盘</span>
        <span><i />初盘</span>
      </div>
      <TabPane
        label="欧赔指数"
        name="oupei"
      >
        <Table
          stripe
          class="statistics-table"
          :columns="columns"
          :data="getTransferArrData"
          :disabled-hover="true"
          :loading="loading"
        />
      </TabPane>
      <TabPane
        label="亚盘对比"
        name="yapan"
      >
        <Table
          stripe
          class="statistics-table"
          :columns="columns"
          :data="getTransferArrData"
          :disabled-hover="true"
          :loading="loading"
        />
      </TabPane>
      <TabPane
        label="大小指数"
        name="dx"
      >
        <Table
          stripe
          class="statistics-table"
          :columns="columns"
          :data="getTransferArrData"
          :disabled-hover="true"
          :loading="loading"
        />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import {Tabs, TabPane, Table} from 'iview'
import { createNamespacedHelpers } from 'vuex'
import oddsjs from '../../mixins/MixinsOdds'
import MixinsOddsDetailPush from '../../mixins/MixinsOddsDetailPush'
const { mapState, mapActions, mapGetters } = createNamespacedHelpers('odds')
export default {
  components: {
    Tabs,
    TabPane,
    Table
  },
  mixins: [oddsjs, MixinsOddsDetailPush],
  props: [

  ],
  data () {
    return {
      typeText: '亚盘对比',
      tabValue: 'yapan',
      ouzhiData: [],
      yapanData: [],
      loading: true
    }
  },
  computed: {
    ...mapState(['tempOddsLogData', 'matchData']),
    columns(){
      return [
        {
          title: '时间',
          key: 'bookName',
          width: 199,
          align: 'center',
          render: (h, {row, column, index})=>{
            return h('div', {
              class: 'row-time'
            },[
              h('i', {
                class: `${index === this.tempOddsLogData.length-1 ? 'blue' : row.oddType === 1 ? 'yellow' : row.oddType === 2 ? 'red' : ''} i-temp`
              }),
              h('span', {}, this.dayjs(row.oddTime).format('MM-DD HH:mm'))
            ])
          }
        },
        {
          title: '比分',
          key: 'bookName',
          width: 250,
          align: 'center'
        },
        {
          title: this.matchData.hostTeamName,
          key: 'bookName',
          width: 250,
          align: 'center',
          render: (h, {row, column, index})=>{
            return h('span', {
              class: row.team1ValClass
            }, row.valueForType1)
          }
        },
        {
          title: /2/.test(this.$route.query.typeId) ? '平局' : '盘口',
          key: 'bookName',
          width: 250,
          align: 'center',
          render: (h, {row, column, index})=>{
            return h('span', {
              class: row.panClass
            }, row.pan)
          }
        },
        {
          title: this.matchData.guestTeamName,
          key: 'bookName',
          width: 250,
          align: 'center',
          render: (h, {row, column, index})=>{
            return h('span', {
              class: row.team2ValClass
            }, row.valueForType2)
          }
        }
      ]
    },
    getTransferArrData(){
      if (!Object.keys(this.tempOddsLogData).length) return []
      this.tempOddsLogData.forEach((item, index) => {
        item.team1Val = item.valueForType1 || item.value0ForType1
        let team1preVal = this.tempOddsLogData[Math.min(index+1, this.tempOddsLogData.length -1)].valueForType1 || this.tempOddsLogData[Math.min(index+1, this.tempOddsLogData.length -1)].value0ForType1
        item.team1ValClass = this.setCompareColor(item.team1Val, team1preVal)
        if(item.typeId === 2 || item.typeId === 128) {
          item.pan = item.value0ForTypeX || item.valueForTypeX
        } else {
          item.pan = item.ovalue || item.ovalue0
        }
        item.team2Val = item.valueForType2 || item.value0ForType2
        let team2preVal = this.tempOddsLogData[Math.min(index+1, this.tempOddsLogData.length -1)].valueForType2 || this.tempOddsLogData[Math.min(index+1, this.tempOddsLogData.length -1)].value0ForType2
        item.team2ValClass = this.setCompareColor(item.team2Val, team2preVal)
        let panPreVal = this.tempOddsLogData[Math.min(index+1, this.tempOddsLogData.length -1)].ovalue || this.tempOddsLogData[Math.min(index+1, this.tempOddsLogData.length -1)].ovalue0
        item.panClass = this.setCompareColor(item.pan, panPreVal)
      })
      return this.tempOddsLogData
    }
  },
  created () {
    this.setType(this.$route.query.type)
    this.getOddsLogData(this.$route.query.typeId)
    this.matchDataApi({
      matchId: this.$route.params.matchId,
      $get: this.$get
    })
  },
  methods: {
    ...mapActions(['getOddsLogApi', 'matchDataApi']),
    toggle(val) {
      let typeId
      switch(val){
      case 'yapan': typeId = 1;break
      case 'oupei': typeId = 2;break
      case 'dx': typeId = 3;break
      }
      this.setType(val)
      this.getOddsLogData(typeId)
      this.$router.push({
        path: this.$route.path, 
        query: {
          ...this.$route.query,
          type: val,
          typeId
        },
        params: this.$route.params
      })
    },
    setType(val){
      this.tabValue = val
      switch(this.tabValue){
      case 'oupei': this.typeText = '欧赔指数';break
      case 'yapan': this.typeText = '亚盘对比';break
      case 'dx': this.typeText = '大小指数';break
      }
    },
    async getOddsLogData(typeId = 1){
      this.loading = true
      await this.getOddsLogApi({
        matchId: this.$route.params.matchId, 
        bookId: this.$route.query.bookId,
        typeId,
        $get: this.$get
      }).catch((error) => {
        this.loading = false
      })
      this.loading = false
    },
    goBack () {
      let path = this.$route.path.replace('zhishu', this.tabValue)
      this.$router.push(path)
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
$red:#F06151;
$yellow:#F8C258;
$blue:#3F7EDB;
.red{
  color: #F06151
}
.yellow{
  color: #F8C258
}
.blue{
  color: #3F7EDB
}
i{
  font-style: normal;
}
.i-temp{
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 12px;
  margin-right: 10px;
}
.zhishu{
  margin: 0 auto;
  width: 1200px;
  background: #fff;
  position: relative;
  h2{
    padding: 12px 4px 8px;
  }
  .header{
    background: #f2f2f2;
    height: 170px;
    padding-top: 70px;
    overflow: hidden;
    .bet-name{
      float: left;
      background-image: linear-gradient(136deg, #8BDEFF 0%, #3683FF 100%);
      border-radius: 34px;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #FFFFFF;
      letter-spacing: 0;
      line-height: 68px;
      height: 68px;
      width: 68px;
      text-align: center;
      margin-right: 16px;
    }
    .team-info{
      float: left;
      .name{
        margin-top: 8px;
        span{
          font-size: 22px;
          color: #333333;
          letter-spacing: 0;
          line-height: 26px;
          &.host, &.guest{
            font-family: PingFangSC-Semibold;
            font-weight: 600;
          }
          &.vs{
            font-family: PingFangSC-Regular;
            font-size: 20px;
            font-weight: normal;
            color: #666666;
            line-height: 24px;
            padding: 0 24px;
          }
        }
      }
      .info{
        margin-top: 6px;
        line-height: 26px;
        span{
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #666666;
          letter-spacing: 0;
          line-height: 26px;
          &.league{
            margin-right: 24px;
          }
        }
      }
    }
  }
  .exhibition{
    position: absolute;
    right: 0;
    top: 0;
    color: #2d8cf0;
    padding: 8px;
    cursor: pointer;
    z-index: 1;
    span{
      display: inline-block;
      height: 60px;
      line-height: 60px;
      font-size: 14px;
      color: #333333;
      margin-right: 24px;
      i{
        @extend .i-temp
      }
      &:nth-child(1) i{
        background: $red;
      }
      &:nth-child(2) i{
        background: $yellow ;
      }
      &:nth-child(3) i{
        background: $blue;
      }
    }
  }
  .echarts {
    width: 100%;
    height: 400px;
  }
  .explain{
    margin: 0 20px;
    span{
      i{
        display: inline-block;
        color: #fff;
        padding: 0 10px;
        margin: 0 16px 0 6px;
      }
      &.early i{
        background: green
      }
      &.instant i{
        background: red
      }
      &.draw i{
        background: blue
      }
    }
  }
  .data-ul{
    margin: 20px;
    li{
      height: 30px;
      line-height: 30px;
      span{
        display: inline-block;
        &.date{
          margin-right: 20px;
        }
        &.data1{
          margin-left: 50px;
        }
        &.bg{
          background: blue;
          width: 200px;
          height: 16px;
          vertical-align: middle;
          margin-left: 10px;
          margin-right: 10px;
        }
      }
    }
  }
  .left-data, .right-data{
    width: 50%;
    &.right-data{
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
          &.status{
            background: blue;
            color: #fff;
          }
        }
      }
    }
  }
  /deep/ {
    .ivu-tabs-nav-container{
      line-height: 60px;
    }
    .ivu-tabs-nav .ivu-tabs-tab{
      padding: 0 16px;
    }
    .ivu-table-wrapper{
      border: 0
    }
    .ivu-table:after{
      width: 0
    }
    .ivu-table-row{
      .row-time{
        vertical-align: middle;
      }
      i.i-temp{
        @extend .i-temp
      }
      i.red{
        background: $red;
      }
      i.yellow{
        background: $yellow ;
      }
      i.blue{
        background: $blue;
      }
    }
    tbody{
      tr{
        td {
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
}
</style>
