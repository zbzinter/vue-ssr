<template>
  <div
    v-if="list.length>0"
    class="express"
  >
    <p class="title">
      <span class="all-icon iconfont iconbw_ff" />
      <span class="title—text">{{ title }}</span>
    </p>
    <div
      class="content"
    >
      <div
        v-for="(item,index) in list"
        :key="index"
        class="item clearfix"
      >
        <router-link
          :to="`/news/${item.channelId}/${item.articleId}`"
          :target="target"
        >
          <background-img
            class="img fl"
            :src="item.images[0]?item.images[0]:''"
            :size="bgSize"
            :is-video="!!item.mediaPath"
          />
          <div
            class="desc fl"
          >
            {{ item.articleTitle }}
          </div>
        </router-link>
      </div>

      <div
        v-if="article.length>0"
        class="article-title"
      >
        <router-link
          :to="`/news/${item.channelId}/${item.articleId}`"
          :target="target"
        >
          <p
            v-for="(item, index) in article"
            :key="index"
          >
            {{ item.articleTitle }}
          </p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import BackgroundImg from '@src/components/BackgroundImg'
import { getServerConf } from '@config/apiConf'
let newsUrl = getServerConf().apiInfo.newsUrl

export default {
  name:'RecommendNews',
  components: {
    BackgroundImg
  },
  props: {

    size: {
      type: Number,
      default: 6
    },
    title: {
      type: String,
      default: '新闻快讯'
    },
    list:{
      type:Array,
      default: () => [],
    },
    target:{
      type:String,
      default:'_blank'
    }

  },
  data () {
    return {
      userInfo: '',
      channelId: '',
      articleId: '',
      article: [],
      navs:[],
      bgSize:{
        width:90,
        height:64
      }
    }
  },

}
</script>

<style lang="scss" scoped>
  .express {
    width: 364px;
    background: #FFF;
    box-shadow: 0 6px 24px 0 rgba(0,0,0,0.04);
    border-radius: 4px 4px 0 0;
    margin-bottom: 20px;
    .title {
      height: 56px;
      line-height: 56px;
      padding-left: 20px;
      &-text {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #666;
        line-height: 16px;
      }
    }
    .content {
      padding:  0 20px;
    }
    .item {
      padding-bottom: 20px;
      cursor: pointer;
    }
    .img {
      border-radius: 4px;
      width: 90px;
      height: 64px;
      display: inline-block;
      background-color: #f5f5f5;
    }
    .desc {
      font-family: PingFangSC-Medium;
      margin-left: 18px;
      width: 216px;
      font-size: 14px;
      color: #171928;
      letter-spacing: 0;
      text-align: justify;
      line-height: 22px;
      height: 44px;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      display: -webkit-box;
    }
  }
  .article-title {
    padding-bottom: 20px;
    cursor: pointer;
    p {
      font-size: 14px;
      color: #333;
      letter-spacing: 0;
      text-align: justify;
      line-height: 22px;
      margin-bottom: 20px;
      cursor: pointer;
    }
  }
</style>
