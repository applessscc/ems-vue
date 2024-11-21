<template>
  <div id="data-view">
    <dv-full-screen-container>
      <!-- 头容器 -->
      <div class="main-header">

        <div class="mh-left">
          <el-form :inline="true" :model="searchForm" class="search-form">
            <el-form-item label="">
              <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div>
          <el-select v-model="searchForm.buName" placeholder="请选择BU" >
            <el-option v-for="op in buNameOptions" :key="op.item" :label="op.value" :value="op.item" />
          </el-select>
        </div>

        <div class="mh-middle">CMS 能耗看板</div>

          <div>
            <el-select v-model="searchForm.aiName" placeholder="请选择AI名称">
              <el-option v-for="op in AINameList" :key="op.item" :label="op.value" :value="op.value" />
            </el-select>
          </div>
          
          <div class="mh-right">

          </div>


      </div>

      <!-- 主容器 -->
      <dv-border-box-1 class="main-container" :dur="66">

        <!-- 顶部容器 -->
        <div class="top-main-container">
          <dv-border-box-10 class="top-container">
            <div class="echart-div">
              <div ref="echart" class="echartContaion"></div>
            </div>
          </dv-border-box-10>
        </div>

        <!-- 底部容器 -->
        <div class="bottom-main-container">
          <dv-border-box-10 class="bottom-container">
            <div class="listContaion">

              <!-- 表头不滚动 -->
              <el-table :data="[]" style="width: 100%" :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }">
                <el-table-column fixed label="序号" width="60">
                  <template slot-scope="scope">
                    {{ (scope.$index + 1) }}
                  </template>
                </el-table-column>
                <el-table-column prop="aiSeqNo" label="AI序号" width="180"></el-table-column>
                <el-table-column prop="day" label="日"></el-table-column>
                <el-table-column prop="aiName" label="AI名称" width="180"></el-table-column>
                <el-table-column prop="dayMaxTime" label="日最大时间" width="180"></el-table-column>
                <el-table-column prop="dayMaxValue" label="日最大值"></el-table-column>
                <el-table-column prop="dayMinTime" label="日最小时间" width="180"></el-table-column>
                <el-table-column prop="dayMinValue" label="日最小值"></el-table-column>
                <el-table-column prop="dayUnqualifiedMinutes" label="日不合格分钟数" width="180"></el-table-column>
                <el-table-column prop="avg" label="日平均值"></el-table-column>
              </el-table>

              <!-- 滚动列表 -->
              <div class="scroll-container">
                <el-table :data="tableData" style="width: 100%" v-loading="loading" :show-header="false" :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' }">
                  <el-table-column fixed label="序号" width="60">
                    <template slot-scope="scope">
                      {{ (scope.$index + 1) }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="aiSeqNo" label="AI序号" width="180"></el-table-column>
                  <el-table-column prop="day" label="日"></el-table-column>
                  <el-table-column prop="aiName" label="AI名称" width="180"></el-table-column>
                  <el-table-column prop="dayMaxTime" label="日最大时间" width="180"></el-table-column>
                  <el-table-column prop="dayMaxValue" label="日最大值"></el-table-column>
                  <el-table-column prop="dayMinTime" label="日最小时间" width="180"></el-table-column>
                  <el-table-column prop="dayMinValue" label="日最小值"></el-table-column>
                  <el-table-column prop="dayUnqualifiedMinutes" label="日不合格分钟数" width="180"></el-table-column>
                  <el-table-column prop="avg" label="日平均值"></el-table-column>
                </el-table>
              </div>

            </div>
          </dv-border-box-10>
        </div>

      </dv-border-box-1>
    </dv-full-screen-container>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import dark from '@/theme/dark.json'
import { now } from 'moment';


export default {
  data() {
    return {


      // 表格数据
      tableData: [],
      loading: true,
      currentSelect: 1,


      // 搜索
      searchForm: {
        buName:null,
        aiName:null,
        dateRange: [],
      },

    
      isStart: false,

      buNameOptions: ["b9", "b8"],
      AINameList:["a1","a2"],


      series:[],


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
      // this.startAutoScroll();
    });

    window.addEventListener('resize', this.resizeChart); // 监听窗口大小变化




  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeChart); // 清理监听事件
  },

  methods: {



    // 滚动表格
    startAutoScroll() {
      const scrollContainer = document.querySelector('.scroll-container');
      let scrollStep = 1; // 每次滚动的像素数

      setInterval(() => {
        scrollContainer.scrollTop += scrollStep;

        // 如果滚动到底部，回到顶部继续滚动
    

        if (scrollContainer.scrollTop + scrollContainer.clientHeight + 5 >= scrollContainer.scrollHeight) {
          scrollContainer.scrollTop = 0;
        }
      }, 50); // 滚动间隔，单位为毫秒，可以调整以控制滚动速度
    },
    // 表单搜索功能
    search() {
      console.log("搜索条件:", this.searchForm);
      this.fetchData()

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

      const myChart = echarts.init(this.$refs.echart,dark);
      

      const option = {
        xAxis: {
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '14', '15', '16', 
          '17', '18', '19', '20', '21', '22', '23', '24']
        },
        yAxis:  {
    type: 'value',
    axisLabel: {
      formatter: '{value}℃',  // 显示温度单位
    }
  },
        series: this.series
          // {
          //   data: this.series.data,
          //   type: 'line',
          //   smooth: true,
          //   name: 'Line 1'
          // },
          // {
          //   data: [15, 25, 18, 28, 20, 22, 26, 29, 33, 38, 42, 47, 53, 58, 63, 68, 72, 77, 82, 87, 92, 98, 103, 108, 113],
          //   type: 'line',
          //   smooth: true,
          //   name: 'Line 2'
          // },
          // {
          //   data: [20, 30, 35, 30, 25, 27, 31, 36, 41, 46, 51, 56, 61, 66, 71, 76, 81, 86, 91, 96, 101, 106, 111, 116, 121],
          //   type: 'line',
          //   smooth: true,
          //   name: 'Line 3'
          // }
        
      };

      myChart.setOption(option);
    },
    resizeChart() {
      const myChart = echarts.getInstanceByDom(this.$refs.echart);
      if (myChart) {
        myChart.resize();
      }
    },


    fetchData() {
      this.loading = true;
      const params = {
        loginInId: this.$store.state.user.id,
        startDate: this.searchForm.dateRange && this.searchForm.dateRange[0]
          ? this.searchForm.dateRange[0]
          : null,
        endDate: this.searchForm.dateRange && this.searchForm.dateRange[1]
          ? this.searchForm.dateRange[1]
          : null,
      };
      console.log(params)
      this.$http({
        url: this.$http.adornUrl(`/equipment/transformer/getAIList`),  // 接口地址
        method: 'post',              //  POST 请求
        data: params,                // 使用 data 传递参数
      }).then((response) => {
        console.log( response.data.data)
        const data = response.data.data.aiList;  // 解析后端返回的分页数据
        this.series = response.data.data.seriesList;

          console.log( "this.series",this.series)


        this.tableData = data;       // 表格数据
        this.loading = false;
            this.initChart(); // 在数据加载完之后初始化图表

        if (!this.isStart) {
          // this.startAutoScroll();
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

<style lang="scss" scoped>
.chart {
  display: flex;
  justify-content: center;
  align-items: center;
}

.echartContaion {
  height: 300px;
  width: 100%;
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
  background-color: #030409;
  color: #fff;

  /* 隐藏表格的提示信息 */
  .el-table__empty-block {
    display: none;
  }
}

#dv-full-screen-container {
  background-image: url("../../assets/img/report_bg.jpeg") !important;
  background-size: 100% 100%;
  height: 100% !important;
  box-shadow: 0 0 3px blue;
  display: flex;
  flex-direction: column;
}

.main-header {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .mh-left {
    padding-left: 20px;
  }

  .mh-middle {
    font-size: 35px;
  }

  .radio-class {
    float: right;
    margin-right: 20px;
  }

  .mh-right {
    width: 240px;
  }
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
  margin: 0;
  padding: 0;
}
</style>
