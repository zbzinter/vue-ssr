<template>
  <div class="header-warp">
    <div
      class="header"
      :class="{black: navStatus === 2}"
    >
      <div
        class="header-inner"
      >
        <!-- 简洁头部-支付用 -->
        <div
          v-if="navStatus === 3"
          class="pay-header"
        >
          <div class="logo">
            <router-link to="/">
              <img src="../assets/logo.png">
            </router-link>
          </div>
          <div class="pay-title">
            充值中心
          </div>
        </div>
        <header v-else>
          <div class="logo">
            <router-link to="/">
              <img src="../assets/logo2.png">
            </router-link>
          </div>
          <div :class="{'sel': select}" />

          <!-- 顶部导航 -->
          <div
            v-if="list && list.length"
            class="top-nav"
          >
            <div
              v-for="(item, index) in list"
              :key="index"
              class="nav-item"
              @click="toPath(item.path, index, 0, item.developing)"
            >
              <!-- 没有子导航 -->
              <a
                v-if="!(Array.isArray(item.children))"
                :class="{'active-nav': item.isSelect}"
              >
                {{ item.title }}
              </a>
              <!-- 有子导航 -->
              <a
                v-if="Array.isArray(item.children)"
                :class="{'active-nav': item.isSelect}"
              >
                {{ item.title }}
              </a>
              <!-- 子导航 -->
              <div
                v-if="Array.isArray(item.children)"
                class="sub-nav"
              >
                <a
                  v-for="(subItem, subIndex) in item.children"
                  :key="subIndex"
                  :class=" (secondNav) === subIndex ? 'sub-active' : '' "
                  @click.stop="toPath(subItem.path, subIndex, 1, subItem.developing)"
                >
                  {{ subItem.title }}
                </a>
                <!-- 小三角 -->
                <img
                  class="triangle"
                  src="../assets/home/home_img_popups_n.png"
                >
              </div>
            </div>
          </div>

          <div class="top-right">
            <!-- 已登录 -->
            <span
              class="download"
              @click="goDownloadPage"
            >
              <img src="../assets/home/home_ic_download.svg">
              <a>下载</a>
            </span>
            <div
              v-if="isLogin"
              class="user-info"
            >
              <Poptip
                trigger="hover"
                theme="light"
                placement="bottom-end"
              >
                <HeaderUserInfo
                  ref="headerUserInfo"
                  slot="content"
                />
                <div @click="toPersonal">
                  <DefaultImg
                    class="user-head"
                    :src="commUserInfo.img"
                  />
                </div>
              </Poptip>
            </div>
            <!-- 未登录 -->
            <div
              v-else
              class="user-login"
            > 
              <div
                class="cursor"
                @click="login(1)"
              >
                <DefaultImg :src="defaultUserLogo" />
              </div>
              <!-- 鼠标滑过展示的内容 -->
              <div class="login-guide">
                <div class="guide-title">
                  <span>登录后您可以</span>
                </div>
                <div class="actions">
                  <div>
                    <img src="../assets/home/home_ic_login_barrage.svg">
                    <span>发弹幕</span>
                  </div>
                  <div>
                    <img src="../assets/home/home_ic_login_interactive.png">
                    <span>直播间互动</span>
                  </div>
                  <div>
                    <img src="../assets/home/home_ic_login_attention.svg">
                    <span>关注主播</span>
                  </div>
                </div>
                <div class="btn-area">
                  <button
                    class="btn btn-login"
                    @click="login(1)"
                  >
                    登录
                  </button>
                  <button
                    class="btn btn-reg"
                    @click="login(2)"
                  >
                    注册
                  </button>
                </div>
                <!-- 小三角 -->
                <img
                  class="triangle"
                  src="../assets/home/home_img_popups_n.png"
                >
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
    <div
      v-if="warnMessage"
      class="warn-message"
    >
      <span>{{ warnMessage }}</span>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { Poptip } from 'iview'
import MqttBase from '@utils/MqttBase'
export default {
  components: {
    Poptip,
    'HeaderUserInfo': () => import('./header-user-info'),
    'DefaultImg': () => import('@src/components/DefaultImg'),
  },
  props: {
    status: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      mqtt: null,
      secondNav: 0,
      // 是否已登录
      isLogin: false,
      // 用户信息
      userInfo: {},
      warnMessage: '',
      list: [
        {
          path: '/index',
          title: '首页',
          isSelect: false,
        },
        {
          path: '/score',
          title: '比分',
          isSelect: false,
          children: [
            { path: '/score/football', title: '足球比分', index: 0 },
            { path: '/score/basketball', title: '篮球比分', index: 1 },
            { path: '/score/tennis', title: '网球比分', index: 2 },
            { path: '/score/esports', title: '电竞比分', index: 3, developing: true },
            { path: '/score/baseball', title: '棒球比分', index: 4 }
          ]
        },
        {
          path: '/database',
          title: '资料库',
          isSelect: false,
          children: [
            { path: '/database/football', title: '足球资料库', index: 0 },
            { path: '/database/basketball', title: '篮球资料库', index: 1 },
            { path: '/database/tennis', title: '网球资料库', index: 2, developing: true },
            { path: '/database/esports', title: '电竞资料库', index: 3, developing: true },
            { path: '/database/baseball', title: '棒球资料库', index: 4, developing: true }
          ]
        },
        {
          path: '/live-list',
          title: '直播',
          isSelect: false,
        },
        {
          path: '/news',
          title: '资讯',
          isSelect: false
        },
        { path: '/expert', title: '专家' , isSelect: false, developing: true },
        { path: '/mall', title: '商城' , isSelect: false, developing: true }
      ],
      topic: '100300'
    }
  },
  computed: {
    ...mapState(['navStatus', 'secondNavTemp']),
    select() {
      let flag = false
      let { $route: {path} } = this
      const pathUrl = '/' + path.split('/')[1]
      let currentIndex = 0
      this.list.forEach((ele, index) => {
        if (ele.path === pathUrl) {
          ele.isSelect = true
          currentIndex = index
        } else {
          ele.isSelect = false
        }
      })
      this.$set(this.list, this.list[currentIndex] , currentIndex)
      return flag
    },
    defaultUserLogo() {
      return require('@src/assets/default_user.png')
    }
  },
  watch:{
    secondNavTemp(val) {
      this.secondNav = val
    },
    commUserInfo() {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    if (this.mqtt) {
      this.mqtt.unsubscribe(this.topic)
    }
  },
  methods: {
    init() {
      this.userInfo = this.getUserInfo()
      if(process){
        this.isLogin =  this.commUserInfo.uid
      }else{
        this.isLogin = localStorage.getItem('token') || this.commUserInfo.uid
      }
      
      if (this.isLogin && !this.mqtt) {
        this.setMqtt()
      }
    },
    toPersonal() {
      this.$router.push({
        path: '/personal/basic-data'
      })
    },
    // 登录、注册
    login(type) {
      this.G_SetLogin({
        show: true,
        type
      })
    },
    toPath(path, index, code, isDeveloping = false) {
      // 正在开发中
      if (isDeveloping) {
        this.$tip('敬请期待')
        return
      }
      if (code === 1) {
        // this.secondNav = index
      }
      if (path === '/score') { // 直接点击比分一级菜单，跳转足球比分
        path = '/score/football'
      }
      this.$router.openNewPage({
        path
      })
    },
    setMqtt() {
      this.mqtt = null
      this.mqtt = new MqttBase(this.getMessage)
      this.mqtt.subscribe(this.topic, null, 'p2p')
    },
    getMessage (topic, mqttMsg) {
      if (this.topic === String(mqttMsg.type)) {
        this.warnMessage = '您因违规操作，已被平台封号'
        const timer = setTimeout(() => {
          this.warnMessage = ''
          this.$store.dispatch('Logout',{vm: this})
          clearTimeout(timer)
        }, 5000)
      }
    },
    goDownloadPage() { // 前往下载页
      this.$router.openNewPage({
        path: '/download'
      })
    }
  }
}
</script>
<style scoped lang="postcss">
  .header-warp {
    height: 60px;
    position: relative;
    border-bottom: 1px solid #D9D9D9;
  }
  .header {
    width: 100%;
    height: 60px;
    background: #ffffff;
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.08);
    position: fixed;
    z-index: 999;
    left: 0;
    top: 0;
    .header-inner {
      width: 1200px;
      height: 60px;
      margin: 0 auto;
      .pay-header {
        line-height: 60px;
        .logo {
          float: left;
          img {
            height: 40px;
          }
        }
        .pay-title {
          float: left;
          height: 26px;
          line-height: 26px;
          margin-left: 30px;
          padding-left: 30px;
          font-size: 20px;
          color: #333333;
          margin-top: 17px;
          border-left: 1px solid #ccc;
        }
      }
      header {
        position: relative;
        margin: 0 auto;
        line-height: 60px;
        .logo {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 96;
          font-size: 30px;
          font-weight: bold;
          a {
            display: block;
            color: #333333;
          }
          img {
            width: 180px;
            height: 60px;
            vertical-align: top;
          }
        }
        .top-nav {
          display:flex;
          margin-left: 210px;
          font-size: 16px;
          color: #333333;
          .nav-item {
            position: relative;
            width: 110px;
            color: #333333;
            text-align: center;
            transition: color 0.2s ease;
            &:hover {
              cursor: pointer;
              &::after {
                content: '';
                position: absolute;
                z-index: 199;
                left: 0;
                right: 0;
                top: 0;
                height: 4px;
                background: #3683FF;
                border-radius: 0 0 6px 6px;
              }
              a {
                color: #3683FF;
              }
              .sub-nav {
                display: flex;
                flex-direction: column;
              }
            }
            a.active-nav {
              font-weight: bold;
              color: #3683FF;
              &::after {
                content: '';
                position: absolute;
                z-index: 199;
                left: 0;
                right: 0;
                top: 0;
                height: 4px;
                background: #3683FF;
                border-radius: 0 0 6px 6px;
              }
            }
            .sub-nav {
              position: absolute;
              display: none;
              left: -35px;
              width: 180px;
              top: 59px;
              z-index: 97;
              background: #ffffff;
              box-shadow: 0 2px 10px 0 rgba(0,0,0,0.25);
              border-radius: 1px;
              font-size: 16px;
              color: #666666;
              a {
                display: block;
                color: #666666;
                line-height: 20px;
                padding: 14px 0;
                &.sub-active {
                  color: #3683FF;
                }
                &:hover{
                  color: #3683FF;
                  background: rgba(54, 131, 255, 0.06);
                }
              }
              .triangle{
                position: absolute;
                width: 40px;
                height: 13px;
                top: -13px;
                left: 50%;
                transform: translateX(-50%);
              }
            }
          }
        }
        .top-right {
          display: flex;
          position: absolute;
          right: 0;
          top: 0;
          z-index: 96;
          font-size: 16px;
          color: #666666;
          >>>.ivu-poptip-body {
            padding: 0;
          }
          .download{
            margin-right: 30px;
            font-size: 16px;
            color: #333333;
            cursor: pointer;
            img{
              margin-right: 2px;
            }
          }
          .user-info {
            padding-top: 10px;
            margin-right: 10px;
            line-height: 20px;
            .icon-box {
              height: 60px;
              cursor: pointer;
              padding-top: 16px;
            }
            .iconfont {
              font-size: 30px;
              color: #3683FF;
              float: right;
            }
            .user-head {
              display: block;
              width: 40px;
              height: 40px;
              cursor: pointer;
              border-radius: 40px;
            }
          }
          .user-login {
            position: relative;
            &:hover{
              .login-guide{
                display: block;
              }
            }
            img{
              width: 40px;
              height: 40px;
            }
            .login-guide{
              position: absolute;
              top: 59px;
              right: -10px;
              flex-direction: column;
              align-items: center;
              width: 280px;
              display: none;
              padding: 16px 20px;
              background: #FFFFFF;
              box-shadow: 0 2px 10px 0 rgba(0,0,0,0.25);
              border-radius: 1px;
              .guide-title{
                font-size: 14px;
                color: #666666;
                line-height: normal;
              }
              .actions{
                display: flex;
                justify-content: space-between;
                margin-top: 25px;
                line-height: normal;
                > div{
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  img{
                    width: 56px;
                    height: 56px;
                  }
                  span{
                    margin-top: 6px;
                    font-size: 12px;
                    color: #999999;
                    line-height: normal;
                  }
                }
              }
              .btn-area{
                margin-top: 23px;
                display: flex;
                .btn{
                  flex: 1;
                  padding: 3px 18px;
                  background: #3683FF;
                  border-radius: 2px;
                  font-size: 14px;
                  color: #FFFFFF;
                  line-height: normal;
                  cursor: pointer;
                }
                .btn-reg{
                  margin-left: 20px;
                  color: #3683FF;
                  background: #ffffff;
                  border: 2px solid #3683FF;
                }
              }
              .triangle{
                position: absolute;
                width: 40px;
                height: 13px;
                top: -13px;
                right: 10px;
              }
            }
          }
        }
      }
    }
  }

  .warn-message {
    position: absolute;
    top: 100px;
    left: 50%;
    opacity: 0.8;
    box-shadow: 0 6px 24px 0 rgba(0,0,0,0.04);
    z-index: 999;
    text-align: center;
    span {
      display: inline-block;
      border: 1px solid #000;
      width: 470px;
      height: 100px;
      line-height: 100px;
      font-family: PingFangSC-Medium;
      font-size: 20px;
      color: #FFFFFF;
      background: #000000;
      letter-spacing: 0;
      margin-left: -235px;
    }
  }

  .cursor {
    cursor: pointer;
  }
</style>