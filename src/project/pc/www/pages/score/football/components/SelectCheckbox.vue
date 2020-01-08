<template>
  <div
    v-if="showFlag"
    class="select-competition"
  >
    <span class="select-competition__name">
      <CheckboxGroup v-model="selectId">
        <Checkbox
          v-for="(item, key) in competitionName" 
          :key="key"
          :label="item.key"
        >{{ item.name }}</Checkbox>
      </CheckboxGroup>
    </span>
    <div class="select-competition__footer clearfix">
      <div class="fl">
        <span
          class="all-select"
          @click="selectAll"
        >全选</span>
        <span
          class="all-unselect"
          @click="unselectAll"
        >反选</span>
      </div>
      <div class="fr">
        <span
          class="btn-confirm"
          @click="confirm"
        >确定</span>
        <span
          class="btn-cancel"
          @click="cancel"
        >取消</span>
      </div>
    </div>
  </div>
</template>

<script>

import {
  CheckboxGroup,
  Checkbox
} from 'iview'


export default {
  components: {
    CheckboxGroup,
    Checkbox,
  },
  props: {
    competitionName: {
      default:() => [],
      type: Array
    },
    isShow: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      selectId: [],
      showFlag: true,
    }
  },
  watch: {
    isShow: {
      handler(val) {
        this.showFlag = val
      },
      deep:true
    }
  },
  methods: {
    selectAll() {
      this.selectId = []
      this.competitionName.forEach((item) => {
        this.selectId.push(item.key)
      })
    },

    unselectAll() {
      this.selectId = []
    },

    confirm() {
      if (!this.selectId.length) {
        return this.$warning('请选择赛事名称')
      }
      this.showFlag = false
      this.$emit('selectCompetition', this.selectId)
    },

    cancel() {
      this.showFlag = false
      this.selectId = []
    },
  }

}
</script>


<style scoped lang="postcss">
.select-competition {
  display: inline-block;
  width: 392px;
  height: 359px;
  background: #fff;
  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.09);
  border-radius: 8px;
  &__name {
    display: inline-block;
    height: 314px;
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
      font-size: 16px;
      color: #666666;
    }
    .all-select {
      padding: 0 28px;
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
        border-radius: 13px;
      }
    }

    .btn-cancel {
      background: #F5F5F5;
    }

    .btn-confirm {
      font-size: 14px;
      color: #FFFFFF;
      background: #3683FF;
      letter-spacing: 0;
      margin-right: 14px;
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


