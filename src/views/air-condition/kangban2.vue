<template>
    <div>

        <div class="header">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
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
        }
    },

    data() {
        return {
            airDevices: [],
            groupIds: [],
            devices: [],
            airCondition: [],
            formInline: {
                appId: '',
                id: '',
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

        };
    },
    created() {
    },
    mounted() {
        this.$nextTick(() => {
            this.getThKvRecordGroups();
            this.getThRecord();
            this.getAppInfoList();
            this.getAirCondition();
            this.getAirStatusKanban();
        });

        this.intervalId = setInterval(() => {
            this.getAirStatusKanban();

        }, 20000); // 5000 毫秒，即 5 秒
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
            const legendData = [];
            const series = [];
            const allTimes = this.xdate.map(item => this.formatTime(item));

            // Function to create a line series object
            const createLineSeries = (name, data, yAxisIndex, color, connectNulls = true) => ({
                name: name,
                data: data,
                type: 'line',
                smooth: false,
                yAxisIndex: yAxisIndex,
                lineStyle: { color: color, type: 'solid' },
                itemStyle: { color: color },
                connectNulls: connectNulls
            });

            // y轴（温度）
            const temperatures = allTimes.map(time => {
                const data = this.airStatusLogList.find(item => this.formatTime(item.createTime) === time);
                return data ? data.t : null;
            });
            if (temperatures.some(temp => temp !== null)) { // Check if there's any actual data
                legendData.push('temperature');
                series.push(createLineSeries('temperature', temperatures, 0, '#1E90FF'));
            }

            // y轴（开关状态）
            const statusList = allTimes.map(time => {
                const data = this.airStatusLogList.find(item => this.formatTime(item.createTime) === time);
                if (!data) return null;
                return data.status.includes('on/') ? 'on' : data.status.includes('off/') ? 'off' : data.status;
            });
            if (statusList.some(status => status !== null)) {
                legendData.push('airConStatus');
                series.push(createLineSeries('airConStatus', statusList, 1, '#32CD32'));
            }

            // y轴（人流量）
            const curentTotal = allTimes.map(time => {
                const data = this.vmsEntityList.find(item => this.formatTime(item.createTime) === time);
                return data ? data.currentTotal : null;
            });
            if (curentTotal.some(flow => flow !== null)) {
                legendData.push('flowTotal');
                series.push(createLineSeries('flowTotal', curentTotal, 2, '#FFD700', true));
            }

            // y轴（空调状态）
            const airStatusList = allTimes.map(time => {
                const data = this.airconStatuses.find(item => this.formatTime(item.time) === time);
                return data ? data.status : null;
            });
            if (airStatusList.some(status => status !== null)) {
                legendData.push('airStatus');
                series.push(createLineSeries('airStatus', airStatusList, 3, '#9C27B0'));
            }

            // y轴（温区平均温度）
            const thKvRecordTasksData = allTimes.map(time => {
                const data = this.thKvRecordTasks.find(item => this.formatTime(item.createTime) === time);
                return data ? data.temp : null;
            });
            if (thKvRecordTasksData.some(temp => temp !== null)) {
                legendData.push('groupTemperature');
                series.push(createLineSeries('groupTemperature', thKvRecordTasksData, 0, '#FF4500'));
            }

            // y轴（传感器温度）
            const thRecordsData = allTimes.map(time => {
                const data = this.thRecords.find(item => this.formatTime(item.createTime) === time);
                return data ? data.t : null;
            });
            if (thRecordsData.some(temp => temp !== null)) {
                legendData.push('sensorTemperature');
                series.push(createLineSeries('sensorTemperature', thRecordsData, 0, '#00CED1'));
            }

            // y轴（温区温度和气象温度）
            const thRecords2tData = allTimes.map(time => {
                const data = this.thRecords2.find(item => this.formatTime(item.createTime) === time);
                return data ? data.t : null;
            });
            if (thRecords2tData.some(temp => temp !== null)) {
                legendData.push('groupTemperature2');
                series.push(createLineSeries('groupTemperature2', thRecords2tData, 0, '')); // Add your desired color
            }

            const thRecords2hData = allTimes.map(time => {
                const data = this.thRecords2.find(item => this.formatTime(item.createTime) === time);
                return data ? data.h : null;
            });
            if (thRecords2hData.some(humidity => humidity !== null)) {
                legendData.push('groupExtTemperature');
                series.push(createLineSeries('groupExtTemperature', thRecords2hData, 0, '')); // Add your desired color
            }

            // y轴（温区传感器温度）
            const groupedById = _.groupBy(this.thRecords3, 'id');
            Object.entries(groupedById).forEach(([id, records]) => {
                const sensorData = allTimes.map(time => {
                    const data = records.find(item => this.formatTime(item.createTime) === time);
                    return data ? data.h : null;
                });
                if (sensorData.some(value => value !== null)) {
                    legendData.push(id);
                    series.push(createLineSeries(id, sensorData, 0, '')); // Add a dynamic color if needed
                }
            });

            var option = {
                legend: { data: legendData, textStyle: { color: '#333', fontSize: 14, fontFamily: 'Arial, sans-serif' } },
                title: { left: '6%' },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'shadow' },
                    formatter: function (params) {
                        let tooltipContent = `<span style="font-family: 'Your Fancy Time Font', sans-serif; color: #333; font-weight: bold;">时间:</span> ${this.xdate[params[0].dataIndex]} <br>`;
                        params.forEach(item => {
                            if (item.seriesName === 'temperature') {
                                const data = this.airStatusLogList.find(aItem => this.formatTime(aItem.createTime) === item.axisValue);
                                if (data) {
                                    tooltipContent += `<span style="font-family: 'Your Fancy Temperature Font', serif; color: #1E90FF">appID:</span> ${data.appId !== null ? data.appId : ''} <br>`;
                                    tooltipContent += `<span style="font-family: 'Your Fancy Temperature Font', serif; color: #1E90FF">温度:</span> ${data.t !== null ? data.t + ' °C' : ''} <br>`;
                                    tooltipContent += `<span style="font-family: 'Your Fancy Humidity Font', serif; color: #1E90FF;">湿度:</span> ${data.h !== null ? data.h + '%' : ''} <br>`;
                                    tooltipContent += `<span style="font-family: 'Your Fancy Mode Font', serif; color: #1E90FF;">模式:</span> ${data.mode !== null ? data.mode : ''} <br>`;
                                    tooltipContent += `<span style="font-family: 'Your Fancy Operation Font', serif; color: #1E90FF;">操作:</span> ${data.handle !== null ? data.handle : ''} <br>`;
                                    tooltipContent += `<span style="font-family: 'Your Fancy Control Font', serif; color: #32CD32">控制状态:</span> ${data.status !== null ? data.status : ''} <br>`;
                                }
                            } else if (item.seriesName === 'flowTotal') {
                                const data = this.vmsEntityList.find(aItem => this.formatTime(aItem.createTime) === item.axisValue);
                                if (data) {
                                    tooltipContent += `<span style="font-family: 'Your Fancy Flow Font', sans-serif; color: #FFD700;">人流量:</span> ${data.currentTotal !== null ? data.currentTotal : ''} <br>`;
                                }
                            } else if (item.seriesName === 'airStatus') {
                                const data = this.airconStatuses.find(aItem => this.formatTime(aItem.time) === item.axisValue);
                                if (data) {
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; color: #9C27B0;">空调实时开关状态:</span> ${data.status !== null ? data.status : ''} <br>`;
                                }
                            } else if (item.seriesName === 'groupTemperature') {
                                const data = this.thKvRecordTasks.find(aItem => this.formatTime(aItem.createTime) === item.axisValue);
                                if (data) {
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; color: #FF4500;">温区名称:</span> ${data.groupName !== null ? data.groupName : ''} <br>`;
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; color: #FF4500;">温区温度:</span> ${data.temp !== null ? data.temp + '°C' : ''} <br>`;
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; color: #FF4500;">温区湿度:</span> ${data.h !== null ? data.h + '%' : ''} <br>`;
                                }
                            } else if (item.seriesName === 'groupTemperature2') {
                                const data = this.thRecords2.find(aItem => this.formatTime(aItem.createTime) === item.axisValue);
                                if (data) {
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; color: #FF4500;">温区温度2:</span> ${data.t !== null ? data.t + '°C' : ''} <br>`;
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; color: #FF4500;">气象温度:</span> ${data.h !== null ? data.h + '°C' : ''} <br>`;
                                }
                            } else if (item.seriesName === 'sensorTemperature') {
                                const data = this.thRecords.find(aItem => this.formatTime(aItem.createTime) === item.axisValue);
                                if (data) {
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; color: #00CED1;">设备ID:</span> ${data.id !== null ? data.id : ''} <br>`;
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; color: #00CED1;">温度:</span> ${data.t !== null ? data.t + ' °C' : ''} <br>`;
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; color: #00CED1;">湿度:</span> ${data.h !== null ? data.h + '%' : ''} <br>`;
                                }
                            } else { // Handle individual sensor data
                                const data = groupedById[item.seriesName].find(aItem => this.formatTime(aItem.createTime) === item.axisValue);
                                if (data) {
                                    tooltipContent += `<span style="font-family: 'Your Fancy Air Status Font', serif; color: ${item.color}">传感器 ${item.seriesName}:</span> ${data.h !== null ? data.h : ''} <br>`;
                                }
                            }
                        });
                        return tooltipContent;
                    }.bind(this),
                },
                xAxis: { type: 'category', data: allTimes, axisLabel: { rotate: 45 }, gridIndex: 0 },
                yAxis: [
                    { type: 'value', name: 't (°C)', position: 'left', axisLabel: { formatter: '{value} °C' }, gridIndex: 0, offset: 0 },
                    { type: 'category', name: 'airConStatus', position: 'left', data: ['off', 'on'], gridIndex: 0, offset: 65 },
                    { type: 'value', name: 'flowTotal', position: 'right', gridIndex: 0, offset: 0, axisLabel: { formatter: '{value}' }, nameTextStyle: { fontSize: 12 } },
                    { type: 'category', name: 'airStatus', position: 'left', data: ['0', '', '1'], gridIndex: 0, offset: 140 },
                ],
                grid: { top: '10%', bottom: '10%', containLabel: true },
                series: series
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