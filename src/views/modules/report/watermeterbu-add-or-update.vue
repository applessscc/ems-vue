<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'" :close-on-click-modal="false" :visible.sync="visible" width="30%">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="水表型号" prop="counterId">
        <el-select v-model="dataForm.counterId" style="width:100%" placeholder="水表型号" filterable>
          <el-option v-for="op in counterIdOptions" :key="op.item" :label="op.value" :value="op.item" />
        </el-select>
      </el-form-item>
      <el-form-item label="水表名称" prop="counterName">
        <el-input v-model="dataForm.counterName" placeholder="水表名称"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="counterType">
        <el-select v-model="dataForm.counterType" style="width:100%" placeholder="类型">
          <el-option v-for="op in counterTypeOptions" :key="op.item" :label="op.value" :value="op.item" />
        </el-select>
      </el-form-item>
      <el-form-item label="所属BU" prop="buName">
        <el-select v-model="dataForm.buName" style="width:100%" placeholder="所属BU">
          <el-option v-for="op in buNameOptions" :key="op.item" :label="op.value" :value="op.item" />
        </el-select>
      </el-form-item>
      <el-form-item label="位置" prop="positionName">
        <el-select v-model="dataForm.positionName" style="width:100%" placeholder="位置">
          <el-option v-for="op in positionNameOptions" :key="op.item" :label="op.value" :value="op.item" />
        </el-select>
      </el-form-item>
      <el-form-item label="水量占比(%)" prop="buRatio">
        <el-input-number v-model="dataForm.buRatio" placeholder="水量占比" controls-position="right" :precision="2" :min="0.01" :max="100">
          <el-button slot="prepend">%</el-button>
        </el-input-number>
      </el-form-item>
      <!-- <el-form-item label="预留字段2" prop="attr2">
        <el-input v-model="dataForm.attr2" placeholder="预留字段2"></el-input>
      </el-form-item>
      <el-form-item label="预留字段3" prop="attr3">
        <el-input v-model="dataForm.attr3" placeholder="预留字段3"></el-input>
      </el-form-item>
      <el-form-item label="预留字段4" prop="attr4">
        <el-input v-model="dataForm.attr4" placeholder="预留字段4"></el-input>
      </el-form-item>
      <el-form-item label="预留字段5" prop="attr5">
        <el-input v-model="dataForm.attr5" placeholder="预留字段5"></el-input>
      </el-form-item>
      <el-form-item label="预留字段6" prop="attr6">
        <el-input v-model="dataForm.attr6" placeholder="预留字段6"></el-input>
      </el-form-item>
      <el-form-item label="预留字段7" prop="attr7">
        <el-input v-model="dataForm.attr7" placeholder="预留字段7"></el-input>
      </el-form-item>
      <el-form-item label="预留字段8" prop="attr8">
        <el-input v-model="dataForm.attr8" placeholder="预留字段8"></el-input>
      </el-form-item>
      <el-form-item label="0：未删除 1：已删除" prop="deleted">
        <el-input v-model="dataForm.deleted" placeholder="0：未删除 1：已删除"></el-input>
      </el-form-item>
      <el-form-item label="创建人" prop="creator">
        <el-input v-model="dataForm.creator" placeholder="创建人"></el-input>
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-input v-model="dataForm.createTime" placeholder="创建时间"></el-input>
      </el-form-item>
      <el-form-item label="修改人" prop="updater">
        <el-input v-model="dataForm.updater" placeholder="修改人"></el-input>
      </el-form-item>
      <el-form-item label="修改时间" prop="updateTime">
        <el-input v-model="dataForm.updateTime" placeholder="修改时间"></el-input>
      </el-form-item> -->
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
      optionsCode: { 'bu_name': '1001', 'position_name': '1002', 'counter_type': '1006', 'counter_id': '1005' },
      buNameOptions: [],
      positionNameOptions: [],
      counterTypeOptions: [],
      counterIdOptions: [],
      dataForm: {
        id: 0,
        counterId: '',
        counterName: '',
        counterType: '',
        buName: '',
        positionName: '',
        buRatio: '100',
        // attr2: '',
        // attr3: '',
        // attr4: '',
        // attr5: '',
        // attr6: '',
        // attr7: '',
        // attr8: '',
        // deleted: '',
        // creator: '',
        // createTime: '',
        // updater: '',
        // updateTime: ''
      },
      dataRule: {
        counterId: [
          { required: true, message: '水表型号不能为空', trigger: 'blur' }
        ],
        counterName: [
          { required: true, message: '水表名称不能为空', trigger: 'blur' }
        ],
        counterType: [
          { required: true, message: '类型不能为空', trigger: 'blur' }
        ],
        buName: [
          { required: true, message: '所属BU不能为空', trigger: 'blur' }
        ],
        positionName: [
          { required: true, message: '位置不能为空', trigger: 'blur' }
        ],
        buRatio: [
          { required: true, message: '电量占比不能为空', trigger: 'blur' }
        ],
        // attr2: [
        //   { required: true, message: '预留字段2不能为空', trigger: 'blur' }
        // ],
        // attr3: [
        //   { required: true, message: '预留字段3不能为空', trigger: 'blur' }
        // ],
        // attr4: [
        //   { required: true, message: '预留字段4不能为空', trigger: 'blur' }
        // ],
        // attr5: [
        //   { required: true, message: '预留字段5不能为空', trigger: 'blur' }
        // ],
        // attr6: [
        //   { required: true, message: '预留字段6不能为空', trigger: 'blur' }
        // ],
        // attr7: [
        //   { required: true, message: '预留字段7不能为空', trigger: 'blur' }
        // ],
        // attr8: [
        //   { required: true, message: '预留字段8不能为空', trigger: 'blur' }
        // ],
        // deleted: [
        //   { required: true, message: '0：未删除 1：已删除不能为空', trigger: 'blur' }
        // ],
        // creator: [
        //   { required: true, message: '创建人不能为空', trigger: 'blur' }
        // ],
        // createTime: [
        //   { required: true, message: '创建时间不能为空', trigger: 'blur' }
        // ],
        // updater: [
        //   { required: true, message: '修改人不能为空', trigger: 'blur' }
        // ],
        // updateTime: [
        //   { required: true, message: '修改时间不能为空', trigger: 'blur' }
        // ]
      }
    }
  },
  created() {
    this.getDictParams({ code: this.optionsCode.bu_name });
    this.getDictParams({ code: this.optionsCode.position_name });
    this.getDictParams({ code: this.optionsCode.counter_type });
    this.getDictParams({ code: this.optionsCode.counter_id });
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/report/watermeterbu/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.counterId = data.watermeterBu.counterId
              this.dataForm.counterName = data.watermeterBu.counterName
              this.dataForm.counterType = data.watermeterBu.counterType
              this.dataForm.buName = data.watermeterBu.buName
              this.dataForm.positionName = data.watermeterBu.positionName
              this.dataForm.buRatio = data.watermeterBu.buRatio
              console.log(this.dataForm);
              // this.dataForm.attr2 = data.electricityBu.attr2
              // this.dataForm.attr3 = data.electricityBu.attr3
              // this.dataForm.attr4 = data.electricityBu.attr4
              // this.dataForm.attr5 = data.electricityBu.attr5
              // this.dataForm.attr6 = data.electricityBu.attr6
              // this.dataForm.attr7 = data.electricityBu.attr7
              // this.dataForm.attr8 = data.electricityBu.attr8
              // this.dataForm.deleted = data.electricityBu.deleted
              // this.dataForm.creator = data.electricityBu.creator
              // this.dataForm.createTime = data.electricityBu.createTime
              // this.dataForm.updater = data.electricityBu.updater
              // this.dataForm.updateTime = data.electricityBu.updateTime
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
            url: this.$http.adornUrl(`/report/watermeterbu/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'counterId': this.dataForm.counterId,
              'counterName': this.dataForm.counterName,
              'counterType': this.dataForm.counterType,
              'buName': this.dataForm.buName,
              'positionName': this.dataForm.positionName,
              'buRatio': this.dataForm.buRatio,
              // 'attr2': this.dataForm.attr2,
              // 'attr3': this.dataForm.attr3,
              // 'attr4': this.dataForm.attr4,
              // 'attr5': this.dataForm.attr5,
              // 'attr6': this.dataForm.attr6,
              // 'attr7': this.dataForm.attr7,
              // 'attr8': this.dataForm.attr8,
              // 'deleted': this.dataForm.deleted,
              // 'creator': this.dataForm.creator,
              // 'createTime': this.dataForm.createTime,
              // 'updater': this.dataForm.updater,
              // 'updateTime': this.dataForm.updateTime
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
    },
    getDictParams(params) {
      params.page = 1;
      params.limit = 1000;
      this.$http({
        url: this.$http.adornUrl('/sys/dictitem/list'),
        method: 'get',
        params: this.$http.adornParams(params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (params.code == this.optionsCode.bu_name) {
            this.buNameOptions = data.page.list;
          } else if (params.code == this.optionsCode.position_name) {
            this.positionNameOptions = data.page.list;
          } else if (params.code == this.optionsCode.counter_type) {
            this.counterTypeOptions = data.page.list;
          } else if (params.code == this.optionsCode.counter_id) {
            this.counterIdOptions = data.page.list;
          } else {
            console.log("params.code:" + params.code)
          }
        } else {
          console.log(data);
        }
      })
    }
  }
}
</script>
