<template>
  <div>

    <div class="main-contain-top">
      <el-card>
        <div style="text-align: center;">
          <span style="font-weight: bold; font-size: 50px;">当前SN：{{form.sn}}</span>
        </div>

      </el-card>
    </div>

    <div class="curent-job-contain">
      <el-card style="height: 210px;">
        <div slot="header" class="clearfix">
          <span style="font-weight: bold;">当前检测设备</span>
        </div>
        <div class="curent-job-contain-top">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="SN" label-class-name="my-label" content-class-name="my-content">{{form.sn == null|| form.sn == ''?"暂无":form.sn}}</el-descriptions-item>
            <el-descriptions-item label="SO">暂无</el-descriptions-item>
            <el-descriptions-item label="Nadel">暂无</el-descriptions-item>
            <el-descriptions-item label="状态" v-if="false">
              <el-tag size="small">待检测</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="检测结果" v-if="false">
              <el-tag size="small">通过</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </el-card>

    </div>
    <div class="main-contain">
      <el-card style="height: 437px;">
        <div slot="header" class="clearfix">

          <el-row type="flex" justify="space-between" align="middle">
            <span style="font-weight: bold;" v-if="switchValue">设备检测
              <el-switch v-model="switchValue" active-color="#13ce66" inactive-color="#3498db"></el-switch>
            </span>
            <span style="font-weight: bold;" v-else>设备过站
              <el-switch v-model="switchValue" active-color="#13ce66" inactive-color="#3498db"></el-switch>
            </span>
            <el-button type="primary" @click="openNew('cookerJob/cookerJobKanban')">任务看板</el-button>
          </el-row>

        </div>
        <div class="main-form-container" v-if="switchValue">
          <el-form ref="form" :model="form" :rules="dataRule" label-width="80px">
            <el-form-item label="SN">
              <el-input v-model="form.sn" placeholder="请输入SN号" style="max-width: 200px;"></el-input>
            </el-form-item>

            <el-form-item label="位置">
              <el-select v-model="form.location" placeholder="请选择">
                <el-option v-for="item in locationOptions" :key="item.item" :label="item.value" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-radio v-model="form.operationType" label="3">PASS</el-radio>
              <el-radio v-model="form.operationType" label="4">FAIL</el-radio>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
          </el-form>
        </div>

        <div class="main-form-container" v-else>

          <el-form ref="form" :model="form" :rules="dataRule" label-width="80px">
            <el-form-item label="SN">
              <el-input v-model="form.sn" placeholder="请输入SN号" style="max-width: 200px;"></el-input>
            </el-form-item>
            <el-form-item>
              <el-radio v-model="form.operationType" label="1">进站</el-radio>
              <el-radio v-model="form.operationType" label="2">出站</el-radio>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
          </el-form>
        </div>

      </el-card>
    </div>

    <div>
      <div class="left-top-contain">
        <el-card>
          <div slot="header">
            <span style="font-weight: bold;">设备图片 </span>
          </div>
          <div class="left-top-contain-img">
          </div>
        </el-card>
      </div>
    </div>

    <div class="left-bottom-contain">
      <el-card>
        <div slot="header">
          <span style="font-weight: bold;">SN列表 
          </span>

        </div>
        <div class="left-bottom-contain-table">
          <el-table :data="tableData" style="width: 100%" stripe border height="320px">
            <el-table-column prop="sn" label="SN号" width="150">
            </el-table-column>
            <el-table-column label="状态" width="60">
              <template slot-scope="scope">
                {{ getJobStatusName(scope.row.status) }}
              </template>
            </el-table-column>
            <el-table-column label="检测结果" width="80">
              <template slot-scope="scope">
                {{ getTestJobStatusName(scope.row.testStatus) }}
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="进站时间" width="160">
            </el-table-column>

          </el-table>
        </div>

      </el-card>

    </div>

  </div>

</template>

<script>
export default {

  data() {
    return {
      locationOptions: [

      ],


      getJobStatusName(code) {
        if (code == 1) {
          return "进站"
        } else if (code == 2) {
          return "出站"
        } else if (code == 0) {
          return "未进站"
        }
        else {
          return "未知状态"
        }
      },
      getTestJobStatusName(code) {
        if (code == 3) {
          return "PASS"
        } else if (code == 4) {
          return "FAIL"
        } else if (code == 0) {
          return "未检测"
        }
        else {
          return "未知状态"
        }
      },

      switchValue: false,

      // 提交表单
      form: {
        operationType: null,
        sn: null,
        location: null,
      },

      dataRule: {
        operationType: [
          { required: true, message: '请选择操作类型', trigger: 'blur' }
        ],
        sn: [
          { required: true, message: 'sn不能为空', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '位置不能为空', trigger: 'blur' }

        ]
      },

      // sn列表
      tableData: []


    }
  },
  components: {

  },

  watch: {

  },
  computed: {

  },
  created() {
  },
  mounted() {
    this.geSysList(1019);
    this.fetchData();


  },
  methods: {




    // 获取sn列表
    fetchData() {
      const params = {
        // pageNum: this.currentPage, // 当前页码
        // pageSize: this.pageSize,   // 每页显示的数据量

      };
      this.$http({
        url: this.$http.adornUrl(`/cooker/cookerJob/listJob`),  // 接口地址
        method: 'post',              //  POST 请求
        data: params,                // 使用 data 传递参数
      }).then((response) => {
        console.log(response)
        const data = response.data.data;  // 解析后端返回的分页数据
        console.log('data', data);

        this.tableData = data;       // 表格数据
        // this.totalItems = data.total;     // 总条目数
        // this.currentPage = data.pageNum;  // 当前页码
        // this.pageSize = data.pageSize;    // 每页显示条数
      }).catch((error) => {
        this.$message.error('加载数据失败');
        console.log('获取数据失败：', error);
      });
    },

    // 获取位置字典
    geSysList(code) {
      this.code = code;
      this.$http({
        url: this.$http.adornUrl('/sys/dictitem/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': 1,
          'limit': 1000,
          'code': code
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.locationOptions = data.page.list
        } else {
          this.locationOptions = []
        }
      })
    },
    openNew(path) {
      let newUrl = this.$router.resolve({ path: path });
      window.open(newUrl.href, '_blank');
    },
    onSubmit() {

      this.$refs.form.validate((valid) => {
        if (this.form.operationType == null || this.form.sn == null) {
          this.$message({
            message: '参数不全',
            type: 'warn',
            duration: 1000
          });
          return
        }
        if (valid) {

          const params = {
            operationType: this.form.operationType,
            sn: this.form.sn,
            // proposerId:this.$store.state.user.id,
            handlerId: this.$store.state.user.id,
            position: this.form.location
          };
          console.log('炒饭机任务操作', params);


          this.$http({
            url: this.$http.adornUrl(`/cooker/cookerJob/dealJob`),  // 接口地址
            method: 'post',              // 改为 POST 请求
            data: params,                // 使用 data 传递参数
          }).then((response) => {
            this.fetchData();

            if (response.data.data == 11) {
              this.$message({
                message: '已经入站！',
                type: 'error',
                duration: 1000
              });
            } else if (response.data.data == 22) {
              this.$message({
                message: '已经出站，或者垓SN不存在！',
                type: 'error',
                duration: 1000
              });
            } else if (response.data.data == 33) {
              this.$message({
                message: '已经PASS或者不满足PASS条件',
                type: 'error',
                duration: 1000
              });
            } else if (response.data.data == 44) {  // 修改这里为一个不同的代码值
              this.$message({
                message: '已经FAIL或者不满足FAIL条件',
                type: 'error',
                duration: 1000
              });
            } else if (response.data.data == 0) {  // 修改这里为一个不同的代码值
              this.$message({
                message: '操作失败',
                type: 'error',
                duration: 1000
              });
            }
            else {
              console.log('炒饭机任务操作', response);
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1000
              });
            }



          }).catch((error) => {
            this.$message({
              message: '操作失败',
              type: 'error',
              duration: 1000
            });
            console.log('操作任务状态失败：', error);

          });


        } else {
          console.log('表单验证失败！');

        }






      });




    }
  }
}
</script>
<style >
.main-contain {
  /* background-color: rgb(184, 31, 31); */
  position: fixed;
  top: 470px;
  left: 800px;
  width: 1000px;
  height: 560px;
}
.left-top-contain {
  position: fixed;
  top: 10%;
  width: 500px;
  height: 400px;

  /* background-color: rgb(89, 61, 165); */
}
.left-top-contain-img {
  background-image: url("../../assets/img/left-top-bg.jpg");
  background-size: cover; /* 让背景图片覆盖整个 div */
  background-position: center; /* 图片居中 */
  width: 100%;
  height: 250px;
}
.left-bottom-contain {
  position: fixed;
  top: 470px;
  width: 500px;
  height: 200px;
}
.left-bottom-contain-table {
  overflow-y: auto;
  width: 100%;

  height: 350px;
}
.curent-job-contain {
  position: fixed;
  left: 800px;
  top: 230px;
  width: 1000px;
  height: 300px;
  /* background-color: aquamarine; */
}
.main-contain-top {
  top: 10%;
  left: 800px;
  width: 1000px;

  position: fixed;
}
.el-switch__core {
  left: 10px;
}
.curent-job-contain-bottom{
  margin-top: 25px;
    margin-left: 5px;
}


</style>