<template>
  <div class="balance">
    <label class="tit">收益兑换余额(税前):</label>
    <span class="desc">{{ balance }}</span>元
  </div>
</template>
<script>


import { mapActions } from 'vuex'
export default {
  data() {
    return {
      balance: 0
    }
  },
  created() {
    this.getPersonalBalance()
  },
  methods: {
    ...mapActions(['GetBalance']),
    
    getPersonalBalance() {
      this.GetBalance({id: this.getUserInfo().uid, vm: this})
        .then((data) => {
          this.balance = data.current_commission
        })
        .catch(() => {
          this.balance = '-'
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.balance {
  width: 100%;
  height: 50px;
  line-height: 50px;
  .tit {
    font-family: PingFangSC-Regular;
    display: inline-block;
    width: 145px;
    font-size: 16px;
    color: #333;
    line-height: 50px;
    font-weight: 500; 
  }
  .desc {
    font-family: PingFangSC-Semibold;
    display: inline-block;
    font-size: 28px;
    color: #FFA029;
    text-align: center;
    padding: 0 5px;
  }
}
</style>


