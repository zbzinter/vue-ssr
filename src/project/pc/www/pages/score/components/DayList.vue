<template>
  <div
    v-if="status != 2"
    class="day-section"
  >
    <ul class="day-list">
      <li
        v-for="(item, index) in timeList"
        :key="index"
        :class="{active: startTime === item.val}"
        @click="changeDate(item.val)"
      >
        <p>{{ item.shortVal }}</p>
        <p>{{ item.flag ? '今天' : item.week }}</p>
      </li>
    </ul>
    <div class="date-picker">
      <DatePicker
        v-model="checkedDate"
        type="date"
        size="large"
        :editable="false"
        :clearable="false"
        format="yyyy-MM-dd"
        style="width: 30px"
        :placement="placement"
        :options="{disabledDate: disabledDate}"
        @on-change="changeDate"
      />
      <div class="day">
        <span>{{ day }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { DatePicker } from 'iview'

import dateFormat, { getMoveDay } from '@utils/dateFormate'

// 左側操作按鈕說明：
// 保留：除了勾選的，其他都隱藏
// 隱藏：隱藏已勾選的
// 完整：都顯示

export default {
  components: {
    DatePicker
  },
  props: {
    // 1,未开始 2,正在进行,3,已结束
    status: {
      type: [Number],
      default: 2
    },
    // 选择的时间
    startTime: {
      type: String,
      default: ''
    },
    placement:{
      type: String,
      default: 'bottom'
    },
  },
  data() {
    return {
      checkedDate: '',
      timeList: [],
      day: '',
      timeText: {
        '0': '周天',
        '1': '周一',
        '2': '周二',
        '3': '周三',
        '4': '周四',
        '5': '周五',
        '6': '周六'
      }
    }
  },
  computed: {
    dateText() {
      let { checkedDate } = this
      return dateFormat(checkedDate, 'yyyy-MM-dd')
    }
  },
  watch: {
    status() {
      this.madeList()
    }
  },
  mounted() {
    let { startTime } = this
    this.checkedDate = startTime
    this.day = this.dayjs(new Date()).format('DD')
    this.madeList()
  },
  methods: {
    disabledDate (date) {
      if (this.status === 1) {
        return (date && date.valueOf() < Date.now() - 86400000) || (date && date.valueOf() > Date.now() + 86400000*90)
      } else {
        return (date && date.valueOf() > Date.now()) || (date && date.valueOf() < Date.now() - 86400000*90)
      }
    },
    madeList() {
      let { status, timeText } = this
      let arr = []
      let step = status === 1 ? -1 : 1
      for (let i = 6; i > -1; i--) {
        let val = getMoveDay(-i * step)
        const currentDay = this.dayjs(new Date).format('YYYY-MM-DD')
        arr.push({
          week: timeText[new Date(val).getDay()],
          val,
          shortVal: dateFormat(val, 'MM/dd'),
          flag: val === currentDay ? 1 : 0
        })
      }
      this.timeList = step === -1 ? arr.reverse() : arr
    },
    // 切换日历日期
    changeDate(val) {
      if (val.indexOf('-') > -1) {
        this.day = val.split('-')[2]
      } else {
        this.day = new Date(val).getDay()
      }
      
      this.$emit('changeDate', val)
    }
  }
}
</script>
<style lang="scss" scoped>
[class*='icon'] {
  font-family: 'iconfont';
}
.day-section {
  overflow: hidden;
  background: #fff;
  margin-top: 11px;
  margin-bottom: 12px;
  border-radius: 4px;
}
.day-list {
  overflow: hidden;
  text-align: center;
  float: left;
  li {
    float: left;
    width: 154px;
    font-size: 12px;
    color: #999999;
    line-height: 17px;
    padding-bottom: 7px;
    user-select: none;
    cursor: pointer;
    border-radius: 4px;
    height: 56px;
    box-sizing: border-box;
    p:first-child {
      font-size: 16px;
      color: #666666;
      line-height: 22px;
      margin-top: 10px;
      font-weight: 600;
    }
    &.active, &:hover {
      border: solid 2px #3683ff;
      color: #3683ff;
      p:first-child {
        color: #3683ff;
      }
    }
  }
}
.date-picker {
  float: left;
  margin: 10px 0 0 41px;
  padding: 0;
  /deep/ .ivu-icon-ios-calendar-outline:before{
    content: "\f15b"
  }
  /deep/ .ivu-date-picker{
    &:hover{
      .ivu-icon-ios-calendar-outline{
        color: $blue;
      }
      + .day{
        span{
          color: $blue;
        }
      }
    }
  }
  /deep/ .ivu-date-picker-focused{
    input{
      border: none;
      box-shadow: none;
    }
    .ivu-icon-ios-calendar-outline{
      color: $blue;
    }
    + .day{
      span{
        color: $blue;
      }
    }
  }
  /deep/ .ivu-icon-ios-calendar-outline {
    color: #666666;
    font-size: 40px;
    text-align: center;
  }
  /deep/ .ivu-input-suffix {
    cursor: pointer;
  }

  // 日历UI调整
  /deep/ {
    .ivu-date-picker-prev-btn-arrow-double,.ivu-date-picker-next-btn-arrow-double{
      display: none;
    }
    .ivu-picker-panel-icon-btn{
      margin-top: 0;
    }
    .ivu-icon-ios-arrow-back:before{
      font-size: 30px;
      margin-left: 20px;
    }
    .ivu-icon-ios-arrow-forward:before{
      font-size: 30px;
      margin-left: -30px;
    }
    .ivu-date-picker-header, .ivu-picker-panel-icon-btn{
      height: 58px;
      font-size: 16px;
      line-height: 58px;
      border: none;
    }
    .ivu-date-picker-cells{
      width: 358px;
      margin: 0;
      padding: 0 8px 10px 8px;
      .ivu-date-picker-cells-header{
        height: 17px;
        line-height: 17px;
        margin-bottom: 6px;
        span{
          width: 48px;
          height: 17px;
          line-height: 17px;
          margin: 0;
          font-size: 12px;
          text-align: center;
          color: #666666;
          vertical-align: top;
        }
      }
      span.ivu-date-picker-cells-cell{
        width: 48px;
        height: 28px;
        margin-top: 9px;
        text-align: center;
        em{
          width: 28px;
          height: 28px;
          margin: 0;
          font-size: 12px;
          line-height: 28px;
          border-radius: 50%;
        }
      }
      span.ivu-date-picker-cells-focused{
        em{
          color: #ffffff;
          background:  #3683FF;
        }
      }
      span.ivu-date-picker-cells-cell-today{
        em{
          border: 1px solid rgba(54,131,255, 0.8);
          &::after{
            display: none;
          }
        }
      }
      span.ivu-date-picker-cells-cell-disabled{
        background: #ffffff;
        em{
          color: #9F9F9F;
        }
      }
    }
  }
}
.iconbz_GG {
  font-size: 32px;
}
.day {
  position: relative;
  span {
    display: inline-block;
    position: absolute;
    top: -24px;
    left: 10px;
    color: #666666;
  }
}
/deep/ .ivu-input {
  border: 0 !important;
}
</style>

<style lang="scss">
.date-picker{
  .ivu-select-dropdown{
    top: 170px!important;
    right: 0!important;
    left: unset!important;
    box-shadow: 0 4px 10px 0 rgba(0,0,0,0.25);
  }
}

.football-day-list{
  .date-picker{
    .ivu-select-dropdown{
      top: 58px!important;
    }
  }
}
.basketball-day-list{
  .date-picker{
    .ivu-select-dropdown{
      top: 70px!important;
    }
  }
}
</style>