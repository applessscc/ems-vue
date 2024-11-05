<template>
  <el-dialog :title="'任务申请'" :close-on-click-modal="false" :visible.sync="dialogVisible" @open="handleOpen" @close="handleClose" width="40%">
    <div>
      <el-form :model="dataForm" ref="dataForm" :rules="dataRule" @keyup.enter.native="handSubmit()" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="任务类型" prop="repairType">
              <el-select v-model="dataForm.repairType" style="width:100%" placeholder="任务类型">
                <el-option v-for="op in type" :key="op.item" :label="op.value" :value="op.item" />
              </el-select>
            </el-form-item>

            <el-form-item label="楼层" prop="floor">
              <el-select v-model="dataForm.floor" placeholder="请输入楼层">
                <el-option label="b91f" value="b91f"></el-option>
                <el-option label="b92f" value="b92f"></el-option>
                <el-option label="b93f" value="b93f"></el-option>
                <el-option label="b94f" value="b94f"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备号" prop="equipment">
              <el-input v-model="dataForm.equipment" placeholder="设备号"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="程度级别" prop="severity">
              <el-select v-model="dataForm.severity" style="width:100%" placeholder="严重程度">
                <el-option v-for="op in severityOptions" :key="op.item" :label="op.value" :value="op.item" />
              </el-select>
            </el-form-item>

            <el-form-item label="位" prop="corridor">
              <el-input v-model="dataForm.corridor" placeholder="请输入位"></el-input>
            </el-form-item>

            <el-form-item label="发生时间" prop="eventTime">
              <el-date-picker v-model="dataForm.eventTime" type="datetime" placeholder="选择日期和时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>

          </el-col>

          <el-col :span="8">
            <el-form-item label="频率" prop="frequency">
              <el-select v-model="dataForm.frequency" style="width:100%" placeholder="发生频率">
                <el-option v-for="op in frequencyOptions" :key="op.item" :label="op.value" :value="op.item" />
              </el-select>
            </el-form-item>
            <el-form-item label="具体位置" prop="position">
              <el-input v-model="dataForm.position" placeholder="具体位置"></el-input>
            </el-form-item>
          </el-col>

        </el-row>

        <el-form-item label="三级选项" prop="issue">
          <el-cascader clearable v-model="dataForm.issue" :options="options" :props="{ expandTrigger: 'hover' }" @change="handleChange">

          </el-cascader>
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="dataForm.description" placeholder="描述" type="textarea"></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="dataForm.remark" placeholder="备注"></el-input>
        </el-form-item>

        <el-form-item>
          <el-upload class="upload-demo" :action="uploadAction" :on-preview="handlePreview" :on-remove="handleRemove" :on-success="handleSuccess" :on-error="handleError" :file-list="fileList" :data="uploadData()" list-type="picture">
            <el-button size="small" type="primary">上传图片</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过10m</div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div class="footer-container">
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handSubmit()" :disabled="buttonDisabled">确定</el-button>
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
      buttonDisabled: false,
      value: [],
      options: [
        {
          label: '人',
          value: 'a',
          children: [
            {
              label: '人员',
              value: 'a1',
              children: [
                { label: 'a1-1', value: 'a1-1' },
                { label: 'a1-2', value: 'a1-2' }
              ]
            },
            {
              label: '培训',
              value: 'a2',
              children: [
                { label: 'a2-1', value: 'a2-1' },
                { label: 'a2-1', value: 'a2-2' }
              ]
            }
            ,
            {
              label: 'WI',
              value: 'a3',
              children: [
                { label: 'a3-1', value: 'a3-1' },
                { label: 'a3-2', value: 'a3-2' }
              ]
            }
          ]
        },
        {
          label: '机',
          value: 'b',
          children: [
            {
              label: '机',
              value: 'b1',
              children: [
                { label: 'b1-1', value: 'b1-1' },
                { label: 'b1-2', value: 'b1-2' }
              ]
            },
            {
              label: '环',
              value: 'b2',
              children: [
                { label: 'b2-1', value: 'b2-1' },
                { label: 'b2-2', value: 'b2-2' }
              ]
            }
            ,
            {
              label: '产',
              value: 'b3',
              children: [
                { label: 'b3-1', value: 'b3-1' },
                { label: 'b3-2', value: 'b3-2' }
              ]
            }
          ]
        },
        {
          label: '料',
          value: 'c',
          children: [
            {
              label: '物数',
              value: 'c1',
              children: [
                { label: 'c1-1', value: 'c1-1' },
                { label: 'c1-2', value: 'c1-2' }
              ]
            },
            {
              label: '料问题',
              value: 'c2',
              children: [
                { label: 'c2-1', value: 'c2-1' },
                { label: 'c2-2', value: 'c2-2' }
              ]
            }
          ]
        },
        {
          label: '法',
          value: 'd',
          children: [
            {
              label: 'WI',
              value: 'd1',
              children: [
                { label: 'd1-1', value: 'd1-1' },
                { label: 'd1-2', value: 'd1-2' }
              ]
            },
            {
              label: '生产',
              value: 'd2',
              children: [
                { label: 'd2-1', value: 'd2-1' },
                { label: 'd2-2', value: 'd2-2' }
              ]
            }
          ]
        },
        {
          label: '环节',
          value: 'e',
          children: [
            {
              label: 'e1',
              value: 'e1',
              children: [
                { label: 'e1-1', value: 'e1-1' },
                { label: 'e1-2', value: 'e1-2' }
              ]
            },
            {
              label: 'e2',
              value: 'e2',
              children: [
                { label: 'e2-1', value: 'e2-1' },
                { label: 'e2-2', value: 'e2-2' }
              ]
            }
          ]
        }
      ],

      fileList: [],
      jobId: '',
      uploadAction: this.$http.adornUrl(`/job/repair/uploadImage?token=${this.$cookie.get('token')}`),
      dialogVisible: this.visible,
      type: [
        { item: '1', value: '维修类型1' },
        { item: '2', value: '维修类型2' },
        { item: '3', value: '维修类型3' }
      ],
      severityOptions: [  // 新增: 严重程度选项
        // { item: '1', value: '轻微' },
        // { item: '2', value: '中等' },
        { item: '3', value: '严重' },
        // { item: '4', value: '非常严重' },
        // { item: '5', value: '极其严重' }
        { item: '6', value: '紧急' }
      ],
      frequencyOptions: [  // 新增: 频率选项
        { item: '1', value: '极少' },
        { item: '2', value: '经常' },
        { item: '3', value: '偶尔' },
        { item: '4', value: '不定期' }
      ],
      dataForm: {
        repairType: null,
        severity: null,  // 新增: 严重程度
        frequency: null,  // 新增: 频率
        department: null,
        floor: null,
        corridor: null,
        position: null,
        description: null,
        remark: null,
        eventTime: null,
        equipment: null,
        issue: []
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
        ],
        severity: [  // 新增: 严重程度的验证规则
          { required: true, message: '严重程度不能为空', trigger: 'blur' }
        ],
        frequency: [  // 新增: 频率的验证规则
          { required: true, message: '频率不能为空', trigger: 'blur' }
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

    handleChange(value) {
      console.log(value);
    },
    initDataForm() {
      this.dataForm.repairType = null;
      this.dataForm.severity = '3';  // 新增: 清空严重程度
      this.dataForm.frequency = '2';  // 新增: 清空频率
      this.dataForm.department = null;
      this.dataForm.floor = null;
      this.dataForm.corridor = null;
      this.dataForm.position = null;
      this.dataForm.description = null;
      this.dataForm.remark = null;
      this.dataForm.eventTime = new Date(); // 新增: 清空发生时间
      this.fileList = [];
      this.jobId = null;
      this.equipment = null;
    },

    handleOpen() {
      this.initDataForm();
      this.jobId = Date.now();
    },
    handleClose() {
      this.$emit('handleClose');
    },
    handleCancel() {
      this.initDataForm();
      this.handleClose();
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
    handleError(error, file, fileList) {
      this.$message.error('图片上传失败!');
    },
    uploadData() {
      if (!this.jobId) {
        this.jobId = Date.now();
      }
      return { jobId: this.jobId };
    },

    handSubmit() {
      this.buttonDisabled = true;
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          console.log('提交数据：', this.dataForm);
          console.log('jobId', this.jobId);

          this.$http({
            url: this.$http.adornUrl(`/job/repair/reply`),
            method: 'post',
            data: this.$http.adornData({
              jobId: this.jobId,
              department: this.dataForm.department,
              type: this.dataForm.repairType,
              severity: this.dataForm.severity, // 新增: 提交严重程度
              frequency: this.dataForm.frequency, // 新增: 提交频率
              description: this.dataForm.description,
              remark: this.dataForm.remark,
              floor: this.dataForm.floor,
              corridor: this.dataForm.corridor,
              position: this.dataForm.position,
              eventTime: this.dataForm.eventTime, // 新增: 提交发生时间
              proposerId: this.$store.state.user.id,
              handlerId: this.$store.state.user.id,
              equipment: this.dataForm.equipment
            })
          }).then(({ data }) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.$emit('handleSubmit'); // 通知父组件刷新数据
                  this.dialogVisible = false; // 关闭对话框
                }
              });
              this.buttonDisabled = false;

            } else {
              console.error(data);
              this.$message.error("提交失败");
              this.buttonDisabled = false;

            }
          }).catch(error => {
            console.error('提交失败:', error);
            this.buttonDisabled = false;

          });
        } else {
          console.log('表单验证失败！');
          this.buttonDisabled = false;

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

.el-cascader-menu {
  max-height: 400px;
  max-width: 400px;
  overflow-y: hidden;
  overflow-x: hidden;
}
</style>
