<template>
  <div class="content">
    <div class="appoint">
      <div class="title clearfix">
        <p class="fl">
          <span class="info">一天时间最多预约10场比赛</span>
          <span class="warn">温馨提示：如果预约的比赛没有正常开播,会影响亲的信用喔</span>
        </p>
        <Button
          class="fr mt"
          type="primary"
          @click="handlerOrder"
        >
          预约比赛
        </Button>
      </div>
      <Table
        :columns="alreadyOrder"
        :data="data"
      >
        <template
          slot="competition"
          slot-scope="{ row }"
        >
          <span
            v-if="row.match_name && row.match_name.indexOf(',') > -1"
          >{{ row.match_name.split(',')[0] }} vs {{ row.match_name.split(',')[1] }}</span>
          <span v-if="row.homeTeamName">{{ row.homeTeamName }} vs {{ row.awayTeamName }}</span>
        </template>
        <template
          slot="matchTime"
          slot-scope="{ row }"
        >
          {{ returnTime(row.matchTime) }}
        </template>

        <template
          slot="action"
          slot-scope="{ row, index }"
        >
          <span
            class="danger"
            @click="remove(row.reserva_id, index)"
          >删除</span>
        </template>
      </Table>
    </div>

    <Modal
      v-model="dialogVisibleOrder"
      width="900px"
      title="预约比赛"
      @on-cancel="cancel"
    >
      <div v-if="dialogVisibleOrder">
        <div class="order">
          <div class="order-header clearfix">
            <div class="option fl">
              <div class="iblock mr">
                <span class="option-label">选择预约时间：</span>
                <Select
                  v-model="order.time"
                  class="select-small"
                  placeholder="请选择"
                  @on-change="getCompetitionList"
                >
                  <Option
                    v-for="item in optionsTime"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </Select>
              </div>
              <div class="iblock mr">
                <span class="option-label">选择预约类型：</span>
                <Select
                  v-model="order.sportId"
                  class="select-small"
                  placeholder="请选择"
                  @on-change="getCompetitionClassify"
                >
                  <Option
                    v-for="(item, e) in liveType"
                    :key="e"
                    :value="item.value"
                  >
                    {{ item.name }}
                  </Option>
                </Select>
              </div>
              <div class="iblock">
                <span class="option-label">选择预约赛事：</span>
                <Select
                  v-model="order.leagueId"
                  placeholder="请选择"
                  filterable
                  class="select-long"
                  @on-change="getCompetitionList"
                >
                  <Option
                    v-for="item in optionsCompetition"
                    :key="item.leagueId"
                    :label="item.leagueName"
                    :value="item.leagueId"
                  />
                </Select>
              </div>
            </div>
            <div class="fr">
              共查询到{{ total }}场比赛
            </div>
          </div>
          <div
            class="order-inner mt"
            style="width:880px;"
          >
            <div style="width:860px;">
              <Table
                ref="selection"
                :columns="orderCompetitionHeader"
                :data="orderCompetition"
                border
                style="width: 100%"
              >
                <template
                  slot="time"
                  slot-scope="scope"
                >
                  <span>{{ returnTime(scope.row.matchTime) }}</span>
                </template>
                <template
                  slot="count"
                  slot-scope="scope"
                >
                  <span>{{ scope.row.count }}人预约</span>
                </template>
                <template
                  slot="competition"
                  slot-scope="scope"
                >
                  <div class="competition">
                    <span class="host-team">{{ scope.row.hostTeamName }}</span>
                    <span class="vs">VS</span>
                    <span class="guest-team">{{ scope.row.guestTeamName }}</span>
                  </div>
                </template>
                <template
                  slot="action"
                  slot-scope="scope"
                >
                  <span
                    class="primary"
                    @click="handleOrder(scope.row, scope.index)"
                  >预约</span>
                </template>
              </Table>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" />
    </Modal>
  </div>
</template>

<script >
import { Table, Select, Option, Button, Modal } from 'iview'
import { mapActions } from 'vuex'
import dayjs from 'dayjs'
import { _throttle } from '@/comm/utils/common'
import mixin from '../mixins'

export default {
  components: {
    Table,
    Select,
    Option,
    Button,
    Modal
  },
  mixins: [mixin],
  data() {
    return {
      dialogVisibleOrder: false,
      data: [],
      orderCompetition: [],
      order: {
        time: '1',
        sportId: 1,
        leagueId: '-1'
      },
      optionsCompetition: [],
      optionsTime: [
        { name: '今天', value: '1' },
        { name: '明天', value: '2' },
        { name: '后天', value: '3' }
      ],
      liveType: [],
      total: 0
    }
  },
  created() {
    this.init()
  },
  mounted() {
    this.getOrderCompetitionList()
    this.getCompetitionList()
    this.getCompetitionClassify()
  },
  methods: {
    ...mapActions([
      'GetCompetitionClassify',
      'GetCompetitionList',
      'GetLiveType'
    ]),

    init() {
      if (this.liveType.length) {
        return
      }
      this.GetLiveType({ vm: this })
        .then(data => {
          this.liveType = data
        })
        .catch(() => {
          this.liveType = [
            { name: '足球', value: 1 },
            { name: '篮球球', value: 2 },
            { name: '其他', value: -1 }
          ]
        })
    },

    // 获取已预约比赛
    getOrderCompetitionList() {
      this.$get('v0.7/reservas', {
        body: {
          anchor_uid: this.getUserInfo().uid
        },
        apiType: 'anchor'
      }).then(res => {
        const { code, data } = res
        if (this.$judgeCode(code) && data.length) {
          this.data = data
        } else {
          this.data = []
        }
      })
    },

    getCompetitionClassify() {
      this.optionsCompetition = []
      this.GetCompetitionClassify({ sportId: this.order.sportId, vm: this })
        .then(data => {
          this.optionsCompetition = data
          this.optionsCompetition.unshift({
            leagueName: '全部',
            leagueId: '-1'
          })
        })
        .catch(() => {
          this.optionsCompetition = []
        })
      this.getCompetitionList()
    },

    getCompetitionList() {
      const selectDate = {
        '1': dayjs().format('YYYY-MM-DD'),
        '2': dayjs()
          .add(1, 'day')
          .format('YYYY-MM-DD'),
        '3': dayjs()
          .add(2, 'day')
          .format('YYYY-MM-DD')
      }
      this.GetCompetitionList({
        days: 1,
        startDate: selectDate[String(this.order.time)],
        sportId: this.order.sportId,
        leagueId: this.order.leagueId,
        vm: this
      })
        .then(data => {
          this.getOrderNum(data)
        })
        .catch(() => {
          this.orderCompetition = []
        })
    },

    // 获取预约比赛 赛事状态预约的人数
    getOrderNum(competition) {
      let arr = competition
      this.orderCompetition = []
      this.$get('v0.1/reservas/countMatchByIds', {
        body: {
          matchIds: String(this.getId(arr))
        },
        apiType: 'anchor'
      })
        .then(res => {
          const { code, data, msg } = res
          if (this.$judgeCode(code) && data.length) {
            data.forEach(item => {
              arr.map(ele => {
                ele.count = ele.matchId === item.match_id ? item.count : '-'
                ele.isCheck = false
              })
            })
          } else {
            arr.map(ele => {
              ele.count = '-'
              ele.isCheck = false
            })
          }
          this.orderCompetition = arr
          this.total = this.orderCompetition.length
        })
        .catch(() => {
          arr.map(ele => (ele.count = '-'))
          this.orderCompetition = arr
        })
    },

    handlerOrder() {
      this.order = {
        time: '1',
        sportId: 1,
        leagueId: '-1'
      }
      this.getCompetitionList()
      this.dialogVisibleOrder = true
    },

    remove(reserva_id, index) {
      this.$del('v0.1/reservas', {
        apiType: 'anchor',
        body: {
          reservaIds: String(reserva_id)
        }
      }).then(res => {
        const { code, msg } = res
        if (this.$judgeCode(code)) {
          this.$success('删除成功')
          this.data.splice(index, 1)
          this.getCompetitionList()
          this.$parent.getAnchorSetInfo()
        } else {
          this.$error(msg)
        }
      })
    },

    handleOrder: _throttle(function(data, index) {
      let arr = []
      arr.push({
        anchor_uid: this.getUserInfo().uid,
        match_id: data.matchId,
        match_name: data.hostTeamName + ',' + data.guestTeamName, // 主队 客队
        match_type_name: data.leagueName,
        live_type_name: this.getTypeName(),
        live_type_id: this.order.sportId,
        match_start_time: data.matchTime
      })
      this.$post('v0.7/reservas', {
        apiType: 'anchor',
        body: {
          matchInfo: JSON.stringify(arr)
        }
      }).then(res => {
        const { code, msg } = res
        if (this.$judgeCode(code)) {
          this.$success('预约成功')
          this.orderCompetition.splice(index, 1)
          this.getOrderCompetitionList(this.roomId)
          this.$parent.getAnchorSetInfo()
        } else {
          this.$error(msg)
        }
      })
    }, 2000),

    getId(data) {
      let matchIds = []
      data.forEach(ele => {
        matchIds.push(ele['matchId'])
      })
      return matchIds
    },

    returnTime(val) {
      return dayjs(val).format('YYYY-MM-DD HH:mm')
    },

    checkChange(val, index) {
      this.orderCompetition[index].isSelect = val
      let len = 0
      this.orderCompetition.forEach(item => {
        if (item.isSelect) {
          ++len
        }
      })
      if (len > 10) {
        this.msg.warn('一天最多预约10场比赛')
        return
      }
    },

    cancel() {
      this.dialogVisibleOrder = false
    },

    getTypeName() {
      const arr = this.liveType.filter(
        item => Number(item.type_id) === Number(this.order.sportId)
      )
      return arr[0].name || ''
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 0 40px 50px;
  .appoint {
    margin-bottom: 70px;
  }
}

.list {
  margin-top: 20px;
}

/deep/ .clearfix:after {
  clear: right;
}

/deep/ .ivu-select-selected-value {
  line-height: 27px !important;
}

.title {
  height: 50px;
  line-height: 50px;
  font-weight: 500;
  font-size: 13px;
  .mt {
    margin-top: 10px;
  }
}

.order-header {
  height: 25px;
  .select-small {
    width: 74px;
  }
  .select-long {
    width: 150px;
  }
  /deep/ .ivu-select-selection {
    height: 26px;
  }
  /deep/ .ivu-select-selected-value {
    font-size: 12px;
    color: #666666;
  }
  /deep/ .ivu-select-input {
    height: 27px;
    line-height: 27px;
  }

  &__title {
    font-size: 14px;
    color: #333333;
    padding-top: 5px;
  }
  .option-label {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #333333;
    letter-spacing: 0;
  }
}

.order-record {
  &__header {
    display: flex;
    justify-content: space-between;
  }
  .header-search {
    flex: 1;
    justify-content: flex-start;
  }
}

.danger {
  font-size: 12px;
  color: #f82301;
  letter-spacing: 0;
  text-align: center;
  cursor: pointer;
}

.primary {
  color: #3683ff;
}
.info {
  color: #89898a;
}

.warn {
  color: #ff9900;
}

.competition {
  span {
    display: inline-block;
  }
}
.host-team {
  width: 120px;
  text-align: right;
}
.guest-team {
  width: 120px;
  text-align: left;
}
.vs {
  font-weight: 700;
}

.order-inner {
  height: 600px;
  overflow: auto;
}

/*滚动条样式*/
.order-inner::-webkit-scrollbar {
  width: 4px;
  height: 120px;
}
.order-inner::-webkit-scrollbar-thumb {
  border-radius: 4px;
  width: 4px;
  height: 120px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #d8d8d8;
}
.order-inner::-webkit-scrollbar-track {
  width: 0px;
  color: #fff;
  background: #fff;
  opacity: 0;
}
</style>
