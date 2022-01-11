<template>
  <div class="module-detail-container">
    <el-menu
      default-active="overview"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="ModuleOverview">模块概览</el-menu-item>
    </el-menu>
    <component :is="active" :data="data" class="view-container"></component>
  </div>
</template>

<script>
import ModuleOverview from './components/ModuleOverview.vue'
import { getModuleDetailById, operateModule } from '../../api/module'
import { ElMessageBox, ElMessage } from 'element-plus'
export default {
  name: 'ModuleDetail',
  components: {
    ModuleOverview
  },
  data() {
    return {
      active: 'ModuleOverview',
      data: {}
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  watch: {
    id() {
      // 当进入这个页面的时候 $route 的名字肯定不是 这个
      // 这样当 进入这个页面的时候 id 改变了 则重新请求
      if (this.$route.name == 'moduleDetail') {
        this.fetchModuleDetailById()
      }
    }
  },
  methods: {
    handleSelect(val) {
      this.active = val
    },

    // 获取根据id 获取相关数据
    async fetchModuleDetailById() {
      try {
        const res = await getModuleDetailById({ id: this.id })
        this.data = res[0]
      } catch (err) {
        ElMessage.error('模块数据获取失败')
      }
    }
  },
  created() {
    this.fetchModuleDetailById()
  }
}
</script>

<style lang="scss">
.module-detail-container {
  min-height: calc(100vh - 90px);
  background-color: #fff;
  .add-btn {
    padding: 15px 0 0 20px;
  }
}
</style>
