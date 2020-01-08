<template>
  <div
    v-if="loading"
    class="email"
  >
    <div class="email-icon">
      <svg
        v-if="flag"
        class="svg-icon iconfont"
        aria-hidden="true"
      >
        <use xlink:href="#icon_bule_success" />
      </svg>
      <svg
        v-if="!flag"
        class="svg-icon iconfont"
        aria-hidden="true"
      >
        <use xlink:href="#iconew_gj" />
      </svg>
    </div>
    <p class="tip">
      {{ msg }}
    </p>
    <div class="btn-area">
      <div
        class="btn"
        @click="jumpUrl(1)"
      >
        <i class="iconfont iconem_fe" />
        <span class="txt">返回首页</span>
      </div>
      <div
        class="btn"
        @click="jumpUrl(2)"
      >
        <i class="iconfont icondi_ce" />
        <span class="txt">会员中心</span>
      </div>  
    </div>
  </div>
</template>
<script>
import { getQueryString } from '@utils/url'
export default {

  data() {
    return {
      loading: false,
      uid: '',
      token: '',
      flag: true,
      email: '',
      emailCode: '',
      msg: ''
    }
  },
  created() {
    this.uid = getQueryString('userId', location.href)
    this.token = getQueryString('token', location.href)
    this.email = getQueryString('email', location.href)
    this.emailCode = getQueryString('emailCode', location.href)
    this.changeEmail()
  },
  methods: {
    async changeEmail() {
      this.loading = false
      if (!this.email && !this.emailCode) {
        this.flag = false
        this.autoJump(1)
        return this.flag
      }
      if (this.email) {
        this.email = this.email.replace('%40', '@')
      }
      try {
        const {code,msg} = await this.$get('jmfen-sport-usercenter/v1/user/personal/'+this.uid, {
          apiType: 'gw',
          headers: {
            'Authorization': 'Bearer ' + this.token
          },
          body: {
            email: this.email,  // 用urlencode替换 
            emailCode: this.emailCode,
            source: 'web'
          }
        })
        this.flag = code === 100200 ? true : false
        this.msg = this.flag ? '修改邮箱成功！' : msg
        // this.autoJump(1)
      } catch(e) {
        this.flag = false
      }
      this.loading = true
    },

    jumpUrl(param) {
      let path = '/index'
      if (param === 2) {
        path = '/personal/basic-data'
      }
      this.$router.push({
        path
      })
    },

    autoJump() {
      setTimeout(() => {
        this.jumpUrl(1)
      }, 5000)
    },
  }
}
</script>
<style lang="scss" scoped>


@media only screen and (max-width: 320px) {
  .email {
    width: 320px;
  }
}

@media only screen and (min-width: 321px) and (max-width: 375px) {
  .email {
    width: 375px;
  }
}

@media only screen and (min-width: 376px) and (max-width: 415px) {
  .email {
    width: 414px;
  }
}

.email-icon {
  text-align: center;
  margin-top: 200px;
  height: 80px;
}

.iconfont {
  font-size: 80px;
}
.icon_bule_success {
  color: #3683FF;
}
.iconew_gj {
  color: #bfbfbf;
}

.btn-area {
  text-align: center;
  margin-left: 10px;
  margin-top: 15px;
  .iconfont {
    font-size: 12px;
  }
  .btn {
    display: inline-block;    
    width: 92px;
    height: 32px;
    line-height: 32px;
    border-radius: 4px;
    margin-right: 8px;
    border: 1px solid #979797;
    vertical-align: middle;
    text-align: center;
    position: relative;
    cursor: pointer;
  }
  .txt {
    display: inline-block;
    font-size: 12px;
  }
}

.tip {
  text-align: center;
  padding: 20px 0 0 15px;
}



</style>


