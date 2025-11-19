<template>
  <div>
    <div>
      <equipmentStatus2 />
    </div>

    <!-- 设备信息表 -->
    <el-table
      :data="[eqpInfoData]"
      border
      style="width: 100%; margin-bottom: 20px"
      v-if="eqpInfoData"
    >
      <el-table-column prop="eqpCode" label="设备编号" width="120" />
      <el-table-column prop="eqpName" label="设备名称" />
      <el-table-column prop="eqpStatus" label="状态" width="120" />
      <el-table-column prop="cardImageName" label="图片" />
    </el-table>

    <!-- 前10报工列表 -->
    <el-table :data="snWorkListTop10Data" border style="width: 100%">
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
</template>

<script>
import equipmentStatus2 from '@/views/modules/extProject/equipmentStatus2.vue';

export default {
  components: {
    equipmentStatus2
  },

  data() {
    return {
      eqpInfoData: null,
      snWorkListTop10Data: [],
      eqpStatus: null,
      cardImageName: null,
      eqpCode: ''
    };
  },

  created() {
    // ★ 自动从 URL 获取 eqpCode（支持 query + params）
    this.eqpCode =
      this.$route.query.eqpCode ||
      this.$route.params.eqpCode ||
      '';

    // 访问日志
    saveVisitLog('CMS 回流炉设备看板-访问');

    this.refreshData();

    setInterval(() => {
      this.refreshData();
    }, 1000 * 10);
  },

  methods: {
    refreshData() {
      const eqpCode =
        this.eqpCode ||
        this.$route.query.eqpCode ||
        this.$route.params.eqpCode ||
        '';

      this.getEqpInfoData(eqpCode);
      this.getSnWorkListTop10Data(eqpCode);
    },

    // 获取设备信息
    getEqpInfoData(eqpCode) {
      this.$http({
        url: this.$http.adornUrl('/equipment/cmsscada/getEqpInfo'),
        method: 'get',
        params: this.$http.adornParams({ eqpCode })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.eqpInfoData = data.result;
          this.eqpStatus = data.status;
          this.cardImageName = data.image;
        } else {
          console.log(data);
        }
      });
    },

    // 获取报工列表（前10）
    getSnWorkListTop10Data(eqpCode) {
      this.$http({
        url: this.$http.adornUrl('/equipment/cmsscada/getSnWorkListTop10'),
        method: 'get',
        params: this.$http.adornParams({ eqpCode })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (eqpCode.startsWith('T')) {
            data.result.forEach((item) => {
              item[0] =
                '<a style="color:#fff" href="#/kanban/machine-state-item?sn=' +
                item[0] +
                '&eqpCode=' +
                this.eqpCode +
                '&endTime=' +
                item[2] +
                '" target="_blank">' +
                item[0] +
                '</a>';
            });
          }
          this.snWorkListTop10Data = data.result;
        } else {
          console.log(data);
        }
      });
    }
  }
};
</script>
