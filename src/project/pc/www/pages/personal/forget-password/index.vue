<template>
  <div class="forget-password">
    <div class="inner">
      <Steps
        :current="curStep"
        class="steps"
      >
        <Step title="填写资料" />
        <Step title="重置密码" />
        <Step title="完成" />
      </Steps>
      <div class="content">
        <!-- 第一步 -->
        <Step1
          v-if="curStep === 0"
          @changeStep="changeStep"
        />
        <Step2
          v-if="curStep === 1"
          :data="data"
          @changeStep="changeStep"
        />
        <Step3 v-if="curStep === 2" />
      </div>
      <div
        v-if="tip"
        class="tip"
      >
        {{ tip }}
      </div>
    </div>
  </div>
</template>
<script>
import { Steps, Step } from 'iview'
import Step1 from './components/step1'
import Step2 from './components/step2'
import Step3 from './components/step3'
import { setTimeout } from 'timers'
export default {
  components: {
    Steps,
    Step,
    Step1,
    Step2,
    Step3
  },
  data() {
    return {
      // 当前进行到的步骤
      curStep: 0,
      // ticket, 手机号
      data: {},
      tip: ''
    }
  },
  watch: {
    tip: {
      handler: function (val) {
        if (val) {
          setTimeout(() => {
            this.tip = ''
          }, 3000)
        }
      }
    }
  },
  methods: {
    changeStep(params) {
      this.curStep = params.key
      this.data = params
    }
  }
}
</script>
<style lang="postcss" scoped>
.forget-password {
  background: #fff;
  .inner {
    position: relative;
    width: 660px;
    margin: 0 auto;
    padding: 160px 0;
    >>>.ivu-steps {
      margin-left: 90px;
      .ivu-steps-status-process,
      .ivu-steps-status-finish {
        .ivu-steps-title {
          color: #3683FF;
        }
      }
      .ivu-steps-tail>i {
        height: 2px;
      }
      .ivu-steps-title {
        display: block;
        text-align: center;
        padding: 0;
        margin-left: 15px;
        margin-top: 10px;
        transform: translateX(-50%)
      }
      .ivu-steps-head-inner {
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 16px;
        .ivu-steps-icon {
          margin-top: -4px;
        }
      }
    }
  }
  .content {
    padding-top: 70px;
  }
}
.tip {
  position: absolute;
  top: 402px;
  left: 229px;
  min-width: 150px;
  padding: 5px 20px;
  opacity: 0.7;
  border-radius: 4px;
  color: #fff;
  background: #000;
}
</style>


