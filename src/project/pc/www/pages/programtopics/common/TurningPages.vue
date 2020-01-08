<template>
  <div class="turning-pages">
    <!--左右操作按钮-->
    <div class="sport-content ">
      <p class="title">
       {{titleName}}
      </p>
    </div>
    <div class="operate">
      <div
        class="left-operate"
        @click="left"
      >
      </div>
      <div
        class="right-operate"
        @click="right"
      >
      </div>
    </div>
    <div class="select-operate">
      <ul>
        <li
          v-for="(n,index) in (listLength/4+1)"
          :key="index"
          :class="index==-nowIndex?'active':''"
          @click="select(index)"
        >
        </li>
      </ul>
    </div>
    <div class="sport-video">
      <div
        v-for="(itemList ,indexList) in listArray"
        :key="indexList"
        :style="{'transform':'translateX('+(indexList+nowIndex)*1140+'px)','transition-duration': '2s'}"
      >
        <div
          v-if="itemList.length>0"
          class="video-list"
        >
          <ul>
            <li
              v-for="(item ,index) in itemList"
              :key="index"
            >
              <div class="video">
                <video
                  width="320"
                  height="240"
                  controls
                >
                  <source :src="item.src">
                </video>
                <div class="title">
                  {{ item.title }}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'TurningPages',
  props:['dataList','titleName'],
  data(){
    return{

      listLength:0,         //NBA轮播
      nowIndex:0,
      listArray:[]
    }
  },
  created(){
    // this.listArray=this.dataList
    // this.listLength=this.dataList.length
    // let newArray=[]
    // //讲数组每个三个间隔  分割成多个数组
    // for(let i=0;i<this.listArray.length;i+=3){
    //   newArray.push(this.listArray.slice(i,i+3))
    // }
    // this.listArray=newArray

  },

  methods:{

    left(){
      if(this.nowIndex==0){
        return false
      }else{
        this.nowIndex=this.nowIndex+1
      }

    },
    right(){
      if(this.nowIndex==-3){
        return false
      }else if(this.nowIndex>-4&&this.nowIndex<=0){
        this.nowIndex=this.nowIndex-1
      }

    },
    select(index){

      if(index==Math.abs(this.nowIndex)){
        return false
      }else if(index<Math.abs(this.nowIndex)){
        let dis=Math.abs(this.nowIndex)-index
        this.nowIndex=this.nowIndex+dis
      }else if(index>Math.abs(this.nowIndex)){
        let dis=index-Math.abs(this.nowIndex)
        this.nowIndex=this.nowIndex-dis
      }

    }
  }


}
</script>

<style lang="scss" scoped>
    @import "../common/TurningPages";
</style>