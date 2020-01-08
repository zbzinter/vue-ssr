<template>
  <div class="gold-wrap">
    <div class="big-title">
      用钻石来兑换金币（兑换比例：1钻石=10金币) 金币可以用于道具、红包、竞猜
    </div>
    <div class="content">
      <!-- 默认金币列表 -->
      <div class="defulat-list clearfix">
        <div
          v-for="(item, index) in goldList"
          :key="index"
          class="gold-item"
          :class="{cur: item.id == selectedGoldItem.id}"
          @click="selectGold(item)"
        >
          <div class="inner">
            <div class="top">
              <i class="iconfont icondt_gj" />
              <span class="num">{{ parseInt(item.gold) }}</span>
              <span class="unit">金币</span>
            </div>
            <div class="bottom">
              <span>{{ parseInt(item.diamond) }}钻石</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 其他金币 -->
      <div
        class="other-golds" 
        :class="inputFocus ? 'focus' : ''"
      >
        <InputNumber
          v-model="otherGold"
          :step="10"
          :max="maxGold"
          :precision="0"
          placeholder="请输入其他金币"
          @on-focus="goldFocus"
          @on-blur="goldBlur"
          @on-change="goldChange"
        />
        <span class="unit">金币</span>
      </div>

      <!-- 金币详情 -->
      <div class="pay-money">
        <span class="title">兑换详情:</span>
        <span class="price">{{ totalGold || 0 }}<span class="unit">金币</span><span class="des">(1钻石=10金币)</span></span>
      </div>
      <div class="pay-money">
        <span class="title">应付钻石:</span>
        <span class="price">{{ totalDiamond || 0 }}<span class="unit">钻石</span></span>
      </div>

      <!-- 兑换 -->
      <Button
        class="go-pay"
        :loading="loading"
        @click="goPay()"
      >
        确定兑换
      </Button>
    </div>
  </div>
</template>
<script>
import { InputNumber, Button } from 'iview'
export default {
  components: {
    InputNumber,
    Button
  },
  data() {
    return {
      // 选择金币的方式 1：套餐，2：自定义输入
      selectType: 1,
      // 默认金币列表
      goldList: [],
      // 手动输入的金币数量
      otherGold: null,
      // 最大输入限制
      maxGold: 100000000,
      // 选中的金币item-默认第一个
      selectedGoldItem: {},
      // 总金币
      totalGold: null,
      // 总钻石
      totalDiamond: null,
      // 支付loading
      loading: false,
      // input 动态样式
      inputFocus: false,
      // input 输入的金币数量
      inputGold: 0,
    }
  },
  created() {
    this.getGoldsDesc()
  },
  methods: {
    // 获取预置金币列表
    getGoldsDesc() {
      this.$get('/api/v1/user.php?do=exchangepackage', {
        apiType: 'shop',
        body: {
          platform: 'web'
        }
      }).then(res => {
        const { code, data } = res
        if (code == '200') {
          this.goldList = data.exchange || []
          this.selectGold(this.goldList[0] || {})
        }
      })
    },
    // 选择金币
    selectGold(data) {
      // 清空手输金币
      this.otherGold = null
      // 选择类型
      this.selectType = 1
      // 切换选择的金币item
      this.selectedGoldItem = data
      // 总金额
      this.total(data.gold)
    },
    // 手动输入 focus
    goldFocus() {
      // 选择类型
      this.selectType = 2
      // 清空输入内容
      this.otherGold = null
      // 清空套餐选择
      this.selectedGoldItem = {}
      // 计算总价
      this.total(this.otherGold)
      // 加class
      this.inputFocus = true
    },
    goldBlur() {
      this.inputFocus = false
    },
    // 手动输入 change
    goldChange(val) {
      this.total(val)
    },
    // 计算金币和钻石
    total(gold) {
      gold = gold || 0
      this.inputGold = gold
      // 取10的整倍数
      gold = gold - gold%10
      this.totalGold = gold
      this.totalDiamond = gold/10
    },
    // 支付
    goPay() {
      let params = {}
      // 判断是套餐还是手动输入
      if(this.selectType === 1) {
        params = {
          exchange_id: this.selectedGoldItem.id,
        }
      } else {
        // 判断是否输入的是10的倍数
        if(this.inputGold%10) {
          this.$tip('请输入10的倍数')
          return
        }
        params = {
          gold: this.totalGold,
        }
      }

      // loading
      this.loading = true
      this.$post('/api/v1/user.php?do=exchange', {
        apiType: 'shop',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: {
          user_id: this.getUserInfo().uid,
          // user_id: 1789131241426944,
          platform: 'web',
          ...params
        },
      }).then(res => {
        this.loading = false
        if (res.code == '200') {
          this.$success('兑换成功')
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        }
      }).catch(() => {
        this.loading = false
      })
    },
  }
}
</script>
<style lang="postcss" scoped>
.gold-wrap {
  .big-title {
    font-size: 14px;
    color: #333333;
  }
  .defulat-list {
    .gold-item {
      width: 160px;
      height: 106px;
      float: left;
      margin: 16px 22px 0 0;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.2s;
      position: relative;
      &:nth-child(5n) {
        margin-right: 0;
      }
      &:hover {
        .inner {
          border-color: #fbbe6b;
        }
      }
      &.cur {
        transform: scale(1.02) translateY(-2px);
        box-shadow: 0 10px 15px 0 rgba(0,0,0,0.15);
        .inner {
          border: 2px solid #fbbe6b;
        }
      }
      .inner {
        width: 100%;
        display: block;
        padding: 0 12px;
        border-radius: 8px;
        border: 1px solid #ddd;
        position: absolute;
        left: 0;
        top: 0;
      }
      .top {
        height: 60px;
        text-align: center;
        padding-top: 20px;
        .iconfont {
          font-size: 30px;
          color: #FBBE6B;
        }
        .num {
          font-size: 22px;
          color: #333333;
        }
        .unit {
          font-size: 12px;
          color: #999999;
        }
      }
      .bottom {
        height: 44px;
        line-height: 44px;
        font-size: 14px;
        color: #333333;
        text-align: center;
        border-top: 1px solid #F0F0F0;
      }
    }
  }
  .other-golds {
    width: 240px;
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-top: 30px;
    position: relative;
    &.focus {
      border-color: #fbbe6b;
      .unit {
        color: #fbbe6b;
      }
    }
    >>>.ivu-input-number {
      float: left;
      width: 100%;
      padding-top: 1px;
      border: none;
      box-shadow: none;
      input {
        outline: none;
        border: none;
        font-size: 12px;
        color: #333;
      }
    }
    .unit {
      position: absolute;
      right: 0;
      top: 0;
      color: #333;
      padding: 0 10px;
      background: #fff;
    }
  }
  .mode-of-pay {
    height: 32px;
    line-height: 32px;
    margin-top: 40px;
    .sub {
      font-size: 14px;
      color: #333333;
      float: left;
    }
    .btn {
      border-radius: 4px;
      cursor: pointer;
      margin-left: 24px;
      height: 32px;
      padding: 0 14px 0 10px;
      border: 1px solid #CCCCCC;
      &.cur {
        .iconfont,span {
          color: #fff;
        }
      }
      .iconfont {
        font-size: 18px;
        float: left;
        padding-right: 8px;
        color: #41B035;
      }
      span {
        float: left;
      }
    }
    .alipay .iconfont {
      color: #3683FF;
    }
    .alipay.cur {
      background: #3683FF;
      border-color: #3683FF;
    }
    .wx.cur {
      background: #41B035;
      border-color: #41B035;
    }
  }
  .pay-money {
    margin: 35px 0 25px 0;
    font-size: 14px;
    color: #333333;
    .price {
      margin-left: 20px;
      font-size: 30px;
      font-weight: bold; 
      color: #ff9900;
      small {
        font-size: 20px;
      }
    }
    .unit {
      font-size: 16px;
      padding: 0 12px 0 5px;
      font-weight: normal;
      color: #333;
    }
    .des {
      font-size: 14px;
      color: #999999;
      font-weight: normal;
    }
  }
  .go-pay {
    width: 270px;
    line-height: 44px;
    line-height: 44px;
    text-align: center;
    border-radius: 4px;
    font-size: 16px;
    color: #333333;
    padding: 0;
    cursor: pointer;
    font-weight: bold;
    box-shadow: none;
    border: none;
    background: linear-gradient(to right, #FFD235 , #FFE391);
  }
}

</style>


