import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    name: 'home',
    path: '/',
    meta: {
      title: '首页'
    },
    component: () => import('../view/Home.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
