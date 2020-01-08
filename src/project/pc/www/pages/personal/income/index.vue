<template>
  <div>
    <UserInfo />
    <div v-if="flag">
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
          @goBindCard="goBindCard"
          @goExchange="goExchange"
        />
      </div>
    </div>
    <div v-if="!flag && compFlag">
      <BindCard ref="bindCard" />
    </div>
    <div v-if="!flag && !compFlag">
      <Exchange />
    </div>
  </div>
</template>
<script>

import UserInfo from '@src/components/personal/user-info'
import Earnings from './components/earnings'
import ExchangeCondition from './components/exchange-condition'
import ExchangeList from './components/exchange-list'

export default {
  components: {
    UserInfo,
    Earnings,
    ExchangeCondition,
    ExchangeList,
    'BindCard': () => import('./components/bind-card'),
    'Exchange': () => import('./components/exchange'),
  },

  data() {
    return {
      curTab: 1,
      flag: true,
      compFlag: false,
      tab: [
        {
          id: 1,
          title: '收益兑换',
        },
        {
          id: 2,
          title: '主播收入',
        },
        {
          id: 3,
          title: '兑换明细',
        },
      ],
      tabComponents: {
        1: ExchangeCondition,
        2: Earnings,
        3: ExchangeList,
      },
      changeFlag: 0
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const _tab = this.$route.query.tab
      if(_tab) {
        this.curTab = Number(_tab)
      }
    },
    
    changeTab(id) {
      if(id === this.curTab) return
      this.curTab = id
      this.$router.push({
        path: '/personal/income',
        query: {
          tab: this.curTab
        }
      })
    },

    goBindCard(flag) {

      // 1代表更换银行卡  0代表绑定银行卡
      this.changeFlag = flag
      this.flag = false
      this.compFlag = true
    },
    
    goExchange() {
      this.flag = false
      this.compFlag = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import './../../../public/personal/tab.scss';
@import './../../../public/personal/rule.scss';
@import './../../../public/personal/btn.scss';

.ivu-checkbox {
  &:hover {
    border-color: #F98C04;
  }
}
</style>


