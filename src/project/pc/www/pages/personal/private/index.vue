<template>
  <div>
    <anchor-info
      ref="anchorInfo"
      :is-show="false"
      :show-guessball="true"
    />
    <div class="c-base-tab">
      <span
        class="tab"
        :class="{active: isActive}"
        @click="tabClick(1)"
      >预约比赛</span>
      <span
        :class="{active: !isActive}"
        class="tab"
        @click="tabClick(2)"
      >直播记录</span>
    </div>
    <div>
      <keep-alive>
        <component
          :is="componentName"
          :room-id="roomId"
        />
      </keep-alive>
    </div>
  </div>
</template>
<script>

import AnchorInfo from '@src/components/personal/anchor-info'
import { _debounce } from '@/comm/utils/common'
import OrderCompetition from './components/order-competition.vue'
import RecordList from './components/record-list.vue'

export default {
  components: {
    AnchorInfo,
    'orderCompetition': OrderCompetition,
    'recordList': RecordList,
  },
  data() {
    return {
      isActive: true,
      componentName: 'orderCompetition',
      roomId: 0,
    }
  },
  mounted() {
    this.getAnchorSetInfo()
  },
  methods: {
    
    tabClick:_debounce(function(index) {
      this.isActive = !this.isActive
      this.componentName = index===1 ? 'orderCompetition' : 'recordList'
    }, 200),

    getAnchorSetInfo() {
      this.$refs.anchorInfo.getAnchorSetInfo().then((result) => {
        this.roomId = result.room_id
      })
    },

  }
}
</script>
<style lang="scss" scoped>
@import './../../../public/personal/tab.scss';
</style>