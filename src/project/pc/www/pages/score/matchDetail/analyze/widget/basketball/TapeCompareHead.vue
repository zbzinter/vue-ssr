<!-- 让分、总分盘路比较头部 -->
<template>
  <div class="tape-head">
    <div class="head">
      <span :class="['name']">{{ matchData[`${teamType}TeamName`] }}</span>
      <Select
        v-model="tapeSize"
        size="small"
        style="width:100px"
      >
        <Option
          v-for="item in fieldTimeArr"
          :key="item.value"
          :value="item.value"
        >
          {{ item.label }}
        </Option>
      </Select>
    </div>
  </div>
</template>

<script>
import { Decimal } from 'decimal.js'
import {Select, Option} from 'iview'
import mixins from '../mixins'
export default {
  name: 'TapeCompareTable',
  components: {
    Select, 
    Option
  },
  mixins: [mixins],
  props: [
    'teamType',
    'type',
    'matchData'
  ],
  data () {
    return {
      tapeSize: 10
    }
  },
  watch: {
    tapeSize(val){
      this.$parent.getQueryMatchOddTrend(this.matchData[`${this.teamType}TeamId`], this.teamType, this.type, val)
    }
  }
}
</script>
<style scoped lang="scss">
  @import '../../../Common/detail.scss';
  .tape-head{
    .head{
      text-align: center;
      margin-bottom: 16px;
      padding: 0 14px;
      line-height: 24px;
      height: 25px;
      overflow: hidden;
      font-size: 14px;
      .name{
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: $blue;
        letter-spacing: 0;
        line-height: 24px;
        display: inline-block;
        vertical-align: sub;
        padding-right: 25px;
      }
    }
  }
</style> 