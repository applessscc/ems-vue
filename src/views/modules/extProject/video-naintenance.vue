<template>
    <div>
        <el-form :inline="true" :model="{ searchForm: searchForm }" class="search-form">
            <el-form-item label="">
                <el-input v-model="searchForm" placeholder="请输入videoId/name" style="width: 300px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="fetchVideoInfo()" plain>查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="addVideoInfo()" plain>新增</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="videoInfoList" style="width: 100%" border>
            <el-table-column label="id" prop="id" width="100"></el-table-column>


            <el-table-column label="name" prop="name" width="150">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.name" size="small" placeholder="请输入名称"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="ip" prop="ip" width="150">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.ip" size="small" placeholder="请输入IP地址"></el-input>
                </template>
            </el-table-column>

            <el-table-column label="password" prop="password" width="150">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.password" size="small" placeholder="请输入密码"></el-input>
                </template>
            </el-table-column>

                <el-table-column label="videoUrl" prop="videoUrl" width="260">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.videoUrl" size="small" placeholder="访问路径（多个流逗号隔开）"></el-input>
                </template>
            </el-table-column>

            <el-table-column label="operator" prop="operator" width="100"></el-table-column>
            <el-table-column label="createTime" prop="createTime" width="154"></el-table-column>
            <el-table-column label="updateTime" prop="updateTime" width="154"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="warning" plain @click="handleUpdate(scope.row)"
                        v-if="scope.row.id != null">修改</el-button>
                    <el-button type="success" plain @click="handleUpdate(scope.row)"
                        v-if="scope.row.id == null">新增</el-button>
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
            videoInfoList: [], // 视频信息列表
            searchForm: "",
            dialogFormVisible: false,
            newVideo: {
                id: null,
                videoId: '',
                name: '',
                sap: '',
                ip: '',
                address: '',
                videoUrl:''
            }
        };
    },
    mounted() {
    },
    created() {
        this.fetchVideoInfo();
    },
    methods: {
        addVideoInfo() {
            this.videoInfoList.unshift({
                id: null,
                videoId: this.newVideo.videoId,
                name: this.newVideo.name,
                sap: this.newVideo.sap,
                ip: this.newVideo.ip,
                address: this.newVideo.address,
                operator: this.$store.state.user.name,
                password: this.newVideo.password,
                videoUrl: this.newVideo.videoUrl,
                createTime: this.formatDate(new Date()),
                updateTime: this.formatDate(new Date())
            });
            this.$forceUpdate();
        },
        handleUpdate(row) {
            this.$http({
                url: this.$http.adornUrl('/extProject/addVideoInfo'),
                method: 'post',
                data: {
                    id: row.id,
                    videoId: row.videoId,
                    name: row.name,
                    sap: row.sap,
                    ip: row.ip,
                    address: row.address,
                    operator: row.operator,
                    password: row.password,
                    videoUrl: row.videoUrl,
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
                    this.fetchVideoInfo();
                } else {
                    this.$message.error(response.data.msg);
                }
            }).catch((error) => {
                console.error(error);
            });
        },
        handleDelete(row) {
            if (row.id == null) {
                this.videoInfoList.splice(this.videoInfoList.indexOf(row), 1);
            } else {
                this.$http({
                    url: this.$http.adornUrl('/extProject/deleteVideoInfo'),
                    method: 'get',
                    params: {
                        id: row.id
                    }
                }).then((response) => {
                    if (response.data.code === 200) {
                        this.$message.success('删除成功');
                        this.fetchVideoInfo();
                    } else {
                        this.$message.error(response.data.msg);
                    }
                }).catch((error) => {
                    console.error(error);
                });
            }
        },
        fetchVideoInfo() {
            this.$http({
                url: this.$http.adornUrl('/extProject/getVideoInfoList'),
                method: 'get',
                params: {
                    searchForm: this.searchForm
                }
            }).then((response) => {
                if (response.data.code === 200) {
                    this.videoInfoList = response.data.data;
                } else {
                    this.$message.error(response.data.msg);
                }
            }).catch((error) => {
                console.error(error);
            });
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
            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        },
        resetForm() {
            this.$nextTick(() => {
                this.$refs.newVideoForm.resetFields();
            });
        }
    }
}
</script>

<style scoped></style>