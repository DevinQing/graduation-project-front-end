<template>
  <div class="gantt-detail-container">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="plan">计划进度</el-menu-item>
      <el-menu-item index="actual">实际进度</el-menu-item>
    </el-menu>
    <div>
      <schdule
        :tasksData="$store.state.ganttData.planData"
        v-if="index == 'plan'"
      ></schdule>
      <schdule
        :tasksData="$store.state.ganttData.actualData"
        v-else-if="index == 'actual'"
      ></schdule>
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
      activeIndex: 'plan',
      index: 'plan'
    }
  },
  methods: {
    handleSelect(val) {
      this.index = val
      console.log('val', val)
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
