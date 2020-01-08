import Http from '@utils/Http'
const http = new Http()

import {
  G_SetTip,
  G_SetUserInfo,
  G_SetMemberInfo
} from '@vues/store/mutation-types'

export default {
  [G_SetTip]({
    commit
  }, { msg, seconds = 2, callback }) {
    // 页面提示设置
    commit('G_SetTip', {
      msg
    })
    let timmer = setTimeout(() => {
      if (typeof callback === 'function') {
        callback()
      }
      commit('G_SetTip', {
        msg,
        timmer
      })
    }, seconds * 1000)
  },
  // 用户信息
  G_GetUserInfo({ commit }, { uid, token }) {
    return new Promise((resolve, reject) => {
      http.$get('jmfen-sport-usercenter/v1/user/info/' + uid, {
        apiType: 'gw',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: {
          token
        }
      }).then((res) => {
        const { code, data, msg } = res
        if (code === 100200) {
          commit(G_SetUserInfo, data || {})
          localStorage.setItem('userInfo', JSON.stringify(data))
          localStorage.setItem('token', token)
          localStorage.setItem('uid', uid)
          resolve(data)
        } else {
          reject(msg)
        }
      })
    })
  },
  // 会员信息
  G_GetMemberInfo({ commit }, { uid }) {
    return new Promise((resolve, reject) => {
      http.$get('/api/v1/user.php?do=memberinfo', {
        apiType: 'shop',
        body: {
          user_id: uid,
        }
      }).then((res) => {
        const { code, data, msg } = res
        if (code == 200) {
          commit(G_SetMemberInfo, data || {})
          localStorage.setItem('memberInfo', JSON.stringify(data))
          resolve(data)
        } else {
          reject(msg)
        }
      }).catch(err => {
        // console.log('err', err)
      })
    })
  },

}
