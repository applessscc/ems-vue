<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="80px">
      <el-form-item label="客户" prop="custom">
        <el-input v-model="dataForm.custom" placeholder="客户"></el-input>
      </el-form-item>
      <el-form-item label="型号" prop="pn">
        <el-input v-model="dataForm.pn" placeholder="型号"></el-input>
      </el-form-item>
      <el-form-item label="SO" prop="so">
        <el-input v-model="dataForm.so" placeholder="SO"></el-input>
      </el-form-item>
      <el-form-item label="位置" prop="position">
        <el-input v-model="dataForm.position" placeholder="位置"></el-input>
      </el-form-item>
      <el-form-item label="影响" prop="effect">
        <el-input v-model="dataForm.effect" placeholder="影响"></el-input>
      </el-form-item>
      <el-form-item label="影响范围" prop="range">
        <el-input v-model="dataForm.range" placeholder="影响范围"></el-input>
      </el-form-item>
      <el-form-item label="问题大类" prop="largeCategory">
        <el-input v-model="dataForm.largeCategory" placeholder="问题大类"></el-input>
      </el-form-item>
      <el-form-item label="问题小类" prop="subCategory">
        <el-input v-model="dataForm.subCategory" placeholder="问题小类"></el-input>
      </el-form-item>
      <el-form-item label="SAP号" prop="sap">
        <el-input v-model="dataForm.sap" placeholder="SAP号"></el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="deviceName">
        <el-input v-model="dataForm.deviceName" placeholder="设备名称"></el-input>
      </el-form-item>
      <el-form-item label="问题描述" prop="desc">
        <el-input v-model="dataForm.desc" placeholder="问题描述"></el-input>
      </el-form-item>
      <el-form-item label="问题大类-处理人" prop="largeCategory2">
        <el-input v-model="dataForm.largeCategory2" placeholder="问题大类-处理人"></el-input>
      </el-form-item>
      <el-form-item label="问题小类-处理人" prop="subCategory2">
        <el-input v-model="dataForm.subCategory2" placeholder="问题小类-处理人"></el-input>
      </el-form-item>
      <el-form-item label="SAP号-处理人" prop="sap2">
        <el-input v-model="dataForm.sap2" placeholder="SAP号-处理人"></el-input>
      </el-form-item>
      <el-form-item label="设备名称-处理人" prop="deviceName2">
        <el-input v-model="dataForm.deviceName2" placeholder="设备名称-处理人"></el-input>
      </el-form-item>
      <el-form-item label="原因分析-处理人" prop="reason">
        <el-input v-model="dataForm.reason" placeholder="原因分析-处理人"></el-input>
      </el-form-item>
      <el-form-item label="处理措施-处理人" prop="handle">
        <el-input v-model="dataForm.handle" placeholder="处理措施-处理人"></el-input>
      </el-form-item>
      <el-form-item label="处理效果-处理人" prop="result">
        <el-input v-model="dataForm.result" placeholder="处理效果-处理人"></el-input>
      </el-form-item>
      <el-form-item label="效果确认-发起人" prop="result2">
        <el-input v-model="dataForm.result2" placeholder="效果确认-发起人"></el-input>
      </el-form-item>
      <el-form-item label="消息通知组ID" prop="siteGroup">
        <el-input v-model="dataForm.siteGroup" placeholder="消息通知组ID"></el-input>
      </el-form-item>
      <el-form-item label="处理人ID" prop="assUser">
        <el-input v-model="dataForm.assUser" placeholder="处理人ID"></el-input>
      </el-form-item>
      <el-form-item label="发起人ID" prop="startUser">
        <el-input v-model="dataForm.startUser" placeholder="发起人ID"></el-input>
      </el-form-item>
      <el-form-item label="流程状态 0：待处理 1：处理中 2：待关闭 3：结束 4：撤销" prop="processStatus">
        <el-input v-model="dataForm.processStatus" placeholder="流程状态 0：待处理 1：处理中 2：待关闭 3：结束 4：撤销"></el-input>
      </el-form-item>
      <el-form-item label="告警级别 0：正常 1：level1 2：level2" prop="alarmLevel">
        <el-input v-model="dataForm.alarmLevel" placeholder="告警级别 0：正常 1：level1 2：level2"></el-input>
      </el-form-item>
      <el-form-item label="接收邮件" prop="to">
        <el-input v-model="dataForm.to" placeholder="接收邮件"></el-input>
      </el-form-item>
      <el-form-item label="抄送邮件" prop="cc">
        <el-input v-model="dataForm.cc" placeholder="抄送邮件"></el-input>
      </el-form-item>
      <el-form-item label="异常发生时间" prop="findTime">
        <el-input v-model="dataForm.findTime" placeholder="异常发生时间"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
      </el-form-item>
      <el-form-item label="异常解决时间" prop="endTime">
        <el-input v-model="dataForm.endTime" placeholder="异常解决时间"></el-input>
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
        custom: '',
        pn: '',
        so: '',
        position: '',
        effect: '',
        range: '',
        largeCategory: '',
        subCategory: '',
        sap: '',
        deviceName: '',
        desc: '',
        largeCategory2: '',
        subCategory2: '',
        sap2: '',
        deviceName2: '',
        reason: '',
        handle: '',
        result: '',
        result2: '',
        siteGroup: '',
        assUser: '',
        startUser: '',
        processStatus: '',
        alarmLevel: '',
        to: '',
        cc: '',
        findTime: '',
        createTime: '',
        endTime: ''
      },
      dataRule: {
        custom: [
          { required: true, message: '客户不能为空', trigger: 'blur' }
        ],
        pn: [
          { required: true, message: '型号不能为空', trigger: 'blur' }
        ],
        so: [
          { required: true, message: 'SO不能为空', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '位置不能为空', trigger: 'blur' }
        ],
        effect: [
          { required: true, message: '影响不能为空', trigger: 'blur' }
        ],
        range: [
          { required: true, message: '影响范围不能为空', trigger: 'blur' }
        ],
        largeCategory: [
          { required: true, message: '问题大类不能为空', trigger: 'blur' }
        ],
        subCategory: [
          { required: true, message: '问题小类不能为空', trigger: 'blur' }
        ],
        sap: [
          { required: true, message: 'SAP号不能为空', trigger: 'blur' }
        ],
        deviceName: [
          { required: true, message: '设备名称不能为空', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '问题描述不能为空', trigger: 'blur' }
        ],
        largeCategory2: [
          { required: true, message: '问题大类-处理人不能为空', trigger: 'blur' }
        ],
        subCategory2: [
          { required: true, message: '问题小类-处理人不能为空', trigger: 'blur' }
        ],
        sap2: [
          { required: true, message: 'SAP号-处理人不能为空', trigger: 'blur' }
        ],
        deviceName2: [
          { required: true, message: '设备名称-处理人不能为空', trigger: 'blur' }
        ],
        reason: [
          { required: true, message: '原因分析-处理人不能为空', trigger: 'blur' }
        ],
        handle: [
          { required: true, message: '处理措施-处理人不能为空', trigger: 'blur' }
        ],
        result: [
          { required: true, message: '处理效果-处理人不能为空', trigger: 'blur' }
        ],
        result2: [
          { required: true, message: '效果确认-发起人不能为空', trigger: 'blur' }
        ],
        siteGroup: [
          { required: true, message: '消息通知组ID不能为空', trigger: 'blur' }
        ],
        assUser: [
          { required: true, message: '处理人ID不能为空', trigger: 'blur' }
        ],
        startUser: [
          { required: true, message: '发起人ID不能为空', trigger: 'blur' }
        ],
        processStatus: [
          { required: true, message: '流程状态 0：待处理 1：处理中 2：待关闭 3：结束 4：撤销不能为空', trigger: 'blur' }
        ],
        alarmLevel: [
          { required: true, message: '告警级别 0：正常 1：level1 2：level2不能为空', trigger: 'blur' }
        ],
        to: [
          { required: true, message: '接收邮件不能为空', trigger: 'blur' }
        ],
        cc: [
          { required: true, message: '抄送邮件不能为空', trigger: 'blur' }
        ],
        findTime: [
          { required: true, message: '异常发生时间不能为空', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '创建时间不能为空', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '异常解决时间不能为空', trigger: 'blur' }
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
            url: this.$http.adornUrl(`/site/tbsiteproblemfrom/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.custom = data.tbSiteProblemFrom.custom
              this.dataForm.pn = data.tbSiteProblemFrom.pn
              this.dataForm.so = data.tbSiteProblemFrom.so
              this.dataForm.position = data.tbSiteProblemFrom.position
              this.dataForm.effect = data.tbSiteProblemFrom.effect
              this.dataForm.range = data.tbSiteProblemFrom.range
              this.dataForm.largeCategory = data.tbSiteProblemFrom.largeCategory
              this.dataForm.subCategory = data.tbSiteProblemFrom.subCategory
              this.dataForm.sap = data.tbSiteProblemFrom.sap
              this.dataForm.deviceName = data.tbSiteProblemFrom.deviceName
              this.dataForm.desc = data.tbSiteProblemFrom.desc
              this.dataForm.largeCategory2 = data.tbSiteProblemFrom.largeCategory2
              this.dataForm.subCategory2 = data.tbSiteProblemFrom.subCategory2
              this.dataForm.sap2 = data.tbSiteProblemFrom.sap2
              this.dataForm.deviceName2 = data.tbSiteProblemFrom.deviceName2
              this.dataForm.reason = data.tbSiteProblemFrom.reason
              this.dataForm.handle = data.tbSiteProblemFrom.handle
              this.dataForm.result = data.tbSiteProblemFrom.result
              this.dataForm.result2 = data.tbSiteProblemFrom.result2
              this.dataForm.siteGroup = data.tbSiteProblemFrom.siteGroup
              this.dataForm.assUser = data.tbSiteProblemFrom.assUser
              this.dataForm.startUser = data.tbSiteProblemFrom.startUser
              this.dataForm.processStatus = data.tbSiteProblemFrom.processStatus
              this.dataForm.alarmLevel = data.tbSiteProblemFrom.alarmLevel
              this.dataForm.to = data.tbSiteProblemFrom.to
              this.dataForm.cc = data.tbSiteProblemFrom.cc
              this.dataForm.findTime = data.tbSiteProblemFrom.findTime
              this.dataForm.createTime = data.tbSiteProblemFrom.createTime
              this.dataForm.endTime = data.tbSiteProblemFrom.endTime
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
            url: this.$http.adornUrl(`/site/tbsiteproblemfrom/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'custom': this.dataForm.custom,
              'pn': this.dataForm.pn,
              'so': this.dataForm.so,
              'position': this.dataForm.position,
              'effect': this.dataForm.effect,
              'range': this.dataForm.range,
              'largeCategory': this.dataForm.largeCategory,
              'subCategory': this.dataForm.subCategory,
              'sap': this.dataForm.sap,
              'deviceName': this.dataForm.deviceName,
              'desc': this.dataForm.desc,
              'largeCategory2': this.dataForm.largeCategory2,
              'subCategory2': this.dataForm.subCategory2,
              'sap2': this.dataForm.sap2,
              'deviceName2': this.dataForm.deviceName2,
              'reason': this.dataForm.reason,
              'handle': this.dataForm.handle,
              'result': this.dataForm.result,
              'result2': this.dataForm.result2,
              'siteGroup': this.dataForm.siteGroup,
              'assUser': this.dataForm.assUser,
              'startUser': this.dataForm.startUser,
              'processStatus': this.dataForm.processStatus,
              'alarmLevel': this.dataForm.alarmLevel,
              'to': this.dataForm.to,
              'cc': this.dataForm.cc,
              'findTime': this.dataForm.findTime,
              'createTime': this.dataForm.createTime,
              'endTime': this.dataForm.endTime
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
