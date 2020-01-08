import { Decimal } from 'decimal.js'
export default {
  data () {
    return {
      basketMatchTypeArr: ['季后赛', '常规赛'],
      basketRadioTypeArr: ['全场', '半场'],
      variable: {},
      isDiffHostArr: [
        {
          value: 0,
          label: '不分主客'
        },
        {
          value: 1,
          label: '主客相同'
        }
      ],
      sideArr: [
        {
          value: 0,
          label: '全部'
        },
        {
          value: 1,
          label: '主场'
        },
        {
          value: 2,
          label: '客场'
        }
      ],
      fieldTimeArr: [
        {
          value: 5,
          label: '近5场'
        },
        {
          value: 10,
          label: '近10场'
        },
        {
          value: 15,
          label: '近15场'
        }
      ]
    }
  },
  computed: {
    getTapeRate () { // 赢盘率、大球率、胜率、胜
      return ({data, teamId, isAllFiled, sportType}) =>{
        isAllFiled = isAllFiled!==undefined ? isAllFiled : true
        sportType = sportType || 'football'
        let hasAsiaRateArr = [] // 有asiaRate的item 数组
        let victory = [] // 赢盘的数组
        let hasDxRateArr = [] // 有dxRate的item 数组
        let largeRateArr = [] // 大球率
        let winNumArr = []
        let variable = this.variableKey(isAllFiled, sportType)
        data.forEach(item => {
          let isAsiaRate = !!item[variable.useAsiaRate] || item[variable.useAsiaRate] === 0
          let isDxRate = !!item[variable.usedxRate] || item[variable.usedxRate] === 0
          if (isAsiaRate) hasAsiaRateArr.push(item)
          if (isDxRate) hasDxRateArr.push(item)
          // if (((item[variable.useHostScore] + item[variable.useGuestScore]) > item[variable.usedxRate]) && isDxRate) largeRateArr.push(item)    
          if(/大/.test(item.dxDesc)) largeRateArr.push(item.dxDesc)
          if(/胜/.test(item.winLosDesc)) winNumArr.push(item.winLosDesc)
          if(/赢/.test(item.tapeDesc)) victory.push(item.tapeDesc)
        })
        return {
          largeRate: hasDxRateArr.length ? `${new Decimal(largeRateArr.length*100).dividedBy(hasDxRateArr.length).toFixed(1)}%` : '-',
          winRate: data.length ? `${new Decimal(winNumArr.length*100).dividedBy(data.length).toFixed(1)}%` : '-',
          win: winNumArr.length,
          victory: hasAsiaRateArr.length ? `${new Decimal(victory.length*100).dividedBy(hasAsiaRateArr.length).toFixed(1)}%` : '-',
        }
      }
    }
  },
  methods: {
    format(val, maxFloat, Fixed){
      if(!maxFloat) return (val || val === 0) ? val : '-'
      if(maxFloat && !Fixed) { // 最大浮点,仅对有小数点的数字处理成maxFloat
        val = /^\d+\./.test(val) ?  (+val).toFixed(maxFloat) : val
        return val
      }
      if(/^\d+/.test(val)) {
        val = (+val).toFixed(1)
        return val
      }
    },
    variableKey(isAllFiled = true, sportType){ // 足球和篮球的变量名控制
      let variable = {}
      if (isAllFiled) {
        variable = {
          useHostScore: 'hostTeamScore',
          useGuestScore: 'guestTeamScore',
          useAsiaRate: 'asiaRate',
          usedxRate: 'dxRate'
        }
      } else {
        variable = {
          useHostScore: 'hostTeamHalfTimeScore',
          useGuestScore: 'guestTeamHalfTimeScore',
          useAsiaRate: 'asiaHalfRate',
          usedxRate: 'dxHalfRate'
        }
      }
      if (sportType === 'football' && isAllFiled) {
        variable.useHostScore = 'hostTeamNormalScore'
        variable.useGuestScore = 'guestTeamNormalScore'
      }
      return variable
    },
    handlerLeagueName (arr, name = 'leagueName') { // 获取联队leagueName
      let leagueName = arr.reduce((total,item)=> {
        total.push(item[name] || '')
        return total
      },[])
      return [...new Set(leagueName)] || []
    },
    addItem({item, teamId, sportType, isAllFiled}){ // item 增加盘路和大小、胜、负
      let variable = this.variableKey(isAllFiled, sportType)
      let isAsiaRate = !!item[variable.useAsiaRate] || item[variable.useAsiaRate] === 0
      if (!isAsiaRate) {
        this.$set(item, 'tape', '')
        this.$set(item, 'tapeDesc', '-')
      }
      if (teamId === item.hostTeamId) {
        if ((item[variable.useHostScore] - item[variable.useGuestScore] + item[variable.useAsiaRate] > 0) && isAsiaRate) {
          this.$set(item, 'tape', 'win red')
          this.$set(item, 'tapeDesc', '赢')
        } else if ((item[variable.useHostScore] - item[variable.useGuestScore] + item[variable.useAsiaRate] < 0) && isAsiaRate) {
          this.$set(item, 'tape', 'loser green')
          this.$set(item, 'tapeDesc', '输')
        } else if ((item[variable.useHostScore] - item[variable.useGuestScore] + item[variable.useAsiaRate] === 0) && isAsiaRate) {
          this.$set(item, 'tape', 'equal blue')
          this.$set(item, 'tapeDesc', '走')
        }
      } else if (teamId === item.guestTeamId) {
        if ((item[variable.useHostScore] - item[variable.useGuestScore] + item[variable.useAsiaRate] < 0) && isAsiaRate) {
          this.$set(item, 'tape', 'win red')
          this.$set(item, 'tapeDesc', '赢')
        } else if ((item[variable.useHostScore] - item[variable.useGuestScore] + item[variable.useAsiaRate] > 0) && isAsiaRate) {
          this.$set(item, 'tape', 'loser green')
          this.$set(item, 'tapeDesc', '输')
        } else if ((item[variable.useHostScore] - item[variable.useGuestScore] + item[variable.useAsiaRate] === 0) && isAsiaRate) {
          this.$set(item, 'tape', 'equal blue')
          this.$set(item, 'tapeDesc', '走')
        }
      }
      if (!item[variable.usedxRate] && item[variable.usedxRate]!==0) {
        this.$set(item, 'dx', '')
        this.$set(item, 'dxDesc', '-')
      } else if((item[variable.useHostScore] + item[variable.useGuestScore]) > item[variable.usedxRate]) {
        this.$set(item, 'dx', 'large red')
        this.$set(item, 'dxDesc', '大')
      } else if((item[variable.useHostScore] + item[variable.useGuestScore]) < item[variable.usedxRate]){
        this.$set(item, 'dx', 'small green')
        this.$set(item, 'dxDesc', '小')
      } else if((item[variable.useHostScore] + item[variable.useGuestScore]) === item[variable.usedxRate]) {
        this.$set(item, 'dx', 'equal blue')
        this.$set(item, 'dxDesc', '走')
      }
      if (teamId === item.hostTeamId) {
        if(item[variable.useHostScore] - item[variable.useGuestScore]>0){
          this.$set(item, 'winLos', 'win red')
          this.$set(item, 'winLosDesc', '胜')
        } else if(item[variable.useHostScore] - item[variable.useGuestScore]<0){
          this.$set(item, 'winLos', 'loser green')
          this.$set(item, 'winLosDesc', '负')
        } else {
          this.$set(item, 'winLos', '')
          this.$set(item, 'winLosDesc', '-')
        }
      } else if (teamId === item.guestTeamId) {
        if(item[variable.useGuestScore] - item[variable.useHostScore]>0){
          this.$set(item, 'winLos', 'win red')
          this.$set(item, 'winLosDesc', '胜')
        } else if(item[variable.useGuestScore] - item[variable.useHostScore]<0){
          this.$set(item, 'winLos', 'loser green')
          this.$set(item, 'winLosDesc', '负')
        } 
        else if(item[variable.useGuestScore] - item[variable.useHostScore]<0){
          this.$set(item, 'winLos', '')
          this.$set(item, 'winLosDesc', '-')
        }
      }
      if(item[variable.useGuestScore] === item[variable.useHostScore] && sportType === 'football'){
        this.$set(item, 'winLos', 'draw blue')
        this.$set(item, 'winLosDesc', '平')
      }

    },
    getQueryOddByMatchIds(bookId, local, arr, type = 'history'){ // 获取公司的的赔率
      if(!Array.isArray(arr)) return
      let findItemCache
      if (type === 'history') { // 使用交战历史的赔率select 缓存
        findItemCache = this.queryOddByMatchIds.find((item, index) => {
          return (Object.prototype.toString.call(item) === '[object Object]') && (Object.keys(item)[0] == bookId)
        })
        if (findItemCache) {
          this.filterOdd(Object.values(findItemCache)[0], local, arr)
          return
        } 
      }

      this.matchIds = arr.reduce((total, item) => {
        total.push(item.matchId)
        return total
      }, [])
      let matchIds = encodeURIComponent(JSON.stringify(this.matchIds))
      let params = {
        matchIds,
        bookId
      }
      if(this.$requireParams(params)) return
      if(bookId === '0' && type==='recent') return
      this.$get('/v8/queryOddByMatchIds', params).then(res => {
        if (res.data) {
          if (type==='history') {
            this.filterOdd(res.data, local, arr)
            this.addOdd({[bookId]: res.data})
          } else if (type==='recent') {
            this.filterOddRecent(res.data, local, arr)
          }
        }
      })
    },
    filterOddRecent(data, local, arr){ // 近期战绩赔率筛选
      arr.forEach(val => {
        for (const [index, item] of Object.entries(data)) {
          if(parseFloat(index) === val.matchId) {
            val.asiaRateStr = item[local] ? item[local].ovalue0 : null
            val.asiaRate = item[local] ? item[local].ovalue0Num : null
          }
        }
      })
    },
    filterOdd (data, local, arr) { // 过滤出指定的赔率   
      arr.forEach(val => {
        if(Object.prototype.toString.call(val.rateDetail) !== '[object Object]'){
          val.rateDetail = {}
        }
        if(!Object.keys(data).length) {
          return val.rateDetail[local] = {}
        }
        for (const [index, item] of Object.entries(data)) {
          if(parseFloat(index) === val.matchId) {
            val.rateDetail[local] = item[local] ? item[local] : {}
          }
        }
      })
    }
  }
}