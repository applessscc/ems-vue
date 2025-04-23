<template>
    <div>

        <div class="header">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="Date" style="margin-right: 50px;">
                    <el-date-picker v-model="formInline.createTime" type="date" placeholder="Select date"
                        value-format="yyyy-MM-dd" style="width: 150px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="Device">
                    <el-select v-model="formInline.appId" placeholder="Select device" filterable style="width: 150px">
                        <el-option v-for="airDevice in airDevices" :key="airDevice.appId" :label="airDevice.name"
                            :value="airDevice.appId">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>

        <div id="container">
        </div>

    </div>
</template>

<script>
import * as echarts from 'echarts';  // 导入 echarts
import { name } from 'file-loader';

export default {
    name: 'MyChart',
    watch: {
        "formInline.createTime"(n, o) {
            this.getAirStatusKanban();
        },
        "formInline.appId"(n, o) {
            this.getAirStatusKanban();
        }
    },

    data() {
        return {
            airDevices: [],
            formInline: {
                appId: '',
                createTime: new Date().toISOString().split('T')[0],
            },
            chartData: [
                { createTime: '00:00', t: 20, status: 'on', h: 60 },
                { createTime: '01:00', t: 25, status: 'off', h: 55 },
                { createTime: '02:00', t: 30, status: 'on', h: 50 },
                { createTime: '12:00', t: 30, status: 'on', h: 50 },
                { createTime: '18:00', t: 26, status: 'off', h: 50 },
                // 继续你的数据...
            ]
        };
    },
    created() {
    },
    mounted() {

        this.$nextTick(() => {
            this.getAppInfoList();
            this.getAirStatusKanban();
        });
    },
    methods: {
        getAppInfoList() {
            const params = {
            };
            this.$http({
                url: this.$http.adornUrl('/extProject/getAppInfoList'),
                method: 'get',
                params: params,
            }).then((response) => {
                const data = response.data.data;
                if (data) {
                    this.airDevices = data.map(item => ({
                        appId: item.appId,
                        name: item.name,
                    }));
                }
                if (this.airDevices.length > 0) {
                    this.formInline.appId = this.airDevices[0].appId;
                }
            }).catch((error) => {
                console.log('error', error);
            });
        },
        onSubmit() {
            this.getAirStatusKanban();
        },
        formatTime(date) {
            const d = new Date(date);
            const hours = String(d.getHours()).padStart(2, '0'); // 补齐小时
            const minutes = String(d.getMinutes()).padStart(2, '0'); // 补齐分钟
            console.info("date:", date, `${hours}:${minutes}`);
            return `${hours}:${minutes}`;
        },
        initChart() {
            var dom = document.getElementById("container");
            var myChart = echarts.init(dom);

            // x轴
            const allTimes = this.chartData.map(item => this.formatTime(item.createTime));

            // y轴（温度）
            const temperatures = allTimes.map(time => {
                const data = this.chartData.find(item => this.formatTime(item.createTime) === time);
                return data ? data.t : null;  // 如果该时间有数据，使用温度值，否则使用 null
            });

            // y轴（开关状态）
            const statusList = this.chartData.map(item => {
                const data = item.status = item.status.includes('on/') ? 'on' : item.status.includes('off/') ? 'off' : item.status;  // 确保 status 只有 'on' 或 'off'
                return data;  // 如果该时间有数据，使用开关值，否则使用 null
            });

            // y轴（人流量）

            var option = {
                legend: {
                    data: ['temperature', 'status'],
                },

                title: {
                    left: '6%',
                },


                // 悬浮提示框
                tooltip: {
                    trigger: 'axis',
                    formatter: function (params) {
                        // 过滤掉 null 值，确保 tooltip 只显示有效数据
                        const dataIndex = params[0].dataIndex;
                        const data = this.chartData[dataIndex];
                        if (!data) return ''; // 如果没有数据，返回空字符串，避免显示无效信息
                        return `
                appId: ${data.appId} <br>
                datetime: ${data.createTime} <br>
                t: ${data.t !== null ? data.t + ' °C' : ''} <br>
                h: ${data.h !== null ? data.h + '%' : ''} <br>
                status: ${data.status !== null ? data.status : '' }<br>
                mode: ${data.mode !== null ? data.mode : '' }<br>
                handle: ${data.handle !== null ? data.handle : '' }
              `;
                    }.bind(this),
                },
                xAxis: {
                    type: 'category',
                    data: allTimes  // 使用 24 小时的时间刻度
                },

                // y轴（温度）
                yAxis: [
                    {
                        type: 'value',
                        name: 'temperature (°C)',
                        position: 'left',
                        axisLabel: {
                            formatter: '{value} °C'
                        },

                    },
                    // y轴（开关状态）
                    {
                        type: 'category',
                        name: 'on/off',
                        position: 'left',
                        data: ['off', 'on']
                    }
                ],
                grid: {
                    top: '15%',
                    bottom: '10%',
                    containLabel: true
                },
                series: [
                    {
                        name: 'temperature',
                        data: temperatures,
                        type: 'line',
                        smooth: true,
                        yAxisIndex: 0,
                        lineStyle: {
                            type: 'dashed'
                        },
                        connectNulls: true  // 设置为 true 以确保跳过 null 值并连线
                    },
                    {
                        name: 'status',
                        data: statusList,
                        type: 'line',
                        smooth: false,
                        yAxisIndex: 1,
                        lineStyle: {
                            type: 'dashed'
                        },
                        itemStyle: {
                            color: function (params) {
                                return params.value === 'on' ? 'green' : 'red';
                            }
                        },
                        connectNulls: true  // 设置为 true 以确保跳过 null 值并连线
                    }
                ]
            };

            myChart.setOption(option);
        },
        getAirStatusKanban() {
            this.$http({
                url: this.$http.adornUrl('/extProject/getAirStatusKanban'),
                method: 'post',
                data: {
                    appId: this.formInline.appId,
                    createTime: this.formInline.createTime,
                }
            }).then((response) => {
                if (response.data.code === 200) {
                    this.chartData = response.data.data.airStatusLogList;
                    console.log("this.chartData:", this.chartData);
                    this.initChart(); // 更新图表数据
                } else {
                    this.$message.error(response.data.msg);
                }
            }).catch((error) => {
                console.error(error);
            })
        }
    }
};
</script>

<style scoped>
#container {
    width: 100%;
    height: 400px;
}

.header {
    display: flex;
    margin: 30px;
    justify-content: center;

}
</style>