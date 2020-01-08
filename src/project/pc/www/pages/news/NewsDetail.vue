<template>
  <div class="page-inner">
    <div class="clearfix">
      <div class="news-detail fl">
        <HeaderNav :title="newsDetail.articleTitle" />
        <div class="content">
          <h3 class="title">
            {{ detail.articleTitle }}
          </h3>
          <div class="author">
            <span class="author-name">
              作者：{{ newsDetail.articleAuthorNickname }}
            </span>
            <span class="time">
              发布时间：{{ newsDetail.articleCreateTime }}
            </span>
          </div>
          <div
            id="dplayer"
            class="video-box"
          />

          <div
            id="newsArticle"
            v-lazy-container
            class="txt desc-detail"
            v-html="articleContent"
          />
          <div class="mark">
            <div v-if="detail.tag">
              <span class="name">标签：</span>
              <div
                v-if="detail.tagName"
                class="iblock"
              >
                <span
                  class="tag"
                  @click.stop="getTagDetails(detail.tagName)"
                >
                  {{ detail.tagName }}
                </span>
              </div>
            </div>
            <Share v-if="ShareShow" />
          </div>
          <p class="statement">
            特别声明：以上文章内容仅代表作者本人观点，不代球会体育观点或立场。如有关于作品内容、版权问题请联系我们进行处理。
          </p>

          <!--<div class="comment-area">-->
            <!--<Comment />-->
          <!--</div>-->
        </div>
      </div>
      <div class="fr">
        <RecommendNews
          :list="recommendNewsList"
          :article="articleList"
          :target="target"
          title="相关资讯"
          :size="10"
        />
      </div>
    </div>
  </div>
</template>

<script>

let DPlayer
import 'dplayer/dist/DPlayer.min.css'
import loadingImg from '../../assets/loading.gif'
import { mapGetters} from 'vuex'

export default {
  components: {
    RecommendNews:()=>import('../../components/RecommendNews'),
    // Comment:()=>import('./components/Comment'),
    HeaderNav:()=>import('./components/HeaderNav'),
    Share:()=>import('./components/share'),
  },
  data () {
    return {
      userInfo: '',
      detail: '',
      loadingImg:loadingImg,
      options: {
        video: {
          url: ''
        }
      },
      target:'_self',
      ShareShow:false
    }
  },
  computed:{
    ...mapGetters({
      newsDetail:'news/newsDetail',
      recommendNewsList:'news/recommendNewsList',
      articleList:'news/articleList',
      articleContent:'news/articleContent',
    })
  },
  watch:{
    '$route'(to,from){
      if(to.params.articleId!=from.params.articleId){
        if(process.browser){
          let obj={
            'channelId':this.$route.params.channelId,
            'articleId':this.$route.params.articleId,
          }
          this.$store.dispatch('news/getNewsDetail',obj)
        }
      }
    },
    newsDetail(){
      document.title =this.newsDetail.articleTitle+'-球会体育'
      console.warn("数据发生变化")
      if(this.newsDetail.mediaPath){
        document.getElementById("newsArticle").style.display='none'
        document.getElementById("dplayer").style.display='block'
        this.setInfo()
      }else{
        document.getElementById("newsArticle").style.display='block'
        document.getElementById("dplayer").style.display='none'
      }

    }

  },
  created(){
    if(process.browser&&(!this.newsDetail)){

      let obj={
        'channelId':this.$route.params.channelId,
        'articleId':this.$route.params.articleId,
        'client':'web'
      }
      return this.$store.dispatch('news/getNewsDetail',obj)
    }
  },

  asyncData ({ store,route }) {
    let obj={
      'channelId':route.params.channelId,
      'articleId':route.params.articleId,
    }
    return store.dispatch('news/getNewsDetail',obj)
  },
  mounted(){
    const dplayer=require('dplayer')
    DPlayer=dplayer
    if(this.newsDetail.mediaPath){
      this.setInfo()
    }
    this.ShareShow=true
  },
  beforeDestroy(){
    document.title = '球会体育'
  },
  methods: {
    init () {
      this.getDetail()
    },

    getTagDetails(tag) {
      this.$router.push({path: '/news', query: {tag}})
    },
    setInfo(){
      this.$nextTick(() => {
        new DPlayer({
          container: document.getElementById('dplayer'),
          screenshot: true,
          video: {
            url: this.newsDetail.mediaPath
          }
        })
      })
    },
  }
}
</script>

<style lang="scss" scoped>
  .page-inner {
    margin-top: 30px;
    .statement {
      margin-top: 100px;
      width:784px;
      border-top: 1px solid #f5f5f5;
      padding-top: 19px;
      height:22px;
      font-size:14px;
      font-family:PingFangSC;
      font-weight:400;
      color:#999;
      line-height:22px;
      margin-bottom: 65px;
    }
    .mark {
      font-size: 14px;
      line-height: 30px;
      margin-bottom: 20px;
      margin-top: 30px;
      color: #666;
      .name {
        width: 42px;
        margin-right: 10px;
        display: inline-block;
      }
      .tag {
        background: #F3F3F3;
        border-radius: 4px;
        display: inline-block;
        font-size: 12px;
        height: 20px;
        line-height: 20px;
        color: #999999;
        margin-right: 4px;
        padding: 0 10px;
        cursor: pointer;
        &:hover {
          color: #ffffff;
          background: #3683FF;
        }
      }
    }
    .news-detail {
      width: 816px;
    }
    .content {
      margin-top: 18px;
      background: #fff;
      padding: 20px;
      box-shadow: 0 6px 24px 0 rgba(0,0,0,0.04);
      border-radius: 4px 4px 0 0;
      .title {
        font-size: 20px;
        color: #333;
        margin-bottom: 16px;
      }
      .author {
        color: #999;
        font-size: 12px;
        margin-bottom: 42px;
        .author-name {
          margin-right: 52px;
        }
      }
      .txt {
        font-size: 14px;
        line-height: 28px;
        color: #666;
        text-align: justify;
        img {
          display: block;
          margin: 30px auto;
          max-width: 100%;
        }
      }
    }
  }

</style>