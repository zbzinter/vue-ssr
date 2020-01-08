<template>
  <div class="page-inner">
    <div class="clearfix">
      <div
        class="fl mr"
      >
        <!-- 左侧内容 -->
        <List
          :navs="tabList"
          :list="newsLists"
          :listArray="List"
          :total="total"
          @listMethodEmit="listMethod"
        />
      </div>

      <div class="fr">
        <!--新闻推荐-->
        <RecommendNews
          ref="recommendNews"
          :list="recommendNewsList"
          :article="articleList"
          :target="target"
        />
        <LeagueTable
          :stats="stats"
          :fetch-status="fetchStatus"
          class="league-table"
          :hide-title="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getServerConf } from '@config/apiConf'

let newsUrl = getServerConf().apiInfo.newsUrl
import { mapGetters} from 'vuex'
export default {
  components: {
    List:()=>import('./components/List'),
    RecommendNews:()=>import('../../components/RecommendNews'),
    LeagueTable:()=>import('../home/components/LeagueTable'),
  },
  data () {
    return {
      RecommendNewsShow:false,
      LeagueTableShow:false,
      target:'_blank'
    }
  },
  computed:{
    ...mapGetters({
      tabList:'news/tabList',
      List:'news/List',
      newsLists:'news/newsLists',
      total:'news/total',
      recommendNewsList:'news/recommendNewsList',
      articleList:'news/articleList',
      stats:'news/stats',
      fetchStatus:'news/fetchStatus',
    })
  },

  created(){

    if(process.browser&&this.tabList.length==0){
      let obj={
        'channelId':this.$route.params.channelId||187,
        'articleType':(this.$route.params.channelId&&this.$route.params.channelId===188)?2:'',
        'currentPage':1,
        'client':'web'
      }
      return this.$store.dispatch('news/getNewsData',obj)
    }
  },
  asyncData ({ store,route }) {
    let obj={
      'channelId':route.params.channelId||187,
      'articleType':(route.params.channelId&&route.params.channelId===188)?2:'',
      'currentPage':1,
    }
    return store.dispatch('news/getNewsData',obj)

  },
  mounted(){
    document.title = '体育资讯-足球头条|五大联赛新闻资讯'
  },
  beforeDestroy(){
    document.title = '球会体育'
  },
  methods: {
    listMethod(data){
      this.$refs.recommendNews.getQuitList(data)
    },
  },
}
</script>

<style lang="scss" scoped>
  .mr {
    margin-right: 20px;
  }
  .page-inner {
    margin-top: 30px;
  }
  /deep/ .league-table {
    background: #fff;
    margin-bottom: 20px;
    width: 364px;
    border-radius: 0;
  }
  /deep/ .league-nav {
    padding: 11px 20px 11px 20px;
    li {
      font-size: 14px;
      color: #333333;
      font-weight: 600;
      margin-right: 30px;
      &:last-child {
        margin-right: 0;
      }
    }
  }

  /deep/ .right-list-body {
    li {
      &:nth-child(1),
      &:nth-child(2),
      &:nth-child(3) {
        p {
          &:nth-child(1) {
            color: #F82301 !important;
            font-weight: 500
          }
        }
      }
    }
    .number {
      font-size: 16px;
      height: 20px;
      padding-top: 2px;
    }
  }

  /deep/ .leagua-content{
    padding: 0 20px;
    .leagua-headers {
      background: #fff;
      border-bottom: 1px solid  #EAEAEA;
      border-radius: 0;
      padding: 0 10px;
    }
    .right-list-body > li {
      border-bottom: 1px solid #EAEAEA;
      padding: 12px 10px;
      height: 40px;
      line-height: 16px;
    }
    .team-name {
      padding-left: 25px;
    }
    .team-num {
      padding-left: 5px;
    }
  }


</style>
