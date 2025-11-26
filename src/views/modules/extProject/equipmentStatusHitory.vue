<template>
  <div
    ref="chart"
    :style="{ width: width, height: height }"
  ></div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios'

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

  data() {
    return {
      chartInstance: null
    }
  },

  mounted() {
    this.initChart()
    this.fetchDataAndSetChart()
  },

  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart)
      // 显示 loading
      this.chartInstance.showLoading()
    },

    async fetchDataAndSetChart() {
      try {
        const response = await axios.post('http://localhost:8080/ems-admin/extProject/getEquipmentStatusHistory', {
          equipment: "S2-G00000-003-0600",
          name: "ttemp1",
          startDate: "2025-11-25",
          endDate: "2025-11-25"
        })

        const data = response.data.data

        if (!Array.isArray(data)) {
          console.error('接口返回数据格式错误，应为数组')
          this.chartInstance.hideLoading()
          return
        }

        const times = data.map(item => item.time.split(' ')[1]) // 只取时间部分
        const pvValues = data.map(item => parseFloat(item.pv))

        const option = {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: times,
            axisLabel: {
              rotate: 45 // 防止时间标签重叠
            }
          },
          yAxis: {
            type: 'value',
            name: '温度 (°C)'
          },
          series: [
            {
              name: '实际值 (PV)',
              data: pvValues,
              type: 'line',
              smooth: true
            }
          ]
        }

        this.chartInstance.setOption(option)
      } catch (error) {
        console.error('获取设备历史数据失败:', error)
      } finally {
        this.chartInstance.hideLoading()
      }
    }
  },

  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
    window.removeEventListener('resize', this.resizeHandler)
  },

  created() {
    this.resizeHandler = () => {
      this.chartInstance && this.chartInstance.resize()
    }
    window.addEventListener('resize', this.resizeHandler)
  }
}
</script>

<style scoped>
/* 样式可根据需要调整 */
</style>