<template>
  <div class="container">
    <gantt class="left-container" :tasks="tasks"></gantt>
  </div>
</template>

<script>
import Gantt from '@/components/Gantt.vue'

export default {
  name: 'Schedule',
  components: { Gantt },
  data() {
    return {
      tasks: {
        data: [
          {
            id: 1,
            text: 'Task #1',
            start_date: '2020-01-17',
            // duration: 5
            end_date: '2020-01-23'
            // progress: 0.6
          },
          {
            id: 2,
            text: 'Task #2',
            start_date: '2020-01-20',
            duration: 3.5,
            color: '#6BC172'
            // progress: 0.4
          }
        ]
        // links: [{ id: 1, source: 1, target: 2, type: '0' }]
      }
    }
  },
  methods: {}
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
