<template>
  <div class="exchange">
    <div v-if="commUserInfo.certFlag !== 1">
      <p class="tip">
        您还未完成实名认证，请前往提交实名信息
      </p>
      <Button
        type="warning"
        style="margin-top: 20px;"
        class="bt-width"
        @click="goIdentity()"
      >
        实名认证
      </Button>
    </div>

    <div v-if="commUserInfo.certFlag === 1">
      <div v-if="!isAnchor">
        <p class="tip">
          您还不是主播，请先去申请直播！
        </p>
        <Button
          type="warning"
          style="margin-top: 20px;"
          class="bt-width"
          @click="wantToLive"
        >
          申请直播
        </Button>
      </div>
      <div
        v-if="isBingCard==='0' && isAnchor"
        class="no-bind-card"
      >
        <Balance />
        <p class="tip">
          您还未绑定银行卡账户，尚未能进行收益兑换操作
        </p>
        <Button
          type="warning"
          class="mt bt-width"
          @click="goBindCard(0)"
        >
          去绑定
        </Button>
      </div>
      <div
        v-if="isBingCard==='1' && isAnchor"
        class="bind-card"
      >
        <p
          class="warn-tip"
        >
          {{ isDate ? `收益兑换已开启${month}月20日至${month}月25日` : `下次收益兑换日期${month}月20日至${month}月25日` }}
        </p>
        <Balance />
        <p class="tip">
          已经扣除相关渠道产生的费用和增值税
        </p>
        <div class="exchange-rule">
          <div class="rule">
            <Checkbox v-model="checkbox" />
            <span class="desc">了解并同意</span>
            <a @click="readRule">《兑换规则》</a>
          </div>
          <Button
            v-if="isDate"
            type="warning"
            class="bt-width mt"
            :disabled="!checkbox"
            @click="goExchange"
          >
            去兑换
          </Button>
        </div>

        <Button
          v-if="!isDate"
          class="disabled-btn mt bt-width"
          :disabled="true"
        >
          兑换未开启
        </Button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { Button, Checkbox } from 'iview'
import Balance from './components/balance'
export default {
  components: {
    Button,
    Checkbox,
    Balance
  },
  data() {
    return {
      isBingCard: '0', // 0 未绑定 1是绑定
      isDate: true,
      checkbox: false,
      month: '',
      isAnchor: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions(['GetBankInfo', 'GainAndJudgeAnchors']),

    async init() {

      const result = await this.GainAndJudgeAnchors({uids: String(this.getUserInfo().uid), vm: this})
      this.isAnchor = !!result[0].room_id
      this.GetBankInfo({ id: this.getUserInfo().uid, vm: this })
        .then(data => {
          // 没有卡号 认为没有阅读过规则
          this.isBingCard = data.isBind
          this.getOpenDate(data.timemap)
        })
        .catch(() => {
          this.$error('接口报错，请联系管理员')
        })
    },

    getOpenDate(time) {
      const day = time ? new Date(time * 1000).getDate() : new Date().getDate()

      if (time) {
        this.month = new Date(time * 1000).getMonth()
      } else {
        this.month = new Date().getMonth() + 1
      }

      if (day >= 20 && day <= 25) {
        this.isDate = true
        return
      }

      this.isDate = false
      if (day < 20) {
        return
      }

      if (day > 25) {
        this.month += 1
        return
      }
    },

    readRule() {
      window.open('/rules/exchange-income')
    },

    goBindCard(index) {
      this.$emit('goBindCard', index)
    },

    goExchange() {
      this.$emit('goExchange')
    },

    goIdentity() {
      this.$router.push({
        path: '/personal/identity'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.exchange {
  padding: 22px 0 0;
  .no-bind-card {
    .mt {
      margin-top: 35px;
    }
  }

  .tip {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666660;
  }
  .warn-tip {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #ffa029;
    background: #fff1df;
    width: 200px;
    height: 27px;
    line-height: 27px;
    margin-bottom: 17px;
    text-align: center;
  }
  &-rule {
    margin-top: 40px;
  }
}

.disabled-btn-com {
  background: #ccc;
  color: #fff;
}
.disabled-btn {
  @extend .disabled-btn-com;
  &:hover {
    @extend .disabled-btn-com;
  }
}
.rule {
  a {
    color: #ffa029;
  }
}
</style>


