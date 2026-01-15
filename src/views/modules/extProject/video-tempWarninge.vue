<template>
  <div class="app-container">
    <el-form :inline="true" :model="searchForm" class="search-form" @submit.native.prevent>
      <el-form-item>
        <el-input 
          v-model="searchForm.deviceId" 
          placeholder="请输入设备ID查询" 
          style="width: 250px;" 
          clearable
          @keyup.enter.native="fetchTempWarningInfo">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchTempWarningInfo" plain>查询</el-button>
        <el-button type="success" icon="el-icon-plus" @click="addNewRow" plain>新增告警配置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="warningInfoList" style="width: 100%" border stripe>
      <el-table-column label="配置ID" prop="id" width="100" align="center"></el-table-column>

      <el-table-column label="设备ID" width="220">
        <template slot-scope="scope">
          <el-select 
            v-model="scope.row.deviceId" 
            filterable 
            placeholder="请选择或搜索设备" 
            size="small"
            style="width: 100%">
            <el-option 
              v-for="item in deviceOptions" 
              :key="item.id"
              :label="item.id + (item.sbu ? ' - ' + item.sbu : '')" 
              :value="item.id">
              <span style="float: left">{{ item.id }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.sbu }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>

      <el-table-column label="告警短信模板">
        <template slot-scope="scope">
          <el-input 
            type="textarea" 
            :rows="1" 
            v-model="scope.row.smsContext" 
            size="small"
            placeholder="告警短信模板">
          </el-input>
        </template>
      </el-table-column>

      <el-table-column label="触发时间段" width="280">
        <template slot-scope="scope">
          <el-time-picker 
            is-range 
            v-model="scope.row.timeRange" 
            size="small" 
            range-separator="-"
            start-placeholder="起始时间" 
            end-placeholder="结束时间" 
            format="HH:mm"
            value-format="HH:mm" 
            @change="handleRangeChange(scope.row)" 
            style="width: 260px">
          </el-time-picker>
        </template>
      </el-table-column>

      <el-table-column label="上限温度" width="160">
        <template slot-scope="scope">
          <el-input 
            v-model="scope.row.upTem" 
            size="small" 
            placeholder="请输入上限温度">
          </el-input>
        </template>
      </el-table-column>

      <el-table-column label="下限温度" width="160">
        <template slot-scope="scope">
          <el-input 
            v-model="scope.row.downTem" 
            size="small" 
            placeholder="请输入下限温度">
          </el-input>
        </template>
      </el-table-column>

      <el-table-column label="告警手机号" width="180">
        <template slot-scope="scope">
          <el-input 
            v-model="scope.row.phone" 
            size="small" 
            placeholder="请输入手机号">
          </el-input>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button 
            :type="scope.row.id ? 'warning' : 'success'" 
            size="mini" 
            @click="handleSave(scope.row)">
            {{ scope.row.id ? '修改' : '保存' }}
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      warningInfoList: [], // 预警配置列表
      deviceOptions: [],   // 设备下拉选项
      searchForm: {
        deviceId: ""
      }
    };
  },
  created() {
    this.getDeviceOptions(); // 1. 加载设备列表
    this.fetchTempWarningInfo(); // 2. 加载数据
  },
  methods: {
    getDeviceOptions() {
      this.$http({
        url: this.$http.adornUrl('/extProject/getThRecord'),
        method: 'get'
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.deviceOptions = data.data;
        }
      }).catch(err => console.error("加载设备列表失败", err));
    },

    fetchTempWarningInfo() {
      this.$http({
        url: this.$http.adornUrl('/extProject/getTempWarningInfoListe'),
        method: 'get',
        params: { searchForm: this.searchForm.deviceId }
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.warningInfoList = data.data.map(item => {
            return {
              ...item,
              timeRange: (item.startRunTime && item.endRunTime) 
                ? [item.startRunTime, item.endRunTime] 
                : []
            };
          });
        }
      });
    },

    handleRangeChange(row) {
      if (row.timeRange && row.timeRange.length === 2) {
        row.startRunTime = row.timeRange[0];
        row.endRunTime = row.timeRange[1];
      } else {
        row.startRunTime = '';
        row.endRunTime = '';
      }
    },

    addNewRow() {
      this.warningInfoList.unshift({
        id: null,
        deviceId: '',
        smsContext: '',
        timeRange: [],    // 供组件显示
        startRunTime: '', // 供后端保存
        endRunTime: '',   // 供后端保存
        upTem: '',        // 新字段
        downTem: '',      // 新字段
        phone: ''         // 新字段
      });
    },

    handleSave(row) {
      if (!row.deviceId) {
        return this.$message.warning('请选择设备');
      }
      if (!row.startRunTime || !row.endRunTime) {
        return this.$message.warning('请选择完整的时间段');
      }

      // Save the new fields as well
      this.$http({
        url: this.$http.adornUrl('/extProject/addTempWarningInfo'),
        method: 'post',
        data: row
      }).then(({ data }) => {
        if (data && data.code === 200) {
          this.$message.success('保存成功');
          this.fetchTempWarningInfo(); // 刷新数据
        } else {
          this.$message.error(data.msg || '保存失败');
        }
      });
    },

    handleDelete(row, index) {
      if (!row.id) {
        return this.warningInfoList.splice(index, 1);
      }

      this.$confirm(`确定删除设备 [${row.deviceId}] 的配置吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/extProject/deleteTempWarningInfo'),
          method: 'get',
          params: { id: row.id }
        }).then(({ data }) => {
          if (data && data.code === 200) {
            this.$message.success('删除成功');
            this.fetchTempWarningInfo();
          }
        });
      }).catch(() => {});
    }
  }
}
</script>
