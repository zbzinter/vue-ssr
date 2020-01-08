<template>
  <div>
    <div class="header">
      <span class="text-font"> 当前位置：</span>
      <span
        class="home text-font"
        @click="$router.push({path: '/'})"
      >首页</span>
      <span>></span>
      <span
        class="news"
        @click="returnNews"
      >资讯</span>
      <span>></span>
      <span class="title">
        {{ title }}
      </span>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    title: {
      default: '',
      type: String
    }
  },
  methods: {
    returnNews() {
      if (this.$route.query.channelId) {
        this.$router.push({path: '/news'})
      } else {
        this.$emit('returnNews')
      } 
    }
  }
}
</script>


<style lang="scss" scoped>

.header {
  line-height: 1.6;
  background: #fff;
  padding: 14px 20px;
  box-shadow: 0 6px 24px 0 rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  color: #333;
  span {
      color: #666;
  }
  .text-font {
    color: #333;
    font-weight: 600;
  }
  .home, .news {
      transition: .2s;
      cursor: pointer;
      &:hover {
          color: #3683ff;
      }
  }
}
</style>
