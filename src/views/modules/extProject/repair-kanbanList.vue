<template>
  <div>
<!-- 
    <el-table :data="[]" style="width: 100%" :row-class-name="rowhighlight" class="listTable" v-if="false">
      <el-table-column fixed label="序号" width="100">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="任务状态" width="150">
        <template slot-scope="scope">
          {{ getJobStatusName(scope.row.status) }}
        </template>
      </el-table-column>

      <el-table-column prop="equipment" label="设备号" width="100">

      </el-table-column>

      <el-table-column prop="createTime" label="申请时间" width="220">
      </el-table-column>
      <el-table-column label="故障位置" width="160">
        <template slot-scope="scope">
          {{scope.row.floor+'-'+scope.row.corridor+'-'+scope.row.position}}
        </template>
      </el-table-column>
      <el-table-column prop="proposerName" label="申请人" width="130">
      </el-table-column>
      <el-table-column prop="handlerName" label="处理人" width="130">
      </el-table-column>
      <el-table-column prop="description" label="描述" width="280" v-if="false">
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="140">
      </el-table-column>
      <el-table-column label="图片" width="400">
      </el-table-column>
    </el-table> -->

    <div class="scroll-container">
      <el-table :data="tableData" style="width: 100%" :row-class-name="rowhighlight" class="listTable" :show-header="true" :cell-style="{ textAlign: 'center' }"
 :header-cell-style="{ textAlign: 'center' }"
>
        <el-table-column fixed label="序号" width="100">
          <template slot-scope="scope">
            {{ scope.$index }}
          </template>
        </el-table-column>

                <el-table-column prop="jobId" label="任务ID" width="130">

        </el-table-column>
        <el-table-column label="任务状态" width="150">
          <template slot-scope="scope">
            {{ getJobStatusName(scope.row.status) }}
          </template>
        </el-table-column>

        <el-table-column prop="equipment" label="设备号" width="100">

        </el-table-column>
        <el-table-column prop="createTime" label="申请时间" width="220">
        </el-table-column>
        <el-table-column label="故障位置" width="160">
          <template slot-scope="scope">
            {{scope.row.floor+'-'+scope.row.corridor+'-'+scope.row.position}}
          </template>
        </el-table-column>
        <el-table-column prop="proposerName" label="申请人" width="130">
        </el-table-column>
        <el-table-column prop="handlerName" label="处理人" width="130">
        </el-table-column>
        <el-table-column prop="description" label="描述" width="280" v-if="false">
        </el-table-column>
        <el-table-column prop="remark" label="备注" width="140">
        </el-table-column>

        <el-table-column label="图片" width="400">
          <template slot-scope="scope">
            <div style="display: flex; gap: 5px; justify-content: center;">
              <img v-for="(img, index) in scope.row.imagesList" :key="index" :src="`data:image/jpeg;base64,${img.fileData}`" alt="图片" style="width: 120px; height: auto; cursor: pointer;" @click="showImage(img.fileData)">
            </div>
          </template>
        </el-table-column>


    <el-table-column label="节点耗时">
      <template slot-scope="scope">
        {{ getTimeDifference(scope.row.nodeTime) }}
      </template>
    </el-table-column>

        <el-table-column label="总共耗时">
      <template slot-scope="scope">
        {{ getTimeDifference(scope.row.totalTime) }}
      </template>
    </el-table-column>

      </el-table>
    </div>
    <el-dialog :visible.sync="imageDialogVisible" width="50%">
      <el-image :src="`data:image/jpeg;base64,${selectedImage}`" alt="放大图片" fit="cover" style="width: 100%; height: auto;"></el-image>
    </el-dialog>

    <!-- 申请维修组件 -->
    <repairReplyVue :visible="applyVisible" @handleClose="handleClose" @handleSubmit="handleSubmit"></repairReplyVue>
  </div>
</template>

<script>
import repairReplyVue from './repair-reply.vue';


export default {
  created() {
    this.fetchData()
    setInterval(() => {
      this.fetchData()
    }, 1000 * 10)
  },
  mounted() {
    console.log("开始加载数据")
    this.fetchData(); // 加载第一页数据f
  },
  components: {
    repairReplyVue

  },
  data() {
    return {

      // 查看图片对话框
      imageDialogVisible: false,
      selectedImage: '',

      // 申请对话框
      applyVisible: false,

      // 表格数据
      tableData: [],

      // 搜索
      searchForm: {
        replyName: null,
        statusList: [],
        dateRange: []
      }
    }
  },
  computed: {
  },

  methods: {
  // 计算时间差并格式化
    getTimeDifference(previousTime) {
      const now = new Date(); // 当前时间
      const previousDate = new Date(previousTime); // 之前的时间


      const diffInMilliseconds = now - previousDate; // 时间差，单位为毫秒
      const diffInMinutes = Math.floor(diffInMilliseconds / 60000); // 转换为分钟

      if (diffInMinutes < 60) {
        // 如果小于1小时，显示分钟
        return `${diffInMinutes}分钟`;
      } else {
        // 否则，显示小时和分钟
        const hours = Math.floor(diffInMinutes / 60); // 计算小时
        const minutes = diffInMinutes % 60; // 计算剩余分钟
        return `${hours}小时${minutes}分钟`;
      }
    },
  

    // 滚动表格
    startAutoScroll() {
      const scrollContainer = document.querySelector('.scroll-container');
      let scrollStep = 1; // 每次滚动的像素数

      setInterval(() => {
        scrollContainer.scrollTop += scrollStep;

        // 如果滚动到底部，回到顶部继续滚动
        if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
          scrollContainer.scrollTop = 0;
        }
      }, 50); // 滚动间隔，单位为毫秒，可以调整以控制滚动速度
    },
    // 表格行数据背景样式
    rowhighlight({ row }) {
      if (row.status == 1 || row.status == 2) {
        const createTime = new Date(row.createTime);
        const now = new Date();
        const diffMinutes = (now - createTime) / 1000 / 60; // 时间差（分钟）

        if (diffMinutes > 60) {
          return 'error-row'; // 大于1小时，严重
        } else if (diffMinutes > 30) {
          return 'warning-row'; // 大于30分钟，警告
        }
      }

      return 'normal-row';
    },


    // 点击查看图片
    showImage(fileData) {
      this.selectedImage = fileData;
      this.imageDialogVisible = true;
    },

    // 获取表格数据 s
    fetchData() {
      const params = {
statusList:[1,2,8]
      };

      this.$http({
        url: this.$http.adornUrl(`/job/repair/listRepairJob`),  // 接口地址
        method: 'post',              //  POST 请求
        data: params,                // 使用 data 传递参数
      }).then((response) => {
        console.log(response)
        const data = response.data.data;  // 解析后端返回的分页数据
        this.tableData = data.list;       // 表格数据
      }).catch((error) => {
        console.log('获取数据失败：', error);
      });
    },


    getJobStatusName(jobStatusCode) {
      if (jobStatusCode == 1) {
        return "待处理"
      } else if (jobStatusCode == 2) {
        return "处理中"
      } else if (jobStatusCode == 4) {
        return "已完成"
      } else if (jobStatusCode == 5) {
        return "已确认"
      } else if (jobStatusCode == 6) {
        return "已取消"
      } else if (jobStatusCode == 7) {
        return "关闭"
      } else {
        return "未知状态"
      }
    },
    handleClose() {
      this.applyVisible = false
    },

    handleSubmit() {
      this.$emit('flshboardData'); // 通知父组件刷新数据
      this.handleClose()
      this.fetchData()
    },
    handleOpen() {
      this.applyVisible = true
    },

    openAddDialog() {
      this.applyVisible = true
    },


    cancelJob(jobId) {
      console.log("任务：" + jobId + "已经取消")
    },





  },
  mounted() {

    // 滚动表格（暂时关闭滚动）
    // this.startAutoScroll();



    // 添加 CSS 样式
    const style = document.createElement('style');
    style.textContent = `
      .el-table th {
        text-align: center;
      }
      .el-table td {
        text-align: center;
      }
    `;
    document.head.appendChild(style);
  }
}
</script>

<style >
/* 表格行背景颜色 */
.el-table.warning-row {
  background: oldlace;
}

.el-table.normal-row {
  background: white;
}

.el-table .error-row {
  background: #ebabab;
}

.scroll-container {
  /* display: flex;
  flex-direction: column; */

  /* 占满父容器 */
  min-height: 100%;
  /* 最大高度为视口高度，超过则滚动  */
  max-height: 100vh;
  /* 启用垂直滚动 */
  overflow-y: auto;
  /* margin: 0;  */
  /* padding: 0;  */
}


/* 隐藏表格的提示信息 */
.el-table__empty-block {
  display: none;
}


</style>


