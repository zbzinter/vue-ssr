<template>
  <div>
    <UserInfo />
    <div class="c-base-tab">
      <span
        v-for="(item, index) in tab"
        :key="index"
        class="tab"
        :class="item.id === curTab ? 'active': ''"
        @click="changeTab(item.id)"
      >{{ item.title }}</span>
    </div>
    <div class="content">
      <component
        :is="tabComponents[curTab]"
      />
    </div>
  </div>
</template>
<script>
import { Tabs, TabPane } from 'iview'
import UserInfo from '@src/components/personal/user-info'
import Gift from './components/gift'
export default {
  components: {
    UserInfo,
    Tabs,
    TabPane,
  },
  data() {
    return {
      curTab: 1,
      tab: [
        {
          id: 1,
          title: '礼物',
        },
      ],
      tabComponents: {
        1: Gift,
      }
    }
  },
  methods: {
    changeTab(id) {
      if(id === this.curTab) return
      this.curTab = id
    },
  }
}
</script>
<style lang="scss" scoped>
@import './../../../public/personal/tab.scss';

.tab {
  margin-right: 0;
  width: 60px;
  text-align: center;
}
</style>


