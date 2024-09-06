<template>
  <div class="map">
    <div class="map-container">
      <!-- <div class="map-container-title">xxx标题</div> -->
      <div class="map-chart" ref="mapEchart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import guangshen from "./svg/liaobu_bu_2.svg"
export default {
  created() {
    this.$nextTick(() => {
      this.initCharts();
    })
  },
  data() {
    return {
      myChart: null
    }
  },
  methods: {
    initCharts() {
      this.myChart = echarts.init(this.$refs["mapEchart"]);
      const option = {
        // 背景颜色
        // backgroundColor: "transparent",
        // 提示浮窗样式
        // tooltip: {
        //   show: true,
        //   trigger: "item",
        //   alwaysShowContent: false,
        //   backgroundColor: "#0C121C",
        //   borderColor: "rgba(0, 0, 0, 0.16);",
        //   hideDelay: 100,
        //   triggerOn: "mousemove",
        //   enterable: true,
        //   textStyle: {
        //     color: "#DADADA",
        //     fontSize: "12",
        //     width: 20,
        //     height: 30,
        //     overflow: "break",
        //   },
        //   showDelay: 100
        // },
        // 地图配置
        geo: {
          map: "guangshen",
          // center: [114.085947, 22.647],
          layoutCenter: ['50%', '50%'],
          layoutSize: "300%",
          // roam: true,
          emphasis: {
            //去除高亮效果
            disabled: true,
          },
          label: {
            // 通常状态下的样式
            normal: {
              show: true,
              textStyle: {
                color: "#fff",
              },
            },
            // 鼠标放上去的样式
            emphasis: {
              textStyle: {
                color: "#fff",
              },
            },
          },
          // 地图区域的样式设置
          itemStyle: {
            normal: {
              areaColor: "#389BB7",
              // borderColor: "rgba(147, 235, 248, 1)",
              // borderWidth: 1,
              // shadowColor: "rgba(128, 217, 248, 1)",
              // shadowOffsetX: -2,
              // shadowOffsetY: 2,
              // shadowBlur: 10,
              // shadowColor: '#03365b', //阴影颜色
              // shadowOffsetX: 0, //阴影偏移量
              // shadowOffsetY: 10, //阴影偏移量
            },
            // 鼠标放上去高亮的样式
            emphasis: {
              //   areaColor: "#32c5e9",
              //   borderWidth: 0,
              // areaColor: "#389BB7",
              // borderColor: "rgba(147, 235, 248, 1)",
              // borderWidth: 1,
              // shadowColor: "rgba(128, 217, 248, 1)",
              // shadowOffsetX: -2,
              // shadowOffsetY: 2,
              // shadowBlur: 10,
            },
          }
        },
        series: [{
          type: "effectScatter",
          coordinateSystem: "geo",
          showEffectOn: "emphasis",
          emphasis: {
            scale: 1.2
          },
          data: [
            { name: 'SBU1', code: '01', value: [160, 130], itemStyle: { color: '#ffdb5c' } },
            { name: 'SBU1', code: '01', value: [295, 130], itemStyle: { color: '#ffdb5c' } },
            { name: 'SBU5', code: '05', value: [575, 130], itemStyle: { color: '#ffdb5c' } },
            {
              name: 'SBU8', code: '08', value: [715, 130], itemStyle: { color: '#224c7e' },
              label: {
                normal: {
                  show: true,
                  fontSize: 20, // 字体大小
                  color: '#224c7e', // 字体颜色
                  fontWeight: 700 // 字体加粗
                },
              }
            },
            { name: 'SBU2', code: '02', value: [850, 130], itemStyle: { color: '#ffdb5c' } },
            { name: 'SBU4', code: '04', value: [1000, 130], itemStyle: { color: '#ffdb5c' } },
          ],
          rippleEffect: {
            brushType: "stroke",
            scale: 1,
            // scale: 2.5,
            // period: 2, // 秒数
          },
          // symbol: 'path://M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zM16 16c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z',
          symbolSize: 20,
          clickable: false,
          hoverAnimation: true,
          zlevel: 1,
          label: {
            normal: {
              formatter: "{b}",
              position: "bottom",
              show: true,
              fontSize: 20, // 字体大小
              color: '#ffdb5c', // 字体颜色
              fontWeight: 700 // 字体加粗
            },
          },
        }]
      };
      this.$http({
        url: guangshen,
        method: 'get',
      }).then(({ data }) => {
        // 地图注册，第一个参数的名字必须和option.geo.map一致
        echarts.registerMap("guangshen", { svg: data })
        this.myChart.setOption(option);
        window.addEventListener('resize', () => {
          this.myChart.resize();
        })
        this.myChart.on('click', (params) => {
          console.log(params)
          let newUrl = this.$router.resolve({ path: 'electricity', query: { bu_name: params.data.code } });
          window.open(newUrl.href, '_blank');
        })
      })
    },
  },
};
</script>

<style lang="less" scoped>
.map {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  .map-container {
    width: 100%;
    height: 100%;
    background: rgba(1, 38, 118, 0.5);
    position: relative;
    // .map-container-title {
    //   margin: 56px 0 16px;
    //   font-size: 24px;
    //   font-weight: 700;
    //   color: #333;
    //   line-height: 30px;
    //   display: flex;
    //   justify-content: center;
    // }

    .map-chart {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 5;
      height: 100%;
      width: 100%;
    }
  }
}
</style>