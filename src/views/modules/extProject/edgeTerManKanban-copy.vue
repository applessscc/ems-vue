<template>
  <div class="all-container">
    <!-- 顶部设备选择 -->
    <div class="header">
      电表
      <el-select v-model="selectedDeviceCode" placeholder="请选择电表" size="small" style="width: 200px" clearable>
        <el-option v-for="device in deviceList" :key="device.code" :label="device.name" :value="device.code" />
      </el-select>
    </div>
    <div class="container-wrapper-title">实时概况</div>

    <div class="group-container">

      <div class="group-block" v-for="(items, groupName) in statusMap" :key="groupName">
        <h3 class="group-title">{{ groupName }}</h3>
        <div class="group-items">
          <div class="group-row" v-for="(item, idx) in items" :key="idx">
            <span class="label">{{ item.name }}</span>
            <span class="value">{{ item.varValue }}{{ item.unit }}</span>
          </div>
        </div>
      </div>
    </div>


    <!-- 历史趋势 -->
    <div class="container-wrapper">
      <div class="container-wrapper-title">历史趋势</div>
      <div class="chart-wrapper">
      <div class="tag-row">
        <div class="tag-left">
          <el-button v-for="(item, idx) in tags" :key="idx" :type="selected === item ? 'primary' : 'default'"  :class="{ 'is-selected': selected === item }"
            size="small" @click="toggleTag(item)" plain>
            {{ item }}
          </el-button>
          <el-button :type="selected === '用电' ? 'primary' : 'default'" size="small" @click="toggleTag('用电')" plain  :class="{ 'is-selected': selected === item }">
            用电
          </el-button>
        </div>
        <div class="tag-right">
          日期：
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="onDateChange" unlink-panels
            size="small" />
          <el-select v-model="form.queryType" placeholder="请选择" size="small" style="width: 70px;"
            @change="getHistoricalTrend">
            <el-option label="分" value="min"></el-option>
            <el-option label="时" value="hour"></el-option>
          </el-select>
          <el-select v-model="currentType" placeholder="图表类型" size="small" style="width: 100px;"
            @change="onChartTypeChange">
            <el-option label="折线" value="line"></el-option>
            <el-option label="柱形" value="bar"></el-option>
          </el-select>
        </div>
      </div>
      <div id="chart"></div>
       </div>
    </div>

    <!-- 用电卡片 -->
    <div class="container-wrapper">
      <div class="container-wrapper-title">用电</div>
      <div class="card-container">
        <div class="card">
          <div class="card-sub">当日用电 (kWh)</div>
          <div class="card-value">{{ eleData.todayDiff }}</div>
          <div class="card-sub">昨日同期</div>

   <div class="card-value flex-between">
  <span>{{ eleData.yesterdayDiff }}</span>
  <span
    class="compare"
    :class="{
      positive: eleData.dayGrowth > 0,
      negative: eleData.dayGrowth < 0
    }"
  >
    <template v-if="eleData.dayGrowth > 0">▲</template>
    <template v-else-if="eleData.dayGrowth < 0">▼</template>
    {{ Math.abs(eleData.dayGrowth).toFixed(1) }}%
  </span>
</div>

        </div>

        <div class="card">
          <div class="card-sub">当月用电 (kWh)</div>
          <div class="card-value">{{eleData.thisMonthDiff}}</div>
          <div class="card-sub">上月同期</div>
<div class="card-value flex-between">
  <span>{{ eleData.lastMonthDiff }}</span>
  <span
    class="compare"
    :class="{
      positive: eleData.monGrowth > 0,
      negative: eleData.monGrowth < 0
    }"
  >
    <template v-if="eleData.monGrowth > 0">▲</template>
    <template v-else-if="eleData.monGrowth < 0">▼</template>
    {{ Math.abs(eleData.monGrowth).toFixed(1) }}%
  </span>
</div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "MyChart",
  data() {
    return {
      eleData: {
        todayDiff: 0.0,
        yesterdayDiff: 0.0,
        dayGrowth: 0.0,
        thisMonthDiff: 0.0,
        lastMonthDiff: 0.0,
        monGrowth: 0.0,
      },
      statusMap: {},
      deviceList: [],
      selectedDeviceCode: "",
      stationCode: "STATION_DEFAULT",
      tags: [],
      tagVarCodeMap: {},
      selected: null,
      form: {
        startTime: new Date(),
        endTime: new Date(),
        varCodes: [],
        deviceCode: "",
        appTypeCode: null,
        queryType: "hour",
      },
      dateRange: [new Date(), new Date()],
      chatData: {
        unit: "",
        xAxis: [],
        yList: [],
      },
      myChart: null,
      currentType: "bar",
      timer: null,
    };
  },
  mounted() {
    this.getDeviceList();
    this.startTimer();

  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  watch: {
    selectedDeviceCode(newVal) {
      if (newVal) {
        this.form.deviceCode = newVal;
        this.getPoints();
        this.stationDeviceVarStatusList2();
      }
    },
  },
  methods: {
    chunkArray(items, size) {
      const result = [];
      for (let i = 0; i < items.length; i += size) {
        result.push(items.slice(i, i + size));
      }
      return result;
    },



    startTimer() {
      this.timer = setInterval(() => {
        if (this.selectedDeviceCode) {
          this.getHistoricalTrend();
          this.stationDeviceVarStatusList2();
        }
      }, 90000);
    },
    getDeviceList() {
      this.$http
        .get(this.$http.adornUrl("/extProject/getAllDevice"), {
          params: { stationCode: this.stationCode },
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.deviceList = res.data.data.filter((d) => d.isGroup === 0);
            if (this.deviceList.length > 0) {
              this.selectedDeviceCode = this.deviceList[0].code;
              this.form.deviceCode = this.selectedDeviceCode;
            }
          }
        })
        .catch(() => console.error("获取设备列表异常"));
    },
    getPoints() {
      if (!this.selectedDeviceCode) {
        this.tags = [];
        this.tagVarCodeMap = {};
        this.selected = null;
        this.form.varCodes = [];
        this.getHistoricalTrend();
        return;
      }
      this.$http
        .get(this.$http.adornUrl("/extProject/getPoints"), {
          params: { stationCode: this.stationCode, deviceCode: this.selectedDeviceCode },
        })
        .then((res) => {
          if (res.data.code === 200) {
            const newTags = [];
            const newTagVarCodeMap = {};
            res.data.data.forEach((group) => {
              if (group.length > 0) {
                const groupName = group[0].groupName;
                newTags.push(groupName);
                newTagVarCodeMap[groupName] = group.map((point) => point.code);
              }
            });
            this.tags = newTags;
            this.tagVarCodeMap = newTagVarCodeMap;
            this.selected = newTags[0] || null;
            this.form.varCodes = newTagVarCodeMap[this.selected] || [];
            this.getHistoricalTrend();
          }
        })
        .catch(() => console.error("获取设备变量列表异常"));
    },
    stationDeviceVarStatusList2() {
      if (!this.selectedDeviceCode) return;
      this.$http
        .get(this.$http.adornUrl("/extProject/stationDeviceVarStatusList2"), {
          params: { stationCode: this.stationCode, deviceCode: this.selectedDeviceCode },
        })
        .then((res) => {
          this.statusMap = res.data.code === 200 && res.data.data ? res.data.data : {};
        })
        .catch(() => (this.statusMap = {}));
    },
    onDateChange(val) {
      if (val && val.length === 2) {
        this.form.startTime = val[0] + " 00:00:00";
        this.form.endTime = val[1] + " 23:59:59";
        this.getHistoricalTrend();
      }
    },
    toggleTag(item) {
      this.selected = item;
      if (item === "用电") {
        this.form.varCodes = this.tagVarCodeMap["电度"] || [];
        this.form.appTypeCode = "EPf";
      } else {
        this.form.varCodes = this.tagVarCodeMap[item] || [];
        this.form.appTypeCode = null;
      }
      this.getHistoricalTrend();
    },
    initChart() {
      const dom = document.getElementById("chart");
      if (!this.myChart) this.myChart = echarts.init(dom);
      const seriesList = this.chatData.yList.map((item) => ({
        name: item.name,
        type: this.currentType,
        smooth: this.currentType === "line",
        data: item.dataList,
        emphasis: { focus: "series" },
      }));
      let yAxisMin = null;
      let yAxisMax = null;
      const unit = this.chatData.unit || "";
      if (unit === "pe") {
        yAxisMin = 0;
        yAxisMax = 1;
      } else if (unit === "Hz") {
        yAxisMin = 0;
        yAxisMax = 100;
      } else if (unit === "V") {
        yAxisMin = 0;
        yAxisMax = 500;
      }
      this.myChart.setOption(
        {
          tooltip: { trigger: "axis" },
          legend: { data: this.chatData.yList.map((item) => item.name) },
          grid: { top: 30, right: 10, bottom: 10, left: 10, containLabel: true },
          xAxis: { type: "category", data: this.chatData.xAxis },
          yAxis: {
            type: "value",
            name: unit,
            min: yAxisMin,
            max: yAxisMax,
            scale: true,
            axisLabel: { formatter: (val) => val.toFixed(2) },
          },
          series: seriesList,
          dataZoom: [
            { type: "slider", show: true, xAxisIndex: 0, height: 20, bottom: 10 },
            { type: "inside", xAxisIndex: 0 },
          ],
        },
        true
      );
    },
    onChartTypeChange(value) {
      this.currentType = value;
      this.initChart();
    },

    getEleData() {
      this.$http
        .post(this.$http.adornUrl("/extProject/getEleData"), this.form)
        .then((response) => {
          if (response.data.code === 200) {
            this.eleData = response.data.data;
          } else {
            this.$message.error(response.data.msg);
          }
        }).catch((err) => console.error(err));
    },
    getHistoricalTrend() {
      if (this.form.varCodes.length === 0) {
        this.chatData.yList = [];
        this.initChart();
        return;
      }
      this.$http
        .post(this.$http.adornUrl("/extProject/getHistoricalTrend"), this.form)
        .then((response) => {
          if (response.data.code === 200) {
            const res = response.data.data;
            this.chatData.unit = res.unit;
            this.chatData.xAxis = res.times;
            let yList = res.ylist;
            if (this.selected === "用电" && yList.length > 0) {
              yList = yList.map((series) => {
                const diffData = [];
                for (let i = 1; i < series.dataList.length; i++) {
                  diffData.push(Math.round((series.dataList[i] - series.dataList[i - 1]) * 100) / 100);
                }
                return { ...series, dataList: diffData };
              });
              this.chatData.xAxis = this.chatData.xAxis.slice(1);
            }
            this.chatData.yList = yList;
            this.getEleData()
            this.initChart();
          } else {
            this.$message.error(response.data.msg);
          }
        })
        .catch((err) => console.error(err));
    },
  },
};
</script>
<style scoped>
.all-container {
  width: 90%;
  margin: 0 auto;
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: #2c3e50; /* 主文本深灰 */
  /* background-color: #f8faff; */
}

/* header */
.header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 12px 0;
  color: #1f78d1; /* 主色调 */
  font-weight: bold;
}

/* 标题 */
.container-wrapper-title {
  color: #1f78d1;
  font-weight: 700;
  font-size: 20px;
  border-left: 3px solid #1f78d1;
  padding-left: 8px;
  margin: 10px 0;
}

/* 实时概况 */
.group-container {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.group-block {
  flex: 1 1 300px;
  padding: 7px;
  padding-top:0px;
  border: 0.5px solid #d0e3f8;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 6px rgba(31, 120, 209, 0.15);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.group-block:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(31, 120, 209, 0.25);
}

.group-title {
  font-size: 14px;
  font-weight: bold;
  border-bottom: 0.5px solid #d0e3f8;
  padding: 5px;
  margin: 5px 0;
  color: #1f78d1;
}

/* 自动换列，每列最多 3 行 */
.group-items {
  display: grid;
  grid-auto-flow: column;
  grid-template-rows: repeat(3, auto);
  gap: 10px 20px;
  padding: 5px;
}

.group-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: nowrap; /* 内容不换行 */
  font-size: 14px;
}

.group-row .label {
  flex: 1 1 auto;
  min-width: 0;
  color: #555d6b; /* 副文字色 */
}

.group-row .value {
  flex-shrink: 0;
  margin-left: 8px;
  color: #1f78d1; /* 主色 */
  font-weight: bold;
  font-size: 16px;
  text-align: right;
}

.group-row .value.updated {
  transform: scale(1.05);
}

/* 历史趋势 */
.tag-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  padding: 8px;
  gap: 8px;
}

.tag-left {
  display: flex;
  gap: 5px;
  flex-wrap: nowrap;
  overflow-x: auto;
}

.tag-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

#chart {
  width: 100%;
  height: 260px;
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.8); /* 半透明白 */
  border-radius: 12px;
  padding: 10px;
}

.chart-wrapper {
  transition: transform 0.3s ease, box-shadow 0.3s ease; /* 动画过渡 */
  border-radius: 12px;
}

.chart-wrapper:hover {
  /* transform: scale(1.005);  */
  box-shadow: 0 6px 16px rgba(31, 120, 209, 0.3);
}




/* 用电卡片 */
.card-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 10px;
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  border: 1px solid #d0e3f8;
  box-shadow: 0 2px 6px rgba(31, 120, 209, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(31, 120, 209, 0.25);
}

.card-sub {
  font-size: 13px;
  color: #555d6b;
  margin-top: 4px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  margin: 6px 0;
  color: #1f78d1;
}

.card-value.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.compare.positive {
  color: #2ecc71; /* 正增长绿色 */
  font-weight: bold;
}

.compare.negative {
  color: #e74c3c; /* 负增长红色 */
  font-weight: bold;
}
/* scoped 样式穿透 Element UI 内部 DOM */
.all-container >>> .el-button.is-plain {
  color: #409EFF !important;           /* 默认字体蓝 */
  border-color: #409EFF !important;    /* 默认边框蓝 */
  background-color: #ffffff !important; /* 默认背景白 */
  transition: all 0.3s;
}

/* 悬浮状态 */
.all-container >>> .el-button.is-plain:hover {
  color: #ffffff !important;           
  background-color: #409EFF !important; 
  border-color: #409EFF !important;
}

/* 选中状态 */
.all-container >>> .el-button.is-plain.is-selected {
  color: #ffffff !important;           
  background-color: #409EFF !important; 
  border-color: #409EFF !important;
}


</style>
