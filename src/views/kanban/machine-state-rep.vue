<template>
  <div class="kanban-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.sn" placeholder="SN" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="dataForm.eqpCode" placeholder="eqpCode" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="dataForm.endTime" type="datetimerange" value-format="yyyy-MM-dd HH:mm:ss" range-separator="至" start-placeholder="EndTime-起始" end-placeholder="EndTime-结束">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;" :row-class-name="tableRowClassName" @sort-change='sortTableFun'>
      <el-table-column prop="SN" header-align="center" align="center" label="Serial Number" width="220px">
        <template slot-scope="scope">
          <a :href="'#/kanban/machine-state-item?sn='+scope.row.SN.replaceAll('+', '%2B')+'&eqpCode='+scope.row.CreateBy+'&endTime='+scope.row.EndTime" target="_blank">{{ scope.row.SN }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="SO" header-align="center" align="center" label="SO Number" width="120px">
      </el-table-column>
      <el-table-column prop="Model" header-align="center" align="center" label="Model" width="240px">
      </el-table-column>
      <el-table-column prop="StartTime" header-align="center" align="center" label="Start Time" width="160px" sortable>
      </el-table-column>
      <el-table-column prop="EndTime" header-align="center" align="center" label="End Time" width="160px" sortable>
      </el-table-column>
      <el-table-column prop="ExecutionTime" header-align="center" align="center" label="Execution Time (S)" width="180px" sortable>
      </el-table-column>
      <el-table-column prop="Line" header-align="center" align="center" label="Line" width="140px">
      </el-table-column>
      <!-- <el-table-column prop="StartTime" header-align="center" align="center" label="Execution Time">
      </el-table-column> -->
      <el-table-column prop="Station" header-align="center" align="center" label="Station" width="220px">
      </el-table-column>
      <el-table-column prop="Operator" header-align="center" align="center" label="Operator" width="90px">
      </el-table-column>
      <el-table-column prop="FailCode" header-align="center" align="center" label="FailCode" width="120px" sortable>
      </el-table-column>
      <el-table-column prop="Result" header-align="center" align="center" label="Result" width="100px" sortable>
      </el-table-column>
      <el-table-column prop="Fixture" header-align="center" align="center" label="Fixture" width="180px">
      </el-table-column>
      <el-table-column prop="TestProcess" header-align="center" align="center" label="Test Process" width="120px">
      </el-table-column>
      <el-table-column prop="Position" header-align="center" align="center" label="UUT Position" width="120px">
      </el-table-column>
      <el-table-column prop="ProgramName" header-align="center" align="center" label="Program Name" width="160px">
      </el-table-column>
      <el-table-column prop="ProgramVersion" header-align="center" align="center" label="Program Version" width="160px">
      </el-table-column>
      <el-table-column prop="CreateBy" header-align="center" align="center" label="Created By" width="220px">
      </el-table-column>
      <el-table-column prop="CreateTime" header-align="center" align="center" label="Created Time" width="160px">
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[15, 30, 60, 120]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataForm: {
        sn: '',
        eqpCode: '',
        endTime: '',
        column: 'EndTime',
        order: 'DESC',
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 15,
      totalPage: 0,
      dataListLoading: false
    }
  },
  components: {
  },
  created() {
    if (this.$route.query.eqpCode) {
      this.dataForm.eqpCode = this.$route.query.eqpCode
    }
    this.getDataList()
  },
  methods: {
    sortTableFun(column) {
      this.dataForm.column = column.prop;
      if (column.prop) {
        if (column.order == 'ascending') {
          this.dataForm.order = 'ASC';
        } else if (column.order == 'descending') {
          this.dataForm.order = 'DESC';
        }
      }else{
        this.dataForm.column = 'EndTime';
        this.dataForm.order = 'DESC'
      }
      //刷新页面
      this.$nextTick(() => {
        this.getDataList();
      })
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.Result.toUpperCase() != 'PASS') {
        return 'fail-row';
      }
      return '';
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/equipment/cmsscada/getTestInfoHeaderList'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'sn': this.dataForm.sn,
          'eqpCode': this.dataForm.eqpCode,
          'sTime': this.dataForm.endTime[0],
          'eTime': this.dataForm.endTime[1],
          'column': this.dataForm.column,
          'order': this.dataForm.order,
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    }
  }
}
</script>

<style lang="less">
.kanban-config {
  height: 100%;
  width: 100%;
  padding: 10px 10px;
}
.el-table .fail-row {
  background: #fdbab5;
}
</style>
