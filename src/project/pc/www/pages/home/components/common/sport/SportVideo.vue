<template>
  <div
    class="item-list"
  >
    <router-link
      :to="`/news/${item.channelId}/${item.articleId}`"
      target="_blank"
    >
    <div class="images-type">
      <background-img
        ref="imgBox"
        :src="item.imageAddress?item.imageAddress:(item.images&&item.images[0])?item.images[0]:''"
        :size="size"
        :is-video="!!item.mediaPath"
        class="cover-img"
      />
      <img
        v-if="(item.linkType===3||item.mediaPath)"
        :src="smallPlay"
        alt=""
        class="small-play"
      >
      <div class="play">

      </div>
    </div>

    <div class="item-info">
      <span
        v-if="item.articleTitle"
        class="title"
        :title="item.articleTitle"
      >
        {{ item.articleTitle }}
      </span>
    </div>
    </router-link>
  </div>
</template>

<script>


import play from '../../../../../assets/home/home_ic_video_50.svg'
import smallPlay from '../../../../../assets/home/home_ic_video_16.svg'
import BackgroundImg from '@src/components/BackgroundImg'
export default {
  name:'SportsNews',
  components: {
    BackgroundImg
  },
  props: {
    item: {
      default: () => [],
      type: Object
    }
  },
  data(){
    return{
      play:play,
      smallPlay:smallPlay,
      size:{
        width:262,
        height:148
      }
    }
  },

}
</script>

<style lang="scss" scoped>

  .item-list{
    box-sizing: border-box;
    overflow: hidden;
    float: left;
    width: 262px;
    height: 190px;
    margin-right: 16px;
    cursor: pointer;
    .images-type{
      width: 262px;
      height: 148px;
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
      .cover-img{
        width: 262px;
        height: 148px;
        box-sizing: border-box;
        overflow: hidden;
        display: block;

        background: rgba(0,0,0,0.30);
        transition: transform 3s cubic-bezier(.19,1,.22,1);
      }
      img.small-play{
        display: block;
        position: absolute;
        width: 20px;
        height: 20px;
        top:118px;
        left: 10px;

      }
      .play {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity:0;
        background: rgba(0, 0, 0, 0.3);
        transition: transform 3s cubic-bezier(.19,1,.22,1);
        .svg-icon {
          font-size: 12px;
        }
      }
    }
    .video-type{

    }
    .item-info{
      margin-top: 6px;
      span{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666;
        letter-spacing: 0;
        line-height: 17px
      }

      .title{
        display:block;
        cursor: pointer;
        font-family: PingFangSC-Medium;
        float: left;
        width:260px;
        height: 23px;
        margin-bottom: 13px;
        line-height: 23px;
        font-size: 16px;
        color: #333;
        letter-spacing: 0;
        text-overflow:ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }

    }
  }
  .item-list:hover {
    .images-type{
      .play {
        opacity: 1;
        transition: transform 3s cubic-bezier(.19,1,.22,1);
      }
      .cover-img {
        transform: scale(1.1);
        transition: transform 3s cubic-bezier(.19,1,.22,1);
      }
    }
    .item-info{
      .title{
        color: #3683ff;
        transition: transform 3s cubic-bezier(.19,1,.22,1);
      }
    }


  }
  .item-list:nth-child(even){
    margin-right: 0;
  }
  .item-list:nth-child(1),.item-list:nth-child(2){
    margin-bottom: 6px;
    border-bottom: 1px solid #f4f4f4;
  }
  .item-list:nth-child(3),.item-list:nth-child(4){
    margin-top: 6px;
  }
</style>
