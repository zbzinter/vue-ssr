
import { mapGetters } from 'vuex'
import SVGA from 'svgaplayerweb'
import anime from 'animejs'
import { autoUrlHttp } from '@utils/utils'
const imgX = require('../assets/live/x@2x.png')

// 小动画3秒定时器
let smallGiftTimer = null
export default {
  data() {
    return {
      // 聊天室、相关直播tab
      curChatBoxTab: 2,
      // 上一次小动画对象，用作当前执行动画是否是同一用户
      prevSmallGift: {},
      // 小礼物连送集合，用户id + 礼物id：存用户3秒内连送数量，3秒后清除
      evenSendAggr: {},
      // 记录每一个用户上一次礼物，跟当前送的礼物做对比，作连送处理
      prevGiftToUser: {}
    }
  },
  computed: {
    ...mapGetters(['bigGifts', 'smallGifts', 'noticeGifts'])
  },
  methods: {
    // 获取回调地址-当前域名
    getRedirectUrl() {
      return window.location.origin + '/index'
    },
    // 判断是否有赛事id 
    judgeMatchId(query) {
      query = query || {}
      const _id = query.id
      const hasId = _id && _id !== '0' && _id !== 'null' && _id !== 'undefined' && _id !== '-1' 
      return hasId
    },
    // 执行大动画
    startBigGift() {
      if(document.getElementById('bigGiftboxInner')) return

      // 判断是否有动画需要执行
      if(this.bigGifts && this.bigGifts.length) {
        // 当前要执行的动画信息
        const curGift = this.bigGifts[0]
        const _dom = `
        <div id="bigGiftboxInner">
          <div class="big-gift-title">
            <img src="${(curGift.send_user_img || this.defaultImg.avatar)}" class="user-img" alt="">
            <div class="txt">
              <p class="name ellipsis">${curGift.send_nickname}</p>
              <p>送出</p>
              <p class="name ellipsis">${curGift.gift_name}</p>
            </div>
          </div>
          <div id="giftCanvas" />
        </div>
        `
        document.getElementById('bGiftWrap').innerHTML = _dom
        const url = autoUrlHttp(curGift.gift_effect)
        var player = new SVGA.Player('#giftCanvas')
        var parser = new SVGA.Parser('#giftCanvas') // 如果你需要支持 IE6+，那么必须把同样的选择器传给 Parser。
        parser.load(url, videoItem => {
          player.loops = 1
          player.setVideoItem(videoItem)
          player.startAnimation()
          // 删除store里当前的动画
          this.$store.commit('delBigGifts')
          // 动画执行完回调
          player.onFinished(() => {
            document.getElementById('bigGiftboxInner').remove()
            this.startBigGift()
          })
        })
      }

    },
    // 执行小动画
    startSmallGift() {
      // // 判断是否有动画需要执行
      if(this.smallGifts && this.smallGifts.length) {
        // 当前要执行的动画信息
        const curGift = this.smallGifts[0]
        // 最终显示的数字
        let showCount = curGift.gift_count
        // 数字转成图片的dom
        let imgDom = ''
        // 用户id + 礼物id 作为唯一id标识
        const curId = String(curGift.send_uid) + String(curGift.gift_id)
        // 同一个用户，送的同一个礼物时，在3秒内显示连送
        const isSameUser = this.prevSmallGift.uid === curGift.uid
        // 3秒内有送两次以上同一礼物时，并且当前送的礼物数量为1的时候
        const isSameGift = this.prevGiftToUser[curId] && this.prevGiftToUser[curId].gift_id === curGift.gift_id && curGift.gift_count === 1
        if(isSameUser && isSameGift) {
          const _count = this.evenSendAggr[curId] || 1
          this.evenSendAggr[curId] = _count + 1
          showCount = _count + 1
          clearTimeout(smallGiftTimer)
        } else if(document.getElementById('smallGiftBox')) return

        // 数字转成图片
        showCount = String(showCount)
        for(let i = 0; i < showCount.length; i++) {
          const _imgUrl = require(`../assets/live/${showCount[i]}@2x.png`)
          imgDom += `<img src="${_imgUrl}">`
        }
        
        const _dom = `
          <div id="smallGiftBox">
            <img src="${(curGift.send_user_img || this.defaultImg.avatar)}" class="user-img" alt="">
            <div class="txt">
              <p class="name ellipsis">${curGift.send_nickname}</p>
              <p class="g">送出 ${curGift.gift_name}</p>
            </div>
            <div class="gift">
              <img src="${curGift.gift_icon}" class="s-gift" alt="">
              <div class="num animated bounceIn">
                <img class="x" src="${imgX}">
                ${imgDom}
              </div>
            </div>
          </div>
        `
        
        document.getElementById('sGiftWrap').innerHTML = _dom

        // 存一次记录
        this.prevGiftToUser[curId] = curGift
        // 删除store里当前的动画
        this.$store.commit('delSmallGifts')

        smallGiftTimer = setTimeout(() => {
          if(document.getElementById('smallGiftBox')) {
            document.getElementById('smallGiftBox').remove()
          }
          this.evenSendAggr[curId] = 0
          this.prevGiftToUser[curId] = null
          this.startSmallGift()
        }, 3000)
      }

    },
    // 执行通告动画
    startNoticeGift() {
      if(document.getElementById('noticeGift')) return
      // 判断是否有动画需要执行
      if(this.noticeGifts && this.noticeGifts.length) {
        // 当前要执行的动画信息
        const curGift = this.noticeGifts[0] || {}
        const _dom = `
          <div id="noticeGift">
            <img src="${(curGift.send_user_img || this.defaultImg.avatar)}" class="user-img" alt="">
            <div class="txt">
              <p class="name ellipsis">${curGift.send_nickname}</p>
              <p>送给主播</p>
              <p class="name ellipsis">
                ${curGift.receive_nickname}
              </p>
              <p>${curGift.gift_name}</p>
              <img src="${curGift.gift_icon}" class="gift-img" alt="">
            </div>
          </div>
          `
        document.getElementById('noticeTheGift').innerHTML = _dom

        setTimeout(() => {
          // 删除store里当前的动画
          this.$store.commit('delNoticeGifts')
        })

        // 执行动画
        anime({
          targets: '#noticeGift',
          left: '-50%',
          autoplay: true,
          duration: 8000,
          easing: 'linear',
          delay: 0,
          loop: false,
          complete: () => {
            document.getElementById('noticeGift').remove()
            this.startNoticeGift()
          }
        })
      }
    }
  }
}