<template>
  <div ref="gantt"></div>
</template>

<script>
import '../../node_modules/dhtmlx-gantt/codebase/dhtmlxgantt.css'
import { gantt } from 'dhtmlx-gantt'
export default {
  name: 'gantt',
  props: {
    tasks: {
      type: Object,
      default() {
        return { data: [], links: [] }
      }
    }
  },

  mounted: function () {
    gantt.config.xml_date = '%Y-%m-%d'
    gantt.i18n.setLocale('cn')
    gantt.init(this.$refs.gantt)
    gantt.parse(this.$props.tasks)
    gantt.config.readonly = true
    gantt.config.subscales = [
      {
        unit: 'year',
        step: 1,
        date: '%Y'
      }
    ]
    // gantt.config.date_scale = 'day'
    // 设置 日期的步长
    gantt.config.scale_unit = 'week'
    // 甘特图左边说明
    gantt.templates.leftside_text = function (start, end, task) {
      return task.duration + ' days'
    }
    gantt.config.details_on_create = true
    gantt.config.columns = [
      { align: 'center', name: 'text', label: '任务名称' },
      { align: 'center', name: 'start_date', label: '开始时间' },
      { align: 'center', name: 'duration', label: '持续时间' },
      { align: 'center', name: 'end_date', label: '结束时间' }
    ]
  }
}
</script>

<style></style>
