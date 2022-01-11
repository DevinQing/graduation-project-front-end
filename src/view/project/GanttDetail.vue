<template>
  <div class="gantt-detail-container">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">计划进度</el-menu-item>
      <el-menu-item index="4">实际进度</el-menu-item>
    </el-menu>
    <div>
      <schdule
        :tasksData="$store.state.ganttData.planData"
        v-if="index == 1"
      ></schdule>
      <schdule :tasksData="$store.state.ganttData.actualData" v-else></schdule>
    </div>
  </div>
</template>

<script>
import Schdule from './components/Schedule.vue'

export default {
  name: 'GanttDetail',
  components: {
    Schdule
  },
  data() {
    return {
      activeIndex: '1',
      index: '1'
    }
  },
  methods: {
    handleSelect(val) {
      this.index = val
    }
  }
}
</script>

<style lang="scss">
.gantt-detail-container {
  background-color: #fff;
  .container {
    min-height: calc(100vh - 90px);
    min-width: 100%;
    overflow-x: auto;
  }
  .left-container {
    overflow: hidden;
    position: relative;
    min-height: calc(100vh - 90px);
    overflow-x: auto;
  }
}
</style>
