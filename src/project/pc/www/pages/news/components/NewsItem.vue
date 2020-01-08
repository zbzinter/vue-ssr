<template>
  <div
    class="item article clearfix"
  >
    <router-link
      :to="`/news/${item.channelId}/${item.articleId}`"
      target="_blank"
    >
      <background-img
        ref="imgBox"
        :src="item.images[0]?item.images[0]:''"
        :size="size"
        class="img fl"
        :is-video="!!item.mediaPath"
      />
      <div class="desc fl">
        <a
          class="headline"
        >
          {{ item.articleTitle }}
        </a>
        <div class="intro">
          <div
            v-if="item.articleSummary"
            class="text-box"
            v-html="item.articleSummary"
          />
        </div>
        <div class="bottom">
          <span
            v-if="getMarkClass(item.status)"
            :class="getMarkClass(item.status)"
          >{{ (item.status&&item.status== '1')?'热门':(item.status&&item.status== '2')?'置顶':'' }}
          </span>
          <div
            class="iblock"
          >
            <span
              v-if="item.tagName"
              class="tag"
              @click.stop="getTagDetails(tag)"
            >
              {{ item.tagName }}
            </span>
            <span class="time">{{ item.publishTimeStr }}</span>
          </div>
          <div class="comment">
            <div class="comment-content">
              <img :src="commentImg">
              <span>{{ item.articleCommentCount }}</span>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import commentImg from '../../../assets/news/comment@1x.png'
export default {
  components: {
    BackgroundImg:()=>import('@src/components/BackgroundImg')
  },
  props: {
    item: {
      default: () => {},
      type: Object
    },
    flag: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      commentImg:commentImg,
      size:{
        width:209,
        height:146
      }
    }
  },
  methods: {
    getMarkClass (item) {
      if (item&&item==1) {
        return 'hot'
      }
      if (item&&item==2) {
        return 'top'
      }
      return ''
    },

    getTagDetails(tag) {
      this.$emit('getTagDetails', tag)
    }

  }
}
</script>

<style lang="scss" scoped>
  video {
    display: none;
  }
  .item {
    padding: 20px;
    border-bottom: solid 1px #f5f5f5;
    .img {
      border-radius: 4px;
      width: 160px;
      height: 100px;
      display: inline-block;
      background-color: #f5f5f5;
      cursor: pointer;
    }
    .desc {
      margin-left: 20px;
      .headline {
        display: block;
        font-family:PingFangSC;
        font-size: 18px;
        font-weight:500;
        color: #333;
        letter-spacing: 0;
        line-height: 30px;
        width: 596px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
          color: #3683FF;
        }
        &:visited {
          color: #666;
        }
      }
      .intro {
        font-family: PingFangSC-Regular;
        width: 546px;
        height: 44px;
        padding-top: 8px;
        line-height: 22px;
        font-size: 12px;
        color: #666;
        letter-spacing: 0;
        text-align: justify;
        display: inline-block;
        overflow: hidden;
        .text-box {
          cursor: text;
        }
      }
      .top, .hot {
        border: 1px solid #3683FF;
        border-radius: 4px;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #3683FF;
        text-align: center;
        line-height: 18px;
        padding: 0 12px;
        display: inline-block;
        margin-right: 10px;
        cursor: text;
        &.hot {
          border-color: #F82301;
          color: #F82301;
        }
        user-select:none;
      }
      .hot {
        color: #F82301;
        border-color: #F82301;
      }
      .time {
        display: inline-block;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #999;
        letter-spacing: 0;
        line-height: 14px;
        user-select:none;
      }
      .comment{
        float: right;
        .comment-content{
          display: flex;
          align-items: center;
          span{
            padding-left: 6px;
            line-height: 15px;
          }
        }

      }


    }

  }
  .item:last-child{
    border:none;
  }
</style>
