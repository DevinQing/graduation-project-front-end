<template>
  <div class="project-message-container">
    <el-menu
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      :default-active="index"
    >
      <el-menu-item index="Overview">项目概况</el-menu-item>
      <el-menu-item index="Geology">项目地质报告</el-menu-item>
      <el-menu-item index="Devise">项目设计信息</el-menu-item>
      <el-menu-item index="Construction">施工信息</el-menu-item>
    </el-menu>
    <div class="upload-file">
      <el-upload
        ref="upload"
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        :auto-upload="false"
      >
        <template #trigger>
          <el-button type="primary" style="margin-right: 20px"
            >文件选择</el-button
          >
        </template>
        <el-button class="ml-3" type="success" @click="submitUpload"
          >上传</el-button
        >
      </el-upload>
    </div>
    <div class="project-content">
      <keep-alive>
        <component :is="index"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { ElMessage } from 'element-plus'
import { uploadProject } from '../../api/project'
import Overview from './components/Overview.vue'
import Geology from './components/Geology.vue'
import Devise from './components/Devise.vue'
import Construction from './components/Construction.vue'
export default {
  name: 'ProjectMessage',
  components: {
    Overview,
    Geology,
    Devise,
    Construction
  },
  data() {
    return {
      fileList: [],
      index: 'Overview'
    }
  },
  methods: {
    async handleSelect(val) {
      this.index = val
    },
    async submitUpload() {
      try {
        await uploadProject({ file: 'file' })
        ElMessage.success('文件上传成功')
      } catch (err) {
        ElMessage.error('文件上传失败')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.project-message-container {
  background-color: #fff;
  .upload-file {
    padding: 15px;
  }
}
</style>
