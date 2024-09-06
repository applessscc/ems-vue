<template>
  <div class="chart-view">
    <div ref="pieChart" class="chart-box"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import dark from '@/theme/dark.json'

export default {
  //import 引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    title: {
      type: String,
      require: false,
      default: ''
    },
    data: {
      type: Array,
      require: false,
      default: () => { }
    },
    series: {
      type: Array,
      require: false,
      default: () => []
    },
    radius: {
      type: String,
      require: false,
      default: '80%'
    },
    form: {
      type: Object,
      require: false,
      default: () => { }
    }
  },
  data() {
    //这里存放数据
    return {
      myChart: null,
      option: {
        title: {
          text: this.title,
          // subtext: 'Fake Data',
          // left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        // legend: {
        //   orient: 'vertical',
        //   left: 'left'
        // },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: this.radius,
            data: this.data,
            // data: [
            //   { value: 1048, name: 'Search Engine' },
            //   { value: 735, name: 'Direct' },
            //   { value: 580, name: 'Email' },
            //   { value: 484, name: 'Union Ads' },
            //   { value: 300, name: 'Video Ads' }
            // ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              color: '#fff',
              formatter: '{b}\n{c}',
              // edgeDistance: 10,
              
              lineHeight: 16,
            },
            labelLine: {
              length: 10,
              length2: 0,
              maxSurfaceAngle: 80
            },
            // labelLayout: params => {
            //   const isLeft = params.labelRect.x < this.myChart.getWidth() / 2;
            //   const points = params.labelLinePoints;
            //   // Update the end point.
            //   points[2][0] = isLeft
            //     ? params.labelRect.x
            //     : params.labelRect.x + params.labelRect.width;
            //   return {
            //     labelLinePoints: points
            //   };
            // },
          }
        ]
      }
    };
  },
  //计算属性 类似于 data 概念
  computed: {},
  //监控 data 中的数据变化
  watch: {
    // data(newData) {
    //   this.option.series.data = newData;
    //   this.option && this.myChart.setOption(this.option);
    // }
  },
  //方法集合
  methods: {
    refreshChart() {
      this.option.title.text = this.title;
      this.$nextTick(() => {
        this.option && this.myChart.setOption(this.option);
      })
    }
  },
  //生命周期 - 创建完成（可以访问当前 this 实例）
  created() {

  },
  //生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted() {
    // var chartDom = document.getElementById('chart');
    this.myChart = echarts.init(this.$refs.pieChart, dark);
    this.option && this.myChart.setOption(this.option);
    window.addEventListener('resize', () => {
      this.myChart.resize();
    })
    this.myChart.on('click', (params) => {
      let newUrl = this.$router.resolve({ path: 'transformer-his', query: { bu_name: this.form.bu_name } });
      window.open(newUrl.href, '_blank');
    })
  },
  beforeCreate() { }, //生命周期 - 创建之前
  beforeMount() { }, //生命周期 - 挂载之前
  beforeUpdate() { }, //生命周期 - 更新之前
  updated() { }, //生命周期 - 更新之后
  beforeDestroy() { }, //生命周期 - 销毁之前
  destroyed() { }, //生命周期 - 销毁完成
  activated() { }, //如果页面有 keep-alive 缓存功能，这个函数会触发 
}
</script>
<style lang='scss' scoped>
.chart-view {
  width: 100%;
  height: 100%;

  .chart-box {
    min-height: 100%;
  }
}
</style>