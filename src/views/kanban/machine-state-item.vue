<template>
  <div class="kanban-config">
    <!-- <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.sn" placeholder="SN" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
      </el-form-item>
    </el-form> -->
    <div class="pass-flag" :style="testStatus == 'PASS' ? greenbg : redbg">
      Test Status：{{ testStatus }}
      <a :href="'#/kanban/machine-state-rep?eqpCode='+this.dataForm.eqpCode" class="return-flag">返回上一级</a>
    </div>
    <el-table :data="headerList" border v-loading="headerListLoading" style="width: 100%;margin-bottom: 10px;" :show-header="false">
      <el-table-column prop="name1" header-align="center" align="center" width="属性名1">
      </el-table-column>
      <el-table-column prop="value1" header-align="center" align="center" label="值1">
      </el-table-column>
      <el-table-column prop="name2" header-align="center" align="center" label="属性名2">
      </el-table-column>
      <el-table-column prop="value2" header-align="center" align="center" label="值2">
      </el-table-column>
    </el-table>
    <!-- <br> -->
    <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
      <el-table-column prop="StepNo" header-align="center" align="center" label="Step No" width="140px">
      </el-table-column>
      <el-table-column prop="TestItem" header-align="center" align="center" label="Test Step" width="350px">
      </el-table-column>
      <el-table-column prop="LimitDown" header-align="center" align="center" label="Lower Limit">
      </el-table-column>
      <el-table-column prop="TestVal" header-align="center" align="center" label="Test Value">
      </el-table-column>
      <el-table-column prop="LimitUp" header-align="center" align="center" label="Upper Limit">
      </el-table-column>
      <el-table-column prop="Unit" header-align="center" align="center" label="Unit" width="80px">
      </el-table-column>
      <el-table-column prop="StartTime" header-align="center" align="center" label="Start Time">
      </el-table-column>
      <el-table-column prop="EndTime" header-align="center" align="center" label="End Time">
      </el-table-column>
      <el-table-column prop="CreateTime" header-align="center" align="center" label="Upload Time">
      </el-table-column>
      <el-table-column prop="TestRst" header-align="center" align="center" label="Step Result" width="100px">
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
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
        endTime: ''
      },
      redbg: "background-color: red;",
      greenbg: "background-color: green;",
      testStatus: 'unknown',
      headerList: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      headerListLoading: false,
      dataListLoading: false
    }
  },
  components: {
  },
  created() {
    //获取参数
    this.dataForm.sn = this.$route.query.sn;
    this.dataForm.eqpCode = this.$route.query.eqpCode
    this.dataForm.endTime = this.$route.query.endTime

    this.$nextTick(() => {
      this.getHeaderList()
      this.getDataList()
    })

  },
  methods: {
    // 获取头列表
    getHeaderList() {
      this.headerListLoading = true
      this.$http({
        url: this.$http.adornUrl('/equipment/cmsscada/getTestInfoHeader'),
        method: 'get',
        params: this.$http.adornParams({
          'sn': this.dataForm.sn,
          'eqpCode': this.dataForm.eqpCode,
          'endTime': this.dataForm.endTime
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.headerList = data.list
          this.testStatus = data.status
        } else {
          this.headerList = []
        }
        this.headerListLoading = false
      })
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/equipment/cmsscada/getTestInfo'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'sn': this.dataForm.sn,
          'eqpCode': this.dataForm.eqpCode,
          'endTime': this.dataForm.endTime
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
  padding: 0px 10px;

  .pass-flag {
    width: 100%;
    height: 40px;
    // background-color: green;
    text-align: center;
    padding-top: 5px;
    color: #fff;
    font-weight: bold;
    font-size: 22px;

    .return-flag {
      float: right;
      font-weight: bold;
      padding-top: 10px;
      font-size: 14px;
    }
  }
}
</style>
