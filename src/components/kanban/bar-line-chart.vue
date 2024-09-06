<template>
  <div class="chart-view">
    <div ref="chart" class="chart-box"></div>
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
    yAxis: {
      type: Array,
      require: false,
      default: () => []
    },
    dataset: {
      type: Object,
      require: false,
      default: () => { }
    },
    series: {
      type: Array,
      require: false,
      default: () => []
    }
  },
  data() {
    //这里存放数据
    return {
      myChart: null,
      option: {
        title: {
          text: this.title,
          top: '1%'
          // text: 'Rainfall vs Evaporation',
          // subtext: 'PCS'
        },
        grid: {
          // top: '10%',
          left: '3%',
          right: '4%',
          bottom: '2%',
          containLabel: true
        },
        tooltip: {
          // trigger: 'item',
          // axisPointer: {
          //   type: 'shadow'
          // }
          trigger: 'axis'
        },
        legend: {
          // top: '4%',
          // data: [{name: '产出数', color: '#37a2da'}, {name: '不良数', color: '#ffdb5c'}]
        },
        toolbox: {
          show: false,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            // data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          }
        ],
        yAxis: this.yAxis,
        // yAxis: [
        //   {
        //     name: 'PCS',
        //     type: 'value'
        //   }
        // ],
        dataset: this.dataset,
        // dataset: {
        //   // 提供一份数据。
        //   source: [
        //     ['product', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        //     ['Rainfall', 2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        //     ['Evaporation', 2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        //   ]
        // },
        series: this.series
        // series: [
        //   {
        //     name: 'Rainfall',
        //     type: 'bar',
        //     data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
        //     markPoint: {
        //       data: [
        //         { type: 'max', name: 'Max' },
        //         { type: 'min', name: 'Min' }
        //       ]
        //     },
        //     markLine: {
        //       data: [{ type: 'average', name: 'Avg' }]
        //     }
        //   },
        //   {
        //     name: 'Evaporation',
        //     type: 'bar',
        //     data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
        //     markPoint: {
        //       data: [
        //         { name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 },
        //         { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 }
        //       ]
        //     },
        //     markLine: {
        //       data: [{ type: 'average', name: 'Avg' }]
        //     }
        //   }
        // ]
      }
    };
  },
  //计算属性 类似于 data 概念
  computed: {},
  //监控 data 中的数据变化
  watch: {
    dataset(newData) {
      this.option.dataset = newData;
      this.option.series = this.series;
      this.$nextTick(() => {
        this.option && this.myChart.setOption(this.option);
        this.myChart.resize();
      })
    }
  },
  //方法集合
  methods: {

  },
  //生命周期 - 创建完成（可以访问当前 this 实例）
  created() {

  },
  //生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted() {
    // var chartDom = document.getElementById('chart');
    this.myChart = echarts.init(this.$refs.chart, dark);
    this.option && this.myChart.setOption(this.option);
    window.addEventListener('resize', () => {
      this.myChart.resize();
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