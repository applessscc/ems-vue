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
                  <pie-chart title="每月指标" :data="pieTopData"/>
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
                  <pie-chart title="每日指标" :data="pieBottomData"/>
                </dv-border-box-7>
              </el-col>
              <el-col :span="12">
                <dv-border-box-7>
                  <global-chart-bottom title="每日" :yAxis="topYAxis" :dataset="topData" :series="topSeries" />
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
          {
            "product": 8,
            "VTC": 36,
            "VTM": 34,
            "VTX": 30
          },
          {
            "product": 9,
            "VTC": 41,
            "VTM": 35,
            "VTX": 55
          },
          {
            "product": 10,
            "VTC": 29,
            "VTM": 30,
            "VTX": 21
          },
          {
            "product": 11,
            "VTC": 24,
            "VTM": 28,
            "VTX": 21
          },
          {
            "product": 12,
            "VTC": 55,
            "VTM": 58,
            "VTX": 46
          }
        ]
      },
      topYAxis: [
        { name: ' ', type: 'value' }
      ],
      topSeries: [
        { type: 'bar', color: '#37a2da', label: { show: true, position: 'top', color: '#fff' } },
        { type: 'bar', color: '#9fe080', label: { show: true, position: 'top', color: '#fff' } },
        { type: 'bar', color: '#ffdb5c', label: { show: true, position: 'top', color: '#fff' } },
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

  },
  mounted() {

  },
  methods: {

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
