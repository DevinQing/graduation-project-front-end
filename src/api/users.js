/**
 * 用户相关的 api
 */
import request from '../utils/request'

/**
 * 用户登录
 */

export const userLogin = (data) => {
  return request.post('/users/login', data)
}

/**
 * 获取用户列表
 */

export const getUserList = (data) => {
  return request.get('/users/list', data)
}

/**
 * 编辑或增加用户
 */
export const operateUser = (data) => {
  return request.post('/users/operate', data)
}
