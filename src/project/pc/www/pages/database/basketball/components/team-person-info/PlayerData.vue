<template>
  <div>
    <div class="selector">
      <div class="reason selector-item">
        <p class="title">
          赛季
        </p>
        <SelectReason @selectSeason="selectVal" />
      </div> 
      <div class="stage selector-item">
        <p class="title">
          阶段
        </p>
        <Select
          v-model="selector.groupId"
          class="select-short"
          @on-change="selectVal"
        >
          <Option value="2">
            常规赛
          </Option>
          <Option value="1">
            季前赛
          </Option>
          <Option value="3">
            季后赛
          </Option>
        </Select>
      </div>
      <div class="statistics selector-item">
        <p class="title">
          统计
        </p>
        <Select
          v-model="selector.statistics"
          class="select-short"
          @on-change="selectVal"
        >
          <Option value="1">
            常规
          </Option>
          <Option value="2">
            命中率
          </Option>
        </Select>
      </div>
      <div class="data-show selector-item">
        <p class="title">
          数据显示
        </p>
        <Select
          v-model="selector.statType"
          class="select-short"
          @on-change="selectVal"
        >
          <Option value="1">
            场均数据
          </Option>
          <Option value="2">
            总数据
          </Option>
        </Select>
      </div>
    </div>
    <play-data-convention />
  </div>
</template>

<script>
import {Select, Option} from 'iview'
import PlayDataConvention from '../components/PlayerDataConventionTable'
import SelectReason from '../components/Ball-Reason'
// import season from './../../mixins/season'

export default {
  components: {
    Select,
    Option,
    SelectReason,
    PlayDataConvention
  },
  // mixins: [season],
  data() {
    return {
      selector: {
        seasonId: '1',
        stage: '1',
        statistics: '1',
        statType: '1',
      },
    }
  },

  methods: {
    selectVal() {
      // console.log(this.selector)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./../../style/selector.scss";
</style>
