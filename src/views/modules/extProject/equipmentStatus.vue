<template>
  <el-container>
      <vtech-head />
    <div class="reflowFurnaceWeld-container">

      <!-- 回流焊状态 -->
      <div class="table-card">
        <h3 class="table-title">回流焊实时状态</h3>
        <equipmentStatus2 />
      </div>

      <!-- 设备信息 -->
      <div class="table-card eqp-info-card" >
        <h3 class="table-title">设备信息</h3>
        <el-descriptions border column=1>
          <el-descriptions-item label="设备名称">{{ eqpInfoData?eqpInfoData.eqpName:"" }}</el-descriptions-item>
          <el-descriptions-item label="设备编号">{{ eqpInfoData?eqpInfoData.eqpCode :"" }}</el-descriptions-item>
          <el-descriptions-item label="SAP编号">{{ eqpInfoData?eqpInfoData.eqpModel:""  }}</el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ eqpInfoData?eqpInfoData.eqpModel :"" }}</el-descriptions-item>
          <el-descriptions-item label="线体名称">{{ eqpInfoData?eqpInfoData.eqpModel :"" }}</el-descriptions-item>
          <el-descriptions-item label="工序名称">{{ eqpInfoData?eqpInfoData.eqpModel :"" }}</el-descriptions-item>
          <!-- <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(eqpInfoData.eqpStatus)">{{ eqpInfoData.eqpStatus }}</el-tag>
          </el-descriptions-item> -->
        </el-descriptions>
      </div>


          <div class="table-card eqp-info-card" >
        <h3 class="table-title">安灯信息</h3>
        <el-descriptions border column=1>
          <el-descriptions-item label="设备名称">{{ eqpInfoData?eqpInfoData.eqpName:"" }}</el-descriptions-item>
          <el-descriptions-item label="设备编号">{{ eqpInfoData?eqpInfoData.eqpCode :"" }}</el-descriptions-item>
          <el-descriptions-item label="SAP编号">{{ eqpInfoData?eqpInfoData.eqpModel:""  }}</el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ eqpInfoData?eqpInfoData.eqpModel :"" }}</el-descriptions-item>
          <el-descriptions-item label="线体名称">{{ eqpInfoData?eqpInfoData.eqpModel :"" }}</el-descriptions-item>
          <el-descriptions-item label="工序名称">{{ eqpInfoData?eqpInfoData.eqpModel :"" }}</el-descriptions-item>
          <!-- <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(eqpInfoData.eqpStatus)">{{ eqpInfoData.eqpStatus }}</el-tag>
          </el-descriptions-item> -->
        </el-descriptions>
      </div>


    </div>

    <div class="bottom-container">
    <!-- 报工记录 -->
    <div class="table-card snWork-card">
      <h3 class="table-title">报工记录</h3>
      <el-table :data="snWorkListTop10Data" border  style="height: 250px;">
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

    </div>
  </el-container>
</template>

<script>
import equipmentStatus2 from '@/views/modules/extProject/equipmentStatus2.vue';
import VtechHead from '@/views/modules/extProject/vtechHead.vue';

import { saveVisitLog } from '@/utils/commonUtils.js'

export default {
  components: { equipmentStatus2 ,VtechHead   },

  data() {
    return {
      eqpInfoData: null,
      snWorkListTop10Data: [],
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
          this.eqpInfoData = data.result;
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

    // 根据设备状态返回 tag 类型
    getStatusType(status) {
      switch (status) {
        case '运行': return 'success';
        case '停机': return 'danger';
        case '待机': return 'warning';
        default: return 'info';
      }
    }
  }
};
</script>

<style scoped>
.reflowFurnaceWeld-container {
  display: flex;
}
.bottom-container {
  display: flex;
}

.table-card {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 15px;
  margin: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s, box-shadow 0.2s;
}

.table-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
}

.table-title {
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #1f78d1;
  border-left: 4px solid #1f78d1;  /* 改为左边彩色条 */
  padding-left: 8px;               /* 文字与左条保持间距 */
}

.eqp-info-card {
  min-width: 300px;
  max-width: 400px;
  flex: 1;
}
.snWork-card {
  min-height: 330px;
  flex: 2;
}
.el-container {
  display: flex;
  flex-direction: column; /* 垂直排列子元素 */
}
</style>
