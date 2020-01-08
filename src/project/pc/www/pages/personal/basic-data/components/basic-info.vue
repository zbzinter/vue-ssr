<template>
  <div class="basic-info">
    <ul class="list clearfix">
      <li
        v-for="(item, index) in list"
        :key="index"
        class="clearfix"
        :class="item.isBindHide && item.isBind ? 'hide' : ''"
      >
        <div class="fl icon-box">
          <i
            class="iconfont"
            :class="item.icon"
          />
        </div>
        <div class="fl con">
          <p class="title">
            {{ item.isBind ? item.bindTitle : item.title }}
            {{ item.value ? `(${item.value})` : '' }}
          </p>
          <p class="des">
            {{ item.des }}
          </p>
        </div>
        <div
          class="fr btn"
          :class="item.isBind ? '' : 'blue'"
          @click="switchTab(item.id)"
        >
          {{ item.isBind ? item.bindBtnText : item.btnText }}
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      list: [
        {
          id: 3,
          isBind: false,
          icon: 'icondm_ce',
          title: '手机未绑定',
          bindTitle: '手机已绑定',
          des: '您可以享受手机相关的安全及提醒服务',
          btnText: '绑定手机',
          bindBtnText: '修改手机',
          value: ''
        },
        {
          id: 4,
          isBind: false,
          icon: 'icondk_ce',
          title: '密码未设置',
          bindTitle: '密码已设置',
          des: '您可以设置密码使您的账号更加安全',
          btnText: '设置密码',
          bindBtnText: '修改密码',
        },
        {
          id: 5,
          isBind: false,
          icon: 'icondl_ce',
          title: '邮箱未绑定',
          bindTitle: '邮箱已绑定',
          des: '您可以使用邮箱来保证您的用户安全',
          btnText: '绑定邮箱',
          bindBtnText: '修改邮箱',
          value: ''
        },
        {
          id: 999,
          isBind: false,
          // 绑定后隐藏
          isBindHide: true,
          icon: 'icondg_ce',
          title: '尚未实名认证',
          bindTitle: '已实名认证',
          des: '认证后可申请直播间',
          btnText: '立即认证',
          bindBtnText: '重新认证',
        }
      ]
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
      // 是否绑定手机
      if(this.commUserInfo.mobile) {
        this.list[0].value = this.commUserInfo.mobile
        this.list[0].isBind = true
      }
      // 是否设置密码
      this.list[1].isBind = !!this.commUserInfo.modifyPwd
      // 是否设置邮箱
      if(this.commUserInfo.email) {
        this.list[2].value = this.commUserInfo.email
        this.list[2].isBind = true
      }
      // 是否实名认证
      if(this.commUserInfo.certFlag > 0) {
        this.list[3].isBind = true
      }
    },
    switchTab(index) {
      if(index === 999) {
        // 实名认证
        this.$router.push({
          path: '/personal/identity'
        })
      } else {
        this.$emit('switchTab', index)
      }
    }
  }
}
</script>
<style lang="postcss" scoped>
.basic-info {
  .list {
    padding-top: 25px;
    li {
      float: left;
      width: 50%;
      padding: 20px 0 40px 0;
      &.hide {
        display: none;
      }
      .icon-box {
        width: 40px;
        height: 40px;
        line-height: 40px;
        vertical-align: middle;
        text-align: center;
        border-radius: 40px;
        background: #F7F7F7;
        .iconfont {
          font-size: 20px;
          color: #3683FF;
        }
      }
      .con {
        margin-left: 16px;
        .title {
          font-size: 14px;
          color: #333333;
        }
        .des {
          font-size: 12px;
          color: #666666;
          padding-top: 2px;
        }
      }
      .btn {
        width: 80px;
        height: 32px;
        line-height: 30px;
        font-size: 12px;
        color: #666666;
        cursor: pointer;
        text-align: center;
        margin: 4px 50px 0 0;
        border: 1px solid #CCCCCC;
        border-radius: 4px;
        transition: all 0.3s;
        &.blue {
          color: #3683FF;
          border-color: #3683FF;
        }
        &:hover {
          color: #fff;
          border-color: #3683FF;
          background: #3683FF;
        }
      }
    }
  }
}
</style>


