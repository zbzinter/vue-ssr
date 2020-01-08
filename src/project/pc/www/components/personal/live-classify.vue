<template>
  <div>
    <Modal
      v-model="dialogVisible"
      title="直播分类"
      width="600px"
      :footer-hide="true"
      @on-cancel="cancel"
    >
      <div class="content">
        <div class="bb">
          <span
            v-for="(item, index) in data"
            :key="index"
            class="desc"
            :class=" item.isSelect ? 'is-active': '' "
            @click="select(item, index)"
          >
            {{ item.name }}
            <span v-if="index === selectIndex">{{ `(${total})` }}</span>
          </span>
        </div>
        <div class="competition">
          <span
            v-for="(item, index) in competition"
            :key="index"
            class="desc"
            :class=" item.isSelect ? 'is-active': '' "
            @click="selectCompetition(item, index)"
          >{{ item.leagueName }}</span>
          <NoData v-if="!competition.length" />
        </div>
      </div>
    </Modal>

    <Modal
      v-model="dialogVisibleName"
      title="场次选择"
      class="session-set"
      width="900px"
      @on-cancel="cancel"
    >
      <div class="goback">
        <span @click="goback">返回</span>
      </div>
      <p class="title">
        请选择比赛场次
      </p>
      <div class="competition-matches">
        <div
          v-for="(item, index) in competitionList"
          :key="index"
          class="competition-matches__desc"
          :class=" item.isSelect ? 'is-active': '' "
          @click="selectCompetitionName(item, index)"
        >
          <span class="iblock time">{{ dayjs(item.matchTime).format('MM-DD HH:mm') }}</span>
          <span class="iblock host-team ellipsis">{{ item.hostTeamName }}</span>
          <span class="iblock vs">VS</span>
          <span class="iblock guest-team ellipsis">{{ item.guestTeamName }}</span>
        </div>
        <NoData v-if="!competitionList.length" />
      </div>
      <div slot="footer">
        <Button @click="cancel">
          取消
        </Button>
        <Button
          type="primary"
          @click="confirm"
        >
          确认
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { Button, Modal } from 'iview'
import { mapActions } from 'vuex'

export default {
  components: {
    Modal,
    Button
  },
  data() {
    return {
      dialogVisible: false,
      dialogVisibleName: false,
      total: 0,
      selectIndex: 0,
      sport: {
        sportId: 0,
        sportName: ''
      },
      data: [],
      competition: [],
      competitionName: [],
      competitionList: [],
      selectCompetitionData: {},
      selectGameData: {}
    }
  },
  methods: {
    ...mapActions([
      'GetLiveType',
      'GetCompetitionClassify',
      'GetCompetitionList'
    ]),

    openLIveClassify() {
      this.total = 0
      this.selectIndex = 0
      this.init()
    },

    init() {
      this.GetLiveType({ vm: this })
        .then(data => {
          if (data.length > 0) {
            data[0].isSelect = true
            this.getCompetitionClassify(data[0].value)
          }
          this.data = data
        })
        .catch(() => {
          this.data = [
            { name: '足球', value: 1 },
            { name: '篮球', value: 2 },
            { name: '其他', value: -1 }
          ]
        })
    },

    getCompetitionClassify(sportId) {
      this.GetCompetitionClassify({ sportId, vm: this })
        .then(data => {
          this.competition = data
          if (data && data.length) {
            this.total = data.length
          } else {
            this.total = 0
          }
          this.dialogVisible = true
        })
        .catch(() => {
          this.total = 0
          this.competition = []
        })
    },

    cancel() {
      this.dialogVisibleName = false
      this.dialogVisible = false
    },

    select(item, index) {
      this.selectIndex = index
      this.data.map(e => {
        e.isSelect = false
      })
      item.isSelect = true
      this.$set(this.data, item.isSelect, index)
      this.sport.sportId = item.value
      this.sport.sportName = item.name
      this.getCompetitionClassify(item.value)
    },

    selectCompetition(item, index) {
      this.competition.map(e => {
        e.isSelect = false
      })
      item.isSelect = true

      this.selectCompetitionData = {
        leagueId: item.leagueId,
        leagueName: item.leagueName
      }

      this.$set(this.competition, item.isSelect, index)
      this.getCompetitionList(item.leagueId)
    },

    getCompetitionList(leagueId) {
      this.GetCompetitionList({
        leagueId,
        sportId: this.sport.sportId,
        vm: this
      })
        .then(data => {
          this.competitionList = data
          this.dialogVisibleName = true
          this.dialogVisible = false
        })
        .catch(() => {
          this.competitionList = []
        })
    },

    goback() {
      this.dialogVisibleName = false
      this.dialogVisible = true
    },

    // 选择场次
    selectCompetitionName(item, index) {
      this.competitionList.map(e => {
        e.isSelect = false
      })
      item.isSelect = true
      this.selectGameData = {
        matchId: item.matchId,
        team: item.hostTeamName + 'vs' + item.guestTeamName
      }
      this.$set(this.competitionList, item, index)
    },

    confirm() {
      if (!this.selectGameData.matchId) {
        this.$error('请选择赛事')
        return false
      }
      debugger
      this.dialogVisibleName = false
      this.$emit('selectData', {
        ...this.selectCompetitionData,
        ...this.selectGameData,
        ...this.sport,
        name:
          this.sport.sportName +
          ' / ' +
          this.selectCompetitionData.leagueName +
          '-' +
          this.selectGameData.team
      })
    }
  }
}
</script>


<style lang="scss" scoped>
$blue: #3683ff;
$white: #fff;

/deep/ {
  .ivu-modal-body {
    padding-top: 0;
  }
  .ivu-modal-header {
    padding: 10px 25px;
  }
  .ivu-modal-header-inner {
    font-size: 16px;
    height: 25px;
    line-height: 30px;
    color: #333;
  }
}

.common-hover {
  background-color: $blue;
  color: $white;
  border-color: $blue;
}

.desc {
  display: inline-block;
  font-size: 14px;
  min-width: 80px;
  height: 30px;
  line-height: 30px;
  margin: 0 0 10px 0px;
  text-align: center;
  cursor: pointer;
  &:hover {
    border-color: $blue;
  }
}

.content {
  min-height: 200px;
  .bb {
    margin-top: 5px;
    border-bottom: 1px solid #eee;
    .desc {
      margin-bottom: 5px;
      min-width: 90px;
    }
    .is-active {
      border-color: $blue;
      &:hover {
        border-color: $blue;
      }
    }
  }
  .competition {
    .desc {
      border: 1px solid #ccc;
      border-radius: 4px;
      margin: 5px;
      padding: 0 10px;
      &:hover {
        @extend .common-hover;
      }
    }
    .is-active {
      @extend .common-hover;
      border: 1px solid $blue;
      &:hover {
        @extend .common-hover;
      }
    }
  }
}

.session-set {
  .title {
    font-size: 14px;
    color: #666;
    padding: 10px 0;
    margin: 0 10px;
    text-align: center;
    border-bottom: 1px solid #eaeaea;
  }
  .goback {
    position: relative;
    span {
      position: absolute;
      top: 10px;
      left: 10px;
      color: #409eff;
      cursor: pointer;
    }
  }
  .competition-matches {
    height: 500px;
    overflow: auto;
    &__desc {
      display: inline-block;
      border: 1px solid #eaeaea;
      padding: 5px 10px;
      cursor: pointer;
      margin: 5px 0 5px 10px;
      border-radius: 4px;
      &:hover {
        border: 1px solid $blue;
        background: $white;
        color: $blue;
      }
    }
    .is-active {
      @extend .common-hover;
      border: 1px solid $blue;
      &:hover {
        @extend .common-hover;
      }
    }
    
  }

  .time {
    width: 88px;
  }
  .host-team {
    width: 140px;
    text-align: right;
    vertical-align: bottom;
  }
  .guest-team {
    width: 140px;
    text-align: left;
    vertical-align: bottom;
  }
  .vs {
    font-weight: 700;
  }
  span {
    display: inline-block;
    font-size: 14px;
  }
}
</style>