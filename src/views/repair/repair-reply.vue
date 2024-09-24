<template>
  <el-dialog :title="'申请报修'" :close-on-click-modal="false" :visible.sync="dialogVisible" @open="handleOpen" @close="handleClose" width="30%">
    <div>
      <el-form :model="dataForm" ref="dataForm" :rules="dataRule" @keyup.enter.native="handSubmit()" label-width="100px">
        <el-form-item label="维修类型" prop="repairType">
          <el-select v-model="dataForm.repairType" style="width:100%" placeholder="维修类型">
            <el-option v-for="op in type" :key="op.item" :label="op.value" :value="op.item" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请部门" prop="department">
          <el-input v-model="dataForm.department" placeholder="申请部门"></el-input>
        </el-form-item>

        <!-- <el-row> -->
        <!-- <el-col :span="6"> -->
        <el-form-item label="楼层" prop="floor" style="width: 180px;" filterable>
          <el-select v-model="dataForm.floor" placeholder="">
            <el-option label="b91f" value="b91f"></el-option>
            <el-option label="b92f" value="b92f"></el-option>
            <el-option label="b93f" value="b93f"></el-option>
            <el-option label="b94f" value="b94f"></el-option>
          </el-select>
        </el-form-item>
        <!-- </el-col> -->

        <!-- <el-col :span="8"> -->
        <el-form-item label="位" prop="corridor">
          <el-input v-model="dataForm.corridor"></el-input>
        </el-form-item>
        <!-- </el-col> -->

        <!-- <el-col :span="8"> -->
        <el-form-item label="具体位置" prop="position">
          <el-input v-model="dataForm.position"></el-input>
        </el-form-item>
        <!-- </el-col>
        </el-row> -->

        <el-form-item label="描述" prop="description">
          <el-input v-model="dataForm.description" placeholder="描述" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
        </el-form-item>

        <el-form-item>
          <el-upload class="upload-demo" 
          :action="uploadAction" 
          :on-preview="handlePreview" 
          :on-remove="handleRemove" 
          :on-success="handleSuccess" 
          :on-error="handleError" 
          :file-list="fileList" 
          :data="uploadData()"
           list-type="picture">
            <el-button size="small" type="primary">上传图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10m</div>
          </el-upload>
        </el-form-item>

      </el-form>

      <div class="footer-container">
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handSubmit()">确定</el-button>
        </span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      // 上传的图片列表
      fileList: [],
      // 上传图片的jobid
      jobId: '',
      // 上传图片的路径

              
      uploadAction: this.url = this.$http.adornUrl(`/job/repair/uploadImage?token=${this.$cookie.get('token')}`),
      dialogVisible: this.visible,
      optionsCode: { 'bu_name': '1001', 'position_name': '1002', 'counter_type': '1003', 'counter_id': '1004' },
      type: [
        { item: '1', value: '我是维修类型1' },
        { item: '2', value: '我是维修类型2' },
        { item: '3', value: '我是维修类型3' }
      ],
      dataForm: {
        repairType: null,
        department: null,
        floor: null,
        corridor: null,
        position: null,
        description: null,
        remark: null,
      },
      dataRule: {
        department: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' }
        ],
        floor: [
          { required: true, message: '楼层不能为空', trigger: 'blur' }
        ],
        corridor: [
          { required: true, message: '位不能为空', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '具体位置不能为空', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '描述不能为空', trigger: 'blur' }
        ]

      }
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val;
    }
  },
  methods: {
    initDataForm() {
      this.dataForm.repairType = null;
      this.dataForm.department = null
      this.dataForm.floor = null
      this.dataForm.corridor = null
      this.dataForm.position = null
      this.dataForm.description = null
      this.dataForm.remark = null
      this.fileList = [];
      this.jobId = null
    },

    handleOpen() {
      this.initDataForm()
      this.jobId = Date.now();
    },
    handleClose() {
      this.$emit('handleClose')
    },
    handleCancel() {
      this.initDataForm()
      this.handleClose()
    },

    handleRemove(file, fileList) {
      console.log("点击了删除图片");

      console.log(file);
            console.log(fileList);

    },
    handlePreview(file) {
      console.log(file);
    },
    handleSuccess(response, file, fileList) {
      console.log("图片上传成功!");
      this.$message.success('图片上传成功!');
      this.fileList = fileList;  // 更新文件列表
    },
    // 上传失败后的处理
    handleError(error, file, fileList) {
      this.$message.error('图片上传失败!');
    },
    // 上传图片的额外数据jobid
    uploadData() {
      if (!this.jobId) {
        this.jobId = Date.now();
      }
      return { jobId: this.jobId};
    },

    handSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          console.log('提交数据：', this.dataForm);
          console.log('jobId', this.jobId);

          this.$http({
            url: this.$http.adornUrl(`/job/repair/reply`),
            method: 'post',
            data: this.$http.adornData({
              'jobId': this.jobId,
              'department': this.dataForm.department,
              'type': this.dataForm.repairType,
              'description': this.dataForm.description,
              'remark': this.dataForm.remark,
              'floor': this.dataForm.floor,
              'corridor': this.dataForm.corridor,
              'position': this.dataForm.position,
              'proposerId':this.$store.state.user.id,
              'handlerId':this.$store.state.user.id
            })
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.$emit('handleSubmit'); // 通知父组件刷新数据
                  this.dialogVisible = false; // 关闭对话框
                }
              });
            } else {
              console.error(data)
              this.$message.error("提交失败");
            }
          }).catch(error => {
            console.error('提交失败:', error);
          });
        } else {
          console.log('表单验证失败！');
        }
      });
    }

  }
}
</script>


<style>
.footer-container {
  display: flex;
  justify-content: center; /* 水平居中 */
}

.dialog-footer {
  display: flex;
  gap: 10px; /* 按钮之间的间距，可根据需要调整 */
}
</style>
