<template>
  <div class="diamond">
    <div class="selector">
      <span>时间</span>
      <DatePicker
        v-model="month"
        type="month"
        size="small"
        format="yyyy-MM"
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
    <div class="content">
      <Table
        :data="giftList"
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
          slot="payDiamond"
          slot-scope="{row}"
        >
          <span>{{ row.goods_price * row.goods_count }}</span>
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
import { DatePicker, Button, Table, Page } from 'iview'

export default {
  components: {
    Table,
    DatePicker,
    Button,
    Page
  },
  data() {
    return {
      month: '',
      header: [
        {
          title: '消费时间',
          align: 'center',
          slot: 'time'
        },
        {
          title: '礼物种类',
          align: 'center',
          key: 'remark'
        },
        {
          title: '赠送主播',
          align: 'center',
          key: 'receive_name'
        },
        {
          title: '礼物数量',
          align: 'center',
          key: 'goods_count'
        },
        {
          title: '支付（钻石）',
          align: 'center',
          slot: 'payDiamond'
        }
      ],
      giftList: [],
      pages: {
        size: 10,
        total: 0,
        page: 1
      },
    }
  },
  created() {
    this.month = this.dayjs().format('YYYY-MM')
    this.init()
  },
  methods: {
    init() {
      this.getTableData()
    },

    getParam() {
      const postData = {
        user_id: this.getUserInfo().uid,
        page: this.pages.page,
        per_page: this.pages.size,
        time: this.dayjs(this.month).format('YYYY-MM')
      }
      return postData
    },

    async getTableData() {
      try {
        const { data: { rows, total } } = await this.$get('v2/members/consume', {
          apiType: 'goShop',
          body: {
            ...this.getParam()
          }
        })
        this.giftList = rows || []
        this.pages.total = total || 0
      } catch(e) {
        this.earningList = []
        this.pages.total = 0
      }
    },

    changePage(val) {
      this.pages.page = val
      this.getTableData()
    },
  }
}
</script>
<style lang="scss" scoped>
@import './../../../../public/personal/selector.scss';
.diamond {
  .content {
    padding-right: 40px;
    padding-bottom: 20px;
  }
  
}
</style>


