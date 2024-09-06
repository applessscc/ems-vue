<template>
  <div id="clock">
    <p class="date">{{date}}</p>
    <p class="time">{{time}}</p>
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';
import moment from 'moment';

export default {
  //import 引入的组件需要注入到对象中才能使用
  components: {},
  props: {},
  data() {
    //这里存放数据
    return {
      timerID: null,
      time: '',
      date: ''
    };
  },
  //计算属性 类似于 data 概念
  computed: {},
  //监控 data 中的数据变化
  watch: {},
  //方法集合
  methods: {
    updateTime() {
      this.date = moment().format('YYYY-MM-DD') + ' ' + this.getWeek();
      this.time = moment().format('HH:mm:ss');
    },
    getWeek() { // 参数时间戳
      let week = moment().day()
      switch (week) {
        case 1:
          return '星期一'
        case 2:
          return '星期二'
        case 3:
          return '星期三'
        case 4:
          return '星期四'
        case 5:
          return '星期五'
        case 6:
          return '星期六'
        case 0:
          return '星期天'
      }
    },
  },
  //生命周期 - 创建完成（可以访问当前 this 实例）
  created() {
    this.timerID = setInterval(this.updateTime, 1000);
  },
  //生命周期 - 挂载完成（可以访问 DOM 元素）
  mounted() {

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
html,
body {
  height: 100%;
}

body {
  background: #0f3854;
  background: -webkit-radial-gradient(center ellipse, #0a2e38 0%, #000000 70%);
  background: radial-gradient(ellipse at center, #0a2e38 0%, #000000 70%);
  background-size: 100%;
}

p {
  margin: 0;
  padding: 0;
}

#clock {
  font-family: "Share Tech Mono", monospace;
  color: #ffffff;
  text-align: center;
  color: #daf6ff;
  text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
}
#clock .time {
  letter-spacing: 0.05em;
  font-size: 18px;
  padding: 5px 0;
}
#clock .date {
  //   letter-spacing: 0.1em;
  font-size: 20px;
}
#clock .name {
  letter-spacing: 0.1em;
  font-size: 12px;
  padding: 20px 0 0;
}
</style>