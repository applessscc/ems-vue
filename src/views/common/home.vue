<template>
  <div class="mod-home">
    <h3>SBU2 Management System</h3>
    <h3>首页</h3>

    <el-table :data="tableData" style="width: 100%">


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
      getTableData() {
        this.$http({
          url: this.$http.adornUrl('/extProject/getExceptionThKvRecord'),
          method: 'get',
          params: {

          },
        }).then((response) => {
          this.tableData = response.data.data || []; 
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
</style>

