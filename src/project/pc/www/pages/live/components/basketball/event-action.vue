<template>
  <div class="event-action">
    <!-- 比分 -->
    <EventScore 
      :match-data="matchData"
    />

    <!-- 统计 -->
    <EventStat />

    <!-- 文字直播 -->
    <TextLive v-if="showTextLiveBasket" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import EventScore from './event-score'
import EventStat from './event-stat'
import TextLive from './text-live'
export default {
  components: {
    EventScore,
    EventStat,
    TextLive
  },
  props: {
    matchData: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters(['showTextLiveBasket'])
  },
  created() {
    this.init()
  },
  methods: {
    init() {
    }
  }
}
</script>
<style lang="postcss" scoped>
.event-action {
}
</style>