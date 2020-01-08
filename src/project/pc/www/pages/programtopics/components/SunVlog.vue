<template>
  <div class="sun-vlog">
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
  name: 'SunVlog',
  components: {
    TurningPages
  },
  data(){
    return {
      title:'带你走进深圳本地运动达人聚集地，你想看的我都有~'     ,
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
    .sun-vlog{
        position: absolute;
        top: 3315px;
       /deep/ .sport-content {
         .title {
           margin-left: 40px;
         }
       }
    }
</style>