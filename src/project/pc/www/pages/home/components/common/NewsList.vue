<template>
  <div
    class="item-list fl"
  >
    <router-link
      :to="`/news/${item.channelId}/${item.ceefaxId}`"
      target="_blank"
    >
      <background-img
        ref="imgBox"
        :src="item.imageAddress?item.imageAddress:(item.images&&item.images[0])?item.images[0]:''"
        :size="size"
        :is-video="!!item.mediaPath"
        class="cover-img"
      />
      <div class="info">
        <span
          v-if="item.tagName"
          class="tagName"
        >{{ item.tagName }}</span>
        <span
          v-if="item.tagName&&item.author"
          class="line"
        >|</span>
        <span
          v-if="item.author"
          class="author"
        >{{ item.author }}</span>
        <span
          v-if="item.title"
          class="title"
        >{{ item.title }}
        </span>
      </div>
      <div class="article">
        {{ item.article }}
      </div>
    </router-link>
  </div>
</template>

<script>

import play from '../../../../assets/home/home_ic_video_50.svg'
import smallPlay from '../../../../assets/home/home_ic_video_16.svg'
import BackgroundImg from '@src/components/BackgroundImg'
export default {
  name:'NewsList',
  components: {
    BackgroundImg
  },
  props: ['item'],
  data(){
    return{
      play:play,
      smallPlay:smallPlay,
      size:{
        width:60,
        height:60
      }
    }
  },

}
</script>

<style lang="scss" scoped>

  .item-list{
    display: inline-block;
    width: 245px;
    box-sizing: border-box;
    overflow: hidden;
    border-right:1px solid #f4f4f4 ;
    cursor: pointer;
    .cover-img{
      display: block;
      box-sizing: border-box;
      overflow: hidden;
      width: 60px;
      height: 60px;
      float: left;

      margin-left: 14px;
      margin-right: 8px
    }
    .info{
      span{
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666;
        letter-spacing: 0;
        line-height: 17px;
        vertical-align: top;
      }
      .tagName{
        display: inline-block;
        max-width: 84px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .author{
        color: #999;
        width:50px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap;
      }
      .title{
        cursor: pointer;
        font-family: PingFangSC-Medium;
        display: block;
        margin-left: 68px;
        margin-top: 7px;
        width: 150px;
        height: 32px;
        line-height: 16px;
        font-size: 12px;
        color: #333;
        letter-spacing: 0;
        overflow-y: hidden;
        word-wrap: break-word;
        word-break: break-all;
      }
      .line{
        display: inline-block;
        padding:0 2px;
        color: #999;
      }
    }
    .article{
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #666;
      letter-spacing: 0;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }

  }
  .item-list:nth-child(1){
    width:232px;
    .cover-img:nth-child(1){
     margin-left: 0;
    }
  }
  .item-list:nth-child(5){
    width:232px;
    border-right: 0;
  }
  .item-list:hover{
     .info{
       .title{
         color: #3683ff;
         letter-spacing: 0;
       }
     }
   }

</style>
