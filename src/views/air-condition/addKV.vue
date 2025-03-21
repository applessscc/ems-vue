<template>
  <div>

    <div class="logo-container">
      <span class="logo-text">VTech 温度系数比值</span>
    </div>

    <div class="form-container">
      <el-form :model="form" label-width="60px" :inline="true">
        <el-form-item label="sbu">
          <el-select v-model="form.sbu" placeholder="请选择sbu" filterable style="width: 120px">
            <el-option v-for="device in Array.from(new Set(devices.map(device => device.sbu))).sort()" :key="device"
              :label="device" :value="device">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="ID">
          <el-select v-model="form.id" placeholder="请选择设备" clearable filterable style="width: 200px"
            :disabled="!form.sbu">
            <el-option v-for="device in devices.filter(device => device.sbu === form.sbu)" :key="device.id"
              :label="device.id" :value="device.id">
            </el-option>
          </el-select>
        </el-form-item>



        <el-form-item label="系数">
          <el-input v-model="form.coefficient" style="width: 120px" placeholder="请输入系数"   @input="validateNumber('coefficient')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit" plain>添加</el-button>
          <el-button type="danger" @click="clean" plain>一键清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-table :data="tableData" border style="width: 100%" :max-height="420">
        <el-table-column prop="sbu" label="sbu" width="300px" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="id" label="ID" width="300px" align="center" show-overflow-tooltip></el-table-column>
        <el-table-column prop="coefficient" label="系数" width align="center" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button @click="deleteRow(scope.$index)" type="danger" size="mini" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="form-buttom-container">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="预期温度">
          <el-input v-model="form.expMaxTem" placeholder="最小温度" style="display: inline-block; width: 90px;"
            @input="validateNumber('expMaxTem')">
          </el-input>
          <span style="display: inline-block; vertical-align: top;">C°</span>
          <span style="display: inline-block; vertical-align: top; margin-inline: 10px;">-</span>
          <el-input v-model="form.expMinTem" placeholder="最大温度" style="display: inline-block; width: 90px;"
            @input="validateNumber('expMinTem')">
          </el-input>
          <span style="display: inline-block; vertical-align: top;">C°</span>
        </el-form-item>

      </el-form>
    </div>

    <div class="table-submit-container">
      <el-button type="primary" @click="onSubmitTable" plain round size="medium ">提交</el-button>
    </div>

  </div>
</template>

<script>
import { saveVisitLog } from '@/utils/commonUtils.js'
import { watch } from 'less';
export default {
  data() {
    return {
      devices: [],
      sbu: [],
      tableData: [
      ],
      form: {
        expMinTem: '',
        expMaxTem: '',
        coefficient: '',
        sbu: '',
        id: ''
      }
    };
  },

  watch: {

    // 监听 location 的变化
    "form.sbu"(n, o) {
      if (n !== o) {
        this.form.id = '';
      }
    }



  },
  created() {
    this.getThRecord();
    saveVisitLog('温度系数比值');

  },
  mounted() {
  },
  methods: {
    validateNumber(field) {
      this.form[field] = this.form[field].replace(/[^0-9.]/g, ''); // Allow only numbers and decimal points
    },
    clean() {
      this.tableData = [];
      this.form = {
        expMinTem: '',
        expMaxTem: '',
        coefficient: '',
        sbu: '',
        id: ''
      };
    },
    onSubmitTable() {
      if (this.tableData.length == 0) {
        this.$message.error('请添加数据');
        return;
      }
      const data = {
        tableData: this.tableData,
        expMaxTem: this.form.expMaxTem,
        expMinTem: this.form.expMinTem,
      };
      this.$http({
        url: this.$http.adornUrl('/extProject/addKV'),
        method: 'post',
        data: data,
      }).then((response) => {
        this.$message({
          message: '添加成功',
          type: 'success',
          duration: 2000
        });
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


    onSubmit() {
      if (!this.form.coefficient || !this.form.sbu || !this.form.id) {
        this.$message.error('请填写完整的表单数据');
        return;
      }
      this.tableData.push({
        sbu: this.form.sbu,
        id: this.form.id,
        coefficient: this.form.coefficient
      });
  // 延迟操作，确保表格渲染完成后再执行其他操作
  this.$nextTick(() => {
    this.$message.success('数据已成功添加');
  });    },
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

  width: 50%;
  margin: 40px auto;
}

.table-container {
  max-width: 50%;
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
