<template>
  <div class="helper">
    <div class="helper-header">
      <span
        class="tab first-tab"
        :class="activeIndex === 0 ? 'is-active' : ''"
        @click="handleTab(0)"
      >直播设置</span>
      <span
        class="tab"
        :class="activeIndex === 1 ? 'is-active' : ''"
        @click="handleTab(1)"
      >我的预约</span>
    </div>
    <div
      class="helper-content"
    >
      <div class="desc">
        <Tooltip
          :content="currentRoom"
          placement="top"
        >
          <p class="ellipsis">
            当前房间： {{ currentRoom }}
          </p>
        </Tooltip>
      </div>
      <div
        v-if="activeIndex===0"
        class="selector"
      >
        <Select
          v-model="selector.sportId"
          class="selector-option first-select"
          placeholder="分类"
          @on-change="resetCompetitionList"
        >
          <Option
            v-for="(item, e) in liveType"
            :key="e"
            :value="item.value"
          >
            {{ item.name }}
          </Option>
        </Select>
        <span>|</span>
        <Select
          v-model="selector.leagueId"
          placeholder="联赛"
          class="selector-option"
          @on-change="getCompetitionList"
        >
          <Option
            v-for="item in renderData.optionsCompetition"
            :key="item.leagueId"
            :label="item.leagueName"
            :value="item.leagueId"
          />
        </Select>
        <span>|</span>
        <Select
          v-model="selector.dialectId"
          placeholder="解说方言"
          class="selector-option second-select"
        >
          <Option
            v-for="item in renderData.dialectData"
            :key="item.type_id"
            :label="item.name"
            :value="item.type_id"
          />
        </Select>
      </div>
      <div
        v-show="activeIndex===0"
        class="competition"
      >
        <div
          v-for="(item, index) in renderData.competitionList"
          :key="index"
          class="competition-desc clearfix"
          :class="{ active: item.isSelect}"
          @click="selectCompetition(item, index)"
        >
          <span class="time fl">{{ dayjs(item.matchTime).format('MM-DD HH:mm') }}</span> 
          <span class="host-team ellipsis fl">{{ item.hostTeamName }}</span>
          <span class="vs fl">VS</span>
          <span class="guest-team ellipsis fl">{{ item.guestTeamName }}</span>
        </div>
      </div>

      <div
        v-show="activeIndex===1"
        class="competition order"
      >
        <div
          v-for="(item, index) in renderData.orderData"
          :key="index"
          :class="item.liveM3u8Url ? 'green' : '' "
          class="competition-desc clearfix"
        >
          <span class="time fl">{{ dayjs(item.matchTime).format('MM-DD HH:mm') }}</span>
          <span class="league-name fl ellipsis">{{ item.leagueName }}</span>
          <span class="host-team fl ellipsis">{{ item.homeTeamName }}</span>
          <span class="vs fl">VS</span>
          <span class="guest-team fl ellipsis">{{ item.awayTeamName }}</span>
          <span
            class="live fl"
            @click="live(item)"
          >开播</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Select,
  Option,
  Tooltip
} from 'iview'
import {mapActions} from 'vuex'
import { _debounce } from '@/comm/utils/common'
import { getQueryString } from '@utils/url'

export default {
  components: {
    Select, 
    Option,
    Tooltip
  },
  data() {
    return {
      activeIndex: 0,
      currentRoom: '',
      uid: '',
      token: '',
      name: '',
      title: '',
      selector: {
        sportId: '',
        leagueId: '',
        dialectId: -1,
        dialectName: ''
      },
      renderData: {
        dialectData: [],
        optionsCompetition: [],
        competitionList: [],
        orderData: []
      },

      liveType: []
    }
  },
  mounted() {
    this.uid = getQueryString('uid', location.href)
    this.token = getQueryString('token', location.href)
    this.dialects()

    this.getLiveType()
    this.init()

    const bodyStyle = document.getElementsByTagName('body')[0]
    bodyStyle.style.cssText = 'overflow-x: hidden;overflow-y: hidden;'
    this.displayWindowSize()
    window.addEventListener('resize', this.displayWindowSize)
  },
  methods: {
    ...mapActions([
      'GetCompetitionClassify',
      'GetCompetitionList',
      'GetAnchorSetInfo'
    ]),

    async getLiveType() {
      try {
        const {data} = await this.$get('v0.2/livetypes', 
          {
            apiType: 'anchor'
          }
        )
        if (data && data.length) {
          data.forEach(item => {
            if (item.display === 1) {
              item.value = item.type_id
              this.liveType.push(item)
            }
          })
          return false
        } 
      } catch(e) {}
      if (!this.liveType.length) {
        this.liveType = [
          {name: '足球', value: 1},
          {name: '篮球球', value: 2},
          {name: '其他', value: -1}
        ]
      }
    },

    init() {
      this.getAnchorInfo()
      new QWebChannel(qt.webChannelTransport, function(channel) {
        window.bridge = channel.objects.bridge
      })
    },

    getAnchorInfo() {
      this.GetAnchorSetInfo({uids: this.uid, vm: this }).then((result) => {
        this.roomId = result.room_id
        this.title = result.title
        if (result.title) {
          const matchName = result.match_name ? result.match_name : '-'         
          const matchTypeName = result.match_type_name ? result.match_type_name : '-'     
          this.currentRoom = this.getSelectType(result.live_type_id) + '-' + matchName + '-' + matchTypeName
        } else {
          this.name = result.anchor.nickname + '的直播间'
          this.currentRoom = result.anchor.nickname + '的直播间'
        }
      })
    },

    handleTab(index) {
      this.activeIndex = index
      if (this.activeIndex === 1) {
        this.getOrderCompetitionList()
      } else {
        this.init()
      }
    },

    // 获取方言
    dialects() {

      this.renderData.dialectData = []
      this.$get('v0.1/dialects', {
        apiType: 'anchor',
      })
        .then(res => {
          const {code, data} = res
          if (this.$judgeCode(code)) {
            if (data && data.length) {
              data.forEach(item => {
                if (item.display === 1) {
                  this.renderData.dialectData.push(item)
                }
              })
            }
            const name = '普通话'
            const arr = data.filter(item => item.name === name)
            
            this.selector.dialectId = arr.length ? arr[0].type_id : 0
          }
        })
    },

    // 获取赛事分类
    getCompetitionClassify() {
      this.GetCompetitionClassify({sportId: this.selector.sportId, vm: this})
        .then((data) => {
          this.renderData.optionsCompetition = data
        })
        .catch(() => {
          this.renderData.optionsCompetition = []
        })
    },

    // 根据赛事分类 选择比赛场次
    getCompetitionList(leagueId) {
      if (!leagueId) {
        return
      }
      this.selector.leagueId = leagueId
      this.GetCompetitionList({leagueId, sportId: this.selector.sportId, vm:this})
        .then((data) => {
          data.map(item => {
            item.isSelect = false
          })
          this.renderData.competitionList = data
        })
        .catch(() => {
          this.renderData.competitionList = []
        })
    },
    resetCompetitionList() {
      this.renderData.competitionList = []
      this.selector.leagueId = ''
      this.getCompetitionClassify()
      if (Number(this.selector.sportId) === -1) { 
        this.saveRoom({}, 0)
      }
    },
    
    selectCompetition:_debounce(function(item, index) {
      this.renderData.competitionList.forEach(item => {
        item.isSelect = false
      })
      this.renderData.competitionList[index].isSelect = true
      const leagueName =  item.leagueName ? item.leagueName : ''
      const hostTeamName =  item.hostTeamName ? item.hostTeamName : ''
      const guestTeamName =  item.guestTeamName ? item.guestTeamName : ''
      this.currentRoom = this.getSelectType(this.selector.sportId)
        + leagueName + '-' 
        + hostTeamName + 'vs' + guestTeamName
      this.saveRoom(item, 0)
    }, 1000),


    live(item) {
      item.hostTeamName = item.homeTeamName
      item.guestTeamName = item.awayTeamName
      this.selector.leagueId = item.leagueId
      this.saveRoom(item, 1)
    },

    saveRoom(item, param) {
      if (window.bridge) {
        const param = JSON.stringify({url: item.liveM3u8Url || '', matchId: item.matchId || ''})
        window.bridge.onStreamStart(param)
      }

      let postData = {}
      let paramData = {}
      if (param === 0) {
        paramData.live_type_id = this.selector.sportId
        paramData.tag_id = this.selector.dialectId
      }
      if (Number(this.selector.sportId) === -1) {
        postData = {
          uid: this.uid,
          match_id: 0,
          match_type_id: -1,
          room_id: 0,
          match_type_name: '',
          match_name: '',
          title: this.title || this.name,
        }
      } else {
        let team = ''
        if (item.hostTeamName && item.guestTeamName) {
          team = item.hostTeamName + 'vs' + item.guestTeamName
        }
        postData = {
          uid: this.uid,
          match_id: item.matchId,
          match_type_id: this.selector.leagueId,
          room_id: this.roomId,
          match_type_name: item.leagueName,
          match_name: team,
          title: this.title || this.name,
          ...paramData,
        }
      }
      this.$put('v0.1/rooms', {
        apiType: 'anchor',
        body: {
          ...postData
        },
      }).then((res) => {
        const {code, msg} = res
        if (this.$judgeCode(code)) {
          this.getAnchorInfo()
        } else {
          this.$error(msg)
        }
      })
    },

    // 获取已预约比赛
    getOrderCompetitionList() {
      this.$get('v0.1/reservas', {
        body: {
          roomId: this.roomId
        },
        apiType: 'anchor'
      })
        .then((res) => {
          const {code, data} = res
          if (this.$judgeCode(code) && data.length) {
            let arr = []
            data.forEach(item => {
              arr.push(item.match_id)
            })
            this.getMatchName(data, arr)
          } else {
            this.renderData.orderData = []
          }
        })
    },

    // 通过id获取赛事的名称以及类型
    getMatchName(dataArr, param) {
      this.renderData.orderData = []
      this.$get('v9/queryMatchByIds', {
        apiType: 'oldApi',
        body: {
          matchIds: encodeURI(`[${String(param)}]`)
        },
      })
        .then((res)=> {
          const {code, data} = res
          if (this.$judgeCode(code) && data.length) {
            dataArr.forEach(item => {
              data.forEach((ele) => {
                if (ele.matchId === item.match_id) {
                  ele.reserva_id = item.reserva_id
                  this.renderData.orderData.push(ele)
                }
              })
            })
          } else {
            this.renderData.orderData = []
          }
        })
    },

    displayWindowSize() {
      const h = document.documentElement.clientHeight
      let competitionCssText = document.getElementsByClassName('competition')[0]
      let competitionCssText1 = document.getElementsByClassName('competition')[1]
      const height = 'height: ' + h + 'px !important;'
      competitionCssText.style.cssText = height
      competitionCssText1.style.cssText = height
    },

    getSelectType(param) {
      const arr =  this.liveType.filter(item => Number(item.value) === Number(param))
      return arr[0].name || '-'
    }
  },
}
</script>

<style lang="scss" scoped>
.helper {
  width: 295px;
  background: #252525;
  &-header {
    height: 40px;
    border-bottom: 1px solid #121212;
    .tab {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      height: 39px;
      padding-top: 10px; 
      color: #999;
      display: inline-block;
      text-align: center;
      cursor: pointer;
      &:hover {
         color: #3683FF;
      }
    }
    .first-tab {
      margin:0 95px 0 49px;
      
    }
    .is-active {
      color: #3683FF;
      border-bottom: 2px solid #3683FF;
    }
  }

  &-content {
    background: #20242f;
    .desc {
      width: 100%;
      height: 43px;
      border-bottom: 1px solid #121212;
    }
    p {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #999;
      padding: 10px;
      width: 290px;
    }

    .selector {
      border-bottom: 1px solid #323232;
      border-left: 1px solid #323232;
      border-right: 1px solid #323232;
      width: 290px;
      height: 38px;

      /deep/ .ivu-select-dropdown {
        top: 116px !important;
      }

      /deep/ .ivu-select-selection {
        background: #20242f;
        border: none;
      }

      /deep/ .ivu-select-input {
        text-align: center;
      }

      &-option {
        width: 85px;
        text-align: center;
        display: inline-block;
        font-size: 12px;
        color: #FFFFFF;
        padding-top: 2px;
      }
      .option-label {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        letter-spacing: 0;
      }
    }
  }
  
  .competition {
    font-size: 12px;
    color: #FFFFFF;
    margin-top: 16px;

    &-desc {
      display: inline-block;
      cursor: pointer;
      color: #fff;
      height: 17px;
      line-height: 15px;
      margin-bottom: 10px;
      &:hover {
        color: #3683FF;
        border: 1px solid #3683FF;
        border-radius: 5px;
      }
    }
    .active {
      border: 1px solid #3683FF;
      border-radius: 5px;
    }

    .time {
      width: 75px;
      padding-left: 5px;
      display: inline-block;
      text-align: left;
    }
    .host-team {
      width: 98px;
      padding-right: 5px;
      display: inline-block;
      text-align: right;
    }
    .vs {
      width: 15px;
      font-size: 12px;
      display: inline-block;
      text-align: center;
    }
    .guest-team {
      width: 98px;
      padding-left: 5px;
      display: inline-block;
      text-align: left;
    }
  }

  .order {
    
    .competition-desc {
      height: 28px;
      line-height: 15px;
      &:hover {
        color: #fff;
        border: none
      }
    }
    .live {
      padding-top: 8px;
      color: #3683FF;
    }
    .time {
      width: 45px;
    }
    .vs {
      padding-top: 8px;
    }
    .league-name {
      width: 45px;
      padding-top: 8px;
      text-align: left;
    }
    .host-team {
      width: 75px;
      padding-right: 5px;
      padding-top: 8px;
      display: inline-block;
      text-align: right;
    }
    
    .guest-team {
      width: 75px;
      padding-left: 5px;
      padding-top: 8px;
      display: inline-block;
      text-align: left;
    }

  }
}
  .competition {
    overflow-y: auto;
    height: 600px;
  }
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
    border-radius: 6px;
    background-color: #eee;
  }
        
  ::-webkit-scrollbar-track {
    border-radius: 6px;
    background-color: #eee;
  }
        
  ::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background: #20242f;
  }

  .green {
    color: #17f9a4 !important;
  }

  .yellow {
    color: #E4742F !important;
  }
  
     
</style>
