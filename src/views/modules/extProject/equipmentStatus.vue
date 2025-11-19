<template>
  <el-container>
    <el-header
      style="position: relative; height: 60px; line-height: 60px; text-align: center; font-size: 26px; font-weight: bold; color: white;
             text-shadow: 1px 1px 2px rgba(0,0,0,0.6), 0 0 5px rgba(255,255,255,0.8);
             letter-spacing: 2px; background: #1f78d1;">
      CMS 能耗集中监控管理系统
      <span style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%);">
        <img src="~@/assets/img/logo.jpg" alt="NEXIM Logo" style="height: 40px;" />
      </span>
    </el-header>

    <div class="reflowFurnaceWeld-container">
      <equipmentStatus2/>
        <div class="table-card">
        <h3 class="table-title">设备信息</h3>
        <el-table :data="[eqpInfoData]" border v-if="eqpInfoData">
          <el-table-column prop="eqpCode" label="设备编号" width="120" />
          <el-table-column prop="eqpName" label="设备名称" />
          <el-table-column prop="eqpStatus" label="状态" width="120" />
          <el-table-column prop="cardImageName" label="图片" />
        </el-table>
      </div>
    </div>

      <div class="table-card">
        <h3 class="table-title">前 10 报工记录</h3>
        <el-table :data="snWorkListTop10Data" border>
          <el-table-column label="SN">
            <template slot-scope="scope">
              <span v-html="scope.row[0]"></span>
            </template>
          </el-table-column>
          <el-table-column label="工单号">
            <template slot-scope="scope">
              {{ scope.row[1] }}
            </template>
          </el-table-column>
          <el-table-column label="时间">
            <template slot-scope="scope">
              {{ scope.row[2] }}
            </template>
          </el-table-column>
        </el-table>
      </div>


  </el-container>
</template>

<script>
import equipmentStatus2 from '@/views/modules/extProject/equipmentStatus2.vue';
import { saveVisitLog } from '@/utils/commonUtils.js'

export default {
  components: { equipmentStatus2 },

  data() {
    return {
      eqpInfoData: null,
      snWorkListTop10Data: [],
      eqpStatus: null,
      cardImageName: null,
      eqpCode: this.$route.query.sap_no,
    };
  },

  created() {
    saveVisitLog('CMS 回流炉设备看板-访问');
    this.refreshData();
    setInterval(() => this.refreshData(), 1000 * 10);
  },

  methods: {
    refreshData() {
      this.getEqpInfoData(this.eqpCode);
      this.getSnWorkListTop10Data(this.eqpCode);
    },

    getEqpInfoData(eqpCode) {
      this.$http({
        url: this.$http.adornUrl('/equipment/cmsscada/getEqpInfo'),
        method: 'get',
        params: this.$http.adornParams({ eqpCode })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.eqpInfoData = data.result
          this.eqpStatus = data.status
          this.cardImageName = data.image
        }
      })
    },

    getSnWorkListTop10Data(eqpCode) {
      this.$http({
        url: this.$http.adornUrl('/equipment/cmsscada/getSnWorkListTop10'),
        method: 'get',
        params: this.$http.adornParams({ eqpCode })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (eqpCode.startsWith('T')) {
            data.result.forEach((item) => {
              item[0] = `<a style="color:#fff" href="#/kanban/machine-state-item?sn=${item[0]}&eqpCode=${this.eqpCode}&endTime=${item[2]}" target="_blank">${item[0]}</a>`
            })
          }
          this.snWorkListTop10Data = data.result
        }
      })
    },
  }
};
</script>

<style scoped>
.reflowFurnaceWeld-container{
  display: flex;
  gap: 20px;
  margin: 20px;
}
.table-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
}

.table-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.table-title {
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
</style>
