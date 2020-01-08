<template>
  <div class="code-login">
    <p class="title">
      手机扫码，安全登录
    </p>
    <div
      v-if="flag"
      class="login-main"
    >
      <div class="img clearfix">
        <div
          id="qrcode"
          ref="qrcode"
          class="qrcode fl"
        />
        <div
          v-if="time === invalidTime"
          class="fl mask"
        >
          <p>二维码已失效</p>
          <div
            class="refresh"
            @click="getUrl"
          >
            <i />
            <span>
              刷新
            </span>
          </div>
        </div>
        <img
          class="fl"
          src="../../../../assets/login-register/phone-scan.png"
          alt=""
        >
      </div>
      <div style="text-align:center">
        <div class="desc clearfix">
          <i class="iconfont iconen_ei fl" />
          <div class="fl">
            <span>请使用 </span>
            <a>球会APP</a>
            <span> 扫码二维码登录</span>
          </div>
        </div>
      </div>
      <div class="cb">
        <Checkbox v-model="checkbox">
          一周自动登录
        </Checkbox>
      </div>
    </div>
    <div
      v-if="!flag"
      class="scan-code"
    >
      <div class="scan-code__success">
        <img
          width="288px"
          height="161px"
          src="../../../../assets/login-register/scan_code.png"
          alt=""
        >
        <p>扫码成功</p>
        <span>请在手机上确认登录</span>
      </div>
      <div class="desc clearfix" />
      <div class="cb">
        返回扫码 >
      </div>
    </div>
  </div>
</template>
<script>

import { Checkbox } from 'iview'
import Http from '@utils/Http'
const http = new Http()
let QRCode
export default {
  components: {
    Checkbox,
  },
  data() {
    return {
      checkbox: true,
      url: '',
      qrcode: null,
      flag: true,
      timer: null,
      time: 1,
      invalidTime: 3*60
    }
  },
  destroyed() {
    if (this.timer) {
      window.clearInterval(this.timer)
      this.timer = null
    }
  },
  mounted() {
    QRCode = require('qrcodejs2')
    this.createCode()
    this.getUrl()
  },
  methods: {
    
    createCode() {
      this.qrcode = new QRCode('qrcode', {
        width: 160, //图像宽度
        height: 160, //图像高度
        colorDark : '#000000', //前景色
        colorLight : '#ffffff', //背景色
        typeNumber:4, 
        // correctLevel : QRCode.CorrectLevel.H //容错级别 容错级别有：（1）QRCode.CorrectLevel.L （2）QRCode.CorrectLevel.M （3）QRCode.CorrectLevel.Q （4）QRCode.CorrectLevel.H
      })
      this.qrcode.clear() //清除二维码 
    },

    getUrl() {
      this.$post('/jmfen-sport-passport/validata/qrcode?noncestr=' + this.randomString(6), {
        apiType: 'gw',
        body: {
          noncestr: this.randomString(6)
        }
      }).then(res => {
        const {data:{qrcode}} = res
        if (qrcode) {
          this.url = qrcode
          this.qrcode.clear() //清除二维码 
          this.qrcode.makeCode(this.url+'jmf') //生成另一个新的二维码
          this.getMessage()
        }
      })
    },

    randomString(val) {
      const len = val || 6
      const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' 
      const maxPos = chars.length
      let pwd = ''
      const arr = '.'.repeat(len);
      [...arr].forEach(() => {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos))
      })
     
      return pwd
    },

    getMessage() {
      this.time = 1
      this.timer = setInterval(() => {
        if (this.time === this.invalidTime) {
          window.clearInterval(this.timer)
          return false
        }
        this.time++
        http.$post('/jmfen-sport-passport/validata/qrcodeStatus?qrCode=' + this.url, {
          apiType: 'gw',
          headers: {
            'Authorization': 'Basic YXBwOmFwcA=='
          },
          body: {
            qrCode:this.url,
          }
        }).then(res => {
          if(this.$judgeCode(res.code)) {
            window.clearInterval(this.timer)
            const data = res.data || {}
            this.$success('登录成功')
            this.flag = false
            localStorage.setItem('token', data.token)
            localStorage.setItem('uid', data.uid)

            setTimeout(() => {
              window.location.reload()
            }, 2000)
          }
        })
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
.code-login {
  position: relative;
}
.title {
  font-size: 20px;
  color: #333333;
  line-height: 30px;
  padding-top: 5px;
  font-weight: 700;
}
.img {
  padding-top: 36px;
  padding-left: 100px;
  div {
    display: inline-block;
    width: 164px;
    height: 164px;
    margin-top: 40px;
  }
  img:last-child {
    margin-left: 23px;
    width: 203px;
    height: 223px;
  }
  .mask {
    z-index: 2;
    position: absolute;
    left: 100px;
    background: black;
    opacity: 0.9;
    text-align: center;
    p {
      opacity: 1;
      color: #fff;
      text-align: center;
      font-size: 18px;
      padding-top: 40px;
    }
    .refresh {
      cursor: pointer;
      margin-top: 20px;
      border: 1px solid #f35506;
      color: #f35506;
      width: 100px;
      height: 20px;
      line-height: 19px;
      text-align: center;
      vertical-align: middle;
    }
  }
}
.desc {
  display: inline-block;
  padding-top: 20px;
  line-height: 20px;
  font-size: 14px;
  letter-spacing: 0;
  span {
    color: #666666;
  }
  a {
    color: #3683FF;
  }
}

.iconen_ei {
  font-size: 22px;
  color: #e15756;
  margin-right: 8px;
}
.cb {
  padding-left: 5px;
  padding-top: 21px;
  font-family: PingFangSC-Regular;
  font-size: 12px;
  line-height: 17px;
  letter-spacing: 0;
  color: #999999;
  cursor: pointer;
}
.ic_checked_cf {
  display: inline-block;
  width: 14px;
  height: 14px;
  background: url(../../../../assets/score/football/bt_cg.png) center center
    no-repeat;
  background-size: 100% auto;
  background-repeat: no-repeat;
}
.iconbs_cf {
  font-family: "iconfont";
  font-size: 14px;
}

/deep/ .ivu-checkbox {
  &.ivu-checkbox-checked {
    width: 14px;
    height: 14px;
    .ivu-checkbox-inner {
      border: 0;
      background-color: transparent;
      @extend .ic_checked_cf;
      &:after {
        display: none;
      }
      &:before {
        display: none;
      }
    }
  }
  .ivu-checkbox-focus {
    box-shadow: none;
  }
  .ivu-checkbox-inner {
    transition: none;
    background-color: transparent;
    border: 0;
    width: 14px;
    height: 14px;
    @extend .iconbs_cf;
    &:before {
      content: "\e632";
    }
  }
}
.scan-code {
  margin-top: 42px;
  &__success {
    width: 100%;
    text-align: center;
    img {
      display: inline-block;
    }
    p {
      font-family: PingFangSC-Semibold;
      font-size: 18px;
      color: #333333;
      font-weight: 700;
      padding-top: 28px;
    }
    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
    }
  }
  .cd {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
    line-height: 16px;
  }
}


</style>


