<template>
  <div class="balance">
    <div class="item">
      <label class="tit">当前球豆剩余：</label>
      <span class="desc num">{{ beans }}</span>
      <img
        class="img"
        src="../../../../assets/personal/icon-peas.png"
        alt=""
      >
    </div>
    <div class="item pb">
      <label class="tit bold">提现金额约：</label>
      <span class="desc">{{ balance }}</span>元
    </div>
  </div>
</template>
<script>
import { Decimal } from 'decimal.js'
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      balance: 0,
      beans: 0
    }
  },
  created() {
    this.getPersonalBalance()
  },
  methods: {
    ...mapActions(['G_GetMemberInfo']), 

    getPersonalBalance() {
      this.G_GetMemberInfo({uid: this.getUserInfo().uid})
        .then((data) => {
          this.beans = data.ball_gold || '-'
          this.balance = data.ball_gold ? new Decimal(this.beans/10000).toFixed(2) : '-'
        })
        .catch(() => {
          this.beans = '-'
          this.balance = '-'
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.balance {
  width: 100%;
  padding-top: 30px;
  .item {
    position: relative;
  }
  .tit {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #333;
  }
  .bold {
    font-size: 16px;
    font-weight: 600;
  }
  .desc {
    font-family: PingFangSC-Semibold;
    display: inline-block;
    font-size: 30px;
    color: #FFA029;
    text-align: center;
    padding: 0 5px;
  }
  .num {
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    color: #333;
    font-weight: 600;
    padding-bottom: 20px;
  }
  .img {
    width: 16px;
    position: absolute;
    top: 2px;
  }
  .pb {
    padding-bottom: 40px;
  }
}
</style>


