<template>
  <div>
    <Modal
      v-model="modalVisible"
      :title="title"
    >
      <div class="content">
        <span
          v-for="(item, key) in data"
          :key="key"
          class="desc"
          :class=" item.isSelect ? 'is-active': '' "
          @click="select(item, key)"
        >{{ item.name }}</span>
      </div>
      <div slot="footer">
        <Button
          class="cancel"
          @click="cancel"
        >
          取消
        </Button>
        <Button
          type="primary"
          class="ml"
          @click="confirm"
        >
          确认
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script >
import { Modal, Button } from 'iview'
export default {
  components: {
    Modal,
    Button
  },
  data() {
    return {
      modalVisible: false,
      data: [],
      index: 1,
      title: '',
      option: [
        {
          title: '请选择方言分类',
          errorTip: '获取方言失败',
          url: 'v0.1/dialects'
        },
        {
          title: '请选择频道',
          errorTip: '获取频道失败',
          url: 'v0.1/roomtags'
        }
      ]
    }
  },
  methods: {
    select(item, index) {
      this.data.forEach((item, i) => {
        item.isSelect = i === index ? true : false
      })
    },

    getData(index) {
      this.index = index
      this.$get(this.option[index].url, {
        apiType: 'anchor'
      })
        .then(res => {
          this.data = []
          const { code, data, msg } = res
          if (this.$judgeCode(code)) {
            this.title = this.option[this.index].title

            data.map(item => {
              // display 展示
              if (item.display === 1) {
                item.isSelect = false
                this.data.push(item)
              }
            })

            if (this.data.length) {
              this.modalVisible = true
            }
          } else {
            this.$error(msg)
          }
        })
        .catch(() => {
          this.$error(this.option[this.index].errorTip)
        })
    },

    confirm() {
      const arr = this.data.filter(item => item.isSelect === true)
      if (!arr.length) {
        this.$warning(this.option[this.index].title)
        return
      }
      this. modalVisible = false
      this.$emit('select', arr[0])
    },

    cancel() {
      this. modalVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .ivu-modal-body {
    padding: 15px 25px;
  }
  .ivu-modal-header {
    padding: 10px 25px;
  }
  .ivu-modal-header-inner {
    font-size: 16px;
    height: 25px;
    line-height: 30px;
    color: #333;
  }

  .ivu-btn {
    width: 64px;
    height: 32px;
    line-height: 18px;
    text-align: center;
  }
  .cancel {
    background: #f5f5f5;
    border: 1px solid #f2f2f2;
    border-radius: 4px;
    font-size: 12px;
    color: #666;
  }

  .ivu-modal-footer {
    border-top: none;
    padding: 0px 20px 15px 18px;
  }
}

.desc {
  display: inline-block;
  width: 85px;
  height: 30px;
  line-height: 28px;
  margin: 0 22px 20px 0px;
  text-align: center;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  &:hover {
    color: #409eff;
  }
}
.is-active {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
  &:hover {
    color: #fff;
  }
}
</style>
