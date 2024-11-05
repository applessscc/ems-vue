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
          <el-option label="关闭" value="7"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker v-model="searchForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <el-button type="primary" @click="handleOpen" style="margin-bottom: 20px;">
      请求任务
    </el-button>

    <el-button type="primary" @click="openNew('repair/repair-kanban')">
      任务看板
    </el-button>

    <el-table :data="tableData" style="width: 100%" @row-click="handleRowClick">
      <el-table-column fixed label="序号" width="50">
        <template slot-scope="scope">
          {{ (scope.$index + 1) + (currentPage - 1) * pageSize }}
        </template>
      </el-table-column>
      <el-table-column label="任务状态" width="120">
        <template slot-scope="scope">
          {{ getJobStatusName(scope.row.status) }}
        </template>
      </el-table-column>

      <el-table-column prop="equipment" label="设备号" width="100">
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="140">
      </el-table-column>
      <el-table-column label="故障位置" width="130">
        <template slot-scope="scope">
          {{scope.row.floor+'-'+scope.row.corridor+'-'+scope.row.position}}
        </template>
      </el-table-column>
      <el-table-column prop="proposerName" label="申请人" width="100">
      </el-table-column>
      <el-table-column prop="handlerName" label="处理人" width="100">
      </el-table-column>
      <el-table-column prop="description" label="描述" width="250">
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="120">
      </el-table-column>

      <el-table-column label="图片" width="320">
        <template slot-scope="scope">
          <div style="display: flex; gap: 5px; justify-content: center;">
            <img v-for="(img, index) in scope.row.imagesList" :key="index" :src="`data:image/jpeg;base64,${img.fileData}`" alt="图片" style="width: 120px; height: auto; cursor: pointer;" @click="showImage(img.fileData)">
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <div>
            <el-button type="text" @click.stop="jobOperation(scope.row.id,scope.row.jobId,'cancel')" v-if="[1, 2, 3].includes(scope.row.status) " style="color:  #ff6666;">取消任务
            </el-button>
          </div>
          <div>
            <el-button type="text" @click.stop="dealJob(scope.row)" v-if="scope.row.status === 1" style="color: #4CAF50;">开始处理
            </el-button>
            <el-button type="text" @click.stop="jobOperation(scope.row.id,scope.row.jobId,'finish')" v-else-if="scope.row.status === 2">完成
            </el-button>
            <el-button type="text" @click.stop="jobOperation(scope.row.id,scope.row.jobId,'confirm')" v-else-if="scope.row.status === 4">确认
            </el-button>
            <el-button type="text" @click.stop="jobOperation(scope.row.id,scope.row.jobId,'close')" v-else-if="scope.row.status === 5">关闭
            </el-button>
          </div>
          <div>

            <el-button type="text" @click.stop="$router.push({ name: 'repair-jobDetail', query: { jobId: scope.row.jobId } })">查看</el-button>

          </div>
        </template>
      </el-table-column>

    </el-table>
    <el-dialog :visible.sync="imageDialogVisible" width="50%">
      <el-image :src="`data:image/jpeg;base64,${selectedImage}`" alt="放大图片" fit="cover" style="width: 100%; height: auto;"></el-image>
    </el-dialog>

    <!-- 分页组件 -->
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="totalItems" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :current-page.sync="currentPage" @current-change="handlePageChange"
      @size-change="handleSizeChange">
    </el-pagination>

    <!-- 申请维修组件 -->
    <repairReplyVue :visible="applyVisible" @handleClose="handleClose" @handleSubmit="handleSubmit"></repairReplyVue>

    <!-- 处理对话框 -->
    <el-dialog title="任务处理" :visible="dealJobOperation" width="50%" center>

      <!-- 描述列表 -->
      <div class="dealJob-table-container">
        <el-descriptions title="任务信息" :column="3" border v-if="dealJobData.row">
          <el-descriptions-item label="任务状态">{{getJobStatusName(dealJobData.row.status)}}</el-descriptions-item>
          <el-descriptions-item label="设备号">{{dealJobData.row.equipment}}</el-descriptions-item>
          <el-descriptions-item label="申请时间">{{dealJobData.row.createTime}}</el-descriptions-item>
          <el-descriptions-item label="发生时间">{{dealJobData.row.eventTime}}</el-descriptions-item>
          <el-descriptions-item label="故障位置">{{dealJobData.row.floor+'-'+dealJobData.row.corridor+'-'+dealJobData.row.position}}</el-descriptions-item>
          <el-descriptions-item label="申请人">{{dealJobData.row.proposerName}}</el-descriptions-item>
          <el-descriptions-item label="描述">{{dealJobData.row.description}}</el-descriptions-item>
          <el-descriptions-item label="备注">{{dealJobData.row.remark}}</el-descriptions-item>
          <el-descriptions-item label="严重程度">{{getSeverityName(dealJobData.row.severity)}}</el-descriptions-item>
          <el-descriptions-item label="发生频率">{{getfrequencyName(dealJobData.row.frequency)}}</el-descriptions-item>
          <el-descriptions-item label="图片">
            <div style="display: flex; gap: 5px; justify-content: center;">
              <img v-for="(img, index) in dealJobData.row.imagesList" :key="index" :src="`data:image/jpeg;base64,${img.fileData}`" alt="图片" style="width: 120px; height: auto; cursor: pointer;" @click="showImage(img.fileData)">
            </div>
          </el-descriptions-item>

        </el-descriptions>
      </div>
      <el-divider></el-divider>
      <!-- 表单 -->
      <div class="dealJob-form-container" v-if="dealJobData.row">
        <el-form label-width="80px" :model="dealJobFormData" ref="dealJobFormData">
          <el-form-item label="备注">
            <span>
              <el-input v-model="dealJobFormData.remark"></el-input>
            </span>
          </el-form-item>
          <el-form-item>
            <el-upload class="upload-demo" :action="uploadAction" :on-success="handleSuccess" :on-error="handleError" :file-list="fileList" :data="uploadData()" list-type="picture">
              <el-button size="small" type="primary">上传图片</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10m</div>
            </el-upload>
          </el-form-item>

        </el-form>

      </div>

      <div class="dealJob-footer-container">
        <span>
          <el-button @click="dealJobCancel">取 消</el-button>
          <el-button type="primary" @click="dealJobConfirm(dealJobData.row)">确 定</el-button>
        </span>
      </div>
    </el-dialog>

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
      // 上传的图片列表
      fileList: [],

      // 图片伤处地址
      uploadAction: this.$http.adornUrl(`/job/repair/uploadDealImage?token=${this.$cookie.get('token')}`),

      //  处理状态表单
      dealJobFormData: {
        remark: '',
      },

      // 处理对话框属性
      dealJobData: {
        row: null,
        // 这里的createTime当做uuid
        operationTime: null
      },

      // 处理状态对话框
      dealJobOperation: false,

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


handleRowClick(row){
    this.$router.push({ name: 'repair-jobDetail', query: { jobId: row.jobId } });
},
    initDealJobForm() {
      this.fileList = [];
      this.dealJobData.row = null;
      this.dealJobData.operationTime = null;
      this.dealJobFormData.remark = '';
    },
    dealJobConfirm(row) {
      //调接口处理操作
      const params = {
        repairId: row.id,
        jobId: row.jobId,
        handlerId: this.$store.state.user.id,
        remark: this.dealJobFormData.remark,
        operationTime: this.dealJobData.operationTime,
        operationType: "deal"
      };
      console.log("调接口处理操作params", params)
      this.$http({
        url: this.$http.adornUrl(`/job/repair/dealJob`),  // 接口地址
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
        this.initDealJobForm()
        this.dealJobOperation = false

      }).catch((error) => {
        console.log('操作任务状态失败：', error);
      });

    },

    // 图片上传入参
    uploadData() {
      if (!this.dealJobData.operationTime) {
        this.dealJobData.operationTime = Date.now()
      }
      return {
        jobId: this.dealJobData.row.jobId,
        operationTime: this.dealJobData.operationTime,
      };
    },

    // 图片上传失败回调
    handleError(error, file, fileList) {
      this.$message.error('图片上传失败!');
    },

    // 图片上传成功回调
    handleSuccess(response, file, fileList) {
      console.log("图片上传成功!");
      this.$message.success('图片上传成功!');
      this.fileList = fileList;  // 更新文件列表
    },

    dealJob(row) {
      this.initDealJobForm()
      this.dealJobData.row = row;
      this.dealJobOperation = true

    },


    // 处理状态对话框开发时执行的方法
    handleOpen() {
      this.initDealJob();
    },

    dealJobCancel() {
      this.dealJobOperation = false

    },



    openNew(path) {
      let newUrl = this.$router.resolve({ path: path });
      window.open(newUrl.href, '_blank');
    },
    //分页插件每页显示的条数发生改变时
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.fetchData();
    },

    // 点击查看图片
    showImage(fileData) {
      this.selectedImage = fileData;
      this.imageDialogVisible = true;
    },

    // 获取表格数据 s
    fetchData() {
      const params = {
        pageNum: this.currentPage, // 当前页码
        pageSize: this.pageSize,   // 每页显示的数据量
        replyName: this.searchForm.replyName,
        statusList: this.searchForm.jobStatusList,  // 状态列表
        startDate: this.searchForm.dateRange && this.searchForm.dateRange[0]
          ? this.searchForm.dateRange[0]
          : null,
        endDate: this.searchForm.dateRange && this.searchForm.dateRange[1]
          ? this.searchForm.dateRange[1]
          : null,
        loginInId: this.$store.state.user.id,

      };
      console.log(params)

      this.$http({
        url: this.$http.adornUrl(`/job/repair/listRepairJob`),  // 接口地址
        method: 'post',              //  POST 请求
        data: params,                // 使用 data 传递参数
      }).then((response) => {
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
<style >
.dealJob-footer-container {
  display: flex;
  justify-content: center; /* 水平居中 */
}
.dealJob-table-container {
}
.dealJob-form-container {
}
</style>