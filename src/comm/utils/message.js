
const classType = Object.freeze({
  1: 'success',
  2: 'error',
  3: 'warn',
  4: 'info',
})

const toastType = Object.freeze({
  1: 'small',
  2: 'default',
  3: 'big',
})

export default class Message {
  constructor() {
    this.innerHTML = ''
    this.duration = 1500
    this.classType = 1
    // 1: 小、2：大
    this.type = 1
  }

  success(param) {
    this.classType = 1
    this.helper(param)
  }

  error(param) {
    this.classType = 2
    this.helper(param)
  }

  warn(param) {
    this.classType = 3
    this.helper(param)
  }

  info(param) {
    this.classType = 4
    this.helper(param)
  }

  create() {
    const isExist = document.getElementById('messageId')
    if (isExist) {
      return
    }
    const className = classType[this.classType]
    const div = document.createElement('div')
    div.innerHTML = this.innerHTML
    div.className = `message-tip message-${className} ${toastType[this.type]}`
    div.setAttribute('id', 'messageId')
    const body = document.getElementsByTagName('body')[0]
    body.appendChild(div)
    const timer = setTimeout(() => {
      const replaceDiv = document.getElementById('messageId')
      body.removeChild(replaceDiv)
      clearTimeout(timer)
    }, this.duration)

  }

  // 接收参数 string 或者 object {duration: 30, message: '111'}
  helper(param) {
    let message = ''
    if (typeof param === 'string') {
      message = param
    } else {
      message = param.message
      this.duration = param.duration || this.duration
    }
    this.innerHTML = message
    this.duration = this.duration
    this.type = param.type || 1
    this.create()
  }

}