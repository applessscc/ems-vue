<template>
  <el-container style="height: 100vh;">
    <el-header class="head">
      <el-form :inline="true" :model="form" size="small" @submit.native.prevent>
        <el-form-item label="区域">
          <el-select v-model="selectedLevel1" placeholder="请选择" @change="onLevel1Change">
            <el-option v-for="item in level1Options" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="selectedLevel2" placeholder="请选择" @change="onLevel2Change">
            <el-option v-for="item in level2Options" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="selectedLevel3" placeholder="请选择" @change="onLevel3Change">
            <el-option v-for="item in level3Options" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="设备名称">
          <el-select v-model="form.deviceName" placeholder="请选择设备">
            <el-option v-for="device in availableDevices" :key="device" :label="device" :value="device" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker v-model="form.dateRange" type="daterange" align="right" unlink-panels range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="getSensorKanban">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>

    <el-main style="padding: 10px;">
      <div ref="chart" style="width: 100%; height: 600px;"></div>
    </el-main>

    <!-- <el-footer style="text-align: center; line-height: 40px; background: #f2f2f2;">
      Footer
    </el-footer> -->
  </el-container>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'LineChart',
  data() {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10); // 'YYYY-MM-DD'

    return {
      form: {
        deviceName: '',
        dateRange: [todayStr, todayStr]
      },

      pickerOptions: {
        shortcuts: [

          {
            text: '今天',
            onClick(picker) {
              const today = new Date();
              // 只选今天这一天，开始和结束都设为今天
              picker.$emit('pick', [today, today]);
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setDate(start.getDate() - 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 1);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setMonth(start.getMonth() - 3);
              picker.$emit('pick', [start, end]);
            }
          }
        ],
        disabledDate(time) {
          // 禁止选择今天之后的日期
          return time.getTime() > Date.now();
        }
      },

      // 其他数据...
      selectedLevel1: '',
      selectedLevel2: '',
      selectedLevel3: '',
      level1Options: [],
      level2Options: [],
      level3Options: [],
      availableDevices: [],
      fullDataMap: {},
      chart: null,
      level2Map: {},
      level3Map: {}
    };
  },

  mounted() {
    this.initChart();
    this.getSensorTreeData().then(() => {
      const groupName = this.$route.query.groupName;
      const deviceName = this.$route.query.deviceName;

      if (groupName && deviceName) {
        const parts = groupName.split('-');
        if (parts.length === 3) {
          this.selectedLevel1 = parts[0];
          this.onLevel1Change(this.selectedLevel1);

          this.$nextTick(() => {
            this.selectedLevel2 = parts[1];
            this.onLevel2Change(this.selectedLevel2);

            this.$nextTick(() => {
              this.selectedLevel3 = parts[2];
              this.onLevel3Change(this.selectedLevel3);

              this.$nextTick(() => {
                this.form.deviceName = deviceName;
                this.getSensorKanban();
              });
            });
          });
        }
      } else {
        this.getSensorKanban(); // 默认加载
      }
    });
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$refs.chart);
    },

    getSensorTreeData() {
      const self = this;
      return this.$http({
        url: this.$http.adornUrl('/extProject/getSensorStatusTreeValue'),
        method: 'get'
      }).then(function (res) {
        const rawData = res.data.data;
        self.fullDataMap = rawData;

        const level1Set = new Set();
        const level2Map = {};
        const level3Map = {};

        for (const fullKey in rawData) {
          if (!rawData.hasOwnProperty(fullKey)) continue;

          const parts = fullKey.split('-');
          const l1 = parts[0];
          const l2 = parts[1];
          const l3 = parts[2];

          level1Set.add(l1);

          if (!level2Map[l1]) {
            level2Map[l1] = new Set();
          }
          level2Map[l1].add(l2);

          const key23 = l1 + '-' + l2;
          if (!level3Map[key23]) {
            level3Map[key23] = new Set();
          }
          level3Map[key23].add(l3);
        }

        self.level1Options = Array.from(level1Set);
        self.level2Map = level2Map;
        self.level3Map = level3Map;
      });
    },

    onLevel1Change(val) {
      this.selectedLevel2 = '';
      this.selectedLevel3 = '';
      this.availableDevices = [];
      this.form.deviceName = '';

      const set2 = this.level2Map[val];
      this.level2Options = set2 ? Array.from(set2) : [];
      this.level3Options = [];
    },

    onLevel2Change(val) {
      this.selectedLevel3 = '';
      this.availableDevices = [];
      this.form.deviceName = '';

      const key = this.selectedLevel1 + '-' + val;
      const set3 = this.level3Map[key];
      this.level3Options = set3 ? Array.from(set3) : [];
    },

    onLevel3Change(val) {
      const fullKey = this.selectedLevel1 + '-' + this.selectedLevel2 + '-' + val;
      const devices = this.fullDataMap[fullKey];
      if (devices && devices.length > 0) {
        this.availableDevices = devices;
        this.form.deviceName = devices[0];
      } else {
        this.availableDevices = [];
        this.form.deviceName = '';
      }
    },

    getSensorKanban() {
      const dateRange = this.form.dateRange;
      const deviceName = this.form.deviceName;

      if (!dateRange || dateRange.length !== 2) {
        this.$message.warning('请选择日期范围');
        return;
      }

      if (!deviceName) {
        this.$message.warning('请选择设备');
        return;
      }

      const startTime = dateRange[0] + ' 00:00:00';
      const endTime = dateRange[1] + ' 23:59:59';

      const requestData = {
        startTime,
        endTime,
        deviceName
      };

      this.$http({
        url: this.$http.adornUrl('/extProject/getSensorKanban'),
        method: 'post',
        data: requestData
      }).then(response => {
        const data = response.data.data;
        this.setChartOption(data);
      }).catch(error => {
        console.error('请求出错:', error);
        this.$message.error('传感器看板数据请求失败，请稍后重试。');
      });
    },

    setChartOption(data) {
      if (!this.chart || !Array.isArray(data)) return;

      const xAxisData = data.map(item => item.saveTime);
      const tempSeries = data.map(item => parseFloat(item.tempValue));
      const dampSeries = data.map(item => parseFloat(item.dampValue));


      const option = {
        tooltip: { trigger: 'axis' },
        legend: {
          data: ['湿度', '温度'],
          textStyle: { color: '#333' }
        },
        grid: {
          left: 100,
          right: 100,
          top: 100,
          bottom: 110  // 给底部元素留足够空间
        },
        dataZoom: [
          {
            type: 'inside', // 鼠标滚轮缩放
            xAxisIndex: 0
          },
          {
            type: 'slider', // 底部滑动条
            xAxisIndex: 0,
            height: 20,
            bottom: 10
          }
        ],
        xAxis: {
          type: 'category',
          data: xAxisData,
          axisLabel: {
            formatter(value) {
              return value.length >= 16 ? value.substring(0, 16) : value;
            },
            rotate: 45,
            fontSize: 10
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '湿度 (%)',
            position: 'right',
            min: 15,
            max: 90,
            interval: 15,
            axisLabel: { formatter: '{value} %' },
            axisLine: {
              lineStyle: {
                // color: '#3498db'
              }
            }
          },
          {
            type: 'value',
            name: '温度 (℃)',
            position: 'left',
            min: 0,
            max: 40,
            interval: 8,
            axisLabel: { formatter: '{value} ℃' },
            axisLine: {
              lineStyle: {
                // color: '#e74c3c'
              }
            }
          },

        ],
        series: [
          {
            name: '湿度',
            type: 'line',
            yAxisIndex: 0,
            smooth: true,
            data: dampSeries,
            lineStyle: {
              // color: '#3498db'
            },
            markLine: {
              symbol: 'none',
              label: {
                formatter: '警戒线：80%',
                position: 'end',
                color: '#3498db',
              },
              lineStyle: {
                type: 'dashed',
                color: '#3498db'
              },
              data: [{ yAxis: 80 }]
            }
          },
          {
            name: '温度',
            type: 'line',
            yAxisIndex: 1,
            smooth: true,
            data: tempSeries,
            itemStyle: {
              // color: '#e74c3c'
            },
            markLine: {
              symbol: 'none',
              label: {
                formatter: '警戒线：35℃',
                position: 'end',
                color: '#e74c3c'
              },
              lineStyle: {
                type: 'dashed',
                color: '#e74c3c'
              },
              data: [{ yAxis: 35 }]
            }
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
.head {
  margin: 25px;
  margin-bottom: 50px;
  text-align: center;

}
</style>
