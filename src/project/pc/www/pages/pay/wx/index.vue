<template>
  <div class="wx-pay">
    <div class="header">
      <span class="b">球会体育 钻石</span>
      <span class="m">收款方：深圳加满分科技有限公司</span>
    </div>
    <!-- 支付二维码 -->
    <div
      v-if="!isPay"
      class="content"
    >
      <div class="code-box">
        <div class="title">
          微信扫码支付
        </div>
        <div
          id="wx-qrcode"
          class="img"
        >
          <!-- 二维码 -->
        </div>
        <div class="des">
          <i class="iconfont iconen_ei" />
          <span>打开微信手机客户端扫一扫</span>
        </div>
      </div>
      <div class="price-table">
        <table>
          <tr>
            <td>消费金额</td>
            <td>{{ price }}元</td>
          </tr>
          <tr>
            <td>支付方式</td>
            <td @click="getWxPayStatus">
              微信支付
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 成功回调 -->
    <div
      v-else
      class="wx-success"
    >
      <svg
        class="svg-icon"
        aria-hidden="true"
      >
        <use xlink:href="#iconbt_cg" />
      </svg>
      <h2>恭喜您，充值成功！</h2>
      <div
        class="btn"
        @click="goHome"
      >
        返回首页
      </div>
      <p>友情提示：如您充值钻石成功，请到个人中心查询是否到账</p>
    </div>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2'
// 查询支付状态定时器
let timer = null

export default {
  components: {
  },
  data() {
    return {
      // 金额
      price: 0,
      // 订单号
      order_sn: null,
      // 支付地址
      code_url: null,
      // 支付成功
      isPay: false
    }
  },
  created() {
    this.init()
  },
  destroyed(){
    this.G_SetNav(1)
  },
  methods: {
    init() {
      const _query = this.$route.query || {}
      this.price = parseInt(_query.price)
      this.order_sn = _query.order_sn
      this.code_url = _query.code_url

      this.G_SetNav(3)
      
      this.$nextTick(() => {
        this.qrcode(this.code_url)
      })
      
      timer = setInterval(() => {
        this.getWxPayStatus()
      }, 5000)
    },
    // 返回首页
    goHome() {
      this.$router.push({
        path: '/'
      })
    },
    // 生成二维码
    qrcode(url) {
      let qrcode = new QRCode('wx-qrcode', {
        // 宽
        width: 150,
        // 高度
        height: 150,
        // 二维码内容
        url: url, 
        // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
        render: 'canvas', 
        // 背景色
        background: '#f0f', 
        // 前景色
        foreground: '#ff0' 
      })
      qrcode.makeCode(url)
    },
    // 查询支付状态
    getWxPayStatus() {
      this.$get('/api/v1/user.php?do=queryorder', {
        apiType: 'shop',
        body: {
          order_sn: this.order_sn
        }
      }).then(res => {
        const { code, data } = res
        if (code == 200 && data.status === 1) {
          // 支付成功
          this.isPay = true
          clearInterval(timer)
        }
      })
    }
  }
}
</script>
<style lang="postcss" scoped>
.wx-pay {
  width: 1200px;
  margin: 0 auto;
  .header {
    line-height: 26px;
    padding: 40px 0 20px 0;
    .b {
      font-size: 18px;
      color: #333333;
      font-weight: bold;
    }
    .m {
      font-size: 14px;
      color: #666666;
      margin-left: 20px;
    }
  }
  .content {
    height: 500px;
    text-align: center;
    padding-top: 70px;
    background: #fff;
    .code-box {
      .title {
        font-size: 18px;
        color: #333333;
        line-height: 30px;
        font-weight: bold;
      }
      .img {
        width: 150px;
        height: 150px;
        margin: 8px auto;
        background: #D8D8D8;
      }
      .des {
          color: #999999;
        i {
          font-size: 14px;
          line-height: 1;
        }
        span {
          font-size: 10px;
        }
      }
    }
    .price-table {
      width: 300px;
      margin: 40px auto 0 auto;
      table {
        width: 100%;
        tr {
          td:first-child {
            width: 130px;
            background: #FAFAFA;
          }
          td:last-child {
            color: #E15756;
          }
        }
        td {
          height: 42px;
          line-height: 42px;
          border: 1px solid #ccc;
        }
      }
    }
  }
  .wx-success {
    height: 450px;
    text-align: center;
    padding-top: 70px;
    background: #fff;
    .svg-icon {
      font-size: 80px;
    }
    h2 {
      font-size: 20px;
      color: #333333;
      line-height: 30px;
      padding: 12px 0 26px 0;
    }
    .btn {
      color: #4c8ffb;
      line-height: 32px;
      padding: 0 26px;
      font-size: 12px;
      margin-bottom: 40px;
      cursor: pointer;
      display: inline-block;
      border: 1px solid #3683FF;
      border-radius: 4px;
      background: #fff;
      &:hover {
        color: #fff;
        background: #4c8ffb;
      }
    }
    p {
      font-size: 12px;
      color: #999999;
    }
  }
}
</style>


