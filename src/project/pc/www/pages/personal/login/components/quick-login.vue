<template>
  <div class="quick-login">
    <h2 class="big-title">
      其他登录方式
    </h2>
    <div class="quick-main">
      <ul class="list">
        <li
          v-for="(item, index) in data"
          :key="item.key"
          class="clearfix"
          @click="jump(item.methods)"
          @mouseenter="replaceIcon(1, index)"
          @mouseleave="replaceIcon(0, index)"
        >
          <i
            class="iconfont fl"
            :class="item.flag ? item.className1 : item.className2"
          />
          <span
            class="fl"
            :class="!item.flag ? item.key : ''"
          >{{ item.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [
        {
          name: '微信登录',
          methods: 'WXLogin',
          key: 'wx',
          className1: 'wx iconey_dj',
          className2: 'wx iconcq_dj',
          flag: true,
        },
        {
          name: '微博登录',
          methods: 'WBLogin',
          key: 'wb',
          className1: 'wb iconez_dj',
          className2: 'wb iconcr_dj',
          flag: true,
        },
        {
          name: 'QQ登录',
          methods: 'QQLogin',
          key: 'qq',
          className1: 'qq iconfa-dj',
          className2: 'qq iconcx-dj',
          flag: true,
        }
      ]
    }
  },
  methods: {
    replaceIcon(param, index) {
      this.data[index]['flag'] = !param
    },

    jump() {
      this.$tip('敬请期待')
      // this[methods]()
    },
  }
}
</script>
<style lang="postcss" scoped>
.quick-login {
  padding-top: 36px;
  padding-left: 28px;
  width: 130px;
  .big-title {
    text-align: left;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    width: 84px;
    color: #666666;
  }
  .quick-main {
    .list {
      padding-bottom: 15px;
      width: 112px;
      li {
        display: inline-block;
        height: 36px;
        line-height: 36px;
        text-align: left;
        margin-bottom: 32px;
        cursor: pointer;
        span {
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #666666;
          font-weight: 500;
          padding-left: 20px;
        }
        &:first-child {
          margin-top: 22px;
        }
      }
      .iconfont {
        cursor: pointer;
        font-size: 36px;
      }
      .qq {
        color: #6ca3d7;
      }
      .wx {
        color: #7cd098;
      }
      .wb {
        color: #e98180;
      }
    }
  }
}



</style>


