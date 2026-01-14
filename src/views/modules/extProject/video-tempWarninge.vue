<template>
    <div class="app-container">
        <el-form :inline="true" :model="{ searchForm: searchForm }" class="search-form">
            <el-form-item>
                <el-input v-model="searchForm" placeholder="请输入设备ID查询" style="width: 250px;" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="fetchTempWarningInfo" plain>查询</el-button>
                <el-button type="success" icon="el-icon-plus" @click="addNewRow" plain>新增告警配置</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="warningInfoList" style="width: 100%" border stripe>
            <el-table-column label="ID" prop="id" width="70" align="center"></el-table-column>

            <el-table-column label="设备ID" width="220">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.deviceId" filterable placeholder="请选择或搜索设备" size="small"
                        style="width: 100%">
                        <el-option v-for="item in deviceOptions" :key="item.id"
                            :label="item.id + (item.sbu ? ' - ' + item.sbu : '')" :value="item.id">
                            <span style="float: left">{{ item.id }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.sbu }}</span>
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>

            <el-table-column label="短信内容">
                <template slot-scope="scope">
                    <el-input type="textarea" :rows="1" v-model="scope.row.smsContext" size="small"
                        placeholder="告警短信模板"></el-input>
                </template>
            </el-table-column>

            <el-table-column label="短信触发时间" width="380">
                <template slot-scope="scope">
                    <el-date-picker v-model="scope.row.timeRange" type="datetimerange" size="small" range-separator="至"
                        start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd HH:mm:ss"
                        :default-time="['00:00:00', '23:59:59']" @change="handleRangeChange(scope.row)"
                        style="width: 350px">
                    </el-date-picker>
                </template>
            </el-table-column>

            <el-table-column label="操作" width="160" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button :type="scope.row.id ? 'warning' : 'success'" size="mini" @click="handleSave(scope.row)">
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
            deviceOptions: [],   // 设备下拉选项 (ThRecord)
            searchForm: ""
        };
    },
    created() {
        this.getDeviceOptions(); // 1. 先加载设备列表
        this.fetchTempWarningInfo(); // 2. 加载预警数据
    },
    methods: {
        // 获取所有温湿度设备记录作为下拉选项
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

        // 获取预警配置列表
        fetchTempWarningInfo() {
            this.$http({
                url: this.$http.adornUrl('/extProject/getTempWarningInfoListe'),
                method: 'get',
                params: { searchForm: this.searchForm }
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.warningInfoList = data.data;
                }
            });
        },

        addNewRow() {
            this.warningInfoList.unshift({
                id: null,
                deviceId: '',
                smsContext: '',
                startRunTime: '',
                endRunTime: ''
            });
        },

        handleSave(row) {
            if (!row.deviceId) {
                return this.$message.warning('请选择设备');
            }
            this.$http({
                url: this.$http.adornUrl('/extProject/addTempWarningInfo'),
                method: 'post',
                data: row
            }).then(({ data }) => {
                if (data && data.code === 200) {
                    this.$message.success('保存成功');
                    this.fetchTempWarningInfo();
                }
            });
        },

        handleDelete(row, index) {
            if (!row.id) return this.warningInfoList.splice(index, 1);

            this.$confirm(`确定删除设备 [${row.deviceId}] 的配置吗?`, '提示', { type: 'warning' }).then(() => {
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
            });
        }
    }
}
</script>