<template>
    <div>
        <el-form :inline="true" :model="{ searchForm: searchForm }" class="search-form">
            <el-form-item label="">
                <el-input v-model="searchForm" placeholder="请输入设备ID/名称" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="fetchAppInfo()" plain>查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="addAppInfo()" plain>新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="appInfoList" style="width: 100%" border>


            <el-table-column label="appId" prop="appId" width="150">

                <template slot-scope="scope">
                    <el-input v-model="scope.row.appId" size="small" placeholder="请输入设备ID"></el-input>
                </template>
            </el-table-column>

            <el-table-column label="name" prop="name" width="150">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.name" size="small" placeholder="请输入名称"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="SAP" prop="sap" width="150">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.sap" size="small" placeholder="请输入SAP"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="ip" prop="ip" width="150">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.ip" size="small" placeholder="请输入IP地址"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="address" prop="address" width="150">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.address" size="small" placeholder="请输入地址"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="operator" prop="operator" width="150"></el-table-column>
            <el-table-column label="createTime" prop="createTime" width="180"></el-table-column>
            <el-table-column label="updateTime" prop="updateTime" width="180"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="warning" plain @click="handleUpdate(scope.row)" v-if="scope.row.id != null">修改
                    </el-button>
                    <el-button type="success" plain @click="handleUpdate(scope.row)" v-if="scope.row.id == null">新增
                    </el-button>
                    <el-button type="danger" plain @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>

        </el-table>

    </div>
</template>

<script>
export default {
    data() {
        return {
            appInfoList: [], // This will hold the list of app info objects
            searchForm: "",
            dialogFormVisible: false,
            newApp: {
                id: null, // 新设备信息的ID，新增时为null
                appId: '',
                name: '',
                sap: '',
                ip: '',
                address: ''
            }, // 新设备信息
        };
    },
    mounted() {
    },
    created() {
        this.fetchAppInfo();
    },
    computed: {

    },
    methods: {
        addAppInfo() {
            this.appInfoList.unshift({
                id: null, // 新设备信息的ID，新增时为null
                appId: this.newApp.appId,
                name: this.newApp.name,
                sap: this.newApp.sap,
                ip: this.newApp.ip,
                address: this.newApp.address,
                operator: this.$store.state.user.name,
                createTime: this.formatDate(new Date()),
                updateTime: this.formatDate(new Date())
            });

            this.$forceUpdate();
        },



        handleUpdate(row) {
            this.$http({
                url: this.$http.adornUrl('/extProject/addAppInfo'),
                method: 'post',
                data: {
                    id: row.id, // 新设备信息的ID，新增时为null
                    appId: row.appId,
                    name: row.name,
                    sap: row.sap,
                    ip: row.ip,
                    address: row.address,
                    operator: row.operator,
                    createTime: row.createTime,
                    updateTime: row.updateTime
                }
            }).then((response) => {
                if (response.data.code === 200) {
                    if (row.id == null) {
                        this.$message.success('新增成功');
                    } else {
                        this.$message.success('修改成功');
                    }
                    this.fetchAppInfo();
                } else {
                    this.$message.error(response.data.msg);
                }
            }).catch((error) => {
                console.error(error);
            })
        },
        handleDelete(row) {
            if (row.id == null) {
                this.appInfoList.splice(this.appInfoList.indexOf(row), 1);
            } else {
                this.$http({
                    url: this.$http.adornUrl('/extProject/deleteAppInfo'),
                    method: 'get',
                    params: {
                        id: row.id
                    }
                }).then((response) => {
                    if (response.data.code === 200) {
                        this.$message.success('删除成功');
                        this.fetchAppInfo();
                    } else {
                        this.$message.error(response.data.msg);
                    }
                }).catch((error) => {
                    console.error(error);
                })
            }
        },
        fetchAppInfo() {
            this.$http({
                url: this.$http.adornUrl('/extProject/getAppInfoList'),
                method: 'get',
                params: {
                    searchForm: this.searchForm
                }

            }).then((response) => {
                if (response.data.code === 200) {
                    this.appInfoList = response.data.data;
                } else {
                    this.$message.error(response.data.msg);
                }
            }).catch((error) => {
                console.error(error);
            })
        },
        formatDate(date) {
            if (!date) return '';
            const d = new Date(date);
            const year = d.getFullYear();
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const day = d.getDate().toString().padStart(2, '0');
            const hours = d.getHours().toString().padStart(2, '0');
            const minutes = d.getMinutes().toString().padStart(2, '0');
            const seconds = d.getSeconds().toString().padStart(2, '0');
            return `
            ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },

        resetForm() {
            // 在关闭对话框时重置表单数据
            this.$nextTick(() => {
                this.$refs.newAppForm.resetFields();
            });
        }
    }
}
</script>

<style scoped></style>