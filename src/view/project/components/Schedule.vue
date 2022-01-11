<template>
  <div class="container">
    <gantt class="left-container" :tasks="tasksData"></gantt>
  </div>
</template>

<script>
import Gantt from '@/components/Gantt.vue'

export default {
  name: 'Schedule',
  components: { Gantt },
  props: {
    tasksData: {
      type: Object
    }
  }
}
</script>

<style lang="scss">
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
</style>
