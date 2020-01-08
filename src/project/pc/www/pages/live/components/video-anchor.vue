<template>
  <div class="video-anchor">
    <div
      id="player"
      class="video-inner"
    />
    <!-- 通告礼物 -->
    <div
      id="noticeTheGift"
      class="notice-the-gift"
    />
    <!-- 断线重连 -->
    <Dropped
      v-if="isDropped"
      :type="0"
    />
    <!-- 未开始 -->
    <NotStarted v-else-if="isNotStarted" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getDeviceOS, getNetworkType } from '@utils/utils'
import NotStarted from './not-started'
import Dropped from './dropped'
import { setTimeout, clearTimeout } from 'timers'
import 'jmfdplayer/dist/DPlayer.min.css'
let DPlayer = null
let videoLogTimer = null

export default {
  components: {
    NotStarted,
    Dropped
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
      // url参数
      query: {},
      // 是否未开播，暂停等，显示推荐主播
      isNotStarted: false,
      //主播掉线
      isDropped:false,
      // 是否有视频源
      hasVideoOrigin: false,
      // 视频配置
      videoPlayer: null,
      //重连次数
      reloadTimes: 0,
      //记录重载时的播放源
      defaultQuality:0,   
      videoOptions: {
        container: null,
        autoplay: true,
        live: true,
        theme: '#FADFA3',
        loop: false,
        lang: 'zh-cn',
        screenshot: true,
        hotkey: true,
        preload: 'auto',
        volume: 0.7,
        mutex: true,
        unlimited:true,
        buttons:{
          // fullWeb:{
          //   specialClass:'full-web-class',
          // },
          danmaku:{

          },
          play:{

          },
          volume:{

          },
          fullScreen:{

          }
        },
        video: {
          quality: [],
          defaultQuality: 0,
          hoverCssClass:''
        },
        danmaku:{
          bottom:'20px',  //弹幕距离视频区域上下距离设置
          top:'20px'
        },
        apiBackend: {
          read: function (endpoint) {
            // 设置加载完成
            endpoint.success()
            // callback()
          },
          send: function () {
            // 如果需要手动发送旦暮，在这里
            // callback()
          }
        },
        contextmenu: [],
      },
      // 视频源列表
      videoUrlObj: {},
      // 当前视频播放的地址
      curPlayUrl: '',
      // 统计卡顿次数
      carton_number: 0,
    }
  },
  computed: {
    ...mapGetters(['barrageMsg'])
  },
  watch: {
    barrageMsg: {
      handler (list) {
        this.pushMessage(list)
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getParams()
      this.loadingJs()
      // 组装视频源
      const videoSource = this.getVideoSource()
      this.videoOptions.video.quality = this.getVideoSource()

      // 存储当前播放地址
      if(videoSource && videoSource.length) {
        this.curPlayUrl = location.protocol + videoSource[0].url
      }
      
      // 如果没有视频源
      if(!this.videoOptions.video.quality || !this.videoOptions.video.quality.length) {
        this.hasVideoOrigin = false
        this.isNotStarted = true
        return
      } else {
        this.hasVideoOrigin = true
      }
      
      // 播放元素
      this.videoOptions.container = document.getElementById('player')
      this.videoPlayer = new DPlayer(this.videoOptions)
      this.videoError()
      this.videoPlayer.play()
      this.settingOpacity(1)

      // 周期统计直播卡顿次数
      this.periodicStat()

      setTimeout(() => {
        this.$nextTick(() => {
          let customerPlu =`<div class="customerBox_special">
            <div class="area">
              <p class="info_title">弹幕区域</p>
              <div class="dan_area margin_top17">
                <div class="rect_parent" data-type="0">
                  <div class="rect" >
                    <i class="iconfont iconicon_danmu_xia"></i>
                  </div>
                  <p class="area_choice">无</p>
                </div>
                <div class="rect_parent" data-type="1">
                  <div class="rect" >
                    <i class="iconfont iconicon_danmu"></i>
                  </div>
                  <p class="area_choice">半</p>
                </div>
                <div class="rect_parent active" data-type="2">
                  <div class="rect" >
                    <i class="iconfont iconicon_danmu_quan"></i>
                  </div>
                  <p class="area_choice">全</p>
                </div>
              </div>
            </div>
            <div class="fontSize margin_top14">
              <p class="info_title">弹幕字号</p>
              <div class="dan_area margin_top14">
                <div data-type="0" class="checkBox">
                  <span class="radiu" ></span>
                  <span>小</span>
                </div>
                <div  data-type="1" class="active checkBox">
                  <span class="radiu"></span>
                  <span class="active">中</span>
                </div>
                <div data-type="2" class="checkBox">
                  <span class="radiu"></span>
                  <span>大</span>
                </div>
              </div>
            </div>
            <div class="opacity margin_top14">
              <p class="info_title">弹幕透明</p>
              <div>
                <div id="wrapper">
                  <div id="fill"></div>
                  <div id="slider"></div>
                  <div id="silder_po">100%</div>
                </div>
              </div>
            </div>
          `
          let boxDom = document.querySelector('.dplayer-setting-box')
          let panelDom = document.querySelector('.dplayer-setting-origin-panel')
          this.addStyle(boxDom,{width:'176px',height:'216px',padding:0})
          panelDom.innerHTML= customerPlu
          document.querySelector('.dplayer-icon.dplayer-setting-icon').innerHTML = '<span><i class=\'iconfont icondanmu\'></i></span>'
          let that = this
          document.querySelector('.area').addEventListener('click',function(e){
            var objectDom = null
            if(e.target.className.indexOf('area_choice')!=-1 || e.target.parentElement.className.indexOf('rect') != -1){
              objectDom = e.target.className.indexOf('area_choice')!=-1? e.target.parentElement:e.target.parentElement.parentElement
              var domList = document.querySelectorAll('.rect_parent')
              for(var i=0;i<domList.length;i++){
                domList[i].classList.remove('active')
              }
              objectDom.classList.add('active') 
              switch(objectDom.getAttribute('data-type')){
              case '0':that.changeDanmakuStatus(false);break
              case '1':that.changeDanmakuStatus(true,true);break
              case '2':that.changeDanmakuStatus(true,false);break
              }
            }
            // if(e.target.parentElement.className.indexOf('rect') != -1){
            //   for(var i =0;i< document.querySelectorAll('.rect').length;i++){
            //     document.querySelectorAll('.rect')[i].classList.remove('active')
            //   }
            //   var parentNode = e.target.parentElement
            //   parentNode.classList.add('active')
            //   switch(parentNode.getAttribute('data-type')){
            //   case '0':that.changeDanmakuStatus(false);break
            //   case '1':that.changeDanmakuStatus(true,true);break
            //   case '2':that.changeDanmakuStatus(true,false);break
            //   }
            // }
          })
          document.querySelector('.fontSize').addEventListener('click',function(e){
            var parentNode = e.target.className.indexOf('checkBox')!=-1?e.target:e.target.parentElement
            if(parentNode.className.indexOf('checkBox') !=-1 ){
              that.setFontSize(parentNode.getAttribute('data-type'))
              let domList = document.querySelectorAll('.checkBox')
              for(var i =0;i<domList.length;i++){
                domList[i].classList.remove('active')
              }
              parentNode.classList.add('active')
            }
          })
          // 有视频源、才绘制弹幕
          this.videoPlayer.danmaku.half=false
          var slider = (function() {
            var init = function() {
              var wrapper = document.querySelector('#wrapper')
              var slider = document.querySelector('#slider')
              var fill = document.querySelector('#fill')
              var silder_po = document.querySelector('#silder_po')
              move(wrapper, slider, fill, silder_po)
            }
            var move = function(dom1, dom2, dom3, dom4) {
              dom1.addEventListener('click', function(e) {
                if (e.target !== dom2) {
                  if (e.offsetX > 132) {
                    dom2.style.left = '128px'
                    dom3.style.width = '128px'
                    dom4.style.left = '128px'
                  } else if (e.offsetX < 4) {
                    dom2.style.left = '0px'
                    dom3.style.width = '0px'
                    dom4.style.left = '0px'
                  } else {
                    dom2.style.left = e.offsetX - 4 + 'px'
                    dom3.style.width = e.offsetX - 4 + 'px'
                    dom4.style.left =  e.offsetX - 4 + 'px'
                  }
                  var percent = Math.floor(dom3.offsetWidth * 100 / 128) + '%'
                  dom4.innerHTML = percent
                  that.settingOpacity(dom3.offsetWidth / 128)
                }
              })
              dom2.addEventListener('mousedown', function(e) {
                let pageX = e.pageX
                let width = dom3.offsetWidth
                document.onmousemove = function(e) {
                  var currentD = e.pageX - pageX
                  if (width + currentD <= 0) {
                    dom2.style.left = 0 + 'px'
                    dom3.style.width = 0 + 'px'
                    dom4.style.left = 0 + 'px'
                  } else if (width + currentD >= 132) {
                    dom2.style.left = 128 + 'px'
                    dom3.style.width = 128 + 'px'
                    dom4.style.left = 128 + 'px'
                  } else {
                    dom2.style.left = width + currentD + 'px'
                    dom3.style.width = width + currentD + 'px'
                    dom4.style.left = width + currentD + 'px'
                  }
                  var percent = Math.floor(dom3.offsetWidth * 100 / 128) + '%'
                  dom4.innerHTML = percent
                  that.settingOpacity(dom3.offsetWidth  / 128)
                }
              })
              document.addEventListener('mouseup', function() {
                document.onmousemove = null
              })
            }
            return {
              init: init
            }
          })()
          slider.init()
        })
      })

    },
    flashCheck(){
      var flashObj
      if(typeof window.ActiveXObject != 'undefined'){
        flashObj = new window.ActiveXObject('ShockwaveFlash.ShockwaveFlash')
      }else{
        flashObj = navigator.plugins['Shockwave Flash']
      }
      return flashObj?true:false
    },
    isIE(){
      if(!!window.ActiveXObject || 'ActiveXObject' in window)
        return true
      else
        return false
    },
    getVideoSource() {
      // 枚举视频源地址
      this.videoUrlObj = this.getVideoUrl(this.anchorInfo.playAddr)
      // 组装视频源
      const _flv = this.videoUrlObj.flv
      const _hls = this.isIE()?this.videoUrlObj.hls:''
      // 标清，高清，超清
      const _suffix = [
        {
          suffix: '',
          name: '超清'
        },
        {
          suffix: '_hd',
          name: '高清'
        },
        {
          suffix: '_ld',
          name: '标清'
        }
      ]
      if(_hls){
        const _url = _flv.slice(0, _hls.length - 5)
        return _suffix.map(item => {
          return {
            name: item.name,
            url: _url + item.suffix + '.m3u8',
            type: 'auto',
            number: 0
          }
        })
      }
      else if(_flv) {
        const _url = _flv.slice(0, _flv.length - 4)
        return _suffix.map(item => {
          return {
            name: item.name,
            url: _url + item.suffix + '.flv',
            type: 'auto',
            number: 0
          }
        })
      } else {
        return []
      }
    },
    loadingJs() {
      DPlayer = require('dplayer')
    },
    videoError() {
      // 卡顿
      this.videoPlayer.on('waiting', () => {
        this.carton_number ++
        this.updateVideoStatus(3)
      })
      // 加载错误
      this.videoPlayer.on('error', () => {
        this.updateVideoStatus(2)
        if(this.reloadTimes == 0) {
          this.$get('/v0.1/room/detail', {
            apiType: 'anchor',
            body: {
              roomId:this.$route.query.roomId,
              uid: this.getUserInfo().uid || ''
            }
          }).then(res => {
            const { code, data } = res
            if (code === 200) {
              if(data.status == 1){ //0: 下线, 1: 上线, 2: 禁播
                this.videoPlayer.reload(this.defaultQuality)
                this.reloadTimes ++
                this.isDropped  = true
              }else{
                this.isDropped = false
                this.isNotStarted = true
              }
            }
          })
        }else if(this.reloadTimes == 3){
          this.isDropped = false
          this.isNotStarted  = true
          this.reloadTimes = 0
        }else{
          this.reloadTimes ++
          setTimeout(()=>{this.videoPlayer.reload(this.defaultQuality)},3000)
        }
      })
      this.videoPlayer.on('canplay', () => {
        this.reloadTimes = 0
        this.isDropped = false
        this.isNotStarted = false
        this.updateVideoStatus(1)
      })
      // 播放完毕
      this.videoPlayer.on('ended', () => {
        this.isNotStarted = true
      })
      this.videoPlayer.on('quality_start', (e) => {
        this.defaultQuality = e.number
      })
    },
    getVideoUrl(data) {
      const _obj = {}
      if(!data || !data.length) {
        return _obj
      }
      data.forEach(item => {
        const _url = item.playUrl.slice(item.playUrl.indexOf('//'))
        _obj[item.protocolType] = _url
      })
      return _obj
    },
    // 存储页面参数
    getParams() {
      this.query = this.$route.query || {}
    },
    // push消息
    pushMessage(msgList) {
      const lastMsg = msgList.slice(-1)[0]
      const hiddenType = lastMsg.msgType !== 1 && lastMsg.msgType !== 2 && lastMsg.msgType !== '0'
      if(!lastMsg || !lastMsg.msgType || hiddenType) return
      const danmaku = {
        text: lastMsg.content,
        color: '#fff',
        type: 0
      }
      // 有视频源、才绘制弹幕
      if(this.hasVideoOrigin) {
        this.videoPlayer.danmaku.draw(danmaku)
      }
    },
    settingOpacity(opacity){
      this.videoPlayer.danmaku.opacity(opacity)
    },
    setFontSize(type){
      var that = this
      switch(type){
      case '0':document.querySelector('.dplayer-danmaku').style.fontSize = '16px';that.videoPlayer.danmaku.size=false;break
      case '1':document.querySelector('.dplayer-danmaku').style.fontSize = '22px';that.videoPlayer.danmaku.size=false;break
      case '2':document.querySelector('.dplayer-danmaku').style.fontSize = '28px';that.videoPlayer.danmaku.size=true;break
      }
    },
    changeDanmakuStatus(isShow,isHalf){
      if(!isShow){
        this.videoPlayer.danmaku.hide()
      }else{
        this.videoPlayer.danmaku.showing = true
        this.videoPlayer.danmaku.half = isHalf
      }
    },
    addStyle(dom,obj){
      for(var i in obj){
        dom.style[i] = obj[i]
      }
    },
    getAnchorRoomInfo(roomId) {
      this.$get('/v0.1/room/detail', {
        apiType: 'anchor',
        body: {
          roomId,
          uid: this.getUserInfo().uid || ''
        }
      }).then(res => {
        const { code, data } = res
        if (code === 200) {
          this.anchorInfo = data || {}
          this.liveType = 3
        }
      })
    },
    // 上报视频状态 status: 1-成功2-失败3-卡顿 4-周期
    updateVideoStatus(status) {
      const _params = {
        // 设备类型1-手机2-平板3-电脑
        device_type: 3,
        device_os: getDeviceOS(),
        // device_version: '',
        // device_name: '',
        // device_id: '',
        network_type: getNetworkType(),
        room_id: this.query.roomId,
        uid: this.commUserInfo.uid,
        play_url: this.curPlayUrl,
        play_status: status,
        trigger_time: new Date().getTime()
      }

      if(status === 4) {
        _params.carton_number = this.carton_number
        _params.periodic_unit = 3 * 60 * 1000
      }
      
      this.$post('/v0.6/device/networkLogs', {
        apiType: 'anchor',
        body: _params
      }).then(() => {})
    },
    // 周期统计直播卡顿次数
    periodicStat() {
      videoLogTimer = setTimeout(() => {
        this.updateVideoStatus(4)
        clearTimeout(videoLogTimer)

        this.carton_number = 0
        this.periodicStat()
      }, 3 * 60 * 1000)
    }
  }
}
</script>
<style lang="postcss" scoped>
.video-anchor {
  height: 100%;
  position: relative;
  overflow: hidden;
  .notice-the-gift {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    width: 100%;
    height: 0;
    /deep/ #noticeGift {
      position: absolute;
      left: 100%;
      top: 40px;
      width: 360px;
      padding-left: 52px;
      height: 32px;
      line-height: 32px;
      border-radius: 32px;
      font-size: 12px;
      background-image: linear-gradient(90deg, #F0AA21 0%, #FF521E 100%);
      .user-img {
        position: absolute;
        left: 0;
        top: -7px;
        width: 46px;
        height: 46px;
        display: block;
        border-radius: 46px;
        border: 1px solid #EB9D1E;
        background: #EB9D1E;
      }
      .txt {
        float: left;
        height: 32px;
        overflow: hidden;
        p {
          color: #FFE5BF;
          float: left;
          margin-right: 4px;
          &.name {
            color: #fff;
            max-width: 60px;
          }
        }
        .gift-img {
          float: left;
          width: 32px;
          height: 32px;
        }
      }
    }
  }
}
.video-inner {
  width: 100%;
  height: 100%;
  /* 隐藏右键功能 */
  >>>.dplayer-menu {
    display: none !important;
  }
  >>>.dplayer-comment {
    display: none !important;
  }
   >>>.dplayer-danmaku-item{
    will-change: transform; 
    /* padding:0 100px; */
  }
}
</style>
<style lang="postcss">
.icondanmu{
  font-size:17px;
  color:#FFFFFF;
  &:hover{
    color:#3683FF;
  }
  &.active{
    color:#3683FF;
  }
}
.customerBox_special{
  .margin_top17{
    margin-top:17px;
  }
  .margin_top14{
    margin-top:14px;
  }
  .dan_area{
    display: flex;
    flex-direction:row;
    justify-content:space-around;
    .rect_parent{
      &.active{
        color:#3683FF;
      }
      &:hover{
        cursor: pointer;
      }
    }
    .rect{
      width:25px;
      height:14px;
      box-sizing:border-box;
      /* &.active{
        color:#3683FF;
        + p{
          color:#3683FF;
        }
      } */
      .iconfont{
        font-size:14px;
      }
      &:hover{
        cursor: pointer;
      }
    }
    .area_choice{
      margin-top:1px;
      line-height:17px;
      text-align:center;
      &.active{
        color:#3683FF;
      }
    }
    span{
      display: inline-block
    }
    .checkBox{
      &:hover{
        cursor: pointer;
      }
      &.active{
        .radiu{
          border:none;
          background:url(../../../assets/live/svg/select.svg)
        }
        span{
          color:#3683FF
        }
      }
      .radiu{
        width:8px;height:8px;box-sizing: border-box;border-radius: 100%;border:1.3px solid #999999;
      }
    }
  }
  .area{
    >p{
      padding:11px 0 0 19px;
    }
  }
  .info_title{
    color:#ECECEC;
    line-height:17px;
    font-size:12px;
    padding-left:19px;
  }
  /* 自定义滑块 */
  #wrapper {
    position: relative;
    width: 136px;
    height: 2px;
    border-radius: 2.5px;
    background: #999999;
    margin:23px auto 0;
  }
  #wrapper:hover {
    cursor: pointer;
  }
  #slider {
    position: absolute;
    left: 128px;
    border-radius: 100%;
    width: 8px;
    height: 8px;
    display: inline-block;
    background-color: white;
    cursor: pointer;
    top: 50%;
    transform: translateY(-50%)
  }
  #fill {
    width: 128px;
    height: 2px;
    background: #3683FF;
    border-radius: 2.5px
  }
  #silder_po {
    position: absolute;
    top: -22px;
    height: 16px;
    width: 36px;
    opacity: 0.8;
    background: #FFFFFF;
    border-radius: 1px;
    left:128px;
    background: white;
    transform: translateX(-50%);
    color: #333333;
    font-size:12px;
    text-align: center;
    line-height: 16px;
  }
}


</style>