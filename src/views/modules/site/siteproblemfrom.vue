<template>
  <el-row>
    <el-col :span="16">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="问题单名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="问题单名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="客户" prop="custom">
              <el-select v-model="dataForm.custom" placeholder="客户" :clearable="true" style="width:100%">
                <el-option v-for="op in customOptions" :key="op.item" :label="op.value" :value="op.item" />
              </el-select>
              <!-- <el-input v-model="dataForm.custom" placeholder="客户"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号" prop="pn">
              <el-select v-model="dataForm.pn" placeholder="型号" :clearable="true" style="width:100%">
                <el-option v-for="op in pnOptions" :key="op.item" :label="op.value" :value="op.item" />
              </el-select>
              <!-- <el-input v-model="dataForm.pn" placeholder="型号"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="SO" prop="so">
              <el-input v-model="dataForm.so" placeholder="SO"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置" prop="position">
              <el-select v-model="dataForm.position" placeholder="位置" style="width:100%">
                <el-option v-for="op in positionOptions" :key="op.item" :label="op.value" :value="op.item" />
              </el-select>
              <!-- <el-input v-model="dataForm.position" placeholder="位置"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="影响" prop="effect">
              <el-select v-model="dataForm.effect" placeholder="影响" style="width:100%">
                <el-option v-for="op in effectOptions" :key="op.item" :label="op.value" :value="op.item" />
              </el-select>
              <!-- <el-input v-model="dataForm.effect" placeholder="影响"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="影响范围" prop="effectRange">
              <el-select v-model="dataForm.effectRange" placeholder="影响范围" style="width:100%">
                <el-option v-for="op in effectRangeOptions" :key="op.item" :label="op.value" :value="op.item" />
              </el-select>
              <!-- <el-input v-model="dataForm.effectRange" placeholder="影响范围"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="SAP号" prop="sap">
              <el-input v-model="dataForm.sap" placeholder="SAP号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备名称" prop="deviceName">
              <el-input v-model="dataForm.deviceName" placeholder="设备名称"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="问题大类" prop="largeCategory">
              <el-select v-model="dataForm.largeCategory" placeholder="问题大类" style="width:100%">
                <el-option v-for="op in largeCategoryOptions" :key="op.item" :label="op.value" :value="op.item" />
              </el-select>
              <!-- <el-input v-model="dataForm.largeCategory" placeholder="问题大类"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="问题小类" prop="subCategory">
              <el-select v-model="dataForm.subCategory" placeholder="问题小类" style="width:100%">
                <el-option v-for="op in subCategoryOptions" :key="op.item" :label="op.value" :value="op.item" />
              </el-select>
              <!-- <el-input v-model="dataForm.subCategory" placeholder="问题小类"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="问题描述" prop="problemDesc">
              <el-input v-model="dataForm.problemDesc" placeholder="问题描述" type="textarea" :rows="8"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="处理人" prop="assUser">
              <el-select v-model="dataForm.assUser" clearable filterable @change="assUserChange($event)" placeholder="处理人" style="width:100%">
                <el-option v-for="op in assUserOptions" :key="op.userId" :label="op.username" :value="op.userId" />
              </el-select>
              <!-- <el-input v-model="dataForm.assUser" placeholder="处理人"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="异常发生时间" prop="findTime">
              <el-date-picker v-model="dataForm.findTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" style="width:100%"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="接收邮件" prop="emailToArr">
              <el-select v-model="dataForm.emailToArr" clearable filterable multiple allow-create default-first-option placeholder="接收邮件" style="width:100%">
                <el-option v-for="op in assUserOptions" :key="op.userId" :label="op.email" :value="op.email" />
              </el-select>
              <!-- <el-input v-model="dataForm.emailTo" placeholder="接收邮件"></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="抄送邮件" prop="emailCcToArr">
              <el-select v-model="dataForm.emailCcArr" clearable filterable multiple allow-create default-first-option placeholder="抄送邮件" style="width:100%">
                <el-option v-for="op in assUserOptions" :key="op.userId" :label="op.email" :value="op.email" />
              </el-select>
              <!-- <el-input v-model="dataForm.emailCcTo" placeholder="抄送邮件"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-form-item label="问题大类-处理人" prop="largeCategory2">
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
        <el-form-item label="处理效果-处理人" prop="result1">
          <el-input v-model="dataForm.result1" placeholder="处理效果-处理人"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="效果确认-发起人" prop="result2">
          <el-input v-model="dataForm.result2" placeholder="效果确认-发起人"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="消息通知组ID" prop="siteGroup">
          <el-input v-model="dataForm.siteGroup" placeholder="消息通知组ID"></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="发起人ID" prop="startUser">
          <el-input v-model="dataForm.startUser" placeholder="发起人ID"></el-input>
        </el-form-item>
        <el-form-item label="流程状态 0：待处理 1：处理中 2：待关闭 3：结束 4：撤销" prop="processStatus">
          <el-input v-model="dataForm.processStatus" placeholder="流程状态 0：待处理 1：处理中 2：待关闭 3：结束 4：撤销"></el-input>
        </el-form-item>
        <el-form-item label="告警级别 0：正常 1：level1 2：level2" prop="alarmLevel">
          <el-input v-model="dataForm.alarmLevel" placeholder="告警级别 0：正常 1：level1 2：level2"></el-input>
        </el-form-item> -->

        <!-- <el-form-item label="创建时间" prop="createTime">
          <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="异常解决时间" prop="endTime">
          <el-input v-model="dataForm.endTime" placeholder="异常解决时间"></el-input>
        </el-form-item> -->

        <el-form-item>
          <el-button type="primary" @click="dataFormSubmit()">提交</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { getDictParams } from '@/utils/commonUtils.js'

export default {
  data() {
    return {
      customOptions: [],
      pnOptions: [],
      positionOptions: [],
      effectOptions: [],
      effectRangeOptions: [],
      largeCategoryOptions: [],
      subCategoryOptions: [],
      assUserOptions: [],
      emailCcToOptions: [],
      dataForm: {
        id: 0,
        name: '',
        custom: '',
        pn: '',
        so: '',
        position: '',
        effect: '',
        effectRange: '',
        largeCategory: '',
        subCategory: '',
        sap: '',
        deviceName: '',
        problemDesc: '',
        largeCategory2: '',
        subCategory2: '',
        sap2: '',
        deviceName2: '',
        reason: '',
        handle: '',
        result1: '',
        result2: '',
        siteGroup: '',
        assUser: '',
        startUser: '',
        processStatus: '',
        alarmLevel: '',
        emailTo: '',
        emailToArr: [],
        emailCc: '',
        emailCcArr: [],
        findTime: '',
        createTime: '',
        endTime: ''
      },
      dataRule: {
        name: [
          { required: true, message: '问题单名称', trigger: 'blur' }
        ],
        custom: [
          { required: true, message: '客户不能为空', trigger: 'blur' }
        ],
        // pn: [
        //   { required: true, message: '型号不能为空', trigger: 'blur' }
        // ],
        // so: [
        //   { required: true, message: 'SO不能为空', trigger: 'blur' }
        // ],
        position: [
          { required: true, message: '位置不能为空', trigger: 'blur' }
        ],
        effect: [
          { required: true, message: '影响不能为空', trigger: 'blur' }
        ],
        effectRange: [
          { required: true, message: '影响范围不能为空', trigger: 'blur' }
        ],
        largeCategory: [
          { required: true, message: '问题大类不能为空', trigger: 'blur' }
        ],
        subCategory: [
          { required: true, message: '问题小类不能为空', trigger: 'blur' }
        ],
        // sap: [
        //   { required: true, message: 'SAP号不能为空', trigger: 'blur' }
        // ],
        // deviceName: [
        //   { required: true, message: '设备名称不能为空', trigger: 'blur' }
        // ],
        problemDesc: [
          { required: true, message: '问题描述不能为空', trigger: 'blur' }
        ],
        // largeCategory2: [
        //   { required: true, message: '问题大类-处理人不能为空', trigger: 'blur' }
        // ],
        // subCategory2: [
        //   { required: true, message: '问题小类-处理人不能为空', trigger: 'blur' }
        // ],
        // sap2: [
        //   { required: true, message: 'SAP号-处理人不能为空', trigger: 'blur' }
        // ],
        // deviceName2: [
        //   { required: true, message: '设备名称-处理人不能为空', trigger: 'blur' }
        // ],
        // reason: [
        //   { required: true, message: '原因分析-处理人不能为空', trigger: 'blur' }
        // ],
        // handle: [
        //   { required: true, message: '处理措施-处理人不能为空', trigger: 'blur' }
        // ],
        // result1: [
        //   { required: true, message: '处理效果-处理人不能为空', trigger: 'blur' }
        // ],
        // result2: [
        //   { required: true, message: '效果确认-发起人不能为空', trigger: 'blur' }
        // ],
        // siteGroup: [
        //   { required: true, message: '消息通知组ID不能为空', trigger: 'blur' }
        // ],
        assUser: [
          { required: true, message: '处理人不能为空', trigger: 'blur' }
        ],
        // startUser: [
        //   { required: true, message: '发起人ID不能为空', trigger: 'blur' }
        // ],
        // processStatus: [
        //   { required: true, message: '流程状态 0：待处理 1：处理中 2：待关闭 3：结束 4：撤销不能为空', trigger: 'blur' }
        // ],
        // alarmLevel: [
        //   { required: true, message: '告警级别 0：正常 1：level1 2：level2不能为空', trigger: 'blur' }
        // ],
        emailToArr: [
          { required: true, message: '接收邮件不能为空', trigger: 'blur' }
        ],
        emailCcArr: [
          { required: true, message: '抄送邮件不能为空', trigger: 'blur' }
        ],
        findTime: [
          { required: true, message: '异常发生时间不能为空', trigger: 'blur' }
        ],
        // createTime: [
        //   { required: true, message: '创建时间不能为空', trigger: 'blur' }
        // ],
        // endTime: [
        //   { required: true, message: '异常解决时间不能为空', trigger: 'blur' }
        // ]
      }
    }
  },
  created() {
    //获取数据字典
    this.customOptions = getDictParams(1019); //现场问题处理-客户
    this.pnOptions = getDictParams(1020); //现场问题处理-型号
    this.positionOptions = getDictParams(1021); //现场问题处理-位置
    this.effectOptions = getDictParams(1022); //现场问题处理-影响
    this.effectRangeOptions = getDictParams(1023); //现场问题处理-影响范围
    this.largeCategoryOptions = getDictParams(1024); //现场问题处理-问题大类
    this.subCategoryOptions = getDictParams(1025); //现场问题处理-问题小类

    //获取处理人信息
    this.getAssUser();
  },
  methods: {
    assUserChange($event) {
      if ($event === null) {
        this.dataForm.emailCcArr = [];
        this.dataForm.emailToArr = [];
        return;
      }
      //获取邮件抄送人
      this.getAssUserAuth($event);
      //获取邮件主送人
      this.assUserOptions.forEach((item) => {
        if (item.userId === $event) {
          this.dataForm.emailToArr = [item.email];
        }
      })
    },
    getAssUser() {
      this.$http({
        url: this.$http.adornUrl(`/sys/user/querySiteGroupUserList`),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.assUserOptions = data.list;
        }
      })
    },
    getAssUserAuth(userId) {
      this.$http({
        url: this.$http.adornUrl(`/sys/user/querySiteGroupUserAuth`),
        method: 'get',
        params: this.$http.adornParams({
          'userId': userId
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.emailCcArr = [];
          data.list.forEach((item) => {
            this.dataForm.emailCcArr.push(item.email);
          })
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
            url: this.$http.adornUrl(`/site/siteproblemfrom/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.name = data.tbSiteProblemFrom.name
              this.dataForm.custom = data.tbSiteProblemFrom.custom
              this.dataForm.pn = data.tbSiteProblemFrom.pn
              this.dataForm.so = data.tbSiteProblemFrom.so
              this.dataForm.position = data.tbSiteProblemFrom.position
              this.dataForm.effect = data.tbSiteProblemFrom.effect
              this.dataForm.effectRange = data.tbSiteProblemFrom.effectRange
              this.dataForm.largeCategory = data.tbSiteProblemFrom.largeCategory
              this.dataForm.subCategory = data.tbSiteProblemFrom.subCategory
              this.dataForm.sap = data.tbSiteProblemFrom.sap
              this.dataForm.deviceName = data.tbSiteProblemFrom.deviceName
              this.dataForm.problemDesc = data.tbSiteProblemFrom.problemDesc
              // this.dataForm.largeCategory2 = data.tbSiteProblemFrom.largeCategory2
              // this.dataForm.subCategory2 = data.tbSiteProblemFrom.subCategory2
              // this.dataForm.sap2 = data.tbSiteProblemFrom.sap2
              // this.dataForm.deviceName2 = data.tbSiteProblemFrom.deviceName2
              // this.dataForm.reason = data.tbSiteProblemFrom.reason
              // this.dataForm.handle = data.tbSiteProblemFrom.handle
              // this.dataForm.result1 = data.tbSiteProblemFrom.result1
              // this.dataForm.result2 = data.tbSiteProblemFrom.result2
              this.dataForm.siteGroup = data.tbSiteProblemFrom.siteGroup
              this.dataForm.assUser = data.tbSiteProblemFrom.assUser
              // this.dataForm.startUser = data.tbSiteProblemFrom.startUser
              // this.dataForm.processStatus = data.tbSiteProblemFrom.processStatus
              // this.dataForm.alarmLevel = data.tbSiteProblemFrom.alarmLevel
              this.dataForm.emailTo = data.tbSiteProblemFrom.emailTo
              this.dataForm.emailCc = data.tbSiteProblemFrom.emailCc
              this.dataForm.findTime = data.tbSiteProblemFrom.findTime
              // this.dataForm.createTime = data.tbSiteProblemFrom.createTime
              // this.dataForm.endTime = data.tbSiteProblemFrom.endTime
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataForm.emailTo = this.dataForm.emailToArr.join(',');
          this.dataForm.emailCc = this.dataForm.emailCcArr.join(',');
          //发送请求
          this.$http({
            url: this.$http.adornUrl(`/site/siteproblemfrom/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'name': this.dataForm.name,
              'custom': this.dataForm.custom,
              'pn': this.dataForm.pn,
              'so': this.dataForm.so,
              'position': this.dataForm.position,
              'effect': this.dataForm.effect,
              'effectRange': this.dataForm.effectRange,
              'largeCategory': this.dataForm.largeCategory,
              'subCategory': this.dataForm.subCategory,
              'sap': this.dataForm.sap,
              'deviceName': this.dataForm.deviceName,
              'problemDesc': this.dataForm.problemDesc,
              // 'largeCategory2': this.dataForm.largeCategory2,
              // 'subCategory2': this.dataForm.subCategory2,
              // 'sap2': this.dataForm.sap2,
              // 'deviceName2': this.dataForm.deviceName2,
              // 'reason': this.dataForm.reason,
              // 'handle': this.dataForm.handle,
              // 'result1': this.dataForm.result1,
              // 'result2': this.dataForm.result2,
              'siteGroup': this.dataForm.siteGroup,
              'assUser': this.dataForm.assUser,
              // 'startUser': this.dataForm.startUser,
              // 'processStatus': this.dataForm.processStatus,
              // 'alarmLevel': this.dataForm.alarmLevel,
              'emailTo': this.dataForm.emailTo,
              'emailCc': this.dataForm.emailCc,
              'findTime': this.dataForm.findTime,
              // 'createTime': this.dataForm.createTime,
              // 'endTime': this.dataForm.endTime
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  //重置表单
                  this.$refs['dataForm'].resetFields();
                  //跳转到流程进度
                  this.$router.push({ name: 'site-siteproblemfrom2'})
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
