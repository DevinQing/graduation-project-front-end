/**
 * Mutations 业务层数据提交
 */

import storage from '../utils/storage'

export default {
  saveUserInfo(state, userInfo) {
    // 改变 state 里面的 userInfo
    state.userInfo = userInfo
    // 改变浏览器中存储的 userInfo
    storage.setItem('userInfo', userInfo)
  }
}
