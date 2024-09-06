<template>
  <el-dialog title="任务处理" :close-on-click-modal="false" :visible.sync="visible">
    <el-row>
      <el-col :span="24">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="问题大类" prop="largeCategory2">
                <el-select v-model="dataForm.largeCategory2" placeholder="问题大类" style="width:100%">
                  <el-option v-for="op in largeCategoryOptions" :key="op.item" :label="op.value" :value="op.item" />
                </el-select>
                <!-- <el-input v-model="dataForm.largeCategory2" placeholder="问题大类"></el-input> -->
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="问题小类" prop="subCategory2">
                <el-select v-model="dataForm.subCategory2" placeholder="问题小类" style="width:100%">
                  <el-option v-for="op in subCategoryOptions" :key="op.item" :label="op.value" :value="op.item" />
                </el-select>
                <!-- <el-input v-model="dataForm.subCategory2" placeholder="问题小类"></el-input> -->
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="原因分析" prop="reason">
                <el-input v-model="dataForm.reason" placeholder="原因分析" type="textarea" :rows="4"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="处理措施" prop="handle">
                <el-input v-model="dataForm.handle" placeholder="处理措施" type="textarea" :rows="4"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item label="处理效果" prop="result1">
                <el-input v-model="dataForm.result1" placeholder="处理效果" type="textarea" :rows="4"></el-input>
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
import { getDictParams } from '@/utils/commonUtils.js'

export default {
  data() {
    return {
      visible: false,
      largeCategoryOptions: [],
      subCategoryOptions: [],
      dataForm: {
        id: 0,
        largeCategory2: '',
        subCategory2: '',
        // sap2: '',
        // deviceName2: '',
        reason: '',
        handle: '',
        result1: ''
      },
      dataRule: {
        largeCategory2: [
          { required: true, message: '问题大类', trigger: 'blur' }
        ],
        subCategory2: [
          { required: true, message: '问题小类', trigger: 'blur' }
        ],
        // sap2: [
        //   { required: true, message: 'SAP号-处理人不能为空', trigger: 'blur' }
        // ],
        // deviceName2: [
        //   { required: true, message: '设备名称-处理人不能为空', trigger: 'blur' }
        // ],
        reason: [
          { required: true, message: '原因分析', trigger: 'blur' }
        ],
        handle: [
          { required: true, message: '处理措施', trigger: 'blur' }
        ],
        result1: [
          { required: true, message: '处理效果', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    //获取数据字典
    this.largeCategoryOptions = getDictParams(1024); //现场问题处理-问题大类
    this.subCategoryOptions = getDictParams(1025); //现场问题处理-问题小类
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
              'largeCategory2': this.dataForm.largeCategory2,
              'subCategory2': this.dataForm.subCategory2,
              // 'sap2': this.dataForm.sap2,
              // 'deviceName2': this.dataForm.deviceName2,
              'reason': this.dataForm.reason,
              'handle': this.dataForm.handle,
              'result1': this.dataForm.result1
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
