<template>
  <div>
    <UserInfo />
    <Tabs
      :value="curTab + ''"
      class="c-base-tab gold"
      @on-click="tabChange"
    >
      <TabPane
        v-for="(item, index) in tab"
        :key="index"
        :label="item.title"
        :name="item.id + ''"
      >
        <div v-if="tabComponents[item.id].isShow">
          <component
            :is="tabComponents[item.id].name"
            @switchTab="tabChange"
          />
        </div>
        <div
          v-if="!tabComponents[item.id].isShow"
          class="tip"
        >
          抱歉，{{ tabComponents[item.id].key }}兑换通道暂时关闭
        </div>
      </TabPane>
    </Tabs>
  </div>
</template>
<script>
import { Tabs, TabPane } from 'iview'
import UserInfo from '@src/components/personal/user-info'
import Diamond from './components/diamond'
import Gold from './components/gold'

export default {
  components: {
    UserInfo,
    Tabs,
    TabPane,
    'Diamond': Diamond,
    'Gold': Gold
  },
  data() {
    return {
      curTab: 0,
      tab: [
        {
          id: 0,
          title: '钻石充值',
        },
      ],
      tabComponents: [{
        key: '钻石',
        name: 'Diamond',
        isShow: true,
      }, {
        key: '金币',
        name: 'Gold',
        isShow: true
      }],
      isShow: false,
    }
  },
  mounted() {
    // this.isSwitch()
  },
  methods: {
    tabChange(id) {
      if(id === this.curTab) return
      this.curTab = id
    },

    isSwitch() {
      const data = JSON.parse(localStorage.getItem('memberInfo'))
      if (data.diamond) {
        this.tabComponents[0].isShow = true
      }
      
      if (data.gold) {
        this.tabComponents[1].isShow = true
      }
     
      this.$get('...').then((res)=> {
        this.tabComponents[0].isShow = false
        this.tabComponents[1].isShow = false
      })

    },
  }
}
</script>
<style lang="scss" scoped>
  .tip {
    text-align: center;
    padding-top: 138px;
    font-size: 20px;
    color: #999;
  }
</style>


