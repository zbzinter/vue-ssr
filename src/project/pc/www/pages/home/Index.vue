<template>
  <div class="page">
    <div class="page-inner">
      <!-- 赛事推荐 -->
      <recommend-match :match-data="matchData" />
      <!-- banner轮播 -->
      <banner v-if="bannerShow" :banner="banner" />
      <!-- 快速入口 -->
      <rapid-entry />
      <!-- 精彩推荐 -->
      <recommendation :recommendation-array="recommendation" />
      <!-- 热门直播 -->
      <hot-live :god="god" />
      <!-- 体坛快讯 -->
      <sports-news :matchNewsList="recomNewsList" />
      <!-- 首页底部图片 -->
      <img src="../../assets/home/home_img_download.png">
      <!-- 侧边工具栏 -->
      <side-tools />
    </div>
    <!-- 绑定手机号弹窗 -->
    <Binding
      v-if="showBinding && tokenToBindPhone"
      :token-to-bind-phone="tokenToBindPhone"
      @closeBindbox="closeBindbox"
    />
  </div>
</template>
<script>
import MqttBase from '@utils/MqttBase'
import { getServerConf } from '@config/apiConf'
import dateFormate from '@utils/dateFormate'

import Banner from './components/Banner'
import Recommendation from './components/Recommendation'
import RecommendMatch from './components/RecommendMatch'
import RapidEntry from './components/RapidEntry'
import HotLive from './components/HotLive'
import SideTools from './components/SideTools'
import BindingThirdMixins from '../../mixins/binding-third'
import Binding from '../personal/binding'
import SportsNews from  './components/SportsNews'
let bannerUrl = getServerConf().apiInfo.java
const subscribeList = ['topic_mq/match/*/score', 'topic_mq/match/*/status']

import { mapGetters} from 'vuex'

export default {
  components: {
    Banner,
    RecommendMatch,
    RapidEntry,
    Recommendation,
    HotLive,
    SportsNews,
    SideTools,
    Binding
  },
  mixins: [BindingThirdMixins],
  data() {
    return {
      // 0全部，足球1 篮球2
      sportType: 0,
      // 0 昨天 1 今天 2 明天
      dateIndex: 1,
      // 0 时间排序，1 赛事排序（分类）
      sortType: 0,
      centerFetchStatus: 0,
      centerObj: {},
      mqtt: null,
      time: Date.now(),
      timmer: null,
      bannerShow:false, //banner是否显示
    }
  },
  computed:{
    ...mapGetters({
      recommendation:'home/recommendation',
      banner:'home/banner',
      photos:'home/photos',
      god:'home/god',
      matchData:'home/matchData',
      recomNewsList:'home/recomNewsList',
    })
  },
  asyncData ({ store }) {
    return store.dispatch('home/getHomeDate')
  },
  mounted() {
    this.bannerShow=true
    this.setMqtt()
    this.setNow()
  },

  destroyed() {
    clearInterval(this.timmer)
    this.mqtt.unsubscribe(subscribeList)
  },
  methods: {
    setMqtt() {
      const mqtt = new MqttBase(this.getMessage)
      this.mqtt = mqtt
      this.mqtt.subscribe(subscribeList)
    },
    setNow() {
      this.timmer = setInterval(() => {
        this.time = this.time + 1
      }, 60000)
    },

    sortByTime(list) {
      return [...list].sort((a, b) => a.matchTime - b.matchTime)
    },
    toGroup(list, key) {
      let group = list.reduce((pre, curr) => {
        let id = curr[key]
        if (Array.isArray(pre[id])) {
          pre[id].push({ ...curr })
        } else {
          pre[id] = [curr]
        }
        return pre
      }, {})

      let groupArr = []
      Object.keys(group).forEach(y => (groupArr = [...groupArr, ...group[y]]))

      return groupArr
    },
    getMessage(topic, mqttMsg = {}) {
      let { centerObj } = this
      let { going = {} } = centerObj
      let { matches = [] } = going
      let { matchId: mqttMatchId } = mqttMsg
      let index = matches.findIndex(item => item.matchId == mqttMatchId)

      // status, score
      // const type = topic.replace(/\/+$/, '').replace(/.*\//, '')

      if (index > -1) {
        this.centerObj.going.matches[index] = {
          ...this.centerObj.going.matches[index],
          ...mqttMsg
        }
      }
    },
    closeBindbox() {
      this.showBinding = false
    },
    jumpScore(param) {
      const url = {
        '1': 'football',
        '2': 'basketball'
      }
      const routerData = this.$router.resolve({
        path: `/score/${url[String(param)]}`
      })
      window.open(routerData.href, '_blank')
    },
    /*  getMatches() {
         this.$get(bannerUrl + '/v1/app/recom/list',{
           headers: {
             'Authorization': '',
           }
         }).then(res => {
           this.matchData = res.data.match || []
         })
       } */
  }
}
</script>
<style scoped lang="postcss">
  .page {
    width: auto;
    /* PageFooter设置了margin-top，为了贴着PageFooter，这里把margin设为负值 */
    margin-bottom: -50px;
    font-size: 14px;
    color: #999;
  }
  a {
    color: #333;
  }
  .page-inner {
    width: auto;
  }

</style>


