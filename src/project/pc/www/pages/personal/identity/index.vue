<template>
  <div class="identity">
    <UserInfo />
    <div class="content">
      <h2>请去球会体育APP实名认证。</h2>
      <h2>非大陆地区用户认证，请联系球会体育客服     QQ：2207851532</h2>
      <div class="qrcode">
        <img
          src="../../../assets/personal/qrcode.png"
          alt=""
        >
        <p>扫描二维码下载APP</p>
      </div>
    </div>
  </div>
</template>
<script>
import UserInfo from '@src/components/personal/user-info'
export default {
  components: {
    UserInfo,
  },
  data() {
    return {
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
      // 如果已经实名认证，跳到设置页面
      if(this.commUserInfo.certFlag > 0) {
        this.$router.push('/personal/set-simple')
      }
    }
  }
}
</script>
<style lang="postcss" scoped>
.content {
  height: 500px;
  padding: 30px;
  text-align: center;
  border-radius: 10px;
  background: #fff;
  h2 {
    font-size: 18px;
    color: #999999;
    padding-top: 20px;
  }
  .qrcode {
    padding-top: 30px;
    img {
      width: 110px;
      height: 110px;
    }
    p {
      font-size: 12px;
      color: #999999;
      padding-top: 5px;
    }
  }
}
</style>


