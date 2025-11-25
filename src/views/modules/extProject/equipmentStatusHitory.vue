<template>
  <div
    ref="chart"
    :style="{
      width: width,
      height: height
    }"
  ></div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'LineChart',

  props: {
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    }
  },

  mounted() {
    const chart = echarts.init(this.$refs.chart)

    const option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line'
        }
      ]
    }

    chart.setOption(option)

    window.addEventListener('resize', () => chart.resize())
  }
}
</script>

<style scoped></style>
