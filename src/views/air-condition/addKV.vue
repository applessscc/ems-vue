<template>
  <div>

    <div class="logo-container">
      <span class="logo-text">VTech 温度系数比值</span>
    </div>
    <div class="form-container">
      <el-form :model="form" label-width="60px" :inline="true">

        <el-form-item label="组别">
          <el-select v-model="groupId" placeholder="已新增的组别" style="width: 150px" clearable>
            <el-option v-for="groupId in groupIds" :key="groupId.groupId" :label="groupId.groupName"
              :value="groupId.groupId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="sbu">
          <el-select v-model="form.sbu" placeholder="sbu" filterable style="width: 80px">
            <el-option v-for="device in Array.from(new Set(devices.map(device => device.sbu))).sort()" :key="device"
              :label="device" :value="device">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="ID">
          <el-select v-model="form.id" placeholder="请选择设备" clearable filterable style="width: 170px"
            :disabled="!form.sbu">
            <el-option v-for="device in devices.filter(device => device.sbu === form.sbu)" :key="device.id"
              :label="device.id" :value="device.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系数">
          <el-input v-model="form.coefficient" style="width: 80px" placeholder="系数"
            @input="validateNumber('coefficient')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item></el-form-item>
          <el-button type="primary" @click="onSubmit" plain>添加</el-button>
          <el-button type="danger" @click="clean" plain>一键清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-table :data="tableData" border style="width: 100%" :max-height="420" :key="tableData.length">
        <el-table-column prop="sbu" label="sbu" width="100px" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="eqid" label="设备ID" width="300px" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="coefficient" label="系数" width="100px" align="center"
          show-overflow-tooltip></el-table-column>
          <el-table-column prop="t" label="实时温度" width="100px" align="center" show-overflow-tooltip v-if="groupId != ''"></el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="deleteRow(scope.$index)" type="danger" size="mini" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="form-buttom-container">
      <el-form :inline="true" class="demo-form-inline" :rules="rules" ref="form" v-model="form">
        <el-form-item label="组名称">
          <el-input v-model="form.groupName" style="width: 120px" placeholder="groupName"></el-input>
        </el-form-item>
        <el-form-item label="预期温度">
          <el-input v-model="form.expMaxTem" placeholder="min" style="display: inline-block; width: 70px;"
            @input="validateNumber('expMaxTem')">
          </el-input>
          <span style="display: inline-block; vertical-align: top;">C°</span>
          <span style="display: inline-block; vertical-align: top; margin-inline: 10px;">-</span>
          <el-input v-model="form.expMinTem" placeholder="max" style="display: inline-block; width: 70px;"
            @input="validateNumber('expMinTem')">
          </el-input>
          <span style="display: inline-block; vertical-align: top;">C°</span>
        </el-form-item>
        <el-form-item label="换算后的实时温度" v-if="form.coefficientT">
          <el-tag>{{ form.t }}</el-tag>
        </el-form-item>

      </el-form>
    </div>

    <div class="table-submit-container">
      <el-button type="primary" @click="onSubmitTable" plain round size="medium " v-if="groupId == ''">新增组别</el-button>
      <el-button type="warning" @click="onSubmitTable" plain round size="medium "
        v-if="groupId != '' && tableData.length != 0">确认修改组别</el-button>
      <el-button type="danger" @click="onSubmitTable" plain round size="medium "
        v-if="groupId != '' && tableData.length == 0">确认删除组别</el-button>

    </div>

  </div>
</template>

<script>
import { saveVisitLog } from '@/utils/commonUtils.js'
export default {
  data() {
    return {
      rules: {
        groupName: [
          { required: true, message: '请输入组名称', trigger: 'blur' }
        ]

      },
      groupId: '',
      devices: [],
      groupIds: [],
      sbu: [],
      tableData: [
      ],
      form: {
        groupName: '',
        areaName: '',
        expMinTem: '',
        expMaxTem: '',
        coefficient: '',
        sbu: '',
        id: '',
        t: '',
        coefficientT:''
      }
    };
  },

  watch: {

    "form.sbu"(n, o) {
      if (n !== o) {
        this.form.id = '';
      }
    },

    "groupId"(n, o) {
      if (n !== o) {
        if (n != '') {
          this.getThKvRecord();
        } else {
          this.clean();
        }
      }
    }



  },
  created() {
    this.getThRecord();
    this.getThKvRecordGroups();
    saveVisitLog('温度系数比值');
  },
  mounted() {
  },
  methods: {
    validateNumber(field) {
      this.form[field] = this.form[field].replace(/[^0-9.]/g, ''); // Allow only numbers and decimal points
    },
    clean() {
      this.groupId = '';
      this.tableData = [];
      this.form = {
        expMinTem: '',
        expMaxTem: '',
        coefficient: '',
        groupName: '',
        sbu: '',
        id: '',
        coefficientT:''
      };
    },
    onSubmitTable() {
      if (this.tableData.length == 0 && this.groupId == '') {
        this.$message.wa('请添加数据');
        return;
      }
      if (this.form.groupName == '') {
        this.$message.error('请填写组名称');
        return;
      }
      const data = {
        groupId: this.groupId,
        tableData: this.tableData,
        expMaxTem: this.form.expMaxTem,
        expMinTem: this.form.expMinTem,
        groupName: this.form.groupName
      };
      this.$http({
        url: this.$http.adornUrl('/extProject/addKV'),
        method: 'post',
        data: data,
      }).then((response) => {
        if (response.data.data == false) {
          this.$message({
            message: '组别名称重复！',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 2000
        });
        this.clean();
        this.getThKvRecordGroups();
        if (this.groupId != '') {
          this.getThKvRecord();
        }
      }).catch((error) => {
        console.log('error', error);
      });
    },
    getThRecord() {
      const params = {
      };
      this.$http({
        url: this.$http.adornUrl('/extProject/getThRecord'),
        method: 'get',
        params: params,
      }).then((response) => {
        const data = response.data.data;
        if (data) {
          this.devices = data.map(item => ({
            id: item.id,
            sbu: item.sbu,
          }));
        }
      }).catch((error) => {
        console.log('error', error);
      });
    },

    getThKvRecordGroups() {
      const params = {
      };

      this.$http({
        url: this.$http.adornUrl('/extProject/getThKvRecord'),
        method: 'post',
        data: params,
      }).then((response) => {
        const data = response.data.data;

        this.groupIds = data.map(item => ({
          groupId: item.groupId,
          groupName: item.groupName
        }));

        console.log("groupIds", this.groupIds)
        this.groupIds = [...new Map(this.groupIds.map(item => [item.groupId, item])).values()];

      }).catch((error) => {
        console.log('Error:', error);
      });
    },


    getThKvRecord() {
      const params = {
        groupId: this.groupId
      };

      this.$http({
        url: this.$http.adornUrl('/extProject/getThKvRecord'),
        method: 'post',
        data: params,
      }).then((response) => {
        const data = response.data.data;
        this.tableData = data
        this.form.expMaxTem = data[0].expMaxTem;
        this.form.expMinTem = data[0].expMinTem;
        this.form.groupName = data[0].groupName;
        this.form.coefficientT = data[0].coefficientT;

      }).catch((error) => {
        console.log('Error:', error);
      });
    },



    onSubmit() {
      if (!this.form.coefficient || !this.form.sbu || !this.form.id) {
        this.$message.error('请填写完整的表单数据');
        return;
      }
      this.tableData.push({
        sbu: this.form.sbu,
        eqid: this.form.id,
        id: this.form.id,
        coefficient: this.form.coefficient
      });
      // 延迟操作，确保表格渲染完成后再执行其他操作
      this.$nextTick(() => {
        this.$message.success('数据已成功添加');
      });
      this.getThKvRecordGroups();

    },
    deleteRow(index) {
      this.tableData.splice(index, 1);
      this.$message.success('数据已成功删除');
    }
  }

}
</script>

<style scoped>
.logo-container {
  text-align: center;
  margin-top: 50px;
  margin-bottom: 20px;
}

.logo-text {
  font-size: 50px;
  font-weight: bold;
  color: #4ec6fd;
  font-family: "Arial", sans-serif;
  display: inline-block;
  font-style: italic;
}

.form-container {
  text-align: center;

  width: 60%;
  margin: 40px auto;
}

.table-container {
  max-width: 40%;
  margin: 20px auto;
}

.table-submit-container {
  text-align: center;
  /* 使容器中的内容水平居中 */
  margin: 20px auto;
}

.form-buttom-container {
  text-align: center;
  width: 50%;
  margin: 20px auto;
  margin-top: 40px;

}
</style>
