<template>
  <div class="select-ball-gold">
    <!-- 下注内容 -->
    <div
      v-if="!resultStatus"
      class="re-bet"
    >
      <div class="header">
        <span>我的球豆：</span>
        <img
          class="qiudou"
          src="../../../../assets/live/img_qiudou.png"
          alt=""
        >
        <b>{{ commMemberInfo.ball_gold || 0 }}</b>
      </div>
      <div class="content">
        <ul class="default-list clearfix">
          <li
            v-for="(item, index) in defaultList"
            :key="index"
            :class="{cur: curBallGold === index}"
            @click="handleDefaultList(item, index)"
          >
            {{ item }}球豆
          </li>
        </ul>
        <div class="all-in clearfix">
          <InputNumber
            v-model="otherBeans"
            :step="100"
            :max="1000000000"
            :precision="0"
            placeholder="请输入球豆"
            @on-focus="beansFocus"
            @on-change="beansChange"
          />
          <div
            class="btn"
            @click="allIn()"
          >
            All in
          </div>
        </div>
        <div class="total">
          <p class="fl">
            参与球豆：{{ total }}
          </p>
          <div
            class="btn"
            @click="submit"
          >
            确定参与
          </div>
        </div>
      </div>
    </div>
    <!-- 下注成功 -->
    <div
      v-if="resultStatus === 1"
      class="re-bet-tip success"
    >
      <i class="iconfont iconimg_xiao" />
      <h2>参与成功，祝您好运</h2>
      <p>两秒后自动关闭</p>
      <div
        class="btn"
        @click="close"
      >
        知道了
      </div>
    </div>
    <!-- 下注失败 -->
    <div
      v-if="resultStatus === 2"
      class="re-bet-tip error"
    >
      <i class="iconfont iconimg_xiao" />
      <h2>参与失败</h2>
      <p>两秒后自动关闭</p>
      <div
        class="btn"
        @click="close"
      >
        知道了
      </div>
    </div>
  </div>
</template>
<script>
import { InputNumber } from 'iview'
let timer
export default {
  components: {
    InputNumber
  },
  props: {
    team: {
      type: String,
      default: ''
    },
    guessId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      //参与返回的结果 1成功，2失败
      resultStatus: null,
      // 默认球豆列表
      defaultList: [100, 200, 1000, 2000],
      // 当前选中的球豆项
      curBallGold: null,
      // 下注的总球豆
      total: 0,
      // 计时
      count: 0,
      // 输入框的值
      otherBeans: null,
    }
  },
  methods: {
    // 默认球豆选择
    handleDefaultList(val, index) {
      this.curBallGold = index
      this.total = val
      this.otherBeans = val
    },
    beansFocus() {
      this.total = this.otherBeans || 0
      this.curBallGold = null
    },
    beansChange(val) {
      this.otherBeans = val
      this.total = val
    },
    // 全下
    allIn() {
      this.beansFocus()
      const _beans = this.commMemberInfo.ball_gold || 0
      if(!_beans) {
        this.$tip('球豆不足')
        return
      }
      this.otherBeans = _beans
      this.total = _beans
    },
    // 关闭
    close() {
      this.$emit('closeBox')
    },
    // 提交
    submit() {
      // 判断是否为空
      if(!this.total) {
        this.$tip('请输入球豆')
        return
      }
      // 判断是否输入的是100的倍数(全下除外)
      if(this.total !== this.commMemberInfo.ball_gold && this.total%100) {
        this.$tip('请输入100的倍数')
        return
      }
      // 判断球豆够不够
      if(this.total > this.commMemberInfo.ball_gold) {
        this.$tip('球豆不足')
        return
      }
      const _params = {
        option: this.team,
        beans: this.total,
        uid: localStorage.getItem('uid') || '',
        guess_id: this.guessId
      }
      this.$post('/v0.2/users/guessingCompetitions', {
        apiType: 'anchor',
        body: _params
      }).then(res => {
        // 显示状态
        this.updateResult(res.code === 200 ? 1 : 2)
        // 更新用户球豆
        this.updateUserAndMember({
          uid: localStorage.getItem('uid'),
          token: localStorage.getItem('token')
        })
        // 更新猜球状态
        this.$emit('updateGuess')
      }).catch(() => {
        this.updateResult(2)
      })
    },
    // 处理结果
    updateResult(status) {
      this.resultStatus = status
      timer = setInterval(() => {
        this.count++
        if(this.count >= 2) {
          clearInterval(timer)
          this.close()
        }
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
.select-ball-gold {
  width: 370px;
  border-radius: 4px;
  position: absolute;
  left: -42px;
  top: 100%;
  z-index: 10;
  color: #C58418;
  background-image: linear-gradient(
    to right,
    #FFEB93 0%,
    #F9D351 100%
  );
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: -12px;
    width: 0;
    height: 0;
    margin-left: -6px;
    border: 6px solid transparent;
    border-bottom-color: #fcdf72;
  }
  .re-bet {
    .header {
      height: 42px;
      line-height: 42px;
      padding: 0 12px;
      text-align: left;
      border-bottom: 1px solid #F8D572;
      span {
        font-size: 12px;
      }
      b {
        font-size: 13px;
      }
    }
    .content {
      padding: 12px;
      .default-list {
        padding-bottom: 12px;
        li {
          width: 80px;
          height: 30px;
          float: left;
          line-height: 30px;
          border-radius: 2px;
          font-size: 13px;
          margin-right: 8px;
          cursor: pointer;
          background: #FFE793;
          border: 1px solid #E7C48A;
          &:nth-child(4n) {
            margin-right: 0;
          }
          &.cur,
          &:hover {
            color: #fff;
            border-color: #B84300;
            background: #B84300;
          }
        }
      }
      .all-in {
        padding-bottom: 12px;
        .ivu-input-number {
          float: left;
          width: 260px;
          height: 44px;
          font-size: 15px;
          color: #C58418;
          outline: none;
          box-shadow: none;
          border-radius: 2px;
          background: #FFFFFF;
          border: 1px solid #C98207;
          /deep/ .ivu-input-number-input-wrap {
            height: 100%;
          }
          /deep/ .ivu-input-number-handler-wrap {
            display: none;
          }
          /deep/ .ivu-input-number-input {
            height: 44px;
            line-height: 44px;
          }
        }
        .btn {
          width: 80px;
          float: right;
          font-size: 21px;
          height: 44px;
          cursor: pointer;
          line-height: 44px;
          background: #FFE793;
          border: 1px solid #E7C48A;
          border-radius: 2px;
          &:hover {
            color: #fff;
            border-color: #B84300;
            background: #B84300;
          }
        }
      }
      .total {
        height: 40px;
        line-height: 40px;
        p {
          font-size: 17px;
        }
        .btn {
          width: 170px;
          float: right;
          font-size: 16px;
          color: #FFFFFF;
          cursor: pointer;
          border-radius: 20px;
          background: #C58418;
          &:hover {
            background: #B84300;
          }
        }
      }
    }
  }
  .re-bet-tip {
    padding: 40px 0 16px 0;
    .iconfont {
      font-size: 44px;
    }
    h2 {
      font-weight: normal;
      font-size: 17px;
      color: #C58418;
      padding: 13px 0 9px 0;
    }
    p {
      font-size: 14px;
      color: #C58418;
      padding-bottom: 17px;
    }
    .btn {
      width: 150px;
      height: 36px;
      line-height: 36px;
      margin: 0 auto;
      font-size: 16px;
      color: #FFFFFF;
      cursor: pointer;
      border-radius: 20px;
      background: #C58418;
      &:hover {
        background: #B84300;
      }
    }
  }
}
</style>