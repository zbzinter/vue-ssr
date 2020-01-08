<template>
  <div
    class="item-list"
  >
    <router-link
      :to="`/news/${item.channelId}/${item.articleId}`"
      target="_blank"
    >
      <p
        v-if="item.articleTitle"
        class="title"
        :title="item.articleTitle"
      >
        {{ item.articleTitle }}
      </p>
      <p class="info">
      <span
        v-if="item.publishTime"
        class="date"
      >{{ item.publishTime |filterFun }}</span>
        <span
          v-if="item.publishTime&&item.authorName"
          class="line"
        >|</span>
        <span
          v-if="item.authorName"
          class="author"
        >{{ item.authorName }}</span>
      </p>
      <div class="article">
        <p>{{ item.articleSummary?item.articleSummary:item.articleTitle?item.articleTitle:'' }}</p>

        <background-img
          ref="imgBox"
          :src="item.imageAddress?item.imageAddress:(item.images&&item.images[0])?item.images[0]:''"
          :size="size"
          :is-video="!!item.mediaPath"
          class="cover-img"
        />
      </div>
    </router-link>


  </div>
</template>

<script>


export default {
  name:'NewsTxtList',
  components: {
    BackgroundImg:()=>import('@src/components/BackgroundImg')
  },
  filters: {
    filterFun: function (value) {
      if(value&& value.length > 10) {
        value= value.substring(0,10)
      }
      return value
    }
  },

  props: {
    item: {
      default: () => [],
      type: Object
    }
  },
  data(){
    return{
      size:{
        width:52,
        height:52
      }
    }
  },


}
</script>

<style lang="scss" scoped>
  .item-list{
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
    margin-bottom: 3px;
    height:126px ;
    clear: both;
    padding-bottom: 4px;
    border-bottom: 1px solid #f4f4f4;
    cursor: pointer;
    .title{
      margin-top: 15px;
      cursor: pointer;
      font-family: PingFangSC-Medium;
      font-weight: bold;
      font-size: 14px;
      color: #333;
      letter-spacing: 0;
      text-overflow:ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
    .line{
      padding:0 2px;
      color: #999;
    }
    .info{
      font-family: PingFangSC-Regular;
      color: #999;
      letter-spacing: 0;
      span{
        font-size: 11px;
      }
      .date{
        color: #999;
      }
    }
    .article{
      .cover-img{
        width: 52px;
        height: 52px;

        display: block;
        float: left;
      }
      p{
        float: left;
        width: 185px;
        font-family: PingFangSC-Regular;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
        font-size: 12px;
        color: #666;
        letter-spacing: 0;
      }
    }
  }
  .item-list:hover{
    .title{
      color: #3683ff;
    }
  }
  .item-list:nth-child(1){
    .title{
      margin: 0;
    }
  }
  .item-list:nth-child(3){
    border-bottom: none;
  }
</style>
