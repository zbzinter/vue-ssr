// 防抖
export function _debounce(fn, delay) {
  let delayTime = delay || 500
  let timer
  return function () {
    let th = this
    let args = arguments
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(function () {
      timer = null
      fn.apply(th, args)
    }, delayTime)
  }
}

// 节流
export function _throttle(fn, interval) {
  let last
  let timer
  let intervalTime = interval || 500
  return function () {
    let th = this
    let args = arguments
    let now = +new Date()
    if (last && now - last < intervalTime) {
      clearTimeout(timer)
      timer = setTimeout(function () {
        last = now
        fn.apply(th, args)
      }, intervalTime)
    } else {
      last = now
      fn.apply(th, args)
    }
  }
}

// 按属性对object分类
export function groupBy(objectArray, property) {
  return objectArray.reduce(function (acc, obj) {
    var key = obj[property]
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(obj)
    return acc
  }, {})
}
