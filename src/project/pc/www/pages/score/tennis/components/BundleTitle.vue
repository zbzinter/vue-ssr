<!-- 网球状态的标题 -->
<template>
  <div class="bundle-title">
    <img
      v-if="imgSrc"
      style="width:20px;height:20px;"
      :src="imgSrc"
      alt=""
    >
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    imgSrc: {
      type: null,
      default: null
    },
    text: {
      type: null,
      default: null
    }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  created () {

  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
.bundle-title{
  text-align: center;
  height: 40px;
  line-height: 40px;
  span{
    vertical-align: middle;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #999999;
    letter-spacing: 0;
    margin-left: 1px;
  }
}
</style>
