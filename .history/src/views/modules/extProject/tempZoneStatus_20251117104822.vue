<template>
  <el-container>
    <el-header style="position: relative; height: 60px; line-height: 60px; text-align: center; font-size: 26px; font-weight: bold; color: white;
             text-shadow: 1px 1px 2px rgba(0,0,0,0.6), 0 0 5px rgba(255,255,255,0.8);
             letter-spacing: 2px; background: #1f78d1;">
      CMS 温区集中监控管理系统
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
          <div v-for="(item, index) in tableData" :key="index" class="card-wrapper">
            <div class="custom-card"
              :style="{ padding: '0px', paddingBottom: '3px', borderColor: getBorderColor(item).color }"
              :class="['marquee-border', getBorderColor(item).animationClass]">
              <div class="right-status-container" style="margin-top: 8px;">
                <div class="item-desc">{{ item.groupName }}</div>

                <div class="info-content">
                  <div style="display: flex; flex-direction: column; text-align: left;">

                    <div class="info-item">
                      <i class="el-icon-odometer" style="color: #2980b9; margin-right: 4px;"></i>
                      <span class="label">温度:</span>
                      <span class="value" style="color: #2980b9;">{{ item.t || '-' }} ℃</span>
                    </div>

                    <div class="info-item">
                      <i class="el-icon-water-cup" style="color: #27ae60; margin-right: 4px;"></i>
                      <span class="label">湿度:</span>
                      <span class="value" style="color: #27ae60;">{{ item.h || '-' }} %</span>
                    </div>

                    <div class="info-item">
                      <i class="el-icon-date" style="color: #f39c12; margin-right: 4px;"></i>
                      <span class="label">日历状态:</span>
                      <span class="value" :style="{ color: item.workCalendarStatus === 'on' ? '#67C23A' : '#F56C6C' }">
                        {{ item.workCalendarStatus }}
                      </span>
                    </div>

                    <div class="info-item">
                      <i class="el-icon-cold-drink" style="color: #3498db; margin-right: 4px;"></i>
                      <span class="label">空调状态:</span>
                      <span class="value"
                        :style="{ color: item.airStatus === 'on' ? '#67C23A' : (item.airStatus === 'off' ? '#F56C6C' : '#909399') }">
                        {{ item.airStatus }}
                      </span>
                    </div>

                    <div class="info-item">
                      <i class="el-icon-user" style="color: #8e44ad; margin-right: 4px;"></i>
                      <span class="label">人数:</span>
                      <span class="value" style="color: #8e44ad;">{{ item.currentTotal || 0 }}</span>
                    </div>

                  </div>

                  <div class="info-tag">
                    <el-tag :type="getStatusType(item)" class="status-tag">
                      {{ getStatusText(item) }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { name } from 'file-loader';

export default {
  mounted() {
    this.getAllDevice();
    this.$nextTick(() => {
      this.$refs.tree.setCheckedKeys(['cms-root']);
    });
    this.timer = setInterval(() => {
      this.getTempZoneStatus();
    }, 60000); // 每分钟刷新一次
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
    openNew(path, deviceCode, stationCode) {
      const newUrl = this.$router.resolve({
        path: path,
        query: {
          deviceCode: deviceCode,
          stationCode: stationCode
        }
      });
      console.log('打开新页面的URL:', newUrl.href);
      window.open(newUrl.href, '_blank');
    },

    /** 颜色状态样式 */
getBorderColor(item) {
  if (item.workCalendarStatus === 'off') {
    // 日历异常（关闭）
    return {
      color: '#F56C6C',
      animationClass: 'alarm-border-animation',
    };
  } else if (item.workCalendarStatus === 'on') {
    // 正常状态
    return {
      color: '#67C23A',
      animationClass: 'marquee-border-testing',
    };
  } else {
    // 其它情况（例如空值）
    return {
      color: '#c0c4cc',
      animationClass: 'leave-border-animation',
    };
  }
},

getStatusType(item) {
  if (item.workCalendarStatus === 'off') {
    return 'danger';   // 异常 → 红色
  } else if (item.workCalendarStatus === 'on') {
    return 'success';  // 正常 → 绿色
  } else {
    return 'info';     // 其它（例如空值或未知）→ 灰色
  }
},

getStatusText(item) {
  if (item.workCalendarStatus === 'off') {
    return '异常';
  } else if (item.workCalendarStatus === 'on') {
    return '正常';
  } else {
    return '未知';
  }
},


    /** 获取所有设备树 */
    getAllDevice() {
      this.$http({
        url: this.$http.adornUrl('/extProject/getAlTempZone'),
        method: 'post'
      })
        .then((res) => {
          const groupList =
            (res.data && res.data.data && res.data.data.groupList) || [];

          const rootNode = {
            label: 'CMS',
            nodeKey: 'cms-root',
            children: [],
            level: 0
          };

          const pathParts = ['VTC', 'LB', 'SBU2'];
          let currentLevel = rootNode.children;
          let pathKey = '';

          pathParts.forEach((part, index) => {
            pathKey += (pathKey ? '_' : '') + part;
            const node = {
              label: part,
              nodeKey: pathKey,
              children: [],
              level: index + 1
            };
            currentLevel.push(node);
            currentLevel = node.children;
          });

          groupList.forEach((item) => {
            currentLevel.push({
              label: item.groupName,
              nodeKey: `CMS_VTC_LB_SBU2_${item.groupId}`,
              id: item.groupId,
              name: item.groupName,
              isLeaf: true,
              level: pathParts.length + 1
            });
          });

          this.treeData = [rootNode];

          if (typeof this.collectExpandedKeys === 'function') {
            this.defaultExpandedKeys = this.collectExpandedKeys(this.treeData);
          } else {
            this.defaultExpandedKeys = ['cms-root'];
          }

          this.defaultCheckedKeys = ['cms-root'].concat(
            groupList.map((g) => `CMS_VTC_LB_SBU2_${g.groupId}`)
          );

          this.$nextTick(() => {
            if (this.$refs.tree && this.$refs.tree.getCheckedNodes) {
              this.secondLevelChecked = this.$refs.tree.getCheckedNodes();
            }
            this.getTempZoneStatus();
          });
        })
        .catch((err) => {
          console.error('获取温区树失败:', err);
        });
    },

    collectExpandedKeys(nodes) {
      let keys = [];
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          const allChildrenAreLeaf = node.children.every(c => c.isLeaf === true);
          if (!allChildrenAreLeaf) {
            keys.push(node.nodeKey);
          }
          keys = keys.concat(this.collectExpandedKeys(node.children));
        }
      });
      return keys;
    },

    /** 获取温区状态（新的接口） */
    getTempZoneStatus() {
      this.loading = true;
      this.$http({
        url: this.$http.adornUrl('/extProject/getTempZoneStatus'),
        method: 'post'
      })
        .then((response) => {
          const data = response.data.data;
          this.tableData = data && data.groupStatusList ? data.groupStatusList : [];
        })
        .catch(() => {
          this.$message.error('请求温区状态出错');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    /** 勾选设备节点 */
    handleCheckChange: _.debounce(function () {
      this.secondLevelChecked = this.$refs.tree.getCheckedNodes().filter(node => node.isLeaf == true);
      if (this.secondLevelChecked.length === 0) {
        this.tableData = [];
        return;
      }
      this.getTempZoneStatus();
    }, 200)
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
  min-width: 260px;
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


.info-item {
  margin-bottom: 2px;
}

.item-desc {
  border-radius: 20px;
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;

  margin-bottom: 15px;
  text-align: center;
  font-weight: 550;
  font-size: 15px;
  color: #000000;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);

  transition: color 0.3s ease, transform 0.3s ease;
  cursor: default;
  user-select: none;


  padding: 4px 12px;
}

.info-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
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

.right-status-container {
  margin: 8px;
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


.leave-border-animation {
  animation-name: leave-flash-border;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.tooltip-label {
  color: #409EFF;
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


@keyframes leave-flash-border {
  0% {
    border-color: #c0c4cc;
    /* 初始边框：Element UI 中性灰 */
    background-color: #f0f2f5;
    /* 初始背景：Element UI 背景灰 */
  }

  50% {
    border-color: transparent;
    background-color: transparent;
  }

  100% {
    border-color: #c0c4cc;
    /* 回到初始灰色边框 */
    background-color: #f0f2f5;
    /* 回到初始背景 */
  }
}
</style>

这个tag要上下左右居中