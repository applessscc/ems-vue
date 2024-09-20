<template>
  <el-dialog :title="'申请报修'" :close-on-click-modal="false" :visible.sync="dialogVisible" @open="handleOpen" @close="handleClose" width="30%">
    <div>
      <el-form :model="dataForm" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
        <el-form-item label="维修类型" prop="counterType">
          <el-select v-model="dataForm.type" style="width:100%" placeholder="类型">
            <el-option v-for="op in type" :key="op.item" :label="op.value" :value="op.item" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请部门" prop="department">
          <el-input v-model="dataForm.location1" placeholder="位置"></el-input>
        </el-form-item>

        <el-row>
          <el-col :span="6">
            <el-form-item label="楼层" prop="floor" style="width: 180px;" filterable>
              <el-select v-model="dataForm.location1" placeholder="请">
                <el-option label="b91f" value="1"></el-option>
                <el-option label="b92f" value="2"></el-option>
                <el-option label="b93f" value="3"></el-option>
                <el-option label="b94f" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="位" prop="corridor">
              <el-input v-model="dataForm.corridor"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="具体位置" prop="position">
              <el-input v-model="dataForm.position"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="描述" prop="remarks">
          <el-input v-model="dataForm.description" placeholder="描述" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input v-model="dataForm.remarks" placeholder="备注"></el-input>
        </el-form-item>

      </el-form>

      <div class="footer-container">
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
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
      dialogVisible: false,
      optionsCode: { 'bu_name': '1001', 'position_name': '1002', 'counter_type': '1003', 'counter_id': '1004' },
      type: [
        { item: '1', value: '我是维修类型1' },
        { item: '2', value: '我是维修类型2' },
        { item: '3', value: '我是维修类型3' }
      ],
      dataForm: {
        id: 0,
        counterId: '',
        counterType: '',
        location1: '',
        location2: '',
        location3: '',
        image: '',
        remarks: '',
      }
    };
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
    }
  },
  methods: {
    handleOpen() {

    },
    handleClose() {
      this.$emit('handleClose')
    },
    handleSubmit() {
      this.$emit('handleSubmit', this.dataForm)
    },

    handleCancel() {
      this.handleClose()
    },


    dataFormSubmit() {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          console.log('提交数据：', this.dataForm);
          this.visible = false; // 关闭对话框
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
