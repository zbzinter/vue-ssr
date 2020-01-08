<template>
  <div>
    <!-- 绑定手机号 -->
    <Modal
      :value="true"
      :mask-closable="false"
      :footer-hide="true"
      :header-hide="true"
      :transition-names="['ease', 'fade']"
    >
      <!-- header -->
      <div class="header">
        <h2>{{ curId === 1 ? '账号存在安全风险': '设置密码更安全' }}</h2>
        <p>{{ curId === 1 ? '为了确保您的账户安全，请立即绑定手机号': '设置密码，能使您的账号更安全' }}</p>
      </div>
      <div class="content">
        <!-- 登录 -->
        <Phone
          v-if="curId === 1"
          :token-to-bind-phone="tokenToBindPhone"
          @changeTab="changeTab"
        />
        <!-- 注册 -->
        <Password
          v-if="curId === 2"
          :ticket="ticket"
          :phone-number="phoneNumber"
          @closeBindbox="closeBindbox"
        />
      </div>
      <!-- 服务协议 -->
      <div class="copyright">
        <p>
          使用即为同意<a
            href="/rules/user-policy?flag=1"
            target="_blank"
          >《用户服务协议》</a>和<a
            href="/rules/user-policy?flag=1"
            target="_blank"
          >《隐私政策》</a>
        </p>
      </div>
      <div class="service">
        <p
          v-if="curId === 2"
          class="skip"
          @click="closeBindbox"
        >
          跳过
        </p>
      </div>
    </Modal>
  </div>
</template>
<script>
import { Modal } from 'iview'
import Phone from './components/phone'
import Password from './components/password'
export default {
  components: {
    Modal,
    Phone,
    Password,
  },
  props: {
    tokenToBindPhone: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      curId: 2,
      ticket: '',
      phoneNumber: '',
      tag: [
        {
          id: 1,
          title: '登录',
        },
        {
          id: 2,
          title: '注册',
        }
      ]
    }
  },
  methods: {
    changeTab(ticket, phone) {
      this.curId = 2
      this.ticket = ticket
      this.phoneNumber = phone
    },
    closeBindbox() {
      this.$emit('closeBindbox')
    }
  }
}
</script>
<style lang="scss" scoped>
@import './../../../public/personal/common.scss';
.header {
  text-align: center;
  h2 {
    font-family: PingFangSC-Semibold;
    font-size: 20px;
    color: #333333;
    line-height: 30px;
    margin-top: 25px;
  }
  p {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    line-height: 20px;
    padding-top: 8px;
    color: #666666;
    letter-spacing: 0;
  }
}
.content {
  padding: 30px 0 15px 0;
}
.service {
  color: #666;
  text-align: center;
  font-size: 12px;
  .skip {
    cursor: pointer;
    font-size: 12px;
    color: #999999;
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}

 /deep/ .ivu-modal-content {
    width: 448px;
  }
/deep/ .ivu-modal-body {
  padding: 15px;
}
.copyright {
  padding-top: 0;
  margin-left: 83px;
  width: 255px;
  margin-bottom: 15px;
}
</style>


