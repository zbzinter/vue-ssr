<template>
  <div class="sports-news">
    <div class="sports-news-container">
      <h2 class="head-title">
        体坛快讯
        <span>
          NEWS
        </span>
      </h2>
      <div
        class="fr more"
        @click="more"
      >
        更多 <i class="iconfont iconfs_dj1" />
      </div>
    </div>
    <div class="container">
      <div class="left">
        <VideoMiddle
          v-for="(item,index) in matchNewsList[0]"
          :key="index"
          class="sports-news-left"
          :item="item"
          :size="size"
        />
      </div>

      <div class="middle">
        <SportVideo
          v-for="(item,index) in matchNewsList[1]"
          :key="index"
          :item="item"
        />
      </div>

      <div class="right">
        <NewsTxtList
          v-for="(item,index) in matchNewsList[2]"
          :key="index"
          :item="item"
        />
      </div>
    </div>
  </div>
</template>

<script>
// banner linkType 0 足球赛事  1 篮球赛事  2 图文资讯  3 视频资讯  4 直播间

import play from '../../../assets/home/home_ic_video_50.svg'
import SportVideo from './common/sport/SportVideo'
import NewsTxtList from './common/sport/NewsTxtList'
import VideoMiddle from './common/VideoMiddle'
export default {
  name:'SportsNews',
  components:{
    SportVideo,
    NewsTxtList,
    VideoMiddle,
  },
  props: {
    matchNewsList: {
      default: () => [],
      type: Array
    }
  },
  data(){
    return{
      play:play,
      dataList:[],
      channelId:'',  //资讯channelId 咨询类别
      articleId:'',  //资讯详情 articleId 咨询类别下 文章标识
      size:{
        width:378,
        height:378
      }
    }
  },
  methods:{
    more() {
      this.$router.openNewPage({
        path: '/news'
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .sports-news {
    position: relative;
    width: 100%;
    height: 540px;
    background-color: #fff;
    clear: both;
    .sports-news-container{
      width: 1200px;
      padding-top: 50px;
      margin: 0 auto;
      h2.head-title{
        font-size: 22px;
        color: #333;
        span{
          padding-left: 10px;
          font-family: PingFangSC-Medium;
          font-size: 20px;
          color: #E3E3E3;
        }
      }
      .more{
        cursor: pointer;
        i{
          color: #3683ff;
        }
      }
      .more:hover{
        color: #3683ff;
      }
    }
    .container{
      margin: 30px auto 0 auto;
      clear: both;
      width: 1200px;
      .left{
        float: left;
        box-sizing: border-box;
        overflow: hidden;;
        padding-right: 8px;
        padding-bottom: 8px;
        position: relative;
        .sports-news-left{
          position: relative;
          width: 378px;
          /deep/ .images-type{
            width: 378px;
            height: 378px;
            .cover-img{
              width: 397px;
            }
            .small-play{
              top: 310px;
            }
            .play{
              width: 378px;
              height: 378px;
              left: 0;
              top:0;
            }
            .middle-item-info{
              top:296px;
              .info{
                width:280px;
                .title{
                  width: 290px;
                  margin-top: 6px;
                }
                .long-title{
                  width: 310px;
                }
                .no-auth{
                  margin-top: 30px;
                }
              }
            }
          }
        }

      }
      .middle{
        float: left;
        width: 560px;
        height: 378px;
        position: relative;
        border-right: 1px solid #f4f4f4;
        padding: 0 8px;
      }
      .right{
        float: left;
        width: 250px;
        padding-left: 8px;
        box-sizing: border-box;
        overflow: hidden;
      }
    }

  }

</style>
