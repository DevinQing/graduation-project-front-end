import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import ElementPlus from 'element-plus'
import storage from '../utils/storage'
import 'element-plus/dist/index.css'
const app = createApp(App)

app.config.globalProperties.$storage = storage
app.use(router).use(ElementPlus, { size: 'small' }).mount('#app')
