
<template>
  <el-header
    style="position: relative; height: 60px; line-height: 60px; text-align: center;
           font-size: 26px; font-weight: bold; color: white;
           text-shadow: 1px 1px 2px rgba(0,0,0,0.6), 0 0 5px rgba(255,255,255,0.8);
           letter-spacing: 2px; background: #1f78d1;"
  >
    <!-- 左侧时间 -->
    <span
      style="position: absolute; left: 20px; top: 50%;
             transform: translateY(-50%); font-size: 18px; font-weight: normal;"
    >
      {{ currentTime }}
    </span>

    <!-- 中间标题 -->
   {{title}}

    <!-- 右侧 LOGO -->
    <span style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%);">
      <img src="~@/assets/img/logo.jpg" style="height: 40px;" />
    </span>
  </el-header>
</template>

<script>
export default {
  name: "VtechHead",
  props: {
    title: {
      type: String,
      default: "CMS XXX管理系统"
    }
  },
  data() {
    return {
      currentTime: ""
    };
  },

  mounted() {
    // 初始化一次
    this.updateTime();

    // 每秒刷新一次
    this.timer = setInterval(() => {
      this.updateTime();
    }, 1000);
  },

  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    updateTime() {
      const now = new Date();
      const y = now.getFullYear();
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      const h = String(now.getHours()).padStart(2, "0");
      const min = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      this.currentTime = `${y}-${m}-${d} ${h}:${min}:${s}`;
    }
  }
};
</script>
