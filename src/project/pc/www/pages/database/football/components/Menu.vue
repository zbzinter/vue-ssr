
<template>
  <div class="content">
    <div
      v-for="(item, indexItem) in menu"
      :key="item.id"
      class="item"
    >
      <div
        class="desc clearfix"
        @click="collapse(item)"
      >
        <span class="fl">{{ item.title }}</span>
        <i
          class="fr iconfont  down"
          :class=" isShow === item.id ? 'iconbk_ce' : 'iconbg_ce' "
        />
      </div>
      <template v-if=" isShow === item.id && item.competitionAndCountry && item.competitionAndCountry.length">
        <div
          v-for="(e, index) in item.competitionAndCountry"
          :key="e.name"
        >
          <div
            class="type clearfix"
            @click.stop="handleClickType(indexItem, item.id, index)"
          >
            <span class="fl symbol">{{ !e.isSelect ? '+' : '-' }}</span>
            <span class="fl name">{{ e.name }}</span>
          </div>
          <!-- 赛事 -->
          <div
            v-if="isShow === item.id && item.competitionAndCountry && index === 0 && e.isSelect"
            class="cont"
          >
            <ul>
              <li
                v-for="(child, index) in leagueList"
                :key="child.id"
                class="group clearfix"
                :class="child.isSelect ? 'group-active': '' "
                @click="switchCompetition(child, index)"
              >
                <img
                  :src="child.logoUrl"
                  alt=""
                  class="fl logo"
                >
                <span class="fl name">{{ child.cnAlias }}</span>
              </li>
            </ul>
          </div>
        </div>
        
        <!-- 国家 -->
        <div class="cont">
          <ul>
            <li
              v-for="(ele, index) in countryList"
              :key="ele.id"
              class="country-group"
              @click.stop="getCountryCompetition(ele.id, index)"
            >
              <div class="clearfix">
                <span class="fl symbol country-symbol">{{ !ele.isSelect ? '+' : '-' }}</span>
                <img
                  :src="ele.picUrl"
                  alt=""
                  class="fl logo country-logo"
                >
                <Tooltip
                  class="fl"
                  placement="top"
                  :content="ele.cnName"
                >
                  <span class="name country-name pt ellipsis"> {{ ele.cnName }} </span>
                </Tooltip>
              </div>

              <div>
                <!-- 国家赛事 -->
                <ul v-if="countryCompetition && countryCompetition.length && countryId === ele.id && ele.isSelect">
                  <li
                    v-for="(e, eindex) in countryCompetition"
                    :key="e.id"
                    class="country-group group clearfix"
                    :class="e.isSelect ? 'group-active': '' "
                    @click.stop="switchCompetition(e, eindex)"
                  > 
                    <img
                      :src="e.logoUrl"
                      alt=""
                      class="fl logo country-logo"
                    >
                    <span
                      class="fl name country-name ellipsis"
                    >{{ e.cnAlias }}</span>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </template>
      
      <!-- 赛事 -->
      <div
        v-if="isShow === item.id && !item.competitionAndCountry && type === -1"
        class="cont"
      >
        <ul>
          <li
            v-for="(child, index) in leagueList"
            :key="child.id"
            class="group clearfix"
            :class="child.isSelect ? 'group-active': '' "
            @click="switchCompetition(child, index)"
          >
            <img
              :src="child.logoUrl"
              alt=""
              class="fl logo"
            >
            <span class="fl name">{{ child.cnAlias }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// import mixins from '../mixins'
import {
  Tooltip
} from 'iview'
export default {
  // mixins: [mixins],
  components: {
    Tooltip
  },
  data() {
    return {
      isShow: 0,
      type: -1,
      active: true,
      leagueList: [],
      countryList: [],
      countryCompetition: [],
      menu: [
        {
          id: 1,
          title: '热门赛事',
          subName: '热门',
          i: ''
        },
        // {
        //   id: 2,
        //   title: '特别关注',
        //   subName: '关注'
        // },
        {
          id: 3,
          title: '国际赛事',
          subName: '国际'
        },
        {
          id: 4,
          title: '欧洲',
          subName: '欧洲',
          competitionAndCountry: [
            {
              name: '欧洲赛事',
              isSelect: false,
            }
          ],
        },
        {
          id: 5,
          title: '亚洲',
          subName: '亚洲',
          competitionAndCountry: [
            {
              name: '亚洲赛事',
              isSelect: false,
            }
          ],
        },
        {
          id: 6,
          title: '美洲',
          subName: '美洲',
          competitionAndCountry: [
            {
              name: '美洲赛事',
              isSelect: false,
            }
          ],
        },
        {
          id: 7,
          title: '非洲',
          subName: '非洲',
          competitionAndCountry: [
            {
              name: '非洲赛事',
              isSelect: false,
            }
          ],
        },
        {
          id: 8,
          title: '大洋洲',
          subName: '大洋洲',
          competitionAndCountry: [
            {
              name: '大洋洲赛事',
              isSelect: false,
            }
          ],
        },
      ],
      seasonId: '',
      typeId: '', // 联赛 杯赛
      id: '',
      countryId: ''
    }
  },
  created() {
    this.collapse({id: 1})
  },
  methods: {
    collapse({id}) {
      this.id = id
      if (this.isShow === id) {
        this.isShow = 0
        return
      }
      this.leagueList = []
      this.countryList = []
      this.isShow = id
      this.type = -1
      this.$get('v4/league/getLeagueAndCountry', {
        typeId: id
      }).then(res => {
        const {code, data: {leagueList, countryList}} = res
        if (this.$judgeCode(code)) {

          if (leagueList && leagueList.length) {
            leagueList.map(e => {
              e.isSelect = false
            })
            this.leagueList = leagueList
          }

          if (countryList && countryList.length) {
            countryList.map(e => {
              e.isSelect = false
            })
            this.countryList = countryList
          }

        } else {
          this.leagueList = []
          this.countryList = []
        }
      })
    },

    switchCompetition({id, seasonId, type, logoUrl, cnAlias, cnName}, index) {
      this.leagueList.forEach(item => item.isSelect = false)
      this.leagueList[index].isSelect = true
      
      this.id = id
      this.seasonId = seasonId
      this.typeId = type
      this.$emit('switchCompetition', {type, id, seasonId})

    },

    handleClickType(index, id, currentIndex) {
      console.log(index, id, currentIndex)
      if (this.menu[index].competitionAndCountry[currentIndex].isSelect) {
        this.menu[index].competitionAndCountry[currentIndex].isSelect = false
      } else {
        this.menu[index].competitionAndCountry[currentIndex].isSelect = true
      }
      // this.$set(this.menu, index, this.menu[index].competitionAndCountry[currentIndex])
      // this.active = !this.active
      // if (this.active && this.type === index) {
      //   this.type = -1
      //   return
      // }
      // this.type =  index
    },

    // 获取国家赛事
    getCountryCompetition(countryId, index) {
     
      this.countryId = countryId
      if (this.countryList[index].isSelect) {
        this.countryList[index].isSelect = false
        return
      }
      this.countryList.map(e => {
        e.isSelect = false
      })
      this.countryList[index].isSelect = true
      
      this.$get('v4/league/getLeagueByCountry', {countryId})
        .then((res) => {
          const data = res.data.leagueList
          if (data && data.length) {
            data.forEach(item=> item.isSelect=false)
            this.countryCompetition = data
          } else {
            this.countryCompetition = []
          }
         
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 210px;
  background: #fff;
  .desc {
    height: 68px;
    line-height: 68px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    span {
      font-family: PingFangSC-Semibold;
      font-size: 16px;
      letter-spacing: 0;
      font-weight: 700;
      color: #3683FF;
      display: inline-block;
      padding-left: 18px;
    }
    i {
      display: inline-block;
      padding-right: 20px;
      font-size: 10px;
    }
  }

  .cont {
    display: block;
    .group {
      line-height: 48px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
      &:hover {
        .name {
          color: #fff;
        }
        background: #3683FF;
      }
    }
    .group-active {
      .name {
        color: #fff;
      }
      background: #3683FF;
    }
    .logo {
      width: 32px;
      height: 32px;
      display: inline-block;
      margin: 8px 18px;
    }
    .name {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      padding-left: 8px;
      display: inline-block;
    }
    .active {
      background: #3683FF;
      color: #fff;
    }

    .country-group {
      padding-left: 20px;
    }

    .country-symbol {
      font-weight: 500;
      padding-top: 12px;
    }

    .country-logo {
      margin: 8px 0px;
    }

    .country-name {
      font-size: 14px;
      width: 120px;
    }

  }

  .type {
    color: #333333;
    height: 48px;
    line-height: 48px;
    padding-left: 20px;
    border-bottom: 1px solid #eee;
    cursor: pointer;
    .name {
      font-size: 16px;
    }
  }
  .symbol {
    font-size: 25px;
    display: inline-block;
    padding-right: 14px;
    width: 25px;
    height: 25px;
  }
}
.down {
  color: #00000073;
}
.up {
  color: #00000073;
}
.pt {
  padding-top: 12px;
}
</style>
