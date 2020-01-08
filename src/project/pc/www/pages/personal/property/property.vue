<template>
  <div class="property">
    <div
      class="content"
    >
      <p class="title">
        我的财产
      </p>
      <div class="mb">
        <p class="tit">
          我的财产
        </p>
        <div class="item diamond clearfix">
          <img
            class="img fl"
            width="50px"
            src="../../../assets/personal/diamond.png"
            alt=""
          >
          <div class="iblock fl desc">
            <span class="block">钻石</span>
            <span class="block">{{ commMemberInfo.diamond }} 个</span>
          </div>

          <div class="iblock fr details">
            <span
              class="block details-diamond"
              @click="recharge"
            >充值 </span>

            <span
              class="block"
              @click="handerDetails(0)"
            >明细 <i class="iconfont iconbq_ee" /></span>
          </div>
        </div>
        <div class="item beans clearfix">
          <img
            class="img fl"
            width="50px"
            src="../../../assets/personal/beans.png"
            alt=""
          >
          <div class="iblock fl desc">
            <span class="block">球豆</span>
            <span class="block">{{ commMemberInfo.ball_gold }} 个</span>
          </div>

          <div class="iblock fr details">
            <span
              v-show="isWithdrawFlag"
              class="block"
              :class="isWithdrawFlag === 1 ? 'details-beans' : ''"
              @click="exchange(1)"
            >
              提现
            </span>
            <span
              v-show="!isWithdrawFlag"
              class="block"
            />
            <span
              class="block"
              @click="handerDetails(1)"
            >明细 <i class="iconfont iconbq_ee" /></span>
          </div>
        </div>
      </div>
      <div>
        <p class="tit">
          我的收益
        </p>
        <ul>
          <li
            v-for="(item, index) in earnings"
            :key="index"
            class="clearfix"
          >
            <p class="fl">
              <span>{{ item.name }}：</span>
              <span>上个月收入 <span class="warn">{{ item.money }}</span>元，累计获得 <span class="warn">{{ item.total || '-' }}</span>元</span>
            </p>
            <div class="fr btn">
              <span
                class=""
                @click="exchange(item.exchange)"
              >{{ item.operaName }}</span>
              <span
                class="detail"
                @click="handerDetails(item.index)"
              >明细</span>
            </div>
          </li>
          <li
            v-if="isAnchor"
            class="clearfix"
          >
            <p class="fl">
              <span>主播收入</span>
            </p>
            <div class="fr btn">
              <span />
              <span
                class="detail"
                @click="exchange(2)"
              >明细</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <Recharge ref="recharge" />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import Recharge from '@src/components/Recharge'

export default {
  components: {
    Recharge,
  },

  data() {
    return {
      curTab: 1,
      flag: 1,
      detailsType: -1,
      isAnchor: false,
      earnings: [
        {
          name: '我的收益',
          money: '-',
          total: '-',
          exchange: 0,
          details: '',
          operaName: '兑换',
          index: 3,
        },
        {
          name: '球豆收益',
          money: '-',
          total: '-',
          exchange: 1,
          details: '',
          operaName: '提现',
          index: 1,
        }
      ],
      isWithdrawFlag: 0,
    }
  },
  mounted() {
    this.isWithdraw()
    this.init()
  },
  methods: {
    ...mapActions(['GetBalance']),

    async isWithdraw() {
      try {
        const {data: {is_open}} = await this.$get('v2/members/beans/open', {
          apiType: 'goShop'
        })
        this.isWithdrawFlag = is_open
      } catch(e) {
        // loop
      }

      if (this.isWithdrawFlag === 0) {
        this.earnings[1].operaName = ''
      }
    },

    init() {
      this.isAnchor = sessionStorage.getItem('roomId') ? true : false
      this.GetBalance({id: this.getUserInfo().uid, vm: this})
        .then((data) => {
          this.earnings[0].total = data.total_commission 
          this.earnings[0].money = data.last_month_commission 
        })
    },
    
    handerDetails(index) {
      let obj = {}
      if (index === 3) {
        obj = {
          path: '/personal/income',
          query: {
            tab: 3
          }
        }
      } else {
        obj = {
          path: '/personal/property/details?flag='+index,
        }
      }
      this.$router.push(obj)
    },

    exchange(index) {
      if ([0,2].includes(index)) {
        this.$router.push({
          path: '/personal/income',
          query: {
            tab: index === 0 ? 1 : 2
          }
        })
      } else {
        if (this.isWithdrawFlag === 0) {
          return 
        }
        this.$router.push({
          path: '/personal/property/withdraw',
        })
      }
    },

    details(param) {
      this.detailsType = param
    },

    recharge() {
      this.$refs.recharge.isShow()
    },

  }
}
</script>
<style lang="scss" scoped>

.content {
  padding:0 40px;
  .title {
    margin-left: -40px;
    padding-left: 40px;
    padding-bottom: 18px;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #3683FF;
    letter-spacing: 0;
    border-bottom: 1px solid #F0F0F0;
  }
  ul > li {
    height: 44px;
    vertical-align: middle;
    line-height: 44px;
    border-top: 1px solid #F0F0F0;
    &:last-child {
      border-bottom: 1px solid #F0F0F0;
    }
  }
  
  .tit {
    font-family: PingFangSC-Semibold;
    font-size: 14px;
    margin-bottom: 19px;
    color: #333333;
    font-weight: 700;
    letter-spacing: 0;
    &:first-child {
      padding-top: 33px;
    }
  }
  .mb {
    margin-bottom: 45px;
  }
  .item {
    display: inline-block;
    width: 240px;
    height: 84px;
  }
  .small {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #FFFFFF;
    letter-spacing: 0;
  }
  .details-common {
    display: inline-block;
    font-family: PingFangSC-Regular;
    text-align: center;
    font-size: 12px;
    letter-spacing: 0;
    border-radius: 4px;
    width: 48px;
    height: 20px;
    line-height: 20px;
    cursor: pointer;
  }
  .desc {
    padding-top: 16px;
    padding-left: 13px;
    span {
      &:first-child {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #FFFFFF;
        letter-spacing: 0;
        padding-bottom: 5px;
      }
      &:last-child {
        @extend .small;
      }
    }
  }
  .details {
    padding-top: 16px;
    padding-right: 17px;
    &-diamond {
      @extend .details-common;
      color: #4B99FF;
      background: #E0EDFF;
      &:hover {
        background: #FFFFFF;
      }
    }
    &-beans {
      @extend .details-common;
      color: #F8B900;
      background: #FEFCF6;
      &:hover {
        background: #FFFFFF;
      }
    }
    span {
      height: 20px;
      cursor: pointer;
      &:last-child {
        @extend .small;
        padding-left: 7px;
        margin-top: 7px;
      }
    }
  }
  
  .img {
    display: inline;
    margin:17px 0 0 13px;
  }
  .diamond {
    margin-right: 56px;
    background: url(../../../assets/personal/diamond-bg.png) center center
    no-repeat;
  }
  .beans {
     background: url(../../../assets/personal/beans-bg.png) center center
    no-repeat;
  }
  .cont {
    height: 84px;
  }
  .iconbq_ee {
    color: #fff;
    font-size: 10px;
  }

  .btn {
    span {
      &:first-child {
        font-family: PingFangSC-Regular;
        display: inline-block;
        font-size: 12px;
        color: #fff;
        width: 40px;
        line-height: 21px;
        text-align: center;
        background: #FFA029;
        border-radius: 4px;
        letter-spacing: 0;
        margin-right: 30px;
        cursor: pointer;
      }
      &:last-child { 
        font-size: 14px;
        color: #3683FF;
      }
    }
    .detail {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      cursor: pointer;
    }
  }
}
.warn {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #FFA029;
  letter-spacing: 0;
  line-height: 20px;
}

</style>


