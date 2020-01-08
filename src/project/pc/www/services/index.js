import axios from 'axios'

// 记录和显示错误
function errorLog(err) {
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    console.log(err)
  }
}

const options = {
  timeout: 0,
  headers: {
    Authorization: 'Basic YXBwOmFwcA=='
  }
}

const service = axios.create(options)

// response 拦截器
service.interceptors.response.use(
  response => {
    if (Number(response.status) !== 200) {
      return Promise.reject('接口报错')
    }
    if (Number(response.status) === 200) {
      return response.data
    }
    return response.data
  },
  error => {
    if (error && error.response) {
      errorLog(error.message)
      errorLog(error)
      return Promise.reject(error)
    }
    return error
  },
)

export default service
