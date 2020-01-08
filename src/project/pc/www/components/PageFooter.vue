<template>
  <footer class="footer">
    <div class="footer-top">
      <!-- 底部导航 -->
      <div class="footer-nav">
        <div
          v-for="nav in navs"
          class="footer-nav-item"
          :class="{'news': nav.title === '资讯'}"
        >
          <p>{{ nav.title }}</p>
          <div
            v-for="sub in nav.children"
            class="footer-nav-sub-item"
            @click="toPath(sub.path, sub.developing)"
          >
            <span>{{ sub.subTitle }}</span>
          </div>
        </div>
      </div>

      <!-- 下载及关注引导 -->
      <div class="download-guide">
        <div class="guide-item">
          <p>产品下载</p>
          <img src="../assets/home/download-qrcode.png">
          <span>APP下载</span>
        </div>
        <div class="guide-item">
          <p>关注我们</p>
          <img src="../assets/home/public-qrcode.jpg">
          <span>微信公众号</span>
        </div>
        <div class="guide-item">
          <p>关注我们</p>
          <img src="../assets/home/weibo-qrcode.png">
          <span>官方微博</span>
        </div>
      </div>

      <!-- 联系我们 -->
      <div class="contact">
        <p class="contact-title">
          联系我们
        </p>
        <p>邮箱：jmfen@jmfen.cn</p>
        <p>联系电话：0755-26928101</p>
        <p>合作联系：operation@jmfen.cn</p>
      </div>
    </div>

    <!-- copyright -->
    <div class="copyright">
      <p>Copyright © 2019球会体育.All Rights Reserved</p>
      <p>公司&nbsp;版权所有&nbsp;粤B2-20190978&nbsp;粤网文[2018]9282-3285号</p>
    </div>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      navs: [
        {
          title: '比分',
          children: [
            { subTitle: '足球比分',  path: '/score/football'},
            { subTitle: '篮球比分',  path: '/score/basketball'},
            { subTitle: '电竞比分',  path: '/score/esports', developing: true},
            { subTitle: '网球比分',  path: '/score/tennis'},
            { subTitle: '棒球比分',  path: '/score/baseball'}
          ]
        },
        {
          title: '资料库',
          children: [
            { subTitle: '足球资料库',  path: '/database/football'},
            // { subTitle: '篮球资料库',  path: '/database/basketball', developing: true},
            { subTitle: '电竞资料库',  path: '/database/esports', developing: true},
            { subTitle: '网球资料库',  path: '/database/tennis', developing: true},
            { subTitle: '棒球资料库',  path: '/database/baseball', developing: true}
          ]
        },
        {
          title: '直播',
          children: [
            { subTitle: '大神直播',  path: '/live-list'},
            { subTitle: '搞笑解说',  path: '/live-list'},
            { subTitle: '方言解说',  path: '/live-list'},
            { subTitle: '美女主播',  path: '/live-list'},
            { subTitle: '赛事直播',  path: '/live-list'},
            { subTitle: 'NBA赛事',  path: '/live-list'}
          ]
        },
        {
          title: '资讯',
          children: [
            { subTitle: 'NBA',  path: '/news'},
            { subTitle: '中超',  path: '/news'},
            { subTitle: '国足',  path: '/news'},
            { subTitle: '英超',  path: '/news'},
            { subTitle: '西甲',  path: '/news'},
            { subTitle: '意甲',  path: '/news'},
            { subTitle: '法甲',  path: '/news'},
            { subTitle: '德甲',  path: '/news'},
            { subTitle: '综合',  path: '/news'},
            { subTitle: '发现',  path: '/news'},
            { subTitle: 'CBA',  path: '/news'}
          ]
        }
      ]
    }
  },
  methods: {
    toPath(path, isDeveloping = false) {
      // 正在开发中
      if (isDeveloping) {
        this.$tip('敬请期待')
        return
      }
      this.$router.openNewPage({
        path
      })
    }
  }
}
</script>
<style scoped lang="postcss">
.footer{
  width: 100%;
  margin-top: 50px;
  .footer-top {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 50px 0 30px;
    color: #ffffff;
    background: #243B60;
    &:after{
      content: '';
      position: absolute;
      height: 1px;
      max-width: 1440px;
      bottom: 0;
      left: 0;
      right: 0;
      margin: 0 auto;
      opacity: 0.08;
      background: #ffffff;
    }
    .footer-nav{
      display: flex;
      .footer-nav-item{
        margin-right: 60px;
        p{
          margin-bottom: 20px;
          font-family: PingFangSC-Medium;
          font-size: 18px;
        }
        .footer-nav-sub-item{
          margin-top: 10px;
          cursor: pointer;
          span{
            opacity: 0.5;
            font-family: PingFangSC-Regular;
            font-size: 12px;
          }
        }
      }
      .news{
        margin-right: 0;
        max-width: 166px;
        p{
          margin-bottom: 10px;
        }
        .footer-nav-sub-item{
          display: inline-block;
          width: 60px;
          &:nth-child(even){
            margin-right: 30px;
          }
        }
      }
    }
    .download-guide{
      display: flex;
      margin-left: 92px;
      .guide-item{
        display: flex;
        flex-direction: column;
        margin-right: 57px;
        text-align: center;
        p{
          font-family: PingFangSC-Medium;
          font-size: 18px;
        }
        img{
          margin: 20px 0 10px;
          width: 78px;
          height: 78px;
        }
        span{
          opacity: 0.5;
          font-family: PingFangSC-Regular;
          font-size: 12px;
        }
        &:last-child{
          margin-right: 0;
        }
      }
    }
    .contact{
      margin-left: 80px;
      p{
        margin-top: 16px;
        opacity: 0.8;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #FFFFFF;
      }
      .contact-title{
        margin-bottom: 20px;
        margin-top: 0;
        opacity: 1;
        font-family: PingFangSC-Medium;
        font-size: 18px;
      }
    }
  }
  .copyright{
    padding: 11.5px 0 12px;
    text-align: center;
    background: #243B60;
    p{
      opacity: 0.3;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #FFFFFF;
      line-height: 20px;
    }
  }
}

</style>