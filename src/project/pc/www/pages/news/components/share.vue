<template>
  <div class="share-list fr">
    <span class="name fl">分享到：</span>
    <div class="icon">
      <i
        class="iconfont iconcr_dj fl"
        @click="shareToSinaWB"
      />
      <i
        class="iconfont iconcq_dj fl"
        @mouseenter="showHideQrCode(1)"
        @mouseleave="showHideQrCode(0)"
      />
      <i
        class="iconfont iconcu_dj fl"
        @click="shareToQzone"
      />
      <img
        src="../../../assets/news/ct_dj.png"
        alt=""
        class="icon-img fl"
        @click="shareToDouban"
      >
      <i
        class="iconfont iconcw_dj fl"
        @click="shareToTwitter"
      />
      <img
        src="../../../assets/news/cs_dj.png"
        alt=""
        class="icon-img fl"
        @click="shareToFacebook"
      >
    </div>
    <div
      v-show="downloadFlag"
      id="qrcode"
      ref="qrcode"
      class="download"
    />
  </div>
</template>

<script>

import QRCode from 'qrcodejs2'
export default {
  data() {
    return {
      title: '',
      source: '',
      sourceUrl: '',
      showcount: '',
      desc: '',
      summary: '',
      site: '',
      url: '',
      pic:require('../../../assets/logo2.png'),
      shareUrl: '',
      downloadFlag: false,
    }
  },
  mounted(){

    this.url=window.location.href
    this.setQrShare()
    if(this.pic.indexOf('http')!=-1){
      return false
    }else{
      this.pic=window.location.origin+this.pic
    }
  },
  methods: {
    setQrShare() {
      let origin=window.location.origin
      let hostName
      let host=['sit','dev','pro','uat']
      host.forEach(item=>{
        if(origin.indexOf(item)!=-1){
          hostName=`https://m.${item}.qiuhui.com`
        }else{
          hostName='https://m.qiuhui.com'
        }
      })
      let channelId=this.$route.params.channelId
      let articleId=this.$route.params.articleId
      let url=`${hostName}/news/detail?channelId=${channelId}&articleId=${articleId}`

      console.warn(url)
      let qrcode = new QRCode(this.$refs.qrcode, {
        width: 180, // 设置宽度，单位像素
        height:180, // 设置高度，单位像素
        text: url   // 设置二维码内容或跳转地址
      })

    },


    //分享至微信 css控制二维码隐藏和出现
    //分享到新浪微博
    shareToSinaWB(){
      this.shareUrl = 'http://v.t.sina.com.cn/share/share.php?'
      this.shareUrl += '&url='+ encodeURIComponent(this.url || document.location)
      this.shareUrl += '&title=' + encodeURIComponent(this.title || document.title)
      this.shareUrl += '&source=' + encodeURIComponent(this.source || '')
      this.shareUrl += '&sourceUrl=' + encodeURIComponent(this.sourceUrl || '')
      this.shareUrl += '&content=' + 'utf-8'
      this.shareUrl += '&pic=' + encodeURIComponent( this.pic || '')
      window.open(this.shareUrl,'_blank')
    },
    //分享到QQ空间
    shareToQzone(event){
      event.preventDefault()
      this.shareUrl = 'https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'
      this.shareUrl += 'url=' + encodeURIComponent(this.url || document.location)
      this.shareUrl += '&showcount=' + this.showcount || 0
      this.shareUrl += '&title=' + encodeURIComponent(this.title || document.title)
      this.shareUrl += '&site=' + encodeURIComponent(this.site || '')
      this.shareUrl += '&pics=' + encodeURIComponent(this.pic || '')
      window.open(this.shareUrl,'_blank')
    },

    //分享到豆瓣
    shareToDouban(){
      var shareUrl = 'https://shuo.douban.com/!service/share?'
      shareUrl += 'href=' + encodeURIComponent(this.url || location.href)    //分享的链接
      shareUrl += '&name=' + encodeURIComponent(this.title || document.title)    //分享的标题
      shareUrl += '&image=' + encodeURIComponent(this.pic || '')    //分享的图片
      window.open(shareUrl,'_blank')
    },

    //分享到qq
    shareToqq(event){
      event.preventDefault()
      let _shareUrl = 'https://connect.qq.com/widget/shareqq/iframe_index.html?'
      _shareUrl += 'url=' + encodeURIComponent(this.url||location.href)   //分享的链接
      _shareUrl += '&title=' + encodeURIComponent(this.title||document.title)     //分享的标题
      window.open(_shareUrl,'_blank')
    },
    shareToTwitter() {
      let shareUrl = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(this.title || document.title)
      shareUrl += '&url=' +  encodeURIComponent(this.url || location.href)
      // shareUrl += '&hashtags=' +  encodeURIComponent(this.url || location.href)
      window.open(shareUrl,'_blank')
    },

    shareToFacebook() {
      let shareUrl = 'https://www.facebook.com/sharer/sharer.php?href=' + window.location.href
      + 'utm_campaign=maleskine&utm_content=note&utm_medium=reader_share&utm_source=facebook'
      window.open(shareUrl,'_blank')
    },

    showHideQrCode(param) {
      this.downloadFlag = param ? true : false
    }

  }
}
</script>

<style lang="scss" scoped>
.iconfont {
  cursor: pointer;
  font-size: 20px;
  margin-right: 5px;
}
.iconcu_dj {
  color: #eebb40
}
.iconct_dj {
  color: #68c070;
}
.iconcr_dj {
  color: #e98180
}
.iconcw_dj {
  color: #52a7dd
}
.iconcs_dj {
 color: #4d72c5
}
.iconcq_dj {
   color: #7cd098;
   &:hover {
     .download {
       display: inline-block;
     }
   }
}
.name {
  display: inline-block;
}
.icon {
  display: inline-block;
}
.icon-img {
  width: 20px;
  height: 20px;
  display: inline-block;
  margin-top: 5px;
  margin-right: 5px;
  cursor: pointer;
}
.download {
  position: relative;
  /deep/ img {
    position: absolute;
    width: 180px;
    height: 180px;
    top: -220px;
    left: 0;
    display: inline-block;
  }
}

</style>
