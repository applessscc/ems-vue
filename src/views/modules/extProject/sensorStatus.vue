<template>
  <el-container>
    <el-header class="header" style="position: relative; height: 60px; line-height: 60px; text-align: center; font-size: 26px; font-weight: bold; color: white;
         text-shadow: 1px 1px 2px rgba(0,0,0,0.6), 0 0 5px rgba(255,255,255,0.8);
         letter-spacing: 2px;">
      温度传感器看板
      <span style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%);">
        <img src="~@/assets/img/logo.jpg" alt="NEXIM Logo" style="height: 40px;" />
      </span>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-tree :data="treeData" :props="defaultProps" @check-change="handleCheckChange" highlight-current
          show-checkbox ref="tree"  node-key="nodeKey"/>
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

  watch: {
    // 监听树节点的勾选变化
    secondLevelChecked(n, o) {
      if (n !== o) {
        this.getSensorStatus();
      }
    }
  },
  mounted() {
this.getSensorTreeData(); // 先调用方法

this.$nextTick(() => {
  // 等 DOM 更新完之后执行
  this.$refs.tree.setCheckedKeys(['parent-0']);

});

    this.getSensorStatus();
    this.timer = setInterval(() => {
      this.getSensorStatus();
    }, 15000); // 每5秒调用一次

  },
  data() {
    return {
      checkedNodes: [],
      secondLevelChecked: [],
      treeData: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      loading: false,
      tableData: [],

    };
  },
  methods: {
getSensorTreeData() {
  this.$http({
    url: this.$http.adornUrl("/extProject/getSensorStatusTreeValue"),
    method: "get",
  })
    .then((res) => {
      const rawData = res.data.data;
      const tree = Object.keys(rawData).map((parentLabel, parentIndex) => {
        return {
          label: parentLabel,
          nodeKey: `parent-${parentIndex}`,
          children: rawData[parentLabel].map((childLabel, childIndex) => ({
            label: childLabel,
            nodeKey: `parent-${parentIndex}-child-${childIndex}`,
          })),
        };
      });
      this.treeData = tree;
    })
    .then(() => {
      // 下一轮 DOM 更新后，手动同步勾选状态
      this.$nextTick(() => {
        this.handleCheckChange();
      });
    })
    .catch((err) => {
      console.error("获取树结构失败：", err);
    });
},


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
      const searchParams = {
        searchParams: this.secondLevelChecked.map(node => node.label)
      };
      console.log("请求参数:", searchParams)
      this.$http({
        url: this.$http.adornUrl("/extProject/getSensorStatus"),
        method: "get",
        params: {
          // 写法改为直接传数组
          searchParams: this.secondLevelChecked.map(node => node.label)
        },
        paramsSerializer: params => {
          // 强制避免 axios 默认加上 [] 的行为
          return Object.entries(params)
            .map(([key, val]) => {
              if (Array.isArray(val)) {
                return val.map(v => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`).join("&");
              }
              return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
            })
            .join("&");
        }
      })
        .then((response) => {
          const data = response.data.data;
          this.tableData = data;
          // console.log("传感器状态数据:", data);
        })
        .catch((error) => {
          console.error("请求出错:", error);
          this.$message.error("请求传感器状态出错");
        })
        .finally(() => {
          this.loading = false;
        });
    },


    handleCheckChange() {
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      this.secondLevelChecked = checkedNodes.filter(node => {
        return this.isSecondLevel(node);
      });
      console.log('勾选的二级节点：', this.secondLevelChecked);
    },
    isSecondLevel(node) {
      // 判断当前 node 是否为二级节点（父节点是 treeData 的子项）
      for (let root of this.treeData) {
        if (root.children && root.children.includes(node)) {
          return true;
        }
      }
      return false;
    },


    openNewWindow(deviceName) {
      fv
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
