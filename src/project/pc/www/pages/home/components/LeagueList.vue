<template>
  <div class="center-inner">
    <div class="center-top">
      <div class="center-nav">
        <ul class="tabs-header">
          <li>
            <p>
              <a
                :class="{'active': sportType === 0}"
                @click="setSportType(0)"
              >全部赛事</a>
            </p>
          </li>
          <li>
            <p>
              <a
                :class="{'active': sportType === 1}"
                @click="setSportType(1)"
              >足球</a>
            </p>
          </li>
          <li>
            <p>
              <a
                :class="{'active': sportType === 2}"
                @click="setSportType(2)"
              >篮球</a>
            </p>
          </li>
        </ul>
      </div>
      <div class="center-top-right">
        <ul class="date-tabs">
          <li>
            <a
              :class="{active: dateIndex === 0}"
              @click="setDateIndex(0)"
            >昨日<span v-if="competitionNum['yesterday'] !== ''">({{ competitionNum['yesterday'] }})</span></a>
          </li>
          <li>
            <a
              :class="{active: dateIndex === 1}"
              @click="setDateIndex(1)"
            >今日<span v-if="competitionNum['today'] !== ''">({{ competitionNum['today'] }})</span></a>
          </li>
          <li>
            <a
              :class="{active: dateIndex === 2}"
              @click="setDateIndex(2)"
            >明日<span v-if="competitionNum['tomorrow'] !== ''">({{ competitionNum['tomorrow'] }})</span></a>
          </li>
        </ul>
        <ul class="sort-tabs">
          <li>
            <a
              :class="{active: sortType === 0}"
              @click="setSortType(0)"
            >时间排序</a>
          </li>
          <li>
            <a
              :class="{active: sortType === 1}"
              @click="setSortType(1)"
            >赛事排序</a>
          </li>
        </ul>
      </div>
    </div>

    <div class="spin-article">
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

      <template>
        <ul
          v-if="(matches.going.length || sportType === 0) && sortType === 0"
          class="all-list"
        >
          <li
            v-for="item in matches.going"
            :key="item.matchId"
          >
            <p
              class="all-icon"
              :class="[item.sportType == 2 ? 'iconae_ca': 'iconad_ca']"
            />
            <p class="all-time">
              {{ item.matchTime|dateFilter('hh:mm') }}
            </p>
            <p class="league-name">
              {{ item.leagueName }}
            </p>
            <div class="seconds">
            <!--
              数据不对，暂时不展示
              <p class="iconal_da" v-if="item.status === 2"></p>
              <p
                v-if="item.status === 2"
                class="num"
              >{{Math.floor((time - item.matchTime) / 1000 / 60)}}'</p>
            -->
            </div>
            <div class="team-to-team">
              <p
                class="left-team"
                :style="{backgroundImage: `url(${item.hostTeamLogo || defaultLogo})`}"
              >
                {{ item.hostTeamName }}
              </p>
              <p class="score-to-score">
                <span class="number">{{ item.sportType == 1 ? item.homeTeamNormalScore : item.hostTeamScore }}</span>
                <span>-</span>
                <span class="number">{{ item.sportType == 1 ? item.awayTeamNormalScore : item.guestTeamScore }}</span>
              </p>
              <p
                class="right-team"
                :style="{backgroundImage: `url(${item.guestTeamLogo || defaultLogo})`}"
              >
                {{ item.guestTeamName }}
              </p>
            </div>
            <div
              class="all-live"
              @click="toLiveDetail(item)"
            >
              <p
                v-if="(item.hasLive === 1) && dateIndex === 1"
                class="list-status"
              >
                <span class="text">直播</span>
                <span class="iconaj_ec" />
              </p>
            </div>
          </li>
        </ul>
      </template>

      <template v-if="sortType === 0">
        <p
          v-if="matches.upcoming.length && dateIndex === 1"
          class="game unstart"
        >
          <span class="all-icon iconaw_bj" />
          <span class="text">未开始的比赛</span>
        </p>
        <ul
          v-if="matches.upcoming.length || sportType === 0"
          class="all-list"
        >
          <li
            v-for="item in matches.upcoming"
            :key="`${item.matchId}${item.groupId}`"
          >
            <p
              class="all-icon"
              :class="[item.sportType == 2 ? 'iconae_ca': 'iconad_ca']"
            />
            <p class="all-time">
              {{ item.matchTime|dateFilter('hh:mm') }}
            </p>
            <p class="league-name">
              {{ item.leagueName }}
            </p>
            <div class="seconds">
            <!--
              数据不对，暂时不展示
              <p class="iconal_da" v-if="item.status === 2"></p>
              <p
                v-if="item.status === 2"
                class="num"
              >{{Math.floor((time - item.matchTime) / 1000 / 60)}}'</p>
            -->
            </div>
            <div class="team-to-team">
              <p
                class="left-team"
                :style="{backgroundImage: `url(${item.hostTeamLogo || defaultLogo})`}"
              >
                {{ item.hostTeamName }}
              </p>
              <p class="score-to-score">
                <span class="number">VS</span>
              </p>
              <p
                class="right-team"
                :style="{backgroundImage: `url(${item.guestTeamLogo || defaultLogo})`}"
              >
                {{ item.guestTeamName }}
              </p>
            </div>

            <div
              class="all-live"
              @click="toLiveDetail(item)"
            >
              <p
                v-if="(item.hasLive === 1) && dateIndex === 1"
                class="list-status"
              >
                <span>直播</span>
                <span class="iconaj_ec" />
              </p>
            </div>
          </li>
        </ul>
      </template>

      <template v-if="sortType === 0">
        <p
          v-if="matches.finish.length && dateIndex === 1"
          class="game finish"
        >
          <span class="all-icon iconax_bj" />
          <span class="text">已完场的比赛</span>
        </p>
        <ul
          v-if="matches.finish.length || sortType === 0 "
          class="all-list all-list-finish"
        >
          <li
            v-for="item in matches.finish"
            :key="`${item.matchId}${item.groupId}`"
          >
            <p
              class="all-icon"
              :class="[item.sportType == 2 ? 'iconae_ca': 'iconad_ca']"
            />
            <p class="all-time">
              {{ item.matchTime|dateFilter('hh:mm') }}
            </p>
            <p class="league-name">
              {{ item.leagueName }}
            </p>
            <div class="seconds">
            <!--
              数据不对，暂时不展示
              <p class="iconal_da" v-if="item.status === 2"></p>
              <p
                v-if="item.status === 2"
                class="num"
              >{{Math.floor((time - item.matchTime) / 1000 / 60)}}'</p>
            -->
            </div>
            <div class="team-to-team">
              <p
                class="left-team"
                :style="{backgroundImage: `url(${item.hostTeamLogo || defaultLogo})`}"
              >
                {{ item.hostTeamName }}
              </p>
              <p class="score-to-score">
                <span class="number">{{ item.sportType == 1 ? item.homeTeamNormalScore : item.hostTeamScore }}</span>
                <span>-</span>
                <span class="number">{{ item.sportType == 1 ? item.awayTeamNormalScore : item.guestTeamScore }}</span>
              </p>
              <p
                class="right-team"
                :style="{backgroundImage: `url(${item.guestTeamLogo || defaultLogo})`}"
              >
                {{ item.guestTeamName }}
              </p>
            </div>

            <div
              class="all-live"
              @click="toLiveDetail(item)"
            >
              <p
                v-if="item.hasLive === 1"
                class="list-status list-video"
              >
                <span class="text">视频</span>
                <span class="iconai_ee" />
              </p>
            </div>
          </li>
        </ul>
      </template>
      <template v-if="competitionDataGroup && sortType === 1">
        <!-- 赛事排序 -->
        <div
          v-for="ele in competitionDataGroup"
          :key="ele.id"
        >
          <p class="game">
            <span class="text">{{ ele.leagueName }}</span>
          </p>
          <ul class="all-list">
            <li
              v-for="item in ele.data"
              :key="`${item.matchId}${item.groupId}`"
            >
              <p
                class="all-icon"
                :class="[item.sportType == 2 ? 'iconae_ca': 'iconad_ca']"
              />
              <p class="all-time">
                {{ item.matchTime|dateFilter('hh:mm') }}
              </p>
              <p class="league-name">
                {{ item.leagueName }}
              </p>
              <div class="seconds">
              <!--
                数据不对，暂时不展示
                <p class="iconal_da" v-if="item.status === 2"></p>
                <p
                  v-if="item.status === 2"
                  class="num"
                >{{Math.floor((time - item.matchTime) / 1000 / 60)}}'</p>
              -->
              </div>
              <div class="team-to-team">
                <p
                  class="left-team"
                  :style="{backgroundImage: `url(${item.hostTeamLogo || defaultLogo})`}"
                >
                  {{ item.hostTeamName }}
                </p>
                <p
                  v-if="item.vs === 1"
                  class="score-to-score"
                >
                  <span class="number">VS</span>
                </p>
                <p
                  v-if="item.vs === 0"
                  class="score-to-score"
                >
                  <span class="number">{{ item.sportType == 1 ? item.homeTeamNormalScore : item.hostTeamScore }}</span>
                  <span>-</span>
                  <span class="number">{{ item.sportType == 1 ? item.awayTeamNormalScore : item.guestTeamScore }}</span>
                </p>
                <p
                  class="right-team"
                  :style="{backgroundImage: `url(${item.guestTeamLogo || defaultLogo})`}"
                >
                  {{ item.guestTeamName }}
                </p>
              </div>

              <div
                class="all-live"
                @click="toLiveDetail(item)"
              >
                <p
                  v-if="item.hasLive === 1"
                  class="list-status list-video"
                >
                  <span class="text">视频</span>
                  <span class="iconai_ee" />
                </p>
                <p
                  v-if="item.hasLive === 0 && item.lmtMode === 1"
                  class="list-status list-video"
                >
                  <span class="text">动画</span>
                  <span class="iconai_ee" />
                </p>
              </div>
            </li>
          </ul>
        </div>
      </template>
      
      <div
        v-if="!matches.finish.length && !matches.upcoming.length && !matches.going.length && !competitionDataGroup.length"
        class="nodata"
      >
        暂无数据
      </div>
    </div>
  </div>
</template>
<script>
import { Spin, Icon } from 'iview'
import { groupBy } from '@/comm/utils/common'
import defaultLogo from '../../../assets/default_team_logo.png'
export default {
  components: {
    Spin,
    Icon
  },
  data() {
    return {
      // 0全部，足球1 篮球2
      sportType: 0,

      // 0 昨天 1 今天 2 明天
      dateIndex: 1,

      // 0 时间排序，1 赛事排序（分类）
      sortType: 0,
      
      // 赛事排序
      sortTypeFlag: true,
      fetchStatus: 0,
      competitionNum: {
        'today': '',
        'tomorrow': '',
        'yesterday': ''
      },
      dateData: {
        '0': 'yesterday',
        '1': 'today',
        '2': 'tomorrow'
      },
      competitionData: [],
      matches: {
        finish: [],
        going: [],
        upcoming: [],
      },
      competitionDataGroup: [],
      defaultLogo,
      spinShow: false,
    }
  },
  computed: {
    dateText() {
      let { dateIndex } = this
      let time = new Date(Date.now() + (dateIndex - 1) * 24 * 60 * 60 * 1000)
      return this.getDateText(time)
    },
  },
  mounted() {
    this.getCompetitionList('true')
  },
  methods: {
    async getCompetitionList(param) {
      let { sportType, dateText } = this
      if (param) {
        this.spinShow = true
      }
      // 该接口换成 v8/queryAll，待完善
      const res = await this.$get('v8/queryAll', {
        sportType,
        date: dateText,
        matchIds: '',
        leagueIds: ''
      })
      const { data } = res
      if (data) {
        this.fetchStatus = 1
        this.competitionData = {...data}

        Object.keys(data).forEach((item) => {
          let len = 0
          let dayData = data[item]
          Object.keys(dayData).forEach(ele => {
            len += dayData[ele].length
          })
          this.competitionNum[item] = len
        })

        // 时间排序
        if (this.sortType === 0) {
          this.competitionDataHelper(this.dateData[String(this.dateIndex)])
        } else {

          // 赛事排序
          this.competitionDataGroup = []
          this.competitionTypeHelper()
        }
      } else {
        this.fetchStatus = 2
      }
      this.spinShow = false
    },
    setSportType(type) {
      let { sportType } = this
      if (sportType !== type) {
        this.sportType = type
        this.getCompetitionList()
      }
    },
    setDateIndex(index) {
      let { dateIndex } = this
      if (dateIndex !== index) {
        this.dateIndex = index
        if (this.sortType === 0) {
          this.competitionDataHelper(this.dateData[String(this.dateIndex)])
        } else {
          this.competitionDataGroup = []
          this.getCompetitionList()
          this.competitionTypeHelper()
        }
      }
    },

    competitionDataHelper(param) {
      Object.keys(this.matches).forEach((item) => {
        this.matches[item] = []
        if (this.competitionData[param][item]) {
          let data = this.competitionData[param][item]
          // 足球 篮球过滤
          if ([1,2].includes(this.sportType)) {
            const arr =  data.filter(item => item.sportType === this.sportType)
            this.matches[item] = [...arr]
          } else {
            this.matches[item] = [...data]
          }
        }
      })
    },

    // 时间、赛事排序
    setSortType(index) {
      this.sortType = index
      this.sortTypeFlag = !this.sortTypeFlag
      if (this.sortType === 1) {
        this.competitionTypeHelper()
      } else {
        this.competitionDataGroup = []
        this.getCompetitionList()
        this.sortTypeHelper('matchTime')
      }
    },

    competitionTypeHelper() {
      this.resetMatches()
      const data = this.competitionData[this.dateData[String(this.dateIndex)]]
      let competitionArr = []
      // 赛事组装
      Object.keys(data).forEach(item => {
        data[item].forEach(ele => {
          if (item === 'upcoming' || this.dateData[String(this.dateIndex)] === 'tomorrow') {
            ele.vs = 1
          } else {
            ele.vs = 0
          }
          competitionArr.push(ele)
        })
      })
      
      this.competitionDataGroup = groupBy(competitionArr, 'leagueId')
      let competitionDataGroup = []
      Object.keys(this.competitionDataGroup).forEach(item => {
        const obj = {}
        obj.id = item
        let data = this.competitionDataGroup[item]
        
        if (data.length) {
          if ([1,2].includes(this.sportType)) {
            let dataFilter = data.filter(ele => ele.sportType === this.sportType)
            if (dataFilter.length) {
              obj.data = [...dataFilter]
              obj.leagueName = obj.data[0].leagueName
              competitionDataGroup.push(obj)
            }
          } else {
            obj.data = data
            obj.leagueName = obj.data[0].leagueName
            competitionDataGroup.push(obj)
          }
        }
      })
      this.$nextTick(() => {
        this.competitionDataGroup = competitionDataGroup
      })
      
    },

    sortTypeHelper(param) {
      Object.keys(this.matches).forEach((item) => {
        this.$nextTick(() => {
          if (this.sortTypeFlag) {
            this.matches[item].sort((first, second) => {
              return first[param] - second[param]
            })
          } else {
            this.matches[item].sort((first, second) => {
              return second[param] - first[param]
            })
          }
          this.$set(this.matches, item, this.matches[item])
        })
      })
    },

    getDateText(timestamp) {
      let time = new Date(timestamp)
      let month = time.getMonth() + 1
      let day = time.getDate()
      month = month < 10 ? `0${month}` : month
      day = day < 10 ? `0${day}` : day
      return `${time.getFullYear()}-${month}-${day}`
    },

    // 直播页
    toLiveDetail(item = {}) {
      const param = {id: item.matchId}
      const routerData = this.$router.resolve({
        path: '/live/detail',
        query: param
      })
      window.open(routerData.href, '_blank')
    },

    resetMatches() {
      this.$set(this.matches, 'finish', [])
      this.$set(this.matches, 'going', [])
      this.$set(this.matches, 'upcoming', [])
    }
  }
}
</script>
<style lang="postcss" scoped>
.tabs-header {
  border-bottom: solid 1px #f1f1f1;
  padding-left: 18px;
  font-size: 14px;
  &::after {
    content: '';
    display: block;
    clear: both;
  }
  li {
    float: left;
    margin-right: 46px;
    color: #666666;
    &:last-child {
      marign: 0;
    }
    a {
      color: #666666;
      display: block;
      padding-bottom: 11px;
      &.active {
        font-size: 16px;
        color: #3683ff;
        border-bottom: solid 2px #3683ff;
        position: relative;
      }
    }
  }
}
.center-inner {
  .center-top {
    overflow: hidden;
    padding: 20px 22px 0 0;
    line-height: 25px;
    .center-nav {
      float: left;
    }
    .tabs-header {
      border: none;
      padding-left: 22px;
      font-size: 16px;
      li {
        margin-right: 38px;
        a {
          &.active {
            font-size: 16px;
          }
        }
      }
    }
    .center-top-right {
      float: right;
      overflow: hidden;
      .date-tabs {
        float: left;
        overflow: hidden;
        margin-right: 0;
        li {
          float: left;
          font-size: 12px;
          color: #666666;
          margin-right: 10px;
          a {
            display: block;
            &.active {
              color: #3683ff;
            }
          }
          &:last-child {
            margin-right: 10px;
          }
        }
      }
      .sort-tabs {
        float: right;
        overflow: hidden;
        font-size: 12px;
        line-height: 22px;
        margin-top:1px;
        li {
          float: left;
          margin-right: 12px;
          &:last-child {
            margin: 0;
          }
          a {
            display: block;
            background: #f5f5f5;
            border-radius: 13px;
            padding: 0 14px;
            &.active {
              background: #3683ff;
              color: #ffffff;
            }
          }
        }
      }
    }
  }
}

.all-list {
  overflow: hidden;
  li:first-child {
    border-top: solid 1px #f1f1f1;
  }

  li {
    font-size: 12px;
    color: #999999;
    padding: 14px 29px 14px 20px;
    border-bottom: solid 1px #f1f1f1;
    line-height: 17px;
    overflow: hidden;
    .all-icon {
      float: left;
      width: 14px;
    }
    .all-time {
      float: left;
      width: 44px;
      margin-left: 20px;
    }
    .league-name {
      float: left;
      width: 72px;
      margin-right: 6px;
    }
    .seconds {
      float: left;
      width: 60px;
      overflow: hidden;
      .iconal_da {
        font-size: 16px;
        margin-right: 7px;
      }
      .num {
        font-size: 12px;
        color: #cf4c45;
      }
    }
    .left-team,
    .right-team {
      width: 150px;
      background-repeat: no-repeat;
      background-size: 18px auto;
    }
    .left-team {
      text-align: right;
      background-position: right center;
      padding-right: 24px;
    }
    .right-team {
      text-align: left;
      background-position: left center;
      padding-left: 24px;
    }
    .team-to-team {
      float: left;
      overflow: hidden;
      width: 380px;
      color: #333333;
      p {
        float: left;
      }
      .score-to-score {
        width: 80px;
        text-align: center;
        font-size: 18px;
        color: #333333;
      }
    }
    .all-live {
      float: right;
    }

    .list-status {
      font-family: PingFangSC-Regular;
      width: 55px;
      border-radius: 21px;
      line-height: 18px;
      text-align: center;
      font-size: 12px;
      color: #ffffff;
      background: #cf4c45;
      cursor: pointer;
      .text {
        padding-left: 5px;
      }
      .iconai_ee,
      .iconaj_ec {
        font-size: 6px;
        font-family: 'iconfont';
      }
    }
    .list-video {
      color: #666;
      background: #fff;
      border: 1px solid #999;
    }

    
    .iconad_ca,
    .iconae_ca,
    .iconal_da {
      float: left;
      font-family: 'iconfont';
      font-size: 20px;
    }
  }
}

.game {
  height: 48px;
  text-align: center;
  line-height: 48px;
  border-bottom: 1px solid #F1F1F1;

  .iconax_bj,
  .iconaw_bj {
    font-size: 16px;
    font-family: 'iconfont';
    
  }
  .iconaw_bj {
    color: #F5AA58;
  }
  .iconax_bj {
    color: #666
  }

  .text {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    letter-spacing: 0;
  }
}
.unstart {
  .text {
    color: #F5AA58;
  }
}

.finish {
  .text {
    color: #666;
  }
}

.nodata {
  border-top: 1px solid #eee;
  height: 200px;
  line-height: 200px;
  text-align: center;
}
</style>
