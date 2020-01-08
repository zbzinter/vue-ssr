<template>
  <div class="comment">
    <div class="user-comment">
      <div class="comment-content">
        <div class="comment-area">
          <textarea
            v-model="commentStr"
            placeholder="说两句吧..."
          />
          <div class="comment-btn">
            <span
              v-if="isLogin"
              @click="replyArticle"
            >发表你的评论</span>
            <span
              v-else
              @click="loginTip"
            >登录后评论</span>
          </div>
        </div>
      </div>
    </div>
    <div class="comment-list">
      <div class="comment-list-header">
        <p class="header-info">
          全部评论
          <span>{{ total }}条评论</span>
        </p>
        <p class="sort">
          <a
            href="javascript:void(0)"
            :class="{'active':isTime}"
            @click="sortList(1)"
          >时间</a>
          <span>/</span>
          <a
            href="javascript:void(0)"
            :class="{'active':!isTime}"
            @click="sortList(2)"
          >热度</a>
        </p>
      </div>
      <div
        v-for="(item,index) in commentList"
        :key="item.commentId"
        class="list-item"
      >
        <div class="user-avatar">
          <background-img
            ref="imgBox"
            class="user-img"
            :src="item.commentAuthorImg||''"
            :size="size"
          />
        </div>
        <div class="user-info">
          <p>
            <span class="name">{{ item.commentAuthorName }}</span>
            <span class="time">{{ item.commentCreateTimeStr }}</span>
          </p>
          <p
            class="report"
            @click="showDialog(item.commentId,$event)"
          >
            举报
          </p>
        </div>
        <div class="comment-text">
          {{ item.commentContent }}
        </div>
        <div class="news-star">
          <div
            class="star"
            :class="{'active':item.vote}"
            @click="clickStarOne(item.commentId,item.vote,$event,index)"
          >
            <p class="star-img" />
            <span :class="{'active':item.vote}"> 赞{{ item.commentGoodCount }}</span>
          </div>
          <p
            class="comment-reply"
            @click="commentClick(index,item.commentId,$event)"
          >
            <img :src="commentImg">
            <span>回复{{ item.commentReplyCount?item.commentReplyCount:0 }}</span>
          </p>
        </div>
        <div
          v-if="item.commentReplyCount>0"
          class="more-replay"
        >
          <div
            v-for="(itemMore,index1) in item.commentImgList"
            :key="itemMore.commentId"
            class="more-list-item"
          >
            <div class="user-info-more">
              <p>
                <span class="name">
                  {{ itemMore.commentAuthorName }}
                </span>
                <b v-if="itemMore.commentAuthorName">回复</b>
                <span
                  v-if="itemMore.commentAuthorName"
                  class="name"
                >
                  {{ itemMore.commentAuthorName }}
                </span>
              </p>
              <p>
                <span class="comment-text-more">{{ itemMore.commentContent }}</span>
              </p>
            </div>

            <div class="news-star-more">
              <div
                class="star"
                @click="clickStarTwo(item.commentId,itemMore.commentId,itemMore.vote,$event,index)"
              >
                <span :class="{'active':itemMore.vote}">赞</span>
                <span>{{ itemMore.commentGoodCount }}</span>
              </div>
              <p
                class="comment-reply"
                @click="commentClick(index,itemMore.commentId,$event,itemMore.commentRootCommentId)"
              >
                <span>回复{{ itemMore.commentReplyCount?itemMore.commentReplyCount:0 }}</span>
              </p>
              <p
                class="report"
                @click="showDialog(itemMore.commentId,$event)"
              >
                举报
              </p>
            </div>
          </div>
          <div class="more-container">
            <p
              class="more-text"
              @click="getMoreComment(item.commentId,$event,index)"
            >
              查看更多回复
            </p>
            <p class="gl" />
          </div>
        </div>
      </div>

      <div
        v-show="showMoreData"
        class="add-more-data"
        @click="pageNoChange"
      >
        <span>加载更多评论</span>
      </div>
    </div>

    <div
      v-show="dialogShow"
      ref="dialog"
      class="report-dialog"
    >
      <div class="dialog-header">
        <p class="title">
          请选择举报理由
        </p>
        <a
          class="close"
          @click="closeDialog"
        >x</a>
      </div>
      <div class="dialog-body">
        <template>
          <RadioGroup
            v-model="vertical"
            vertical
          >
            <Radio
              value="1"
              label="1"
            >
              <span>垃圾广告</span>
            </Radio>
            <Radio
              value="2"
              label="2"
            >
              <span>色情低俗</span>
            </Radio>
            <Radio
              value="3"
              label="3"
            >
              <span>违法违规</span>
            </Radio>
            <Radio
              value="4"
              label="4"
            >
              <span>涉嫌侵权</span>
            </Radio>
            <Radio
              value="5"
              label="5"
            >
              <span>人身攻击</span>
            </Radio>
            <Radio
              value="6"
              label="6"
            >
              <span>冒充账号</span>
            </Radio>
            <Radio
              value="7"
              label="7"
            >
              <span>垃圾广告账号</span>
            </Radio>
            <Radio
              value="8"
              label="8"
            >
              <span>个人信息违规</span>
            </Radio>
          </RadioGroup>
        </template>
      </div>
      <div class="dialog-footer">
        <div
          class="submit-btn"
          @click="submitReply"
        >
          提交
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getServerConf } from '@config/apiConf'
let newsUrl = getServerConf().apiInfo.newsUrl
import BackgroundImg from '@src/components/BackgroundImg'
import noComment from '../../../assets/news/no-comment.png'
import star from '../../../assets/news/news-star.png'
import starActive from '../../../assets/news/star-active.png'
import commentImg from '../../../assets/news/img_comment.png'
import {RadioGroup, Radio,} from 'iview'
export default {
  name: 'Comment',
  components:{
    BackgroundImg,
    RadioGroup,
    Radio,
  },
  data() {
    return {
      isLogin:false,
      dialogShow:false,
      showMoreData:false,
      noComment:noComment,
      commentImg:commentImg,
      starActive:starActive,
      vertical: 1,
      star:star,
      articleId:'',
      commentNum:0,
      commentList:[],
      commentListMore:[],
      isTime:true,
      page:{
        currentPage:1,
        size:8
      },
      pageMore:{
        currentPage:1,
        size:8
      },
      size:{
        width:50,
        height:50
      },
      commentStr:'',
      defaultId:'',
      total:0,
      moreListId:'',
      defaultCommentId:'',
      secondCommentList:[]
    }
  },
  watch:{
    vertical() {
      console.warn(this.vertical)
    }
  },
  mounted(){
    this.isLogin = localStorage.getItem('token') || this.commUserInfo.token
    window.addEventListener('scroll',()=>{
      if(document.querySelector('.report-dialog')){
        this.dialogShow=false
      }
    })
  },
  created() {
    this.articleId=this.$route.params.articleId
    this.getCommentList(this.page.currentPage)
  },
  methods: {

    sortList(num){
      this.isTime=(num==1)?true:false
      this.getCommentList()
    },

    //翻页
    pageNoChange () {
      this.page.currentPage+=1
      this.getCommentList(this.page.currentPage)
    },

    //回复资讯评论
    async replyArticle(){
      if(!this.commentStr){
        this.$tip('评论内容不可为空！')
        return false
      }
      const postData = {
        commentArticleId: this.$route.params.articleId,
        commentContent: this.commentStr,
        commentOriginalCommentId: '',
        channelId: this.$route.params.channelId,
        commentRootCommentId:'',
      }
      this.commentStr=''
      try {
        const {code} = await this.$post(newsUrl + '/comment/v1',{
          headers: {'Content-Type': 'application/json'},
          body: {...postData}
        })
        if (this.$judgeCode(Number(code))) {
          this.getCommentList()

        }
      }catch (e){

      }
    },

    //回复一级评论
    async replyCommentOne(id,value,parentId,index){
      console.warn('replyCommentOne')
      // console.warn(id)
      // console.warn(value)
      // console.warn(parentId)
      // console.warn(index)
      const postData = {
        commentArticleId: this.$route.params.articleId,
        commentContent: value?value:'',
        commentOriginalCommentId: id?id:'',
        channelId: this.$route.params.channelId,
        commentRootCommentId: parentId?parentId:'',
      }
      try {
        const {code,data} = await this.$post(newsUrl + '/comment/v1',{
          headers: {'Content-Type': 'application/json'},
          body: {...postData}
        })
        if (this.$judgeCode(Number(code))) {
          let commentArea=document.querySelector('.commentArea')
          if(commentArea){
            commentArea.parentElement.removeChild(commentArea)
          }
          this.getCommentList()
          this.commentStr=''
        }else{

        }
      }catch (e){

      }
    },
    //回复二级评论
    async replyCommentTwo(id,value,parentId,index){

      const postData = {
        commentArticleId: this.$route.params.articleId,
        commentContent: value?value:'',
        commentOriginalCommentId: id?id:'',
        channelId: this.$route.params.channelId,
        commentRootCommentId: parentId?parentId:'',
      }
      try {
        const {code,data} = await this.$post(newsUrl + '/comment/v1',{
          headers: {'Content-Type': 'application/json'},
          body: {...postData}
        })
        if (this.$judgeCode(Number(code))) {
          let commentArea=document.querySelector('.commentArea')
          if(commentArea){
            commentArea.parentElement.removeChild(commentArea)
          }
          // this.getCommentListMore(id,)
          this.commentStr=''
          this.pageMore.currentPage = 1
          const postData = {
            commentId: parentId,
            query: {
              current: this.pageMore.currentPage,
              size: this.pageMore.size,
            },
            t:new Date().getTime()
          }
          // console.warn('二级评论点赞 更新对应二级评论列表数据')
          this.$post(newsUrl + '/comment/v2.2/mobile/replies', {
            headers: {'Content-Type': 'application/json'},
            body: {...postData}
          }).then(res=>{
            // console.warn(res)
            if (this.$judgeCode(Number(res.code))) {
              let array = res.data.subComments
              this.secondCommentList = array
              console.warn(index)
              console.warn(array)
              this.commentList[index].commentImgList = array
              // this.$set(this.list, this.list[currentIndex] , currentIndex)
              // this.$set(this.commentList,this.commentList[index].commentImgList,array)
            }
          })

        }else{

        }
      }catch (e){

      }
    },
    //提醒用户登录
    loginTip(){
      this.$tip('请先登录')
    },

    //查询评论列表
    async getCommentList(currentPage){
      // console.warn(currentPage)
      const timestamp = (new Date()).getTime()
      // this.commentList=(currentPage)?this.commentList:[]
      const postData = {
        commentArticleId: this.articleId,
        isNeedWonderfulComments: 0,
        sortType: this.isTime?0:2,
        query: {
          current:currentPage?currentPage:this.page.currentPage,
          size:this.page.size,
        },
        isWeb:1,
        timestamp:timestamp
      }
      try {
        const {code,data} = await this.$post(newsUrl + '/comment/v1.2',{
          headers: {'Content-Type': 'application/json'},
          body: {...postData}
        })
        if (this.$judgeCode(Number(code))) {
          if(currentPage){
            this.commentList=this.commentList.concat(data.page.records)
          }else{
            this.commentList=data.page.records
          }
          this.total=data.page.total
          this.showMoreData=data.page.current<data.page.pages?true:false
        }else{
          this.commentList=[]
        }
      }catch (e){

      }
    },

    //查询评论列表（楼中楼）二级列表
    async getCommentListMore(commentId,ev,index){
      let concat=false
      if(!this.defaultCommentId){
        //第一次调用查看二级评论
        this.defaultCommentId=commentId
        this.pageMore.currentPage=1
        concat=false
      }else if(commentId&& this.defaultCommentId==commentId){
        //同一个二级评论 查看更多
        this.pageMore.currentPage+=1
        concat=true
      }else if(commentId&& this.defaultCommentId!=commentId){
        //更换查看二级评论
        this.defaultCommentId=commentId
        this.pageMore.currentPage=1
        concat=false
      }
      const postData = {
        commentId: commentId,
        query: {
          current:this.pageMore.currentPage,
          size:this.pageMore.size,
        },
      }
      try {
        const {code,data} = await this.$post(newsUrl + '/comment/v2.2/mobile/replies',{
          headers: {'Content-Type': 'application/json'},
          body: {...postData}
        })
        if (this.$judgeCode(Number(code))) {
          let array=data.subComments
          if(data.current==data.pages){
            ev.parentElement.removeChild(ev)
          }
          if(this.secondCommentList.length>0&&concat){
            //同一个二级评论 查看更多
            this.secondCommentList=this.secondCommentList.concat(array)
            this.commentList[index].commentImgList=this.secondCommentList
          }else{
            this.secondCommentList=array
            this.commentList[index].commentImgList=array
          }
          //
          // console.warn(index)
          // console.warn(this.commentList)
        }
      }catch (e){

      }
    },

    //举报弹窗
    showDialog(id,ev){
      this.defaultId=id
      this.dialogShow=true
      // console.warn(id)
      // console.warn(e)
      // this.$refs.dialog.style.left=552+'px'
      console.warn(ev)
      this.$refs.dialog.style.top=ev.clientY+'px'
    },

    //回复评论列表
    commentClick(index,id,ev,parentId){
      // console.warn(id,ev,parentId)
      let commentArea=document.querySelector('.commentArea')
      if(commentArea){
        // console.warn(commentArea)
        // console.warn(commentArea.parentElement)
        commentArea.parentElement.removeChild(commentArea)
      } else{
        let target=ev.path[0].parentElement.parentElement.parentElement
        // console.warn(target)
        let div=document.createElement('div')
        let div1=document.createElement('div')
        div.className='commentArea'
        div1.className='commentBtn'
        let text1=document.createTextNode('回复')
        div1.appendChild(text1)
        let textarea=document.createElement('textarea')
        textarea.className='textarea'
        textarea.setAttribute('placeholder','写下您的回复')

        div1.onclick=()=>{
          // console.warn("click")
          let value=textarea.value
          if(!value){
            this.$tip('评论内容不可为空！')
            return false
          }
          console.warn(id,value,parentId,index)
          if(!parentId){
            // console.warn("222222")
            // console.warn(id,value,parentId,index)
            this.replyCommentOne(id,value,parentId,index)
          }else{
            this.replyCommentTwo(id,ev,index)
          }

        }
        div.appendChild(textarea)
        div.appendChild(div1)
        target.appendChild(div)

      }

    },

    //关闭举报弹窗
    closeDialog(){
      this.dialogShow=false
      this.vertical=1
    },

    //一级评论点赞
    async clickStarOne(id,vote,ev,index){
      console.warn(ev)
      if(!this.isLogin){
        this.$tip('请先登录')
      }
      const postData = {
        dataId: id,
        channelId:this.$route.params.channelId,
        type:vote?0:1
      }
      try {
        const {code,data} = await this.$post(newsUrl + '/vote/v1/comment/up',{
          headers: {'Content-Type': 'application/json;charset=utf-8'},
          body: {...postData},
        })
        if(this.$judgeCode(Number(code))) {
          this.getCommentList()
        }
      }catch (e){

      }
    },

    //二级评论点赞
    async clickStarTwo(parentId,id,vote,ev,index){
      // console.warn('clickStarTwo')
      // console.warn(id,vote,ev,index)
      if(!this.isLogin){
        this.$tip('请先登录')
      }
      const postData = {
        dataId: id,
        channelId:this.$route.params.channelId,
        type:vote?0:1
      }
      const {code} = await this.$post(newsUrl + '/vote/v1/comment/up', {
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: {...postData},
      })
      if (this.$judgeCode(Number(code))) {
        this.pageMore.currentPage = 1
        const postData = {
          commentId: parentId,
          query: {
            current: this.pageMore.currentPage,
            size: this.pageMore.size,
          },
          t:new Date().getTime()
        }
        // console.warn('二级评论点赞 更新对应二级评论列表数据')
        this.$post(newsUrl + '/comment/v2.2/mobile/replies', {
          headers: {'Content-Type': 'application/json'},
          body: {...postData}
        }).then(res=>{
          // console.warn(res)
          if (this.$judgeCode(Number(res.code))) {
            let array = res.data.subComments
            this.secondCommentList = array
            console.warn(index)
            console.warn(array)
            this.commentList[index].commentImgList = array
            // this.$set(this.list, this.list[currentIndex] , currentIndex)
            // this.$set(this.commentList,this.commentList[index].commentImgList,array)
          } else {

          }
        })


      }


    },
    //举报提交
    async submitReply(){
      if(!this.isLogin){
        this.$tip('请先登录')
      }
      const postData = {
        reportDataType:1,
        reportDataId:this.defaultId,
        reportType:Number(this.vertical),
        channelId: this.$route.params.channelId,
      }
      try {
        const {code,data} = await this.$post(newsUrl + '/report/v1',{
          headers: {'Content-Type': 'application/json'},
          body: {...postData},
        })
        if (this.$judgeCode(Number(code))) {
          this.closeDialog()
          this.$tip('提交成功')
        }else{

        }
      }catch (e){

      }
    },

    //更多评论
    getMoreComment(commentId,ev,index){
      // console.warn(ev.path[0])
      this.getCommentListMore(commentId,ev.path[0].parentElement,index)
    }
  }
}
</script>

<style lang="scss" scoped>
  .comment{
    clear: both;
    position: relative;
    .user-comment{
      .comment-content{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .comment-area{
          clear: both;
          position: relative;
          display: flex;
          align-items: center;
          textarea{
            display: inline-block;
            width:672px;
            box-sizing: border-box;
            height:84px;
            background:rgba(255,255,255,1);
            border:1px solid rgba(227,227,227,1);
            resize: none;
            text-indent: 20px;
            padding-top: 10px;
            line-height: 20px;
          }
          .comment-btn{
            display: inline-block;
            cursor: pointer;
            width:109px;
            height:84px;
            background:rgba(54,131,255,1);
            line-height: 84px;
            text-align: center;
            color: #fff;
          }
        }
      }
    }
    .comment-list{
      margin-top: 40px;
      .comment-list-header{
        margin-bottom: 24px;
        display: flex;
        cursor: pointer;
        justify-content: space-between;
        .header-info{
          height:28px;
          font-size:20px;
          font-family:PingFangSC;
          font-weight:600;
          color:#333;
          line-height:28px;
          display: inline-block;
          span{
            height:14px;
            font-size:16px;
            font-family:PingFangSC;
            font-weight:400;
            color:#3683FF;
            line-height:14px;
            margin-left: 12px;
          }
        }
        .sort{
          span{
            color: #666;
          }
          a{
            color: #666;
            font-size: 14px;
          }
          a.active{
            color: #3683FF;
          }
        }
      }
    }
    .report-dialog{
      width:243px;
      height:340px;
      left: 552px;
      background:rgba(255,255,255,1);
      z-index: 99999;
      box-shadow:0 0 10px 0 rgba(0,0,0,0.05);
      position: fixed;
      .dialog-header{
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #f4f4f4;
        padding-bottom: 12px;
        .title{
          height:22px;
          font-size:16px;
          font-family:PingFangSC;
          font-weight:500;
          color:#333;
          line-height:22px;
          margin: 12px 0 0 20px;
        }
        .close{
          display: block;
          width: 7px;
          height: 7px;
          margin:4px 10px 0 0;
        }
      }
      .dialog-body{
        width: 100%;
        margin-left: 20px;
        /deep/ .ivu-radio-wrapper{
          span{
            height:13px;
            font-size:13px;
            font-family:PingFangSC;
            font-weight:400;
            color:#333;
            line-height:13px;
          }
        }
      }
      .dialog-footer{
        position: relative;
        width: 100%;
        margin-top: 10px;
        .submit-btn{
          margin:0 auto;
          width:203px;
          height:32px;
          border:1px solid #3683FF;
          color: #3683FF;
          text-align: center;
          line-height: 32px;
          cursor: pointer;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  .more-list-item{
    position: relative;
    display: block;
    width: 100%;
    background-color: #F7F7F7;
    .star{
      cursor: pointer;
    }
    .comment-reply{
      cursor: pointer;
    }
    .report{
      cursor: pointer;
    }
    /deep/ .commentArea{
      textarea{
        margin-left: 10px!important;
        margin-bottom: 10px!important;
      }
      .commentBtn{
        margin-bottom: 10px!important;
      }
    }
  }
  .list-item{
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 20px;
    border-bottom: 1px solid #f4f4f4;
    .user-avatar{
      .user-img{
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow:hidden;
      }
    }
    .user-info{
      position: relative;
      margin-left: 60px;
      display: flex;
      justify-content: space-between;
      p{
        .name{
          height:20px;
          font-size:14px;
          font-family:PingFangSC;
          font-weight:400;
          line-height:20px;
          color: #3683FF;
          margin-right: 10px;
        }
        .time{
          font-size:14px;
          font-family:PingFangSC;
          font-weight:400;
          color:#999;
          line-height:20px;
        }
      }
      .report{
        cursor: pointer;
        padding-top: 10px;
        font-size:14px;
        font-family:PingFangSC;
        font-weight:400;
        color:#ccc;
        line-height:20px;
      }
    }
    .comment-text{
      position: relative;
      margin-left: 60px;
      font-size:16px;
      font-family:PingFangSC;
      font-weight:400;
      color:#333;
      line-height:26px;
      display:block;
      box-sizing: border-box;
      word-break: break-all;
      word-wrap: break-word;
    }
    .news-star{
      position: relative;
      margin: 13px 0 0 60px;
      display: flex;
      align-items: center;
      div.star {
        cursor: pointer;
        display: flex;
        margin-right:23px;
        align-items: center;
        cursor: pointer;
        p.star-img{
          width: 22px;
          height: 22px;
          background: url("../../../assets/news/news-star.png");
        }
        span{
          height:17px;
          font-size:12px;
          font-family:PingFangSC;
          font-weight:400;
          color:#666;
          line-height:17px;
        }
        span.active{
          color: #3683FF;
        }
      }
      div.active {
        p{
          background: url("../../../assets/news/star-active.png")!important;
        }
        span{
          color: #3683FF;
        }
      }
      .comment-reply{
        display: flex;
        align-items: center;
        cursor: pointer;
        line-height: 30px;
        span{
          height:17px;
          font-size:12px;
          font-family:PingFangSC;
          font-weight:400;
          color:#666;
          line-height:17px;
        }
      }
    }
    .more-replay{
      position: relative;
      margin-top: 13px;
      margin-left: 60px;
      height: auto;
      margin-bottom: 10px;
      .more-container{
        position: relative;
        .more-text{
          position: relative;
          height:22px;
          font-size:16px;
          font-family:PingFangSC;
          font-weight:400;
          color:#3683FF;
          line-height:22px;
          cursor: pointer;
          padding-right: 10px;
        }
        .gl{
          position: absolute;
          display: inline-block;
          margin-bottom: 20px;
          width:10px;
          height: 10px;
          top:11px;
          left: 100px;
          border-left: 2px solid #4E91FD;
          border-bottom: 2px solid #4E91FD;
          -webkit-transform: translate(0,-50%) rotate(-135deg);
          transform: translate(0,-50%) rotate(-135deg);
        }
      }

    }
  }
  .add-more-data{
    width:776px;
    height:40px;
    background:#f5f5f5;
    text-align: center;
    cursor: pointer;
    span{
      font-size:16px;
      font-family:PingFangSC;
      font-weight:400;
      color:#333;
      line-height: 40px;
    }
  }
  .comment {
    /deep/ .commentArea {
      clear: both;
      position: relative;
      display: block;
      display: flex;
      align-items: center;
      textarea {
        margin-left: 60px;
        display: inline-block;
        box-sizing: border-box;
        width: 612px;
        box-sizing: border-box;
        height: 84px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(227, 227, 227, 1);
        resize: none;
        text-indent: 20px;
        padding-top: 10px;
        line-height: 20px;
      }
      .commentBtn {
        display: inline-block;
        cursor: pointer;
        width: 109px;
        height: 84px;
        background: rgba(54, 131, 255, 1);
        line-height: 84px;
        text-align: center;
        color: #fff;
      }
    }
  }
  .user-info-more{
    position: relative;
    padding-top: 14px;
    margin-left:14px;
    p{
      display: inline-block;
      .name{
        height:20px;
        font-size:14px;
        font-family:PingFangSC;
        font-weight:400;
        line-height:20px;
        color: #3683FF;
      }
      .comment-text-more{
        font-size:14px;
        font-family:PingFangSC;
        font-weight:400;
        color:#999;
        line-height:20px;
      }
    }
    .report{
      cursor: pointer;
      padding-top: 10px;
      font-size:14px;
      font-family:PingFangSC;
      font-weight:400;
      color:#ccc;
      line-height:20px;
    }
  }
  .news-star-more{
    display: flex;
    align-items: center;
    margin-left: 14px;
    margin-top: 8px;
    div ,p{
      font-size:12px;
      font-family:PingFangSC;
      font-weight:400;
      color:#999;
      line-height:17px;
      margin-right: 14px;
      margin-bottom: 14px;
    }
  }

</style>