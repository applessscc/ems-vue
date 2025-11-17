<template>
  <div class="status-container">
    <h2>温区状态监控</h2>

    <table class="status-table">
      <thead>
        <tr>
          <th>温区名称</th>
          <th>温度 (°C)</th>
          <th>湿度 (%)</th>
          <th>日历状态</th>
          <th>空调状态</th>
          <th>总人数</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in groupStatusList" :key="index">
          <td>{{ item.groupName }}</td>
          <td>{{ item.t }}</td>
          <td>{{ item.h }}</td>
          <td>
            <span
              :class="{
                on: item.workCalendarStatus === 'on',
                off: item.workCalendarStatus === 'off'
              }"
            >
              {{ item.workCalendarStatus }}
            </span>
          </td>
          <td>
            <span
              :class="{
                on: item.airStatus === 'on',
                off: item.airStatus === 'off',
                offline: item.airStatus === '离线'
              }"
            >
              {{ item.airStatus }}
            </span>
          </td>
          <td>{{ item.currentTotal }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "GroupStatusView",
  data() {
    return {
      groupStatusList: []
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    async loadData() {
      try {
        const res = await axios.get("/api/group/status"); // 换成你真实的接口地址
        if (res.data.code === 200) {
          this.groupStatusList = res.data.data.groupStatusList || [];
        }
      } catch (err) {
        console.error("加载数据出错:", err);
      }
    }
  }
};
</script>

<style scoped>
.status-container {
  padding: 20px;
}

.status-table {
  width: 100%;
  border-collapse: collapse;
}

.status-table th,
.status-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.on {
  color: #2ecc71;
  font-weight: bold;
}

.off {
  color: #e67e22;
  font-weight: bold;
}

.offline {
  color: #e74c3c;
  font-weight: bold;
}
</style>
