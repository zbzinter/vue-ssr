<template>
  <div class="guessball-manage">
    <anchor-info
      ref="anchorInfo"
      :is-show="true"
    />
    <div
      v-if="isFlag"
      class="inner"
    >
      <div class="tab clearfix">
        <div class="fl">
          <span
            class="tab-pane"
            :class="{active: isActive}"
            @click="tabClick(1)"
          >正在进行的猜球</span>
          <span
            :class="{active: !isActive}"
            class="tab-pane ml"
            @click="tabClick(2)"
          >我发起的猜球历史</span>
        </div>
        <div class="fr">
          <Button
            class="btn-guess"
            size="small"
            type="warning"
            @click="checkGuessBall(1)"
          >
            发起猜球
          </Button>
        </div>
      </div>
     
      <div class="content">
        <div
          v-if="guessBall && guessBall.length"
          class="guess-table"
        >
          <div class="guess-table__header">
            <span class="theme">主题</span>
            <span class="option-a">选项1</span>
            <span class="option-b">选项2</span>
            <span class="time bb">时间</span>
            <span class="operate bb">{{ index === 1 ? '操作': '结果' }}</span>
          </div>
          <div class="guess-table__content">
            <div
              v-for="(item, key) in guessBall"
              :key="key"
              class="line clearfix"
            >
              <div class="theme iblock fl bt">
                <Tooltip
                  placement="top"
                  :content="item.theme"
                >
                  <span
                    style="width:80px;"
                    class="iblock ellipsis"
                  >{{ item.theme }}</span>
                </Tooltip>
              </div>
              <div class="option-a tl iblock fl bt">
                <div class="option-content">
                  <span
                    v-if="index === 1"
                    class="option-name"
                  >
                    <Checkbox
                      v-model="item.optionAChecked"
                      @on-change="checkOption(1, item)"
                    >
                      <Tooltip
                        placement="top"
                        :content="item.option_a"
                      >
                        <span class="option-a-name iblock ellipsis">{{ item.option_a }}</span>
                      </Tooltip>
                    </Checkbox>
                  </span>
                  <span
                    v-if="index === 2"
                    class="br-line"
                  >
                    <Tooltip
                      placement="top"
                      :content="item.option_a"
                    >
                      <span
                        class="option-a-name iblock ellipsis"
                        style="width:60px;padding: 0 5px"
                      >{{ item.option_a }}</span>
                    </Tooltip>
                  </span>
                  <span class="br-line number"> {{ item.option_a_number_person }}人参与</span>
                  <span class="bean"> {{ item.option_a_number_beans }}豆</span>
                </div>
              </div>
              <div class="option-b iblock fl bt">
                <div class="option-content">
                  <span
                    v-if="index===1"
                    class="option-name tl"
                  >
                    <Checkbox
                      v-model="item.optionBChecked"
                      @on-change="checkOption(2, item)"
                    >
                      <Tooltip
                        placement="top"
                        :content="item.option_b"
                      >
                        <span class="option-b-name iblock ellipsis">{{ item.option_b }}</span>
                      </Tooltip>
                    </Checkbox>
                  </span>
                  <span
                    v-if="index===2"
                    class="br-line"
                  >
                    <Tooltip
                      placement="top"
                      :content="item.option_b"
                    >
                      <span
                        class="option-b-name iblock ellipsis"
                        style="width:60px;padding: 0 5px"
                      >{{ item.option_b }}</span>
                    </Tooltip>
                  </span>
                  <span class="br-line number"> {{ item.option_b_number_person }}人参与</span>
                  <span class="bean"> {{ item.option_b_number_beans }}豆</span>
                </div>
              </div>
              <div class="time iblock fl bt">
                <div class="clearfix">
                  <span class="fl">{{ dayjs(item.start_time).format('YYYY-MM-DD HH:mm') }}</span>
                  <span class="fl">{{ dayjs(item.end_time).format('YYYY-MM-DD HH:mm') }}</span>
                </div>
              </div>
              <div
                v-if="index === 1"
                class="operate iblock fl bt"
              >
                <Button
                  class="btn"
                  size="small"
                  :disabled="[2,3,4].includes(item.status)"
                  @click="deciding(item)"
                >
                  封盘
                </Button>
                <Button
                  size="small"
                  class="btn"
                  :disabled="1 === item.status"
                  @click="draw(item)"
                >
                  流局
                </Button>
                <Button
                  size="small"
                  class="btn"
                  :disabled="1 === item.status"
                  @click="balance(item)"
                >
                  结算
                </Button>
              </div>
              <div
                v-if="index === 2"
                class="operate iblock fl bt"
              >
                <span
                  style="border: none;width:134px;"
                >{{ item.victory_sidel || '流局' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="guessBall && !guessBall.length"
          class="nodata"
        >
          暂无数据
        </div>
        <Page
          v-if="pages.total > 10"
          class="page"
          :total="pages.total"
          show-total
          show-elevator
          @on-change="changePage"
        />
      </div>
      <div class="tip">
        <p>主播请注意： </p>
        <span>忘记结算而导致流局次数太多、结算错判，主播会受到不同程度的处罚。请谨慎处理哦~</span>
      </div>
      <div>
        <RuleDetails />
      </div>
    </div>

    <div
      v-if="!isFlag"
    >
      <StartGuessBall />
    </div>

    <Modal
      v-model="checkSettlementFlag"
      :footer-hide="true"
      :closable="false"
      class="modal-tip"
    >
      <p class="modal-tip__msg">
        {{ checkSettlementInfo }}
      </p>
      <p class="modal-tip__btn">
        <span @click="continueSettle">继续结算</span>
        <span @click="again">重新计算</span>
      </p>
    </Modal>

    <Modal
      v-model="tipFlag"
      :footer-hide="true"
      :closable="false"
      class="error-tip"
    >
      <p @click="tipFlag=false">
        <i class="iconfont iconfb_dc" />
      </p>
      
      <p>
        {{ tip }}
      </p>
    </Modal>
    <div
      v-if="successTip"
      class="success-tip"
    >
      <p>{{ successTip }}</p> 
    </div>
  </div>
</template>
<script>

import {
  Page,
  Button,
  Checkbox,
  Tooltip,
  Modal
} from 'iview'
import AnchorInfo from '@src/components/personal/anchor-info'
import StartGuessBall from './components/start-guess-ball'
import RuleDetails from '../components/rule-details'
import mixins from './../mixins'

// settlement	结算状态1-未结算2-已结算，默认1
export default {
  components: {
    AnchorInfo,
    Tooltip,
    Page,
    Button,
    Checkbox,
    StartGuessBall,
    Modal,
    RuleDetails
  },
  mixins: [mixins],
  data() {
    return {
      index: 1,
      isActive: true,
      isFlag: true,
      pages: {
        total: 0,
        page: 1,
        size: 10
      },
      guessBall: [],
      checkSettlementFlag: false,
      checkSettlementInfo: '',
      checkSettlementObj: {},
      tipFlag: false,
      tip: '',
      successTip: ''
    }
  },
  watch: {
    successTip: {
      handler: function (val) {
        if (val) {
          setTimeout(() => {
            this.successTip = ''
          }, 3000)
        }
      },
      deep: true
    }
  },
  mounted() {
    this.getGuessCompetitions()
  },
  methods: {
    checkGuessBall() {
      this.$get('v0.2/anchorUsers/guessingCompetitions/check', {
        apiType: 'anchor',
        body: {
          uid: this.getUserInfo().uid,
        }
      })
        .then(res => {
          const {code, msg} = res

          // 200 不能发起猜球
          if (code === 200) {
            this.isFlag = false
          } else {
            this.tipFlag = true
            this.tip = msg
          }
        })
    },

    getGuessCompetitions() {

      this.$get('v0.2/anchorUsers/guessingCompetitions', {
        apiType: 'anchor',
        body: {
          uid: this.getUserInfo().uid,
          settlement: this.index,
          ...this.pages
        }
      })
        .then((res) => {
          try {
            const {data: {rows, total} } = res
            if (rows) {
              this.guessBall = rows
              this.pages.total = total
            } else {
              this.guessBall = []
              this.pages.total = 0
            }
          } catch (e) {
            this.guessBall = []  
            this.pages.total = 0
          }
        })
    },

    tabClick(index) {
      this.index = index
      this.isActive = !this.isActive
      this.guessBall = []  
      this.pages.total = 0
      this.getGuessCompetitions()
    },

    changePage(val) {
      this.pages.page = val
      this.getGuessCompetitions()
    },

    returnManage() {
      this.isFlag = true
      this.getGuessCompetitions()
    },

    // 状态1-进行中2-封盘3-流局结算 4正常胜负结算
    // 封盘
    deciding({guess_id}) {
      
      this.$put('v0.2/anchorUsers/guessingCompetitions/sealed', {
        apiType: 'anchor',
        body: {
          guess_id,
          uid: this.getUserInfo().uid
        }
      }).then(res => {
        const {code, msg} = res
        if (this.$judgeCode(code)) {
          this.$success('封盘成功')
          this.getGuessCompetitions()
        } else {
          this.tipFlag = true
          this.tip = msg
        }
      }).catch()
    },
    
    // 流局
    draw(row) {
      this.checkSettlement('', row.guess_id, row._index)
    },

    // 结算
    balance(row) {
      
      if (!row.optionAChecked && !row.optionBChecked) {
        this.successTip = '请选择要结算的选项！'
        return false
      }

      if (row.optionAChecked && row.optionBChecked) {
        return this.$error('请选择一个要结算的选项！')
      }

      let victory_sidel = ''
      if (row.optionAChecked) {
        victory_sidel = 'a'
      }
      if (row.optionBChecked) {
        victory_sidel = 'b'
      }
      this.checkSettlement(victory_sidel, row.guess_id, row._index)
    },

    continueSettle() {
      const { victory_sidel, guess_id, index } = this.checkSettlementObj
      this.settlement(victory_sidel, guess_id, index)
    },

    again() {
      this.checkSettlementFlag = false
      this.checkSettlementInfo = ''
    },

    checkSettlement(victory_sidel, guess_id, index) {
      
      this.$put('v0.2/anchorUsers/guessingCompetitions/settlement/check', {
        apiType: 'anchor',
        body: {
          victory_sidel,
          guess_id,
          uid: this.getUserInfo().uid
        }
      }).then(res => {
        const {code, msg} = res
        if (this.$judgeCode(code)) {
          this.settlement(victory_sidel, guess_id, index)
        } else {
          this.checkSettlementInfo = msg
          this.checkSettlementFlag = true
          this.checkSettlementObj = {
            victory_sidel,
            guess_id,
            index
          }
        }
      }).catch()
    },

    settlement(victory_sidel, guess_id, index) {
      this.$put('v0.2/anchorUsers/guessingCompetitions/settlement', {
        apiType: 'anchor',
        body: {
          victory_sidel,
          guess_id,
          uid: this.getUserInfo().uid
        }
      }).then(res => {
        const {code, msg} = res
        this.checkSettlementFlag = false
        if (this.$judgeCode(code)) {
          // 流局怎么提示
          this.$success('结算成功')
          this.guessBall.splice(index, 1)
          this.getGuessCompetitions()
        } else {
          this.tipFlag = true
          this.tip = msg
        }
      }).catch()
    },

    checkOption(param, item) {
      if (param === 1) {
        item.optionBChecked = !item.optionAChecked
        return
      }

      if (param === 2) {
        item.optionAChecked = !item.optionBChecked
        return
      }
    },
  }
}
</script>
<style lang="scss" scoped>

.inner {
  background: #fff;
}
.tab {
  height: 40px;
  .fl {
    line-height: 35px;
  }
  margin-left: 40px;
  .ml {
    margin-left: 36px;
  }
  .tab-pane {
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    height: 32px;
    line-height: 10px;
    padding-bottom: 13px;
    letter-spacing: 0;
    color: #333;
    cursor: pointer;
    display: inline-block;
    &:hover {
      color: #3683FF;
      border-bottom: 4px solid #3683FF;
    }
  }
  .active {
    color: #3683FF;
    border-bottom: 4px solid #3683FF;
  }
  .btn-guess {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #FFA029;
    width: 80px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid#FFA029;
    margin-right: 40px;
    background-color: #fff;
    &:hover {
      color: #fff;
      background: #FFA029;
    }
    &:disabled {
      color: #fff;
      background: #ccc;
      border: 1px solid#ccc;
    }
  } 
}
.content {
  border-top: 1px solid #F0F0F0;
  padding: 40px 40px;
  .guess-table {
    font-size: 0px;
    &__header {
      background: #FAFAFA;
      border: 1px solid #ccc;
      border-bottom: none;
      height: 42px;
      line-height: 42px;
      width: 100%;
      font-size: 0;
      span {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        font-weight: 500;
        letter-spacing: 0;
        text-align: center;
        display: inline-block;
      }
      .option-b {
        margin-left: 4px;
      }
      .operate {
        width: 153px;
      }
    }
    &__content {
      span {
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666;
        display: inline-block;
      }

      .line {
        height: 42px;
        box-sizing: border-box;
        text-align: center;
      }
      .line:first-child {
        .option-a {
          border-top: 1px solid #F82301;
        }
        .option-b {
          border-top: 1px solid #3683FF;
        }
      }
      .line:last-child {
        border-bottom: none;
      }
      .time {
        border-right: 1px solid #ccc;
        span {
          line-height: 10px;
          padding: 10px 0 0 10px;
          height: 15px;
        }
      }
      .theme, .option-a, .option-b, .operate, .time {
        height: 43px;
        line-height: 42px;
      }

      .option-a {
        border-right: 1px solid #F82301;
        border-left: 1px solid #F82301;
        span {
          color: #E15756;
        }
      }
      .option-b {
        border-left: 1px solid #3683FF;
        border-right: 1px solid #3683FF;
        margin-left: 4px;
        text-align: left;
        span {
          color: #3683FF;
        }
        .option-name {
          width: 60px;
        }
      }
      .theme {
        border-left: 1px solid #ccc;
      }
      .operate { 
        border-right: 1px solid #ccc;
        width: 155px;
      }
    }
    .option-content {
      height: 42px;
      line-height: 42px;
      display: inline-block;
    }
    .line:last-child {
      .option-a {
        border-bottom: 1px solid #F82301;
      }
      .option-b {
        border-bottom: 1px solid #3683FF;
      }
      .theme,.time,.operate {
        border-bottom: 1px solid #ccc;
      }
    }
    .theme {
      width: 180px;
    }
    .option-a, .option-b {
      width: 220px;
    }
    .time {
      width: 130px;
    }
    .option-name {
      color: #E15756;
      width: 60px;
      margin-left: 8px;
      border-right: 1px solid #ccc;
    }
    .option-a-name, .option-b-name {
      width: 30px;
    }
    .option-a:last-child {
      border-bottom: 1px solid #F82301;
    }
    .br-line {
      border-right: 1px solid #ccc;
    }
    .number {
      width: 80px;
      text-align: center;
    }
    .bean {
      min-width: 50px;
      text-align: center;
    }
  }
}

.tip {
  padding-left: 40px;
  padding-bottom: 20px;
  p {
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 600;
  }
  span {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0;
    line-height: 22px;
  }
}

.operate {
  span {
    cursor: pointer;
    width: 50px;
    display: inline-block;
    border: 1px solid #eaeaea;
  }
}

.tl {
  text-align: left !important;
}

/deep/ .ivu-tooltip {
  line-height: 12px;
  height: 12px;
  vertical-align: middle;
}
.btn {
  border: 1px solid #3683FF;
  color: #3683FF;
  margin-right: 5px;
}

.btn:active {
   color: #fff;
   background: #3683FF;
}
.btn:visited {
   color: #fff;
   background: #3683FF;
}
button {
  font-size: 12px;
  &:disabled {
    border: 1px solid #F0F0F0;
    background: #F0F0F0;
    border-radius: 4px;
    color: #666666;
  }
}

.bt {
  border-top: 1px solid #ccc;
}

.w-h {
  width: 12px;
  height: 12px;
}
.checked_red {
  background: url(../../../../assets/checked_red.png) center center no-repeat;
  background-size: 100% auto;
  background-repeat: no-repeat;
}
.checked_blue {
  background: url(../../../../assets/checked_blue.png) center center no-repeat;
  background-size: 100% auto;
  background-repeat: no-repeat;
}
.ic_checked_cf {
  display:inline-block;
  @extend .w-h;
 
}

  .iconbs_cf{
    font-family: 'iconfont';
    font-size: 12px;
  }
  /deep/ .ivu-checkbox {
    &.ivu-checkbox-checked{
       @extend .w-h;
      .ivu-checkbox-inner{
        @extend .ic_checked_cf;
        background-color: transparent;
        &:after{
          display: none;
        }
        &:before{
          display: none;
        }
      }
    }
    .ivu-checkbox-focus{
      box-shadow: none
    }
    .ivu-checkbox-inner{
      transition: none;
      background-color: transparent;
      border: 0;
      @extend .w-h;
      @extend .iconbs_cf;
      &:before{
        content: "\e632"
      }
    }
  }
  .option-a {
    /deep/ .ivu-checkbox {
              &.ivu-checkbox-checked { 
                .ivu-checkbox-inner {
                  @extend .checked_red;
                }
              }
    } 
  }
  .option-b {
    /deep/ .ivu-checkbox {
              &.ivu-checkbox-checked { 
                .ivu-checkbox-inner {
                  @extend .checked_blue;
                }
              }
    } 
  }
 
 .page {
   margin-top: 40px;
 }
.nodata {
  text-align: center;
  border: 1px solid #eee;
  line-height: 70px;
  border-radius: 5px;
}
.modal-tip {
  /deep/ .ivu-modal-content {
    width: 420px;
    text-align: center;
  }
   &__msg {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #666666;
    letter-spacing: 0;
    text-align: left;
    padding: 45px 30px 0 30px;
  }
  &__btn {
    margin-top: 50px;
    margin-bottom: 35px;
    span {
      display: inline-block;
      width: 110px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-family: PingFangSC-Medium;
      font-size: 14px;
      border-radius: 4px;
      letter-spacing: 0;
      cursor: pointer;
    }
    span:first-child {
      border: 1px solid #979797;
      background: #fff;
      color: #666666;
      margin-right: 76px;
    }
    span:last-child {
      border: 1px solid #3683FF;
      background: #3683FF;
      color: #FFFFFF;
    }
  }

}

.guessball-manage {
  position: relative;
}

.error-tip {
  /deep/ .ivu-modal-content {
    width: 300px;
    height: 120px;
    top: 250px;
    left: 145px;
  }   
  .iconfb_dc {
    color: #999;
    font-size: 12px;
  }
  p {
    &:first-child {
      text-align: right;
      cursor: pointer;
    }
    &:last-child {
      padding: 10px 20px;
      text-align: center;
      font-family: PingFangSC-Medium;
    }
    font-size: 16px;
    color: #666666;
    letter-spacing: 0;
  }
}

.success-tip {
  position: absolute;
  top: 125px;
  left: 200px;
  width: 400px;
  height: 140px;
  opacity: 0.8;
  background: #000000;
  box-shadow: 0 6px 24px 0 rgba(0,0,0,0.04);
  p {
    font-family: PingFangSC-Medium;
    font-size: 20px;
    padding: 28px 40px;
    color: #FFFFFF;
    letter-spacing: 0;
    text-align: center;
  }
}

</style>


