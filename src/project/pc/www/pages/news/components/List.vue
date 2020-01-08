<template>
  <div class="news-list">
    <div
      v-if="!flag"
      class="header"
    >
      <ul>
        <li
          v-for="item in navs[0]"
          :key="item.channelId"
          :class="channelId==item.channelId ? 'active' : ''"
          @click="handleClick(item.channelId,item.channelTitle,navs[0].length)"
        >
          <router-link
            :to="`/news/${item.channelId}`"
            class="analyze"
            target="_self"
          >
            {{ item.channelTitle }}
          </router-link>
        </li>
      </ul>
      <p
        v-show="showChannelTitle"
        class="arrow-down"
        :class="channelTitle ? 'active' : ''"
        @mouseover="mouseover"
      >
        {{ channelTitle }}
        <i
          class="iconfont"
          :class="{'iconpackup':showMore,'iconunfold':!showMore}"
        />
      </p>
    </div>
    <div
      v-show="showMore"
      class="more"
      @mouseover="mouseover"
      @mouseleave="mouseleave"
    >
      <ul class="hide-list">
        <li
          v-for="(item) in navs[1]"
          :key="item.channelId"
          :class="channelId === item.channelId ? 'active' : ''"
          @click="handleClick(item.channelId,item.channelTitle,navs[1].length)"
        >
          <router-link
            :to="`/news/${item.channelId}`"
            class="analyze"
            target="_self"
          >
            {{ item.channelTitle }}
          </router-link>
        </li>
      </ul>
    </div>
    <HeaderNav
      v-if="flag"
      :title="tag"
      @returnNews="returnNews()"
    />
    <div
      v-if="list.length>0"
      class="content"
    >
      <Spin
        v-if="spinShow"
        fix
      >
        <Icon
          type="ios-loading"
          size="18"
          class="spin-icon-load"
        />
        <div>Loading</div>
      </Spin>
      <p
        v-if="flag"
        class="current-tag"
      >
        <span>{{ tag }}</span>
        <span class="pl">相关资讯</span>
      </p>
      <div id="init-one">
        <NewsItem
          v-for="(item,index) in list"
          :key="index"
          :item="item"
          :flag="flag"
          @getTagDetails="getTagDetails"
        />
        <Page
          class="page-comm"
          show-elevator
          :page-size="pageSize"
          :total="total"
          :current="currentPage"
          size="small"
          show-total
          @on-change="pageNoChange"
        />
      </div>
    </div>
    <div
      v-if="showData"
      class="content"
    >
      <p
        class="no-data"
      >
        暂无数据
      </p>
    </div>
  </div>
</template>

<script>

import { getServerConf } from '@config/apiConf'
import { Page, Spin, Icon } from 'iview'
let newsUrl = getServerConf().apiInfo.newsUrl

export default {
  components: {
    NewsItem:()=>import('./NewsItem'),
    Spin,
    Icon,
    Page,
    HeaderNav:()=>import('./HeaderNav')
  },
  props: {
    navs: {
      default: () => [],
      type: Array,
    },
    list: {
      default: () => {},
      type: Array,
    },
    listArray:{
      default: () => {},
      type: Array,
    },
    total:{
      default:0,
      type:Number
    },
  },

  data() {
    return {
      flag: false,
      showChannelTitle: false,
      showMore: false,
      activeIndex: 0,
      currentPage: 1,
      pageSize: 10,
      showData: false,
      spinShow:false,
      tag: '',
      listShow:false,
      dataList:[],
      channelId:'',
      totalNum:0,
      channelTitle:'更多'
    }
  },
  watch:{
    '$route'(to,from){
      if(to.params.channelId!=from.params.channelId){
        this.channelId=to.params.channelId||187
        this.articleType=(this.channelId==188)?'2':''
        this.currentPage=1

        if(window){
          let obj={
            'channelId': this.channelId,
            'articleType':this.articleType,
            'currentPage':this.currentPage
          }
          this.$store.dispatch('news/getNewsData',obj)
        }
      }
    },
    list(){
      this.showData=this.list.length==0?true:false
    }
  },

  mounted(){
    this.channelId=this.$route.params.channelId||187
    this.articleType=(this.channelId==188)?'2':''

    console.warn()
    this.$nextTick(()=>{
      setTimeout(()=> {
        let defaultArray = []
        this.listArray.forEach((item) => {
          defaultArray.push(item.channelId)
        })
        let index = defaultArray.indexOf(Number(this.channelId))
        console.warn(index)
        this.channelTitle = index >=12?this.listArray[index].channelTitle : '更多'
        this.showChannelTitle=true

      },500)
    })

  },
  methods: {
    pageNoChange (currentPage) {
      let obj={
        'channelId': this.channelId,
        'articleType':this.articleType,
        'currentPage':currentPage?currentPage:1,
      }
      this.currentPage = currentPage
      this.$store.dispatch('news/getNewsData',obj)
    },
    handleClick(channelId,channelTitle,length) {
      this.channelId=channelId
      this.channelTitle=length<=4?channelTitle:'更多'
    },
    getTagDetails(tag) {
      this.tag = tag
      this.title = this.tag
      this.flag = true
      this.getContent()
    },

    returnNews() {
      this.tag = ''
      this.getContent()
    },
    mouseover(){
      this.showMore=true
    },
    mouseleave (){
      this.showMore=false
    },

  }
}
</script>


<style lang="scss" scoped>
  $font: "Microsoft YaHei";
  .page-comm {
    font-family: $font;
    text-align: center;
    margin-top: 35px;
  }
  /deep/ .ivu-page-item a {
    font-family: $font;
  }
  /deep/ .ivu-page-options-elevator {
    input {
      font-family: $font;
    }
  }
  .news-list {
    width: 816px;
    .header {
      position: relative;
      line-height: 1.6;
      background: #fff;
      padding: 14px 20px;
      box-shadow: 0 6px 24px 0 rgba(0,0,0,0.04);
      border-radius: 4px;
      ul{
        li {
          font-family: PingFangSC-Regular;
          display: inline;
          padding-right: 28px;
          font-size: 14px;
          color: #333;
          letter-spacing: 0;
          line-height: 26px;
          cursor: pointer;
          &:hover {
            color: #3683FF;
          }
        }
        li.active {
          font-family: PingFangSC-Medium;
          a{
            color: #3683FF;
          }
        }
      }
      p.arrow-down{
        position: absolute;
        z-index: 999;
        padding: 20px;
        right: 0;
        top:-8px;
        display: inline-block;
        font-size: 14px;
        color: #333;
        letter-spacing: 0;
        line-height: 26px;
        cursor: pointer;
        i{
          font-size:20px;
        }
      }
      p.arrow-down:hover, p.arrow-down.active{
        color: #3683FF;
      }
    }
    .more{
      width: 816px;
      height: 50px;
      z-index: 99;
      padding-left: 20px;
      background-color: #fff;
      position: absolute;
      transition: transform 5s cubic-bezier(.19,1,.22,1);
      ul{
        display: inline-block;
        margin-bottom: 5px;
        li {
          font-family: PingFangSC-Regular;
          display: inline;
          padding-right: 27px;
          font-size: 14px;
          color: #333;
          letter-spacing: 0;
          line-height: 26px;
          cursor: pointer;
          &:hover {
            color: #3683FF;
          }
        }
        li.active {
          font-family: PingFangSC-Medium;
          color: #3683FF;
        }
      }
    }
    .content {
      margin-top: 18px;
      background: #fff;
      min-height: 200px;
      position: relative;
      padding-bottom: 20px;
      #init-two{
        display: none;
      }
      .no-data {
        line-height: 200px;
        text-align: center;
        color: #666;
      }
      .current-tag {
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #333333;
        letter-spacing: 0;
        line-height: 27px;
        padding: 20px 0 0 20px;
        font-weight: 700;
      }

    }
  }
</style>
