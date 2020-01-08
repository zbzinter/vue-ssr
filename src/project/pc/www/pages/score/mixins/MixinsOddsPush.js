// 指数推送的处理，引入的文件要有this.matchData.matchId,以免推送错误
import MqttBase from '@utils/MqttBase'
let subscribeList = ['topic_mq/match/*/compareOdds', 'topic_mq/match/*/loOddsData']
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapMutations } = createNamespacedHelpers('odds')
export default {
  data() {
    return {
      oddsValue: []
    }
  },
  computed: {
    ...mapState(['tempOddsData'])
  },
  destroyed() {
    this.mqtt.unsubscribe(subscribeList)
  },
  mounted () {
    this.$nextTick(()=>{
      subscribeList = subscribeList.map(item => item.replace('*', this.matchData.matchId))
      this.setMqtt()
    })
    // setTimeout(()=>{ // 保留，测试指数的推送。
    //   this.getMessage('compareOdds', {
    //     bookId: 31, // 533
    //     matchId: 1585626,
    //     matchStatus: 2,
    //     mqttName: 'compareOdds',
    //     ovalue: '16.5',
    //     typeId: 2,
    //     valueForType1: 3.66,
    //     valueForType2: 4.66
    //   })
    //   console.log('推送')
    // }, 4000)
  },
  methods: {
    ...mapMutations(['setOddsData']),
    setMqtt() {
      const mqtt = new MqttBase(this.getMessage)
      this.mqtt = mqtt
      this.mqtt.subscribe(subscribeList)
    },
    getMessage(topic, mqttMsg = {}){
      // 在对应的子组件可以重写订阅的该方法(待确定)
      console.log('oddsMqttMsg',mqttMsg)
      if(this.matchData && (this.matchData.sportId != mqttMsg.sportId)) return
      this.oddsValue = JSON.parse(JSON.stringify(this.tempOddsData))
      let { mqttName, loOdds } = mqttMsg
      if (mqttName === 'compareOdds') {
        let matchId = this.matchData && this.matchData.matchId
        if(matchId !== mqttMsg.matchId) return
        let findItem = this.oddsValue.find(item => mqttMsg.bookId == item.bookId)
        if(findItem) {
          this.setPushOdds(findItem, mqttMsg)
        }
      }
      if (mqttName === 'loOddsData') {
        let matchId = this.matchData && this.matchData.matchId
        if(matchId !== mqttMsg.matchId) return
        Array.isArray(loOdds) && loOdds.forEach(Obj => {
          let findItem = this.oddsValue.find(item => item.bookId == 31)
          if(findItem) {
            this.setPushOdds(findItem, Obj)
          }
        })
      }
    },
    setPushOdds(findItem, mqttMsg){
      if(!findItem.coOddsWithMatchList) {
        findItem.coOddsWithMatchList = []
      }
      if(findItem.coOddsWithMatchList && Array.isArray(findItem.coOddsWithMatchList) && !findItem.coOddsWithMatchList.length) {
        findItem.coOddsWithMatchList = [mqttMsg]
      }
      if(findItem.coOddsWithMatchList && Array.isArray(findItem.coOddsWithMatchList) && findItem.coOddsWithMatchList.length) {
        let typeIdIndex = findItem.coOddsWithMatchList.findIndex(item => mqttMsg.typeId === item.typeId)
        if(typeIdIndex === -1) {
          findItem.coOddsWithMatchList.push(mqttMsg)
        } else {
          this.setOddsColor(mqttMsg, findItem.coOddsWithMatchList[typeIdIndex])
          findItem.coOddsWithMatchList[typeIdIndex] = Object.assign(
            findItem.coOddsWithMatchList[typeIdIndex],
            mqttMsg
          )
        }
      }
      this.setOddsData(this.oddsValue)
      if(Array.isArray(this.oddsData)) {
        this.oddsData.forEach(item=>{
          if(Array.isArray(this.selected) && this.selected.find(val=> val.bookId === item.bookId)) {
            this.$set(item, '_checked', true)
            this.$set(item, 'ischeck', true)
          }
        })
      }
      console.log('changeOdds', mqttMsg)
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
    tempOddsData(){
      if(!this.oddsData || !Array.isArray(this.oddsData)) return
      if(/three/.test(this.$route.path)){ //三合一推送更新
        for (const [index, item] of Object.entries(this.tempOddsData)) {
          this.oddsData.forEach(val=>{
            if(val.bookId === item.bookId){
              val.coOddsWithMatchList = item.coOddsWithMatchList
              if(Array.isArray(this.selected) && this.selected.find(val=> val.bookId === item.bookId)) {
                this.$set(item, '_checked', true)
                this.$set(item, 'ischeck', true)
              }
            }
          })
        }
      }
    },
    getVuexFilterOdds(newVal){
      this.oddsData = this.oddsData.map(item=>{
        let findItem = newVal.find(ele => ele.bookId === item.bookId)
        if(findItem) {
          findItem.valueForType1 && (item.valueForType1=findItem.valueForType1)
          findItem.valueForType2 && (item.valueForType2=findItem.valueForType2)
          findItem.ovalueNum && (item.ovalueNum=findItem.ovalueNum)
          findItem.ovalue && (item.ovalue=findItem.ovalue)
          findItem.valueForTypeX && (item.valueForTypeX=findItem.valueForTypeX)
          // item = {
          //   ...item,
          //   ...findItem
          // }
        }
        return item
      })
    }
  }
}