<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.name" placeholder="问题单名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.assUser" clearable filterable multiple collapse-tags placeholder="处理人" style="width:100%">
          <el-option v-for="op in assUserOptions" :key="op.userId" :label="op.username" :value="op.userId" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.processStatus" clearable filterable multiple collapse-tags placeholder="流程状态" style="width:100%">
          <el-option v-for="op in processStatusOptions" :key="op.item" :label="op.value" :value="op.item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="dataForm.alarmLevel" clearable filterable multiple collapse-tags placeholder="告警级别" style="width:100%">
          <el-option v-for="op in alarmLevelOptions" :key="op.item" :label="op.value" :value="op.item" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <!-- <el-button v-if="isAuth('site:siteproblemfrom:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button v-if="isAuth('site:siteproblemfrom:delete')" type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="问题单名称">
      </el-table-column>
      <!-- <el-table-column prop="custom" header-align="center" align="center" label="客户">
      </el-table-column>
      <el-table-column prop="pn" header-align="center" align="center" label="型号">
      </el-table-column>
      <el-table-column prop="so" header-align="center" align="center" label="SO">
      </el-table-column>
      <el-table-column prop="position" header-align="center" align="center" label="位置">
      </el-table-column>
      <el-table-column prop="effect" header-align="center" align="center" label="影响">
      </el-table-column>
      <el-table-column prop="range" header-align="center" align="center" label="影响范围">
      </el-table-column> -->
      <!-- <el-table-column prop="largeCategory" header-align="center" align="center" label="问题大类">
      </el-table-column>
      <el-table-column prop="subCategory" header-align="center" align="center" label="问题小类">
      </el-table-column> -->
      <!-- <el-table-column prop="sap" header-align="center" align="center" label="SAP号">
      </el-table-column>
      <el-table-column prop="deviceName" header-align="center" align="center" label="设备名称">
      </el-table-column>
      <el-table-column prop="desc" header-align="center" align="center" label="问题描述">
      </el-table-column>
      <el-table-column prop="largeCategory2" header-align="center" align="center" label="问题大类-处理人">
      </el-table-column>
      <el-table-column prop="subCategory2" header-align="center" align="center" label="问题小类-处理人">
      </el-table-column>
      <el-table-column prop="sap2" header-align="center" align="center" label="SAP号-处理人">
      </el-table-column>
      <el-table-column prop="deviceName2" header-align="center" align="center" label="设备名称-处理人">
      </el-table-column>
      <el-table-column prop="reason" header-align="center" align="center" label="原因分析-处理人">
      </el-table-column>
      <el-table-column prop="handle" header-align="center" align="center" label="处理措施-处理人">
      </el-table-column>
      <el-table-column prop="result" header-align="center" align="center" label="处理效果-处理人">
      </el-table-column>
      <el-table-column prop="result2" header-align="center" align="center" label="效果确认-发起人">
      </el-table-column>
      <el-table-column prop="siteGroup" header-align="center" align="center" label="消息通知组ID">
      </el-table-column> -->
      <el-table-column prop="assUserName" header-align="center" align="center" label="处理人">
      </el-table-column>
      <el-table-column prop="processStatusName" header-align="center" align="center" label="流程状态">
      </el-table-column>
      <el-table-column prop="alarmLevel" header-align="center" align="center" label="告警级别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.alarmLevel === '0'" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.alarmLevel === '1'" type="warning">超时</el-tag>
          <el-tag v-else type="danger">严重超时</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="to" header-align="center" align="center" label="接收邮件">
      </el-table-column>
      <el-table-column prop="cc" header-align="center" align="center" label="抄送邮件">
      </el-table-column> -->
      <el-table-column prop="findTime" header-align="center" align="center" label="异常发生时间">
      </el-table-column>
      <el-table-column prop="endTime" header-align="center" align="center" label="异常解决时间">
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" label="创建时间">
      </el-table-column>
      <el-table-column prop="startUserName" header-align="center" align="center" label="发起人">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="180" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="$router.push({ name: 'formdetail', params: {formId: scope.row.id}})">详情</el-button>
          <el-button type="text" size="small" @click="processExecute(scope.row)" v-if="assButtonVisible">
            {{showAssButton(scope.row.processStatus)}}
          </el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row)" v-if="scope.row.processStatus == '0'">撤销</el-button>
          <el-button type="text" size="small" @click="rejectHandle(scope.row)" v-if="scope.row.processStatus == '2'">驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 任务处理 -->
    <ass-form v-if="assFormVisible" ref="assForm" @refreshDataList="getDataList"></ass-form>
    <!-- 效果确认 -->
    <result-form v-if="resultFormVisible" ref="resultForm" @refreshDataList="getDataList"></result-form>
  </div>
</template>

<script>
import AddOrUpdate from './siteproblemfrom-add-or-update'
import AssForm from './assform'
import ResultForm from './resultform'
import { getDictParams } from '@/utils/commonUtils.js'
export default {
  data() {
    return {
      assUserOptions: [],
      processStatusOptions: [],
      alarmLevelOptions: [],
      dataForm: {
        name: '',
        assUser: [],
        processStatus: ['0','1','2'],
        alarmLevel: []
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      assButtonVisible: true,
      assFormVisible: false,
      resultFormVisible: false
    }
  },
  components: {
    AddOrUpdate,
    AssForm,
    ResultForm
  },
  activated() {
    this.getDataList();

    //获取数据字典
    this.processStatusOptions = getDictParams(1026);
    this.alarmLevelOptions = getDictParams(1027);

    //获取处理人
    this.getAssUser();

  },
  methods: {
    getAssUser() {
      this.$http({
        url: this.$http.adornUrl(`/sys/user/querySiteGroupUserList`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.assUserOptions = data.list;
        }
      })
    },
    // 根据流程状态显示按钮名称
    showAssButton(processStatus) {
      if (processStatus == '0') {
        return '任务确认';
      } else if (processStatus == '1') {
        return '任务处理';
      } else if (processStatus == '2') {
        return '效果确认';
      } else {
        this.processStatus = false;
      }
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/site/siteproblemfrom/list'),
        method: 'post',
        data: this.$http.adornData({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'name': this.dataForm.name,
          'assUser': this.dataForm.assUser,
          'processStatus': this.dataForm.processStatus,
          'alarmLevel': this.dataForm.alarmLevel
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
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 任务确认/任务处理/效果确认
    processExecute(row) {
      if (row.processStatus == '0') {
        //任务确认
        this.$confirm(`确定对问题单：【${row.name}】进行【任务确认】操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/site/siteproblemfrom/processExecute'),
            method: 'post',
            data: this.$http.adornData({ 'formId': row.id }, false)
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      } else if (row.processStatus == '1') {
        //任务处理
        this.assFormVisible = true;
        this.$nextTick(() => {
          this.$refs.assForm.init(row.id)
        })
      } else if (row.processStatus == '2') {
        //效果确认
        this.resultFormVisible = true;
        this.$nextTick(() => {
          this.$refs.resultForm.init(row.id)
        })
      }

    },
    // 撤销
    deleteHandle(row) {
      this.$confirm(`确定对问题单【${row.name}】进行【撤回】操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/site/siteproblemfrom/processRevoke'),
          method: 'post',
          data: this.$http.adornData({ 'form_id': row.id }, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    },
    // 驳回
    rejectHandle(row) {
      this.$confirm(`确定对问题单【${row.name}】进行【驳回】操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/site/siteproblemfrom/processReject'),
          method: 'post',
          data: this.$http.adornData({ 'formId': row.id }, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      })
    }
  }
}
</script>
