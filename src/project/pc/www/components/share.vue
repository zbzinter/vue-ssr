<template>
  <div class="share">
    <div class="big-title">
      呼唤小伙伴前来围观吧
    </div>
    <ul class="list">
      <li
        class="item"
        @click="qq"
      >
        <i class="iconfont qq iconcx-dj" />
      </li>
      <li
        class="item"
        @click="weibo"
      >
        <i class="iconfont weibo iconcr_dj" />
      </li>
      <li @click="qzone">
        <i class="iconfont qzone iconcu_dj" />
      </li>
    </ul>
    <div class="sub-title">
      直播间地址
    </div>
    <div class="url-content">
      <input
        v-model="url"
        type="text"
      >
      <div
        class="btn copy-btn"
        :data-clipboard-text="url"
        @click="handleClipboardHelper('.copy-btn')"
      >
        复制链接
      </div>
    </div>
  </div>
</template>
<script>
import Clipboard from 'clipboard'
export default {
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      // 分享的标题
      title: '',
      // 分享的内容
      content: '',
      // 分享的描述
      description: '',
      // 来源
      site: '球会体育',
      // 封面图片
      pic: '',
      // 分享的链接地址
      url: ''
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.title = this.data.title
      this.content = this.data.title
      this.description = this.data.title
      this.pic = this.data.room_img
      this.url = window.location.href
    },
    // QQ空间分享
    qzone() {
      var _shareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?'
      _shareUrl += 'url=' + encodeURIComponent(this.url)
      _shareUrl += '&desc=' + encodeURIComponent(this.content) //参数desc设置分享的描述，可选参数
      _shareUrl += '&title=' + encodeURIComponent(this.title) //参数title设置分享标题，可选参数
      _shareUrl += '&site=' + encodeURIComponent(this.site) //参数site设置分享来源，可选参数
      _shareUrl += '&pics=' + encodeURIComponent(this.pic) //参数pics设置分享图片的路径，多张图片以＂|＂隔开，可选参数
      this.jump(_shareUrl)
    },
    // 分享到QQ
    qq() {
      var _shareUrl = 'https://connect.qq.com/widget/shareqq/index.html?'
      _shareUrl += 'url=' + encodeURIComponent(this.url)
      _shareUrl += '&title=' + encodeURIComponent(this.title)
      _shareUrl += '&pics=' + encodeURIComponent(this.pic)
      _shareUrl += '&desc=' + encodeURIComponent(this.description)
      _shareUrl += '&source=' + encodeURIComponent(this.site)
      this.jump(_shareUrl)
    },
    // 新浪微博
    weibo() {
      var _shareUrl = 'http://service.weibo.com/share/share.php?'
      _shareUrl += 'url=' + encodeURIComponent(this.url)
      _shareUrl += '&title=' + encodeURIComponent(this.title) //参数title设置分享标题，可选参数
      _shareUrl += '&pic=' + encodeURIComponent(this.pic) //参数pics设置分享图片的路径，多张图片以＂|＂隔开，可选参数
      _shareUrl += '&appkey=' + encodeURIComponent('879060799')
      this.jump(_shareUrl)
    },
    // 跳转
    jump(url) {
      //打开一个新的页面
      var winRef = window.open('', '_blank') 
      function loc() {
        //改变页面的 location
        winRef.location = url
      }
      //这个等待很重要，如果不等待的话将无法实现
      setTimeout(loc(), 800)
    },
    handleClipboardHelper(classParam) {
      let _this = this
      const cliboardText = new Clipboard(classParam)
      cliboardText.on('success', function(e) {
        console.info('Text:', e.text)
        _this.$success('复制成功')
        e.clearSelection()
      })

      cliboardText.on('error', function() {
        _this.$error('不支持复制，请手动复制')
      })
    },
  }
}
</script>
<style lang="postcss" scoped>
.share {
  width: 300px;
  .big-title {
    font-size: 16px;
    padding-top: 10px;
  }
  .list {
    padding: 15px 0;
    overflow: hidden;
    li {
      width: 33.33%;
      float: left;
      text-align: center;
      .iconfont {
        cursor: pointer;
        font-size: 42px;
        &.qzone {
          color: #eebb40;
        }
        &.weibo {
          color: #e98180;
        }
        &.qq {
          color: #6ca3d7;
        }
      }
    }
  }
  .sub-title {
    font-size: 14px;
    padding: 10px 0;
    border-top: 1px solid #f1f1f1;
  }
  .url-content {
    overflow: hidden;
    padding-bottom: 10px;
    input {
      width: 220px;
      padding: 0 10px;
      height: 30px;
      border-radius: 4px;
      float: left;
      background: #eee;
    }
    .btn {
      height: 30px;
      float: right;
      cursor: pointer;
      color: #fff;
      padding: 0 10px;
      border-radius: 4px;
      line-height: 30px;
      background: #3683FF;
    }
  }
}
</style>