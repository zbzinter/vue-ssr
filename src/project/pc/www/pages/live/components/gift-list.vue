<template>
  <div class="gift-wrap">
    <!-- 礼物列表 -->
    <div
      class="gift-main"
      @mouseleave="giftMouseout()"
    >
      <div
        v-if="giftList && giftList.length"
        id="giftList"
        class="gift-list"
      >
        <ul
          id="giftUl"
          class="giftUl"
          :style="{width: giftWidth * giftList.length + 'px'}"
        >
          <li
            v-for="(slide, index) in giftList"
            :key="index"
            :class="{cur: slide.gift_id === curGift.gift_id}"
            @mouseover="slideHover(slide, index)"
          >
            <img
              class="slide-img"
              :src="slide.gift_icon"
              alt=""
            >
          </li>
        </ul>
      </div>
      <!-- 左按钮 -->
      <div
        class="swiper-button swiper-button-prev"
        :class="{disabled: !isPrve}"
        @click="hanldeGift(1)"
      >
        <i class="iconfont icondf_eiFAA" />
      </div>
      <!-- 右按钮 -->
      <div
        class="swiper-button swiper-button-next"
        :class="{disabled: !isNext}"
        @click="hanldeGift(2)"
      >
        <i class="iconfont iconch_eiFAA" />
      </div>
      <!-- 礼物详情面板 -->
      <GiftDetail
        v-if="curGift && Object.keys(curGift).length"
        :cur-gift="curGift"
        :left="giftDetailLeft"
        :anchor-info="anchorInfo"
        @close="closeGiftDetail"
      />
    </div>
    <!-- 钻石 -->
    <div class="gold-main">
      <div class="gold-item">
        <img
          src="../../../assets/live/icon-new-diamond.png"
          alt=""
        >
        钻石: {{ commMemberInfo.diamond || 0 }}
      </div>
      <div
        class="btn"
        @click="jumpPage('/personal/property')"
      >
        充值
      </div>
    </div>

    <!-- 充值弹窗 -->
    <Recharge
      v-if="showRecharge"
      :reg-diamond="regDiamond"
      @showCommonRecharge="openCommonRecharge"
    />

    <!-- 个人中心的充值弹窗 -->
    <CommonRecharge
      ref="commonRecharge"
    />
  </div>
</template>
<script>
import anime from 'animejs'
import GiftDetail from './gift-detail'
import Recharge from './gift/recharge'
import CommonRecharge from '@src/components/Recharge'
export default {
  components: {
    GiftDetail,
    Recharge,
    CommonRecharge
  },
  props: {
    matchData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    anchorInfo: {
      type: Object,
      default: function() {
        return {}
      }
    },
  },
  data() {
    return {
      giftList: [],
      // 当前选择的礼物
      curGift: {},
      // 礼物框位置
      giftDetailLeft: 0,
      // 礼物框默认位置值（在第一个礼物的位置）
      defulatPosLeft: -58,
      // 总页数
      totalPage: 0,
      // 总条数
      totalSize: 0,
      // 每一个礼物间隔
      giftWidth: 42 + 10,
      // 每页多少个礼物
      everyPageSize: 10,
      // 当前页下标，从0开始
      curPage: 0,
      // 左边是否可以点击
      isPrve: false,
      // 右边是否可以点击
      isNext: true,
      // 显示充值框
      showRecharge: false,
      // 要充值的钻石
      regDiamond: 0,
      // 显示个人中心-充值框
      showCommonRecharge: true,
    }
  },
  created() {
    this.init()
  },
  mounted() {
    // 点击document 关闭弹窗
    document.addEventListener('click', e => {
      console.log('gift-list-click')
      const giftDetail = document.getElementById('giftDetail')
      const giftList = document.getElementById('giftList')
      if(giftDetail && !giftDetail.contains(e.target) && !giftList.contains(e.target)) {
        this.closeGiftDetail()
      }
    })
  },
  methods: {
    init() {
      this.$get('v2/gifts/list', {
        apiType: 'goShop',
        body: {
          type_id: this.anchorInfo.live_type_id || 1
        }
      }).then(res => {
        if(res.code === 200) {
          this.giftList = res.data || []
          // 总条数/总页数
          const _length = this.giftList.length
          this.totalSize = _length
          this.totalPage = Math.ceil(_length/this.everyPageSize) - 1
          if(this.totalPage < 1) {
            this.isNext = false
          }
        }
      })
    },
    jumpPage(path) {
      if(localStorage.getItem('token')) {
        this.$router.push(path)
      } else {
        this.G_SetLogin(true)
      }
    },
    // 显示充值框
    toggleRechargeModal(val) {
      this.regDiamond = val || 0
      this.showRecharge = !this.showRecharge
    },
    // 显示公共充值框
    openCommonRecharge() {
      this.showRecharge = false
      this.$refs.commonRecharge.isShow()
    },
    // 关闭礼物面板
    closeGiftDetail() {
      this.curGift = {}
    },
    giftMouseout() {
      this.curGift = {}
    },
    // 左右切换
    hanldeGift(type) {
      let swiperPage = this.curPage
      if(type === 1) {
        swiperPage --
        if(!this.isPrve) return
      } else {
        swiperPage ++
        if(!this.isNext) return
      }
      anime({
        targets: '#giftUl',
        left: - swiperPage * this.everyPageSize * this.giftWidth + 'px',
        autoplay: true,
        duration: 200,
        easing: 'linear',
        delay: 0,
        loop: false,
      })
      this.curPage = this.curPage + (type === 1 ? -1 : 1)
      this.isNext = this.curPage < this.totalPage
      this.isPrve = this.curPage > 0
    },
    // 鼠标移入礼物
    slideHover(item, index) {
      // 赋值礼物
      this.curGift = item || {}
      // 计算礼物面板位置
      let _index = index
      this.giftDetailLeft = (_index % this.everyPageSize) * this.giftWidth + this.defulatPosLeft
    }
  }
}
</script>
<style lang="postcss" scoped>
.gift-wrap {
  height: 103px;
  position: relative;
  background: #fff;
  .gift-main {
    width: 510px;
    height: 42px;
    float: right;
    margin: 17px 40px 0 0;
    position: relative;
    .swiper-button {
      width: 16px;
      height: 100%;
      font-size: 16px;
      background: none;
      &.disabled .iconfont{
        color: #ccc;
        cursor: default;
      }
      .iconfont {
        position: absolute;
        left: 50%;
        top: 50%;
        color: #f5aa59;
        transform: translate(-50%, -50%);
      }
    }
    .swiper-button-prev {
      left: -26px;
    }
    .swiper-button-next {
      right: -26px;
    }
    .gift-list {
      position: relative;
      height: 42px;
      overflow: hidden;
      .giftUl {
        position: absolute;
        left: 0;
        top: 0;
        li {
          width: 42px;
          height: 42px;
          cursor: pointer;
          float: left;
          margin-right: 10px;
          &.cur {
            .slide-img {
              border: 1px solid #F5AA58;
              border-radius: 4px;
            }
          }
          .slide-img {
            width: 42px;
            height: 42px;
            display: block;
          } 
        }
      }
    }
  }
  .gold-main {
    float: right;
    clear: both;
    margin: 10px 16px 0 0;
    .gold-item {
      float: left;
      line-height: 20px;
      margin-right: 16px;
      font-size: 12px;
      color: #333;
      img {
        height: 14px;
        vertical-align: middle;
        margin-top: -2px;
      }
    }
    .btn {
      float: left;
      color: #FC8E3E;
      padding: 3px 16px;
      font-size: 12px;
      line-height: 1;
      cursor: pointer;
      border: 1px solid #FC8E3E;
      border-radius: 2px;
    }
  }
}
</style>