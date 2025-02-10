<template>
  <el-main>
       <!-- 报修统计 -->
    <el-row :gutter="20" type="flex" class="row-bg" justify="center" style="margin-bottom: 8px">
      <el-col :span="6">

        <div class="show-header" style="background: #409EFF">
          <div class="show-num">{{ boardData.waitDealNum }}</div>
          <div class="bottom-text">待处理</div>
        </div>

        <div class="show-header" style="background: #FFA500">
          <div class="show-num">{{ boardData.waitConfirmNum }}</div>
          <div class="bottom-text">待确认</div>
        </div>

      </el-col>
      <el-col :span="6">

        <div class="show-header" style="background:#FFD700">
          <div class="show-num">{{ boardData.timeOutNum }}</div>
          <div class="bottom-text">超时</div>
        </div>

        <div class="show-header" style="background:#FF4D4D">
          <div class="show-num">{{ boardData.severityNum }}</div>
          <div class="bottom-text">紧急待处理</div>
        </div>

      </el-col>
      <el-col :span="6">

        <div class="show-header" style="background: #67C23A">
          <div class="show-num">{{ boardData.waitFinishNum }}</div>
          <div class="bottom-text">待完成</div>
        </div>

        <div class="show-header" style="background:#B0B0B0">
          <div class="show-num">{{ boardData.cancelNum }}</div>
          <div class="bottom-text">已取消</div>
        </div>

      </el-col>

      <!-- 饼图 -->
      <el-col :span="8" class="chart">
        <div ref="chart" style="width: 349px; height: 180px;"></div>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <repairListVue ref="repairList" @flshboardData="flshboardData"></repairListVue>

  </el-main>

</template>

<script>
import repairListVue from './repair-list.vue'
import * as echarts from 'echarts';

import { saveVisitLog } from '@/utils/commonUtils.js'
export default {
  name: 'Dashboard',
  components: {
    repairListVue
  },
  data() {
    return {

      // 饼图
      chart: null,
      chartData: {},

      // 看板
      boardData: {
        waitDealNum: 0,
        waitFinishNum: 0,
        waitConfirmNum: 0,
        cancelNum: 0,
        severityNum: 0,
        timeOutNum: 0
      }


    }
  },
  mounted() {
    // 这里可以添加获取表格数据的逻辑
    this.fetchData()
    this.$refs.repairList.fetchData(); // 调用子组件的方法

    // 饼图
    // 创建一个 ECharts 实例
    this.chart = echarts.init(this.$refs.chart)


  },
  creaed() {
        saveVisitLog('CMS 报修任务首页-访问');
  },


  methods: {
    getOption() {
      return {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: "vertical", //图例的显示方式  默认横向显示 horizontal  vertical
          itemWidth: 14, //图例颜色块的宽度和高度
          itemHeight: 14,

          top: '5%',
          right: '70%',
          color: ['#409EFF', '#FFA500', '#FFD700', '#FF4D4D', '#67C23A', '#B0B0B0'], // 图例的颜色和饼图颜色一致

        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['25%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 15,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: this.boardData.waitDealNum, name: '待处理' },
              { value: this.boardData.waitConfirmNum, name: '待确认' },
              { value: this.boardData.timeOutNum, name: '超时' },
              { value: this.boardData.severityNum, name: '紧急待处理' },
              { value: this.boardData.waitFinishNum, name: '待完成' },
              { value: this.boardData.cancelNum, name: '已取消' },


            ],
            itemStyle: {
            borderRadius: 5,        
            borderColor: '#fff',
            borderWidth: 2,

              color: (params) => {
                const colorList = ['#409EFF', '#FFA500', '#FFD700', '#FF4D4D', '#67C23A', '#B0B0B0'];
                return colorList[params.dataIndex]; // 根据数据索引返回相应的颜色
              }
            }
          }
        ]
      };
    },

    flshboardData() {
      console.log("报修数据看板触发刷新数据")
      this.fetchData()
    },
    fetchData() {
      console.log("获取首页看板数据")
      const params = {
        userId: this.$store.state.user.id
      };
      this.$http({
        url: this.$http.adornUrl(`/job/repair/getBoardData`),
        method: 'get',
        params: params
      }).then((response) => {
        console.log("获取首页看板数据成功", response);
        const data = response.data.data;
        this.boardData = data;

        // 在 ECharts 实例中配置图表
        this.chart.setOption(this.getOption())
      }).catch((error) => {
        console.log('获取数据失败：', error);
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.bottom-text {
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  height: 25px;
  line-height: 25px;
  text-align: center;
  position: absolute;
  font-weight: 600;
}

.show-header {
  background: #00c0ef;
  color: #fff;
  height: 80px;
  border-radius: 5px;
  position: relative;
  margin-bottom: 15px;
}
.chart {
  display: flex;
  justify-content: center;
  align-items: center; /* 垂直居中对齐饼图 */
}

.show-num {
  font-size: 38px;
  font-weight: 600;
  padding: 5px;
  display: flex;
  justify-content: center;
}
</style>

