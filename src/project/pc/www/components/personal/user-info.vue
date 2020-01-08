<template>
  <div class="user-info clearfix">
    <div class="user-avatar">
      <defaultImg
        class="avatar"
        :src="commUserInfo.img"
      />
      <span class="text">点击修改</span>
      <input
        ref="file"
        type="file"
        class="file"
        accept="image/*"
        @change="uploadPic($event)"
      >
    </div>
    <div class="user-content clearfix">
      <div class="fl">
        <h2 class="user-name">
          <span class="sub">{{ commUserInfo.nickName }}</span>
          <i
            class="iconfont icondp_ca sub"
            @click="changeName"
          />
        </h2>
        <!-- <p class="member">
          <span v-if="commMemberInfo.vip && commMemberInfo.vip.status == 1">会员到期：{{ commMemberInfo.vip.end_time }} <a @click="jumpPage('/personal/vip')">续费</a></span>
          <span v-else>会员享有专属特权 <a @click="jumpPage('/personal/vip')">开通会员</a></span>
        </p> -->
        <div class="rank clearfix">
          <span class="name number">LV{{ commMemberInfo.level || 1 }}</span>
          <div class="process-wrap">
            <div
              class="process"
              style="width: 20%"
            >
              <span>20%</span>
            </div>
          </div>
        </div>
        <div class="gold">
          <div class="fl item">
            <img
              src="../../assets/personal/nobt_diamond.png"
              alt=""
              style="width:25px;height:25px;margin-top: -2px;"
            >
            <span class="orange">{{ commMemberInfo.diamond || 0 }}</span>
            <span>钻石</span>
          </div>
          <div class="fl item">
            <img
              src="../../assets/personal/icon-peas.png"
              alt=""
            >
            <span class="orange">{{ commMemberInfo.ball_gold || 0 }}</span>
            <span>球豆</span>
          </div>
          <Button
            type="warning"
            class="pay"
            @click="recharge"
          >
            充值
          </Button>
        </div>
      </div>
      <div class="fr live">
        <i class="iconfont icondq_ce sub" />
        <span
          class="sub"
          @click="wantToLive"
        >我要直播</span>
      </div>
    </div>
    <Modal
      v-model="cropperShow"
      title="修改头像"
    >
      <div class="img-content clearfix">
        <div class="left fl">
          <defaultImg
            class="preview-avatar"
            :src="cropImg"
          />
        </div>
        <div class="fr right">
          <VueCropper
            v-if="cropperFlag"
            ref="cropper"
            :img="originImg"
            output-type="png"
            :auto-crop="true"
            :fixed="option.fixed"
            :fixed-box="option.fixedBox"
            :auto-crop-width="option.autoCropWidth"
            :auto-crop-height="option.autoCropHeight"
            @imgLoad="cropMoving"
            @cropMoving="cropMoving"
          />
        </div>
      </div>
      <div slot="footer">
        <span class="tip">
          温馨提示：仅支持jpg、jpeg、png格式，大小不超过1M
        </span>
        <Button
          type="primary"
          @click="saveCropper"
        >
          确认
        </Button>
        <Button
          type="default"
          @click="cancelCropper"
        >
          取消
        </Button>
      </div>
    </Modal>

    <Recharge ref="recharge" />
  </div>
</template>
<script>

import { Button, Modal } from 'iview'
import CommonService  from '@service/common'
import DefaultImg from '@src/components/DefaultImg'
import { dataURItoBlob, compress } from '@utils/utils'
import { uploadUrl } from '@utils/env'
import Recharge from './../Recharge'

export default {
  components: {
    DefaultImg,
    Button,
    Modal,
    Recharge
  },
  data() {
    return {
      // 选取的图片
      originImg: '',
      // 裁剪后的图片
      cropImg: '',
      cropperShow: false,
      option: {
        fixed: true,
        fixedBox: true,
        autoCropWidth: '120',
        autoCropHeight: '120',
      },
      cropperFlag: false,
    }
  },
  mounted() {
    const { VueCropper } = require('vue-cropper')
    this.$options.components.VueCropper = VueCropper
    this.cropperFlag = true
  },
  methods: {
    changeName() {
      // 区分是否在当前页面
      if(this.$route.path === '/personal/basic-data') {
        this.$emit('swichTab', 2)
      } else {
        this.$router.push({
          path: '/personal/basic-data',
          query: {
            tab: 2
          }
        })
      }
    },
    jumpPage(path) {
      this.$router.push({path})
    },
    uploadPic (e) {
      this.testFile = e.target.files
      if (e.target.files.length) {
        this.originImg = window.URL.createObjectURL(e.target.files[0])
        this.cropperShow = true
        this.$refs.cropper.startCrop()
      } else {
        this.originImg = ''
        this.cropperShow = false
        this.$refs.cropper.stopCrop()
      }
    },
    cancelCropper () {
      this.originImg = ''
      this.cropperShow = false
      this.$refs.file.value = ''
    },
    saveCropper() {
      this.getCropDataUrl().then(data => {
        let img = new Image()
        img.src = data
        img.onload = () => {
          const cropPic = compress(img)
          this.cancelCropper()
          // 上传图片
          this.updateImage(cropPic)
        }
      })
    },
    getCropDataUrl () {
      return new Promise(resolve => {
        this.$refs.cropper.getCropData(data => {
          resolve(data)
        })
      })
    },

    updateImage(dataUrl) {
      // 封装blob对象
      const blob = dataURItoBlob(dataUrl)
      // 组装formdata
      let fd = new FormData()
      fd.append('file', blob)
      fd.append('type', 1)
      fd.append('uid', localStorage.getItem('uid'))
      this.uploadImg(fd)
    },
    
    uploadImg(fd) {
      CommonService.upload(fd).then((res) => {
        const {code, data} = res
        if(this.$judgeCode(code) && data.imgUrl) {
          this.avatarImg = data.imgUrl
          // 更新用户头像
          this.updateUserAvatar(this.avatarImg)
        } else {
          this.$error('上传头像失败')
        }
      }).catch(() => {
        this.$error('上传头像失败')
      })
    },
    // 更新用户头像
    updateUserAvatar(url) {
      this.$get('jmfen-sport-usercenter/v1/user/personal/' + this.getUserInfo().uid, {
        apiType: 'gw',
        body: {
          headImg: url,
        }
      }).then(res => {
        if(res.code === 100200) {
          this.$success('修改成功')
          this.synchronize()
          setTimeout(() => {
            window.location.reload()
          }, 500)

        } else {
          this.$error(res.msg)
        }
      })
    },

    synchronize() {
      this.$post('v0.1/anchors/synchronize/' + this.getUserInfo().uid,  {
        apiType: 'anchor',
        body: {
          uid: this.getUserInfo().uid
        }
      })
    },
  
    // 移动图片，更新左边小图
    cropMoving() {
      this.getCropDataUrl().then(data => {
        this.cropImg = data
      })
    },

    recharge() {
      this.$refs.recharge.isShow()
    },
  }
}
</script>
<style lang="postcss" scoped>
.user-info {
  padding: 30px 40px 50px 40px;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
  .user-avatar {
    float: left;
    cursor: pointer;
    position: relative;
    &:hover {
      .text {
        opacity: 1;
      }
    }
    .avatar {
      display: block;
      width: 116px;
      height: 116px;
      border-radius: 50%;
    }
    .text {
      width: 100%;
      height: 100%;
      opacity: 0;
      color: #fff;
      text-align: center;
      transition: all 0.3s;
      line-height: 116px;
      border-radius: 116px;
      background: rgba(0,0,0,0.3);
      position: absolute;
      top: 0;
      left: 0;
    }
    .file {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      opacity: 0;
      cursor: pointer;
    }
  }
  .user-content {
    margin-left: 136px;
    .user-name {
      color: #333;
      line-height: 30px;
      font-size: 20px;
      font-weight: normal;
      padding-top: 5px;
      .sub {
        vertical-align: middle;
      }
      .iconfont {
        color: #999;
        margin-left: 13px;
        cursor: pointer;
        &:hover {
          color: #3683ff;
        }
      }
    }
    .member {
      line-height: 18px;
      font-size: 12px;
      color: #666666;
      margin-top: 2px;
        a {
          color: #FFA029;
          margin-left: 20px;
          &:hover {
            color: #ec8d00;
            text-decoration: underline;
          }
        }
    }
    .rank {
      margin: 10px 0;
      .name {
        float: left;
        color: #3683FF;
        line-height: 18px;
        font-size: 20px;
      }
      .process-wrap {
        float: left;
        width: 200px;
        height: 12px;
        margin-top: 3px;
        margin-left: 8px;
        background: #D8D8D8;
        border-radius: 5.5px;
        .process {
          height: 100%;
          font-size: 12px;
          line-height: 1;
          color: #fff;
          text-align: right;
          background: #3683FF;
          border-radius: 5.5px;
          span {
            margin-right: 4px;
          }
        }
      }
    }
    .gold {
      height: 20px;
      line-height: 1;
      font-size: 12px;
      color: #666;
      .item {
        margin-right: 60px;
        line-height: 20px;
        img {
          height: 15px;
        }
        .orange {
          color: #FFA029;
          font-weight: bold;
        }
      }
      .pay {
        height: 20px;
        line-height: 1;
        padding: 0 12px;
        font-size: 12px;
        &:hover {
          background: #ec8d00;
        }
      }
    }
    .live {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      margin-top: 40px;
      border: 1px solid #3884FF;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        background: #3683FF;
        .sub,span {
          color: #fff;
        }
      }
      .sub {
        color: #3683FF;
        vertical-align: middle;
      }
      span {
        margin-left: 3px;
      }
    }
  }
}

.img-content {
  width: 100%;
  padding: 10px;
  .preview-avatar {
    width: 120px;
    height: 120px;
    border-radius: 120px;
    border: 1px solid #ddd;
    float: left;
  }
  .right {
    width: 330px;
    height: 330px;
    padding-left: 15px;
    border-left: 1px solid #f2f2f2;
  }
}
.tip {
  font-size: 12px;
  color: #3884FF;
  margin-right: 10px;
}
</style>

