<template>
  <div id="data-view">
    <dv-full-screen-container>
      <div class="main-header">
        <top-header title="CMS China 能耗看板" />
      </div>

      <div class="main-container">
        <el-row :gutter="10" style="height:100%;">
          <el-col :span="16">
            <dv-border-box-7>
              <guangdong-map />
            </dv-border-box-7>
          </el-col>
          <el-col :span="8">
            <el-row class="right-top-container">
              <el-col :span="24">
                <dv-border-box-7>
                  <global-chart-top title="每月" :yAxis="topYAxis" :dataset="topData" :series="topSeries"/>
                </dv-border-box-7>
              </el-col>
            </el-row>
            <el-row class="right-bottom-container">
              <el-col :span="24">
                <dv-border-box-7>
                  <global-chart-bottom title="每日" :yAxis="topYAxis" :dataset="topData" :series="topSeries"/>
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
import GuangdongMap from './guangdong-map';

export default {
  // name: 'DataView',
  components: {
    TopHeader,
    GuangdongMap,
    GlobalChartTop,
    GlobalChartBottom
  },
  data() {
    return {
      topData: {
        dimensions: ['product', 'LB', 'XX', 'RD'],
        source: [
          {
            "product": 4,
            "LB": 80,
            "XX": 90,
            "RD": 99
          },
          {
            "product": 5,
            "LB": 80,
            "XX": 45,
            "RD": 99
          },
          {
            "product": 6,
            "LB": 80,
            "XX": 90,
            "RD": 67
          },
          {
            "product": 7,
            "LB": 55,
            "XX": 90,
            "RD": 87
          },
          {
            "product": 8,
            "LB": 80,
            "XX": 90,
            "RD": 45
          }
        ]
      },
      topYAxis: [
        { name: ' ', type: 'value' }
      ],
      topSeries: [
        { type: 'bar', color: '#37a2da', label: { show: true, position: 'top', color: '#fff' } },
        { type: 'bar', color: '#ffdb5c', label: { show: true, position: 'top', color: '#fff' } },
        { type: 'bar', color: '#9fe6b8', label: { show: true, position: 'top', color: '#fff' } },
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
