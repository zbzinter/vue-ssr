<template>
  <div class="inform">
    <div class="header">
      <b>举报房间</b>
      <span>带<i>*</i>的项必填</span>
    </div>
    <div class="content">
      <Form
        ref="formRef"
        label-position="right"
        :rules="ruleInline"
        :label-width="110"
        :model="form"
        class="c-user-form inform-form"
        @submit.prevent="submit"
      >
        <FormItem
          prop="cause"
          label="举报原因："
        >
          <Input
            v-model="form.cause"
            size="large"
            class="cause-input"
            type="textarea"
            :maxlength="200"
            placeholder="请输入详细说明"
          />
          <p class="des-text">
            详细细节描述，最大200字符
          </p>
        </FormItem>
        <FormItem
          prop="uploadImg"
          class="uploadImg"
          label="添加截图："
        >
          <div class="clearfix">
            <img
              v-if="form.uploadImg"
              :src="form.uploadImg"
              class="fl upload-img"
            >
            <Upload
              class="fl"
              :before-upload="handleUpload"
              :on-success="handleSuccess"
              :show-upload-list="false"
              :format="['jpg','jpeg','png']"
              :action="uploadAction"
            >
              <Button
                type="primary"
                class="btn"
                ghost
              >
                选择截图
              </Button>
            </Upload>
            <span class="tip">一张，大小限制1M</span>
          </div>
        </FormItem>
        <FormItem
          prop="contact"
          class="small"
          label="QQ："
        >
          <Input
            v-model="form.contact"
            size="large"
            type="number"
            placeholder="请输入QQ"
          />
        </FormItem>
        <div class="btn-group">
          <Button
            type="error"
            size="large"
            class="submit"
            @click="submit()"
          >
            提交
          </Button>
          <span
            class="go-home"
            @click="goHome"
          >返回首页</span>
        </div>
      </Form>
    </div>
  </div>
</template>
<script>
import { Form, Input, FormItem, Button, Upload, Modal } from 'iview'
import { uploadUrl } from '@utils/env'
export default {
  components: {
    Form,
    Input,
    FormItem,
    Button,
    Upload
  },
  data() {
    return {
      // 上传图片路径
      uploadAction: uploadUrl() + '/upload',
      form: {
        // 举报原因
        cause: '',
        // QQ
        contact: '',
        // 选择截图
        uploadImg: '',
      },
      ruleInline: {
        cause: [
          {
            required: true,
            message: ' ',
            trigger: 'blur'
          },
        ],
        uploadImg: [
          {
            required: true,
            message: '请选择截图',
            trigger: 'blur'
          },
        ],
      }
    }
  },
  methods: {
    handleUpload(file) {
      const isJPG = ['image/jpeg', 'image/png'].includes(file.type)
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isJPG) {
        this.$error('上传封面图片只能是 JPG 格式!')
      }
      if (!isLt1M) {
        this.$error('上传封面图片大小不能超过 1MB!')
      }

      return isJPG && isLt1M
    },
    handleSuccess(result) {
      const {code, data: {  imgUrl }, msg} = result
      if (code === 100200) {
        this.form.uploadImg = imgUrl + '?x-oss-process=image/resize,h_140'
      } else {
        this.$error(msg)
      }
    },
    goHome() {
      this.$router.push('/')
    },
    submit() {
      this.$refs.formRef.validate(valid => {
        if(valid) {
          Modal.confirm({
            title: '确定举报该房间吗？',
            onOk: () => this.updateInform()
          })
        }
      })
    },
    updateInform() {
      this.$post('v0.1/accusationLog', {
        apiType: 'anchor',
        body: {
          uid: this.commUserInfo.uid,
          acc_room_id: this.$route.query.roomId,
          acc_uid: this.$route.query.accUid,
          contact: this.form.contact,
          content: this.form.cause,
          acc_img: this.form.uploadImg,
        }
      }).then(res => {
        if(res.code === 200) {
          this.$success('举报成功')
          setTimeout(() => {
            window.close()
          }, 1500)
        } else {
          this.$error(res.msg)
        }
      })
    }
  }
}
</script>
<style lang="postcss" scoped>
.inform {
  width: 1200px;
  margin: 40px auto 60px auto;
  background: #fff;
  .header {
    height: 70px;
    line-height: 70px;
    padding-left: 80px;
    border-bottom: 1px solid #F0F0F0;
    b {
      color: #3683FF;
      font-size: 20px;
      margin-right: 20px;
    }
    span {
      font-size: 12px;
      color: #999999;
      i {
        font-style: normal;
        color: #F66E00;
        margin: 0 5px;
      }
    }
  }
  .content {
    width: 720px;
    padding: 10px 0 50px 110px;
    >>>.inform-form {
      .ivu-form-item {
        &.small .ivu-form-item-content {
          width: 150px;
        }
        &.uploadImg {
          padding: 24px 0;
          border-top: 1px solid #F0F0F0;
          border-bottom: 1px solid #F0F0F0;
          .btn {
            background: #fff;
          }
        }
        .ivu-form-item-content {
          width: 500px;
        }
      }
      .cause-input {
        textarea {
          height: 100px;
        }
      }
      .upload-img {
        width: 100px;
        height: 100px;
        margin-right: 10px;
        border: 1px solid #ddd;
      }
      .tip {
        float: left;
        margin-left: 10px;
        font-size: 12px;
        color: #999999;
      }
      .des-text {
        font-size: 12px;
        line-height: 1;
        padding-top: 10px;
        color: #999999;
      }
    }
    .btn-group {
      padding-top: 40px;
      .submit {
        margin-top: 0;
      }
      .go-home {
        font-size: 12px;
        color: #999999;
        margin-left: 24px;
        line-height: 36px;
        cursor: pointer;
        &:hover {
          color: #3683FF;
        }
      }
    }
  }
}
</style>