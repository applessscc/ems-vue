<template>
  <div>
    <!-- <el-input placeholder="请输入申请人搜索" v-model="searchQuery" clearable @input="filterData" style="margin-bottom: 20px; width: 300px;">
    </el-input> -->

    <el-form :inline="true" :model="searchForm" class="search-form">
      <el-form-item label="申请人">
        <el-input v-model="searchForm.proposer" placeholder="请输入申请人名称"></el-input>
      </el-form-item>

      <el-form-item label="任务状态">
        <el-select v-model="searchForm.jobStatusList" placeholder="请选择任务状态" multiple>
          <el-option label="提交" value="1">
          </el-option>
          <el-option label="接单" value="2"></el-option>
          <el-option label="处理中" value="3">
          </el-option>
          <el-option label="完成" value="4"></el-option>
          <el-option label="确认" value="5"></el-option>
          <el-option label="取消任务" value="6"></el-option>
          <el-option label="取消接单" value="7"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="申请时间">
        <el-date-picker v-model="searchForm.replyDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
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

    <el-table :data="filteredTableData" style="width: 100%" height="250">
      <el-table-column fixed label="序号" width="50">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="jobstatus" label="任务状态" width="120">
      </el-table-column>
      <el-table-column fixed prop="replyDate" label="申请时间" width="150">
      </el-table-column>
      <el-table-column prop="location" label="故障位置" width="120">
      </el-table-column>
      <el-table-column prop="replyer" label="申请人" width="120">
      </el-table-column>
      <el-table-column prop="handler" label="处理人" width="120">
      </el-table-column>
      <el-table-column prop="description" label="描述" width="300">
      </el-table-column>
      <el-table-column label="图片" width="200">
        <template slot-scope="scope">
          <div style="display: flex; gap: 5px; justify-content: center;">
            <img v-for="(img, index) in scope.row.images" :key="index" :src="img" alt="图片" style="width: 60px; height: auto;" @error="handleImageError">
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click="jobOperation(scope.row.jobId,scope.row.jobstatusCode)" v-if="[1, 2, 3].includes(scope.row.jobstatusCode) " style="color:  #ff6666;">取消任务
          </el-button>
          <el-button type="text" @click="jobOperation(scope.row.jobId,scope.row.jobstatusCode)" v-if="scope.row.jobstatusCode === 1" style="color: #4CAF50;">
            开始处理
          </el-button>
          <el-button type="text" @click="jobOperation(scope.row.jobId,scope.row.jobstatusCode)" v-else-if="scope.row.jobstatusCode === 2">
            开始处理
          </el-button>
          <el-button type="text" @click="jobOperation(scope.row.jobId,scope.row.jobstatusCode)" v-else-if="scope.row.jobstatusCode === 3" style="color: #2196F3;">
            完成
          </el-button>
          <el-button type="text" @click="jobOperation(scope.row.jobId,scope.row.jobstatusCode)" v-else-if="scope.row.jobstatusCode === 4">
            确认
          </el-button>
          <el-button type="text" @click="jobOperation(scope.row.jobId,scope.row.jobstatusCode)" v-else>
            删除
          </el-button>
        </template>
      </el-table-column>

    </el-table>

    <!-- 申请维修组件 -->
    <repairReplyVue :visible="applyVisible" @handleClose="handleClose" @handleSubmit="handleSubmit"></repairReplyVue>
  </div>
</template>

<script>
import repairReplyVue from './repair-reply.vue';


export default {
  components: {
    repairReplyVue

  },
  data() {
    return {
      searchForm: {
        proposer: '',
        jobStatusList: [],
        replyDate: '',
      },
      applyVisible: false,
      newEntry: {
        date: '',
        province: '',
        city: '',
        address: '',
        images: []
      },
      tableData: [{
        jobId: '731093710',
        jobstatus: '待处理',
        jobstatusCode: 1,
        replyDate: '2016-05-03 19:10',
        location: 'b94f-01-03',
        replyer: '周小舟',
        handler: '王离',
        description: '我是问题描述',
        images: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg'
        ]
      }, {
        jobstatus: '已安排',
        jobstatusCode: 3,
        replyDate: '2017-05-03 19:10',
        location: 'b94f-01-03',
        replyer: '周晓晓',
        handler: '王离',
        description: '我是问题描述2',
        images: [
          'https://example.com/image1.jpg',
          'https://example.com/image2.jpg'
        ]
      }]
    }
  },
  computed: {
    filteredTableData() {
      // 实现过滤逻辑
      return this.tableData
    }
  },
  methods: {
    handleClose() {
      this.applyVisible = false
    },

    handleSubmit(data) {
      console.log(data)
      this.handleClose()
    },
    handleOpen() {
      this.applyVisible = true
    },


    handleImageError(event) {
      event.target.src = 'https://via.placeholder.com/60'; // 占位图链接
    },
    openAddDialog() {
      this.applyVisible = true
    },

    addNewEntry() {
      this.tableData.push({ ...this.newEntry, images: this.newEntry.images.split(',') }); // 将图片链接转换为数组
      this.addDialogVisible = false;
    },
    deleteEntry(index) {
      this.tableData.splice(index, 1); // 删除指定索引的记录
    },

    cancelJob(jobId) {
      console.log("任务：" + jobId + "已经取消")
    },

    // 表单搜索功能
    search() {
      console.log("搜索条件:", this.searchForm);
      // searchForm

    },

    // operationButton(jobstatusCode) {
    //   if (jobstatusCode === 1) {
    //     return '接单';
    //   } else if (jobstatusCode === 2) {
    //     return '开始处理';
    //   } else if (jobstatusCode === 3) {
    //     return '完成';
    //   } else if (jobstatusCode === 4) {
    //     return '确认';
    //   } else {
    //     return '删除'; // 这里返回一个默认值
    //   }
    // },
    // 重置搜索框表单
    resetForm() {
      this.searchForm = {
        proposer: '',
        jobStatusList: [],
        replyDate: '',
      }
    },
    jobOperation(jobId, jobstatusCode) {
      //调接口处理操作
      console.log(jobId + jobstatusCode)

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
