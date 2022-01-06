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
    name: 'user',
    path: '/user',
    meta: {
      title: '用户管理'
    },
    component: () => import('../view/Home.vue'),
    children: [
      {
        // 命名路由的方式主要是为了方便跳转
        name: 'userInfo',
        path: '/user/info',
        meta: {
          title: '用户信息'
        },
        component: () => import('../view/user/UserInfo.vue')
      }
    ]
  },
  {
    name: 'project',
    path: '/project',
    meta: {
      title: '项目管理'
    },
    component: () => import('../view/Home.vue'),
    children: [
      {
        // 命名路由的方式主要是为了方便跳转
        name: 'projectMessage',
        path: '/project/message',
        meta: {
          title: '项目信息'
        },
        component: () => import('../view/project/ProjectMessage.vue')
      },
      {
        // 命名路由的方式主要是为了方便跳转
        name: 'projectModel',
        path: '/project/model',
        meta: {
          title: '项目模型'
        },
        component: () => import('../view/project/ProjectModel.vue')
      },
      {
        // 命名路由的方式主要是为了方便跳转
        name: 'projectProgress',
        path: '/project/progress',
        meta: {
          title: '项目进度'
        },
        component: () => import('../view/user/UserInfo.vue')
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
    children: [
      {
        // 命名路由的方式主要是为了方便跳转
        name: 'levelOneModule',
        path: '/module/levelone',
        meta: {
          title: '一级模块'
        },
        component: () => import('../view/module/LevelOne.vue')
      },
      {
        name: 'levelTwoModule',
        path: '/module/leveltwo',
        meta: {
          title: '二级模块'
        },
        component: () => import('../view/module/LevelTwo.vue')
      },
      {
        name: 'levelThreeModule',
        path: '/module/levelthree',
        meta: {
          title: '三级模块'
        },
        component: () => import('../view/module/LevelThree.vue')
      },
      {
        name: 'moduleDetail',
        path: '/module/detail',
        meta: {
          title: '模块细节',
          hidden: true
        },
        component: () => import('../view/module/ModuleDetail.vue')
      }
    ]
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
