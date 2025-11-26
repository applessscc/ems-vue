<template>
    <div ref="chart" :style="{ width: width, height: height }"></div>
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
        },
        zoneName: {
            type: String,
            default: ''
        },
        equipment: {
            type: String,
            default: ''
        },
        time: {
            type: String,
            default: () => new Date().toISOString().slice(0, 10)
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
    watch: {
        zoneName(newVal, oldVal) {
            if (newVal) {
                this.fetchDataAndSetChart()
            }
        },
        equipment(newVal, oldVal) {
            if (newVal) {
                this.fetchDataAndSetChart()
            }
        }
    }
    ,

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
                const { data } = await this.$http({
                    url: this.$http.adornUrl('/extProject/getEquipmentStatusHistory'),
                    method: 'post',
                    data: this.$http.adornData({
                        equipment: this.equipment,
                        name: this.zoneName,
                        startDate: this.time.slice(0, 10),
                        endDate: this.time.slice(0, 10)
                    })
                });

                const zones = data.data.zones;

                if (!Array.isArray(zones)) {
                    console.error('接口返回数据格式错误，应为数组');
                    this.chartInstance.hideLoading();
                    return;
                }

                const times = zones.map(item => item.time.split(' ')[1]);
                const svValues = zones.map(item => parseFloat(item.sv));
                const pvValues = zones.map(item => parseFloat(item.pv));

                const option = {
                    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
                    legend: { data: ['设定值 (SV)', '实际值 (PV)'] },
                    xAxis: {
                        type: 'category',
                        data: times,
                        axisLabel: { rotate: 45, fontSize: 10 }
                    },
                    yAxis: { type: 'value', name: '温度 (°C)' },
                    series: [
                        {
                            name: '设定值 (SV)',
                            type: 'line',
                            smooth: true,
                            lineStyle: { color: '#FFA500' },
                            data: svValues
                        },
                        {
                            name: '实际值 (PV)',
                            type: 'line',
                            smooth: true,
                            lineStyle: { color: '#1E90FF' },
                            data: pvValues
                        }
                    ]
                };

                this.chartInstance.setOption(option);
            } catch (err) {
                console.error('获取设备历史数据失败:', err);
                this.chartInstance.setOption({
                    title: {
                        text: '数据加载失败',
                        x: 'center',
                        y: 'middle',
                        textStyle: { color: '#999' }
                    }
                });
            } finally {
                this.chartInstance.hideLoading();
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