<template>
  <div>

    <div class="main-contain-top">
      <el-card>
        <div style="text-align: center;">
          <span style="font-weight: bold; font-size: 90px;">SN：{{ currentSn && currentSn.sn ? currentSn.sn : '暂无' }}</span>
        </div>

      </el-card>
    </div>

    <div class="curent-job-contain">
      <el-card style = "height:370px">
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
        <div class="curent-job-contain-top">
          <el-descriptions :column="3" border>
            <el-descriptions-item label="SN" label-class-name="my-label" content-class-name="my-content">{{currentSn.sn == null|| currentSn.sn == ''?"暂无":currentSn.sn}}</el-descriptions-item>
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

        <div class="main-form-container" v-if="switchValue">
          <el-form ref="form" :model="form" :rules="dataRule" label-width="80px">
            <el-form-item label="SN">
              <el-input v-model="form.sn" placeholder="请输入SN号" style="max-width: 200px;" @keydown.native.enter="onSubmit()" ref="snInput"></el-input>
            </el-form-item>
            <el-form-item>
              <el-radio-group v-model="form.operationType">
                <el-radio :label="5">开始检测</el-radio>
                <el-radio :label="3">PASS</el-radio>
                <el-radio :label="4">FAIL</el-radio>
              </el-radio-group>
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="onSubmit(5)">开始检测</el-button>
              <el-button type="primary" @click="onSubmit(3)">PASS</el-button>
              <el-button type="danger" @click="onSubmit(4)">FAIL</el-button>
            </el-form-item> -->

          </el-form>
        </div>

        <div class="main-form-container" v-else>
          <el-form ref="form" :model="form" :rules="dataRule" label-width="80px">
            <el-form-item label="SN">
              <el-input v-model="form.sn" placeholder="请输入SN号" style="max-width: 200px;" @keydown.native.enter="onSubmit()" ref="snInput"></el-input>
            </el-form-item>
            <!-- <el-form-item>
              <el-button type="primary" @click="onSubmit(1)">进站</el-button>
              <el-button type="primary" @click="onSubmit(2)">出站</el-button>
            </el-form-item> -->
            <el-form-item>
              <el-radio-group v-model="form.operationType" border>
                <el-radio :label="1">进站</el-radio>
                <el-radio :label="2">出站</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>

      </el-card>

    </div>
    <div class="main-contain">
      <el-card style="height: 420px;">

        <div id="app">
          <div ref="echart" style="width: 100%; height: 400px;"></div>
        </div>

      </el-card>
    </div>
    <div>
      <div class="left-top-contain">
        <el-card>
          <div slot="header">
            <el-row type="flex" justify="space-between" align="middle">
              <span style="font-weight: bold;">设备图片
              </span>
              <el-select v-model="form.location" clearable placeholder="请选择位置">
                <el-option v-for="item in locationOptions" :key="item.item" :label="item.value" :value="item.item">
                </el-option>
              </el-select>
            </el-row>
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
            <el-table-column label="状态" width="80">
              <template slot-scope="scope">
                {{ getJobStatusName(scope.row.status) }}
              </template>
            </el-table-column>
            <el-table-column label="检测结果">
              <template slot-scope="scope">
                {{ getTestJobStatusName(scope.row.testStatus) }}
              </template>
            </el-table-column>
            <!-- <el-table-column prop="createTime" label="进站时间" >
            </el-table-column> -->

          </el-table>
        </div>

      </el-card>

    </div>

  </div>

</template>

<script>
import * as echarts from 'echarts'; // 引入echarts

export default {


  data() {
    return {

      // 总进站数和不良品数
      inCount: [],
      failCount: [],
      // 可选位置
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

      // 设备检测||设备进站
      switchValue: true,

      // 提交设备表单
      form: {
        operationType: 5,
        sn: null,
        location: null
      },

      dataRule: {
        sn: [
          { required: true, message: 'sn不能为空', trigger: 'blur' }
        ],
        location: [
          { required: true, message: '位置不能为空', trigger: 'blur' }

        ]
      },

      // sn列表
      tableData: [],
      currentSn: {
        id: null,                   // 主键id
        sn: null,                   // sn号
        so: null,                   // so
        nadel: null,                // nadel
        proposerId: null,           // 申请人id
        handlerId: null,            // 操作人id
        position: null,             // 位置
        status: null,               // 任务状态
        testStatus: null,           // 测试状态
        operationTime: null,        // 操作时间
        createTime: null,           // 创建时间
        updateTime: null,           // 修改时间
        currentSn: null,            // 当前sn号
      },


    }
  },
  components: {

  },



  watch: {
    // 监听 location 的变化
    "form.location"(newLocation, oldLocation) {
      console.log('form.location发生改变', oldLocation, newLocation);
      if (newLocation != oldLocation) {
        this.geSysList(1019, newLocation); // 更新数据
        this.fetchData();  // 获取数据
        this.getDailyDate(newLocation);  // 获取日数据
      }
      this.$nextTick(() => {
        this.$refs.snInput.focus();
      });
    },
    "switchValue"(newValue, oldValue) {
      // 确保页面加载时聚焦到输入框
      this.$nextTick(() => {
        this.$refs.snInput.focus();
      });
      if (newValue) {
        this.form.operationType = 5
      } else {
        this.form.operationType = 1
      }


    },
    "form.operationType"() {
      // 确保页面加载时聚焦到输入框
      this.$nextTick(() => {
        this.$refs.snInput.focus();
      });

    },
    "$route.query.location"(newLocation, oldLocation) {
      console.log('$route.query.location发生改变', oldLocation, newLocation);
      // 如果需要根据路由参数直接更新
      if (newLocation) {
        this.form.location = newLocation;
        // 确保页面加载时聚焦到输入框
        this.$nextTick(() => {
          this.$refs.snInput.focus();
        });
      }
    }



  },
  computed: {

  },

  beforeDestroy() {

  },
  created() {
  },
  mounted() {
    // 确保页面加载时聚焦到输入框
    this.$nextTick(() => {
      this.$refs.snInput.focus();
    });
    const location = this.$route.query.location || (this.form.location ? this.form.location : 1) // 默认使用路由中的 location
    this.geSysList(1019, location);
    this.fetchData();
    this.getDailyDate(this.location);


  },
  methods: {

    initChart() {

      const myChart2 = echarts.getInstanceByDom(this.$refs.echart);
      if (myChart2) {
        myChart2.dispose();  // 销毁已有的图表实例
      }

      const myChart = echarts.init(this.$refs.echart);


      // 更新图表配置项
      const option = {
        legend: {
          data: ['总进站数', '不良品数'],
          top: 'top',
          left: 'center',
        },
        xAxis: {
          type: 'category',
          data: [
            '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00',
            '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00',
            '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
          ],
          axisLabel: {
            interval: 0,
            rotate: 45,
          },
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            name: '总进站数',
            data: this.inCount,  // 使用动态数据
            type: 'bar',
          },
          {
            name: '不良品数',
            data: this.failCount, // 使用动态数据
            type: 'bar',
            itemStyle: {
              color: 'lightcoral',
            },
          },
        ],
      };

      // 设置图表的配置项
      myChart.setOption(option);
    },


    // 入站数和不良品柱形图
    getDailyDate(location) {
      const params = {
        location: location
      };
      console.log('getDailyDatelocation', location);

      this.$http({
        url: this.$http.adornUrl(`/cooker/cookerJob/getDailyDate`),  // 接口地址
        method: 'get',              //  POST 请求
        params: params,                // 使用 data 传递参数
      }).then((response) => {
        console.log(response)
        const data = response.data.data;  // 解析后端返回的分页数据
        this.inCount = data.in;
        this.failCount = data.fail;
        this.initChart(); // 在数据加载完之后初始化图表

      }).catch((error) => {
        // this.$message.error('加载数据失败');
        console.log('getDailyDate获取数据失败：', error);
      });
    },
    // 获取sn列表
    fetchData() {
      const params = {
        location: this.form.location
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
      }).catch((error) => {
        this.$message.error('加载数据失败');
        console.log('获取数据失败：', error);
      });
    },

    // 获取位置字典
    geSysList(code, defaultIndex) {
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
          if (defaultIndex) {
            this.form.location = this.locationOptions[defaultIndex - 1].item
          }
        } else {
          this.locationOptions = []
        }
      })
    },
    openNew(path) {
      let newUrl = this.$router.resolve({ path: path });
      window.open(newUrl.href, '_blank');
    },


    getBySn(sn) {
      const params = {
        sn: sn
      };
      this.$http({
        url: this.$http.adornUrl(`/cooker/cookerJob/getBySn`),
        method: 'get',
        params: params,
      }).then((response) => {
        const data = response.data.data;
        this.currentSn = data;
      }).catch((error) => {
        this.$message.error('加载数据失败');
        console.log('获取数据失败：', error);
      });
    },

    onSubmit(type) {

      if (type && this.form.operationType) {
        this.$message({
          message: '请选择操作类型',
          type: 'warn',
          duration: 1000
        });
        return
      }

      if ((this.form.location == null || this.form.location == '') && type == 5 && (this.currentSn.position == null || this.currentSn.position == '')) {
        this.$message({
          message: '请先选择位置',
          type: 'warn',
          duration: 1000
        });
        return
      }

      this.$refs.form.validate((valid) => {
        if ((type == null && this.form.operationType == null) || this.form.sn == null) {
          this.$message({
            message: '参数不全',
            type: 'warn',
            duration: 1000
          });
          return
        }
        if (valid) {
          const params = {
            operationType: type == null ? this.form.operationType : type,
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
            this.getDailyDate(this.form.location);
            this.getBySn(this.form.sn);
            this.form.sn = null;
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
            } else if (response.data.data == 55) {  // 修改这里为一个不同的代码值
              this.$message({
                message: '还未进站或者已经开始检测',
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
  /* position: fixed;
  top: 540px;
  left: 800px;
  width: 1000px;
  height: 560px; */

  position: fixed;
    left: 38%;
    top: 55%;
    width: 60.5%;
}
.left-top-contain {
  /* position: fixed;
  top: 95px;
  width: 500px;
  height: 400px; */

  position: fixed;
  top: 17%;
  left: 1.5%;
  width: 35%;
  height: 36%;
}
.left-top-contain-img {
  background-image: url("../../assets/img/left-top-bg.jpg");
  background-size: cover; /* 让背景图片覆盖整个 div */
  background-position: center; /* 图片居中 */
  width: 100%;
  height: 250px;
}
.left-bottom-contain {
  /* position: fixed;
  top: 480px;
  width: 500px;
  height: 200px; */

  position: fixed;
  top: 55%;
  width: 35%;
  height: 30%;
  left: 1.5%;
}
.left-bottom-contain-table {
  overflow-y: auto;
  width: 100%;
  height: 100%;
}
.curent-job-contain {
  /* position: fixed;
  left: 800px;
  top: 210px;
  width: 1000px;
  height: 300px; */

  position: fixed;
  left: 38%;
  top: 17%;
  width: 60.5%;
}
.main-contain-top {
  /* top: 95px;
  left: 800px;
  width: 1000px;
  position: fixed; */
  top: 1.5%;
  left: 1.5%;
  width: 97%;
  position: fixed;
}
.el-switch__core {
  left: 10px;
}
.curent-job-contain-bottom {
  margin-top: 25px;
  margin-left: 5px;
}
.main-form-container {
  margin-top: 25px;
}
</style>