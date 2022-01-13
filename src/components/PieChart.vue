<template>
  <div class="main main-style" ref="mainRef">饼状图</div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'PieChart',
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
      this.myChart.setOption(option)
    },
    updateData(title, data) {
      const option = {
        title: title,
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '延期因素',
            type: 'pie',
            radius: '50%',
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },

            label: {
              show: true,
              position: 'outer',
              fontSize: 14,
              // fontWeight: 'bold',
              align: 'left',
              formatter: function (p) {
                //指示线对应文字，说明文字
                return p.data.name + '(' + p.value + ')'
              }
            }
          },
          {
            name: '延期因素',
            type: 'pie',
            radius: '50%',
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },

            label: {
              show: true,
              position: 'inner',
              fontSize: 14,
              fontWeight: 'bold',
              color: '#fff',
              align: 'left',
              formatter: function (p) {
                //指示线对应文字,百分比
                // return p.percent + '%'
                return p.percent + '%'
              }
            }
          }
        ]
      }
      this.myChart.setOption(option)
    }
  },
  mounted() {
    this.init()
  },
  updated() {
    this.updateData(this.data.title, this.data.data)
  }
}
</script>

<style lang="scss">
.main-style {
  width: 550px;
  height: 500px;
}
</style>
