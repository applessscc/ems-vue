<template>
  <div id="top-header">
    <div class="header-left-decoration">
      <div class="vtech-logo">vtech</div>
    </div>
    <div class="header-right-decoration" :reverse="true">
      <Clock class="date-time" />
    </div>
    <div class="center-title">{{title}}</div>
  </div>
</template>

<script>
import Clock from '@/components/kanban/clock';

export default {
  components: {
    Clock
  },
  props: {
    title: {
      type: String,
      require: false,
      default: "请设置标题"
    }
  },
  name: 'TopHeader1'
}
</script>

<style lang="less">
#top-header {
  position: relative;
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;

  .header-center-decoration {
    width: 40%;
    height: 60px;
    margin-top: 30px;
  }

  .header-left-decoration,
  .header-right-decoration {
    width: 25%;
    height: 80px;
  }

  .center-title {
    position: absolute;
    font-size: 30px;
    font-weight: bold;
    left: 50%;
    top: 20px;
    transform: translateX(-50%);
  }

  .vtech-logo {
    font-size: 70px;
    font-weight: 900;
    margin-left: 10%;
    color: #224c7e;
    -webkit-text-stroke: 1px #fff;
  }
  .date-time {
    float: right;
    margin-top: 3%;
    margin-right: 10%;
  }
}
</style>
