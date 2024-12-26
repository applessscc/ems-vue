<template>
  <div>

    <div class="top-contain">
      <el-card style="height: 250px;" v-if="locationOptions.length && this.currentPositionJob.length">
        <el-row :gutter="24" style="display: flex;" class="custom-row ">
          <el-col v-for="(item, index) in locationOptions.slice(0, 7)" :key="index" :span="3" class="show-item">
            <el-card :body-style="{ padding: '10px' }">

              <!-- 图片 -->
              <img src="../../assets/img/left-top-bg.jpg" class="image" @click.stop="$router.push({ name: 'cookerJob', query: { location: item.item } })">

              <div style="padding: 14px;">

                <!-- 位置 -->
                <span class="item-desc">{{ item.value }}</span>

                <!-- 下方显示栏 -->
                <div class="bottom clearfix">
                  <el-tag :type="getStatusType(item.item)" class="status-tag">
                    {{ getStatusText(item.item) }}
                  </el-tag>
                  <div class="right-info">
                    <div class="info-item">
                      <span class="label">入站：</span>
                      <span class="value">{{getInCount(item.item) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">不良品：</span>
                      <span class="value">{{getFailCount(item.item)}}</span>
                    </div>
                  </div>
                </div>

              </div>
            </el-card>
          </el-col>
        </el-row>

      </el-card>
    </div>

    <div class="main-contain">
      <el-card style="height: 550px;">
        <div class="main-contain-img">
        </div>
      </el-card>
    </div>

    <div class="right-contain">
      <el-card style="height: 620px;" v-if="locationOptions.length && this.currentPositionJob.length">
        <el-row :gutter="20" class="custom-row">
          <el-col :span="24" class="show-item">
            <el-card :body-style="{ padding: '10px' }">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div style="padding: 14px;">
                <span>{{this.locationOptions[7].value}}</span>
                <!-- 下方显示栏 -->
                <!-- 下方显示栏 -->
                <div class="bottom clearfix">
                  <el-tag :type="getStatusType(this.locationOptions[7].item)" class="status-tag">
                    {{ getStatusText(this.locationOptions[7].item) }}
                  </el-tag>
                  <div class="right-info">
                    <div class="info-item">
                      <span class="label">入站：</span>
                      <span class="value">{{getInCount(this.locationOptions[7].item) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">不良品：</span>
                      <span class="value">{{getFailCount(this.locationOptions[7].item)}}</span>
                    </div>
                  </div>
                </div>

              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter=20 class="custom-row">
          <el-col :span="24" class="show-item">
            <el-card :body-style="{ padding: '10px' }">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div style="padding: 14px;">
                <span class="item-desc">{{this.locationOptions[8].value}}</span>
                <!-- 下方显示栏 -->
                <!-- 下方显示栏 -->
                <div class="bottom clearfix">
                  <el-tag :type="getStatusType(this.locationOptions[8].item)" class="status-tag">
                    {{ getStatusText(this.locationOptions[8].item) }}
                  </el-tag>
                  <div class="right-info">
                    <div class="info-item">
                      <span class="label">入站：</span>
                      <span class="value">{{getInCount(this.locationOptions[8].item)}}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">不良品：</span>
                      <span class="value">{{getFailCount(this.locationOptions[8].item)}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="custom-row">
          <el-col :span="24" class="show-item">
            <el-card :body-style="{ padding: '10px' }">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div style="padding: 14px;">
                <span class="item-desc">{{this.locationOptions[9].value}}</span>
                <!-- 下方显示栏 -->
                <!-- 下方显示栏 -->
                <div class="bottom clearfix">
                  <el-tag :type="getStatusType(this.locationOptions[9].item)" class="status-tag">
                    {{ getStatusText(this.locationOptions[9].item) }}
                  </el-tag>
                  <div class="right-info">
                    <div class="info-item">
                      <span class="label">入站：</span>
                      <span class="value">{{getInCount(this.locationOptions[9].item)}}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">不良品：</span>
                      <span class="value">{{getFailCount(this.locationOptions[9].item)}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>

  </div>
</template>  


<script>
export default {

  data() {


    return {
      currentPositionJob: [],
      locationOptions: [],
      status: 'testing'
    }

  },
  components: {

  },
  computed: {


    statusType() {
      switch (this.status) {
        case 'idle':
          return 'info'; // 灰色
        case 'testing':
          return 'default';    // 蓝色
        case 'PASS':
          return 'success'; // 绿色
        case 'FAIL':
          return 'danger';  // 红色
        default:
          return 'default'; // 默认灰色
      }
    },

    statusText() {
      switch (this.status) {
        case 'idle':
          return 'idle';
        case 'testing':
          return 'testing';
        case 'PASS':
          return 'PASS';
        case 'FAIL':
          return 'FAIL';
        default:
          return 'Unknown';
      }
    },




  },
  created() {
  },
  mounted() {
    this.geSysList(1019);
    this.getCurrentPositionJob();
    this.intervalId = setInterval(() => {
      this.getCurrentPositionJob();
    }, 10000); // 5000 毫秒，即 5 秒

  },
  methods: {

    totalInbound() {
      return (position) => {
        console.log("totalInbound执行",this.currentPositionJob.length);
        // 查找指定位置的相关数据
        const positionData = this.currentPositionJob.find(item => item.position === position);
        if (positionData) {
          const now = new Date();
          const operationTime = new Date(positionData.operationTime);
          const timeDifference = now - operationTime;
          const minutesDifference = timeDifference / (1000 * 60);
          console.log("minutesDifference", minutesDifference, positionData.position);
          console.log("positionData.operationType1", positionData.operationType);
          // 修改 positionData.operationType
          if (positionData.operationType && (positionData.operationType == 3 || positionData.operationType == 4) && minutesDifference > 20) {
            console.log("positionData.operationType2", positionData.operationType);
            return { inCount: positionData.inCount, failCount: positionData.failCount, operationType: "idle" };
          } else {
            console.log("positionData.operationType3", positionData.operationType);

            return { inCount: positionData.inCount, failCount: positionData.failCount, operationType: this.getOperationTypeString(positionData.operationType) };

          }

        }
        console.log("positionData.operationType4", positionData.operationType);

        return positionData || { inCount: 0, failCount: 0, operationType: "idle" }; // 如果没有找到，返回一个空对象

      }


    },


    getStatusByType(operationType) {
      
      switch (operationType) {
        case 'idle':
          return 'info';   // 灰色
        case 'testing':
          return 'default';  // 蓝色
        case 'PASS':
          return 'success'; // 绿色
        case 'FAIL':
          return 'danger';  // 红色
        default:
          return 'default'; // 默认灰色
      }
    },

    getStatusType(location) {
        console.log("getStatusType执行",this.currentPositionJob.length);

      const positionData = this.currentPositionJob.find(item => item.position === location);
      // 二次更改operationType
      if (positionData) {
        // 时间差
        const now = new Date();
        const operationTime = new Date(positionData.operationTime);
        const timeDifference = now - operationTime;
        const minutesDifference = timeDifference / (1000 * 60);
        if (positionData.operationType && (positionData.operationType == 3 || positionData.operationType == 4) && minutesDifference > 20) {
          return this.getStatusByType("idle");
        } else {
          return this.getStatusByType(this.getOperationTypeString(positionData.operationType));
        }
      }

      return positionData ? this.getStatusByType(this.getOperationTypeString(positionData.operationType)) : 'info';
    },

    getStatusText(location) {
        console.log("getStatusText执行",this.currentPositionJob.length);

      const positionData = this.currentPositionJob.find(item => item.position === location);
      if (positionData) {
        // 时间差
        const now = new Date();
        const operationTime = new Date(positionData.operationTime);
        const timeDifference = now - operationTime;
        const minutesDifference = timeDifference / (1000 * 60);

        if (positionData.operationType && (positionData.operationType == 3 || positionData.operationType == 4) && minutesDifference > 20) {
          return "idle";
        } else {
          return this.getOperationTypeString(positionData.operationType);
        }
      }

      return positionData ? positionData.operationType : 'idle';
    },


      getInCount(location) {
      const positionData = this.currentPositionJob.find(item => item.position === location);

      return positionData ? positionData.inCount : '0';
    },
        getFailCount(location) {
      const positionData = this.currentPositionJob.find(item => item.position === location);

      return positionData ? positionData.failCount : '0';
    },

    getOperationTypeString(code) {
      switch (code) {
        case 3:
          return 'PASS';  // PASS
        case 4:
          return 'FAIL';  // FAIL
        case 5:
          return 'testing';  // Reset -> 开始检测
        default:
          return 'idle'; // 默认返回“未知操作”，处理未匹配的情况
      }
    },
    getCurrentPositionJob(location) {
      const params = {
        location: location
      };
      this.$http({
        url: this.$http.adornUrl(`/cooker/cookerJob/getCurrentPositionJob`),  // 接口地址
        method: 'post',              //  POST 请求
        data: params,                // 使用 data 传递参数
      }).then((response) => {
        console.log(response)
        const data = response.data.data;  // 解析后端返回的分页数据
        console.log('currentPositionJob', data);
        this.currentPositionJob = data
      }).catch((error) => {
        this.$message.error('加载数据失败');
        console.log('获取数据失败：', error);
      });
    },



    // 获取位置字典
    geSysList(code) {
      this.code = code;
      this.$http({
        url: this.$http.adornUrl('/sys/dictitem/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': 1,
          'limit': 1000,
          'code': code
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.locationOptions = data.page.list
        } else {
          this.locationOptions = []
        }
      })
    },

  }
}
</script>
<style>
.top-contain {
  margin: 20px;
  height: 250px;
  width: 100%; /* 让宽度适应屏幕 */
  max-width: 1870px; /* 限制最大宽度 */
  position: fixed;
}

.bottom {
  display: flex; /* 使用 Flexbox 布局 */
  align-items: center; /* 垂直居中对齐 */
  justify-content: space-between; /* 如果需要，子元素之间可以有间距 */
}
.main-contain-img {
  background-image: url("../../assets/img/left-top-bg.jpg");
  background-size: cover; /* 让背景图片覆盖整个 div */
  background-position: center; /* 图片居中 */
  width: 100%;
  height: 500px;
}
.main-contain {
  position: fixed;
  top: 320px;
  width: 1520px;
  height: 550px;
  margin: 20px;
}
.right-contain {
  position: fixed;
  top: 250px;
  width: 330px;
  height: 620px;
  left: 1540px;
  margin: 20px;
}
.show-item {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
.image {
  max-width: 100%; /* 防止图片超出容器 */
  max-height: 100%; /* 防止图片超出容器 */
  width: 150px;
}
.status-tag {
}
.custom-row {
  margin-bottom: 20px; /* 设置行与行之间的间距 */
}
</style>