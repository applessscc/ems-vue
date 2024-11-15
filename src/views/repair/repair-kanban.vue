<template>

  <el-main>
    <!-- 报修统计 -->
    <el-row :gutter="20" type="flex" class="row-bg" justify="center" style="margin-bottom: 1px">
      <el-col :span="8">

        <div class="show-header" style="background: #409EFF">
          <div class="show-num">{{ boardData.waitDealNum }}</div>
          <div class="bottom-text">待处理</div>
        </div>

        <div class="show-header" style="background: #FFA500">
          <div class="show-num">{{ boardData.waitConfirmNum }}</div>
          <div class="bottom-text">待确认</div>
        </div>

      </el-col>
      <el-col :span="8">

        <div class="show-header" style="background:#FFD700">
          <div class="show-num">{{ boardData.timeOutNum }}</div>
          <div class="bottom-text">超时</div>
        </div>

        <div class="show-header" style="background:#FF4D4D">
          <div class="show-num">{{ boardData.severityNum }}</div>
          <div class="bottom-text">紧急待处理</div>
        </div>

      </el-col>
      <el-col :span="8">

        <div class="show-header" style="background: #67C23A">
          <div class="show-num">{{ boardData.waitFinishNum }}</div>
          <div class="bottom-text">待完成</div>
        </div>

        <div class="show-header" style="background:#B0B0B0">
          <div class="show-num">{{ boardData.cancelNum }}</div>
          <div class="bottom-text">已取消</div>
        </div>

      </el-col>
    </el-row>


    <repairListVue ref="repairList" @flshboardData="flshboardData"></repairListVue>

  </el-main>

</template>
  
  <script>
import repairListVue from './repair-kanbanList.vue'

export default {
  name: 'Dashboard',
  components: {
    repairListVue
  },
  data() {
    return {
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
  },


  methods: {

    // 刷新看板
    flshboardData() {
      console.log("报修数据看板触发刷新数据")
      this.fetchData()
    },

    // 获取看板数据
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

.show-num {
  font-size: 38px;
  font-weight: 600;
  padding: 5px;
  display: flex;
  justify-content: center;
}
</style>
  