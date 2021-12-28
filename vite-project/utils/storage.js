/**
 * Storage 二次封装
 */

/**
 * storage 和 cookie的对比
 * 1. 更方便的 api 可用于存储 获取 清空
 * 2. 更大的存储空间 4M
 * 3. 封装的目的是 浏览器只支持字符串或者数字的阅读，对象是无法识别的，所以我们在存储的时候需要通过封装函数来更方便的设置和获取
 */
import config from '../src/config'

export default {
  // 思路是先从浏览器中拿到json值 解析 然后存回去的时候再转化为 json
  setItem(key, val) {
    // 需要先拿到自身命名空间中的值
    let storage = this.getStorage()
    storage[key] = val
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  getStorage() {
    // 通过命名空间获取该项目存储在浏览器中的变量 防止命名变量污染
    return JSON.parse(window.localStorage.getItem(config.namespace) || '{}')
  },
  // 获取某个变量
  getItem(key) {
    return this.getStorage()[key]
  },
  removeItem(key) {
    // 依然是先获取
    let storage = this.getStorage()
    delete storage[key]
    window.localStorage.setItem(config.namespace, JSON.stringify(storage))
  },
  // 注意 删除变量应该只删除与该项目相关的变量 而不是删除该浏览器中其他存储在本地的数据
  clearAll() {
    // window.localStorage.clear()
    window.localStorage.removeItem(config.namespace)
  }
}
