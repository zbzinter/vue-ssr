<template>
  <div
    id="giftDetail"
    class="gift-detail"
    :style="{left: left + 'px'}"
  >
    <div class="detail-inner">
      <div class="top clearfix">
        <div
          id="effectImage"
          class="big-img"
        />
        <div class="con">
          <h2>{{ curGift.gift_name }}</h2>
          <div class="diamond">
            <img
              src="../../../assets/live/icon-new-diamond.png"
              alt=""
            >
            <span>{{ curGift.gift_price }}钻石</span>
          </div>
        </div>
      </div>
      <!-- 小礼物 -->
      <div
        v-if="curGift.gift_type_id === 1"
        class="def-number"
      >
        <ul class="clearfix">
          <li
            v-for="item in defNumber"
            :key="item.id"
            :class="{cur: item.id === curSelectId}"
            @click="selectDefNumber(item)"
          >
            {{ item.value }}
          </li>
        </ul>
      </div>
      <div
        v-if="curGift.gift_type_id === 1"
        class="even-bottom clearfix"
      >
        <div class="fl">
          <img
            src="../../../assets/live/icon-new-diamond.png"
            alt=""
          >
          <span>{{ total }}钻石</span>
        </div>
        <div class="fr">
          <InputNumber
            v-model="giftInput"
            class="inputBox"
            :max="9999"
            :min="1"
            :step="1"
            :precision="0"
            placeholder="输入数量"
            @on-focus="inputFocus"
          />
          <div
            class="btn"
            @click="submit"
          >
            发送
          </div>
        </div>
      </div>
      <!-- 大礼物 -->
      <div
        v-else
        class="even-bottom clearfix"
      >
        <div
          class="btn big-btn"
          @click="submit"
        >
          发送
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import { InputNumber } from 'iview'
import SVGA from 'svgaplayerweb'
import { autoUrlHttp } from '@utils/utils'
import liveMixins from '../../../mixins/live'
let giftTimer = null

export default {
  components: {
    InputNumber
  },
  mixins: [liveMixins],
  props: {
    curGift: {
      type: Object,
      default: () => {}
    },
    left: {
      type: Number,
      default: 0
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
      // 输入的数量
      giftInput: 1,
      // 当前选择默认数量的id
      curSelectId: 0,
      // 默认数量列表
      defNumber: [
        {
          id: 1,
          value: 88,
        },
        {
          id: 2,
          value: 100,
        },
        {
          id: 3,
          value: 520,
        },
        {
          id: 4,
          value: 666,
        },
        {
          id: 5,
          value: 1314,
        },
      ]
    }
  },
  computed: {
    total() {
      return this.curGift.gift_price * (this.giftInput || 0)
    }
  },
  watch: {
    curGift: {
      handler: function() {
        this.init()
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  destroyed(){
    clearTimeout(giftTimer)
  },
  methods: {
    ...mapActions(['G_GetMemberInfo']),
    init() {
      clearTimeout(giftTimer)
      giftTimer = setTimeout(() => {
        this.startSvgn()
      }, 300)
    },
    startSvgn() {
      var player = new SVGA.Player('#effectImage')
      var parser = new SVGA.Parser('#effectImage') // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
      parser.load(autoUrlHttp(this.curGift.gift_effect_image), videoItem => {
        player.loops = 1
        player.clearsAfterStop = false
        player.setVideoItem(videoItem)
        player.startAnimation()
      })
    },
    selectDefNumber(item) {
      this.curSelectId = item.id
      this.giftInput = item.value
    },
    inputFocus() {
      this.curSelectId = null
    },
    submit() {
      // 判断登录
      const userInfo = localStorage.getItem('userInfo')
      if(!localStorage.getItem('token') || !userInfo || userInfo === '{}') {
        this.G_SetLogin(true)
        return
      }
      // 数量, 小礼物就取当前输入的数量，大礼物默认1 不可输入
      const _count = this.curGift.gift_type_id !== 1 ? 1 : this.giftInput
      this.$post('v0.3/gifts/send', {
        apiType: 'anchor',
        body: {
          room_id: this.$route.query.roomId,
          gift_id: this.curGift.gift_id,
          gift_count: _count,
          receive_uid: (this.anchorInfo.anchor || {}).uid,
          send_uid: this.commUserInfo.uid,
        },
      }).then(res => {
        const { code } = res
        if(code === 200) {
          // 显示礼物
          this.localShow(_count)
          this.G_GetMemberInfo({uid: this.getUserInfo().uid})
        } else if (code === 15001) {
          // 砖石不足，弹出充值框
          this.$parent.toggleRechargeModal(_count * this.curGift.gift_price)
        } else {
          this.$tip(res.msg)
        }
      })
    },
    // 本地展示礼物
    localShow(_count) {
      // 切换到聊天室
      this.$store.commit('setChatBoxTab',  2)
      // 组装礼物数据。本地展示
      const _giftObj = {
        ...this.curGift,
        send_uid: this.commUserInfo.uid,
        send_nickname: this.commUserInfo.nickName,
        send_user_img: this.commUserInfo.img || this.defaultImg.avatar,
        receive_uid: (this.anchorInfo.anchor || {}).uid,
        receive_nickname: (this.anchorInfo.anchor || {}).nickname,
        receive_user_img: (this.anchorInfo.anchor || {}).user_img,
        gift_count: _count,
      }
      // 添加礼物 添加到最后一个
      // 判断是大礼物还是小礼物
      if(this.curGift.gift_type_id !== 1) {
        this.$store.commit('addBigGifts', _giftObj)
        this.startBigGift()
      } else {
        // 小礼物,
        this.$store.commit('addSmallGifts', _giftObj)
        this.startSmallGift()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.gift-detail {
  width: 288px;
  position: absolute;
  left: 0;
  bottom: 100%;
  z-index: 6;
  padding-bottom: 18px;
  .detail-inner {
    position: relative;
    padding: 0 20px;
    border-radius: 12px;
    background: #FEFCEF;
    border: 1px solid #F5B165;
    &:after {
      content: "";
      width: 14px;
      height: 12px;
      position: absolute;
      left: 70px;
      top: 100%;
      background: url(../../../assets/live/icon-gift-detail-arrow.png) no-repeat center top / 100%;
    }
  }
  .top {
    padding-top: 15px;
    .big-img {
      width: 75px;
      height: 75px;
      float: left;
      background: #FFFFFF;
      border: 1px solid #F5AA58;
      border-radius: 4px;
    }
    .con {
      margin-left: 90px;
      h2 {
        font-size: 16px;
        color: #895727;
        line-height: 22px;
        margin-bottom: 6px;
      }
      .diamond {
        color: #F5AA58;
        img {
          height: 16px;
          vertical-align: middle;
          margin-top: -3px;
        }
      }
    }
  }
  .def-number {
    li {
      float: left;
      width: 40px;
      color: #895727;
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
      padding: 6px 0;
      margin: 12px 10px 0 0;
      text-align: center;
      background: #FEF7D3;
      border: 1px solid #F5AA58;
      border-radius: 4px;
      &:last-child {
        margin-right: 0;
      }
      &.cur {
        color: #fff;
        background: #F5AA58;
        border: 1px solid #F5AA58;
      }
    }
  }
  .even-bottom {
    padding: 12px 0;
    margin-top: 12px;
    border-top: 2px solid #f5aa58;
    font-size: 12px;
    .fl {
      img {
        height: 16px;
        vertical-align: middle;
        margin-top: -3px;
      }
    }
    .inputBox {
      width: 76px;
      height: 24px;
      line-height: 24px;
      background: #FEFCEF;
      float: left;
      border: 1px solid #F5AA58;
      border-radius: 4px;
      box-shadow: none;
      /deep/ .ivu-input-number-handler-wrap {
        display: none;
      }
      /deep/ .ivu-input-number-input {
        outline: none;
        border: none;
        float: left;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        color: #895727;
      }
    }
    .btn {
      float: left;
      width: 40px;
      text-align: center;
      margin-left: 12px;
      color: #fff;
      line-height: 1;
      padding: 6px 0;
      cursor: pointer;
      background: #F5AA58;
      border-radius: 4px;
      &.big-btn {
        width: 100px;
        margin: 0 auto;
        float: none;
      }
    }
  }
}
</style>