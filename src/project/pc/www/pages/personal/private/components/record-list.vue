<template>
  <div class="content">
    <div class="order-record__header">
      <div class="header-search">
        <DatePicker
          v-model="form.start_time"
          type="date"
          format="yyyy-MM-dd"
          placeholder="请选择开始时间"
          style="width: 200px"
        />
        <DatePicker
          v-model="form.end_time"
          format="yyyy-MM-dd"
          :options="options4"
          placeholder="请选择结束时间"
          style="width: 200px"
        />
        <Button
          class="iblock ml"
          type="primary"
          @click="queryRecord"
        >
          查询
        </Button>
      </div>
      <div class="danger">
        直播时长：{{ totalTime }}分
      </div>
    </div>
    <div class="order-record__inner">
      <Table
        :data="record"
        :columns="recordHeader"
        border
        style="width: 100%"
      >
        <template
          slot="startDate"
          slot-scope="scope"
        >
          <span>{{ dayjs(new Date(scope.row.start_date).getTime()).format('YYYY-MM-DD HH:mm') }}</span>
        </template>
        <template
          slot="endDate"
          slot-scope="scope"
        >
          <span v-if="scope.row.end_date">{{ dayjs(new Date(scope.row.end_date).getTime()).format('YYYY-MM-DD HH:mm') }}</span>
          <span v-else>-</span>
        </template>
        <template
          slot="second"
          slot-scope="scope"
        >
          <span>{{ Math.round(((scope.row.second || 0)/60)) }}分钟</span>
        </template> 
        <template
          slot="num"
          slot-scope="scope"
        >
          <span>{{ scope.row.heat || 0 }}</span>
        </template> 
      </Table>
    </div>
  </div>
</template>

<script>
import {
  Table,
  DatePicker,
  Button,

} from 'iview'

import dayjs from 'dayjs'
import mixin from '../mixins'

export default  {
  components: {
    Table,
    Button,
    DatePicker,
  },
  mixins: [mixin],
  props: {
    roomId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      record: [],
      form: {
        start_time: '',
        end_time: ''
      },
      totalTime: '',
      options4: {
        disabledDate (date) {
          return date && date.valueOf()  > Date.now() 
        }
      },
    }
  },
  watch: {
    roomId: {
      handler: function(val) {
        this.roomId = val
        this.getRecordList()
      },
      deep: true 
    }
  },
  created() {
    this.form.start_time = dayjs().set('month', new Date().getMonth() -1).format('YYYY-MM-DD')
    this.form.end_time = dayjs().format('YYYY-MM-DD')
    this.getRecordList()
  },
  methods: {

    queryRecord() {
      this.getRecordList()
    },

    getRecordList() {
      if (new Date(this.form.start_time).getTime() > new Date(this.form.end_time).getTime() ) {
        return this.$error('开始时间不能大于结束时间')
      }
      let body
      if (this.form.start_time && this.form.end_time) {
        body = {
          room_id: this.roomId,
          start_time: dayjs(this.form.start_time).format('YYYY/MM/DD') + ' 00:00:00',
          end_time: dayjs(this.form.end_time).format('YYYY/MM/DD') + ' 23:59:59',
        }
      } else {
        body = {
          room_id: this.roomId,
        }
      }
      this.record = []
      this.$get('v0.1/tvHistorys', {
        apiType: 'anchor',
        body
      })
        .then(res => {
          const {code, data} = res
          if (this.$judgeCode(code)) {
            this.record = data
            const arr = []
            data.forEach(item => {
              arr.push(item.match_id)
            })
            this.getMatchName(data, arr)

            let second = 0
            this.record.forEach(item => {
              second += item.second
            })
            this.totalTime = Math.round(second/60)
          } else {
            this.record = []
          }
        })
    },

    // 通过id获取赛事的名称以及类型
    getMatchName(dataArr, param) {
      this.$get('v9/queryMatchByIds', {
        apiType: 'oldApi',
        body: {
          matchIds: encodeURI(`[${String(param)}]`)
        },
      })
        .then((res)=> {
          const {code, data} = res
          if (this.$judgeCode(code) && data && data.length) {
            dataArr.map(item => {
              data.forEach((ele) => {
                if (ele.matchId === item.match_id) {
                  item.statusCode =  ele.statusCode
                }
              })
            })
            this.record = [...dataArr]
          }
        })
    },

    returnTime(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm')
    }
  },  

}
</script>

<style lang="scss" scoped>
.content {
  padding: 0 40px 50px;
}
.order-record {
  &__header {
    padding: 30px 0 28px;
    display: flex;
    justify-content: space-between;
  }
  .header-search {
    flex: 1;
    justify-content: flex-start;
  }
}
.danger {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color:  #f82301;
  letter-spacing: 0;
  text-align: right;
  padding-top: 6px;
}
/deep/ .ivu-input {
  border: 1px solid #dcdee2;
}
.ivu-btn {
  background: #3683FF;
  border-radius: 4px;
  width: 50px;
  height: 26px;
  line-height: 13px;
  padding: 0 5px;
  font-size: 12px;
  color: #FFFFFF;
}
</style>
