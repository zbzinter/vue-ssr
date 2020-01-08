<template>
  <div>
    <anchor-info
      ref="anchorInfo"
      :is-show="true"
      :show-guessball="true"
    />
    <div class="c-base-tab">
      <span class="tab active">直播设置</span>
    </div>
    <div class="content">
      <p class="title-item">
        房间设置
      </p>
      <Form :label-width="90">
        <FormItem label="直播分类：">
          <span class="text-primary mr">{{ text.competitionClassify }}</span>
          <Button @click="selectLive">
            修改
          </Button>
          <span class="tip">（用于你的网页和APP直播间直播分类展示）</span>
        </FormItem>

        <FormItem label="方言分类：">
          <span class="text-primary mr">{{ text.dialect_type_name }}</span>
          <Button @click="handleModal(0)">
            修改
          </Button>
          <span class="tip">（选择方言进行个性化直播）</span>
        </FormItem>
        <FormItem label="选择频道：">
          <span
            v-if="text.tag_name"
            class="text-primary mr"
          >{{ text.tag_name }}</span>
          <Button @click="handleModal(1)">
            {{ !text.tag_name ? '请选择': '修改' }}
          </Button>
          <span class="tip">（选择频道系统会增加推荐精准度）</span>
        </FormItem>

        <FormItem label="房间标题：">
          <Input
            v-if="changeTitleFlag"
            v-model.trim="form.title"
            class="width-short iblock"
            style="width: 320px;"
            :maxlength="20"
          />
          <span
            v-if="!changeTitleFlag"
            class="text-primary mr"
          >{{ form.title }}</span>
          <Button @click="changeTitle">
            {{ changeTitleFlag ? '提交': '修改' }}
          </Button>
        </FormItem>
        <FormItem
          label="房间公告："
          class="form-notice"
        >
          <Input
            v-if="announcementFlag"
            v-model="form.announcement"
            :maxlength="130"
            type="textarea"
          />
          <span
            v-if="!announcementFlag"
            class="mr notice pl"
          >{{ form.announcement }}</span>
          <Button
            class="block mt"
            @click="changeAnnouncement"
          >
            {{ announcementFlag ? '提交': '修改' }}
          </Button>
        </FormItem>
      </Form>

      <Address
        ref="address"
        :match-id="form.match_id"
        :room-id="roomId"
      />

      <p class="title-item">
        封面设置
      </p>

      <Form :label-width="90">
        <FormItem label="封面上传：">
          <div class="clearfix">
            <div class="fl upload">
              <input
                ref="file"
                type="file"
                class="file"
                accept="image/*"
                @change="uploadPic($event)"
              >
              <span class="plus">点击上传封面</span>
            </div>

            <div
              v-if="coverUrl"
              class="cover"
            >
              <img
                :src="coverUrl"
                alt
                class="upload-img"
                @click="reloadImg"
              >
              <div
                class="img-bg ml"
                @click="reloadImg"
              >
                点击更换封面
              </div>
              <span
                class="icon-delete"
                @click="deleteImg"
              />
            </div>
          </div>
          <span class="tip pl">图片大小不超过2MB，支持jpg，png格式</span>
        </FormItem>
      </Form>
    </div>

    <DialectClassify
      ref="classify"
      @select="selectModal"
    />

    <Modal
      v-model="cropperShow"
      title="上传图片"
    >
      <div class="img-content">
        <div class="vue-cropper">
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
            :fixed-number="fixedNumber"
          />
        </div>
      </div>
      <div slot="footer">
        <span class="tip">温馨提示：仅支持jpg、png格式，大小不超过2M，裁剪高度最小200px哟</span>
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

    <LiveClassify
      ref="liveClassify"
      @selectData="selectLiveTypeText"
    />
  </div>
</template>
<script>
import { Form, FormItem, Button, Input, Modal } from 'iview'
import LiveClassify from '@src/components/personal/live-classify'
import { dataURItoBlob, compress } from '@utils/utils'
import AnchorInfo from '@src/components/personal/anchor-info'
import CommonService from '@service/common'
import DialectClassify from './components/tag-dialect-classify.vue'
import Address from './components/address.vue'

export default {
  components: {
    AnchorInfo,
    Form,
    FormItem,
    Button,
    Input,
    DialectClassify,
    LiveClassify,
    Modal,
    Address
  },
  data() {
    return {
      flag: true,
      loading: false,
      changeTitleFlag: false,
      announcementFlag: false,
      text: {
        competitionClassify: '全部',
        dialect_type_name: '普通话',
        tag_name: ''
      },
      data: [],
      form: {
        live_type_id: 1,
        title: '',
        announcement: '',
        match_type_id: 0,
        dialect_type_id: 0,
        tag_id: 0,
        room_img: ''
      },
      coverUrl: '',
      roomId: 0,
      index: 1,
      uid: '',
      liveType: [],

      // 选取的图片
      originImg: '',
      // 裁剪后的图片
      cropImg: '',
      cropperShow: false,
      option: {
        fixed: true,
        fixedBox: false,
        autoCropWidth: 355,
        autoCropHeight: 200
      },
      fixedNumber: [16, 9],
      cropperFlag: false
    }
  },
  mounted() {
    const { VueCropper } = require('vue-cropper')
    this.$options.components.VueCropper = VueCropper
    this.cropperFlag = true
    this.getAnchorSetInfo()
  },
  methods: {
    getAnchorSetInfo() {
      this.$refs.anchorInfo.getAnchorSetInfo().then(result => {
        this.roomId = result.room_id
        this.assign(result)
      })
    },

    assign(result) {
      this.roomId = result.room_id

      // 默认足球
      this.form.live_type_id =
        result.live_type_id === 0 ? 1 : result.live_type_id
      if (result.dialectType) {
        this.text.dialect_type_name = result.dialectType.name || '普通话'
        if (!result.dialectType.type_id) {
          this.getDialectId()
        } else {
          this.form.type_id = result.dialectType.type_id
        }
      }

      if (result.tag) {
        this.text.tag_name = result.tag.name
        this.form.tag_id = result.tag.tag_id !== 0 ? result.tag.tag_id : 0
      } else {
        this.text.tag_name = '全部直播'
        this.form.tag_id = 0
      }

      if (result.match_id && result.match_type_id) {
        this.text.competitionClassify =
          result.live_type_name +
          ' / ' +
          result.match_type_name +
          '-' +
          result.match_name
      } else {
        this.text.competitionClassify = '全部'
      }
      this.form.match_type_id = result.match_type_id
      this.form.announcement = result.announcement
      this.form.title = result.title
      this.coverUrl = result.room_img
      this.form.room_img = result.room_img
      this.form.match_id = result.match_id
    },

    selectLiveTypeText(data) {
      this.form.live_type_id = data.sportId
      this.text.competitionClassify = data.name
      this.form.match_id = data.matchId
      this.form.match_name = data.team
      this.form.match_type_id = data.leagueId
      this.form.match_type_name = data.leagueName
      this.onSubmit()
    },

    handleSelect() {
      this.$refs['select'].show(this.form.live_type_id)
    },

    selectLive() {
      this.$refs.liveClassify.openLIveClassify()
    },

    changeTitle() {
      this.changeTitleFlag = !this.changeTitleFlag
      if (!this.changeTitleFlag) {
        this.onSubmit()
      }
    },

    changeAnnouncement() {
      this.announcementFlag = !this.announcementFlag
      if (!this.announcementFlag) {
        this.onSubmit()
      }
    },

    validate() {
      let msg = ''
      if (this.form.live_type_id !== -1) {
        const form = {
          match_type_id: '请选择赛事分类',
          title: '标题不能为空'
        }
        Object.keys(form).forEach(item => {
          if (!this.form[item]) {
            msg = form[item]
            this.$error(msg)
          }
        })
      }
      return msg
    },

    onSubmit() {
      if (this.validate()) {
        return false
      }
      const param = this.$refs.anchorInfo.getParam()
      this.$put('v0.1/rooms', {
        apiType: 'anchor',
        body: {
          uid: this.getUserInfo().uid,
          ...param,
          ...this.form,
          room_id: this.roomId,
          tag_name: this.text.tag_name,
          dialect_type_name: this.text.dialect_type_name,
          stream_server_type: 'TC'
        }
      }).then(res => {
        const { code, msg } = res
        if (this.$judgeCode(code)) {
          this.msg.warn('房间信息修改成功，需要0~2分钟更新，请耐心等待')
          this.getAnchorSetInfo()
        } else {
          this.msg.error(msg)
        }
      })
    },

    // 打开方言弹窗 和 频道
    handleModal(val) {
      this.index = val
      this.$refs.classify.getData(val)
    },

    // 选择方言 和 频道
    selectModal(data) {
      if (this.index === 0) {
        this.text.dialect_type_name = data.name
        this.form.dialect_type_id = data.type_id
      } else {
        this.text.tag_name = data.name
        this.form.tag_id = data.tag_id
      }
      this.onSubmit()
    },

    // 获取普通话的id
    getDialectId() {
      const option = [
        {
          url: 'v0.1/dialects',
          name: '普通话',
          key: 'dialect_type_id',
          id: 'type_id'
        }
        // {
        //   url:'/roomtag/v0.1/get',
        //   name: '全部直播',
        //   key: 'tag_id',
        //   id: 'tag_id'
        // }
      ]
      option.forEach(item => {
        this.$get(item.url, {
          apiType: 'anchor'
        }).then(res => {
          const { code, data } = res
          if (this.$judgeCode(code)) {
            const filterData = data.filter(item => item.name === item.name)
            this.form[item.key] = filterData[0][item.id]
          }
        })
      })
    },

    deleteImg() {
      this.form.room_img = ''
      this.coverUrl = ''
      this.onSubmit()
    },

    reloadImg() {
      document.getElementsByClassName('file')[0].click()
    },

    uploadPic(e) {
      const files = e.target.files
      if (!this.handleUpload(files[0])) {
        return
      }

      if (files.length) {
        this.originImg = window.URL.createObjectURL(files[0])
        this.cropperShow = true
        this.$refs.cropper.startCrop()
      } else {
        this.originImg = ''
        this.cropperShow = false
        this.$refs.cropper.stopCrop()
      }
    },

    getCropDataUrl() {
      return new Promise(resolve => {
        this.$refs.cropper.getCropData(data => {
          resolve(data)
        })
      })
    },

    cancelCropper() {
      this.originImg = ''
      this.cropperShow = false
      this.$refs.file.value = ''
    },
    saveCropper() {
      this.getCropDataUrl().then(data => {
        let img = new Image()
        img.src = data
        img.onload = e => {
          if (e.target.height < 200) {
            this.msg.error('高度最低为200')
            return
          }
          const cropPic = compress(img)
          this.cancelCropper()
          // 上传图片
          this.updateImage(cropPic)
        }
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
      CommonService.upload(fd)
        .then(res => {
          this.handleSuccess(res)
        })
        .catch(() => {
          this.$error('上传失败')
        })
    },

    handleUpload(file) {
      const isJPG = ['image/jpeg', 'image/png'].includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$error('上传封面图片只能是JPG和PNG格式!')
        return false
      }
      if (!isLt2M) {
        this.$error('上传封面图片大小不能超过 2MB!')
        return false
      }

      return isJPG && isLt2M
    },

    handleSuccess(result) {
      const {
        code,
        data: { imgUrl },
        msg
      } = result
      if (code === 100200) {
        this.form.room_img = imgUrl
        this.coverUrl = imgUrl + '?x-oss-process=image/resize,h_140'
        this.onSubmit()
      } else {
        this.msg.error(msg)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./../../../public/personal/tab.scss";
@import "./../../../public/personal/title.scss";

.content {
  padding-top: 10px;
  .text-primary {
    font-size: 14px;
    font-weight: 400;
    color: #3683ff;
  }
  .notice {
    display: inline-block;
    width: 500px;
    height: 108px;
    color: #334a86;
    background: #f2f2f2;
  }
}

/deep/ {
  .form-notice {
    /deep/ .ivu-form-item-content {
      margin-left: 105px !important;
    }

    /deep/ .ivu-input {
      width: 500px;
      height: 108px;
      border-radius: 4px;
      font-size: 12px;
      border: 1px solid #ccc;
    }
  }
  .ivu-form-item {
    margin-bottom: 10px;
  }
  .ivu-form-item-label {
    font-size: 14px;
    font-weight: 400;
    margin-left: 15px;
    color: #333;
  }
  .ivu-btn {
    min-width: 63px;
    height: 32px;
    border-color: #ccc;
    &:hover {
      border-color: #3683ff;
      color: #fff;
      background: #3683ff;
    }
  }
  .width-short {
    /deep/ .ivu-input {
      width: 320px;
      height: 32px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  }
}

.tip {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #999;
  text-align: left;
  line-height: 22px;
}

.mt {
  margin-top: 21px;
}

.upload {
  background: rgba(243,243,243,0.80);
  height: 135px;
  &:hover {
    .plus {
      color: #3683FF;
    }
  }
}


.file {
    position: absolute;
    width: 240px;
    height: 135px;
    top: 0px;
    left: 15px;
    opacity: 0;
    cursor: pointer;
  }

  .plus {
    display: inline-block;
    width: 240px;
    height: 135px;
    line-height: 135px;
    font-size: 12px;
    text-align: center;
    color: #666;
  }

.cover {
  position: relative;
  width: 240px;
  height: 135px;
  cursor: pointer;
  span {
    position: absolute;
    display: inline-block;
    top: 0px;
    width: 40px;
    left: 214px;
    font-size: 12px;
    line-height: 20px;
    cursor: pointer;
  }
  &:hover {
    .img-bg {
      display: inline-block;
    }
  }
  
  .upload-img {
    position: absolute;
    display: inline-block;
    width: 240px;
    height: 135px;
    left: 15px;
  }
  .img-bg {
    display: none;
    position: absolute;
    width: 240px;
    height: 135px;
    line-height: 135px;
    text-align: center;
    color: #fff;
    top: 0;
    left: 0;
    background: #000;
    opacity: 0.6;
  }
  .icon-delete {
    display: inline-block;
    position: absolute;
    top: 16px;
    right: 16px;
    width: 16px;
    height: 16px;
    background:url(../../../assets/common/svg/icon-delete.svg)
  }
}

.img-content {
  width: 100%;
  padding: 10px;
  .vue-cropper {
    width: 100%;
    height: 350px;
  }
}

/deep/ .ivu-modal-content {
  width: 724px;
  height: 510px;
  background-color: #f7f7f7;
  margin-left: -102px;
}


</style>


