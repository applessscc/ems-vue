<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" width="40%" append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" size="small" label-width="80px">
      <el-form-item label="字典代码" prop="code">
        <el-input v-model="dataForm.code" placeholder="字典代码" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="字典键" prop="item">
        <el-input v-model="dataForm.item" placeholder="字典键"></el-input>
      </el-form-item>
      <el-form-item label="字典值" prop="value">
        <el-input v-model="dataForm.value" placeholder="字典值"></el-input>
      </el-form-item>
      <el-form-item label="说明" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="说明"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="1"></el-input-number>
      </el-form-item>
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
        item: '',
        value: '',
        remark: '',
        sort: ''
      },
      dataRule: {
        code: [
          { required: true, message: '字典代码不能为空', trigger: 'blur' }
        ],
        item: [
          { required: true, message: '字典键不能为空', trigger: 'blur' }
        ],
        value: [
          { required: true, message: '字典值不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: false, message: '说明不能为空', trigger: 'blur' }
        ],
        sort: [
          { required: false, message: '排序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id, code) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.code = code || ''
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/sys/dictitem/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.code = data.dictItem.code
              this.dataForm.item = data.dictItem.item
              this.dataForm.value = data.dictItem.value
              this.dataForm.remark = data.dictItem.remark
              this.dataForm.sort = data.dictItem.sort
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
            url: this.$http.adornUrl(`/sys/dictitem/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'code': this.dataForm.code,
              'item': this.dataForm.item,
              'remark': this.dataForm.remark,
              'value': this.dataForm.value,
              'sort': this.dataForm.sort
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
