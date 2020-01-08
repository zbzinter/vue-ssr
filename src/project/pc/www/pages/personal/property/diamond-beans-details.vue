<template>
  <div class="beans">
    <div class="tab">
      <div @click="returnParent">
        <i class="iconfont iconfj_dj" /> 
        <i class="iconfont iconfk_dj" />
        <p>财产明细</p>
      </div>
    </div>

    <div class="details-tab">
      <span
        :class="index===0 ? 'active': ''"
        @click="handleTab(0)"
      >钻石明细</span>
      <span
        :class="index===1 ? 'active': ''"
        @click="handleTab(1)"
      >球豆明细</span>
    </div>

    <div class="selector pl clearfix">
      <div class="fl">
        <span>时间</span>
        <DatePicker
          v-model="month"
          type="month"
          size="small"
          format="yyyy-MM"
          placeholder="请选择月份"
          style="width: 130px"
        />
        <Button
          type="primary"
          size="small"
          @click="getData"
        >
          查询
        </Button>
      </div>
      <div
        v-if="index === 1"
        class="fr list-btn"
      >
        <span
          :class="handerIndex === 1 ? 'active': ''"
          @click="handleTab(1)"
        >全部明细</span>
        <span
          :class="handerIndex === 0 ? 'active': ''"
          @click="handleRecord(0)"
        >提现记录</span>
      </div>
    </div>
    <div
      v-if="index === 0"
      class="table pl"
    >
      <Table
        :columns="header"
        :data="data"
      >
        <template
          slot="id"
          slot-scope="{ row }"
        >
          <div>{{ dayjs(row.create_time).unix() }}</div>
        </template>
        <template
          slot="type"
          slot-scope="{ row }"
        >
          <div>{{ row.type === 'recharge' ? '充值' : '使用道具' }}</div>
        </template>
        <template
          slot="deposit"
          slot-scope="{ row }"
        >
          <div
            v-if="row.type === 'recharge'"
            class="warn"
          >
            {{ row.diamond }}
          </div>
        </template>
        <template
          slot="expend"
          slot-scope="{ row }"
        >
          <div
            v-if="row.type === 'gift'"
            class="success"
          >
            {{ row.diamond }}
          </div>
        </template>
        <template
          slot="remark"
          slot-scope="{ row }"
        >
          <div v-if="row.type === 'recharge' && row.comment">
            {{ row.comment }}
          </div>
          <div v-if="row.type === 'gift'">
            {{ row.comment }}
          </div>
        </template>
        <template
          slot="status"
        >
          <span>成功</span>
        </template>
        <template
          slot="time"
          slot-scope="{ row }"
        >
          <div>{{ row.create_time }}</div>
        </template>
      </Table>
    </div>
    <div
      v-if="index === 1 && handerIndex === 1"
      class="table pl"
    >
      <Table
        :columns="header"
        :data="data"
      >
        <template
          slot="id"
          slot-scope="{ row }"
        >
          <div>{{ dayjs(row.create_time).unix() }}</div>
        </template>
        <template
          slot="type"
          slot-scope="{ row }"
        >
          <div>{{ row.title }}</div>
        </template>
        <template
          slot="deposit"
          slot-scope="{ row }"
        >
          <div
            class="warn"
          >
            {{ row.ball_gold }}
          </div>
        </template>
        <template
          slot="expend"
        >
          <div />
        </template>
        <template
          slot="remark"
          slot-scope="{ row }"
        >
          <div>
            {{ row.comment }}
          </div>
        </template>
        <template
          slot="status"
        >
          <span>成功</span>
        </template>
        <template
          slot="time"
          slot-scope="{ row }"
        >
          <div>
            {{ row.create_time }}
          </div>
        </template>
      </Table>
    </div>
    <div
      v-if="index === 1 && handerIndex === 0"
      class="table pl"
    >
      <Table
        :columns="headerRecord"
        :data="recordData"
      >
        <template
          slot="time"
          slot-scope="{ row }"
        >
          <div>{{ dayjs(row.create_time*1000).format('YYYY-MM-DD HH:mm') || '-' }}</div>
        </template>
        <template
          slot="status"
          slot-scope="{ row }"
        >
          <div class="error">
            {{ row.status === 1 ? '成功': '' }}
          </div>
        </template>
        <template
          slot="recTime"
          slot-scope="{ row }"
        >
          <div>{{ dayjs(row.create_time*1000).format('YYYY-MM-DD HH:mm') || '-' }}</div>
        </template>
      </Table>
    </div>
    <Page
      v-if="pages.total > 20"
      class="pt pl"
      :total="pages.total"
      :page-size="pages.size"
      show-total
      show-elevator
      @on-change="changePage"
    />
  </div>
</template>
<script>
import { Button, DatePicker, Table,Page } from 'iview'
import { getQueryString } from '@utils/url'
import mixins from './mixins/details'

export default {
  components: {
    Button,
    DatePicker,
    Table,
    Page
  },
  mixins: [mixins],
  data() {
    return {
      index: 0,
      handerIndex: 1,
      data: [],
      recordData: [],
      month: '',
      pages: {
        total: 0,
        size: 20,
        page: 1
      },
      income: [],
      consume: [],
      incomeNum: 0,
      consumeNum: 0,
      recharge: []
      
    }
  },
  created() {
    this.month = this.dayjs().format('YYYY-MM')
    const query = getQueryString('flag', window.location.href) || 0
    this.handleTab(Number(query))
  },
  methods: {

    handleTab(index) {
      this.index = index
      this.handerIndex = index
      this.month = this.dayjs().format('YYYY-MM')
      this.pages.total = 0
      this.pages.page = 1
      this.getData()
    },

    getData() {
      this.data = []
      let url = 'ballgoldhistory'
      let param = {}
      param.per_page = this.pages.size
      param.page = this.pages.page
      if (this.handerIndex === 0 && this.index === 1) {
        this.getRecord(param)
      } else {
        if (this.index === 1) {
          this.getBeanList(url, param)
        } else {
          this.assemblyData(param)
        }
      }
    },

    // 获取钻石明细  存入充值明细
    async getBeanList(url, param) {
      try {
        const res = await this.$get('/api/v1/user.php?do=' + url, {
          apiType: 'shop',
          body: {
            user_id: this.getUserInfo().uid,
            ...param,
            pay_time: this.dayjs(this.month).format('YYYY-MM')
          }
        })
        this.data = res.data.list || []
        this.pages.total = res.data.total || 0
      } catch(e) {
        this.data = []
      }
    },

    assemblyData() {
      this.$get('/api/v1/user.php?do=diamondhistory', {
        apiType: 'shop',
        body: {
          user_id: this.getUserInfo().uid,
          platform: 'web',
          pay_time: this.dayjs(this.month).format('YYYY-MM')
        }
      }).then((res) => {
        this.recharge = []
        if (res.data.list) {
          this.data = res.data.list || []
        }
      })
    },

    getRecord(param) {
      let postData = {}
      postData.cash_time = this.dayjs(this.month).format('YYYY-MM')
      postData.status = 100
      this.$get('v2/members/beans/list', {
        apiType: 'goShop',
        body: {
          user_id: this.getUserInfo().uid,
          ...param,
          ...postData
        }
      }).then((res) => {
        try {
          this.recordData = res.data.rows || []
          this.pages.total = res.data.total || 0
        } catch(e) {
          this.data = []
        }
      })
    },

    handleRecord(index) {
      this.handerIndex = index
      this.getData()
    },

    returnParent() {
      this.$router.push({
        path: '/personal/property/index',
      })
    },

    changePage(val) {
      this.pages.page = val
      this.getData()
    },
  }
}
</script>
<style lang="scss" scoped>
@import './../../../public/personal/selector.scss';

.beans {
  margin-bottom: 40px;
  .selector {
    height: 30px;
    padding-right: 40px;

    .list-btn {
      font-size: 0;
      span {
        display: inline-block;
        font-size: 12px;
        width: 60px;
        height: 26px;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
        color: #3683FF;
        border: 1px solid #3683FF;
        background: #fff;
        &:first-child {
          border-radius: 2px 0 0 2px;
        }
        &:last-child {
          border-radius: 0px 2px 2px 0px;
        }
      }
      .common-active {
        color: #FFFFFF;
        background: #3683FF;
      }
      .active {
        @extend .common-active;
      }
    }
  }
  .tab {
    padding: 0 40px 18px;
    border-bottom: 1px solid #F0F0F0;
    div {
      cursor: pointer;
      width: 90px;
      &:hover {
        .iconfk_dj {
          display: inline-block;
        }
        .iconfj_dj {
          display: none;
        }
      }
    }
    .iconfk_dj {
      display: none;
      color:  #3683ff;
    }
    p {
      display: inline-block;
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      font-weight: 600;
      color: #3683FF;
      letter-spacing: 0;
    }
  }
  .iconfj_dj {
    color: #3683ff
  }
  .table {
    padding-right: 40px;
  }
  .pl {
    padding-left: 40px;
  }
  .common-tab {
    color: #3683FF;
    border-bottom: 2px solid #3683ff;
  }
  .details-tab {
    padding: 40px 0 0 40px;
    span {
      display: inline-block;
      cursor: pointer;
      color: #333;
      font-weight: 600;
      font-size: 16px;
      line-height: 30px;
      margin-right: 20px;
      &:hover {
        @extend .common-tab;
      }
    }
    .active {
      @extend .common-tab;
    }
  }
}

.error {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #E15756;
  letter-spacing: 0;
  text-align: center;
}
.primay {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #3683FF;
  letter-spacing: 0;
  text-align: center;
}
.success {
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #4DA183;
  letter-spacing: 0;
  text-align: center;
}
.warn {
  font-family: PingFangSC-Medium;
  font-size: 12px;
  color: #F2941E;
  letter-spacing: 0;
  text-align: center;
}
/deep/ .ivu-table {
  color: #666;
  font: 12px;
}
/deep/ .ivu-table-header {
  color: #333;
  font: 14px !important;
}
</style>


