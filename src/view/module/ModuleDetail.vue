<template>
  <div class="module-detail-container">
    <el-menu
      default-active="overview"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="overview">模块概览</el-menu-item>
    </el-menu>
    <div class="add-btn" v-if="data.moduleLevel !== 1">
      <el-button type="primary" @click="addModule(id)" size="large"
        >引用并创建模块</el-button
      >
      <el-button @click="fetchModuleDetailById" size="large">刷新</el-button>
    </div>
    <component :is="active" :data="data"></component>
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
      data: {
        name: 'booker'
      }
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
      console.log(val)
    },
    addModule() {
      ElMessageBox.confirm('确定引用并创建一个新模块？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          try {
            const params = { ...this.data }
            params.action = 'add'
            params.createTime = Date.now()
            params.from = this.$store.state.userInfo.project
            const res = await operateModule(params)

            if (params.moduleLevel === 2 && params.children.length > 0) {
              // 如果等于二 则需要创建多个模块
              // 这个之后再处理
            }
            ElMessageBox.alert(
              `创建成功！ 模块Id为 <strong style="color: red;">${res.moduleId}</strong>，模块名为 <strong style="color: red;">${res.moduleName}</strong>`,
              {
                dangerouslyUseHTMLString: true
              }
            )
          } catch (err) {
            ElMessage.error(err)
          }
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '您已取消该操作'
          })
        })
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
  height: 100%;
  background-color: #fff;
  .add-btn {
    padding: 15px 0 0 20px;
  }
}
</style>
