// 指数推送的处理，引入的文件要有this.matchData.matchId,以免推送错误
import MqttBase from '@utils/MqttBase'
let subscribeList = ['topic_mq/match/*/loOddsData']
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapMutations } = createNamespacedHelpers('odds')
export default {
  data() {
    return {
      oddsValue: [],
      typeId: this.$route.query.typeId,
      bookId: this.$route.query.bookId,
    }
  },
  computed: {
    ...mapState(['tempOddsData'])
  },
  destroyed() {
    this.mqtt.unsubscribe(subscribeList)
  },
  mounted () {
    // setTimeout(()=>{ // 保留，测试指数的推送。
    //   this.getMessage('compareOdds', {
    //     'loOdds': [{
    //       bookId: 31, // 533
    //       matchStatus: 2,
    //       mqttName: 'compareOdds',
    //       ovalue: '16.5',
    //       typeId: 3,
    //       valueForType1: 6.66,
    //       valueForType2: 7.66
    //     }],
    //     matchId: 1634169,
    //     'mqttName':'loOddsData'
    //   })
    //   console.log('推送')
    // }, 4000)
  },
  methods: {
    ...mapMutations(['setOddsLogData']),
    setMqtt() {
      const mqtt = new MqttBase(this.getMessage)
      this.mqtt = mqtt
      this.mqtt.subscribe(subscribeList)
    },
    getMessage(topic, mqttMsg = {}){
      // 在对应的子组件可以重写订阅的该方法(待确定)
      if(this.matchData && (this.matchData.sportId != mqttMsg.sportId)) return
      this.oddsValue = JSON.parse(JSON.stringify(this.tempOddsLogData))
      let { matchId: mqttMatchId, matchStatus: mqttMatchStatus, mqttName, typeId:mqttTypeId, loOdds } = mqttMsg
      if (mqttName === 'loOddsData') {
        let matchId = this.matchData && this.matchData.matchId
        if(matchId !== mqttMsg.matchId) return
        if(this.bookId != 31) return
        Array.isArray(loOdds) && loOdds.forEach(Obj => {
          this.setPushOddsLog(Obj)
        })
      }
      this.setOddsLogData(this.oddsValue)
    },
    setPushOddsLog(mqttMsgItem){
      let rollTypeId
      switch (this.typeId) {
      case 1: rollTypeId=121;break
      case 2: rollTypeId=128;break
      case 3: rollTypeId=122;break
      }
      if(mqttMsgItem.typeId != rollTypeId && mqttMsgItem.typeId != this.typeId) return
      this.oddsValue.unshift(mqttMsgItem)
    },
    setOddsColor(mqttMsg, old){
      this.setOddsItemColor(mqttMsg, old, 'valueForType1')
      this.setOddsItemColor(mqttMsg, old, 'valueForType2')
    },
    setOddsItemColor(mqttMsg, old, value){
      // 便于参考数据的变化，实际使用组件中的setColor方法
      if(mqttMsg[value] > old[value]) {
        mqttMsg[`${value}Color`] = 'red'
      }
      if(mqttMsg[value] < old[value]) {
        mqttMsg[`${value}Color`] = 'green'
      }
      if(mqttMsg[value] == old[value]) {
        mqttMsg[`${value}Color`] = ''
      }
    }
  },
  watch:{
    matchData () {
      if(this.matchData && Object.keys(this.matchData).length) {
        subscribeList = subscribeList.map(item => item.replace('*', this.matchData.matchId))
        this.setMqtt()
      }
    }
  }
}