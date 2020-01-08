<template>
  <div class="subject">
    <div class="sport-list ">
      <div class="video-title">
        {{ videoTitle }}
      </div>
      <div class="video">
        <div class="video-play">
          <div
            id="dplayer"
            class="video-box"
          />
        </div>
        <div class="before-brilliant">
          <div class="brilliant-list">
            <p class="title">
              往期精彩
            </p>
            <ul>
              <li
                v-for="(item,index) in brilliantList"
                :key="index"
                :class="{active:index===0}"
              >
                <a href="#">{{ item.name }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="sort">
        <div class="sort-list">
          <a
            href="javascript:void(0)"
            class="program-red"
          >NBA星战
          </a>
          <a
            href="javascript:void(0)"
          >评头论足
          </a>
          <a
            href="javascript:void(0)"
          >球鞋分享
          </a>
          <a
            href="javascript:void(0)"
          >SUN VLOG
          </a>
          <a
            href="javascript:void(0)"
          >海报看中超
          </a>
          <a
            href="javascript:void(0)"
          >会聊个球
          </a>
          <a
            href="javascript:void(0)"
          >球会大赢家
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getServerConf } from '@config/apiConf'
let newsUrl = getServerConf().apiInfo.newsUrl
import DPlayer from 'dplayer'
export default {
  name: 'Subject',
  data() {
    return {
      mediaPath:'',//视频资源路径
      videoTitle:'粤港澳台青少年足球 邀请赛在深隆重举行',
      detail: '',
      options: {
        video: {
          url: ''
        }
      },
      brilliantList:[
        {name:'粤港澳台青少年足球 邀请赛在深隆重举行'},
        {name:'冠军之夜 铸造辉煌'},
        {name:'2019中超第17轮 天津 泰达vs广州恒大淘宝'},
        {name:'中超赛场 广州富力vs重庆斯威'},
        {name:'冠军之夜 铸造辉煌'},
        {name:'中超赛场 广州富力vs重庆斯威'},
      ] , //往期精彩列表

      setting: {         //设置NBA轮播
        autoplay: false,
        autoplaySpeed: 2000,
        dots: 'inside',
        radiusDot: true,
        trigger: 'click',
        arrow: 'always'
      }
    }
  },
  created() {
    this.init()

  },
  methods: {
    init () {
      this.getDetail()
    },

    getDetail () {
      this.$get(
        //暂时写一个接口请求地址
        newsUrl + '/ucms/api/front/content/get?jmf=0&id=' + 411
      ).then(res => {
        console.log(res)
        this.detail = res.body
        document.title = this.detail.title
        if (this.detail.mediaPath) {
          this.$nextTick(() => {
            new DPlayer({
              container: document.getElementById('dplayer'),
              screenshot: true,
              video: {
                url: this.detail.mediaPath
              }
            })
          })
        }
      })
    },

  }
}
</script>

<style lang="scss" scoped>

    .subject{
        position: absolute;
        top: 509px;
        margin-left: 50px;
        .video-title{
            position: absolute;
            top: -45px;
            font-size: 26px;
            color: #fff;
            text-align: left;
        }
        .video{
            position: relative;
            height: 500px;
            .video-play{
                box-sizing: border-box;
                overflow: hidden;
                float: left;
                .video-box{
                    width: 911px;
                    height: 504px;
                    float: left;
                    position: relative;
                    box-sizing: border-box;
                    overflow: hidden;
                    background: transparent;
                    /deep/ .dplayer-video-wrap{
                        background: transparent;
                        video{
                          width: 910px;
                        }
                    }

                }
            }
            .before-brilliant{
                float: left;
                display: block;
                width: 188px;
                height: 504px;
                background: url("../../../assets/program/before-brilliant-bg.png") no-repeat;
                .brilliant-list{
                    width: 100%;
                    .title{
                        box-sizing: border-box;
                        color: #fff;
                        font-size: 22px;
                        height: 78px;
                        padding:35px 0 0 30px;
                    }
                    ul{
                        width: 100%;
                        li{
                            width: 100%;
                            height:65px;
                            box-sizing: border-box;
                            padding: 0 20px;
                            text-align: left;
                            a{
                                display: inline-block;
                                vertical-align: middle;
                                color: #fff;
                                font-size: 14px;
                                line-height:19px;
                                font-family:PingFangSC-Regular;
                            }
                        }
                        li:hover{
                            background: url("../../../assets/program/before-brilliant-bg-hover.png") no-repeat;
                        }
                        li.active{
                            background: url("../../../assets/program/before-brilliant-bg-hover.png") no-repeat;
                        }
                    }
                }
            }
        }
        .sort{
            clear: both;
            margin-top: 23px;
            box-sizing: border-box;
              overflow: hidden;
            .sort-list{
              a{
                display: inline-block;
                box-sizing: border-box;
                overflow: hidden;
                margin-right: 23px;
                width:134px;
                height:63px;
                font-size:18px;
                text-align: center;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(221,221,255,1);
                line-height:63px;
                background:linear-gradient(90deg,rgba(10,14,139,0.6),rgba(66,70,237,0.6));
                }
              a.program-red{
                background: url("../../../assets/program/program-red.png") no-repeat;
              }
              a:hover{
                background: url("../../../assets/program/program-blue-square.png") no-repeat;
              }
              a:last-child{
                margin-right: 0;
              }
            }

        }
    }

</style>