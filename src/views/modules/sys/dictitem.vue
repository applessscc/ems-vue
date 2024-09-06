<template>
  <el-dialog title="字典明细" :close-on-click-modal="false" :visible.sync="visible">
    <div class="mod-config">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" size="small">
        <el-form-item>
          <el-input v-model="dataForm.key" placeholder="关键字" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="dataForm.value1" placeholder="额外参数值1" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="getDataList()">查询</el-button>
          <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
          <el-button type="danger" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;" size="small">
        <el-table-column type="selection" header-align="center" align="center" width="50">
        </el-table-column>
        <el-table-column prop="code" header-align="center" align="center" label="字典代码">
        </el-table-column>
        <el-table-column prop="item" header-align="center" align="center" label="字典键">
        </el-table-column>
        <el-table-column prop="value" header-align="center" align="center" label="字典值" width="160">
        </el-table-column>
        <el-table-column prop="value1" header-align="center" align="center" label="额外参数值1" width="160">
        </el-table-column>
        <el-table-column prop="sort" header-align="center" align="center" label="排序">
        </el-table-column>
        <el-table-column prop="remark" header-align="center" align="center" label="说明" width="220">
        </el-table-column>
        <!-- <el-table-column prop="status" header-align="center" align="center" label="状态：0：删除 1：正常">
        </el-table-column> -->
        <!-- <el-table-column prop="creator" header-align="center" align="center" label="创建人">
        </el-table-column>
        <el-table-column prop="createTime" header-align="center" align="center" label="创建时间">
        </el-table-column> -->
        <el-table-column prop="updaterName" header-align="center" align="center" label="修改人">
        </el-table-column>
        <el-table-column prop="updateTime" header-align="center" align="center" label="修改时间" width="140">
        </el-table-column>
        <el-table-column fixed="right" header-align="center" align="center" width="150" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
            <el-button type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    </div>
  </el-dialog>
</template>

<script>
import AddOrUpdate from './dictitem-add-or-update'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        key: '',
        value1: ''
      },
      code: '',
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  activated() {
    this.getDataList(this.code)
  },
  methods: {
    // 获取数据列表
    getDataList(code = this.code) {
      this.code = code;
      this.visible = true;
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/dictitem/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'key': this.dataForm.key,
          'value1': this.dataForm.value1,
          'code': this.code
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
        this.$refs.addOrUpdate.init(id, this.code)
      })
    },
    // 删除
    deleteHandle(id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/dictitem/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
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
