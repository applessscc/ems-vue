<template>
  <div>
    <!-- 查询条件表单 -->
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item >
        <el-input v-model="queryParams.queryParam" placeholder="username/IP/request_url/response_status"></el-input>
      </el-form-item>
      <el-form-item label="日期范围">
        <el-date-picker
          v-model="queryParams.dateRange"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 日志列表 -->
    <el-table :data="logList" stripe border>
      <el-table-column prop="id" label="日志ID"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="ip" label="IP地址" :show-overflow-tooltip="true" ></el-table-column>
      <el-table-column prop="requestUrl" label="请求URL" :show-overflow-tooltip="true" ></el-table-column>
      <el-table-column prop="requestMethod" label="请求方法"></el-table-column>
      <el-table-column prop="requestParams" label="请求参数" :show-overflow-tooltip="true" ></el-table-column>
      <el-table-column prop="responseParams" label="返回参数" :show-overflow-tooltip="true" ></el-table-column>
      <el-table-column prop="executionTime" label="执行时长(毫秒)"></el-table-column>
      <el-table-column prop="responseStatus" label="响应状态码"></el-table-column>
      <el-table-column prop="createDate" label="创建时间">
        <template slot-scope="scope">
          {{ formatDate(scope.row.createDate) }}
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryParams: {
        queryParam: '',
        username: '',
        requestMethod: '',
        dateRange: []
      },
      logList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    search() {
    // 处理日期范围
    let startDate = null;
    let endDate = null;
    if (this.queryParams.dateRange && this.queryParams.dateRange.length === 2) {
        startDate = this.queryParams.dateRange[0];
        endDate = this.queryParams.dateRange[1];
    }

    // 发送查询请求，改为 post 请求
    this.$http({
        url: this.$http.adornUrl('/sys/log/apiLogList'),
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            startDate: startDate,
            endDate: endDate,
            pageNum: this.currentPage,
            pageSize: this.pageSize,
            queryParam: this.queryParams.queryParam
        }
    }).then((response) => {
        console.log('查询成功:', response);
        this.logList = response.data.data.list;
        this.total = response.data.total;
    }).catch(error => {
        console.error('查询失败:', error);
        this.$message.error('查询失败，请稍后重试');
    });
},
    reset() {
      this.queryParams = {
        username: '',
        requestMethod: '',
        dateRange: []
      };
      this.currentPage = 1;
      this.search();
    },
    handleSizeChange(newSize) {
      this.pageSize = newSize;
      this.search();
    },
    handleCurrentChange(newPage) {
      this.currentPage = newPage;
      this.search();
    },
    formatDate(date) {
      if (date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }
      return '';
    }
  }
};
</script>

<style scoped>
.demo-form-inline {
  margin-bottom: 20px;
}
</style>