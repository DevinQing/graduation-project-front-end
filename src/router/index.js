import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    name: 'home',
    path: '/',
    meta: {
      title: '首页'
    },
    component: () => import('../view/Home.vue'),
    redirect: '/welcome',
    children: [
      {
        name: 'welcome',
        path: 'welcome',
        meta: {
          title: '欢迎页面'
        },
        component: () => import('../view/Welcome.vue')
      }
    ]
  },
  {
    name: 'login',
    path: '/login',
    meta: {
      title: '登录'
    },
    component: () => import('../view/Login.vue')
  },
  {
    name: 'message',
    path: '/message',
    meta: {
      title: '信息管理'
    },
    component: () => import('../view/Home.vue'),
    children: [
      {
        // 命名路由的方式主要是为了方便跳转
        name: 'project',
        path: '/message/project',
        meta: {
          title: '项目信息'
        },
        component: () => import('../view/Welcome.vue')
      },
      {
        // 命名路由的方式主要是为了方便跳转
        name: 'users',
        path: '/message/users',
        meta: {
          title: '用户信息'
        },
        component: () => import('../view/Welcome.vue')
      }
    ]
  },
  {
    name: 'module',
    path: '/module',
    meta: {
      title: '模块管理'
    },
    component: () => import('../view/Home.vue'),
    children: []
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export const routeList = routes.filter((item, index) => {
  return index > 1
})
export default router
