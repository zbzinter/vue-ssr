<!-- 指数详情 -->
<template>
  <div class="zhishu">
    <div
      class="back"
      @click="goBack()"
    >
      <i class="iconfont iconem_fe" />
      <span>返回指数</span>
    </div>
    <h2>
      <img
        class="icon-img"
        :src="tabValue === 'yapan' ? imgUrl1 : imgUrl2"
        alt=""
      >
      <span>【{{ typeText }}】</span> {{ matchData.guestTeamName }} VS {{ matchData.hostTeamName }} 指数变化图
    </h2>
    <Tabs
      :value="tabValue"
      :animated="false"
      @on-click="toggle"
    >
      <TabPane
        label="让球变化"
        name="yapan"
      >
        <ZhishuDetailChild
          v-if="tabValue === 'yapan'"
          :tab-value="tabValue"
          :type-text="typeText"
          :temp-odds-log-data="tempOddsLogData"
          :match-data="matchData"
        />
      </TabPane>
      <TabPane
        label="进球数变化"
        name="dx"
      >
        <ZhishuDetailChild
          v-if="tabValue === 'dx'"
          :tab-value="tabValue"
          :type-text="typeText"
          :temp-odds-log-data="tempOddsLogData"
          :match-data="matchData"
        />
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
import {Tabs, TabPane} from 'iview'
import ZhishuDetailChild from './ZhishuDetailChild'
import MixinsOddsDetailPush from '../../mixins/MixinsOddsDetailPush'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapGetters } = createNamespacedHelpers('odds')
export default {
  components: {
    Tabs,
    TabPane,
    ZhishuDetailChild
  },
  mixins: [MixinsOddsDetailPush],
  props: [

  ],
  data () {
    return {
      typeText: '让球',
      tabValue: 'yapan',
      imgUrl1: require('../../../../assets/score/eo_fj.png'),
      imgUrl2: require('../../../../assets/score/eq_fj.png')
    }
  },
  computed: {
    ...mapState(['tempOddsLogData', 'matchData'])
  },
  watch: {

  },
  created () {
    this.setType(this.$route.query.type)
    this.getOddsLogData(this.$route.query.typeId)
  },
  methods: {
    ...mapActions(['getOddsLogApi', 'matchDataApi']),
    toggle(val) {
      let typeId = val==='yapan' ? 1 : val==='dx' ? 3 : ''
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
      this.typeText = this.tabValue === 'yapan' ? '让球' : this.tabValue === 'dx' ? '进球数' : ''
    },
    getOddsLogData(typeId = 1){
      this.getOddsLogApi({
        matchId: this.$route.params.matchId, 
        bookId: this.$route.query.bookId,
        typeId,
        $get: this.$get
      })
      this.matchDataApi({
        matchId: this.$route.params.matchId,
        $get: this.$get
      })
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
i{
  font-style: normal;
}
.zhishu{
  margin: 70px auto 0;
  width: 1200px;
  background: #fff;
  position: relative;
  .icon-img{
    width: 26px;
    height: 26px;
    margin-left: 40px;
    margin-right: 18px;
  }
  h2{
    height: 75px;
    line-height: 75px;
    border-bottom: 1px dashed #CCCCCC;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #666666;
    letter-spacing: 0;
    font-weight: normal;
    margin-bottom: 8px;
  }
  .back{
    position: absolute;
    right: 0;
    font-size: 16px;
    color: #666666;
    padding: 26px 31px;
    cursor: pointer;
    z-index: 1;
    i{
      margin-right: 6px;
      font-size: 18px;
      vertical-align: middle;
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
    .ivu-tabs-nav{
      position: relative;
      left: 40px;
      .ivu-tabs-ink-bar{
        height: 4px;
        background-color: #3683FF;
      }
      .ivu-tabs-tab{
            padding: 16px 0;
            // margin-right: 40px;
            font-family: PingFangSC-Medium;
            font-size: 16px;
            font-weight: 600;
            color: #333333;
      }
      .ivu-tabs-tab-active{
        color: #3683FF;
      }
    }
  }
}
</style>
