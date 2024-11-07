<template>
  <div id="data-view">
    <dv-full-screen-container>
      <div class="main-header">
        <top-header title="CMS Global 能耗看板" />
      </div>

      <div class="main-container">
        <el-row :gutter="10" style="height:100%;">
          <el-col :span="12">
            <dv-border-box-7 class="global-container">
              <global-map />
            </dv-border-box-7>
          </el-col>
          <el-col :span="12">
            <el-row class="right-top-container">
              <el-col :span="12">
                <dv-border-box-7>
                  <pie-chart title="每月指标" :data="pieTopData" />
                </dv-border-box-7>
              </el-col>
              <el-col :span="12">
                <dv-border-box-7>
                  <global-chart-top title="每月" :yAxis="topYAxis" :dataset="topData" :series="topSeries" />
                </dv-border-box-7>
              </el-col>
            </el-row>
            <el-row class="right-bottom-container">
              <el-col :span="12">
                <dv-border-box-7>
                  <pie-chart title="每日指标" :data="pieBottomData" />
                </dv-border-box-7>
              </el-col>
              <el-col :span="12">
                <dv-border-box-7>
                  <global-chart-bottom title="每日" :yAxis="topYAxis" :dataset="topData2" :series="topSeries" />
                </dv-border-box-7>
              </el-col>
            </el-row>
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
import GlobalMap from './global-map';
import PieChart from '@/components/kanban/pie-chart';

export default {
  // name: 'DataView',
  components: {
    TopHeader,
    GlobalMap,
    GlobalChartTop,
    GlobalChartBottom,
    PieChart
  },
  data() {
    return {
      topData: {
        dimensions: ['product', 'VTC', 'VTM', 'VTX'],
        source: [
        ]
      },
      topData2: {
        dimensions: ['product', 'VTC', 'VTM', 'VTX'],
        source: [

        ]
      },
      topYAxis: [
        { name: ' ', type: 'value' }
      ],
      topSeries: [
        { type: 'bar', color: '#37a2da', label: { show: false, position: 'top', color: '#fff' } },
        { type: 'bar', color: '#9fe080', label: { show: false, position: 'top', color: '#fff' } },
        { type: 'bar', color: '#ffdb5c', label: { show: false, position: 'top', color: '#fff' } },
      ],
      pieTopData: [
        { value: 89, name: 'VTC' },
        { value: 65, name: 'VTM' },
        { value: 77, name: 'VTX' }
      ],
      pieBottomData: [
        { value: 67, name: 'VTC' },
        { value: 88, name: 'VTM' },
        { value: 99, name: 'VTX' }
      ]
    }
  },
  created() {
    this.refreshMonthData();
    this.refreshMonthData2();

  },
  mounted() {
    setInterval(() => {
      this.refreshMonthData();
      this.refreshMonthData2();
    }, 1000 * 60 * 3)
  },
  methods: {
    refreshMonthData() {
            const params = {
        type: 2

      };
      this.$http({
        url: this.$http.adornUrl('/report/electricitybu/queryBuElectricityByMonth2'),
        method: 'post',
                params: params,

        // data: this.$http.adornData(params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(this.topData.source);
          this.topData = data.chart_data;
          console.log(this.topData.source);

          // this.monthData = data.chart_data
          // this.monthSeries = []
          // data.chart_data.dimensions.forEach((item, index) => {
          //   if (index > 0) {
          //     this.monthSeries.push({ type: 'bar', stack: 'bu', barMaxWidth: '40' })
          //   }
          // });
        } else {
          console.log(data);
        }
      })
    },

       refreshMonthData2() {
             const params = {
        type: 2

      };
      this.$http({
        url: this.$http.adornUrl('/report/electricitybu/queryBuElectricityByDay2'),
        method: 'post',
                params: params,

      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.topData2 = data.chart_data;
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

  .right-top-container {
    height: calc(~"50% - 5px");
    margin-bottom: 10px;
  }

  .right-bottom-container {
    height: calc(~"50% - 5px");
  }
}
</style>
