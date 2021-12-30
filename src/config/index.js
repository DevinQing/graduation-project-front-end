/**
 * 环境配置封装
 * @author QingNY
 */

// 首先获取环境变量
// 如果没有取到 默认为生产模式 防止出错
const env = import.meta.env.MODE || 'prod'

// 根据项目环境的不同，引用不同的api
const EnvConfig = {
  // 开发环境下
  dev: {
    baseApi: '/api',
    mockApi:
      'https://www.fastmock.site/mock/17d818b99cfdc5439e23d910d31a09e1/api'
  },
  // 测试环境下
  test: {
    baseApi: '/',
    mockApi:
      'https://www.fastmock.site/mock/17d818b99cfdc5439e23d910d31a09e1/api'
  },
  // 生产环境下
  prod: {
    baseApi: '/',
    mockApi:
      'https://www.fastmock.site/mock/17d818b99cfdc5439e23d910d31a09e1/api'
  }
}

// 了解命名导出和默认导出的区别
export default {
  // 导出当前的环境变量
  env,
  //  导出当前的命名空间 主要用于在浏览器中通过 localStorage 存储数据的时候 防止命名污染
  namespace: 'QingNY-project',
  // 根据不同的环境，配置不同的 api
  ...EnvConfig[env]
}
