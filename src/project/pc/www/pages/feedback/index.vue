<template>
  <div class="feedback">
    <div class="form-title">
      <span>意见反馈</span>
    </div>

    <Form
      ref="formRef"
      :model="formData"
      :rules="ruleValidate"
      :label-width="200"
    >
      <FormItem
        label="反馈类型："
        prop="catalogId"
      >
        <RadioGroup v-model="formData.catalogId">
          <Radio
            v-for="item in typeList"
            :key="item.id"
            :label="item.id"
          >
            {{ item.catalogName }}
          </Radio>
        </RadioGroup>
      </FormItem>
      <FormItem
        label="反馈内容："
        prop="content"
      >
        <Input
          v-model="formData.content"
          type="textarea"
          placeholder="您的反馈将帮助我们尽快成长"
          @on-change="onChange"
        />
      </FormItem>
      <FormItem
        label="添加图片："
        prop="pic"
      >
        <!-- 已上传图片列表 -->
        <div
          v-for="(item, index) in uploadedList"
          :key="item.imgUrl"
          class="uploaded-img"
        >
          <img :src="item.imgUrl">
          <div
            class="delete"
            @click="deleteImg(index)"
          >
            <img src="../../assets/feedback/delete.svg">
          </div>
        </div>
        <!-- 上传组件 -->
        <Upload
          ref="upload"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :format="['jpg','jpeg','png']"
          :before-upload="handleBeforeUpload"
          multiple
          :action="uploadAction"
        >
          <div class="plus">
            <img
              class="default"
              src="../../assets/feedback/plus_default.svg"
            >
            <img
              class="hover"
              src="../../assets/feedback/plus_hover.svg"
            >
          </div>
        </Upload>
        <!-- 上传提示 -->
        <div class="upload-tip">
          <span>仅支持JPG、GIF、PNG图片，且文件小于4M，最多上传5张</span>
        </div>
      </FormItem>
      <FormItem
        label="您的电话："
        prop="mobile"
      >
        <Input v-model="formData.mobile" />
      </FormItem>
      <FormItem
        label="您的邮箱："
        prop="email"
      >
        <Input v-model="formData.email" />
      </FormItem>
      <!-- 按钮 -->
      <FormItem>
        <Button
          type="primary"
          @click="handleSubmit"
        >
          提交
        </Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { Form, Input, FormItem, Button, RadioGroup, Radio, Upload } from 'iview'
import { uploadUrl } from '@utils/env'
import { mapGetters } from 'vuex'
import { getServerConf } from '@config/apiConf'

const prefix = getServerConf().apiInfo.java
export default {
  components: {
    Form,
    FormItem,
    Input,
    Button,
    RadioGroup,
    Radio,
    Upload
  },
  data() {
    const validateMobile = (rule, value, callback) => {
      if (value) {
        const telRegx = /^1[3456789]\d{9}$/
        const check = telRegx.test(value)
        if (!check) {
          callback(new Error('请输入正确的手机号'))
        }
      }
      callback()
    }
    const validateEmail = (rule, value, callback) => {
      if (value) {
        const emailReg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
        const check = emailReg.test(value)
        if (!check) {
          callback(new Error('请输入正确的邮箱地址'))
        }
      }
      callback()
    }
    return {
      formData: {
        catalogId: '',
        content: '',
        mobile: '',
        email: ''
      },
      ruleValidate:{
        catalogId: [
          { required: true, type: 'number', message: '请选择反馈类型', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入反馈内容', trigger: 'blur' },
          { type: 'string', max: 200, message: '最多输入200字', trigger: 'blur' }
        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ]
      },
      uploadAction: uploadUrl() + '/upload',
      uploadedList: []
    }
  },
  computed: {
    ...mapGetters({
      typeList: 'home/displayFeedbackType'
    })
  },
  asyncData ({ store }) {
    return store.dispatch('home/getFeedbackType')
  },
  methods: {
    handleMaxSize(file) {
      const size = file.size
      const isMoreThan4M = size / 1024 / 1024 > 4
      if (isMoreThan4M) {
        this.$error('图片大小不超过4M')
        return false
      }
      return true
    },
    handleFormat(file) {
      const validFormat = ['image/jpeg', 'image/gif', 'image/png']
      const formatType = file.type
      if (!validFormat.includes(formatType)) {
        this.$error('仅支持JPG、GIF、PNG格式的图片')
        return false
      }
      return true
    },
    handleImageCount() {
      const isCountExceeded = this.$refs.upload.fileList.length >= 5
      if (isCountExceeded) {
        this.$error('最多可上传5张图片')
        return false
      }
      return true
    },
    handleBeforeUpload(file) {
      // 检查文件格式
      const checkFormat =  this.handleFormat(file)
      if (!checkFormat) {
        return false
      }
      // 检查文件大小
      const checkSize =  this.handleMaxSize(file)
      if (!checkSize) {
        return false
      }
      // 检查文件数量
      const checkCount =  this.handleImageCount(file)
      if (!checkCount) {
        return false
      }
      return true
    },
    handleSuccess(res, file) {
      const img = {
        imgUrl: res.data.imgUrl
      }
      // 添加到已上传文件列表
      this.uploadedList.push(img)
    },
    handleSubmit() {
      this.$refs['formRef'].validate((valid) => {
        if (valid) {
          const images = this.uploadedList.map(item => item.imgUrl)
          const params = {
            uid: this.getUserInfo().uid,
            images,
            ...this.formData
          }
          this.$post(prefix + '/feedback/v1/save', {
            headers: {
              'Authorization': localStorage.getItem('token'),
            },
            body: params
          }).then(() => {
            this.$success('提交成功')
            // 提交成功后重置表单
            this.resetForm()
          }).catch(err => {
            this.$error('提交失败')
          })
        }
      })
    },
    resetForm() {
      Object.keys(this.formData).forEach(key => {
        this.formData[key] = ''
      })
      this.uploadedList = [] // 清空已上传图片
    },
    deleteImg(index) {
      this.uploadedList.splice(index, 1)
      this.$refs.upload.fileList.splice(index, 1)
    },
    onChange(ev) {
      const len = ev.target.value.length
      const max = 200
      if (len > max) {
        this.$nextTick(() => {
          this.formData.content = ev.target.value.substring(0, max)
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
    .feedback{
        width: 1200px;
        margin: 49px auto;
        padding-bottom: 49px;
        background: #ffffff;
        .form-title{
            padding: 21px 0 19.5px 75px;
            border-bottom: 1px solid #F0F0F0;
            span{
                font-family: PingFangSC-Semibold;
                font-weight: 600;
                font-size: 20px;
                line-height: 28px;
                color: #3683FF;
            }
        }
        .ivu-form{
            padding-top: 20.5px;
            /deep/ .ivu-form-item{
                margin-bottom: 20px;
                &:last-child{
                    margin-bottom: 0;
                }
                .ivu-form-item-label{
                    font-family: PingFangSC-Regular;
                    font-size: 14px;
                    color: #333333;
                    line-height: 20px;
                    &:before{
                        color: #ff9100;
                    }
                }
                .ivu-form-item-content{
                    color: #666666;
                    .ivu-radio-wrapper{
                        .ivu-radio-inner{
                            border-color: #CACACA;
                        }
                        &:hover{
                            .ivu-radio{
                                .ivu-radio-inner{
                                    border-color: #3683FF;
                                }
                            }
                        }
                        .ivu-radio-checked{
                            .ivu-radio-inner{
                                border-color: #3683FF;
                                &::after{
                                    background: #3683FF;
                                }
                            }
                        }
                    }
                    .ivu-input-wrapper{
                        textarea{
                            width: 500px;
                            height: 128px;
                            resize: none;
                        }
                        input{
                            width: 300px;
                        }
                    }
                    .uploaded-img{
                        position: relative;
                        display: inline-block;
                        margin-right: 10px;
                        vertical-align: top;
                        cursor: pointer;
                        img{
                            width: 110px;
                            height: 100px;
                        }
                        &:hover{
                            .delete{
                                opacity: 0.4;
                            }
                        }
                        .delete{
                            position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            transition: all 0.3s ease;
                            opacity: 0;
                            background: #000000;
                            img{
                                position: absolute;
                                width: 16px;
                                height: 16px;
                                left: 50%;
                                top: 50%;
                                transform: translate(-50%, -50%);
                            }
                        }
                    }
                    .ivu-upload{
                        display: inline-block;
                        width: 110px;
                        height: 100px;
                        .plus{
                            height: 100%;
                            line-height: 100px;
                            text-align: center;
                            background: #F3F3F3;
                            cursor: pointer;
                            .default{
                                display: inline;
                            }
                            .hover{
                                display: none;
                            }
                            &:hover{
                                .default{
                                display: none;
                                }
                                .hover{
                                    display: inline;
                            }
                            }
                        }
                    }
                    .upload-tip{
                        margin-top: 10px;
                        line-height: 12px;
                        span{
                            font-size: 12px;
                            color: #999999;
                        }
                    }
                    .ivu-btn{
                        padding: 5px 38px;
                    }
                }
            }
        }
    }
</style>