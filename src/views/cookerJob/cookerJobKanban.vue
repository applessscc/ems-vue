<template>
  <div>

    <div class="top-contain">
      <el-card style="height: 250px;" v-if="locationOptions.length && this.currentPositionJob.length">
        <el-row :gutter="24" style="display: flex;" class="custom-row ">
          <el-col v-for="(item, index) in locationOptions.slice(0, 6)" :key="index" :span="4" class="show-item">
            <el-card :body-style="{ padding: '10px', border: '12px solid ' + getBorderClour(item.item) }" shadow="hover">

              <div>
                <img src="../../assets/img/left-top-bg.jpg" class="image" @click.stop="$router.push({ name: 'cookerJob', query: { location: item.item } })">

              </div>

              <div claas="right-status-container" style="margin-top: 8px;">
                <!-- 位置 -->
                <div class="item-desc">{{ item.value }}</div>
                <!-- 下方显示栏 -->
                <div class="bottom clearfix" style="margin-top: 5px;">
                  <el-tag :type="getStatusType(item.item)" class="status-tag">
                    {{ getStatusText(item.item) }}
                  </el-tag>
                  <div class="right-info">
                    <div class="info-item">
                      <span class="label">&nbsp;&nbsp;入站:</span>
                      <span class="value">{{getInCount(item.item) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">不良品:</span>
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
      <el-card style="height: 650px;">
        <el-row :gutter="10">
          <el-col :span="17" class="show-item">
            <el-card style="height: 600px;width:1000px" shadow="hover">

              <div class="main-contain-echat" style="width: 980px;">
                <div ref="echart" style="width: 980px; height: 580px;"></div>
              </div>

            </el-card>
          </el-col>
          <el-col :span="7" class="show-item">
            <el-card style="height: 600px;width:400px" shadow="hover">
              <div>

                <el-descriptions border :title="'检修统计'" :column="2">
                  <el-descriptions-item label="今日出站数">11</el-descriptions-item>
                  <el-descriptions-item label="今日进站数">32</el-descriptions-item>
                </el-descriptions>

                <el-descriptions border :title="'WIP'" :column="2" style="margin-top: 25px;">
                  <el-descriptions-item label="今日待检">122</el-descriptions-item>
                  <el-descriptions-item label="3天未检" :style="{ backgroundColor: '#e9c6c6' }">22</el-descriptions-item>
                  <el-descriptions-item label="5天未检"  :style="{ backgroundColor: '#e48383' }">13</el-descriptions-item>
                  <el-descriptions-item label="不良品（未出站）" :style="{ backgroundColor: '#e48383' }">1</el-descriptions-item>
                </el-descriptions>

              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>

    </div>

    <div class="right-contain">
      <el-card style="height: 930px;" v-if="locationOptions.length && this.currentPositionJob.length">

        <el-row :gutter="10" class="custom-row">
          <el-col :span="24" class="show-item">
            <el-card :body-style="{ padding: '1px', border: '12px solid ' + getBorderClour(this.locationOptions[6].item) }" shadow="hover">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div claas="right-status-container" style="margin-top: 8px;">
                <div class="item-desc">{{this.locationOptions[6].value}}</div>
                <!-- 下方显示栏 -->
                <!-- 下方显示栏 -->
                <div class="bottom clearfix" style="margin-top: 8px;">
                  <el-tag :type="getStatusType(this.locationOptions[6].item)" class="status-tag">
                    {{ getStatusText(this.locationOptions[6].item) }}
                  </el-tag>
                  <div class="right-info">
                    <div class="info-item">
                      <span class="label">&nbsp;&nbsp;入站:</span>
                      <span class="value">{{getInCount(this.locationOptions[7].item) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">不良品:</span>
                      <span class="value">{{getFailCount(this.locationOptions[7].item)}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter="10" class="custom-row">
          <el-col :span="24" class="show-item">
            <el-card :body-style="{ padding: '1px', border: '12px solid ' + getBorderClour(this.locationOptions[7].item) }" shadow="hover">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div claas="right-status-container" style="margin-top: 8px;">
                <div class="item-desc">{{this.locationOptions[7].value}}</div>
                <!-- 下方显示栏 -->
                <!-- 下方显示栏 -->
                <div class="bottom clearfix" style="margin-top: 8px;">
                  <el-tag :type="getStatusType(this.locationOptions[7].item)" class="status-tag">
                    {{ getStatusText(this.locationOptions[7].item) }}
                  </el-tag>
                  <div class="right-info">
                    <div class="info-item">
                      <span class="label">&nbsp;&nbsp;入站:</span>
                      <span class="value">{{getInCount(this.locationOptions[7].item) }}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">不良品:</span>
                      <span class="value">{{getFailCount(this.locationOptions[7].item)}}</span>
                    </div>
                  </div>
                </div>

              </div>
            </el-card>
          </el-col>
        </el-row>

        <el-row :gutter=10 class="custom-row">
          <el-col :span="24" class="show-item">
            <el-card :body-style="{ padding: '1px', border: '12px solid ' + getBorderClour(this.locationOptions[8].item) }" shadow="hover">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div claas="right-status-container" style="margin-top: 8px;">
                <div class="item-desc">{{this.locationOptions[8].value}}</div>
                <!-- 下方显示栏 -->
                <!-- 下方显示栏 -->
                <div class="bottom clearfix" style="margin-top: 8px;">
                  <el-tag :type="getStatusType(this.locationOptions[8].item)" class="status-tag">
                    {{ getStatusText(this.locationOptions[8].item) }}
                  </el-tag>
                  <div class="right-info">
                    <div class="info-item">
                      <span class="label">&nbsp;&nbsp;&nbsp;入站:</span>
                      <span class="value">{{getInCount(this.locationOptions[8].item)}}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">不良品:</span>
                      <span class="value">{{getFailCount(this.locationOptions[8].item)}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="custom-row">
          <el-col :span="24" class="show-item">
            <el-card :body-style="{ padding: '1px', border: '12px solid ' + getBorderClour(this.locationOptions[9].item) }" shadow="hover">
              <img src="../../assets/img/left-top-bg.jpg" class="image">

              <div claas="right-status-container " style="margin-top: 8px;">
                <div class="item-desc">{{this.locationOptions[9].value}}</div>
                <!-- 下方显示栏 -->
                <div class="bottom clearfix" style="margin-top: 8px;">
                  <el-tag :type="getStatusType(this.locationOptions[9].item)" class="status-tag">
                    {{ getStatusText(this.locationOptions[9].item) }}
                  </el-tag>
                  <div class="right-info">
                    <div class="info-item">
                      <span class="label">&nbsp;&nbsp;入站:</span>
                      <span class="value">{{getInCount(this.locationOptions[9].item)}}</span>
                    </div>
                    <div class="info-item">
                      <span class="label">不良品:</span>
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
import * as echarts from 'echarts'; // 引入echarts

export default {

  data() {


    return {
      // echart总进站数和不良品数
      inCount: [],
      failCount: [],

      // 当前位置的任务信息
      currentPositionJob: [],

      // 位置选项
      locationOptions: [],
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
    this.getDailyDate();
    this.intervalId = setInterval(() => {
      this.getCurrentPositionJob();
    }, 10000); // 5000 毫秒，即 5 秒

  },
  methods: {

    // 位置边框颜色 
    getBorderClour(position) {
      console.log('getBorderClourposition', position);
      const positionData = this.currentPositionJob.find(item => item.position === position);
      if (positionData) {
        const now = new Date();
        const operationTime = new Date(positionData.operationTime);
        const timeDifference = now - operationTime;
        const minutesDifference = timeDifference / (1000 * 60);
        console.log('minutesDifference', minutesDifference);


        // 1小时没操作灰色
        if (minutesDifference > 60) {
          console.log('minutesDifference < 30');
          return ' #c0c4cc';
          // 30分没操作黄色
        } else if (minutesDifference > 30) {
          console.log('minutesDifference < 60');
          return ' #FFFFE0';
          // 有操作不设置边框
        } else {
          console.log('else');
          return 'while';
        }
      } else {
        console.log('elseelse');
        return ' #c0c4cc';
      }

    },

    getDailyDate(location) {
      const params = {
        location: location
      };
      this.$http({
        url: this.$http.adornUrl(`/cooker/cookerJob/getDailyDate`),  // 接口地址
        method: 'get',              //  POST 请求
        params: params,                // 使用 data 传递参数
      }).then((response) => {
        console.log(response)
        const data = response.data.data;  // 解析后端返回的分页数据
        this.inCount = data.in;
        this.failCount = data.fail;
        this.initChart(); // 在数据加载完之后初始化图表

      }).catch((error) => {
        this.$message.error('加载数据失败');
        console.log('获取数据失败：', error);
      });
    },
    initChart() {

      const myChart2 = echarts.getInstanceByDom(this.$refs.echart);
      if (myChart2) {
        myChart2.dispose();  // 销毁已有的图表实例
      }

      const myChart = echarts.init(this.$refs.echart);


      // 更新图表配置项
      const option = {
        legend: {
          data: ['总进站数', '不良品数'],
          top: 'top',
          left: 'center',
        },
        xAxis: {
          type: 'category',
          data: [
            '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
            '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
            '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
          ],
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '总进站数',
            data: this.inCount,  // 使用动态数据
            type: 'bar',
          },
          {
            name: '不良品数',
            data: this.failCount, // 使用动态数据
            type: 'bar',
            itemStyle: {
              color: 'lightcoral',
            },
          },
        ],
      };

      // 设置图表的配置项
      myChart.setOption(option);
    },


    totalInbound() {
      return (position) => {
        console.log("totalInbound执行", this.currentPositionJob.length);
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
      console.log("getStatusType执行", this.currentPositionJob.length);

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
      console.log("getStatusText执行", this.currentPositionJob.length);

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
      };

      this.$http({
        url: this.$http.adornUrl('/cooker/cookerJob/getCurrentPositionJob'),  // 接口地址
        method: 'get',                // GET 请求
        params: params,               // 使用 params 传递查询参数
      }).then((response) => {
        console.log(response);
        const data = response.data.data;  // 解析后端返回的分页数据
        console.log('currentPositionJob', data);
        this.currentPositionJob = data;
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
  width: 1520px; /* 让宽度适应屏幕 */
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
  top: 270px;
  width: 1520px;
  height: 650px;
  margin: 20px;
}
.right-contain {
  position: fixed;
  width: 330px;
  height: 920px;
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
  width: 190px;
}
.status-tag {
  font-size: 16px;
}
.custom-row {
  margin-bottom: 20px; /* 设置行与行之间的间距 */
}
.right-status-container {
  margin: 8px;
}
.item-desc {
  text-align: center;
}
.bottom clearfix {
  margin-top: 5px;
}
.el-card__body {
  padding: 7px;
}
</style>