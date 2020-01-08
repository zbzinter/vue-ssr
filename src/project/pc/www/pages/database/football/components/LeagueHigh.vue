<template>
  <div>
    <div class="group">
      <p class="title">
        {{ type === 1 ? '联赛' : '杯赛' }}数据统计
      </p>
      <div class="echart clearfix">
        <div class="item fl">
          <p class="desc">
            赛果分布情况
          </p>
          <div
            ref="result"
            class="result"
            style="width:300px;height: 235px;margin: auto;"
          />
          <div class="text-desc">
            <span>主胜：{{ result.homeWin }}场</span>
            <span>平局：{{ result.draw }}场</span>
            <span>客胜：{{ result.guestWin }}场</span>
          </div>
        </div>
        <div class="item fl">
          <p class="desc">
            进球分布情况
          </p>
          <div
            ref="goal"
            class="result"
            style="width:350px;height: 235px;margin: auto;"
          />
          <div>
            <span>场均总进球：{{ avg.avg }}个</span>
            <span>主场场均进球：{{ avg.homeAvg }}个</span>
            <span>客场场均进球：{{ avg.guestAvg }}个</span>
          </div>
        </div>
      </div>
    </div>
    <div class="group">
      <p class="title">
        {{ type === 1 ? '联赛' : '杯赛' }}之最
      </p>
      <div class="echart">
        <div class="clearfix">
          <div
            v-for="(item, key) in high"
            :key="key"
            class="fl echart-high"
          > 
            <span class="echart-high__title">
              {{ item.name }}
            </span>
            <span>{{ ['WIN', 'DRAW', 'LOSE'][key] }}</span>
            <div class="circle">
              <i-circle
                :percent="parseFloat(item.rate) * 100"
                :stroke-color="['#E15756', '#3683FF', '#629500'][key]"
              >
                <span
                  class="demo-Circle-inner"
                  style="font-size:24px"
                >{{ new Decimal(item.rate).mul(100).toFixed(2) }}%</span>
              </i-circle>
            </div>
            <div class="echart-high__desc">
              <span>已赛{{ item.win + item.lost + item.draw }}场</span>
              <span v-if="key === 0">胜{{ item.win }}场</span>
              <span v-if="key === 1">平{{ item.draw }}场</span>
              <span v-if="key === 2">负{{ item.lost }}场</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="group">
      <div
        v-for="(item, key) in attackDefense"
        :key="key"
        class="attack-defense"
      >
        <p class="attack-defense__desc">
          {{ returnText(key) }}
        </p>
        <div class="attack-defense__item">
          <span class="item-first">全部</span>
          <span class="item-second">{{ item.all.name }}</span>
          <span class="item-third">{{ item.all.win }}</span>
          <span class="item-four">{{ (item.all.win / (item.all.win + item.all.lost + item.all.draw)).toFixed(2) }}球/场</span>
        </div>
        <div class="attack-defense__item">
          <span class="item-first">主场</span>
          <span class="item-second">{{ item.host.name }}</span>
          <span class="item-third">{{ item.host.win }}</span>
          <span class="item-four">{{ (item.host.win / (item.host.win + item.host.lost + item.host.draw)).toFixed(2) }}球/场</span>
        </div>
        <div class="attack-defense__item">
          <span class="item-first">客场</span>
          <span class="item-second">{{ item.guest.name }}</span>
          <span class="item-third">{{ item.guest.win }}</span>
          <span class="item-four">{{ (item.guest.win / (item.guest.win + item.guest.lost + item.guest.draw)).toFixed(2) }}球/场</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Circle,
} from 'iview'
import echarts from 'echarts'

export default {
  components: {
    'i-circle': Circle
  },
  data() {
    return {
      seasonId: '',
      type: '',
      result: {
        guestGoal: '',
        guestWin: '',
        homeGoal: '',
        homeWin: '',
        draw: '',
      },
      precent: {
        guestGoal: '',
        guestWin: '',
        homeGoal: '',
        homeWin: '',
        draw: '',
      },
      high: [],
      avg: {
        avg: '',
        homeAvg: '',
        guestAvg: '',
      },
      attackDefense: [],
    }
  },
  created() {
    this.type = this.$store.getters.leagueCupType
    this.seasonId = this.$store.getters.seasonId
    this.init()
  },
  methods: {
    init() {
      this.$get('v9/querySeasonTeamStat', {
        seasonId: this.seasonId
      })
        .then(res => {
          const {code, data} = res
          if (this.$judgeCode(code)) {
            this.result = {...data}
            this.avg = {...data}
            this.doughnut(data)
            this.barStack(this.avg)

            const param = {
              'high': {
                1: 'winMost',
                2: 'drawMost',
                3: 'lostMost'
              },
              'attackDefense': {
                1: 'attackBest',
                2: 'attackWorst',
                3: 'defenseBest',
                4: 'defenseWorst'
              }
            }
            this.dataHelper(param)
            this.high[0].rate = this.result.winRate
            this.high[1].rate = this.result.drawRate
            this.high[2].rate = this.result.lostRate
            const rate = {
              '0': 'winRate',
              '1': 'drawRate',
              '2': 'lostRate'
            }
            Object.keys(rate).forEach(item => {
              this.high[Number(item)].rate = this.result[rate[item]]
            })

          }
        })
    },

    dataHelper(param) {
      Object.keys(param).forEach((item) => {
        this[item] = []
        const data = param[item]
        Object.keys(data).forEach((ele) => {
          this[item].push(this.result[data[ele]])
        })
      })
    },

    doughnut(data) {
      let dom = this.$refs.result
      let myChart = echarts.init(dom)
      let option = null
      option = {
        tooltip: {
          trigger: 'item',
          formatter: ''
        },
        color: ['#E15756','#103C7E', '#3683FF'],
        series: [
          {
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: '30',
                  fontWeight: 'bold'
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data:[
              {value: data.homeWin, name:'主胜'},
              {value: data.guestWin, name:'客胜'},
              {value: data.draw, name:'平局'}
            ]
          }
        ]
      }
      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    },
    barStack(data) {
      let dom = this.$refs.goal
      let myChart = echarts.init(dom)
      let option = null
      option = {
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis : [
          {
            type : 'category',
            data : ['场均总进球', '主队均进球', '客队均进球']
          }
        ],
        yAxis : [
          {
            type : 'value'
          }
        ],
        series : [
          {
            name:'数量',
            type:'bar',
            itemStyle: {   
              //通常情况下：
              normal:{  
                //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
                color: function (params) {
                  var colorList = ['#103C7E', '#E15756', '#3683FF']
                  return colorList[params.dataIndex]
                }
              },
              //鼠标悬停时：
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            data:[
              { value: data.avg },
              { value: data.homeAvg },
              { value: data.guestAvg }
            ]
          },
       
        ]
      }

      if (option && typeof option === 'object') {
        myChart.setOption(option, true)
      }
    },

    returnText(index) {
      const text = ['攻击力最佳', '攻击力最差', '防守最佳', '防守最差']
      return text[Number(index)]
    },

    resetAndInit() {
      this.seasonId = this.$store.getters.seasonId
      this.init()
    }

  }
}
</script>

<style lang="scss" scoped>
.group {
  margin-bottom: 20px;
  .title {
    padding: 40px 0 18px 0;
    font-size: 16px;
    color: #3683FF;
  }
  
  .item {
    width: 430px; 
    height: 315px;
    background: #FAFAFA;
    margin-right: 10px;
    text-align: center;
  }
  .result {
    margin: auto;
  }
  .desc {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    padding-top: 22px;
    color: #666666;
    text-align: center;
  }
  .text-desc {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666666;
    letter-spacing: 0;
    text-align: center;
  }
  .echart-high {
    width: 290px;
    height: 200px;
    background: #FAFAFA;
    margin-right: 10px;
    
    &__title {
      font-size: 14px;
      color: #666666;
      padding: 12px 0 0 12px;
      display: inline-block;
    } 
    &__desc {
      text-align: center;
      span {
        display: inline-block;
      }
    }
    .circle {
      text-align: center;
      padding: 5px 0;
    }
  }
  .echart-high:last-child {
     margin-right: 0px;
  }

  .attack-defense {
    display: inline-block;
    width: 440px;
    margin: 0px 10px 25px 0;
    &__desc {
      height: 49px;
      line-height: 49px;
      text-align: center;
      border: 1px solid #F5F5F5;
      background: #FAFAFA;
    }
    &__item {
      height: 32px;
      line-height: 32px;
      font-size: 12px;
      color: #333333;
      letter-spacing: 0;
      text-align: center;
      border-bottom: 1px solid #eee;
      span {
        display: inline-block;
      }
    }
  
    .item-first {
      width: 50px;
    }
    .item-second {
      width: 185px;
    }
    .item-third {
      width: 90px;
    }
    .item-four {
      width: 100px;
    }
  }

  .attack-defense:nth-of-type(2) {
    margin-right: 0px;
  }
  .attack-defense:nth-of-type(4) {
    margin-right: 0px;
  }
  
}
</style>
