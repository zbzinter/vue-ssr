<template>
  <div class="list">
    <div class="selector">
      <span>时间</span>
      <DatePicker
        v-model="month"
        type="month"
        size="small"
        format="yyyy-MM"
        placeholder="请选择月份"
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
    <div class="content">
      <Table
        :data="exchangeList"
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
          slot="auditStatus"
          slot-scope="{ row }"
        >
          <span
            v-if="row.status === 0"
            class="warn"
          >未审核</span>
          <span
            v-if="row.status === 1"
            class="success"
          >审核通过</span>
          <span
            v-if="row.status === 2"
            class="error"
          >审核拒绝</span>
          <span v-if="row.status === 3">已撤回</span>
        </template>
        <template
          slot="withdrawStatus"
          slot-scope="{row}"
        >
          <span>{{ row.status === 1 ? '已到账' : '未到账' }}</span>
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
</template>
<script>
import { Button, Page, Table, DatePicker } from 'iview'

import mixins from '../mixins/exchange-list'

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
      month: '',
      exchangeList: [],
      pages: {
        size: 20,
        total: 0,
        page: 1
      }
    }
  },
  created() {
    this.month = this.dayjs().format('YYYY-MM')
    this.getTableData()
  },
  methods: {

    getParam() {
      this.month = this.dayjs(this.month).format('YYYY-MM')
      const start = this.dayjs(this.month).startOf('month').format('YYYY-MM-DD')
      const end = this.dayjs(this.month).endOf('month').format('YYYY-MM-DD')
      const month = `${start}~${end}`
      const postData = {
        user_id: this.getUserInfo().uid,
        page: this.pages.page,
        per_page: this.pages.size,
        cash_time: month,
        status: 100,
        cash_type: 'anchor'
      }
      return postData
    },

    async getTableData() {
      try {
        const { data: { rows, total } } = await this.$get('/v2/cashs/list', {
          apiType: 'goShop',
          body: {
            ...this.getParam()
          }
        })
        this.exchangeList = rows || []
        this.pages.total = total || 0
      } catch(e) {
        this.exchangeList = []
        this.pages.total = 0
      }
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

.content {
  padding-right: 40px;
  padding-bottom: 20px;
}
.warn {
  color: #FFA029;
}
.success {
  color: #2b9554;
}
.error {
  color: #F82301;
}

/deep/ .ivu-table-cell {
  padding: 0 5px;
}
</style>


