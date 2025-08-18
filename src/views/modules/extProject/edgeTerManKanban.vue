<template>
  <div class="all-container">
    <div class="header" style="flex-direction: column; gap: 12px;">
      <div>
        电表 <el-select v-model="selectedDeviceCode" placeholder="请选择电表" size="small" style="width: 200px"
          @change="onDeviceChange" clearable>
          <el-option v-for="device in deviceList" :key="device.code" :label="device.name" :value="device.code" />
        </el-select>
      </div>
    </div>

    <!--实时概况容器-->
    <div class="container-wrapper">
      <div class="container-wrapper-title">
        <h2>实时概况</h2>
      </div>

      <div class="group-container">
        <div class="group-block" v-for="(items, groupName) in statusMap" :key="groupName">
          <h3 class="group-title">{{ groupName }}</h3>
          <div class="group-items">
            <div class="group-column" v-for="(chunk, index) in chunkArray(items, 3)" :key="index">
              <div v-for="(item, idx) in chunk" :key="idx" class="group-row">
                <span class="label">{{ item.name }}</span>
                <span class="value">{{ item.varValue }}{{ item.unit }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>

    <!-- 折线主容器 -->
    <div class="container">
      <div class="container-wrapper-title" style="width: 100%;">
        <h2>历史趋势</h2>
      </div>
      <div class="tag-row">

        <!-- 左侧按钮组 -->
        <div class="tag-left">
          <!-- 原有 tags 按钮 -->
          <el-button v-for="(item, idx) in tags" :key="idx" :type="selected === item ? 'primary' : 'default'"
            size="small" @click="toggleTag(item)" plain>
            {{ item }}
          </el-button>

          <!-- 用电按钮放在最后 -->
          <el-button :type="selected === '用电' ? 'primary' : 'default'" size="small" @click="toggleTag('用电')" plain>
            用电
          </el-button>
        </div>



        <!-- 右侧操作组 -->
        <div class="tag-right">
          日期：<el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="onDateChange" unlink-panels
            size="small" />
          <el-button size="small" type="primary" @click="toggleChartType">
            切换折线/柱形
          </el-button>
        </div>
      </div>

      <div id="chart" style="width: 100%; height: 330px; margin-top: 25px;"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts';


export default {
  name: 'MyChart',
  data() {
    return {
      statusMap: {},
      deviceList: [],
      selectedDeviceCode: '',
      stationCode: "STATION_DEFAULT",
      tags: [],
      tagVarCodeMap: {},
      selected: null,
      form: {
        startTime: new Date(), // 默认前一天
        endTime: new Date(),
        varCodes: [],
        deviceCode: '',
      },
      dateRange: [new Date(), new Date()],
      chatData: {
        unit: '',
        xAxis: [],
        yList: []
      },
      myChart: null,
      currentType: 'line',

    };
  },
  mounted() {
    this.getDeviceList();
    this.timer = setInterval(() => {
      this.getHistoricalTrend();
      this.stationDeviceVarStatusList2();
    }, 60000);

  },
  methods: {



    chunkArray(arr, size) {
      const result = [];
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
      }
      return result;
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
      this.$http({
        url: this.$http.adornUrl('/extProject/getPoints'),
        method: 'get',
        params: {
          stationCode: this.stationCode,
          deviceCode: this.selectedDeviceCode
        }
      }).then((res) => {
        if (res.data.code === 200) {
          const newTags = [];
          const newTagVarCodeMap = {};

          res.data.data.forEach(group => {
            if (group.length > 0) {
              const groupName = group[0].groupName;
              newTags.push(groupName);
              newTagVarCodeMap[groupName] = group.map(point => point.code);
            }
          });

          this.tags = newTags;
          this.tagVarCodeMap = newTagVarCodeMap;

          if (newTags.length > 0) {
            this.selected = newTags[0];
            this.form.varCodes = newTagVarCodeMap[newTags[0]];
          } else {
            this.selected = null;
            this.form.varCodes = [];
          }

          this.getHistoricalTrend();
        }
      }).catch(() => {
        console.error('获取设备变量列表异常');
      });
    },


    stationDeviceVarStatusList2() {

      if (!this.selectedDeviceCode) {
        return;
      }
      this.$http({
        url: this.$http.adornUrl('/extProject/stationDeviceVarStatusList2'),
        method: 'get',
        params: {
          stationCode: this.stationCode,
          deviceCode: this.selectedDeviceCode
        }
      }).then((res) => {
        if (res.data.code === 200 && res.data.data) {
          this.statusMap = res.data.data;
        } else {
          this.statusMap = {};
        }
      }).catch(() => {
        this.statusMap = {};
      });
    },


    getDeviceList() {
      this.$http({
        url: this.$http.adornUrl('/extProject/getAllDevice'),
        method: 'get',
        params: {
          stationCode: this.stationCode
        }
      }).then((res) => {
        if (res.data.code === 200) {
          this.deviceList = res.data.data.filter(d => d.isGroup === 0);
          if (this.deviceList.length > 0) {
            this.selectedDeviceCode = this.deviceList[0].code;
            this.form.deviceCode = this.selectedDeviceCode;
            this.getPoints();
            this.stationDeviceVarStatusList2();
          }
        }
      }).catch(() => {
        console.error('获取设备列表异常');
      });
    },

    onDeviceChange(val) {
      this.selectedDeviceCode = val;
      this.form.deviceCode = val;
      this.getPoints();
      this.stationDeviceVarStatusList2();
    },

    onDateChange(val) {
      if (val && val.length === 2) {
        this.form.startTime = val[0] + ' 00:00:00';
        this.form.endTime = val[1] + ' 23:59:59';
        this.getHistoricalTrend();
      }
    },

    initChart() {
      const dom = document.getElementById('chart');
      if (!this.myChart) {
        this.myChart = echarts.init(dom);
      }
      const seriesList = this.chatData.yList.map(item => ({
        name: item.name,
        type: this.currentType,
        smooth: this.currentType === 'line',
        data: item.dataList,
        emphasis: { focus: 'series' }
      }));
      let yAxisMin = null;
      let yAxisMax = null;
      let unit = this.chatData.unit || '';
      if (unit === 'pe') {
        yAxisMin = 0;
        yAxisMax = 1;
      } else if (unit === 'Hz') {
        yAxisMin = 0;
        yAxisMax = 100;
      } else if (unit === 'V') {
        yAxisMin = 0;
        yAxisMax = 500;
      }
      const option = {
        tooltip: { trigger: 'axis' },
        legend: { data: this.chatData.yList.map(item => item.name) },
        grid: {
          top: 30,     // 上边距
          right: 10,   // 右边距
          bottom: 10,  // 下边距
          left: 10,    // 左边距
          containLabel: true // 防止标签被截掉
        },
        xAxis: { type: 'category', data: this.chatData.xAxis },
        yAxis: {
          type: 'value',
          name: this.chatData.unit,
          min: yAxisMin,
          max: yAxisMax,
          scale: true,
          axisLabel: { formatter: val => val.toFixed(2) }
        },
        series: seriesList,
        dataZoom: [
          {
            type: 'slider', // 底部滑动条
            show: true,
            xAxisIndex: 0,
            height: 20,
            bottom: 10
          },
          {
            type: 'inside', // 鼠标滚轮/触摸缩放
            xAxisIndex: 0
          }
        ]
      };

      this.myChart.setOption(option, true);
    },

    toggleTag(item) {
      this.selected = item;
      let appTypeCode = null;
      if (item === '用电') {
        // 和“电度”按钮传参一样
        this.form.varCodes = this.tagVarCodeMap['电度'] || [];
        appTypeCode = 'EPf';
      } else {
        this.form.varCodes = this.tagVarCodeMap[item] || [];
      }
      this.getHistoricalTrend(appTypeCode);
    },


    toggleChartType() {
      this.currentType = this.currentType === 'line' ? 'bar' : 'line';
      const updatedSeries = this.chatData.yList.map(item => ({
        name: item.name,
        type: this.currentType,
        data: item.dataList
      }));
      this.myChart.setOption({ series: updatedSeries });
    },

    getHistoricalTrend(appTypeCode) {
      if (this.form.varCodes.length === 0) {
        this.chatData.yList = [];
        this.initChart();
        return;
      }

      this.$http({
        url: this.$http.adornUrl('/extProject/getHistoricalTrend'),
        method: 'post',
        data: {
          startTime: this.form.startTime,
          endTime: this.form.endTime,
          varCodes: this.form.varCodes,
          groupName: this.selected,
          appTypeCode: appTypeCode,
        }
      }).then((response) => {
        if (response.data.code === 200) {
          const res = response.data.data;
          this.chatData.unit = res.unit;
          this.chatData.xAxis = res.times;
          this.chatData.yList = res.ylist;
          this.initChart();
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((error) => {
        console.error(error);
      });
    }
  }
};
</script>

<style scoped>
.container {
  width: 90%;
  margin: 0 auto;
  /* 居中 */
}


.header {
  display: flex;
  justify-content: flex-start;
  /* 改为左对齐 */
  margin: 20px auto;
  width: 90%;
}


.tag-row {
  display: flex;
  justify-content: space-between;
  /* 左右分开 */
  align-items: center;
  flex-wrap: nowrap;
  padding: 8px;
  border-radius: 8px;
  gap: 8px;
}

.tag-left {
  display: flex;
  gap: 5px;
  flex-wrap: nowrap;
  overflow-x: auto;
  /* 标签过多时横向滚动 */
}

.tag-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.tag-row .el-button {
  white-space: normal;
  line-height: 1;
  padding: 8px 12px;
  text-align: center;
  border-radius: 6px;
}

#chart {
  width: 100%;
  height: 350px;
  margin-top: 40px;
}


.el-button.el-button {
  margin-left: 1px;
}




.group-container {
  width: 90%;
  margin: 10px auto;
  padding: 10px;

  display: flex;
  /* 改成 flex 布局 */
  flex-wrap: wrap;
  /* 超出自动换行 */
  gap: 10px;
  /* 卡片间距 */

}

.container-wrapper-title {
  width: 90%;
  margin: 10px auto;
  color: #fc8517;
  font-weight: 700;
  font-size: 15px;
  border-left: 3px solid #fc8517;
  text-align: left;
  padding-left: 8px;
}


.group-block {
  margin-bottom: 10px;
  padding: 5px;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.group-block:hover {
  transform: translateY(-7px);
  box-shadow: 0 3px 10px rgba(74, 144, 226, 0.2);
}

.group-title {
  font-size: 16px;
  font-weight: bold;
  border-bottom: 1px solid #ddd;
  padding-bottom: 6px;
  margin: 10px;
}

.group-items {
  display: flex;
  gap: 20px;
  /* 列间距 */
}

.group-column {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.group-row {
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  padding: 4px 0;
}

.group-row .label {
  color: #333;
}

.group-row .value {
  font-weight: bold;
  color: #409EFF;
  min-width: 80px;
  text-align: right;
}

.no-data {
  margin-top: 20px;
  text-align: center;
  color: #888;
}
</style>
