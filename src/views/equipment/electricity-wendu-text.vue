<template>
  <div class="main-text">
    <!-- <div class="load-text">
      
    </div>
    <div class="loadRate-text">
      
    </div> -->
    <div class="wendu-text">
      负载率 {{loadRate}}%
      <br>
      负载 {{load}}KVA
      <br>
      温度 {{wendu}}°C
      <br>
      湿度 {{shidu}}%
    </div>
    <!-- <div class="shidu-text">
      
    </div> -->
  </div>
</template>

<script>
//这里可以导入其他文件（比如：组件，工具 js，第三方插件 js，json 文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import 引入的组件需要注入到对象中才能使用
  components: {},
  props: {
    load: {
      type: Number,
      require: false,
      default: 0
    },
    loadRate: {
      type: Number,
      require: false,
      default: 0
    },
    wendu: {
      type: Number,
      require: false,
      default: 0
    },
    shidu: {
      type: Number,
      require: false,
      default: 0
    }
  },
  data() {
    //这里存放数据
    return {
    };
  },
  //计算属性 类似于 data 概念
  computed: {},
  //监控 data 中的数据变化
  watch: {},
  //方法集合
  methods: {

  },
  //生命周期 - 创建完成（可以访问当前 this 实例）
  created() {

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
.main-text {
  width: 100%;
  height: 100%;

  .loadRate-text {
    width: 100%;
    height: 30%;
    font-size: 20px;
    font-weight: 400;
    color: #f1a48e;
  }

  .load-text {
    width: 100%;
    height: 30%;
    font-size: 20px;
    font-weight: 400;
    color: #f1a48e;
  }

  .wendu-text {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    //   justify-content: center;
    font-size: 22px;
    font-weight: 600;
    color: #f1a48e;
    line-height: 1.2;
  }

  .shidu-text {
    width: 100%;
    height: 10%;
    font-size: 20px;
    font-weight: 400;
    color: #f1a48e;
  }
}
</style>