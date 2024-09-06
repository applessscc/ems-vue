<template>
  <div id="container"></div>
</template>

<script>
import * as echarts from 'echarts'
import "echarts-gl"

export default {
  data() {
    return {
      clickFlag: 0,
      mouseFlag: 0,
      myChart: null,
    }
  },
  mounted() {
    var baseBg = window.SITE_CONFIG.cdnUrl + '/static/image/bg4.jpg'
    // 获取元素
    let dom = document.getElementById("container");
    // 初始化echarts
    this.myChart = echarts.init(dom);
    // 地球数据显示
    // let ds = [{
    //   name: '中国',
    //   point: [116.46, 39.92, 0, 'zhongguo'],
    //   itemStyleColor: '#f00',
    //   labelText: '中国'
    // }, {
    //   name: '马来西亚',
    //   point: [101.975766, 4.210484, 0],
    //   itemStyleColor: '#99CC66',
    //   labelText: '马来西亚'
    // }, {
    //   name: '墨西哥',
    //   point: [-102.552784, 23.634501, 0],
    //   itemStyleColor: '#9999FF',
    //   labelText: '墨西哥'
    // }]

    // 点配置信息
    // let series = ds.map(item => {
    //   return {
    //     name: item.name, // 是否显示左上角图例
    //     type: 'scatter3D',
    //     coordinateSystem: 'globe',
    //     blendMode: 'lighter',
    //     symbolSize: 16, // 点位大小

    //     itemStyle: {
    //       color: item.itemStyleColor, // 各个点位的颜色设置
    //       opacity: 2, // 透明度
    //       borderWidth: 1, // 边框宽度
    //       borderColor: 'rgba(255,255,255,0.8)' //rgba(180, 31, 107, 0.8)
    //     },
    //     label: {
    //       show: true, // 是否显示字体
    //       position: 'top', // 字体位置。top、left、right、bottom
    //       formatter: item.labelText, // 具体显示的值
    //       textStyle: {
    //         color: '#fff', // 字体颜色
    //         borderWidth: 0, // 字体边框宽度
    //         borderColor: '#fff', // 字体边框颜色
    //         fontFamily: 'sans-serif', // 字体格式
    //         fontSize: 18, // 字体大小
    //         fontWeight: 700 // 字体加粗
    //       }
    //     },
    //     data: [item.point] // 数据来源
    //   }
    // })
    let series = [{
      name: 'lines3D',
      type: 'lines3D',
      coordinateSystem: 'globe',
      //轨迹走动
      effect: {
        show: true,
        period: 2,
        trailWidth: 3,
        trailLength: 0.5,
        trailOpacity: 1,
        trailColor: '#0087f4' //路线色
      },
      blendMode: 'lighter',
      lineStyle: {
        width: 1,
        color: '#0087f4',
        opacity: 0.2
      },
      data: [],
      silent: false
    }, {
      //地址
      name: '地点标题',   //地址标题
      // type: 'effectScatter',
      // coordinateSystem: 'bmap',
      type: 'scatter3D',
      blendMode: 'lighter',
      coordinateSystem: 'globe',
      showEffectOn: 'render',
      zlevel: 99,
      effectType: "ripple",
      symbolSize: 20,
      rippleEffect: {
        period: 4,
        scale: 4,
        brushType: 'fill'
      },
      showEffectOn: 'hover',
      hoverAnimation: false,
      label: {
        normal: {
          show: true,
          // distance: 20,
          position: 'top',
          formatter: '{b}',
          formatter: function (data) {
            // return data.data.name;
            return "            "+data.data.name+"        ";
          },
          textStyle: {
            color: '#fff065', // 字体颜色
            borderWidth: 0, // 字体边框宽度
            borderColor: '#fff', // 字体边框颜色
            fontFamily: 'sans-serif', // 字体格式
            fontSize: 18, // 字体大小
            fontWeight: 700 // 字体加粗
            // show: false,
            // fontSize: 16,                   //地址文字大小
            // color: '#fff',               //地址文字颜色
            // fontWeight: 'bold',             //地址文字粗细
            // backgroundColor: 'transparent'  //地址文字背景
          }
        }
      },
      itemStyle: {
        normal: {
          color: '#517d00'
        }
      },

      // 以地址+路线轨迹显示
      data: [
        {
          name: 'VTC',
          value: [113.46, 22.92]
        },
        {
          name: 'VTM',
          value: [101.975766, 4.210484]
        },
        {
          name: 'VTX',
          value: [-102.552784, 23.634501]
        }
      ]
    }];

    //飞线数据配置
    series[0].data = [
      {
        coords: [
          [101.975766, 4.210484],
          [113.46, 22.92]
        ],
        // value: (Math.random() * 3000).toFixed(2)
      }, {
        coords: [
          [-102.552784, 23.634501],
          [113.46, 22.92]
        ],
        // value: (Math.random() * 3000).toFixed(2)
      }
    ];

    function rodamData() {
      // let longitude = Math.random() * 62 + 73;
      let longitude2 = Math.random() * 360 - 180;

      // let latitude = Math.random() * 50 + 3.52;
      let latitude2 = Math.random() * 180 - 90;
      return {
        coords: [[longitude2, latitude2], [113.46, 22.92]],
        // value: (Math.random() * 3000).toFixed(2)
      };
    };

    for (let i = 0; i < 5; i++) {
      series[0].data = series[0].data.concat(rodamData());
    };


    // 添加上面的配置项到地球上
    var option = {
      // 图例设置
      // legend: {
      //   selectedMode: 'multiple',
      //   x: 'right',
      //   y: 'bottom',
      //   data: ds.map(item => {
      //     return item.name // 数据来源
      //   }),
      //   // padding: [0, 550, 140, 0], // 填充位置,上、右、下、左
      //   orient: 'vertical', // 排列方式，vertical:垂直排列
      //   textStyle: {
      //     color: '#fff', // 文字颜色
      //   }
      // },
      // 地球背景色
      // backgroundColor: '#2E2677',
      // 地球参数设置
      globe: {
        baseTexture: baseBg, // 地球表面覆盖的图片,可以替换成自己想要的图片
        // environment: 'src/assets/img/report_bg.jpeg',
        shading: 'color', // 地球中三维图形的着色效果
        viewControl: {
          autoRotate: true, // 是否开启视角绕物体的自动旋转查看
          autoRotateSpeed: 18, //物体自转的速度,单位为角度 / 秒，默认为10 ，也就是36秒转一圈。
          autoRotateAfterStill: 4, // 在鼠标静止操作后恢复自动旋转的时间间隔,默认 3s
          rotateSensitivity: 2, // 旋转操作的灵敏度，值越大越灵敏.设置为0后无法旋转。[1, 0]只能横向旋转.[0, 1]只能纵向旋转
          // targetCoord: [113.46, 22.92], // 定位到广东
          // damping: 0,
          // maxDistance: 200,
          // minDistance: 200
        }
      },
      // 地球文字显示信息配置
      series: series
    };

    this.myChart.setOption(option);

    window.addEventListener('resize', () => {
      this.myChart.resize();
    })

    this.myChart.on('click', params => {
      this.clickFlag++
      if (this.clickFlag > 1) {
        this.clickFlag = 0;
        if (params.name == 'VTC') {
          let newUrl = this.$router.resolve({ path: 'map' });
          window.open(newUrl.href, '_blank');
        }
      }
    })

    //鼠标移入移出事件
    this.myChart.getZr().on('mousemove', params => {
      if (this.mouseFlag == 0) {
        option.globe.viewControl.autoRotate = false;
        this.myChart.setOption(option);
        this.mouseFlag = 1;
      }
    })
    this.myChart.getZr().on('mouseout', params => {
      this.mouseFlag = 0
      option.globe.viewControl.autoRotate = true;
      this.myChart.setOption(option);
    })

    // myChart.getZr().on('click', (params) => {
    //   console.log(params)
    // });
  },
  activated() {
  },
  methods: {
  }
}
</script>

<style lang="less">
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  box-sizing: border-box;
}

#container {
  width: 100%;
  height: 100%;
}
</style>
