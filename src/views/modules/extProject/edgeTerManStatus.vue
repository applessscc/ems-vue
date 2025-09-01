<template>
  <el-container>

    <el-header class="header" style="position: relative; height: 60px; line-height: 60px; text-align: center; font-size: 26px; font-weight: bold; color: white;
         text-shadow: 1px 1px 2px rgba(0,0,0,0.6), 0 0 5px rgba(255,255,255,0.8);
         letter-spacing: 2px;">
      CMS 温湿度集中监控管理系统
      <span style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%);">
        <img src="~@/assets/img/logo.jpg" alt="NEXIM Logo" style="height: 40px;" />
      </span>
    </el-header>

    <el-container>
      <el-aside width="250px" class="aside">
        <div>
          <el-tree :data="treeData" show-checkbox node-key="nodeKey" :default-expanded-keys="defaultExpandedKeys":props="{ label: 'label', children: 'children' }" :default-checked-keys="defaultCheckedKeys"/>
        </div>
      </el-aside>

      <el-main class="main">
        <div class="card-container">
          <div v-for="(item, index) in tableData" :key="index" class="card-wrapper">
          </div>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import ClockGauge from '@/components/ClockGauge.vue';

export default {
  components: {
    ClockGauge,
  },

  watch: {
    // 监听树节点的勾选变化
    secondLevelChecked(n, o) {
      if (n !== o) {
        this.getSensorStatus();
      }
    },
  },
  mounted() {
    this.getAllDevice()
    this.$nextTick(() => {
      // 等 DOM 更新完之后执行默认勾选第一个父节点
      this.$refs.tree.setCheckedKeys(['cms-root']);

    });

    this.getSensorStatus();

    this.timer = setInterval(() => {
      this.getSensorStatus();
    }, 15000); // 每15秒调用一次
  },
  data() {
    return {
      treeData: [],

      // 默认张开的key
      defaultExpandedKeys: [],
      // 默认勾选的key
      defaultCheckedKeys: [],


      checkedNodes: [],
      secondLevelChecked: [],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      loading: false,
      tableData: [],
    };
  },
  methods: {
    getTempColor(item) {
      if (!item) return '#f39c12'; // 默认温度颜色（橙色）
      if (item.status === 3) return '#909399'; // 离线时灰色
      if (item.status === 2) return '#F56C6C'; // 异常时红色
      return '#f39c12'; // 正常时橙色
    },
    getDampColor(item) {
      if (!item) return '#3498db';       // 默认蓝色
      if (item.status === 3) return '#909399'; // 离线灰色
      if (item.status === 2) return '#F56C6C'; // 异常红色
      return '#3498db';                  // 正常蓝色
    },

    getAllDevice() {
      this.$http({
        url: this.$http.adornUrl('/extProject/getAllDevice'),
        method: 'get',
        params: { stationCode: 'STATION_DEFAULT' }
      })
        .then(res => {
          const list = res.data.data || []

          // 转成 Map
          const map = {}
          list.forEach(item => {
            map[item.id] = {
              label: item.name,
              nodeKey: item.id,
              parentId: item.parentId,
              code: item.code,
              children: []
            }
          })

          // 组装树
          const tree = []
          list.forEach(item => {
            const node = map[item.id]
            if (node.parentId && map[node.parentId]) {
              map[node.parentId].children.push(node)
            } else {
              tree.push(node) // 根节点
            }
          })

          // 给 el-tree
          this.treeData = [
            { label: 'CMS', nodeKey: 'cms-root', children: tree }
          ]
          this.defaultExpandedKeys = ['cms-root']

          // 默认勾选所有节点
          this.defaultCheckedKeys = ['cms-root', ...list.map(item => item.id)]
        })
        .catch(err => {
          console.error('获取树失败:', err)
        })
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
        searchParams: this.secondLevelChecked.map((node) => node.label),
      };
      console.log('请求参数:', searchParams);
      this.$http({
        url: this.$http.adornUrl('/extProject/getSensorStatus'),
        method: 'get',
        params: {
          searchParams: this.secondLevelChecked.map((node) => node.label),
        },
        paramsSerializer: (params) => {
          return Object.entries(params)
            .map(([key, val]) => {
              if (Array.isArray(val)) {
                return val
                  .map(
                    (v) =>
                      `${encodeURIComponent(key)}=${encodeURIComponent(v)}`
                  )
                  .join('&');
              }
              return `${encodeURIComponent(key)}=${encodeURIComponent(val)}`;
            })
            .join('&');
        },
      })
        .then((response) => {
          const data = response.data.data;
          this.tableData = data;
        })
        .catch((error) => {
          console.error('请求出错:', error);
          this.$message.error('请求传感器状态出错');
        })
        .finally(() => {
          this.loading = false;
        });
    },

    handleCheckChange() {
      const checkedNodes = this.$refs.tree.getCheckedNodes();
      this.secondLevelChecked = checkedNodes.filter((node) => {
        return this.isSecondLevel(node);
      });
      console.log('勾选的设备节点：', this.secondLevelChecked);
    },
    isSecondLevel(node) {
      // 判断是否是设备节点（第四级）
      return !node.children;
    },



    openNew(path, groupName, deviceName) {
      const newUrl = this.$router.resolve({
        path: path,
        query: {
          groupName: groupName,
          deviceName: deviceName
        }
      });
      console.log('打开新页面的URL:', newUrl.href);
      window.open(newUrl.href, '_blank');
    },

    // openNew(path) {
    //   let newUrl = this.$router.resolve({ path: path });
    //   window.open(newUrl.href, '_blank');
    // },


    getBorderColor(item) {
      if (item && item.status === 2) {
        return {
          color: '#F56C6C',
          animationClass: 'alarm-border-animation',
        };
      } else if (item && item.status === 3) {
        return {
          color: '#909399',
          animationClass: 'leave-border-animation',
        };
      }
      return {
        color: '#67C23A',
        animationClass: 'marquee-border-testing',
      };
    },

    getStatusType(item) {
      if (!item) return '';
      if (item.status === 2) return 'danger';     // 异常 - 红色
      if (item.status === 3) return 'info';       // 离线 - 灰色（Element UI 中 'info' 是灰色）
      return 'success';                           // 正常 - 绿色
    },

    getStatusText(item) {
      if (!item) return '';
      if (item.status === 2) return '异常';
      if (item.status === 3) return '离线';
      return '正常';
    },

  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
};
</script>

<style>
.header {
  background: linear-gradient(90deg, #3a8ee6, #1f3c88);
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-size: 24px;
  margin: 7px;
  text-align: center;
  line-height: 60px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15),
    inset 0 0 0 1px rgba(255, 255, 255, 0.3);
}

.aside {
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15),
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
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15),
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





.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-tag {
  font-size: 12px;
  border-radius: 10px;
  padding: 0 8px;
}

.info-tag {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 15px;
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


/* 新增：卡片容器，支持自动换行 */
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 240px);
  grid-gap: 60px;
  justify-content: center;
  /* 整体居中排列，最后一行默认靠左 */
}

.card-wrapper {
  width: 240px;
}


.item-desc {
  border-radius: 20px;
  margin-top: 5px;
  margin-left: 5px;
  margin-right: 5px;

  margin-bottom: 15px;
  text-align: center;
  font-weight: 550;
  /* 更加粗 */
  font-size: 15px;
  color: #000000;
  /* 黑色字体 */
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);

  transition: color 0.3s ease, transform 0.3s ease;
  cursor: default;
  user-select: none;


  padding: 4px 12px;
}


.info-content {
  margin: 5px;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  /* 柔和一点的阴影和边框 */
  /* box-shadow: 0 1px 3px rgba(74, 144, 226, 0.1); */
  border-radius: 20px;
  padding: 8px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.info-content:hover {
  transform: scale(1.025);
  /* 比原来 1.01 稍微放大一点点 */
  /* box-shadow: 0 3px 10px rgba(74, 144, 226, 0.2);  */
  box-shadow: 0 3px 10px rgba(74, 144, 226, 0.2);
  /* 阴影略微加深 */

}
</style>
