<template>
  <div>
    <anchor-info
      ref="anchorInfo"
    />
    <div class="c-base-tab clearfix">
      <span
        v-for="(item, index) in tab"
        :key="index"
        class="tab fl"
        :class="item.id === curTab ? 'active': ''"
        @click="changeTab(item.id)"
      >{{ item.title }}</span>
      <span
        class="fr desc"
      >
        <i class="iconfont iconicon_wenhao" />
        
        <Poptip
          trigger="hover"
          placement="bottom-end"
          content="content"
        >
          <span class="block">猜球问题说明</span>
          <div
            slot="content"
            class="pop-content"
          >
            <Rule />
          </div>
        </Poptip>
      </span>
    </div>
      
    <div class="content">
      <div
        v-if="curTab === 1"
        class="survey"
      >
        <div class="survey-header">
          <span>总场次</span>
          <span>胜场</span>
          <span>败场</span>
          <span>流局</span>
          <span>胜率</span>
          <span>盈亏</span>
        </div>
        <div class="survey-content">
          <span>{{ statistics.number_guess }}</span>
          <span>{{ statistics.win_guess }}</span>
          <span>{{ statistics.lost_guess }}</span>
          <span>{{ statistics.flat_guess }}</span>
          <span style="color: #E15756;">{{ `${statistics.win_percentage}%` }}</span>
          <span :class="statistics.profit_loss > 0 ? 'red': statistics.profit_loss < 0 ? 'green' : '' ">{{ statistics.profit_loss | returnPositive }}</span>
        </div>
      </div>
     
      <div
        v-if="curTab === 2"
        class="history"
      >
        <Table
          :data="guessBall"
          :columns="guessBallHeader"
          style="width: 100%"
        >
          <template
            slot="time"
            slot-scope="scope"
          >
            <span>{{ dayjs(new Date(scope.row.betting_time)).format('MM-DD HH:mm') }}</span>
          </template>
          <template
            slot="result"
            slot-scope="scope"
          >
            <span>{{ scope.row.result || '等待结算' }}</span>
          </template>
          <template
            slot="profitLoss"
            slot-scope="scope"
          >
            <span :class="scope.row.profit_loss > 0 ? 'red': scope.row.profit_loss < 0 ? 'green' : '' ">{{ scope.row.profit_loss | returnPositive(scope.row.result) }}</span>
          </template> 
          <template
            slot="num"
            slot-scope="scope"
          >
            <span>{{ scope.row.heat || 0 }}</span>
          </template> 
        </Table>
        <Page
          v-if="pages.total > 20"
          class="page pt"
          :total="pages.total"
          :page-size="pages.size"
          show-total
          show-elevator
          @on-change="changePage"
        />
      </div>
    </div>
  </div>
</template>
<script>

import {
  Table,
  Page,
  Poptip
} from 'iview'
import AnchorInfo from '@src/components/personal/user-info'
import Rule from '@src/components/personal/rule'
import mixins from './../mixins'

export default {
  components: {
    AnchorInfo,
    Table,
    Page,
    Poptip,
    Rule
  },
  filters: {
    returnPositive(val, param) {
      if (param === '') {
        return '-'
      }
      if (val === 0) {
        return 0
      }
      const symbolStr =  val > 0 ? '+' : ''
      return symbolStr + val
    }
  },
  mixins: [mixins],
  data() {
    return {
      isShowRule: true,
      guessBall: [],
      statistics: {
        number_guess: 0,
        win_guess: 0,
        lost_guess: 0,
        profit_loss: 0,
        flat_guess: 0,
        win_percentage: 0,
      },
      pages: {
        total: 0,
        page: 1,
        size: 20
      },
      curTab: 1,
      tab: [
        {
          id: 1,
          title: '我的猜球',
        },
        {
          id: 2,
          title: '猜球历史',
        },
      ],
    }
  },
  mounted() {
    this.getGuessBallStatistics()
    this.getGuessBallHistoryList()
  },
  methods: {
    changeTab(index) {
      this.curTab = index
      this.curTab === 1 ? this.getGuessBallStatistics() : this.getGuessBallHistoryList()
    },
   
    getGuessBallStatistics() {
      this.$get('v0.2/users/guessingCompetitions/statistics', {
        apiType: 'anchor',
        body: {
          uid: this.getUserInfo().uid
        }
      })
        .then((res) => {
          const {code, data, msg} = res
          if (this.$judgeCode(code)) {
            this.statistics = {
              ...data,
            }
          } else {
            this.$error(msg)
          }
        })
    },

    getGuessBallHistoryList() {
      this.$get('v0.2/users/guessingCompetitions', {
        apiType: 'anchor',
        body: {
          uid: this.getUserInfo().uid,
          page: this.pages.page,
          size: this.pages.size,
        },
      }).then((res) => {
        if (res.data && Array.isArray(res.data.rows)) {
          this.guessBall = res.data.rows
          this.pages.total = res.data.total
        } else {
          this.guessBall = []
        }
      }).catch(() => {
        this.guessBall = []
      })
    },

    changePage(val) {
      this.pages.page = val
      this.getGuessBallHistoryList()
    },
  }
}
</script>
<style lang="scss" scoped>
@import './../../../../public/personal/tab.scss';

.c-base-tab {
  height: 47px;
}

.desc {
  color: #ffa029;
  line-height: 50px;
  padding-right: 40px;
  cursor: pointer;
}

.content {
  background: #fff;
  padding: 0 40px;
  margin-bottom: 50px;
}

.survey {
  border: 1px solid #d4d4d4;
  margin: 30px 0;
  &-header {
    background: #fafafa;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333333;
    letter-spacing: 0;
  }
  &-content {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666666;
    letter-spacing: 0;
  }
  span {
    display: inline-block;
    width: 145px;
    height: 42px;
    line-height: 42px;
    text-align: center;
  }
}

.history {
  margin: 30px 0;
}

.iconbr_ee {
  font-size: 14px;
  cursor: pointer;
}
.item {
  margin-bottom: 20px;
}
.survey {
  ul {
    border: 1px solid #eee;
    padding: 10px;
    text-align: center;
  }
  li {
    display: inline-block;
    width: 15%;
  }
}
.page {
  /deep/ input{
    vertical-align: baseline;
  }
}

.red {
  color: #E15756;
}

.green {
  color: #52C41A;
}
/deep/ {
  .pop-content {
    width: 900px;
  }
  .ivu-poptip-body-content {
    overflow: hidden;
  }
}
.iconicon_wenhao {
  color: #ffa029;
}
</style>


