<!--共用组件-->
<!--此组件用于精彩推荐和体坛快讯-->
<!--两个组件调用接口返回数据参数字段不一样-->
<template>
  <div
    class="content"
  >
    <router-link
      :to="`/news/${item.channelId}/${item.articleId||item.ceefaxId}`"
      target="_blank"
    >
      <div
        class="images-type"
      >
        <background-img
          ref="imgBox"
          :src="item.imageAddress?item.imageAddress:(item.images&&item.images[0])?item.images[0]:''"
          :size="size"
          :is-video="!!item.mediaPath"
          class="cover-img"
        />
        <img
          v-if="(item.linkType===3||item.mediaPath)"
          :src="play"
          class="small-play"
        >
        <div class="play" />
        <div
          class="middle-item-info"
        >
          <div
            class="info"
            :style="{'margin-left':(item.linkType==3||item.mediaPath)?'76px':'16px'}"
          >
            <span
              v-if="item.tagName"
              class="program"
            >{{ item.tagName }}</span>
            <span
              v-if="item.tagName&&(item.authorName||item.author)"
              class="line"
            >|</span>
            <!-- 新闻推荐模块字段是authorName  表示作者名称-->
            <!-- 体坛快讯模块字段是author    表示作者名称-->
            <span
              v-if="item.authorName||item.author"
              class="author"
            >{{ item.authorName? item.authorName:item.author?item.author:'' }}</span>
            <span
              v-if="item.articleTitle||item.title"
              class="title"

              :class="{'long-title':(item.linkType!=3),'no-auth':(!(item.tagName||item.authorName))}"
            >{{ item.articleTitle?item.articleTitle:item.title?item.title:'' }}</span>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
// linkType 0 足球赛事  1 篮球赛事  2 图文资讯  3 视频资讯  4 直播间
import play from '../../../../assets/home/home_ic_video_50.svg'
import smallPlay from '../../../../assets/home/home_ic_video_16.svg'
import BackgroundImg from '@src/components/BackgroundImg'
export default {
  name:'VideoMiddle',
  components: {
    BackgroundImg
  },
  props: {
    item: {
      default: () => [],
      type: Object
    },
    size:{
      type:Object,
      default:()=>{
        return{

        }
      }
    },
  },
  data(){
    return{
      play:play,
      smallPlay:smallPlay,
    }
  },
  watch:{

  },

}
</script>

<style lang="scss" scoped>
  .content{
    width: 706px;
    height: 397px;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    .images-type{
      width: 706px;
      height: 397px;
      box-sizing: border-box;
      overflow: hidden;
      img.small-play{
        position: absolute;
        left:16px ;
        top:330px;
        width: 50px;
        height: 50px;
        z-index: 99;
        cursor: pointer;
      }
       .cover-img{
        width: 706px;
        height: 397px;
        background: rgba(0,0,0,0.3);
        box-sizing: border-box;
        background-size: cover!important;
        overflow: hidden;
        cursor: pointer;
        transition: transform 3s cubic-bezier(.19,1,.22,1);
      }
      .play {
        cursor: pointer;
        position: absolute;
        left: 0;
        top: 0;
        width: 706px;
        height: 397px;
        opacity:0;
        background: rgba(0, 0, 0, 0.3);
        transition: transform 3s cubic-bezier(.19,1,.22,1);
        .svg-icon {
          font-size: 50px;
        }
      }
    }
  }
  .middle-item-info{
    display: block;
    position: absolute;
    z-index: 9;
    top: 314px;
    width: 100%;
    height: 82px;
    background: -moz-linear-gradient( rgba(0,0,0,0) , rgba(0,0,0,0.6));
    background: -webkit-linear-gradient( rgba(0,0,0,0) , rgba(0,0,0,0.6));
    background: linear-gradient( rgba(0,0,0,0) , rgba(0,0,0,0.6));
    img{
      display: block;
      width:50px;
      height: 50px;
      float: left;
      text-align: center;
      margin-left: 16px;
    }
    .info{
      float: left;
      display: block;
      box-sizing: border-box;
      padding-top: 16px;
      width: 100%;
      span{
        color: #fff;
      }
      .title{
        font-family: PingFangSC-Medium;
        cursor: pointer;
        display: block;
        width: 420px;
        font-size: 18px;
        margin-top: 6px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
    }

  }
  .content:hover {
    .play {
      opacity: 1;
      transition: transform 3s cubic-bezier(.19,1,.22,1);
    }
    .cover-img {
      transform: scale(1.1);
      transition: transform 3s cubic-bezier(.19,1,.22,1);
    }

  }

</style>
