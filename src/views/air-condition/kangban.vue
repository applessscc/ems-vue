<template>
    <div>

        <div class="header">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <el-form-item label="Date" style="margin-right: 50px;">
                    <el-date-picker v-model="formInline.createTime" type="date" placeholder="Select date"
                        value-format="yyyy-MM-dd" style="width: 150px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="Device" style="margin-right: 50px;">
                    <el-select v-model="formInline.appId" placeholder="Select device" filterable style="width: 150px">
                        <el-option v-for="airDevice in airDevices" :key="airDevice.appId" :label="airDevice.name"
                            :value="airDevice.appId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="AirCondition">
                    <el-select v-model="formInline.id" placeholder="Select device" filterable style="width: 150px">
                        <el-option v-for="air in airCondition" :key="air.id" :label="air.id" :value="air.id">
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
import _ from 'lodash';

export default {
    name: 'MyChart',
    watch: {
        "formInline.createTime"(n, o) {
            this.getAirStatusKanban();
        },
        "formInline.appId"(n, o) {
            this.getAirStatusKanban();
        },
        "formInline.id"(n, o) {
            this.getAirStatusKanban();
        }
    },

    data() {
        return {
            airDevices: [],
            airCondition: [],
            formInline: {
                appId: '',
                id: '',
                createTime: new Date().toISOString().split('T')[0],
            },
            vmsEntityList: [],
            airStatusLogList: [],
            airconStatuses: [],
            xdate: [],

        };
    },
    created() {
    },
    mounted() {

        this.intervalId = setInterval(() => {
            this.getAirStatusKanban();

        }, 20000); // 5000 毫秒，即 5 秒
        this.$nextTick(() => {
            this.getAppInfoList();
            this.getAirCondition();
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
        getAirCondition() {
            const params = {
            };
            this.$http({
                url: this.$http.adornUrl('/extProject/getAirCondition'),
                method: 'get',
                params: params,
            }).then((response) => {
                const data = response.data.data;
                if (data) {
                    this.airCondition = data.map(item => ({
                        id: item.id,
                    }));
                }
                if (this.airCondition.length > 0) {
                    this.formInline.id = this.airCondition[0].id;
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
            return `${hours}:${minutes}`;
        },
        initChart() {
            var dom = document.getElementById("container");
            var myChart = echarts.init(dom);



            // const airGroupByAppId = _.groupBy(this.airStatusLogList, 'appId');
            // for (const airObject in airGroupByAppId) {
            //     const air = airGroupByAppId[appId];
            // }

            // x轴
            const allTimes = this.xdate.map(item => this.formatTime(item));

            // y轴（温度）
            const temperatures = allTimes.map(time => {
                const data = this.airStatusLogList.find(item => this.formatTime(item.createTime) === time);
                return data ? data.t : null;  // 如果该时间有数据，使用温度值，否则使用 null
            });

            // y轴（开关状态）
            const statusList = allTimes.map(time => {
                const data = this.airStatusLogList.find(item => this.formatTime(item.createTime) === time);
                if (!data) return null;
                const status = data.status.includes('on/') ? 'on' :
                    data.status.includes('off/') ? 'off' :
                        data.status;
                return status;
            });

            // y轴（人流量）
            const curentTotal = allTimes.map(time => {
                const data = this.vmsEntityList.find(item => this.formatTime(item.createTime) === time);
                return data ? data.currentTotal : null;  // 如果该时间有数据，使用温度值，否则使用 null
            });
            const filteredValues = curentTotal.filter(value => value !== null);
            const flowMaxValue = Math.max(...filteredValues) ;
            const flowMinValue = Math.min(...filteredValues);

            // y轴（空调状态）
            const airStatusList = allTimes.map(time => {
                const data = this.airconStatuses.find(item => this.formatTime(item.time) === time);
                return data ? data.status : null;
            });

            var option = {
                legend: {
                    color: ['#FFF1A1', '#FFDA4D', '#FFB11A', '#FF8C00']
                },

                title: {
                    left: '6%',
                },

                visualMap: [

                    {
                        seriesIndex: 1,      // 适配 airStatus
                        type: 'continuous',  // 使用 continuous 类型
                        dimension: 1,         // 适配 y 轴
                        inRange: {
                            color: ['red', 'green']
                        },
                        min: 0,
                        max: 1,
                        show: false,           // 不显示 visualMap

                    },
                    {
                        show: false,
                        type: 'continuous',
                        inRange: {
                            color: ['#FFF9E6', '#FFEC99', '#FFDD66', '#FFCC33']
                        },
                        seriesIndex: 2,
                        min: flowMinValue,
                        max: flowMaxValue,
                    },

                    {
                        seriesIndex: 3,      // 适配 airStatus
                        type: 'continuous',  // 使用 continuous 类型
                        dimension: 1,         // 适配 y 轴
                        data: [0, 1],  // 映射的数据类别

                        inRange: {
                            color: ['red', 'green']
                        },
                        min: 0,
                        max: 1,
                        show: false,           // 不显示 visualMap
                    }

                ],
                // 悬浮提示框
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter: function (params) {
                        let tooltipContent = `<span style="font-family: 'Your Fancy Time Font', sans-serif; color: #333; font-weight: bold;">时间:</span> ${this.xdate[params[0].dataIndex]} <br>`;
                        params.forEach(item => {
                            console.log("item", item.seriesName);
                            if (item.seriesName === 'temperature') {
                                const data = this.airStatusLogList.find(aItem => this.formatTime(aItem.createTime) === item.axisValue);
                                if (data) {
                                    tooltipContent += `<span style="font-family: 'Your Fancy Temperature Font', serif; color: #007bff;">温度:</span> ${data.t !== null ? data.t + ' °C' : ''} <br>`;
                                    tooltipContent += `<span style="font-family: 'Your Fancy Humidity Font', sans-serif; color: #28a745;">湿度:</span> ${data.h !== null ? data.h + '%' : ''} <br>`;
                                    tooltipContent += `<span style="font-family: 'Your Fancy Control Font', monospace; color: #dc3545;">控制状态:</span> ${data.status !== null ? data.status : ''} <br>`;
                                    tooltipContent += `<span style="font-family: 'Your Fancy Mode Font', cursive; color: #ffc107;">模式:</span> ${data.mode !== null ? data.mode : ''} <br>`;
                                    tooltipContent += `<span style="font-family: 'Your Fancy Operation Font', fantasy; color: #6c757d;">操作:</span> ${data.handle !== null ? data.handle : ''} <br>`;
                                }
                            } else if (item.seriesName === 'flowTotal') {
                                const data = this.vmsEntityList.find(aItem => this.formatTime(aItem.createTime) === item.axisValue);
                                if (data) {
                                    tooltipContent += `<span style="font-family: 'Your Fancy Flow Font', sans-serif; color: #17a2b8;">人流量:</span> ${data.currentTotal !== null ? data.currentTotal : ''} <br>`;
                                }
                            } else if (item.seriesName === 'airStatus') {
                                const data = this.airconStatuses.find(aItem => this.formatTime(aItem.time) === item.axisValue);
                                if (data) {
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; color: #fd7e14;">空调实时开关状态:</span> ${data.status !== null ? data.status : ''} <br>`;
                                }
                            }
                        });

                        return tooltipContent;
                    }.bind(this),
                },
                xAxis: {
                    type: 'category',
                    data: allTimes,
                    axisLabel: {
                        // formatter: function (value, index) {
                        //     // 根据索引或其他条件隐藏某些标签
                        //     if (index % 2 === 0) {
                        //         return value;  // 显示标签
                        //     } else {
                        //         return '';  // 隐藏标签
                        //     }
                        // },
                        rotate: 45
                    },
                    gridIndex: 0

                },

                yAxis: [
                    // y轴（温度）
                    {
                        type: 'value',
                        name: 't (°C)',
                        position: 'left',
                        axisLabel: {
                            formatter: '{value} °C'
                        },
                        gridIndex: 0,
                        offset: 0
                    },
                    // y轴（开关状态）
                    {
                        type: 'category',
                        name: 'airConStatus',
                        position: 'left',
                        data: ['off', 'on'],
                        gridIndex: 0,
                        offset: 60
                    },

                    // y轴（人流量）
                    {
                        type: 'value',
                        name: 'total',
                        position: 'reight',
                        gridIndex: 0,
                        offset: 0,
                        axisLabel: {
                            formatter: '{value} people'
                        },
                    },

                    // y轴（空调状态）
                    {
                        type: 'category',
                        name: 'airStatus',
                        position: 'left',
                        data: ['0', '', '1'],
                        gridIndex: 0,
                        offset: 125
                    },

                ],
                grid: {
                    top: '10%',
                    bottom: '10%',
                    containLabel: true,
                },
                series: [
                    {
                        name: 'temperature',
                        data: temperatures,
                        type: 'line',
                        smooth: true,
                        yAxisIndex: 0,
                        lineStyle: {
                            type: 'solid'
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
                            type: 'solid'
                        },
                        itemStyle: {
                            color: function (params) {
                                return params.value === 'on' ? 'green' : 'red';
                            }
                        },
                        connectNulls: true  // 设置为 true 以确保跳过 null 值并连线
                    },
                    {
                        name: 'flowTotal',
                        data: curentTotal,
                        type: 'line',
                        smooth: false,
                        yAxisIndex: 2,
                        lineStyle: {
                            type: 'solid'
                        },
                        xAxisIndex: 0,
                        connectNulls: true  // 设置为 true 以确保跳过 null 值并连线
                    },

                    {
                        name: 'airStatus',
                        data: airStatusList,
                        type: 'line',
                        smooth: false,
                        yAxisIndex: 3,
                        xAxisIndex: 0,
                        lineStyle: {
                            type: 'solid'
                        },

                        connectNulls: true
                    },

                ],
            };

            myChart.setOption(option);
        },
        getAirStatusKanban() {
            this.$http({
                url: this.$http.adornUrl('/extProject/getAirStatusKanban'),
                method: 'post',
                data: {
                    appId: this.formInline.appId,
                    id: this.formInline.id,
                    createTime: this.formInline.createTime,
                }
            }).then((response) => {
                if (response.data.code === 200) {
                    this.airStatusLogList = response.data.data.airStatusLogList;
                    this.vmsEntityList = response.data.data.vmsEntityList;
                    this.airconStatuses = response.data.data.airconStatuses;
                    this.xdate = response.data.data.xdate;
                    console.log("this.airStatusLogList:", this.airStatusLogList);
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
    height: 700px;
}

.header {
    display: flex;
    margin: 30px;
    justify-content: center;

}
</style>