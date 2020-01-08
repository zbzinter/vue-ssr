<template>
  <div class="header-user-info">
    <div class="header">
      <div
        class="user-img"
        @click="jumpPage('/personal/basic-data')"
      >
        <DefaultImg
          :src="commUserInfo.img"
        />
      </div>
      <div class="right">
        <h2 class="user-name">
          <span class="ellipsis">{{ commUserInfo.nickName }}</span>
          <i
            class="iconfont icondp_ca"
            @click="changeName"
          />
        </h2>
        <!-- <p class="member">
          <span v-if="commMemberInfo.vip && commMemberInfo.vip.status == 1">会员到期：{{ commMemberInfo.vip.end_time }} <a @click="jumpPage('/personal/vip')">续费</a></span>
          <span v-else>会员享有专属特权 <a @click="jumpPage('/personal/vip')">开通会员</a></span>
        </p> -->
        <div class="rank">
          <span class="name number">LV{{ commMemberInfo.level || 1 }}</span>
          <div class="process-wrap">
            <div
              class="process"
              style="width: 20%"
            >
              <span>20%</span>
            </div>
          </div>
        </div>
        <a
          class="logout"
          @click="logout"
        >退出</a>
      </div>
    </div>
    <div class="wallet">
      <div class="title">
        我的财产
      </div>
      <ul>
        <li class="ellipsis">
          <img
            src="../assets/personal/nobt_diamond.png"
            style="width:25px;height:25px;"
            alt=""
          >
          <span class="orange">{{ commMemberInfo.diamond || 0 }}</span>
        </li>
        <li class="ellipsis">
          <img
            src="../assets/personal/icon-peas.png"
            alt=""
          >
          <span class="orange">{{ commMemberInfo.ball_gold || 0 }}</span>
        </li>
        <li>
          <a
            class="btn"
            @click="jumpPage('/personal/property')"
          >充值</a>
        </li>
      </ul>
    </div>
    <div class="nav-list clearfix">
      <ul>
        <li
          v-for="(item, index) in nav"
          :key="index"
          @click="item.live ? wantToLive(): jumpPage(item.path)"
        >
          <i
            class="iconfont"
            :class="item.icon"
          />
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import DefaultImg from '@src/components/DefaultImg'
import Http from '@utils/Http'
const http = new Http()

export default {
  components: {
    DefaultImg
  },
  data() {
    return {
      nav: [
        {
          name: '个人资料',
          icon: 'icondb_ce',
          path: '/personal/basic-data'
        },
        {
          name: '我的关注',
          icon: 'icondd_ce',
          path: '/personal/follow'
        },
        {
          name: '我的财产',
          icon: 'iconda_ce',
          path: '/personal/property'
        },
        {
          name: '我要直播',
          icon: 'icondq_ce',
          live: true
        },
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // 更新用户信息
      this.updateUserAndMember({
        uid: localStorage.getItem('uid'),
        token: localStorage.getItem('token')
      })
    },
    jumpPage(path) {
      this.$router.push({
        path
      })
    }, 
    changeName() {
      this.$router.push({
        path: '/personal/basic-data',
        query: {
          tab: 2
        }
      })
    },
    // 退出
    logout() {
      this.$store.dispatch('Logout',{vm: this})
    },
  }
}
</script>
<style lang="postcss" scoped>
.header-user-info {
  width: 380px;
  .header {
    padding: 25px;
    line-height: 20px;
    position: relative;
    overflow: hidden;
    .user-img {
      float: left;
      cursor: pointer;
      img {
        display: block;
        width: 90px;
        height: 90px;
        border-radius: 90px;
      }
    }
    .right {
      margin-left: 102px;
      .user-name {
        font-size: 20px;
        color: #333333;
        line-height: 30px;
        overflow: hidden;
        span {
          display: block;
          max-width: 190px;
          float: left;
        }
        i {
          margin-left: 14px;
          font-size: 14px;
          color: #979797;
          float: left;
          font-weight: normal;
          cursor: pointer;
          &:hover {
            color: #3683ff;
          }
        }
      }
      .member {
        line-height: 18px;
        font-size: 12px;
        color: #666666;
        margin-top: 2px;
          a {
            color: #FFA029;
            margin-left: 20px;
            &:hover {
              color: #ec8d00;
              text-decoration: underline;
            }
          }
      }
      .rank {
        margin-top: 10px;
        overflow: hidden;
        .name {
          float: left;
          color: #3683FF;
          line-height: 18px;
          font-size: 20px;
        }
        .process-wrap {
          height: 12px;
          margin-top: 3px;
          margin-left: 30px;
          background: #D8D8D8;
          border-radius: 5.5px;
          .process {
            height: 100%;
            font-size: 12px;
            line-height: 1;
            color: #fff;
            text-align: right;
            background: #3683FF;
            border-radius: 5.5px;
            span {
              margin-right: 4px;
            }
          }
        }
      }
      .logout {
        color: #999999;
        position: absolute;
        right: 10px;
        top: 10px;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  .wallet {
    padding: 25px;
    margin-top: -25px;
    border-bottom: 1px solid #f0f0f0;
    .title {
      font-size: 14px;
      color: #666666;
      line-height: 1;
      padding-bottom: 8px;
    }
    ul {
      overflow: hidden;
      li {
        float: left;
        width: 25%;
        margin-top: 10px;
        img {
          height: 15px;
        }
        .orange {
          color: #FFA029;
          font-weight: bold;
        }
        .btn {
          font-size: 12px;
          line-height: 1;
          color: #fff;
          float: left;
          padding: 4px 10px;
          border-radius: 4px;
          background: #FFA029;
          &:hover {
            background: #ec8d00;
          }
        }
      }
    }
  }
  .nav-list {
    overflow: hidden;
    li {
      width: 25%;
      float: left;
      cursor: pointer;
      text-align: center;
      padding: 12px 0 16px 0;
      .iconfont {
        font-size: 18px;
      }
      p {
        font-size: 14px;
        padding-top: 4px;
        line-height: 1;
      }
      &:hover {
        color: #3683ff;
      }
    }
  }
}
</style>