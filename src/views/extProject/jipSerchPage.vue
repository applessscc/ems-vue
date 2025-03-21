<template>
  <div>
    <!-- 添加 Logo -->
    <div class="logo-container">
      <span class="logo-text">VTech 夹具追溯查询</span>
    </div>

    <div class="search-container">
      <el-input v-model="serchParam" @keydown.native.enter="serch" placeholder="please input SN" ref="serchInput" class="input-search" />
      <button @click.prevent="serch" class="toolbar-search-button">
        <i></i><span style="display: inline-block; vertical-align: top; color: #fff;">查询</span>
      </button>
    </div>

    <div class="result-container">
      <el-table :data="tableData" style="width: 100%" stripe border :cell-style="{ textAlign: 'center' }" :header-cell-style="{ textAlign: 'center' } ">
        <el-table-column prop="eqCode" label="设备ID" width="200"></el-table-column>
        <el-table-column prop="acutalValue" label="SN" width="210"></el-table-column>

        <el-table-column prop="remark" label="JIG_SN" width="200">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="right-start" :content="'使用次数：'+Math.ceil(scope.row.count / 8).toString()">
              <span>{{ scope.row.remark }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
   

        <el-table-column prop="addDt" label="使用日期"></el-table-column>

      </el-table>
    </div>
  </div>
</template>

<script>
import { saveVisitLog } from '@/utils/commonUtils.js'
export default {
  data() {
    return {
      serchParam: "",
      tableData: []
    };
  },
  mounted() {
    this.$refs.serchInput.focus();
  },
  created(){
    saveVisitLog('夹具追溯查询');
  },
  computed: {
    // 计算统计结果
    totalCount() {
      return Math.ceil(this.tableData.length / 8);
    },
  },
  methods: {
    serch() {
      const params = {
        serchParam: this.serchParam
      };

      this.$http({
        url: this.$http.adornUrl('/extProject/serch'),
        method: 'get',
        params: params,
      }).then((response) => {
        const data = response.data.data;
        this.tableData = data;

        this.serchParam = null;
        this.$refs.serchInput.focus();
        if (this.tableData.length === 0) {
          this.$message({
            message: '没有查询到数据！',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        this.$message({
          message: '查询成功！',
          type: 'success',
          duration: 2000
        });
      }).catch((error) => {
        console.log('serch', error);
      });
    },
  }
}
</script>

<style scoped>
/* Logo Container */
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

/* Search Input Area */
.search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  margin-top: 20px;
}

.input-search {
  width: 530px;
  border-radius: 4px;
  font-size: 14px;
  padding: 10px;
  padding-right: 0%;
}

/* Results Container */
.result-container {
  margin-top: 20px;
  padding: 20px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.toolbar-search-button {
  display: inline-block;
  width: 70px;
  height: 40px;
  outline: 0;
  border: 0 none;
  border-radius: 0 16px 16px 0;
  font-size: 14px;
  line-height: 32px;
  cursor: pointer;
  -webkit-transition: all 0.2s ease-in;
  transition: all 0.2s ease-in;
  background-color: #4ec6fd;
  text-align: left;
}
/* 鼠标移入按钮时的样式 */
.toolbar-search-button:hover {
  background-color: #31b0eb; /* 改变背景色 */
  color: #fff; /* 保持文字颜色为白色 */
}
</style>