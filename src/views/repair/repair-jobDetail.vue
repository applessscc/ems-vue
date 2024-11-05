<template>
  <!-- 描述列表 -->
  <div class="jobDetail-descriptions-container">
    <el-card class="box-card" style="width: 100%;">
      <span style="display: flex; align-items: center; justify-content: space-between;">
        <h3 class="card-title">任务详情</h3>
        <el-button @click="$router.push({ name: 'repair-index'})">返回</el-button>
      </span> <el-divider></el-divider>
      <el-descriptions :border=true>
        <el-descriptions-item label="任务ID">{{jobDetail.repair.jobId}}</el-descriptions-item>
        <el-descriptions-item label="任务状态">{{getJobStatusName(jobDetail.repair.status)}}</el-descriptions-item>
        <el-descriptions-item label="设备号">{{jobDetail.repair.equipment}}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{jobDetail.repair.createTime}}</el-descriptions-item>
        <el-descriptions-item label="发生时间">{{jobDetail.repair.eventTime}}</el-descriptions-item>
        <el-descriptions-item label="故障位置">{{jobDetail.repair.floor+'-'+jobDetail.repair.corridor+'-'+jobDetail.repair.position}}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{jobDetail.repair.proposerName}}</el-descriptions-item>
        <el-descriptions-item label="描述">{{jobDetail.repair.description}}</el-descriptions-item>
        <el-descriptions-item label="备注">{{jobDetail.repair.remark}}</el-descriptions-item>
        <el-descriptions-item label="严重程度">{{getSeverityName(jobDetail.repair.severity)}}</el-descriptions-item>
        <el-descriptions-item label="发生频率">{{getfrequencyName(jobDetail.repair.frequency)}}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions :border=true direction="vertical">
        <el-descriptions-item label="图片">
          <div style="display: flex; gap: 5px; ">
            <img v-for="(img, index) in jobDetail.repairImagesList" :key="index" :src="`data:image/jpeg;base64,${img.fileData}`" alt="图片" style="width: 120px; height: auto; cursor: pointer;" @click="showImage(img.fileData)">
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-card class="box-card" style="width: 40%;">
      <h3 class="card-title">操作日志</h3> <!-- 添加标题 -->
      <el-divider></el-divider>

      <div class="block" v-if="jobDetail">
        <el-timeline>
          <el-timeline-item v-for="(item, index) in jobDetail.repairLogList" :key="index" :timestamp="item.createTime" placement="top">
            <el-card>
              <h4>{{getOperationTypeName(item.operationType) }}</h4>
              <p>{{ item.handlerName }} 提交于 {{ item.createTime }}</p>

              <div v-if="jobDetail.jobDetail.imageList && item.operationType == 'deal'">
                <p>图片：</p>
                <div style="display: flex; gap: 5px; ">
                  <img v-for="(img, index) in jobDetail.jobDetail.imageList" :key="index" :src="`data:image/jpeg;base64,${img.fileData}`" alt="图片" style="width: 120px; height: auto; cursor: pointer;" @click="showImage(img.fileData)">
                </div>
              </div>

              <p v-if="jobDetail.jobDetail.remark && item.operationType == 'deal'">备注：{{ jobDetail.jobDetail.remark }}</p>

            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

    </el-card>

  </div>

</template>

<script>
export default {
  name: 'jobDetail',
  components: {
  },
  data() {
    return {
      jobDetail: {
        jObDetail:{},
      repair: {}, // 确保 repair 对象存在
     repairImagesList: [],
      repairLogList: []

      },

    }
  },
  created() {
    this.fetchData()

  },

  watch: {
  '$route.query.jobId'(newJobId) {
    if (newJobId) {
      this.fetchData();
    }
  }
},
  mounted() {
        // this.fetchData()

  },

  methods: {


    getSeverityName(code) {
      if (code == 1) {
        return "轻微"
      } else if (code == 2) {
        return "中等"
      } else if (code == 4) {
        return "非常严重"
      } else if (code == 5) {
        return "极其严重"
      } else {
        return "未知状态"
      }
    },

    getfrequencyName(code) {
      if (code == 1) {
        return "极少"
      } else if (code == 2) {
        return "经常"
      } else if (code == 4) {
        return "偶尔"
      } else if (code == 5) {
        return "不定期"
      } else {
        return "未知状态"
      }
    },

    getJobStatusName(jobStatusCode) {
      if (jobStatusCode == 1) {
        return "待处理"
      } else if (jobStatusCode == 2) {
        return "处理中"
      } else if (jobStatusCode == 4) {
        return "已完成"
      } else if (jobStatusCode == 5) {
        return "已确认"
      } else if (jobStatusCode == 6) {
        return "已取消"
      } else if (jobStatusCode == 7) {
        return "关闭"
      } else {
        return "未知状态"
      }
    },

    getOperationTypeName(operationType) {
      if (operationType == "submit") {
        return "提交";
      } else if (operationType == "deal") {
        return "处理";
      } else if (operationType == "finish") {
        return "完成";
      } else if (operationType == "confirm") {
        return "确认";
      } else if (operationType == "cancel") {
        return "取消任务";
      } else {
        return "未知状态";
      }
    },

    fetchData() {
      const params = {
        jobId: this.$route.query.jobId
      };
      console.log("请求获取报修任务", this.jobDetail);

      this.$http({
        url: this.$http.adornUrl(`/job/repair/jobDetail`),
        method: 'get',
        params: params
      }).then((response) => {
        const data = response.data.data;
        this.jobDetail = data;

        console.log("获取报修任务详情成功", this.jobDetail);
      }).catch((error) => {

        console.log('获取数据失败：', error);
      });
    }
  }
}

</script>

<style>
/* 卡片样式 */
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.box-card {
  margin-top: 20px; /* 添加间距 */
}

.card-title {
  /* 新增样式 */
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 18px; /* 添加间距 */

  color: #333; /* 你可以根据需求修改颜色 */
}
</style>
