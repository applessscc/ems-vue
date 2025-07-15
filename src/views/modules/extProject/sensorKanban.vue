<template>
  <div ref="chart" style="width: 100%; height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'LineChart',
  data() {
    return {
      form: {
        startTime: '2025-07-14 00:00:00',
        endTime: '2025-07-14 23:59:59',
        deviceName: 'VSBU2-B9F4-05',
      },
      tableData: [],
      chart: null,
    };
  },
  mounted() {
    this.initChart();
    this.getSensorKanban();
  },
  methods: {
    // 初始化图表实例
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
    },

    // 获取传感器数据
    getSensorKanban() {
      const date = {
        startTime: this.form.startTime,
        endTime: this.form.endTime,
        deviceName: this.form.deviceName,
      };

      this.$http({
        url: this.$http.adornUrl('/extProject/getSensorKanban'),
        method: 'post',
        data: date,
      })
        .then((response) => {
          const data = response.data.data;
          this.tableData = data;
          console.log('传感器看板数据:', data);
          this.setChartOption(data); // 设置图表
        })
        .catch((error) => {
          console.error('请求出错:', error);
          this.$message.error('传感器看板数据请求失败，请稍后重试。');
        });
    },

    // 设置图表配置并渲染
    setChartOption(data) {
      if (!this.chart || !Array.isArray(data)) return;

      // ✅ 不限制显示个数，展示全部数据
      const xAxisData = data.map(item => item.saveTime);
      const tempSeries = data.map(item => parseFloat(item.tempValue));
      const dampSeries = data.map(item => parseFloat(item.dampValue));

      const option = {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: ['温度', '湿度'],
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            formatter: function (value) {
              const timeWithoutSeconds = value.length >= 16 ? value.substring(0, 16) : value;

              return timeWithoutSeconds;
            },
            rotate: 45,
            fontSize: 10,

          }
        },
        yAxis: [
          {
            type: 'value',
            name: '温度 (℃)',
            position: 'left',
            axisLine: {

            },
            axisLabel: {
              formatter: '{value} ℃'
            }
          },
          {
            type: 'value',
            name: '湿度 (%)',
            position: 'right',
            axisLine: {

            },
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: [
          {
            name: '温度',
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            data: tempSeries,

          },
          {
            name: '湿度',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            data: dampSeries,

          }
        ]
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
/* 可自定义样式 */
</style>
