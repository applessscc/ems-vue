<template>
  <div ref="chart" style="width: 100%; height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'LineChart',
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {

    initChart() {
      this.chart = echarts.init(this.$refs.chart);

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
            name: '数据A',
            type: 'line',
            data: [150, 230, 224, 218, 135, 147, 260]
          },
          {
            name: '数据B',
            type: 'line',
            data: [120, 200, 190, 210, 180, 160, 250]
          }
        ],
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['数据A', '数据B']
        }
      };

      this.chart.setOption(option);
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>

<style scoped>
/* 样式可根据需要调整 */
</style>
