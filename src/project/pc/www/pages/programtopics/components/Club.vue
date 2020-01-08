<template>
  <div class="club">
    <div class="sport-list">
      <TurningPages
        :data-list="dataList"
        :title-name="title"
      />
    </div>
  </div>
</template>

<script>
import TurningPages from '../common/TurningPages'
export default {
  name: 'Club',
  components: {
    TurningPages
  },
  data() {
    return {
      title: '球会大赢家是球会体育的竞彩专栏，每天为大家带来当日赛事投资解读，欢迎关注。',
      dataList: [
        {src: 'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4', title: '视频标题'},
        {src: 'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4', title: '视频标题'},
        {src: 'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4', title: '视频标题'},
        {src: 'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4', title: '视频标题'},
        {src: 'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4', title: '视频标题'},
        {src: 'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4', title: '视频标题'},
        {src: 'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4', title: '视频标题'},
        {src: 'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4', title: '视频标题'},
        {src: 'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4', title: '视频标题'},
        {src: 'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4', title: '视频标题'},
        {src: 'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4', title: '视频标题'},
        {src: 'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4', title: '视频标题'},
      ],

    }

  }
}
</script>


<style lang="scss" scoped>

.club{
    position: absolute;
    top:5130px;
   /deep/ .sport-content {
    .title {
      margin-left: 60px;
    }
  }
}
</style>