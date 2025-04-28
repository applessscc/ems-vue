<template>
  <div class="mod-home">
    <!-- <h3>SBU2 Management System</h3> -->
    <h3>VTech 温区异常设备</h3>

    <el-table :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
      <el-table-column prop="eqid" label="设备ID" width="180"></el-table-column>
      <el-table-column prop="groupId" label="温区ID" width="180"></el-table-column>
      <el-table-column prop="groupName" label="温区名称" width="180"></el-table-column>
      <el-table-column prop="isOnline" label="是否在线" width="180"></el-table-column>
      <el-table-column prop="lastTime" label="最后一次上线时间" width="180"></el-table-column>

    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      tableData: [],
    };
  },
  created() {
    this.getTableData();
  },
  methods: {

    tableRowClassName({ row, rowIndex }) {
      if (row.isOnline == "false") {
        return 'warning-row';
      }
      return '';
    },
    getTableData() {
      this.$http({
        url: this.$http.adornUrl('/extProject/getExceptionThKvRecord'),
        method: 'get',
        params: {

        },
      }).then((response) => {
        this.tableData = response.data.data || [];
        this.tableData = this.tableData.filter(row => row.isOnline == "false");

      }).catch((error) => {
        console.error('Error fetching table data:', error);
      });
    },
  },
  mounted() {
  },


}
</script>

<style>
.mod-home {
  line-height: 1.5;
}

/* Use the class inside .el-table__row to ensure proper targeting */
.el-table .warning-row {
  background-color: oldlace !important;
}
</style>
