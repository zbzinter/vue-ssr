<template>
  <div
    class="anchor-info"
  >
    <div class="anchor">
      <DefaultImg :src="(anchorInfo.anchor || {}).user_img" />
    </div>
    <div class="info-box">
      <div class="top clearfix">
        <b class="fl title ellipsis">{{ anchorInfo.title }}</b>
        <span
          class="fl report"
          @click="inform"
        >举报房间</span>
      </div>
      <div class="bottom clearfix">
        <div class="fl des ellipsis">
          {{ (anchorInfo.anchor || {}).nickname }}
        </div>
        <div class="fl id ellipsis">
          直播间ID：{{ (anchorInfo.anchor || {}).room_id }}
        </div>
        <div class="fl user">
          <i class="iconfont iconcc_ee" /><span class="txt">{{ anchorInfo.heat }}</span>
        </div>
        <Poptip
          trigger="hover"
          theme="light"
          placement="bottom"
          class="fl"
        >
          <img
            slot="content"
            class="qr-code-img"
            src="../../../assets/home/download-qrcode.png"
          >
          <div class="fl qr-code">
            <i class="iconfont iconicon_phone" /><span class="txt">手机观看</span>
          </div>
        </Poptip>
      </div>
    </div>
    <div class="opertion">
      <Poptip
        trigger="hover"
        theme="light"
        placement="bottom"
      >
        <Share
          slot="content"
          :data="anchorInfo"
        />
        <div class="fl share">
          <i class="iconfont iconcd_ee" /><span class="txt">分享</span>
        </div>
      </Poptip>
      <div
        class="fr follow"
        @click="follow()"
      >
        {{ isFollow ? '取消关注' : '+ 关注' }}
      </div>
    </div>
  </div>
</template>
<script>
import { Poptip } from 'iview'
import DefaultImg from '@src/components/DefaultImg'
import Share from '@src/components/share'
export default {
  components: {
    Poptip,
    DefaultImg,
    Share,
  },
  props: {
    anchorInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      // 关注状态
      isFollow: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.isFollow = (this.anchorInfo.anchor || {}).is_attention
    },
    // 举报房间
    inform() {
      const routerData = this.$router.resolve({
        path: '/live/inform',
        query: {
          roomId: this.$route.query.roomId,
          accUid: (this.anchorInfo.anchor || {}).uid
        }
      })
      window.open(routerData.href, '_blank')
    },
    // 关注
    follow() {
      if(!localStorage.getItem('token')) {
        this.G_SetLogin(true)
        return
      }
      // 已关注，取消关注
      const params = {
        attention_uid: (this.anchorInfo.anchor || {}).uid,
        uid: this.getUserInfo().uid
      }
      if(this.isFollow) {
        this.$del('v0.1/attentions', {
          apiType: 'anchor',
          body: {
            ...params
          }
        }).then((res) => {
          const {code, msg} = res
          if(code === 200) {
            this.$tip('取关成功')
            this.isFollow = false
          } else {
            this.$tip(msg)
          }
        })
      } else {
        this.$put('v0.1/attentions', {
          apiType: 'anchor',
          body: {
            ...params
          }
        }).then((res) => {
          const {code, msg} = res
          if(code === 200) {
            this.$tip('关注成功')
            this.isFollow = true
          } else {
            this.$tip(msg)
          }
        })
      }
    }
  }
}
</script>
<style lang="postcss" scoped>
.anchor-info {
  height: 90px;
  background: #fff;
  .anchor {
    float: left;
    margin: 13px 17px 0 22px;
    img {
      width: 64px;
      height: 64px;
      border-radius: 50%;
    }
  }
  .info-box {
    padding-top: 20px;
    float: left;
    .top {
      height: 26px;
      line-height: 26px;
      .report {
        cursor: pointer;
      }
      b {
        max-width: 500px;
        font-size: 18px;
        color: #333;
        margin-right: 10px;
      }
      span {
        margin-left: 15px;
        font-size: 12px;
        color: #f5aa58;
      }
    }
    .bottom {
      padding-top: 8px;
      font-size: 12px;
      color: #666;
      vertical-align: middle;
      .des {
        max-width: 100px;
        margin-right: 20px;
      }
      .user,
      .qr-code,
      .share {
        margin-left: 30px;
        .iconfont {
          color: #666;
          font-size: 14px;
          margin-right: 4px;
          float: left;
        }
        span.txt {
          float: left;
        }
      }
      .qr-code-img {
        display: block;
        width: 150px;
        height: 150px;
        margin: 5px 0;
      }
    }
  }
  .opertion {
    float: right;
    padding: 34px 20px 0 0;
    .follow {
      padding: 0 14px;
      color: #fff;
      margin-left: 27px;
      cursor: pointer;
      background: #E15756;
      border-radius: 18px;
    }
    .share {
      .iconfont {
        color: #666;
        font-size: 14px;
        margin-right: 4px;
        float: left;
        margin-top: 1px;
      }
      span.txt {
        float: left;
      }
    }
  }
}
</style>