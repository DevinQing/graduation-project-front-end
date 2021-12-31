import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import ElementPlus from 'element-plus'
import storage from './utils/storage'
import store from './store'
import * as icons from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
const app = createApp(App)

// 全局注册 icon 相关的组件 避免每次都需要引入
Object.keys(icons).forEach((key) => {
  app.component(key, icons[key])
})

app.config.globalProperties.$storage = storage
app.use(router).use(ElementPlus, { size: 'small' }).use(store).mount('#app')
