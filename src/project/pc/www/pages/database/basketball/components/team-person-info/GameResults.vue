<template>
  <div>
    <div class="selector">
      <div class="reason selector-item">
        <p class="title">
          赛季
        </p>
        <Select
          v-model="selector.reason"
          class="select-log"
          @on-change="selectVal"
        >
          <Option value="1">
            2018-2019
          </Option>
          <Option value="2">
            2017-2018
          </Option>
        </Select>
      </div>
      <div class="stage selector-item">
        <p class="title">
          主客场
        </p>
        <Select
          v-model="selector.homeAndAway"
          class="select-short"
          @on-change="selectVal"
        >
          <Option value="-1">
            全部
          </Option>
          <Option
            v-for="(item, key) in renderData.homeAndAway"
            :key="key"
            :value="item.value"
          >
            {{ item.name }}
          </Option>
        </Select>
      </div>
      <div class="statistics selector-item">
        <p class="title">
          月份
        </p>
        <Select
          v-model="selector.month"
          class="select-short"
          @on-change="selectVal"
        >
          <Option value="-1">
            全部
          </Option>
          <Option
            v-for="i in 12"
            :key="i"
            :value="i"
          >
            {{ i }}
          </Option>
        </Select>
      </div>
      <div class="data-show selector-item">
        <p class="title">
          对阵
        </p>
        <Select
          v-model="selector.play"
          class="select-log"
          @on-change="selectVal"
        >
          <Option value="-1">
            全部
          </Option>
          <Option
            v-for="(item, key) in renderData.play"
            :key="key"
            :value="item.value"
          >
            {{ item.name }}
          </Option>
        </Select>
      </div>
    </div>
    <GameResultTable />
  </div>
</template>

<script>
import {
  Select,
  Option
} from 'iview'

import GameResultTable from '../components/GameResultTable'

export default {
  components: {
    Select,
    Option,
    GameResultTable
  },
  data() {
    return {
      renderData: {
        homeAndAway: [],
        play: []
      },
      selector: {
        reason: '1',
        homeAndAway: '-1',
        month: '-1',
        play: '-1',
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
