<template>
  <div>
    <UserInfo @swichTab="changeTab" />
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
        @switchTab="changeTab"
      />
    </div>
  </div>
</template>
<script>
import { Tabs, TabPane } from 'iview'
import BindingThirdMixins from '../../../mixins/binding-third'
import BasicInfo from './components/basic-info'
import ChangeNickname from './components/change-nickname'
import ChangePhone from './components/change-phone'
import ChangePassword from './components/change-password'
import ChangeEmail from './components/change-email'
import BindAccount from './components/bind-account'
export default {
  components: {
    'UserInfo': () => import('@src/components/personal/user-info'),
    Tabs,
    TabPane,
  },
  mixins: [BindingThirdMixins],
  data() {
    return {
      curTab: 1,
      tab: [
        {
          id: 1,
          title: '基本资料',
        },
        {
          id: 2,
          title: '修改昵称',
        },
        {
          id: 3,
          title: '修改手机',
        },
        {
          id: 4,
          title: '修改密码',
        },
        {
          id: 5,
          title: '修改邮箱',
        },
        {
          id: 6,
          title: '第三方帐号绑定',
        }
      ],
      tabComponents: {
        1: BasicInfo,
        2: ChangeNickname,
        3: ChangePhone,
        4: ChangePassword,
        5: ChangeEmail,
        6: BindAccount
      }
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
        path: '/personal/basic-data',
        query: {
          tab: this.curTab
        }
      })
    },
  }
}
</script>
<style lang="scss" scoped>
@import './../../../public/personal/tab.scss';

.c-basic-tab {
  border-radius: 10px;
  background: #fff;
  .ivu-tabs-tabpane {
    padding: 15px;
    padding-top: 0;
  }
}
</style>


