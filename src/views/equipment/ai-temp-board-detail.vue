<template>
  <div id="data-view">

    <div class="main-header">

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="实时数据" style="margin-right: 30px;">
          <el-switch v-model="pageTimerSwitch" active-color="#13ce66" inactive-color="#cccccc" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <!-- <el-form-item label="所属SUB">

            <el-select v-model="searchForm.buName" placeholder="请选择BU">
              <el-option v-for="op in buNameOptions" :key="op.item" :label="op.value" :value="op.item" />
            </el-select>
          </el-form-item> -->

        <el-form-item label="AI名称">
          <el-select v-model="searchForm.aiName" placeholder="请选择AI名称" multiple :clearable="true" collapse-tags>
            <el-option v-for="(op, index) in AINameList" :key="index" :label="op" :value="op" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="search(false)">搜索</el-button>
          <el-button @click="resetForm">重置</el-button>
          <!-- <el-button type="primary" @click="search(true)">导出</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <!-- 顶部容器 -->
    <div class="echart-div">
      <div ref="echart" class="echartContaion"></div>
      <!-- <div class="warmContaion">
      </div> -->
    </div>

    <!-- 顶部容器 -->
    <div class="echart-list-div">

      <!-- <el-card style="height: 300px"> -->





      <template slot="header">
        <el-row type="flex" justify="space-between" align="middle">
          <div class="title" style="font-weight: bold;">温度异常列表</div>
        </el-row>
        <!-- <div class="title">温度异常列表</div> -->
      </template>

      <el-table :data="tableData2" border style="width: 90% ;" :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ textAlign: 'center' }" height="180" :row-class-name="rowClassName" size="mini"
        empty-text="暂无数据">
        <el-table-column prop="aiName" label="AI名称" width="200px">
        </el-table-column>
        <el-table-column prop="currentRealTimeValue" label="实时温度" width="115"
          :formatter="(row, column, cellValue) => `${cellValue}℃`">
        </el-table-column>
        <el-table-column prop="dayUnqualifiedMinutes" label="日不合格分钟数"></el-table-column>
      </el-table>
      <!-- </el-card> -->
    </div>

    <div class="table-head">
      <!-- 表头不滚动 -->
          <!-- <el-table :data="tableData" style="width: 100%" v-loading="loading" :show-header="true"  :default-sort="{prop: 'currentRealTimeValue', order: 'descending'}"
            :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }">
            <el-table-column prop="aiName" label="AI名称" width="250" sortable></el-table-column>
            <el-table-column prop="day" label="日" width="150" sortable></el-table-column>
            <el-table-column prop="currentRealTimeValue" label="实时温度" width="200"
              :formatter="(row, column, cellValue) => `${cellValue}℃`" sortable></el-table-column>

            <el-table-column prop="dayMaxTime" label="日最大时间" width="220" sortable></el-table-column>
            <el-table-column prop="dayMaxValue" label="日最大值" width="220"
              :formatter="(row, column, cellValue) => `${cellValue}℃`" sortable>
            </el-table-column>
            <el-table-column prop="dayMinTime" label="日最小时间" width="220" sortable></el-table-column>
            <el-table-column prop="dayMinValue" label="日最小值" width="220"
              :formatter="(row, column, cellValue) => `${cellValue}℃`" sortable></el-table-column>
            <el-table-column prop="avg" label="日平均值" width="220"
              :formatter="(row, column, cellValue) => `${(cellValue).toFixed(2)}℃`" sortable></el-table-column>
          </el-table> -->
    </div>
    <!-- 底部容器 -->
    <div class="bottom-main-container">

      <div class="listContaion">
        <!-- 滚动列表 -->
         <el-table :data="tableData" style="width: 100%" v-loading="loading"  :default-sort="{prop: 'currentRealTimeValue', order: 'descending'}"
            :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }"   height="400">
            <el-table-column prop="aiName" label="AI名称" width="250" sortable></el-table-column>
            <el-table-column prop="day" label="日" width="150" sortable></el-table-column>
            <el-table-column prop="currentRealTimeValue" label="实时温度" width="200"
              :formatter="(row, column, cellValue) => `${cellValue}℃`" sortable></el-table-column>
            <el-table-column prop="dayMaxTime" label="日最大时间" width="220" sortable></el-table-column>
            <el-table-column prop="dayMaxValue" label="日最大值" width="220"
              :formatter="(row, column, cellValue) => `${cellValue}℃`" sortable>
            </el-table-column>
            <el-table-column prop="dayMinTime" label="日最小时间" width="220" sortable></el-table-column>
            <el-table-column prop="dayMinValue" label="日最小值" width="220"
              :formatter="(row, column, cellValue) => `${cellValue}℃`" sortable></el-table-column>
            <el-table-column prop="avg" label="日平均值" width="220"
              :formatter="(row, column, cellValue) => `${(cellValue).toFixed(2)}℃`" sortable></el-table-column>
          </el-table>

      </div>
    </div>

  </div>
</template>

<script>
import * as echarts from 'echarts';
import dark from '@/theme/dark.json'
import { now } from 'moment';
import { saveVisitLog } from '@/utils/commonUtils.js'


export default {
  created() {
    saveVisitLog('CMS 实时温度详情-访问');
  },
  data() {
    return {

      tableData2: [],





      // 实时数据开关
      pageTimerSwitch: false,
      // 表格数据
      tableData: [],
      loading: true,
      currentSelect: 1,


      // 搜索
      searchForm: {
        aiName: [],
        dateRange: [],
      },




      isStart: false,




      buNameOptions: ["b9", "b8"],
      AINameList: [
        "B8后化学危险品仓1#房温度",
        "B8后化学危险品仓2#房温度",
        "B8后化学危险品仓3#房温度",
        "B8后化学危险品仓4#房温度",
        "B8后化学危险品仓5#房温度",
        "B8后化学危险品仓6#房温度",
        "B6后化学危险品仓1#房温度",
        "B6后化学危险品仓2#房温度",
        "B6后化学危险品仓3#房温度",
        "B6后化学危险品仓4#房温度",
        "B6后化学危险品仓5#房温度",
        "B6后化学危险品仓6#房温度",
        "B9/1#变压房温湿度计 温度",
        "B9/2#变压房温湿度计 温度"
      ],

      // 折线图
      series: [],
      xAxisData: [],
      yMax: 0,
      yMin: 0,


    }
  },
  mounted() {
    console.log("开始加载数据")
    this.$nextTick(() => {

      // 给 ECharts 渲染加一个延时，确保 DOM 完全渲染
      setTimeout(() => {
        this.initChart();
      }, 100); // 延时 100ms 再初始化


      this.fetchData();

      // 滚动表格
      this.startAutoScroll();

      setInterval(() => {
        if (this.pageTimerSwitch == true) {
          console.log("开始加载实时数据")
          this.reflashData()
        }

      }, 60000);
    });

    window.addEventListener('resize', this.resizeChart); // 监听窗口大小变化




  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart); // 清理监听事件
  },

  methods: {
    rowClassName() {
      return 'error-row';
    },

    reflashData() {
      this.fetchData()
    },



    // 滚动表格
    startAutoScroll() {

      // 不滚动了 滚不动了

      // const scrollContainer = document.querySelector('.scroll-container');
      // let scrollStep = 1; // 每次滚动的像素数
      // setInterval(() => {
      //   scrollContainer.scrollTop += scrollStep;
      //   // 如果滚动到底部，回到顶部继续滚动
      //   if (scrollContainer.scrollTop + scrollContainer.clientHeight + 5 >= scrollContainer.scrollHeight) {
      //     scrollContainer.scrollTop = 0;
      //   }
      // }, 50); // 滚动间隔，单位为毫秒，可以调整以控制滚动速度
    },
    // 表单搜索功能
    search(isExport) {
      console.log("搜索条件:", this.searchForm, isExport);
      this.fetchData(isExport)

    },
    // 重置搜索框表单
    resetForm() {
      this.searchForm = {
        replyName: null,
        statusList: [],
        dateRange: []
      }
    },
    initChart() {
      // 获取当前容器的 ECharts 实例，如果已经初始化了图表，则销毁它
      const myChart2 = echarts.getInstanceByDom(this.$refs.echart);
      if (myChart2) {
        myChart2.dispose();  // 销毁已有的图表实例
      }

      const myChart = echarts.init(this.$refs.echart);


      const option = {
        animationDuration: 2000,

        title: {
          left: 'center',
          text: '实时温度曲线',

        },

        tooltip: {
          order: 'valueDesc',
          trigger: 'axis',
          // 设置 tooltip 的 position 为一个函数
          position: function (point, params, dom, rect, size) {
            // point 是鼠标当前的位置 [x, y]
            // 可以通过调整 y 值来让 tooltip 出现在鼠标下方
            return [point[0], point[1] + 10]; // 向下偏移 10px
          }
        },

        xAxis: {
          data: this.xAxisData
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}℃',  // 显示温度单位
          },
          max: this.yMax, // y轴最大值
          min: this.yMin, // y轴最小值
          splitNumber: 12, // y轴刻度数量


        },
        series: this.series
      };

      myChart.setOption(option);
    },
    resizeChart() {
      const myChart = echarts.getInstanceByDom(this.$refs.echart);
      if (myChart) {
        myChart.resize();
      }
    },


    fetchData(isExport) {
      this.loading = true;
      const params = {
        isExport: isExport,
        aiName: this.searchForm.aiName,
        loginInId: this.$store.state.user.id,
        startDate: this.searchForm.dateRange && this.searchForm.dateRange[0]
          ? this.searchForm.dateRange[0]
          : null,
        endDate: this.searchForm.dateRange && this.searchForm.dateRange[1]
          ? this.searchForm.dateRange[1]
          : null,
      };
      this.$http({
        url: this.$http.adornUrl(`/equipment/transformer/getAIList`),  // 接口地址
        method: 'post',              //  POST 请求
        data: params,                // 使用 data 传递参数
        responseType: isExport ? 'blob' : 'json' // 如果是导出，设置为 blob

      }).then((response) => {
        if (isExport) {
          // 处理导出的文件
          // const { data } = response
          // const link = document.createElement('a');
          // let blob = new Blob([data], {
          //   type: 'application/vnd.ms-excel;charset=UTF-8'
          // })
          // link.style.display = 'none'

          // link.href = URL.createObjectURL(blob);
          // link.download = `实时温度-${moment(new Date()).format('YYYYMMDD HHmmss')}.xlsx`
          // // document.body.appendChild(link)
          // link.click();
          // https://www.microsoft.com/zh-cn/download/details.aspx?id=16614
          // https://learn.microsoft.com/zh-cn/dotnet/core/install/windows#net-installer


          // 处理导出的文件
          const blob = response.data;
          const link = document.createElement('a');
          link.href = URL.createObjectURL(new Blob([blob]))
          link.download = 'exported_file.xlsx';  // 设置下载文件名
          document.body.appendChild(link)
          link.click()
          window.setTimeout(function () {
            URL.revokeObjectURL(link.href)
            document.body.removeChild(link)
          }, 0)


        } else {
          const data = response.data.data.aiList;  // 解析后端返回的分页数据
          this.series = response.data.data.seriesList;
          const xaxisData = response.data.data.xaxisData;
          this.xAxisData = xaxisData
          this.tableData = data;       // 表格数据
          this.loading = false;
          this.yMax = response.data.data.maxValue
          this.ymin = response.data.data.minValue
          console.log("max + min", this.yMax, this.ymin)
          this.initChart(); // 在数据加载完之后初始化图表


          // 封装日不合格分钟数
          // this.tableData.forEach(item => {
          //   if(item.unqualifiedMinutes !=null && item.unqualifiedMinutes !=0 ){
          //     this.tableData2.push(item);
          //   }
          // })

          this.tableData2 = [];

          this.tableData2 = data.forEach(element => {
            // console.log(element.dayUnqualifiedMinutes)
            // console.log(element.dayUnqualifiedMinutes != null && element.dayUnqualifiedMinutes != 0)
            if (element.dayUnqualifiedMinutes != null && element.dayUnqualifiedMinutes != 0) {
              this.tableData2.push(element);
            }
          });


        }


        if (!this.isStart) {
          this.startAutoScroll();
          this.isStart = true
        }
      }).catch((error) => {
        this.loading = false;
        this.$message.error('加载数据失败');
        console.log('获取数据失败：', error);
      });
    },

  }
}
</script>

<style lang="scss">
.el-table__empty-block {
  display: none;
}

.echartContaion {
  height: 395px;
  width: 80%;
}

.warmContaion {
  background-color: aqua;
  height: 395px;
  width: 20%;
}

.listContaion {
  width: 100%;
}

.search-form {
  display: flex;
  align-items: center;
}

#data-view {
  width: 100%;
  height: 100%;
  color: #fff;
}

.main-container {
  height: calc("100% - 80px");

  .border-box-content {
    padding: 20px;
    box-sizing: border-box;
  }
}

.scroll-container {
  /* display: flex;
  flex-direction: column; */

  /* 占满父容器 */
  min-height: 100%;
  /* 最大高度为视口高度，超过则滚动  */
  max-height: 100vh;
  /* 启用垂直滚动 */
  overflow-y: auto;
  /* margin: 0;  */
  /* padding: 0;  */
}

// 固定布局修改的代码

/* 让搜索栏固定 */
.main-header {
  position: fixed;
  /* 固定定位 */
  top: 20px;
  /* 距离顶部 0px */
  // left: 130px;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
  /* 确保位于其他元素之上 */
  padding-left: 20px;
}

/* 让图表固定 */
.echart-div {
  position: fixed;
  /* 固定定位 */
  top: 85px;
  /* 距离搜索栏下方 80px */
  left: 0;
  width: 100%;
  height: 395px;
  z-index: 400;
  /* 保证图表在搜索栏下方，但在内容表格之上 */
  background-color: white;
  /* 可根据需要修改背景色 */
}

/* 让内容区域有足够的空间放下固定元素 */
.bottom-main-container {
  margin-top: 500px;
  /* 给底部容器预留足够的空间（80px + 300px） */
  padding: 20px;
}

/* 滚动容器 */
.scroll-container {
  overflow-y: auto;
  max-height: calc(100vh - 580px);
  /* 根据搜索栏和图表的总高度，设置最大高度 */
}

.table-head {
  position: fixed;
  /* 固定定位 */
  top: 480px;
  left: 20px;
  z-index: 10;
  /* 确保位于其他元素之上 */
}

//
.el-select .el-input__inner {
  width: 300px;
}

.echart-list-div {
  position: fixed;
  left: 1400px;
  top: 110px;
  width: 500px;
  z-index: 9999;
  color: yellow;
  height: 300px;
}

.el-table .error-row {
  background: #ebabab;
}

/* 隐藏表格的提示信息 */
</style>
