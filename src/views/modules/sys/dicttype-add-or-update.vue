<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="字典代码" prop="code">
        <el-input v-model="dataForm.code" placeholder="字典代码"></el-input>
      </el-form-item>
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="字典名称"></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态：0：正常 1：删除" prop="status">
        <el-input v-model="dataForm.status" placeholder="状态：0：正常 1：删除"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="父ID" prop="parentId">
        <el-input v-model="dataForm.parentId" placeholder="父ID"></el-input>
      </el-form-item> -->
      <!-- <el-form-item label="创建人" prop="creator">
        <el-input v-model="dataForm.creator" placeholder="创建人"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
      </el-form-item>
      <el-form-item label="修改人" prop="updater">
        <el-input v-model="dataForm.updater" placeholder="修改人"></el-input>
      </el-form-item>
      <el-form-item label="修改时间" prop="updateTime">
        <el-input v-model="dataForm.updateTime" placeholder="修改时间"></el-input>
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        id: 0,
        code: '',
        name: '',
        status: '',
        parentId: '',
        creator: '',
        createTime: '',
        updater: '',
        updateTime: ''
      },
      dataRule: {
        code: [
          { required: true, message: '字典代码不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '字典名称不能为空', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '状态：0：正常 1：删除不能为空', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '父ID不能为空', trigger: 'blur' }
        ],
        creator: [
          { required: true, message: '创建人不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ],
        updater: [
          { required: true, message: '修改人不能为空', trigger: 'blur' }
        ],
        updateTime: [
          { required: true, message: '修改时间不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/sys/dicttype/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.code = data.dictType.code
              this.dataForm.name = data.dictType.name
              this.dataForm.status = data.dictType.status
              this.dataForm.parentId = data.dictType.parentId
              this.dataForm.creator = data.dictType.creator
              this.dataForm.createTime = data.dictType.createTime
              this.dataForm.updater = data.dictType.updater
              this.dataForm.updateTime = data.dictType.updateTime
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$http({
            url: this.$http.adornUrl(`/sys/dicttype/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'code': this.dataForm.code,
              'name': this.dataForm.name,
              'status': this.dataForm.status,
              'parentId': this.dataForm.parentId,
              'creator': this.dataForm.creator,
              'createTime': this.dataForm.createTime,
              'updater': this.dataForm.updater,
              'updateTime': this.dataForm.updateTime
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$emit('refreshDataList')
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
