<!-- 网球列表bundle -->
<template>
  <div
    v-if="matches && matches.length"
    :class="[type, {'no-instant': selectTabActive!==0}]"
  >
    <BundleTitle
      v-if="isShowTitle && selectTabActive== 0 && type !== 'stick'"
      :text="titleName"
      :img-src="titleImg"
    />
    <div
      v-for="(match, index) in matches"
      :key="type === 'stick' ? index : match.matchId"
      :class="[{'row': isShowMatchItem(match)}, {'has-diff-date': isHasDiffDate(match, index)}]"
    >
      <MatchItem
        v-if="isShowMatchItem(match)"
        :match="match"
        :type="type"
        :scroll-top="scrollTop"
        @tempHide="tempHide"
      />
      <div
        v-if="isHasDiffDate(match, index)"
        :class="[`cls${match.status}`, 'no-today']"
      >
        <img
          src="../../../../assets/score/gk_dj@2x.png"
          alt=""
        >
        <span>{{ dayjs(matches[Math.min(index+1, matches.length-1)].matchTime).format('YYYY年MM月DD日') }}</span>
      </div> 
    </div>
  </div>
</template>

<script>
import BundleTitle from './BundleTitle'
import MatchItem from './MatchItem'
export default {
  components: {
    BundleTitle,
    MatchItem
  },
  props: [
    'type',
    'titleName',
    'titleImg',
    'matches', 
    'stickList',
    'selectTabActive',
    'scrollTop'
  ],
  data () {
    return {
      img: require('@src/assets/score/av_bj.png')
    }
  },
  computed: {
    isShowTitle(){
      let noShowTitle = Array.isArray(this.stickList) && this.matches.every(item => this.stickList.includes(item.matchId))
      return !noShowTitle
    },
    isShowMatchItem(){
      return (match) => {
        let { type, stickList} = this
        return type === 'stick' || !stickList || !stickList.length || stickList.indexOf(match.matchId) === -1
      }
    }
  },
  methods: {
    tempHide(isChecked, id) {
      this.$parent.tempHide(isChecked, id)
    },
    isHasDiffDate(match, index){
      let {dayjs, matches} = this
      return dayjs(match.matchTime).format('YYYY-MM-DD') !== dayjs(matches[Math.min(index+1, matches.length-1)].matchTime).format('YYYY-MM-DD')
    }
  }
}
</script>

<style scoped lang="scss">
.stick{
  margin-top: 10px;
  &.no-instant{
    margin-bottom: 10px;
  }
}
.row{
  &+.row{
    margin-top: 10px;
  }
  &.has-diff-date{
    &+.row{
      margin-top: 0px;
    }
    .no-today{
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #999999;
      letter-spacing: 0;
      img{
        width: 24px;
        vertical-align: middle;
        padding: 3px 0;
        vertical-align: top;
      }
    }
  }
}
</style>
