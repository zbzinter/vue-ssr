<template>
  <div class="personal clearfix">
    <div class="nav">
      <ul>
        <li
          v-for="(item, index) in nav"
          :key="index"
        >
          <div
            v-if="item.flag"
            class="menu border-bt"
          >
            <router-link
              active-class="cur"
              :to="'/personal/'+item.path"
            >
              <i
                class="iconfont"
                :class="item.icon"
              />
              <span class="name">{{ item.title }}</span>
            </router-link>
          </div>
        </li>
      </ul>
      <ul>
        <div v-if="isShow">
          <li
            v-for="item in anchor"
            :key="item.id"
          >
            <div
              v-if="item.flag"
              class="menu"
            >
              <router-link
                active-class="cur"
                :to="'/personal/'+item.path"
              >
                <i
                  class="iconfont"
                  :class="item.icon"
                />
                <span class="name">{{ item.title }}</span>
              </router-link>
            </div>
          </li>
        </div>
      </ul>
      <!-- 申请直播  未实名认证或者已经实名认证但是未设置  -->
      <Button
        v-if="commUserInfo.certFlag < 1 || (commUserInfo.certFlag === 1 && !isShow)"
        id="apply-for-live"
        type="primary"
        class="apply-for-live"
        style="margin-top:15px;"
      >
        <i class="iconfont icondo_cc" />
        <span @click="wantToLive(1)">申请直播</span>
      </Button>
    </div>
    <keep-alive>
      <router-view class="right-content" />
    </keep-alive>
  </div>
</template>
<script>
import { Button } from 'iview'
import { mapActions } from 'vuex'

export default {
  components: {
    Button
  },
  data() {
    return {
      curNav: 1,
      commonNav: [
        {
          id: 1,
          title: '个人资料',
          path: 'basic-data',
          icon: 'icondb_ce',
          flag: true
        },
        // {
        //   id: 2,
        //   title: '会员专享',
        //   path: 'vip',
        //   icon: 'icondc_ce',
        //   flag: true,
        // },
        {
          id: 3,
          title: '我的财产',
          path: 'property',
          icon: 'iconda_ce',
          flag: true
        },
        {
          id: 4,
          title: '我的收益',
          path: 'income',
          icon: 'iconfm_dj',
          flag: true
        },
        {
          id: 5,
          title: '我的关注',
          path: 'follow',
          icon: 'icondd_ce',
          flag: true
        },
        {
          id: 6,
          title: '我的消息',
          path: 'message',
          icon: 'iconde_ce',
          flag: true
        },
        {
          id: 7,
          title: '消费记录',
          path: 'expense-log',
          icon: 'icondf_ce',
          flag: true
        },
        {
          id: 9,
          title: '我的猜球',
          path: 'guess-ball',
          icon: 'icon_my',
          flag: true
        }
      ],
      anchor: [
        {
          id: 10,
          title: '直播设置',
          path: 'set',
          icon: 'icondh_ce',
          flag: true,
          live: 1 // 注册成为主播才显示
        },
        {
          id: 11,
          title: '主播专用',
          path: 'private',
          icon: 'icondi_ce',
          flag: true,
          live: 1
        },
        // {
        //   id: 14,
        //   title: '直播历史',
        //   path: 'live-history',
        //   icon: 'icondi_ce',
        //   flag: true,
        //   live: 1,
        // },
        {
          id: 13,
          title: '房间管理',
          path: 'rooms-manage',
          icon: 'icon_oactm',
          flag: true,
          live: 1
        },
        {
          id: 12,
          title: '猜球管理',
          path: 'guess-ball-manage',
          icon: 'icon_oactm',
          flag: true,
          live: 1
        }
      ],
      cert: {
        id: 8,
        title: '实名认证',
        path: 'identity',
        icon: 'icondg_ce',
        flag: true
      },
      nav: [],
      isShow: false
    }
  },
  watch: {
    $route(newPath, oldPath) {
      if (
        oldPath.path.indexOf('set-simple') > -1 &&
        newPath.path.indexOf('set') > -1
      ) {
        this.judgeAnchors()
      }
    }
  },
  created() {
    this.getSwitch()
  },
  mounted() {
    this.judgeIsLogin()
  },
  methods: {
    ...mapActions(['GainAndJudgeAnchors']),
    judgeIsLogin() {
      if (!localStorage.getItem('token')) {
        this.$router.push({
          path: '/index'
        })
      }
    },

    jumpPage(path) {
      this.$router.push({
        path: '/personal/' + path
      })
    },

    async judgeAnchors() {
      try {
        const data = await this.GainAndJudgeAnchors({uids: String(this.getUserInfo().uid), vm: this})
        localStorage.setItem('set', data[0].is_first_set)

        // 简单设置过直播信息 显示主播的菜单栏
        if (data[0].is_first_set === 1 && this.getUserInfo().certFlag === 1) {
          this.isShow = true
        } else {
          this.isShow = false
        }
        this.nav = [...this.commonNav]
      } catch(e) {
        localStorage.setItem('set', 0)
        this.nav = [...this.commonNav]
      }

      if(this.getUserInfo().certFlag !== 1) {
        this.nav.push(this.cert)
      }
      this.nav.sort(function (a, b) {
        return a.id - b.id
      })

      // try {
      //   const {
      //     status,
      //     reason,
      //     time,
      //     anchor_apply,
      //     room_id
      //   } = await this.GetApplyAnchorInfo({
      //     uid: this.getUserInfo().uid,
      //     vm: this
      //   })
      //   localStorage.setItem('status', status) // 1-待审核2-审核不通过3-审核通过	
      //   // 简单设置过直播信息 显示主播的菜单栏
      //   if (status === 3) {
      //     this.isShow = true
      //   } else {
      //     this.isShow = false
      //   }
      //   this.nav = [...this.commonNav]
      // } catch (e) {
      //   localStorage.setItem('set', 0)
      //   this.nav = [...this.commonNav]
      // }

    },

    async getSwitch() {
      try {
        const {
          data: { settingFlag }
        } = await this.$get('v0.1/guessing/guessingSetting', {
          apiType: 'anchor'
        })
        if (Number(settingFlag) === 2) {
          this.anchor.pop()
          this.commonNav.pop()
        }
      } catch (e) {
        // loop
      }
      this.judgeAnchors()
    }
  }
}
</script>
<style lang="postcss" scoped>
.personal {
  position: relative;
  width: 1200px;
  margin: 40px auto;
  background: #fff;
  box-shadow: 0 6px 24px 0 rgba(0, 0, 0, 0.04);
  .nav {
    width: 210px;
    float: left;
    border-radius: 10px;
    background: #fff;
    ul {
      &:first-child {
        li {
          &:last-child {
            border-bottom: 1px solid #f0f0f0;
          }
        }
      }
    }
    .apply-for-live {
      width: 130px;
      height: 34px;
      line-height: 1;
      display: block;
      margin: 0 auto;
      .iconfont {
        margin-right: 15px;
      }
      span,
      i {
        vertical-align: middle;
      }
    }

    .menu {
      height: 60px;
      line-height: 60px;
      font-size: 14px;
      cursor: pointer;
      a {
        display: block;
        padding-left: 56px;
        color: #666;
        border-left: 7px solid #fff;
        .iconfont {
          float: left;
          margin-right: 6px;
        }
        .name {
          margin-left: 36px;
          display: block;
        }
        &:hover,
        &.cur {
          color: #3683ff;
          background: rgba(54, 131, 255, 0.1);
          border-left-color: #3683ff;
        }
      }
    }
  }
  .right-content {
    margin-left: 210px;
    min-height: 670px;
    border-left: 1px solid #f0f0f0;
  }
}
</style>


