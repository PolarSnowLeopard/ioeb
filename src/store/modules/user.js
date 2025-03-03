import storage from 'store'
import expirePlugin from 'store/plugins/expire'
// import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { welcome } from '@/utils/util'

storage.addPlugin(expirePlugin)
const user = {
  state: {
    token: '',
    name: '',
    welcome: '',
    avatar: '',
    roles: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, { name, welcome }) => {
      state.name = name
      state.welcome = welcome
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_INFO: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    // Login ({ commit }, userInfo) {
    //   console.log('userInfo', userInfo)
    //   return new Promise((resolve, reject) => {
    //     login(userInfo).then(response => {
    //       console.log('response', response)
    //       const result = response
    //       storage.set(ACCESS_TOKEN, result.token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
    //       commit('SET_TOKEN', result.token)
    //       localStorage.setItem('username', result.username)
    //       resolve(response)
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        const result = {
          'id': '4291d7da9005377ec9aec4a71ea837f',
          'name': 'publisher',
          'username': 'publisher',
          'password': '',
          'token': '4291d7da9005377ec9aec4a71ea837f',
          'avatar': '/avatar2.svg',
          'status': 1,
          'telephone': '',
          'lastLoginIp': '27.154.74.117',
          'lastLoginTime': 1534837621348,
          'creatorId': 'publisher',
          'createTime': 1497160610259,
          'merchantCode': 'TLif2btpzg079h15bk',
          'deleted': 0,
          'roleId': 'publisher',
          'role': {
            'id': 'publisher',
            'name': '发布者',
            'describe': '拥有发布者权限',
            'status': 1,
            'creatorId': 'system',
            'createTime': 1497160610259,
            'deleted': 0
          }
        }
        storage.set(ACCESS_TOKEN, result.token, new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
        commit('SET_TOKEN', result.token)
        localStorage.setItem('username', result.username)
        resolve(result)
      })
    },
    // 获取用户信息
    // GetInfo ({ commit }) {
    //   const username = localStorage.getItem('username')
    //   return new Promise((resolve, reject) => {
    //     // 请求后端获取用户信息 /api/user/info
    //     getInfo(username).then(response => {
    //       const { result } = response
    //       if (result.role && result.role.permissionList.length > 0) {
    //         const role = { ...result.role }
    //         role.permissions = result.role.permissions.map(permission => {
    //           const per = {
    //             ...permission
    //             // actionList: (permission.actionEntitySet || {}).map(item => item.action)
    //            }
    //           return per
    //         })
    //         role.permissionList = role.permissions.map(permission => { return permission.permissionId })
    //         // 覆盖响应体的 role, 供下游使用
    //         result.role = role
    //
    //         commit('SET_ROLES', role)
    //         commit('SET_INFO', result)
    //         commit('SET_NAME', { name: result.name, welcome: welcome() })
    //         commit('SET_AVATAR', result.avatar)
    //         // 下游
    //         resolve(result)
    //       } else {
    //         reject(new Error('getInfo: roles must be a non-null array !'))
    //       }
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        const result = {
          'id': '4291d7da9005377ec9aec4a71ea837f',
          'name': 'publisher',
          'username': 'publisher',
          'password': '',
          'avatar': '/avatar2.jpg',
          'status': 1,
          'telephone': '',
          'lastLoginIp': '27.154.74.117',
          'lastLoginTime': 1534837621348,
          'creatorId': 'admin',
          'createTime': 1497160610259,
          'merchantCode': 'TLif2btpzg079h15bk',
          'deleted': 0,
          'roleId': 'publisher',
          'role': {
            'id': 'publisher',
            'name': '发布者',
            'describe': '拥有publisher权限',
            'status': 1,
            'creatorId': 'system',
            'createTime': 1497160610259,
            'deleted': 0,
            'permissions': [
              {
                'roleId': 'publisher',
                'permissionId': 'publisher',
                'permissionName': 'publisher权限',
                'dataAccess': null
              }
            ],
            'permissionList': [
              'publisher'
            ]
          }
        }
        const role = { ...result.role }
        role.permissions = result.role.permissions.map(permission => {
          return {
            ...permission
          }
        })
        role.permissionList = role.permissions.map(permission => { return permission.permissionId })
        // 覆盖响应体的 role, 供下游使用
        result.role = role
        commit('SET_ROLES', role)
        commit('SET_INFO', result)
        commit('SET_NAME', { name: result.name, welcome: welcome() })
        commit('SET_AVATAR', result.avatar)
        // 下游
        resolve(result)
      })
    },
    // 登出
    // Logout ({ commit, state }) {
    //   return new Promise((resolve) => {
    //     logout(state.token).then(() => {
    //       commit('SET_TOKEN', '')
    //       commit('SET_ROLES', [])
    //       storage.remove(ACCESS_TOKEN)
    //       resolve()
    //     }).catch((err) => {
    //       console.log('logout fail:', err)
    //       resolve()
    //     }).finally(() => {
    //       localStorage.clear()
    //     })
    //   })
    // }
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        storage.remove(ACCESS_TOKEN)
        localStorage.clear()
        resolve()
      })
    }
  }
}

export default user
