<template>
  <div class="rapid-entry">
    <div class="rapid-entry-container">
      <div
        v-for="(item, index) in links"
        :key="index"
        class="entry"
        @click="goPage(item, index)"
      >
        <img :src="item.imgAddr">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          name: '足球',
          imgAddr: require('../../../assets/home/home_img_football_n.png'),
          link: '/score/football'
        },
        {
          name: '篮球',
          imgAddr: require('../../../assets/home/home_img_basketball_n.png'),
          link: '/score/basketball'
        },
        {
          name: '网球',
          imgAddr: require('../../../assets/home/home_img_tennis_n.png'),
          link: '/score/tennis'
        },
        {
          name: '电竞',
          imgAddr: require('../../../assets/home/home_img_gaming_n.png'),
          link: '/score/esports'
        },
        {
          name: '棒球',
          imgAddr: require('../../../assets/home/home_img_baseball_n.png'),
          link: '/score/baseball'
        }
      ]
    }
  },
  methods: {
    goPage(item, index) {
      if(index !== 3) {
        this.$router.openNewPage(item.link)
      } else {
        this.$tip('敬请期待')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
    .rapid-entry {
      position: relative;
      width: 100%;
      background-color: #fff;
      clear: both;
      .rapid-entry-container{
        width: 1200px;
        margin: 0 auto;
        padding-top: 40px;
        display: flex;
        .entry{
            cursor: pointer;
            margin-right: 20px;
            transition: all 0.1s ease 0.1s;
            border-radius: 6px;
            &:last-child{
                margin-right: 0;
            }
            &:hover{
                transform: translateY(-20px);
                &:nth-child(1){
                  box-shadow: 3px 6px 18px 0 rgba(255, 199, 66, 0.3);
                }
                &:nth-child(2){
                  box-shadow: 3px 6px 18px 0 rgba(54, 131, 255, 0.3);
                }
                &:nth-child(3){
                  box-shadow: 3px 6px 18px 0 rgba(235, 44, 138, 0.3);
                }
                &:nth-child(4){
                  box-shadow: 3px 6px 18px 0 rgba(54, 229, 255, 0.3);
                }
                &:nth-child(5){
                  box-shadow: 3px 6px 18px 0 rgba(255, 79, 54, 0.3);
                }
            }
        }
      }

    }
</style>
