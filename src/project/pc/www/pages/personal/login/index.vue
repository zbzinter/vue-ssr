<template>
  <div>
    <!-- 登录 -->
    <div v-show="showLoginModal || registerFlag === '1'">
      <Modal
        style="width:580px"
        class="login"
        :value="showLoginModal"
        :mask-closable="false"
        :footer-hide="true"
        :transition-names="['ease', 'fade']"
        @on-cancel="cancel"
      >
        <div
          v-if="!loginflag"
          class="clearfix"
        >
          <div class="fl">
            <!-- 登录 -->
            <LoginForm
              v-if="curId === 1"
              @register="tagClick"
            />
            <!-- 注册 -->
            <RegisterForm
              v-if="curId === 2"
              @returnLogin="tagClick"
            />
          </div>
          <div class="fl">
            <!-- 第三方登录 -->
            <QuickLogin />
          </div>
        </div>
        <div v-if="loginflag">
          <CodeLogin />
        </div>
        <div
          class="qrcode"
          @click="loginWay"
        >
          <div class="qrcode-img">
            <div class="border-img">
              {{ !loginflag ? '扫码安全登录' : '账号密码登录' }}
            </div>
            <img
              v-if="!loginflag"
              width="75"
              src="../../../assets/login-register/qrcode.png"
              alt
            >
            <img
              v-if="loginflag"
              width="75"
              src="../../../assets/login-register/computer.png"
              alt
            >
          </div>
        </div>
      </Modal>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { Modal } from 'iview'
import { getQueryString } from '@utils/url'
import LoginForm from './components/login'
import RegisterForm from './components/register'
import CodeLogin from './components/code-login'
export default {
  components: {
    Modal,
    QuickLogin: () => import('./components/quick-login'),
    LoginForm,
    RegisterForm,
    CodeLogin
  },
  data() {
    return {
      curId: 1,
      loginflag: false,
      registerFlag: '0'
    }
  },
  computed: {
    ...mapState(['showLoginModal']),
    ...mapState(['globalLoginOrRegister'])
  },
  watch: {
    globalLoginOrRegister(val) {
      this.curId = val
    }
  },
  mounted() {
    this.registerFlag = getQueryString('register', window.location.href)
    if (this.registerFlag === '1' && !localStorage.getItem('token')) {
      this.curId = 2
      this.G_SetLogin(true)
    }
    const login = document.getElementsByClassName('login')[0]
    if (login) {
      const close = document.getElementsByClassName('ivu-icon-ios-close')[0]
      close.addEventListener('mouseover', function() {
        this.classList.add('close-mouseover')
        this.classList.remove('close-mouseout')
      })

      close.addEventListener('mouseout', function() {
        this.classList.add('close-mouseout')
        this.classList.remove('close-mouseover')
      })
    }
  },
  methods: {
    cancel() {
      this.G_SetLogin(false)
    },

    tagClick(id) {
      this.curId = id
    },

    loginWay() {
      this.loginflag = !this.loginflag
    }
  }
}
</script>
<style lang="postcss" scoped>
.header {
  margin-bottom: -14px;
  li {
    float: left;
    height: 32px;
    padding: 0 10px;
    font-size: 16px;
    cursor: pointer;
    margin-right: 30px;
    &.cur {
      color: #3683ff;
      border-bottom: 2px solid #3683ff;
    }
  }
}

.login {
  /deep/ {
    .ivu-modal-content {
      width: 580px;
    }
    .ivu-modal-body {
      padding: 15px;
    }
  }
}

/deep/ .ivu-input,
input {
  &:focus {
    box-sizing: border-box;
    border: 1px solid rgba(54, 131, 255, 0.2);
    box-shadow: 0 0 0 2px rgba(54, 131, 255, 0.2);
  }
}

.qrcode {
  position: absolute;
  top: 331px;
  right: 0;
  cursor: pointer;
  &-img {
    position: relative;
  }
  .border-img {
    position: absolute;
    width: 104px;
    height: 30px;
    top: 10px;
    right: 45px;
    padding: 4px 5px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #397dea;
    letter-spacing: 0;
    display: none;
    background: url(../../../assets/login-register/border.png) no-repeat center
      center;
    background-size: 104px;
  }
  &:hover {
    .border-img {
      display: inline-block;
    }
  }
}

/deep/ .ivu-modal-close {
  .close-mouseover {
    transform: rotate(180deg);
    transition: 0.5s;
  }

  .close-mouseout {
    transform: rotate(0deg);
    transition: 0.5s;
  }
}
</style>


