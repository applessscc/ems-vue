<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" width="30%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="通知组" prop="groupId">
        <el-select v-model="dataForm.groupId" clearable filterable placeholder="通知组" style="width:90%" :disabled="!dataForm.id ? false : true">
          <el-option v-for="op in groupOptions" :key="op.id" :label="op.name" :value="op.id" />
        </el-select>
        <!-- <el-input v-model="dataForm.usrId" placeholder="用户ID"></el-input> -->
      </el-form-item>
      <el-form-item label="用户" prop="usrId">
        <el-select v-model="dataForm.usrId" clearable filterable placeholder="用户" style="width:90%" :disabled="!dataForm.id ? false : true">
          <el-option v-for="op in usrOptions" :key="op.userId" :label="op.username" :value="op.userId" />
        </el-select>
        <!-- <el-input v-model="dataForm.usrId" placeholder="用户"></el-input> -->
      </el-form-item>
      <el-form-item label="身份" prop="auth">
        <el-radio v-model="dataForm.auth" label="0">成员</el-radio>
        <el-radio v-model="dataForm.auth" label="1">管理者</el-radio>
        <!-- <el-input v-model="dataForm.auth" placeholder="用户权限"></el-input> -->
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
      groupOptions: [],
      usrOptions: [],
      dataForm: {
        id: 0,
        groupId: '',
        usrId: '',
        auth: '0'
      },
      dataRule: {
        groupId: [
          { required: true, message: '通知组不能为空', trigger: 'blur' }
        ],
        usrId: [
          { required: true, message: '用户不能为空', trigger: 'blur' }
        ],
        auth: [
          { required: true, message: '身份不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getGroupOptions();
    this.getUsrOptions();
  },
  methods: {
    getGroupOptions() {
      this.$http({
        url: this.$http.adornUrl(`/site/sitegroup/infoList`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.groupOptions = data.list;
        }
      })
    },
    getUsrOptions() {
      this.$http({
        url: this.$http.adornUrl(`/sys/user/infoList`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.usrOptions = data.list;
        }
      })
    },
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/site/siteuser/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.groupId = data.siteUser.groupId
              this.dataForm.usrId = data.siteUser.usrId
              this.dataForm.auth = data.siteUser.auth
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
            url: this.$http.adornUrl(`/site/siteuser/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'groupId': this.dataForm.groupId,
              'usrId': this.dataForm.usrId,
              'auth': this.dataForm.auth
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
