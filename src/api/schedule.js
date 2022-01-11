/**
 * 进度计划管理相关的 api
 */

import request from '../utils/request'

/**
 * 获取进度列表
 */
export const getScheduleList = (params) => {
  return request.get('/schedule/list', params)
}

/**
 * 操作进度列表
 */
export const operateSchedule = (params) => {
  return request.post('/schedule/operate', params)
}

/**
 * 通过 id 获取相关进度信息
 */
export const getDetailById = (params) => {
  return request.get('/schedule/detail', params)
}
