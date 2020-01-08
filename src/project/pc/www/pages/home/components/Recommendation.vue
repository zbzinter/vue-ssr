<template>
  <div class="recommendation">
    <div class="recommendation-container">
      <h2 class="head-title">
        精彩推荐
        <span>
          RECOMMEND
        </span>
      </h2>
      <div class="container">
        <div class="left common">
          <VideoList
            v-for="(item,index) in recommendationArray[1]"
            :key="index"
            :item="item"
          />
        </div>

        <div class="middle common">
          <VideoMiddle
            v-for="(item,index) in recommendationArray[0]"
            :key="index"
            :size="size"
            :item="item"
          />
        </div>

        <div class="right common">
          <VideoList
            v-for="(item,index) in recommendationArray[2]"
            :key="index"
            :item="item"
          />
        </div>
      </div>

      <div class="recommendation-list">
        <div class="content">
          <NewsList
            v-for="(item,index) in recommendationArray[3]"
            :key="index"
            :item="item"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  // banner linkType 0 足球赛事  1 篮球赛事  2 图文资讯  3 视频资讯  4 直播间
//精彩推荐目前只能显示视频和图文  其他(篮球、足球、直播等可以通过管理后台配置的数据均会被过滤掉)

import play from '../../../assets/home/home_ic_video_50.svg'
import smallPlay from '../../../assets/home/home_ic_video_16.svg'

export default {
  name:'Recommendation',
  components:{
    VideoList:()=>import('./common/VideoList'),
    NewsList:()=>import('./common/NewsList'),
    VideoMiddle:()=>import('./common/VideoMiddle'),
  },
  props: {
    recommendationArray: {
      default: () => [],
      type: Array
    }
  },
  data(){
    return{
      play:play,
      smallPlay:smallPlay,
      dataList:[],
      leftArray:[],
      middleArray:[],
      rightArray:[],
      bottomFiveArray:[

      ],
      size:{
        width:706,
        height:397
      }
    }
  },

}
</script>

<style lang="scss" scoped>
  .recommendation {
    position: relative;
    width: 100%;
    height: 600px;
    background-color: #fff;
    clear: both;
    .recommendation-container{
      width: 1200px;
      padding-top: 40px;
      margin: 0 auto;
      h2.head-title{
        font-size:22px;
        color: #333;
        span{
          padding-left: 10px;
          font-family: PingFangSC-Medium;
          font-size: 20px;
          color: #E3E3E3;
        }
      }
      .container{
        margin-top: 30px;
        display: inline-block;
        height: 397px;
        .common{
          position: relative;
        }
        .left{
          float: left;
          height: 397px;
          width: 232px;
          box-sizing: border-box;
          overflow: hidden;
          padding-right: 14px;
          border-right: 1px solid #f4f4f4;
          padding-bottom: 14px;

        }
        .middle{
          float: left;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
          width: 734px;
          border-right: 1px solid #f4f4f4;
          padding:0 14px
        }
        .middle{
          float: left;
          box-sizing: border-box;
          overflow: hidden;
          position: relative;
          width: 734px;
          border-right: 1px solid #f4f4f4;
          padding:0 14px
        }
        .middle:hover {
          .play {
            opacity: 0;
          }
          .cover-img {
            transform: scale(1.1);
            transition: transform 3s cubic-bezier(.19,1,.22,1);
          }
        }
        .right{
          width: 232px;
          float: left;
          padding-left: 14px;
          box-sizing: border-box;
          overflow: hidden;

        }
      }
      .recommendation-list{
        position: relative;
        margin-top: 10px;
        padding-top: 11px;
        width: 1200px;
        border-top: 1px solid #E9E9E9;
        clear: both;
        .content{
          box-sizing: border-box;
          overflow: hidden;

        }
      }
    }


  }

</style>
