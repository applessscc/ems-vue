<template>
  <div id="scroll-board" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
    <div class="title-container" v-if="title">{{title}}</div>
    <dv-scroll-board :config="boardConfig" :class="title ? 'scroll-board-title' : 'scroll-board'" />
  </div>
</template>

<script>
export default {
  name: 'ScrollBoard',
  props: {
    scroll: {
      type: Boolean,
      require: false,
      default: true
    },
    title: {
      type: String,
      require: false,
      default: null
    },
    header: {
      type: Array,
      require: false,
      default: () => []
    },
    data: {
      type: Array,
      require: false,
      default: () => []
    },
    config: {
      type: Object,
      require: false,
      default: () => { }
    },
  },
  //监控 data 中的数据变化
  watch: {
    data(newData) {
      if (!this.mouseEnterFlag) {
        this.boardConfig.data = newData;
        if (!this.scroll && newData.length > 0) {
          this.boardConfig.rowNum = newData.length;
        }
        this.boardConfig = { ...this.boardConfig }
      }
    },
    header(newHeader) {
      // this.boardConfig.header = newHeader;
      // this.boardConfig = { ...this.boardConfig }
    },
    config(newConfig) {
      //配置属性覆盖
      // Object.assign(this.boardConfig, newConfig);
      // this.boardConfig = { ...this.boardConfig }
    }
  },
  created() {
    //配置属性覆盖
    Object.assign(this.boardConfig, this.config);

    if (this.data && this.data.length > 0) {
      this.boardConfig.data = this.data;
    }

    if (this.header && this.header.length > 0) {
      this.boardConfig.header = this.header;
    }

    //非轮播列表设置行数跟数据行相同
    if (!this.scroll && this.boardConfig.data.length > 0) {
      this.boardConfig.rowNum = this.boardConfig.data.length;
    }
  },
  data() {
    return {
      mouseEnterFlag: false,
      boardConfig: {
        // header: ['时间', '病害信息', '数量', '标段'],
        data: [
          // ['2019-07-01 19:25:00', '路面危害-松散'],
          // ['2019-07-02 17:25:00', '路面危害-路面油污清理'],
          // ['2019-07-03 16:25:00', '交安设施-交通标志牌结构'],
          // ['2019-07-04 15:25:00', '路基危害-防尘网'],
          // ['2019-07-05 14:25:00', '交安设施-交通标志牌结构'],
          // ['2019-07-06 13:25:00', '路面危害-松散'],
          // ['2019-07-07 12:25:00', '路基危害-防尘网'],
          // ['2019-07-08 11:25:00', '路面危害-路面油污清理'],
          // ['2019-07-09 10:25:00', '交安设施-交通标志牌结构'],
          // ['2019-07-10 09:25:00', '路基危害-防尘网']
        ],
        index: false,
        // columnWidth: [50],
        // align: ['center'],
        rowNum: 10,
        carousel: 'page',
        waitTime: 5000,
        // hoverPause: true,
        // headerBGC: '#1981f6',
        // headerHeight: 45,
        oddRowBGC: 'rgba(0, 44, 81, 0.8)',
        evenRowBGC: 'rgba(10, 29, 50, 0.8)'
      }
    }
  },
  methods: {
    handleMouseEnter() {
      this.mouseEnterFlag = true
    },
    handleMouseLeave() {
      this.mouseEnterFlag = false
    }
  }
}
</script>

<style lang="less">
#scroll-board {
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  overflow: hidden;

  .title-container {
    height: 50px;
    font-weight: bold;
    text-indent: 20px;
    font-size: 20px;
    display: flex;
    align-items: center;
  }

  .scroll-board {
    height: 100%;
  }

  .scroll-board-title {
    height: calc(~"100% - 50px");
  }
}
</style>
