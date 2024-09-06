<template>
  <div ref="wenduBar" style="width: 100%; height: 100%;" />
</template>

<script>
//这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import * as echarts from 'echarts'
import dark from '@/theme/dark.json'

export default {
  //import 引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    //这里存放数据
    return {
      myChart: null,
      option: {
        series: [
          {
            type: 'gauge',
            center: ['50%', '70%'],
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 200,
            splitNumber: 10,
            itemStyle: {
              color: '#FFAB91'
            },
            progress: {
              show: true,
              width: 20
            },
            pointer: {
              show: false
            },
            axisLine: {
              lineStyle: {
                width: 20
              }
            },
            axisTick: {
              distance: -30,
              splitNumber: 5,
              lineStyle: {
                width: 2,
                color: '#999'
              }
            },
            splitLine: {
              distance: -40,
              length: 14,
              lineStyle: {
                width: 3,
                color: '#999'
              }
            },
            axisLabel: {
              distance: -12,
              color: '#fff',
              fontSize: 14
            },
            anchor: {
              show: false
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              width: '60%',
              lineHeight: 40,
              borderRadius: 8,
              offsetCenter: [0, '0%'],
              fontSize: 20,
              fontWeight: 'bolder',
              formatter: '{value} °C',
              color: 'inherit'
            },
            data: [
              {
                value: 20
              }
            ]
          }
        ]
      }
    }
  },
  //计算属性 类似于 data 概念
  computed: {},
  //监控 data 中的数据变化
  watch: {},
  //方法集合
  methods: {
    init() {
      this.myChart = echarts.init(this.$refs.wenduBar, dark);
      this.myChart.setOption(this.option);
      window.addEventListener('resize', () => {
        this.myChart.resize();
      })
    },
    refreshChart(value) {
      //配置属性覆盖
      this.option.series[0].data[0].value = value;
      this.myChart.setOption(this.option);
    }
  },
  //生命周期 - 创建完成（可以访问当前 this 实例）
  created() {

  },
  //生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted() {
    this.init()
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
//@import url(); 引入公共 css 类
</style>