<template>
  <div>
    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="申请人">
        <el-input v-model="searchForm.replyName" placeholder="请输入申请人名称"></el-input>
      </el-form-item>
      <el-form-item label="任务状态">
        <el-select v-model="searchForm.jobStatusList" placeholder="请选择任务状态" multiple>
          <el-option label="待处理" value="1"></el-option>
          <el-option label="处理中" value="2"></el-option>
          <el-option label="已完成" value="4"></el-option>
          <el-option label="已确认" value="5"></el-option>
          <el-option label="已取消" value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="handleOpen" style="margin-bottom: 20px;">
      申请报修
    </el-button>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column fixed label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="任务状态" width="130">
        <template slot-scope="scope">
          {{ getJobStatusName(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="150">
      </el-table-column>
      <el-table-column label="故障位置" width="130">
        <template slot-scope="scope">
          {{scope.row.floor+'-'+scope.row.corridor+'-'+scope.row.position}}
        </template>
      </el-table-column>
      <el-table-column prop="proposerName" label="申请人" width="130">
      </el-table-column>
      <el-table-column prop="handlerName" label="处理人" width="130">
      </el-table-column>
      <el-table-column prop="description" label="描述" width="280">
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="140">
      </el-table-column>

      <el-table-column label="图片" width="320">
        <template slot-scope="scope">
          <div style="display: flex; gap: 5px; justify-content: center;">
            <img v-for="(img, index) in scope.row.imagesList" :key="index" :src="`data:image/jpeg;base64,${img.fileData}`" alt="图片" style="width: 120px; height: auto; cursor: pointer;" @click="showImage(img.fileData)">
          </div>
        </template>
      </el-table-column>

      <el-dialog :visible.sync="imageDialogVisible" width="50%">
        <img :src="selectedImage" alt="放大图片" style="width: 100%;">
      </el-dialog>

      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="jobOperation(scope.row.id,scope.row.jobId,'cancel')" v-if="[1, 2, 3].includes(scope.row.status) " style="color:  #ff6666;">取消任务
          </el-button>
          <el-button type="text" @click="jobOperation(scope.row.id,scope.row.jobId,'deal')" v-if="scope.row.status === 1" style="color: #4CAF50;">
            开始处理
          </el-button>
          <el-button type="text" @click="jobOperation(scope.row.id,scope.row.jobId,'finish')" v-else-if="scope.row.status === 2">
            完成
          </el-button>

          <el-button type="text" @click="jobOperation(scope.row.id,scope.row.jobId,'confirm')" v-else-if="scope.row.status === 4">
            确认
          </el-button>
          <!-- <el-button type="text" @click="jobOperation(scope.row.id,scope.row.jobId,'delete')" v-else>
            删除
          </el-button> -->
        </template>
      </el-table-column>

    </el-table>

    <!-- 分页组件 -->
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="totalItems" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :current-page.sync="currentPage" @current-change="handlePageChange">
    </el-pagination>

    <!-- 申请维修组件 -->
    <repairReplyVue :visible="applyVisible" @handleClose="handleClose" @handleSubmit="handleSubmit"></repairReplyVue>
  </div>
</template>

<script>
import repairReplyVue from './repair-reply.vue';


export default {
  mounted() {
    console.log("开始加载数据")
    this.fetchData(); // 加载第一页数据
  },
  components: {
    repairReplyVue

  },
  data() {
    return {

      // 查看图片对话框
      imageDialogVisible: false,
      selectedImage: '',

      // 申请对话框
      applyVisible: false,

      // 表格数据
      tableData: [],

      // 搜索
      searchForm: {
        replyName: null,
        statusList: [],
        dateRange: []
      },

      // 分页
      totalItems: 0, // 总条目数
      pageSize: 10,  // 每页条数
      currentPage: 1, // 当前页码
    }
  },
  computed: {
  },

  methods: {

    // 点击查看图片
    showImage(fileData) {
      this.selectedImage = `data:image/jpeg;base64,${fileData}`;
      this.imageDialogVisible = true;
      console.log(this.selectedImage)
    },

    // 获取表格数据 
    fetchData() {
      const params = {
        pageNum: this.currentPage, // 当前页码
        pageSize: 10,   // 每页显示的数据量
        replyName: this.searchForm.replyName,
        statusList: this.searchForm.jobStatusList,  // 状态列表
        startDate: this.searchForm.dateRange
          ? new Date(this.searchForm.dateRange[0]).toISOString().slice(0, 10) // 只保留日期
          : null,
        endDate: this.searchForm.dateRange
          ? new Date(this.searchForm.dateRange[1]).toISOString().slice(0, 10) // 只保留日期
          : null,


      };
      this.$http({
        url: this.$http.adornUrl(`/job/repair/listRepairJob`),  // 接口地址
        method: 'post',              //  POST 请求
        data: params,                // 使用 data 传递参数
      }).then((response) => {
        console.log(params)
        console.log(response)
        const data = response.data.data;  // 解析后端返回的分页数据
        this.tableData = data.list;       // 表格数据
        this.totalItems = data.total;     // 总条目数
        this.currentPage = data.pageNum;  // 当前页码
        this.pageSize = data.pageSize;    // 每页显示条数
      }).catch((error) => {
        console.log('获取数据失败：', error);
      });
    },

    handlePageChange(page) {
      this.currentPage = page;
      this.fetchData(); // 切换页码时重新获取数据
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
      } else {
        return "未知状态"
      }
    },
    handleClose() {
      this.applyVisible = false
    },

    handleSubmit() {
      this.$emit('flshboardData'); // 通知父组件刷新数据
      this.handleClose()
      this.fetchData()
    },
    handleOpen() {
      this.applyVisible = true
    },

    openAddDialog() {
      this.applyVisible = true
    },


    cancelJob(jobId) {
      console.log("任务：" + jobId + "已经取消")
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
    jobOperation(id, jobId, operationType) {
      //调接口处理操作
      console.log(id + jobId + operationType)
      const params = {
        id: id,
        jobId: jobId,
        handlerId: this.$store.state.user.id,
        operationType: operationType
      };
      this.$http({
        url: this.$http.adornUrl(`/job/repair/changeStatus`),  // 接口地址
        method: 'post',              // 改为 POST 请求
        data: params,                // 使用 data 传递参数
      }).then((response) => {
        this.fetchData()
        this.$emit('flshboardData'); // 通知父组件刷新数据
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1000
        });
      }).catch((error) => {
        console.log('操作任务状态失败：', error);
      });

    }



  },
  mounted() {
    // 添加 CSS 样式
    const style = document.createElement('style');
    style.textContent = `
      .el-table th {
        text-align: center;
      }
      .el-table td {
        text-align: center;
      }
    `;
    document.head.appendChild(style);
  }
}
</script>
