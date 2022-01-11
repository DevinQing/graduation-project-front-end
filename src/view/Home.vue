<template>
  <div class="basic-layout">
    <div class="nav-side">
      <div :class="['nav-top', isCollapse ? 'fold' : 'unfold']">
        <span class="collapse-btn" @click="isCollapse = !isCollapse"
          ><el-icon style="font-size: 28px; vertical-align: middle" :size="28"
            ><expand /></el-icon
        ></span>
        <span class="menu-top" v-show="!isCollapse">Management</span>
      </div>
      <div class="menu">
        <el-menu
          active-text-color="#FFCC33"
          background-color="#336699"
          class="el-menu-vertical-demo"
          text-color="#fff"
          :collapse="isCollapse"
          router
          :collapse-transition="false"
        >
          <menuList :menuList="routeList" />
        </el-menu>
      </div>
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="top">
        <div class="breadcrumb">
          <breadcrumb />
        </div>
        <div class="userinfo">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">{{
              userInfo.userName ? '你好，' + userInfo.userName : '未登录'
            }}</span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <span>电话：</span>{{ userInfo.mobile }}</el-dropdown-item
                >
                <el-dropdown-item>
                  <span>职务：</span>{{ userInfo.role }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <div class="wrapper">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component
              :is="Component"
              v-if="$route.meta.keepAlive"
              :key="$route.path"
              class="main-page"
            />
          </keep-alive>
          <component
            class="main-page"
            :is="Component"
            v-if="!$route.meta.keepAlive"
          />
        </router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { routeList } from '../router/index'
import MenuList from '../components/MenuList.vue'
import Breadcrumb from '../components/Breadcrumb.vue'
export default {
  name: 'Home',
  components: {
    MenuList,
    Breadcrumb
  },
  data() {
    return {
      // 注册一下获取的路由数据
      routeList: routeList,
      isCollapse: false,
      userInfo: {}
    }
  },
  methods: {
    handleCommand(command) {
      if (command == 'logout') {
        this.$store.commit('saveUserInfo', {})
        this.userInfo = {}
        this.$router.push('/login')
      }
    }
  },
  mounted() {
    this.userInfo = this.$store.state.userInfo
  }
}
</script>

<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    // width: 240px;
    height: 100%;

    background-color: #336699;
    .nav-top {
      &.fold {
        width: 64px;
      }
      &.unfold {
        width: 240px;
      }
      display: flex;
      height: 50px;
      color: #fff;
      align-items: center;
      .collapse-btn {
        flex-basis: 64px;
        cursor: pointer;
        text-align: center;
      }
      .menu-top {
        flex: 1;
        font-size: 18px;
      }
    }
    .menu {
      .el-menu-vertical-demo {
        border: 0;
      }
    }
  }
  .content-right {
    &.fold {
      margin-left: 64px;
    }
    &.unfold {
      margin-left: 240px;
    }
    .top {
      width: 100%;
      height: 50px;
      padding: 0 25px;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .breadcrumb {
      }
      .userinfo {
        cursor: pointer;
        padding-right: 20px;
        .el-dropdown-link {
          color: #336699;
          font-weight: 600;
        }
      }
    }
    .wrapper {
      width: 100%;
      padding: 20px;
      min-height: calc(100vh - 50px);
      background-color: #f1fafa;
      .main-page {
        min-height: calc(100vh - 90px);
      }
    }
  }
}
</style>
