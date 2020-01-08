<template>
  <div class="china-super-league">
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
  name: 'ChinaSuperLeague',
  components: {
    TurningPages
  },
  data(){
    return{
      title:'海报看中超，精彩赛事提前知晓。',
      dataList:[
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
        {src:'http://cms.qiuhui.com:8080/ucms/u/cms/www/201907/19090525ebp9.mp4',title:'视频标题'},
      ],

    }
  },

}
</script>

<style lang="scss" scoped>
    .china-super-league{
      position: absolute;
      top:3920px;
      /deep/.sport-content{
        .title{
          margin-left: 50px;
        }
      }
    }
</style>