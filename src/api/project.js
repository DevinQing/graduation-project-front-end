/**
 *
 * 项目信息管理相关的 api
 */

import request from '../utils/request'

export const uploadProject = (data) => {
  return request.post('/project/message', data)
}
