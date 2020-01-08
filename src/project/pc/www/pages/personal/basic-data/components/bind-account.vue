<template>
  <div class="bind-account">
    <ul>
      <li
        v-for="item in accountList"
        :key="item.key"
        :class="item.key"
      >
        <i
          class="iconfont"
          :class="item.icon"
        />
        <span class="title">{{ item.title }}</span>
        <span class="bind">{{ bindList.indexOf(item.key) !== -1 ? '已绑定' : '未绑定' }}</span>
        <Button
          :type="bindList.indexOf(item.key) !== -1 ? 'default' : 'primary'"
          @click="submit(bindList.indexOf(item.key) !== -1, item.key)"
        >
          {{ bindList.indexOf(item.key) !== -1 ? '解除绑定' : '立即绑定' }}
        </Button>
      </li>
    </ul>
  </div>
</template>
<script>
import { Button, Modal } from 'iview'
import Http from '@utils/Http'
const http = new Http()

export default {
  components: {
    Button
  },
  data() {
    return {
      // WX | QQ | WEIBO
      bindList: [],
      // 帐号列表
      accountList: [
        {
          key: 'QQ',
          title: '腾讯QQ',
          icon: 'iconcx-dj',
        },
        {
          key: 'WX',
          title: '微信',
          icon: 'iconcq_dj',
        },
        {
          key: 'WEIBO',
          title: '新浪微博',
          icon: 'iconcr_dj',
        },
      ],
    }
  },
  watch: {
    commUserInfo() {
      this.init()
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const { bindThirds } = this.commUserInfo
      if(bindThirds) {
        // 列出已绑定的帐号
        this.bindList = bindThirds.map(item => item.channelName)
      }
    },
    submit(isBind, type) {
      if(isBind) {
        Modal.confirm({
          title: '确定要解除绑定吗？',
          onOk: () => this.unBind(type)
        })
      } else {
        this.bind(type)
      }
    },
    // 解绑
    unBind(type) {
      http.$get('jmfen-sport-usercenter/v1/user/unBind/' + type, {
        apiType: 'gw',
        body: {
          token: localStorage.getItem('token')
        }
      }).then(res => {
        if(res.code === 100200) {
          this.$success('解绑成功')
          const timer = setTimeout(() => {
            this.$parent.changeTab(1)
            clearTimeout(timer)
          }, 1501)
        } else {
          this.$error(res.msg)
        }
      })
    },
    // 绑定
    bind(type) {
      switch(type) {
      case 'QQ':
        this.QQLogin(this.getPersonalRedirectUrl())
        break
      case 'WX':
        this.WXLogin(this.getPersonalRedirectUrl())
        break
      case 'WEIBO':
        this.WBLogin(this.getPersonalRedirectUrl())
        break
      }
    },
    // 获取回调地址-当前域名
    getPersonalRedirectUrl() {
      return window.location.origin + '/personal/basic-data'
    },
  }
}
</script>
<style lang="postcss" scoped>
.bind-account {
  padding-left: 10px;
  li {
    margin-top: 24px;
    line-height: 40px;
    height: 40px;
    ont-size: 14px;
    color: #333333;
    &.QQ .iconfont{
      color: #6CA3D7;
    }
    &.WX .iconfont{
      color: #7CD098;
    }
    &.WEIBO .iconfont{
      color: #E98180;
    }
    .iconfont {
      font-size: 40px;
      margin-right: 16px;
      float: left;
    }
    .bind,
    .title {
      width: 90px;
      display: inline-block;
    }
  }
}
</style>


