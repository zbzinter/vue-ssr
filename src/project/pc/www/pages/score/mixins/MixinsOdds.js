import { Decimal } from 'decimal.js'
export default {
  data() {
    return {
    }
  },
  computed: {
    setAllComputedVal() {
      return (type = 2)=> { // 欧指的最高、最低、平均
        let reArr = []
        let middle1 = 'value0ForTypeX'
        let middle2 = 'valueForTypeX'
        let alias1
        let alias2
        if(type !== 2 && type !== 128) {
          middle1= 'ovalue0Num'
          middle2= 'ovalueNum'
          alias1= 'ovalue0'
          alias2= 'ovalue'
        }
        let guestEarly = this.getComputedVal('value0ForType2')
        let hostEarly = this.getComputedVal('value0ForType1')
        let guestInstant= this.getComputedVal('valueForType2')
        let hostInstant = this.getComputedVal('valueForType1')
        let guestDraw= this.getComputedVal(middle2, 'max', alias2)
        let hostDraw = this.getComputedVal(middle1, 'max', alias1)
        reArr[0] = {
          value0ForType2: guestEarly[0],
          value0ForType1: hostEarly[0],
          valueForType2: guestInstant[0],
          valueForType1: hostInstant[0],
          [alias1 || middle1]: hostDraw[0],
          [alias2 || middle2]: guestDraw[0],
          bookName: '最大值',
          oupeiName: '最高'
        }
        reArr[1] = {
          value0ForType2: guestEarly[guestEarly.length -1 || 0],
          value0ForType1: hostEarly[hostEarly.length -1 || 0],
          valueForType2: guestInstant[guestInstant.length -1 || 0],
          valueForType1: hostInstant[hostInstant.length -1 || 0],
          [alias1 || middle1]: hostDraw[hostDraw.length - 1 || 0],
          [alias2 || middle2]: guestDraw[guestDraw.length - 1 || 0],
          bookName: '最小值',
          oupeiName: '最低'
        }
        if(!(type !== 2 && type !== 128)){
          reArr[2] = {
            value0ForType2: this.getComputedAvgVal(reArr[0].value0ForType2, reArr[1].value0ForType2),
            value0ForType1: this.getComputedAvgVal(reArr[0].value0ForType1, reArr[1].value0ForType1),
            valueForType2: this.getComputedAvgVal(reArr[0].valueForType2, reArr[1].valueForType2),
            valueForType1: this.getComputedAvgVal(reArr[0].valueForType1, reArr[1].valueForType1),
            [middle1]: this.getComputedAvgVal(reArr[0][middle1], reArr[1][middle1]),
            [middle2]: this.getComputedAvgVal(reArr[0][middle1], reArr[1][middle2]),
            oupeiName: '平均'
          }
        }
        return reArr
      }
    }
  },
  methods: {
    getComputedVal (sortName, type = 'max', alias) { // 最高、最低
      let sortArr = this.oddsData && this.oddsData.slice().sort(function(a, b){
        if (type === 'max') return b[sortName] - a[sortName] // 升序，取第一个
        if (type === 'min') return a[sortName] - b[sortName]
      })
      let sortNameArr = sortArr.reduce((total, item) => {
        total.push(item[alias || sortName])
        return total
      }, []).filter(item => (item !== '' && item !== null && item !== undefined))
      return sortNameArr
    },
    getComputedAvgVal (max, min) { // 平均值
      if (!max || !min) return
      let avg = new Decimal(Number(max)).plus(Number(min)).dividedBy(2).toFixed(2)
      return  avg
    },
    getReturnRete (item, type) { // 篮球返还率 =（主赔*客赔）/（主赔+客赔） 足球：1/(1/胜赔+1/平赔+1/负赔)
      // if(!item[host] || !item[guest]) return
      let bacrRateMul
      let bacrRateMulSum
      let isNoData
      if (type === 'early') {
        bacrRateMul = item.value0ForType1*item.value0ForType2*item.value0ForTypeX
        bacrRateMulSum = item.value0ForType1*item.value0ForType2 + item.value0ForType1*item.value0ForTypeX + item.value0ForType2*item.value0ForTypeX
        isNoData = this.isNoData([item.value0ForType1, item.value0ForType2, item.value0ForTypeX])
      } else if (type === 'instant') {
        bacrRateMul = item.valueForType1*item.valueForType2*item.valueForTypeX
        bacrRateMulSum = item.valueForType1*item.valueForType2 + item.valueForType1*item.valueForTypeX + item.valueForType2*item.valueForTypeX
        isNoData = this.isNoData([item.valueForType1, item.valueForType2, item.valueForTypeX])
      }
      return isNoData ? `${new Decimal(bacrRateMul*100).dividedBy(bacrRateMulSum).toFixed(2)}%` : '-'
    },
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
    setCompareColor(currentVal, preVal){
      let current = parseFloat(currentVal)
      let pre = parseFloat(preVal)
      if (current > pre) {
        return 'red'
      } else if (current < pre) {
        return 'green'
      }
    }
  }
}