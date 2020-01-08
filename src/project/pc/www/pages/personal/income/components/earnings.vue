<template>
  <div class="list">
    <div
      v-if="commUserInfo.certFlag !== 1"
      class="guide"
    >
      <p>
        您还不是主播，请先去申请直播！
      </p>
      <Button
        type="warning"
        class="bt-width"
        @click="goIdentity"
      >
        申请直播
      </Button>
    </div>
    <div v-if="commUserInfo.certFlag === 1">
      <div class="selector clearfix">
        <div class="fl">
          <span>时间</span>
          <DatePicker
            v-model="day"
            type="date"
            size="small"
            format="yyyy-MM-dd"
            placeholder="请选择日期"
            style="width: 130px"
            class="mr"
          />
          <Button
            type="primary"
            size="small"
            @click="getTableData"
          >
            查询
          </Button>
        </div>
        <div class="fr">
          <span class="tip">礼物价值为礼物的钻石价值，非分成后数值</span>
        </div>
      </div>
      <div class="content">
        <Table
          :data="earningList"
          :columns="header"
          style="width: 100%"
        >
          <template
            slot="time"
            slot-scope="scope"
          >
            <span>{{ dayjs(new Date(scope.row.create_time * 1000)).format('YYYY-MM-DD HH:mm') }}</span>
          </template>
          <template
            slot="totalGoodsPrice"
            slot-scope="scope"
          >
            <span>{{ scope.row.goods_price * scope.row.goods_count }}钻石</span>
          </template>
        </Table>
        <div
          v-if="pages.total > 0"
          class="total"
        >
          <span>总计</span>
          <span>{{ totalNum }}</span>
          <span>{{ totalDiamond }}钻石</span>
        </div>
        <Page
          v-if="pages.total > 10"
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
import { Button, Page, Table, DatePicker } from 'iview'
import mixins from '../mixins/earnings'

export default {
  components: {
    Button,
    Page,
    Table,
    DatePicker
  },
  mixins: [mixins],
  data() {
    return {
      day: '',
      earningList: [],
      pages: {
        size: 10,
        total: 0,
        page: 1
      },
      totalDiamond: 0,
      totalNum: 0
    }
  },
  created() {
    this.day = this.dayjs(new Date()).format('YYYY-MM-DD')
    this.getTableData()
  },
  methods: {

    goIdentity() {
      this.$router.push('/personal/identity')
    },

    getParam() {
      const postData = {
        user_id: this.getUserInfo().uid,
        page: this.pages.page,
        per_page: this.pages.size,
        time: this.dayjs(this.day).format('YYYY-MM-DD')
      }
      return postData
    },

    async getTableData() {
      try {
        const { data: { rows, total } } = await this.$get('v2/anchors/income', {
          apiType: 'goShop',
          body: {
            ...this.getParam()
          }
        })
        this.earningList = rows || []
        this.pages.total = total || 0
        this.totalDiamond = 0
        this.earningList.forEach(item => {
          this.totalDiamond += Number(item.goods_price) * Number(item.goods_count)
        })
        this.reduceHelper('totalNum', rows, 'goods_count')
      } catch(e) {
        this.earningList = []
        this.pages.total = 0
      }
    },

    reduceHelper(tar, arr, param) {
      this[tar] = arr.reduce(function (accumulator, currentValue) {
        return accumulator + currentValue[param]
      }, 0)
    },

    changePage(val) {
      this.pages.page = val
      this.getTableData()
    }
  }
}
</script>
<style lang="scss" scoped>
@import './../../../../public/personal/selector.scss';
.guide {
  p {
    padding: 55px 0 20px 0; 
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666666;
  }
}
.selector {
  height: 24px;
  .tip {
    color: #999;
    padding-top: 5px;
    display: inline-block;
  }
}
.list {
  padding-right: 40px;
}
.content {
  padding-bottom: 20px;
}
/deep/ {
  .ivu-table td, .ivu-table th {
    height: 42px;
  }
}
.total {
  width: 100%;
  height: 42px;
  line-height: 42px;
  border: 1px solid #ccc;
  border-top: none;
  span {
    font-family: PingFangSC-Semibold;
    color: #FFA029;
    display: inline-block;
    font-size: 14px;
    letter-spacing: 0;
    padding-left: 11px;
    width: 100px;
    &:first-child {
      padding-left: 40px;
      font-family: PingFangSC-Semibold;
      color: #333333;
      width: 48%;
    }
    &:last-child {
      font-family: PingFangSC-Semibold;
      width: 38%;
      text-align: right;
      padding-right: 45px;
    }
  }

}
</style>


