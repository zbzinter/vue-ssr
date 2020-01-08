import Http from '@utils/Http'
const http = new Http()

const common = {
  actions: {
    // 比赛分类
    Logout({ commit }, { vm, msg }) {
      http.$get('jmfen-sport-passport/auth/logout', {
        apiType: 'gw',
        body: {
          token: localStorage.getItem('token'),
          uid: vm.commUserInfo.uid
        }
      }).then(() => {
        msg ? vm.$error(msg) : vm.$success('退出成功')
        localStorage.removeItem('token')
        localStorage.removeItem('uid')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('memberInfo')
        localStorage.removeItem('set')
        setTimeout(() => {
          const routerData = vm.$router.resolve({
            path: '/',
          })
          window.location.href = routerData.href
        }, 500)
      })
    },

    CheckCode({ commit }, { param, vm }) {

      return new Promise((resolve, reject) => {
        vm.$get('/jmfen-sport-usercenter/app/check/code', {
          apiType: 'gw',
          body: {
            ...param
          }
        }).then(res => {
          if (vm.$judgeCode(res.code)) {
            resolve(res.data)
          } else {
            resolve(false)
          }
        }).catch(() => {
          reject(0)
        })
      })
    },

    CheckBank({ commit }, { param, vm }) {
      return new Promise((resolve, reject) => {
        vm.$post('/v2/members/banks/check', {
          apiType: 'goShop',
          body: {
            ...param
          }
        }).then(res => {
          if (vm.$judgeCode(res.code)) {
            resolve(true)
          } else {
            resolve(false)
          }
        }).catch(() => {
          reject(false)
        })
      })
    },

    // 获取直播分类
    GetLiveType({ commit }, { vm }) {
      return new Promise((resolve, reject) => {
        vm.$get('v0.2/livetypes', {
          apiType: 'anchor',
        }).then(res => {
          const { data } = res
          let arr = []
          if (data && data.length) {
            data.forEach(item => {
              if (item.display === 1) {
                item.value = item.type_id
                item.isSelect = false
                arr.push(item)
              }
            })
            resolve(arr)
          } else {
            reject(arr)
          }
        }).catch(() => {
          reject(false)
        })
      })
    },

  }
}

export default common