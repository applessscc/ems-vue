<template>
  <el-container>
    <vtech-head title="CMS 回流焊集中监控管理系统"/>
    <div class="reflowFurnaceWeld-container">

      <!-- 回流焊状态 -->
      <div class="table-card equipment-status-card">
        <h3 class="table-title">回流焊实时状态</h3>
        <equipmentStatus2 width="850px" height="auto" :equipment="eqpCode" @zone-click="onZoneClick" />
      </div>
      <!-- 设备信息 -->
      <div class="table-card eqp-info-card">
        <h3 class="table-title">设备信息</h3>
        <el-descriptions border :column=1>
          <el-descriptions-item label="设备名称">{{ eqpInfoData ? eqpInfoData[0][1] : "" }}</el-descriptions-item>
          <el-descriptions-item label="设备型号">{{ eqpInfoData ? eqpInfoData[1][1] : "" }}</el-descriptions-item>
          <el-descriptions-item label="设备品牌">{{ eqpInfoData ? eqpInfoData[2][1] : "" }}</el-descriptions-item>
          <el-descriptions-item label="SAP编号">{{ eqpInfoData ? eqpInfoData[3][1] : "" }}</el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ eqpInfoData ? eqpInfoData[4][1] : "" }}</el-descriptions-item>
          <el-descriptions-item label="线体名称">{{ eqpInfoData ? eqpInfoData[5][1] : "" }}</el-descriptions-item>
          <el-descriptions-item label="工序名称">{{ eqpInfoData ? eqpInfoData[6][1] : "" }}</el-descriptions-item>
          <!-- <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(eqpInfoData.eqpStatus)">{{ eqpInfoData.eqpStatus }}</el-tag>
          </el-descriptions-item> -->
        </el-descriptions>
      </div>




      <!-- 安灯信息 -->
      <div class="table-card andon-info-card">
        <h3 class="table-title">安灯信息</h3>
        <el-descriptions border :column=1>
        </el-descriptions>
      </div>


    </div>

    <div class="bottom-container">
      <!-- 报工记录 -->
      <div class="table-card snWork-card">
        <h3 class="table-title">报工记录（Top10）</h3>
        <el-table :data="snWorkListTop10Data" border style="height: 300px;">
          <el-table-column label="SN">
            <template slot-scope="scope">
              <span v-html="scope.row[0]"></span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
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


      <div class="table-card chart-card">
        <h3 class="table-title">温区温度（{{zoneName}}）</h3>
        <LineChart width="100%" height="90%" :zoneName = "zoneName" :equipment = "eqpCode" :time="time"/>
      </div>

    </div>
  </el-container>
</template>

<script>
import equipmentStatus2 from '@/views/modules/extProject/equipmentStatus3.vue';
import LineChart from '@/views/modules/extProject/equipmentStatusHitory.vue';

import VtechHead from '@/views/modules/extProject/vtechHead.vue';

import { saveVisitLog } from '@/utils/commonUtils.js'
import { time } from 'echarts';
import { eq } from 'lodash';
import { get } from 'jquery';

export default {
  components: { equipmentStatus2, VtechHead, LineChart },

  data() {
    return {
      eqpInfoData: null,
      snWorkListTop10Data: [],
      eqpCode: this.$route.query.sap_no,
      zoneName: "",
      time: '',
    };
  },

  created() {
    saveVisitLog('CMS 回流炉设备看板-访问');
    this.refreshData();
    setInterval(() => this.refreshData(), 1000 * 10);
  },

  methods: {
    onZoneClick(name,time) {
      console.log('子组件点击的温区:', name,time);
      this.zoneName = name;
      this.time = time;
      // 想干啥都行
    },
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
          console.log('eqpInfoData:', this.eqpInfoData[0][1]);
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

.equipment-status-card {
  flex: 1;
}

.eqp-info-card {
  min-width: 300px;
  max-width: 450px;
  flex: 1;
}

.andon-info-card {
  min-width: 300px;
  max-width: 450px;
  flex: 1;
}

.bottom-container {
  display: flex;
}

.snWork-card {
  height: 410px;
  flex: 1.04;
  overflow-y: auto;

}

.chart-card {
  height: 410px;
  flex: 1;
}


.table-card {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 10px;
  margin: 5px;
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
  border-left: 4px solid #1f78d1;
  /* 改为左边彩色条 */
  padding-left: 8px;
  /* 文字与左条保持间距 */
}

.el-container {
  display: flex;
  flex-direction: column;
  /* 垂直排列子元素 */
}
</style>
