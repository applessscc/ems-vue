<template>
  <el-container>
    <el-header class="header">温度传感器看板</el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" highlight-current />
      </el-aside>
      <el-main class="main">
        <el-row :gutter="24" justify="center">

          <el-col v-for="(item, index) in tableData" :key="index" :span="4" class="show-item">
            <el-tooltip effect="light" placement="bottom-end">
              <div slot="content" style="max-width: 300px;">
                <div>
                  <span style="font-weight: bold; color: #409EFF;">设备日志ID</span>
                  <span style="color:#409EFF;">: {{ item.deviceLogId }}</span>
                </div>
                <div>
                  <span style="font-weight: bold; color: #67C23A;">设备ID</span>
                  <span style="color: #67C23A;">: {{ item.deviceId }}</span>
                </div>
                <div>
                  <span style="font-weight: bold; color: #E6A23C;">设备名称</span>
                  <span style="color: #E6A23C;">: {{ item.deviceName }}</span>
                </div>
                <div>
                  <span style="font-weight: bold; color: #909399;">设备地址</span>
                  <span style="color: #909399;">: {{ item.deviceAddr }}</span>
                </div>
                <div>
                  <span style="font-weight: bold; color: #F56C6C;">分组名称</span>
                  <span style="color:  #F56C6C;">: {{ item.groupName }}</span>
                </div>
                <div>
                  <span style="font-weight: bold; color: #20a0ff;">温度</span>
                  <span style="color: #20a0ff;">: {{ item.tempValue }}°C</span>
                </div>
                <div>
                  <span style="font-weight: bold; color: #13ce66;">湿度</span>
                  <span style="color:#13ce66;">: {{ item.dampValue }}%</span>
                </div>
                <div>
                  <span style="font-weight: bold; color: #ff9900;">powerValue</span>
                  <span style="color: #ff9900;">: {{ item.powerValue }}</span>
                </div>
                <div>
                  <span style="font-weight: bold; color: #5c6b77;">最后运行时间</span>
                  <span style="color: #5c6b77;">: {{ item.saveTime }}</span>
                </div>
                <div>
                  <span style="font-weight: bold; color: #c0392b;">类型</span>
                  <span style="color: #c0392b;">: {{ item.type }}</span>
                </div>
                <div>
                  <span style="font-weight: bold; color: #8e44ad;">备注</span>
                  <span style="color: #8e44ad;">: {{ item.remark }}</span>
                </div>
              </div>



              <div class="custom-card"
                :style="{ padding: '0px', paddingBottom: '3px', borderColor: getBorderColor(item).color }"
                :class="['marquee-border', getBorderColor(item).animationClass]">
                <div class="right-status-container" style="margin-top: 8px;">
                  <!-- 标题 -->
                  <div class="item-desc">{{ item.deviceName }}</div>

                  <!-- 下方显示栏 -->
                  <div style="margin-top: 5px; display: flex; justify-content: center; align-items: flex-start;">


                    <!-- 左边：温湿度 垂直排列 -->
                    <div style="display: flex; flex-direction: column; text-align: left;">
                      <div class="info-item">
                        <i class="el-icon-sunny" style="color: #f39c12; margin-right: 4px;"></i>
                        <span class="label">温度:</span>
                        <span class="value" style="color: #f39c12;">{{ item.tempValue }}°C</span>
                      </div>
                      <div class="info-item">
                        <i class="el-icon-water-cup" style="color: #3498db; margin-right: 4px;"></i>
                        <span class="label">湿度:</span>
                        <span class="value" style="color: #3498db;">{{ item.dampValue }}%</span>
                      </div>
                      <div class="info-item">
                        <i class="el-icon-lightning" style="color: #e74c3c; margin-right: 4px;"></i>
                        <span class="label">powerValue:</span>
                        <span class="value" style="color: #e74c3c;">{{ item.powerValue }}</span>
                      </div>

                    </div>
                    <!-- 右边：状态标签-->
                    <div class="info-tag">
                      <el-tag :type="getStatusType(item)" class="status-tag">
                        {{ getStatusText(item) }}
                      </el-tag>
                    </div>
                  </div>



                </div>
              </div>


            </el-tooltip>
          </el-col>

        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import ClockGauge from '@/components/ClockGauge.vue';

export default {
  components: {
    ClockGauge
  },
  mounted() {
    this.getSensorStatus();
    this.timer = setInterval(() => {
      this.getSensorStatus();
    }, 15000); // 每5秒调用一次
  },
  data() {
    return {
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [{ label: "三级 1-1-1" }, { label: "三级 1-1-2" }],
            },
          ],
        },
        {
          label: "一级 2",
          children: [{ label: "二级 2-1" }, { label: "二级 2-2" }],
        },
        {
          label: "一级 3",
          children: [{ label: "二级 3-1" }, { label: "二级 3-2" }],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      loading: false,
      tableData: [],
      // tableData: [
      //   { deviceName: "设备1", tempValue: "29.3°C", statusCode: "正常", dampValue: "67.8", powerValue: "42" },
      //   { deviceName: "设备2", tempValue: "24.7°C", statusCode: "正常", dampValue: "74.1", powerValue: "87" },
      //   { deviceName: "设备3", tempValue: "32.1°C", statusCode: "异常", dampValue: "58.3", powerValue: "13" },
      //   { deviceName: "设备4", tempValue: "21.9°C", statusCode: "正常", dampValue: "33.2", powerValue: "76" },
      //   { deviceName: "设备5", tempValue: "27.4°C", statusCode: "正常", dampValue: "49.9", powerValue: "22" },
      //   { deviceName: "设备6", tempValue: "30.6°C", statusCode: "正常", dampValue: "66.4", powerValue: "59" },
      //   { deviceName: "设备7", tempValue: "25.0°C", statusCode: "正常", dampValue: "70.5", powerValue: "7" },
      //   { deviceName: "设备8", tempValue: "28.8°C", statusCode: "正常", dampValue: "62.0", powerValue: "91" },
      //   { deviceName: "设备9", tempValue: "23.5°C", statusCode: "异常", dampValue: "40.3", powerValue: "33" },
      //   { deviceName: "设备10", tempValue: "26.2°C", statusCode: "正常", dampValue: "52.7", powerValue: "14" },
      //   { deviceName: "设备11", tempValue: "31.7°C", statusCode: "正常", dampValue: "60.2", powerValue: "80" },
      //   { deviceName: "设备12", tempValue: "22.1°C", statusCode: "正常", dampValue: "45.6", powerValue: "50" },
      //   { deviceName: "设备13", tempValue: "29.9°C", statusCode: "异常", dampValue: "53.1", powerValue: "19" },
      //   { deviceName: "设备14", tempValue: "24.3°C", statusCode: "正常", dampValue: "38.7", powerValue: "43" },
      //   { deviceName: "设备15", tempValue: "27.8°C", statusCode: "正常", dampValue: "69.4", powerValue: "88" },
      //   { deviceName: "设备16", tempValue: "30.1°C", statusCode: "正常", dampValue: "55.9", powerValue: "65" },
      //   { deviceName: "设备17", tempValue: "23.8°C", statusCode: "正常", dampValue: "48.0", powerValue: "26" },
      //   { deviceName: "设备18", tempValue: "26.5°C", statusCode: "正常", dampValue: "64.3", powerValue: "72" },
      //   { deviceName: "设备19", tempValue: "28.2°C", statusCode: "异常", dampValue: "57.5", powerValue: "39" },
      //   { deviceName: "设备20", tempValue: "25.7°C", statusCode: "正常", dampValue: "61.6", powerValue: "54" },
      //   { deviceName: "设备21", tempValue: "27.1°C", statusCode: "正常", dampValue: "59.2", powerValue: "47" },
      //   { deviceName: "设备22", tempValue: "29.4°C", statusCode: "异常", dampValue: "50.9", powerValue: "31" },
      //   { deviceName: "设备23", tempValue: "24.9°C", statusCode: "正常", dampValue: "68.7", powerValue: "83" },
      //   { deviceName: "设备24", tempValue: "31.2°C", statusCode: "正常", dampValue: "44.5", powerValue: "28" },
      //   { deviceName: "设备25", tempValue: "26.8°C", statusCode: "正常", dampValue: "53.4", powerValue: "65" },
      //   { deviceName: "设备26", tempValue: "30.0°C", statusCode: "异常", dampValue: "61.1", powerValue: "12" },
      //   { deviceName: "设备27", tempValue: "23.3°C", statusCode: "正常", dampValue: "56.7", powerValue: "74" },
      //   { deviceName: "设备28", tempValue: "28.5°C", statusCode: "正常", dampValue: "47.9", powerValue: "58" },
      //   { deviceName: "设备29", tempValue: "25.1°C", statusCode: "正常", dampValue: "62.8", powerValue: "41" },
      //   { deviceName: "设备30", tempValue: "27.6°C", statusCode: "异常", dampValue: "55.3", powerValue: "36" }
      // ]

    };
  },
  methods: {


    getDetailInfo(item) {
      return `
设备日志ID: ${item.deviceLogId}
设备ID: ${item.deviceId}
设备名称: ${item.deviceName}
设备地址: ${item.deviceAddr}
分组名称: ${item.groupName}
温度: ${item.tempValue}°C
湿度: ${item.dampValue}%
功率值: ${item.powerValue}
保存时间: ${item.saveTime}
类型: ${item.type}
备注: ${item.remark}
      `.trim();
    },
    getSensorStatus() {
      this.loading = true;
      this.$http({
        url: this.$http.adornUrl("/extProject/getSensorStatus"),
        method: "get",
      })
        .then((response) => {
          const data = response.data.data;
          this.tableData = data;
          console.log("传感器状态数据:", data);
        })
        .catch((error) => {
          console.error("请求出错:", error);
          this.$message.error("请求传感器状态出错");
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleNodeClick(data) {
      console.log("点击了节点：", data);
    },
    openNewWindow(deviceName) {
      if (deviceName) {
        const url = this.$router.resolve({ name: 'deviceDetail', query: { device: deviceName } }).href;
        window.open(url, '_blank');
      }
    },
    getBorderColor(item) {
      if (item && item.status === 2) {
        return {
          color: '#F56C6C', // 红色边框
          animationClass: 'alarm-border-animation',
        };
      }
      return {
        color: '#67C23A',
        animationClass: 'marquee-border-testing',
      };

    },
    getStatusType(item) {
      return item && item.status === 2 ? 'danger' : 'success';
    },
    getStatusText(item) {
      return item && item.status === 2 ? '异常' : '正常';
    },
  },
};
</script>

<style scoped>
.header {
  background: linear-gradient(90deg, #3a8ee6, #1f3c88);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 24px;
  margin: 7px;
  text-align: center;
  line-height: 60px;
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.aside {
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
  background-image: url('~@/assets/img/side.jpg');
  background-repeat: repeat;
  background-size: auto;
  color: white;
  padding: 10px;
  margin: 7px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  overflow: auto;
  height: 850px;
}




.main {
    border-radius: 20px;

  background: linear-gradient(135deg, #f0f4f8, #d9e2ec);
  background-image: url('~@/assets/img/main.jpg');
  background-repeat: repeat;
  color: #333;
  padding: 30px;
  margin: 7px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 850px;
  overflow: auto;
  text-align: center;
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.show-item {
  margin: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right-status-container {
  margin: 8px;
}

.item-desc {
  margin-top: 20px;
  margin-bottom: 10px;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
  color: #000;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}



.status-tag {
  font-size: 12px;
  border-radius: 10px;
  /* 设置圆角 */
  padding: 0 8px;
  /* 可选：让 tag 更紧凑 */
}

.info-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
  /* 可选，根据视觉需要添加 */
}


.info-item {
  margin-bottom: 2px;
}

.label {
  color: #333;
}

.value {
  color: #000;
}

/* 卡片模拟样式 */
.custom-card {
  background: rgba(255, 255, 255, 0.15);
  /* 透明白 */
  border: 1px solid rgba(255, 255, 255, 0.3);
  /* 半透明边框 */
  border-radius: 20px;
  backdrop-filter: blur(10px);
  /* 高斯模糊，核心效果 */
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.1),
    /* 柔和阴影 */
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  /* 内阴影，高光效果 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.custom-card:hover {
  transform: translateY(-8px);
  box-shadow:
    0 8px 40px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}






/* 动画样式 */
.marquee-border {
  animation: 2s linear infinite;
}

.marquee-border-testing {
  animation-name: testing-marquee-border;
}

.alarm-border-animation {
  animation-name: alarm-flash-border;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}


.tooltip-label {
  color: #409EFF;
  /* 蓝色，Element UI 主色调 */
  font-weight: 500;
  margin-right: 4px;
}

@keyframes testing-marquee-border {
  0% {
    border-color: #91e991;
    background-color: #ebffeb;
  }

  50% {
    border-color: #91e991;
    background-color: #ebffeb;
  }

  100% {
    border-color: #91e991;
    background-color: #ebffeb;
  }
}

@keyframes alarm-flash-border {
  0% {
    border-color: #F56C6C;
    background-color: #ffeaea;
  }

  50% {
    border-color: transparent;
    background-color: transparent;
  }

  100% {
    border-color: #F56C6C;
    background-color: #ffeaea;
  }
}
</style>
