<template>
  <el-dialog title="效果确认" :close-on-click-modal="false" :visible.sync="visible">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="效果确认" prop="result2">
                <el-input v-model="dataForm.result2" placeholder="效果确认" type="textarea" :rows="5"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
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
        result2: '',
      },
      dataRule: {
        result2: [
          { required: true, message: '效果确认', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(formId) {
      this.visible = true;
      this.dataForm.id = formId;
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //发送请求
          this.$http({
            url: this.$http.adornUrl(`/site/siteproblemfrom/processExecute`),
            method: 'post',
            data: this.$http.adornData({
              'formId': this.dataForm.id,
              'result2': this.dataForm.result2
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false;
                  //重置表单
                  this.$refs['dataForm'].resetFields();
                  this.$emit('refreshDataList');
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
