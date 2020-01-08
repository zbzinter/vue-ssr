<template>
  <div>
    <p class="title-item">
      推流地址
    </p>
    <Form :label-width="90">
      <FormItem label="推流地址：">
        <span
          id="publishAddr"
          class="url"
        >{{ url.publishAddr }}</span>
        <span
          data-clipboard-target="#publishAddr"
          class="stream small-btn"
        >复制</span>
      </FormItem>
      <FormItem label="播放地址：">
        <span class="play-url">{{ playUrl }}</span>
      </FormItem>
    </Form>
  </div>
</template>

<script>
import { Form, FormItem } from 'iview'
import Clipboard from 'clipboard'

export default {
  components: {
    FormItem,
    Form
  },
  props: {
    roomId: {
      default: 0,
      type: Number
    },
    matchId: {
      default: -1,
      type: Number
    }
  },
  data() {
    return {
      playUrl: '',
      url: {
        playAddr: [],
        publishAddr: ''
      },
      streamServerType: 'TC'
    }
  },

  watch: {
    roomId(val) {
      if (val) {
        this.getPlayAndPublishAddr()
        this.getPlayUrl()
      }
    },
    matchId() {
      this.getPlayUrl()
    }
  },
  mounted() {
    this.handleClipboard()
    this.getPlayUrl()
  },
  methods: {
    getPlayAndPublishAddr() {
      Object.keys(this.url).forEach(item => {
        this.$get(
          `/v0.1/streams/${item}/${this.streamServerType}/${this.roomId}`,
          {
            apiType: 'anchor'
          }
        ).then(res => {
          const { code, data, msg } = res
          if (this.$judgeCode(code)) {
            if (item === 'publishAddr') {
              this.url[item] = data.url
            } else {
              this.url[item] = data
              data.forEach(item => {
                const classParam = `.playAddr${item.protocolType}`
                this.handleClipboardHelper(classParam)
              })
            }
          } else {
            this.$error(msg)
          }
        })
      })
    },

    handleClipboard() {
      ['.stream'].forEach(item => {
        this.handleClipboardHelper(item)
      })
    },

    handleClipboardHelper(classParam) {
      let _ = this
      const cliboardText = new Clipboard(classParam)
      cliboardText.on('success', function(e) {
        _.msg.success('复制成功')
        e.clearSelection()
      })

      cliboardText.on('error', function() {
        _.$msg.error('不支持复制，请手动复制')
      })
    },

    copyUrl(classParam) {
      this.handleClipboardHelper(classParam)
    },

    getPlayUrl() {
      const url = window.location.host
      this.playUrl = `${url}/live/detail?id=${this.matchId}&roomId=${this.roomId}`
    }
  }
}
</script>

<style lang="scss" scoped>
.url {
  display: inline-block;
  word-break: break-all;
  height: 32px;
  background: #f2f2f2;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
  font-weight: 400;
  padding: 0 10px;
}
.small-btn {
  display: inline-block;
  text-align: center;
  width: 64px;
  height: 32px;
  border-radius: 4px;
  font-size: 12px;
  color: #666;
  border: 1px solid #ccc;
  cursor: pointer;
  &:hover {
    color: #3683FF;
    border: 1px solid #3683FF;
  }
}
.play-url {
  font-size: 14px;
  color: #666;
  font-weight: 400;
}
</style>
