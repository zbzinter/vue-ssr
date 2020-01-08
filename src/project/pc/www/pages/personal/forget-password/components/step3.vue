<template>
  <div class="step3">
    <div class="ico">
      <i class="iconfont iconbb_ca" />
    </div>
    <h2>密码修改成功</h2>
    <p>{{ second }}s后返回首页</p>
  </div>
</template>
<script>
let timer = null
export default {
  components: {
  },
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      second: 3
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      timer = setInterval(() => {
        this.second --
        if(this.second < 0) {
          clearInterval(timer)
          this.G_SetLogin(true)
          this.$router.push({
            path: '/'
          })
        }
      }, 1000)
    }
  }
}
</script>
<style lang="postcss" scoped>
.step3 {
  text-align: center;
  .ico {
    width: 80px;
    height: 80px;
    line-height: 80px;
    margin: 0 auto;
    text-align: center;
    background: #f2f2f2;
    border-radius: 80px;
  }
  .iconfont {
    font-size: 30px;
    color: #3683FF;
    vertical-align: middle;
  }
  h2 {
    font-size: 20px;
    color: #333;
    padding: 15px 0;
  }
  p {
    font-size: 14px;
    color: #999999;
  }
}
</style>


