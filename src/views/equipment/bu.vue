<template>
  <div id="data-view">
    <dv-full-screen-container>
      <div class="main-header">
        <top-header title="CMS LB 能耗看板" />
      </div>

      <div class="main-container">
        <el-row style="height:50%;">
          <el-col :span="24">
            <dv-border-box-7>
              <bu-liaobu />
            </dv-border-box-7>
          </el-col>
        </el-row>
        <el-row :gutter="10" style="height:50%;">
          <el-col :span="12">
            <dv-border-box-7>
              <global-chart-top title="每月" :yAxis="monthYAxis" :dataset="monthData" :series="monthSeries" />
            </dv-border-box-7>
          </el-col>
          <el-col :span="12">
            <dv-border-box-7>
              <global-chart-bottom title="每日" :yAxis="dayYAxis" :dataset="dayData" :series="daySeries" />
            </dv-border-box-7>
          </el-col>
        </el-row>
      </div>
    </dv-full-screen-container>
  </div>
</template>

<script>
import GlobalChartTop from '@/components/kanban/bar-line-chart';
import GlobalChartBottom from '@/components/kanban/bar-line-chart';
import TopHeader from '@/components/kanban/top-header-2';
import BuLiaobu from './bu-liaobu';

export default {
  // name: 'DataView',
  components: {
    TopHeader,
    BuLiaobu,
    GlobalChartTop,
    GlobalChartBottom
  },
  data() {
    return {
      dayData: {
        dimensions: [],
        source: []
      },
      dayYAxis: [
        { name: 'KW/H', type: 'value' }
      ],
      daySeries: [
        // { type: 'bar', label: { show: false, position: 'top', color: '#fff' }},
        // { type: 'bar', label: { show: false, position: 'top', color: '#fff' }},
        // { type: 'bar', label: { show: false, position: 'top', color: '#fff' }},
        // { type: 'bar', label: { show: false, position: 'top', color: '#fff' }},
        // { type: 'bar', label: { show: false, position: 'top', color: '#fff' }},
      ],
      monthData: {
        dimensions: [],
        source: []
      },
      monthYAxis: [
        { name: 'KW/H', type: 'value' }
      ],
      monthSeries: [
        // { type: 'bar', label: { show: true, position: 'top', color: '#fff' }, stack: 'bu',},
        // { type: 'bar', label: { show: true, position: 'top', color: '#fff' } },
        // { type: 'bar', label: { show: true, position: 'top', color: '#fff' } },
        // { type: 'bar', label: { show: true, position: 'top', color: '#fff' } },
        // { type: 'bar', label: { show: true, position: 'top', color: '#fff' } },
      ]
    }
  },
  created() {
    this.refreshDayData();
    this.refreshMonthData();
  },
  mounted() {
    //启动变压器定时任务刷新
    setInterval(() => {
      this.refreshDayData();
      this.refreshMonthData();
    }, 1000 * 60 * 3)
  },
  methods: {
    refreshDayData() {
      this.$http({
        url: this.$http.adornUrl('/report/electricitybu/queryBuElectricityByDay'),
        method: 'post',
        // data: this.$http.adornData(params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dayData = data.chart_data
          this.daySeries = []
          data.chart_data.dimensions.forEach((item, index) => {
            if (index > 0) {
              this.daySeries.push({ type: 'bar', stack: 'bu' })
            }
          });
        } else {
          console.log(data);
        }
      })
    },
    refreshMonthData() {
      this.$http({
        url: this.$http.adornUrl('/report/electricitybu/queryBuElectricityByMonth'),
        method: 'post',
        // data: this.$http.adornData(params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.monthData = data.chart_data
          this.monthSeries = []
          data.chart_data.dimensions.forEach((item, index) => {
            if (index > 0) {
              this.monthSeries.push({ type: 'bar', stack: 'bu', barMaxWidth: '40' })
            }
          });
        } else {
          console.log(data);
        }
      })
    }
  }
}
</script>

<style lang="less">
#data-view {
  width: 100%;
  height: 100%;
  background-color: #030409;
  color: #fff;

  #dv-full-screen-container {
    background-image: url("../../assets/img/report_bg.jpeg");
    background-size: 100% 100%;
    height: 100% !important;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }

  .main-header {
    width: 100%;
    height: 90px;
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
  }

  .main-container {
    height: calc(~"100% - 90px");
    padding: 30px;

    .border-box-content {
      // padding: 20px;
      box-sizing: border-box;
    }
  }

  .el-col {
    height: 100%;
  }
}
</style>
