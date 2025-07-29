<template>
    <div>

        <div class="header">

            <el-form :inline="true" :model="formInline" class="demo-form-inline">

                <el-form-item label="实时数据" style="margin-right: 20px;">
                    <el-switch v-model="realtimeSwitch" active-color="#13ce66" inactive-color="#409EFF">
                    </el-switch>
                </el-form-item>

                <el-form-item label="Date" style="margin-right: 20px;">
                    <el-date-picker v-model="formInline.createTime" type="date" placeholder="Select date"
                        value-format="yyyy-MM-dd" style="width: 150px">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="flowData" style="margin-right: 20px;">
                    <el-switch v-model="formInline.flowSwitch" active-color="#13ce66" inactive-color="#ff4949">
                    </el-switch>
                </el-form-item>

                <el-form-item label="Device" style="margin-right: 20px;">
                    <el-select v-model="formInline.appId" placeholder="Select device" style="width: 150px" clearable>
                        <el-option v-for="airDevice in airDevices" :key="airDevice.appId" :label="airDevice.name"
                            :value="airDevice.appId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="AirCondition" style="margin-right: 20px;">
                    <el-select v-model="formInline.id" placeholder="Select device" style="width: 150px" clearable>
                        <el-option v-for="air in airCondition" :key="air.id" :label="air.id" :value="air.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="group" style="margin-right: 20px;">
                    <el-select v-model="formInline.groupId" placeholder="select group" style="width: 150px" clearable>
                        <el-option v-for="groupId in groupIds" :key="groupId.groupId" :label="groupId.groupName"
                            :value="groupId.groupId">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="sensor" style="margin-right: 20px;">
                    <el-select v-model="formInline.iotThRecordId" placeholder="select sensor" clearable filterable
                        style="width: 170px">
                        <el-option v-for="device in devices" :key="device.id" :label="device.id" :value="device.id">
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
import { data } from 'jquery';
import _ from 'lodash';

export default {
    name: 'MyChart',
    watch: {


        'realtimeSwitch'(newVal) {
            if (newVal) {
                // 开启实时，开启定时器
                                this.getAirStatusKanban();

                this.intervalId = setInterval(() => {
                    this.getAirStatusKanban();
                }, 20000);
            } else {
                // 关闭实时，清除定时器
                if (this.intervalId) {
                    clearInterval(this.intervalId);
                    this.intervalId = null;
                }
            }
        },
        "formInline.createTime"(n, o) {
            this.getAirStatusKanban();
        },
        "formInline.appId"(n, o) {
            this.getAirStatusKanban();
        },
        "formInline.id"(n, o) {
            this.getAirStatusKanban();
        },
        "formInline.groupId"(n, o) {
            this.getAirStatusKanban();
        },
        "formInline.iotThRecordId"(n, o) {
            this.getAirStatusKanban();
        },

        "formInline.flowSwitch"(n, o) {
            this.getAirStatusKanban();
        },

        '$route.query.groupId': function (n, o) {
            this.formInline.groupId = n;
            this.getAirStatusKanban();
        },
        '$route.query.groupName': function (n, o) {
            this.formInline.id = n;
            this.getAirStatusKanban();
        }

    },

    data() {
        return {
            realtimeSwitch: true,
            intervalId: null,
            airDevices: [],
            groupIds: [],
            devices: [],
            airCondition: [],
            formInline: {
                appId: '',
                id: this.$route.query.groupName,
                groupId: this.$route.query.groupId,
                iotThRecordId: '',
                flowSwitch: true,
                createTime: new Date().toISOString().split('T')[0],
            },
            vmsEntityList: [],
            airStatusLogList: [],
            airconStatuses: [],
            thKvRecordTasks: [],
            thRecords: [],
            thRecords2: [],
            thRecords3: [],
            xdate: [],
            myChart: null,

        };
    },
    created() {

    },
    beforeDestroy() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.getThKvRecordGroups();
            this.getThRecord();
            this.getAppInfoList();
            this.getAirCondition();
            this.getAirStatusKanban();
        });

        if (this.realtimeSwitch) {
            this.intervalId = setInterval(() => {
                this.getAirStatusKanban();
            }, 20000);
        }
    },
    methods: {
        getThRecord() {
            const params = {
            };
            this.$http({
                url: this.$http.adornUrl('/extProject/getThRecord'),
                method: 'get',
                params: params,
            }).then((response) => {
                const data = response.data.data;
                if (data) {
                    this.devices = data.map(item => ({
                        id: item.id,
                        sbu: item.sbu,
                    }));
                    console.log('devices', this.devices);
                    const defaultDevice = this.devices.find(device => device.id === 'airtemp')
                    this.formInline.iotThRecordId = defaultDevice ? defaultDevice.id : '';
                }
            }).catch((error) => {
                console.log('error', error);
            });
        },
        getThKvRecordGroups() {
            const params = {
            };

            this.$http({
                url: this.$http.adornUrl('/extProject/getThKvRecord'),
                method: 'post',
                data: params,
            }).then((response) => {
                const data = response.data.data;
                this.groupIds = data.map(item => ({
                    groupId: item.groupId,
                    groupName: item.groupName
                }));
                this.groupIds = [...new Map(this.groupIds.map(item => [item.groupId, item])).values()];
            }).catch((error) => {
                console.log('Error:', error);
            });
        },

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
            this.myChart = echarts.init(dom);


            const series = [];

            const legendData = [];
            // x轴
            const allTimes = this.xdate.map(item => this.formatTime(item));

            // y轴（温度）
            const temperatures = allTimes.map(time => {
                const data = this.airStatusLogList.find(item => this.formatTime(item.createTime) === time);
                return data ? data.t : null;  // 如果该时间有数据，使用温度值，否则使用 null
            });
            if (this.airStatusLogList.length > 0) {
                legendData.push('temperature');
                series.push({
                    name: 'temperature',
                    data: temperatures,
                    type: 'line',
                    smooth: false,
                    yAxisIndex: 0,
                    xAxisIndex: 0,
                    lineStyle: {
                        color: '#1E90FF',  // 深蓝色
                        type: 'solid'
                    },
                    itemStyle: {
                        color: '#1E90FF'
                    },
                    connectNulls: true
                })
            }

            // y轴（开关状态）
            const statusList = allTimes.map(time => {
                const data = this.airStatusLogList.find(item => this.formatTime(item.createTime) === time);
                if (!data) return null;
                const status = data.status.includes('on/') ? 'on' :
                    data.status.includes('off/') ? 'off' :
                        data.status;
                return status;
            });
            if (this.airStatusLogList.length > 0) {
                legendData.push('airConStatus');
                series.push({
                    name: 'airConStatus',
                    data: statusList,
                    type: 'line',
                    smooth: false,
                    yAxisIndex: 1,
                    xAxisIndex: 0,
                    lineStyle: {
                        color: '#32CD32',  // 石灰绿
                        type: 'solid'
                    },
                    itemStyle: {
                        color: '#32CD32',
                    },
                    connectNulls: true
                });
            }

            // y轴（人流量）
            const curentTotal = allTimes.map(time => {
                const data = this.vmsEntityList.find(item => this.formatTime(item.createTime) === time);
                return data ? data.currentTotal : null;  // 如果该时间有数据，使用温度值，否则使用 null
            });
            if (this.vmsEntityList.length > 0) {
                legendData.push('flowTotal');
                series.push({
                    name: 'flowTotal',
                    data: curentTotal,
                    type: 'line',
                    smooth: true,
                    yAxisIndex: 2,
                    xAxisIndex: 0,
                    lineStyle: {
                        color: '#FFD700',  // 金黄色
                        type: 'solid'
                    },
                    itemStyle: {
                        color: '#FFD700'
                    },
                    xAxisIndex: 0,
                    connectNulls: true
                });
            }

            // y轴（空调状态）
            const airStatusList = allTimes.map(time => {
                const data = this.airconStatuses.find(item => this.formatTime(item.time) === time);
                return data ? data.status : null;
            });
            if (this.airconStatuses.length > 0) {
                legendData.push('airStatus');
                series.push({
                    name: 'airStatus',
                    data: airStatusList,
                    type: 'line',
                    smooth: false,
                    yAxisIndex: 3,
                    xAxisIndex: 0,
                    lineStyle: {
                        color: '#9C27B0',  // 番茄红
                        type: 'solid'
                    },
                    itemStyle: {
                        color: '#9C27B0',
                    },
                    connectNulls: true
                })
            }


            // y轴（传感器温度）
            const thRecords = allTimes.map(time => {
                const data = this.thRecords.find(item => this.formatTime(item.createTime) === time);
                return data ? data.t : null;  // 如果该时间有数据，使用温度值，否则使用 null
            });
            if (this.thRecords.length > 0) {
                legendData.push('sensorTemperature');
                series.push({
                    name: 'sensorTemperature',
                    data: thRecords,
                    type: 'line',
                    smooth: false,
                    yAxisIndex: 0,
                    xAxisIndex: 0,
                    lineStyle: {
                        color: '#00CED1',  // 深天蓝
                        type: 'solid'
                    },
                    itemStyle: {
                        color: '#00CED1',
                    },
                    connectNulls: true
                });
            }


            // y轴（温区平均温度）
            const thKvRecordTasks = allTimes.map(time => {
                const data = this.thKvRecordTasks.find(item => this.formatTime(item.createTime) === time);
                return data ? data.temp : null;  // 如果该时间有数据，使用温度值，否则使用 null
            });
            if (this.thKvRecordTasks.length > 0) {
                legendData.push('groupTemperature');
                series.push({

                    name: 'groupTemperature',
                    data: thKvRecordTasks,
                    type: 'line',
                    smooth: false,
                    yAxisIndex: 0,
                    xAxisIndex: 0,
                    lineStyle: {
                        color: '#FF4500',  // 橙红色
                        type: 'solid'
                    },
                    itemStyle: {
                        color: '#FF4500'
                    },
                    connectNulls: true

                })
            }


            // y轴（温区温度和气象温度）
            const thRecords2t = allTimes.map(time => {
                const data = this.thRecords2.find(item => this.formatTime(item.createTime) === time);
                return data ? data.t : null;  // 如果该时间有数据，使用温度值，否则使用 null
            });

            if (this.thRecords2.length > 0) {
                legendData.push('groupTemperature2');
                series.push({
                    name: 'groupTemperature2',
                    data: thRecords2t,
                    type: 'line',
                    smooth: false,
                    yAxisIndex: 0,
                    xAxisIndex: 0,
                    lineStyle: {
                        // color: '#FF69B4',  // 深粉色
                        type: 'solid'
                    },
                    itemStyle: {
                        // color: '#FF69B4',
                    },
                    connectNulls: true
                });
            }


            const thRecords2h = allTimes.map(time => {
                const data = this.thRecords2.find(item => this.formatTime(item.createTime) === time);
                return data ? data.h : null;  // 如果该时间有数据，使用温度值，否则使用 null
            });
            if (this.thRecords2.length > 0) {
                legendData.push('groupExtTemperature');
                series.push({
                    name: 'groupExtTemperature',
                    data: thRecords2h,
                    type: 'line',
                    smooth: false,
                    yAxisIndex: 0,
                    xAxisIndex: 0,
                    lineStyle: {
                        // color: '#FF1493',  // 深粉色
                        type: 'solid'
                    },
                    itemStyle: {
                        // color: '#FF1493',
                    },
                    connectNulls: true
                });
            }



            // y轴（温区传感器温度）
            const groupedById = _.groupBy(this.thRecords3, 'id');
            Object.entries(groupedById).forEach(([id, records]) => {
                const thRecords = allTimes.map(time => {
                    const data = records.find(item => this.formatTime(item.createTime) === time);
                    return data ? data.t : null;
                });

                if (records.length > 0) {
                    legendData.push(id);
                    series.push({
                        name: id,
                        data: thRecords,
                        type: 'line',
                        smooth: false,
                        yAxisIndex: 0,
                        xAxisIndex: 0,
                        lineStyle: {
                            type: 'solid'
                        },
                        itemStyle: {
                        },
                        connectNulls: true
                    });
                }

            });
            console.log('legendData', legendData);
            console.log('series', series);
            var option = {
                legend: {
                    data: legendData,
                    // data: ['temperature', 'airConStatus', 'flowTotal', 'airStatus', 'groupTemperature', 'groupTemperature2', 'groupExtTemperature', 'sensorTemperature'],
                    textStyle: {
                        color: '#333',
                        fontSize: 14,
                        fontFamily: 'Arial, sans-serif',
                    },
                },

                title: {
                    left: '6%',
                },

                // 悬浮提示框


                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    position: function (point, params, dom, rect, size) {
                        // point 是鼠标当前的位置 [x, y]
                        // 可以通过调整 y 值来让 tooltip 出现在鼠标下方
                        return [point[0], point[1] + 10]; // 向下偏移 10px
                    },
                    formatter: function (params) {
                        function getColorDot(color) {
                            return `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`;
                        }

                        let tooltipContent = `<span style="font-family: 'Your Fancy Time Font', sans-serif; color: #333; font-weight: bold;">时间:</span> ${this.xdate[params[0].dataIndex]} <br>`;

                        params.forEach(item => {
                            if (item.seriesName === 'temperature') {
                                const data = this.airStatusLogList.find(aItem => this.formatTime(aItem.createTime) === item.axisValue);
                                if (data) {
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Temperature Font', serif;">温度:</span> ${data.t + ' °C'} <br>`;
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Humidity Font', serif;">湿度:</span> ${data.h + '%'} <br>`;
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Mode Font', serif;">模式:</span> ${data.mode} <br>`;
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Operation Font', serif;">操作:</span> ${data.handle} <br>`;
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Control Font', serif; ">控制状态:</span> ${data.status} <br>`;
                                }
                            } else if (item.seriesName === 'flowTotal') {
                                const data = this.vmsEntityList.find(aItem => this.formatTime(aItem.createTime) === item.axisValue);
                                if (data) {
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Flow Font', sans-serif;  font-weight: bold;">人流量:</span> ${data.currentTotal} <br>`;
                                }
                            } else if (item.seriesName === 'airStatus') {
                                const data = this.airconStatuses.find(aItem => this.formatTime(aItem.time) === item.axisValue);
                                if (data) {
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif;  font-weight: bold;">空调实时开关状态:</span> ${data.status} <br>`;
                                }
                            } else if (item.seriesName === 'groupTemperature') {
                                const data = this.thKvRecordTasks.find(aItem => this.formatTime(aItem.createTime) === item.axisValue);
                                if (data) {
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif;  font-weight: bold;">温区名称:</span> ${data.groupName} <br>`;
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif;">温区温度:</span> ${data.temp !== null ? data.temp + '°C' : ''} <br>`;
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; ">温区湿度:</span> ${data.h !== null ? data.h + '%' : ''} <br>`;
                                }
                            } else if (item.seriesName === 'groupTemperature2') {
                                const data = this.thRecords2.find(aItem => this.formatTime(aItem.createTime) === item.axisValue);
                                if (data) {
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif;">温区温度2:</span> ${data.t !== null ? data.t + '°C' : ''} <br>`;
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif;">空调温度:</span> ${data.h !== null ? data.h + '°C' : ''} <br>`;
                                }
                            } else if (item.seriesName === 'sensorTemperature') {
                                const data = this.thRecords.find(aItem => this.formatTime(aItem.createTime) === item.axisValue);
                                if (data) {
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif;  font-weight: bold;">设备ID:</span> ${data.id} <br>`;
                                    tooltipContent += getColorDot(item.color);
                                    if (data.id === "airtemp") {
                                        tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; ">气象温度:</span> ${data.t !== null ? data.t + ' °C' : ''} <br>`;
                                    } else {
                                        tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; ">温度:</span> ${data.t !== null ? data.t + ' °C' : ''} <br>`;
                                    }
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; ">湿度:</span> ${data.h !== null ? data.h + '%' : ''} <br>`;
                                }
                            } else {
                                const data = this.thRecords3.find(aItem => this.formatTime(aItem.createTime) === item.axisValue && aItem.id === item.seriesName);
                                if (data) {
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Sensor Font', sans-serif;  font-weight: bold;">传感器ID:</span> ${data.id} <br>`;
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Sensor Font', sans-serif; ">温度:</span> ${data.t !== null ? data.t + ' °C' : ''} <br>`;
                                    tooltipContent += getColorDot(item.color);
                                    tooltipContent += `<span style="font-family: 'Your Fancy Sensor Font', sans-serif;">湿度:</span> ${data.h !== null ? data.h + '%' : ''} <br>`;
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
                        offset: 65
                    },

                    // y轴（人流量）
                    {
                        type: 'value',
                        name: 'flowTotal',
                        position: 'reight',
                        gridIndex: 0,
                        offset: 0,
                        axisLabel: {
                            formatter: '{value}'
                        },
                        nameTextStyle: {
                            fontSize: 12
                        }
                    },

                    // y轴（空调状态）
                    {
                        type: 'category',
                        name: 'airStatus',
                        position: 'left',
                        data: ['0', '', '1'],
                        gridIndex: 0,
                        offset: 140
                    },

                ],
                grid: {
                    top: '10%',
                    bottom: '10%',
                    containLabel: true,
                },
                dataZoom: [
                    {
                        type: 'inside',
                        xAxisIndex: 0,
                    },
                    {
                        type: 'slider',
                        xAxisIndex: 0,
                        height: 17,
                        bottom: 8,
                    },
                ],
                series: series
            };

            this.myChart.setOption(option, true);
        },
        getColorDot(color) {
            return `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`;
        },
        getAirStatusKanban() {
            // if (this.myChart) {
            //     this.myChart.clear(); // 在获取新数据并更新图表之前清除之前的图表
            // }
            this.$http({
                url: this.$http.adornUrl('/extProject/getAirStatusKanban'),
                method: 'post',
                data: {
                    appId: this.formInline.appId,
                    id: this.formInline.id,
                    createTime: this.formInline.createTime,
                    groupId: this.formInline.groupId,
                    iotThRecordId: this.formInline.iotThRecordId,
                    flowSwitch: this.formInline.flowSwitch,
                }
            }).then((response) => {
                if (response.data.code === 200) {
                    this.airStatusLogList = response.data.data.airStatusLogList;
                    this.vmsEntityList = response.data.data.vmsEntityList;
                    this.airconStatuses = response.data.data.airconStatuses;
                    this.thKvRecordTasks = response.data.data.thKvRecordTasks;
                    this.thRecords = response.data.data.thRecords;
                    this.thRecords2 = response.data.data.thRecords2;
                    this.thRecords3 = response.data.data.thRecords3;
                    this.xdate = response.data.data.xdate;
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
    height: 500px;
}

.header {
    display: flex;
    margin: 30px;
    justify-content: center;

}
</style>