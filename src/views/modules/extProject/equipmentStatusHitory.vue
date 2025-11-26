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
      chartInstance: null,
      resizeHandler: null
    }
  },

  mounted() {
    this.initChart()
    this.fetchDataAndSetChart()
  },

  methods: {
    initChart() {
      this.chartInstance = echarts.init(this.$refs.chart)
      this.chartInstance.showLoading({
        text: '加载中...',
        color: '#409EFF'
      })
    },

    async fetchDataAndSetChart() {
      try {
        const response = await axios.post('http://localhost:8080/ems-admin/extProject/getEquipmentStatusHistory', {
          equipment: "S2-G00000-003-0600",
          name: "ttemp1",
          startDate: "2025-11-25",
          endDate: "2025-11-25"
        })

        const data = response.data.data.zones

        if (!Array.isArray(data)) {
          console.error('接口返回数据格式错误，应为数组')
          this.chartInstance.hideLoading()
          return
        }

        // 提取时间、SV、PV
        const times = data.map(item => item.time.split(' ')[1]) // 如 "03:12:43"
        const svValues = data.map(item => parseFloat(item.sv))
        const pvValues = data.map(item => parseFloat(item.pv))

        const option = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          legend: {
            data: ['设定值 (SV)', '实际值 (PV)']
          },
          xAxis: {
            type: 'category',
            data: times,
            axisLabel: {
              rotate: 45,
              fontSize: 10
            }
          },
          yAxis: {
            type: 'value',
            name: '温度 (°C)'
          },
          series: [
            {
              name: '设定值 (SV)',
              type: 'line',
              smooth: true,
              lineStyle: {
                color: '#FFA500' // 橙色
              },
              data: svValues
            },
            {
              name: '实际值 (PV)',
              type: 'line',
              smooth: true,
              lineStyle: {
                color: '#1E90FF' // 道奇蓝
              },
              data: pvValues
            }
          ]
        }

        this.chartInstance.setOption(option)
      } catch (error) {
        console.error('获取设备历史数据失败:', error)
        this.chartInstance.setOption({
          title: {
            text: '数据加载失败',
            x: 'center',
            y: 'middle',
            textStyle: { color: '#999' }
          }
        })
      } finally {
        this.chartInstance.hideLoading()
      }
    }
  },

  created() {
    this.resizeHandler = () => {
      if (this.chartInstance) {
        this.chartInstance.resize()
      }
    }
    window.addEventListener('resize', this.resizeHandler)
  },

  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.dispose()
    }
    window.removeEventListener('resize', this.resizeHandler)
  }
}
</script>

<style scoped>
/* 可选：添加一些基础样式 */
</style>