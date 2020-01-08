<!-- 左侧固定的保留、隐藏、完整的筛选 -->
<template>
  <div
    v-if="matchData.sportId === 1"
    class="hide-wrap"
  >
    <Affix
      :offset-top="200"
    >
      <ul class="hide-list">
        <li @click="showChecked()">
          <p>
            <span class="iconbb_ca" />
          </p>
          <p>保留</p>
        </li>
        <li @click="hideChecked()">
          <p>
            <span class="iconbe_ca" />
          </p>
          <p>隐藏</p>
        </li>
        <li @click="selectBetCompany()">
          <p>
            <span class="iconbd_ca" />
          </p>
          <p>完整</p>
        </li>
      </ul>
    </Affix>
  </div>
</template>

<script>
import {Affix} from 'iview'
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapActions, mapGetters } = createNamespacedHelpers('odds')
export default {
  components: {
    Affix
  },
  props: [
    'oddsData',
    'selected',
    'matchData',
    'typeId'
  ],
  data () {
    return {

    }
  },
  computed: {
    ...mapState(['tempOddsData']),
    ...mapGetters(['filterOddsArr']),
    getVuexFilterOdds () {
      return this.filterOddsArr({$set: this.$set,typeId: this.typeId, matchData: this.matchData})
    },
  },
  watch: {

  },
  created () {

  },
  mounted () {

  },
  methods: {
    showChecked () {
      this.selected.forEach(item => {
        item._checked = true
      })
      this.$emit('update:oddsData', [...this.selected])
    },
    hideChecked () {
      if (!this.selected.length) return
      this.$emit('update:oddsData', this.oddsData.filter(item => {
        return !this.selected.find(val=> val.bookId === item.bookId)
      }))
      this.dropCheck()
    },
    selectBetCompany () {
      if(this.typeId === 0) {
        this.$emit('update:oddsData',  [...this.tempOddsData])
      } else {
        this.$emit('update:oddsData',  [...this.getVuexFilterOdds])
      }
      this.dropCheck()
    },
    dropCheck () {
      this.$emit('update:selected', [])
      this.oddsData.forEach(item => item.ischeck = false)
    }
  }
}
</script>

<style scoped lang="scss">
.iconbb_ca,
.iconbe_ca,
.iconbd_ca {
  font-family: 'iconfont';
}
.hide-wrap {
  position: absolute;
  width: 48px;
  left: -100px;
  top: 100px;
  z-index: 10;
}
.hide-list {
  font-size: 12px;
  color: #999999;
  text-align: center;
  li {
    background: #eeeeee;
    border-radius: 8px;
    cursor: pointer;
    overflow: hidden;
    margin-bottom: 12px;
    transition: .2s;
    &.active, &:hover {
      background: #3683ff;
      color: #ffffff;
    }
  }
}
</style>
