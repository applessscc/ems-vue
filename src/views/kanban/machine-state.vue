<template>
  <div id="data-view">
    <dv-full-screen-container>
      <div class="main-header">
        <top-header title="CMS 设备看板" />
      </div>
      <div class="main-container">
        <el-row :gutter="10" class="main-top-container">
          <el-col :span="6">
            <div class="bg-container">
              <eqp-state-card :image="cardImageName" :status="eqpStatus" />
            </div>
          </el-col>
          <el-col :span="6">
            <div class="bg-container">
              <scroll-table title="设备信息" :data="eqpInfoData" :scroll="false" />
            </div>
          </el-col>
          <el-col :span="6">
            <div class="bg-container">
              <div style="width:100%;height:45%;">
                <scroll-table title="统计数据" :data="passRate" :scroll="false" />
              </div>
              <div style="width:100%;height:55%;">
                <scroll-table title="报警信息" :data="eqpAlarm" :config="{rowNum:5, index:true, columnWidth:[35, 160, 60]}" />
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="bg-container">
              <scroll-table title="参数列表" :data="eqpParamsData" :config="{index:true,columnWidth:[50]}" />
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10" class="main-bottom-container">
          <el-col :span="6">
            <div class="bg-container">
              <scroll-table title="报工列表" :data="snWorkListTop10Data" :scroll="false" :config="{columnWidth:[230,80]}" />
            </div>
          </el-col>
          <el-col :span="18">
            <div class="bg-container">
              <eqp-state-chart :title="passAndFailQtyByHourTitle" :yAxis="passAndFailQtyByHourYAxis" :dataset="passAndFailQtyByHour" :series="passAndFailQtyByHourSeries" />
            </div>
          </el-col>
        </el-row>
      </div>
    </dv-full-screen-container>
  </div>
</template>

<script>
import TopHeader from '@/components/kanban/top-header-2';
import ScrollTable from '@/components/kanban/scroll-table';
import EqpStateChart from '@/components/kanban/bar-line-chart';
import EqpStateCard from './machine-state-card';
import { saveVisitLog } from '@/utils/commonUtils.js'
import moment from 'moment';


export default {
  // name: 'DataView',
  components: {
    TopHeader,
    ScrollTable,
    EqpStateCard,
    EqpStateChart
  },
  data() {
    return {
      eqpCode: this.$route.query.sap_no,
      eqpStatus: '0',
      eqpInfoData: [],
      eqpParamsData: [],
      snWorkListTop10Data: [],
      passRate: [],
      eqpAlarm: [],
      cardImageName: '',
      passAndFailQtyByHourTitle: moment().format('DD') == '24' ? moment().format('YYYY-MM-DD') : moment().subtract(1, 'days').format('YYYY-MM-DD') + ' ~ ' + moment().format('YYYY-MM-DD'),
      passAndFailQtyByHour: {
        dimensions: ['product', '产出数', '不良数'],
        source: []
      },
      passAndFailQtyByHourYAxis: [
        { name: 'PCS', type: 'value' }
      ],
      passAndFailQtyByHourSeries: [
        { type: 'bar', color: '#37a2da', label: { show: true, position: 'top', color: '#fff' } },
        { type: 'bar', color: '#ffdb5c', label: { show: true, position: 'top', color: '#fff' } },
      ]
    }
  },
  created() {
    //记录访问日志
    saveVisitLog('CMS 设备看板-访问');

    this.refreshData()
    setInterval(() => {
      this.refreshData()
    }, 1000 * 10)
  },
  methods: {
    refreshData() {
      this.getEqpInfoData(this.eqpCode);
      this.getPassRate(this.eqpCode);
      this.getEqpAlarm(this.eqpCode);
      this.getEqpParamsData(this.eqpCode);
      this.getSnWorkListTop10Data(this.eqpCode);
      this.getPassAndFailQtyByHour(this.eqpCode);
    },
    //获取设备信息
    getEqpInfoData(eqpCode) {
      this.$http({
        url: this.$http.adornUrl('/equipment/cmsscada/getEqpInfo'),
        method: 'get',
        params: this.$http.adornParams({ eqpCode: eqpCode })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.eqpInfoData = data.result
          this.eqpStatus = data.status
          this.cardImageName = data.image
        } else {
          console.log(data);
        }
      })
    },
    //获取统计数据
    getPassRate(eqpCode) {
      this.$http({
        url: this.$http.adornUrl('/equipment/cmsscada/getPassRate'),
        method: 'get',
        params: this.$http.adornParams({ eqpCode: eqpCode })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.passRate = data.result
        } else {
          console.log(data);
        }
      })
    },
    //获取设备参数数据
    getEqpParamsData(eqpCode) {
      this.$http({
        url: this.$http.adornUrl('/equipment/cmsscada/getEqpParams'),
        method: 'get',
        params: this.$http.adornParams({ eqpCode: eqpCode })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.eqpParamsData = data.result
        } else {
          console.log(data);
        }
      })
    },
    //获取报工列表数据（前10）
    getSnWorkListTop10Data(eqpCode) {
      this.$http({
        url: this.$http.adornUrl('/equipment/cmsscada/getSnWorkListTop10'),
        method: 'get',
        params: this.$http.adornParams({ eqpCode: eqpCode })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (eqpCode.startsWith('T')) {
            data.result.forEach((item, index) => {
              item[0] = '<a style="color:#fff" href="#/kanban/machine-state-item?sn=' + item[0] + '&eqpCode=' + this.eqpCode + 
              '&endTime='+ item[2] +'" target="_blank">' + item[0] + '</a>'
            })
          }
          this.snWorkListTop10Data = data.result
        } else {
          console.log(data);
        }
      })
    },
    //获取设备每小时产出和不良数量
    getPassAndFailQtyByHour(eqpCode) {
      this.$http({
        url: this.$http.adornUrl('/equipment/cmsscada/getPassAndFailQtyByHour'),
        method: 'get',
        params: this.$http.adornParams({ eqpCode: eqpCode })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.passAndFailQtyByHour.source = data.result
          this.passAndFailQtyByHour = { ...this.passAndFailQtyByHour }
        } else {
          console.log(data);
        }
      })
    },
    //查询设备报警信息
    getEqpAlarm(eqpCode) {
      this.$http({
        url: this.$http.adornUrl('/equipment/cmsscada/getEqpAlarm'),
        method: 'get',
        params: this.$http.adornParams({ eqpCode: eqpCode })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.eqpAlarm = data.result
        } else {
          console.log(data);
        }
      })
    }
  }
}
</script>

<style lang="less">
#data-view {
  width: 100%;
  height: 100%;
  background-color: #030409;
  color: #fff;

  #dv-full-screen-container {
    background-image: url("../../assets/img/bg.png");
    background-size: 100% 100%;
    height: 100% !important;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }

  .main-header {
    width: 100%;
    height: 90px;
  }

  .main-container {
    height: calc(~"100% - 90px");

    .border-box-content {
      padding: 20px;
      box-sizing: border-box;
    }

    .main-top-container {
      height: calc(~"50% - 5px");
      margin-bottom: 10px;
    }

    .main-bottom-container {
      height: calc(~"50% - 5px");
    }
  }

  .el-col {
    height: 100%;
  }

  .bg-container {
    width: 100%;
    height: 100%;
    background-color: rgba(6, 30, 93, 0.5);
    box-sizing: border-box;
  }

  .image {
    // width: 100%;
    display: block;
  }
}
</style>
