<template>
  <el-container>
    <el-header class="header" style="position: relative; height: 60px; line-height: 60px; text-align: center; font-size: 26px; font-weight: bold; color: white;
         text-shadow: 1px 1px 2px rgba(0,0,0,0.6), 0 0 5px rgba(255,255,255,0.8);
         letter-spacing: 2px;">
      CMS 能耗集中监控管理系统
      <span style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%);">
        <img src="~@/assets/img/logo.jpg" alt="NEXIM Logo" style="height: 40px;" />
      </span>
    </el-header>

    <el-container>
      <el-aside width="250px" class="aside">
        <el-tree ref="tree" :data="treeData" show-checkbox node-key="nodeKey"
          :default-expanded-keys="defaultExpandedKeys" :props="{ label: 'label', children: 'children' }"
          :default-checked-keys="defaultCheckedKeys" @check-change="handleCheckChange" />
      </el-aside>

      <el-main class="main">
        <div class="card-container">
          <div v-for="(item, index) in tableData" :key="index" class="custom-card card-wrapper">
            <div class="item-desc">{{ item.deviceName }}</div>

            <div class="info-content">
              <div style="display: flex; flex-direction: column; text-align: left;">
                <div class="info-item">
                  <i class="el-icon-s-data" style="color: #3498db; margin-right: 4px;"></i>
                  <span class="label">今日用电:</span>
                  <span class="value">{{ item.todayDiff }} kWh</span>
                </div>
                <div class="info-item">
                  <i class="el-icon-lightning" style="color: #9b59b6; margin-right: 4px;"></i>
                  <span class="label">功率:</span>
                  <span class="value">{{ item.k }} kW</span>
                </div>
              </div>
              <div class="info-tag">
              <el-tag  class="status-tag">
                      正常
              </el-tag>
              </div>
            </div>

          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  watch: {
    secondLevelChecked(n, o) {
      if (n !== o) {
        this.getEdgeTerManStatus();
      }
    },
  },

  mounted() {
    this.getAllDevice();
    this.$nextTick(() => {
      this.$refs.tree.setCheckedKeys(['cms-root']);
    });

    this.getEdgeTerManStatus();

    this.timer = setInterval(() => {
      this.getEdgeTerManStatus();
    }, 15000);
  },

  data() {
    return {
      treeData: [],
      defaultExpandedKeys: [],
      defaultCheckedKeys: [],
      secondLevelChecked: [],
      tableData: [],
      loading: false,
    };
  },

  methods: {
    /** 获取所有设备，生成树结构 */
    getAllDevice() {
      this.$http({
        url: this.$http.adornUrl('/extProject/getAllDevice'),
        method: 'get',
        params: { stationCode: 'STATION_DEFAULT' },
      })
        .then((res) => {
          const list = res.data.data || [];
          const map = {};
          list.forEach((item) => {
            map[item.id] = {
              label: item.name,
              nodeKey: item.id,
              parentId: item.parentId,
              code: item.code,
              children: [],
            };
          });

          const tree = [];
          list.forEach((item) => {
            const node = map[item.id];
            if (node.parentId && map[node.parentId]) {
              map[node.parentId].children.push(node);
            } else {
              tree.push(node);
            }
          });

          this.treeData = [{ label: 'CMS', nodeKey: 'cms-root', children: tree }];
          this.defaultExpandedKeys = ['cms-root'];
          this.defaultCheckedKeys = ['cms-root', ...list.map((item) => item.id)];
        })
        .catch((err) => {
          console.error('获取树失败:', err);
        });
    },

    /** 获取传感器状态 */
    getEdgeTerManStatus() {
      this.loading = true;
      const deviceCodes = this.secondLevelChecked.map((node) => node.code).filter(code => code != null);

      this.$http({
        url: 'http://localhost:8080/ems-admin/extProject/getEdgeTerManStatus',
        method: 'post',
        data: { stationCode: 'STATION_DEFAULT', deviceCode: deviceCodes },
      })
        .then((response) => {
          const data = response.data.data;
          this.tableData = data && data.deviceList ? data.deviceList : [];
        })
        .catch(() => {
          this.$message.error('请求传感器状态出错');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /** 勾选设备节点 */
    handleCheckChange() {
      this.secondLevelChecked = this.$refs.tree.getCheckedNodes();
    },
  },

  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },
};
</script>

<style>
.header {
  background: linear-gradient(90deg, #3a8ee6, #1f3c88);
  color: white;
  font-size: 24px;
  margin: 7px;
  text-align: center;
  line-height: 60px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.aside {
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
  height: 850px;
  overflow: auto;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  grid-gap: 60px;
  justify-content: center;
}

.card-wrapper {
  width: 240px;
}

.custom-card {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  width: 100%;
  box-sizing: border-box;
}

.custom-card:hover {
  transform: scale(1.15);
  /* 稍强烈但不突兀 */
  box-shadow: 0 8px 30px rgba(74, 144, 226, 0.3);
  /* 更深更远的阴影 */



}

.item-desc {
  margin-top: 5px;
  margin-bottom: 15px;
  text-align: center;
  font-weight: 550;
  font-size: 15px;
  color: #000;
}

.info-content {
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  border-radius: 20px;
  padding: 8px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.info-content:hover {
  transform: scale(1.025);
  box-shadow: 0 3px 10px rgba(74, 144, 226, 0.2);

}

.tooltip-label {
  color: #409eff;
  font-weight: 500;
  margin-right: 4px;
}
</style>
