<template>
  <div
    class="item-content"
  >
    <div class="item">
      <div class="images-type">
        <router-link
          :to="`/news/${item.channelId}/${item.ceefaxId}`"
          target="_blank"
          style="display: block"
        >
          <div class="back-img">
            <background-img
              ref="imgBox"
              :src="item.imageAddress?item.imageAddress:(item.images&&item.images[0])?item.images[0]:''"
              :size="size"
              :is-video="!!item.mediaPath"
              class="cover-img"
            />
          </div>

          <img
            v-if="(item.linkType===3||item.mediaPath)"
            :src="smallPlay"
            class="small-play"
          >
          <div class="play" />

          <div class="item-info">
            <span
              v-if="item.tagName"
              class="tags-name"
            >{{ item.tagName }}
            </span>
            <span
              v-if="item.tagName&&item.author"
              class="line"
            >|</span>
            <span
              v-if="item.author"
              class="author"
            >{{ item.author }}</span>
            <p
              v-if="item.title"
              class="title"
            >
              {{ item.title }}
            </p>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
// banner linkType 0 足球赛事  1 篮球赛事  2 图文资讯  3 视频资讯  4 直播间

import play from '../../../../assets/home/home_ic_video_50.svg'
import smallPlay from '../../../../assets/home/home_ic_video_16.svg'
import BackgroundImg from '@src/components/BackgroundImg'
export default {
  name:'VideoList',
  components: {
    BackgroundImg
  },
  props: ['item'],
  data(){
    return{
      play:play,
      smallPlay:smallPlay,
      size:{
        width:218,
        height:122
      }
    }
  },
}
</script>

<style lang="scss" scoped>
    .item-content{
      box-sizing: border-box;
      overflow: hidden;
      width: 218px;
      border-bottom: 1px solid #E9E9E9;
      .item{
        width: 218px;
        height: 195px;
        cursor: pointer;
        box-sizing: border-box;
        overflow: hidden;
        .images-type{
          width: 218px;
          box-sizing: border-box;
          position: relative;
          .back-img{
            width: 218px;
            height: 122px;
            box-sizing: border-box;
            overflow: hidden;
            .cover-img{
              position: relative;
              width: 218px;
              height: 122px;
              box-sizing: border-box;
              overflow: hidden;
              background-color: rgba(0,0,0,0.30);
              background-size: cover!important;
              transition: transform 3s cubic-bezier(.19,1,.22,1);
            }
          }

          img.small-play{
            position:absolute;
            width: 16px;
            height: 16px;
            left: 10px;
            top:98px;
          }
          .play {
            position: absolute;
            left: 0;
            top: 0;
            width: 218px;
            height: 122px;
            opacity:0;
            background: rgba(0, 0, 0, 0.3);
            transition: transform 3s cubic-bezier(.19,1,.22,1);
            img{
              width: 20px;
              height: 20px;
              text-align: center;
              margin-left: 10px;
              margin-top:92px;
            }
            .svg-icon {
              font-size: 12px;
            }
          }
        }
        .item-info{
          position: relative;
          margin-top: 2px;
          span{
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #666;
            letter-spacing: 0;
            line-height: 17px
          }
          .line{
            padding:0 2px;
            color: #999;
          }
          .tags-name{

          }
          .author{
            font-size: 12px;
            color: #999;
            letter-spacing: 0;
            line-height: 17px;
          }
          .title{
            cursor: pointer;
            display: block;
            font-family: PingFangSC-Medium;
            box-sizing: border-box;
            line-height: 20px;
            width: 216px;
            height:44px ;
            overflow-y: hidden;
            word-wrap:break-word;
            word-break:break-all;
            margin-top: 4px;
            font-size: 14px;
            color: #333;
            letter-spacing: 0;
          }

        }

      }
       &:hover {
         .images-type{
           .play {
             opacity: 1;
             transition: transform 3s cubic-bezier(.19,1,.22,1);
           }
         }

         .cover-img {
           transform: scale(1.1);
           transition: transform 3s cubic-bezier(.19,1,.22,1);
         }
         .item-info{
           .title{
             color: #3683ff;
           }
         }
       }
    }
   .item-content:nth-child(2) {
     border-bottom: none;
     .item{
       .images-type{
         margin-top: 10px;
       }

     }

   }


</style>
