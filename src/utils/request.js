/**
 * axios 二次封装
 * 二次封装的目的还是很简单，就是将常用的需要多个步骤使用的东西封装成一步，减少重复性的工作
 */
import axios from 'axios'
import config from '../config'
import { ElMessage } from 'element-plus'
import router from '../router'
import storage from './storage'

const TOKEN_INVALID = 'Token认证失败， 请重新登陆'
const NETWORK_ERROR = '网络错误，请稍后重试'

// 首先创建 axios 实例对象，添加全局配置
const service = axios.create({
  // 请求的 baseURL 地址，这样不用每次都发送
  // 在这里添加的参数可以在 service.defaults中取到
  // 这个 service 被封装成了一个构造函数
  // 这个 baseApi 会根据项目的环境
  baseURL: config.baseApi,
  timeout: 8000
})

// 请求拦截
service.interceptors.request.use((req) => {
  const headers = req.headers
  const { token } = storage.getItem('userInfo')
  // 判断请求权限
  // 发起请求的时候必须带上 token 这是 jwt 模式用于登录认证的
  if (!headers.Authorization) {
    headers.Authorization = 'Bearer ' + token
  }
  return req
})

// 响应拦截
service.interceptors.response.use((res) => {
  const { code, data, msg } = res.data
  if (code === 200) {
    return data
  } else if (code === 400) {
    // 4+ 一般是客户端出错
    // 当 400 的时候，我们定义为token无效
    ElMessage.error(TOKEN_INVALID)
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return Promise.reject(TOKEN_INVALID)
  } else {
    ElMessage.error(msg || NETWORK_ERROR)
    return Promise.reject(msg || NETWORK_ERROR)
  }
})

/**
 * 请求发起的核心函数
 */
function request(options) {
  // 默认 get 请求
  options.method = options.method || 'get'
  if (options.method.toLowerCase() === 'get') {
    // 不用去区分 'data' 还是 'params'
    options.params = options.data
  }

  // 防止在线上请求到 mock 地址
  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = options.mock ? config.mockApi : config.baseApi
  }
  return service(options)
}

// 封装一下常用的四个请求方法
;['get', 'post', 'delete', 'patch'].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options
    })
  }
})
export default request
