<template>
  <div class="main main-style" ref="mainRef"></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'Histogram',
  props: {
    data: {
      type: Object
    }
  },
  data() {
    return {
      myChart: null
    }
  },
  methods: {
    init() {
      const mainRef = this.$refs['mainRef']
      this.myChart = echarts.init(mainRef)
      const option = {}
      this.myChart.setOption(option, true)
    },
    updateData(data, title) {
      const option = {
        title,
        color: '#73c0de',
        xAxis: {
          type: 'category',
          data: data.xData,
          name: '活动'
        },
        yAxis: {
          type: 'value',
          name: '延迟天数'
        },
        series: [
          {
            data: data.yData,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)'
            },

            label: {
              formatter: '{c}' + '天',
              show: true
            }
          }
        ]
      }
      this.myChart.setOption(option, true)
    }
  },
  mounted() {
    this.init()
  },
  updated() {
    this.updateData(this.data.data, this.data.title)
  }
}
</script>

<style lang="scss">
.main-style {
  width: 550px;
  height: 500px;
}
</style>
