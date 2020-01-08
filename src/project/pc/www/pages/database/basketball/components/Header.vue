<template>
  <div class="header">
    <div class="position">
      <span class="weight ml">当前位置：</span>
      <span
        class="weight mr-6"
        style="cursor: pointer;"
        @click="goHome"
      >首页</span>
      <i class="iconfont iconbq_ee mr-6" />
      <span
        class="current-title mr-6"
        :class=" teamName ? 'bold-grey':'' "
      >{{ title }}</span>
      <div
        v-if="teamName"
        class="iblock"
      >
        <i class="iconfont iconbq_ee mr-6" />
        <span class="current-title">{{ teamName }}</span>
      </div>
    </div>
    <div class="selector ml">
      <img
        class="logo"
        :src="imgLogo"
        alt=""
      >
      <Select
        v-model="name"
        style="width:92px;margin-right: 24px;"
        @on-change="selectVal"
      >
        <Option value="CBA">
          CBA
        </Option>
        <Option value="NBA">
          NBA
        </Option>
      </Select>
      <span
        v-for="(item, key) in data"
        :key="key"
        class="selector-name"
        :class=" activeIndex === item.key ? 'active' : '' "
        @click="handleClick(item.key)"
      >{{ item.name }}</span>
    </div>
  </div>
</template>

<script>

import {
  Select,
  Option
} from 'iview'

// import { mapGetters } from 'vuex'
import { _debounce } from '@/comm/utils/common'

export default {
  components: {
    Select,
    Option
  },
  props: {
    ballType: {
      default: '',
      type: String
    },
    homeAndTeam: {
      default: 'home',
      type: String
    },
    teamName: {
      default: '',
      type: String
    }
  },
  data () {
    return {
      data: [
        {name: '主页', key: 'home'},
        {name: '球队', key: 'team'}
      ],
      title: '篮球资料库',
      activeIndex: 'home',
      name: 'NBA',
      imgUrl1: require('@src/assets/score/database_n.jpg'),
      imgUrl2: require('@src/assets/score/database_c.jpg')
    }
  },
  computed: {
    imgLogo(){
      let imgLogo
      switch (this.name) {
      case 'NBA': imgLogo = this.imgUrl1;break
      case 'CBA': imgLogo = this.imgUrl2;break
      }
      return imgLogo
    }
  },
  watch: {
    homeAndTeam: {
      handler: function (val) {
        this.activeIndex = val
      },
      deep: true
    },
    ballType: {
      handler: function (val) {
        this.name = val
      },
      deep: true,
    }
  },
  created() {
    console.log(this.name, 'createdname')
  },
  mounted () {
    console.log(this.name, 'mountedname')
  },
  methods: {
    
    handleClick:_debounce(function(index) {
      this.activeIndex = index
      this.selectVal()
    }, 200),

    goHome() {
      this.$router.push({path: '/index'})
    },

    selectVal() {
      this.$store.commit('setBallType',  this.name)
      this.$store.commit('setHomeAndTeam',  this.activeIndex)
      this.$emit('selectHomeAndTeam', { ballType: this.name, key: this.activeIndex })
    },
  },
}
</script>

<style lang="scss" scoped>
$color3: #333;
$color6: #666;
$colorf: #fff;
.header {
  border: 1px solid #eee;
  background-color: $colorf; 
  .ml {
    margin-left: 40px;
  }
  .position {
    border-bottom: 1px solid #D8D8D8;
    height: 48px;
    line-height: 48px;
    .mr-6 {
      margin-right: 6px;
    }
    span {
      font-size: 12px;
      color: $color3;
    }
    .weight {
      font-weight: 600;
    }
    .iconbq_ee:before {
      content: "\e628";
      font-size: 12px;
      color: $color6;
    }
    .current-title {
      color: $color6;
    }
    .bold-grey {
      color: $color3;
    }
  }

  .selector {
    height: 80px;
    line-height: 80px;
    .logo {
      width: 36px;
      height: 36px;
      display: inline-block;
      background-color: bisque;
    }
    &-name {
      width: 62px;
      height: 26px;
      line-height: 26px;
      font-size: 14px;
      margin-right: 16px;
      border-radius: 4px;
      color: $color6;
      border: 1px solid #DEDEDE;
      text-align: center;
      background: $colorf;
      display: inline-block;
      cursor: pointer;
      &:hover {
        border: none;
        color: $colorf;
        background: #3683FF;
      }
    }
    .active {
      border: none;
      color: $colorf;
      background: #3683FF;
    }
  }

  
  

  /deep/ .ivu-select-selection {
    height: 26px;
  }
  /deep/ .ivu-select-selected-value {
    line-height: 26px;
    font-size: 14px;
    color: $color6;
  }
  
}
</style>
