<template>
  <el-row>
    <el-col :span="16">
      <el-form :model="dataForm" ref="dataForm" label-width="120px">
        <div class="title-flex">{{dataForm.name}}</div>
        <el-steps :active="processActive" align-center>
          <!-- <el-option v-for="op in assUserOptions" :key="op.userId" :label="op.username" :value="op.userId" /> -->
          <el-step v-for="op in processStep" :key="op.name" :title="op.name" :description="op.assUser"></el-step>
          <!-- <el-step title="发起" description="处理人：admin"></el-step>
          <el-step title="任务确认" description="处理人：admin"></el-step>
          <el-step title="任务处理" description="处理人：admin"></el-step>
          <el-step title="效果确认" description="处理人：admin"></el-step>
          <el-step title="结束" description="处理人：admin"></el-step> -->
        </el-steps>

        <br><br><br><br>
        <div class="title-flex">提单内容</div>
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题单名称">
              <el-input v-model="dataForm.name" placeholder="问题单名称" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="客户">
              <el-input v-model="dataForm.customName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号">
              <el-input v-model="dataForm.pnName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="SO">
              <el-input v-model="dataForm.so" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置">
              <el-input v-model="dataForm.positionName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="影响">
              <el-input v-model="dataForm.effectName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="影响范围">
              <el-input v-model="dataForm.effectRangeName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="SAP号">
              <el-input v-model="dataForm.sap" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称">
              <el-input v-model="dataForm.deviceName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="问题大类">
              <el-input v-model="dataForm.largeCategoryName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题小类">
              <el-input v-model="dataForm.subCategoryName" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述">
              <el-input v-model="dataForm.problemDesc" type="textarea" :rows="8" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="处理人">
              <el-input v-model="dataForm.assUserName" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="异常发生时间">
              <el-date-picker v-model="dataForm.findTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" style="width:100%" readonly></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="接收邮件">
              <el-input v-model="dataForm.emailTo" type="textarea" :rows="3" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="抄送邮件">
              <el-input v-model="dataForm.emailCc" type="textarea" :rows="3" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <br><br>
        <div class="title-flex">任务处理</div>

        <el-row>
          <el-col :span="12">
            <el-form-item label="问题大类">
              <el-input v-model="dataForm.largeCategory2Name" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题小类">
              <el-input v-model="dataForm.subCategory2Name" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="原因分析">
              <el-input v-model="dataForm.reason" type="textarea" :rows="4" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="处理措施">
              <el-input v-model="dataForm.handle" type="textarea" :rows="4" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="处理效果">
              <el-input v-model="dataForm.result1" type="textarea" :rows="4" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <br> <br>
        <div class="title-flex">效果确认</div>

        <el-row>
          <el-col :span="24">
            <el-form-item label="效果确认">
              <el-input v-model="dataForm.result2" type="textarea" :rows="5" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      processActive: 0,
      dataForm: {},
      processStep: [
        { 'name': '发起', 'assUser': '' },
        { 'name': '任务确认', 'assUser': '' },
        { 'name': '任务处理', 'assUser': '' },
        { 'name': '效果确认', 'assUser': '' },
        { 'name': '结束', 'assUser': '' },
      ]
    }
  },
  activated() {
    console.log(this.$route);
    var formId = this.$route.params.formId;
    this.queryProcessStep(formId);
    this.init(formId);
  },
  methods: {
    init(id) {
      this.$http({
        url: this.$http.adornUrl('/site/siteproblemfrom/list'),
        method: 'post',
        data: this.$http.adornData({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'id': id || 0
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.page.list[0];
          var processStatus = data.page.list[0].processStatus;
          if (processStatus === '4') {
            //撤销
            this.processActive = 0
          } else {
            processStatus === '3' ? this.processActive = 5 : this.processActive = parseInt(processStatus) + 1;
          }
        } else {
          this.dataForm = {}
        }
      })
    },
    queryProcessStep(formId) {
      this.$http({
        url: this.$http.adornUrl('/site/siteprocess/queryList'),
        method: 'post',
        data: this.$http.adornData({
          'formId': formId || 0
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.processStep.forEach((step) => {
            data.list.forEach((item) => {
              if (step.name === item.name) {
                step.assUser = '处理人：' + item.assUserName
              }
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
.title-flex {
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #606266;
  //   margin-top: 5px;
  margin-bottom: 20px;
}

.title-flex::before,
.title-flex::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #dcdfe6;
}

// .title-flex::before {
//   margin-right: 0.1rem;
// }

// .title-flex::after {
//   margin-left: 30rem;
// }

// .el-input__inner {
//   border: none;
//   background-color: rgba(255, 255, 255, 0);
// }
</style>
