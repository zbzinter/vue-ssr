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
      >房间管理员</span>
      <span
        :class="{active: !isActive}"
        class="tab"
        @click="tabClick(2)"
      >禁言名单</span>
    </div>
    <div>
      <component
        :is="componentName"
        :room-id="roomId"
      />
    </div>
  </div>
</template>
<script>

import AnchorInfo from '@src/components/personal/anchor-info'
import { _debounce } from '@/comm/utils/common'
import RoomManager from './components/room-manager.vue'
import MuteList from './components/mute-list.vue'

export default {
  components: {
    AnchorInfo,
    'roomManager': RoomManager,
    'muteList': MuteList,
  },
  data() {
    return {
      isActive: true,
      componentName: 'roomManager',
      roomId: 0,
    }
  },
  mounted() {
    this.getAnchorSetInfo()
  },
  methods: {
    
    tabClick:_debounce(function(index) {
      this.isActive = !this.isActive
      this.componentName = index===1 ? 'roomManager' : 'muteList'
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