<template>
  <div class="select-competition">
    <span class="select-competition__name">
      <Checkbox-group v-model="selectId">
        <Checkbox 
          v-for="item in competitionName"
          :key="item.leagueId"
          :label="item.leagueId"
        >
          <Tooltip :content="item.leagueName">{{ item.leagueName }}</Tooltip>
        </Checkbox>
      </Checkbox-group>
    </span>
    <div class="select-competition__footer clearfix">
      <div class="fl batch-select">
        <span
          class="btn btn-all"
          @click="selectAll"
        >全选</span>
        <span
          class="btn btn-reverse"
          @click="unselectAll"
        >反选</span>
      </div>
      <div class="fr">
        <span
          class="btn-cancel"
          @click="handlerCancel"
        >取消</span>
        <span
          class="btn-confirm"
          @click="confirm"
        >确定</span>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import {
  CheckboxGroup,
  Checkbox,
  RadioGroup,
  Radio,
  Tooltip
} from 'iview'


export default {
  components: {
    CheckboxGroup,
    Checkbox,
    RadioGroup,
    Radio,
    Tooltip
  },
  props: {
    competitionName: {
      default:() => [],
      type: Array
    },
    isShow: {
      default: false,
      type: Boolean
    },
    cancel: Function,
    selectLeague: String,
    tempHideList: {
      default:() => [],
      type: Array
    },
    hideList: {
      default:() => [],
      type: Array
    },
    allMatch: {
      default:() => [],
      type: Array
    }
  },
  data() {
    return {
      tempAllLeagueId: [],
      selectId: [],
      showFlag: true,
      initSelectId: []
    }
  },
  watch: {
    isShow: {
      handler(val) {
        this.showFlag = val
      },
      deep:true
    },
    selectLeague: {
      handler: 'autoSelect',
      immediate: true
    },
    competitionName(val){
      this.autoSelect()
    }
  },
  created () {
    this.getAllLeagueId(this.competitionName)
  },
  methods: {
    bindHideList(operateType) { // 点击隐藏与完整 重置选择的赛事ID列表
      this.$nextTick(()=>{
        let hideList = []
        switch(operateType) {
        case 1 : hideList = this.hideList; break // 保留
        default : hideList = this.tempHideList
        }
        let remainMatchId = this.allMatch.map(item=>item.matchId).filter(item => !hideList.includes(item))// 所有当前页显示的比赛
        let dropLeagueId = []
        for (const item of this.competitionName) {
          if(item.matches.every((match) => !remainMatchId.includes(match))){ // item.matches都不在保留的数组中时不选中
            dropLeagueId.push(item.leagueId)
          }
        }
        this.initSelectId = _.cloneDeep(this.tempAllLeagueId.filter(item => !dropLeagueId.includes(item)))
        this.selectId = _.cloneDeep(this.initSelectId)
        this.$emit('selectCompetition', this.getSelectMatchIds())
      })
    },
    getAllLeagueId(arr){
      this.tempAllLeagueId = arr.map((item) => {
        return item.leagueId
      })
    },
    selectAll() {
      this.selectId = []
      this.competitionName.forEach((item) => {
        this.selectId.push(item.leagueId)
      })
    },

    autoSelect () {
      const name = '全部'
      if (this.selectLeague === name) {
        this.selectAll()
        this.$emit('selectCompetition', this.getSelectMatchIds())
      } else {
        this.selectId = []
        this.competitionName.forEach(item => {
          if (this.selectLeague.indexOf(item.leagueName) !== -1) {
            this.selectId.push(item.leagueId)
          }
        })
      }
      this.initSelectId = this.selectId
    },

    unselectAll() {
      let rever = []
      this.competitionName.forEach((item) => {
        if (this.selectId.indexOf(item.leagueId) === -1) {
          rever.push(item.leagueId)
        }
      })
      this.selectId = rever
    },

    confirm() {
      if (!this.selectId.length) {
        if (!window.document.querySelector('.ivu-message-notice-content')) {
          return this.$warning('请选择赛事名称')
        }
        return
      }
      this.initSelectId = _.cloneDeep(this.selectId)
      this.$emit('selectCompetition', this.getSelectMatchIds())
      this.$emit('changeHideList', this.getSelectMatchIds())
    },

    handlerCancel() {
      this.selectId = this.initSelectId
      this.$emit('cancel')
    },
    getSelectMatchIds(){
      return this.competitionName.reduce((total, item)=>{
        if (this.selectId.includes(item.leagueId)) {
          total = total.concat(item.matches)
        }
        return total
      }, [])
    }
  }

}
</script>


<style scoped lang="postcss">
.select-competition {
  display: inline-block;
  width: 392px;
  height: 270px;
  background: #fff;
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.09);
  border-radius: 8px;
  &__name {
    display: inline-block;
    height: 224px;
    padding-top: 20px;
    overflow: auto;
  }
  
  &__name::-webkit-scrollbar{
    width:6px;
    height:10px;
  }

  &__name::-webkit-scrollbar-thumb{
    background: #D8D8D8;
    border-radius: 4px;
    height:10px;
  }

  &__footer {
    height: 44px;
    line-height: 44px;
    background: #fff;
    border-radius: 0 0 8px 8px;
    border-top: 1px solid #E5E5E5;
    cursor: pointer;
    .fl {
      padding-left: 20px;
      font-size: 14px;
      color: #666666;
      &.batch-select{
        .btn{
          display: inline-block;
          font-size: 14px;
          width: 64px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          background: #F5F5F5;
          &:active{
            color: #3683FF;
            border: 1px solid #3683FF;
          }
        }
      }
    }
  
    .fr {
      padding-right: 12px;
      span {
        display: inline-block;
        font-size: 14px;
        width: 64px;
        height: 26px;
        line-height: 26px;
        text-align: center;
      }
    }

    .btn-cancel {
      background: #F5F5F5;
    }

    .btn-confirm {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #FFFFFF;
      background: #3683FF;
      letter-spacing: 0;
      margin-left: 10px;
    }
  }
  .ivu-checkbox-group {
    padding-left: 20px;
  }
  .ivu-checkbox-wrapper {
    width: 100px;
    margin-right: 19px;
    white-space: nowrap;
    display: inline-block;
  }
}
</style>


