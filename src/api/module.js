/**
 * 模块管理相关的 api
 */
import request from '../utils/request'

/**
 * 操作模块
 */
export const operateModule = (data) => {
  return request.post('/module/operate', data)
}

/**
 * 获取 模块列表
 */
export const getModuleList = (data) => {
  return request.get('/module/list', data)
}

/**
 * 通过 模块id 获取细节
 */

export const getModuleDetailById = (id) => {
  return request.get('/module/detail/' + id)
}
