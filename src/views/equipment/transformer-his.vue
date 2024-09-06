<template>
  <div id="data-view">
    <dv-full-screen-container>
      <div class="main-header">
        <el-form :inline="true" :model="queryDataForm" @keyup.enter.native="onSubmit()">
          <el-form-item label="日期" class="item">
            <el-date-picker v-model="queryDataForm.date" type="date" value-format="yyyyMMdd" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="BU" :label-width="formLabelWidth" class="item">
            <el-select v-model="queryDataForm.bu_name" placeholder="请选择BU" @change="selectChange($event)" :clearable="true" multiple collapse-tags>
              <el-option v-for="op in buNameOptions" :key="op.item" :label="op.value" :value="op.item" />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="变压器" :label-width="formLabelWidth" class="item">
            <el-select v-model="queryDataForm.ai_id" placeholder="请选择变压器" :clearable="true" style="width:250px" multiple collapse-tags filterable>
              <el-option v-for="op in transformerIdOptions" :key="op.value" :label="op.remark" :value="op.value" />
            </el-select>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="onSubmit()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <dv-border-box-1 class="main-container">
        <dv-border-box-10 class="top-chart-container">
          <bar-line-chart title="变压器能耗" :yAxis="yAxis" :dataset="dataset" :series="series" />
        </dv-border-box-10>
      </dv-border-box-1>
    </dv-full-screen-container>
  </div>
</template>

<script>
import moment from 'moment';
import BarLineChart from '../../components/kanban/bar-line-chart.vue';

export default {
  name: 'DataView',
  components: {
    BarLineChart
  },
  data() {
    return {
      queryDataForm: {
        bu_name: ['02'],
        // ai_id: [],
        date: moment().format('YYYYMMDD'),
      },
      optionsCode: { 'bu_name': '1001', 'ai_id': '1009' },
      buNameOptions: [],
      // transformerIdOptions: [
      //   { 'id': 54, 'name': '1_2P 出线1  有功功率P' },
      //   { 'id': 55, 'name': '1_2P 出线1  无功功率Q' },
      //   { 'id': 82, 'name': '1_2P 出线3  有功电度' },
      //   { 'id': 83, 'name': '1_2P 出线3  无功电度' },
      // ],
      formLabelWidth: '70px',
      dataset: {
        // dimensions: ['product', 'XX', 'RR', 'DD'],
        source: [
          // {
          //   "product": '00',
          //   "XX": 80,
          //   "RR": 90,
          //   "DD": 99
          // },
          // {
          //   "product": '11',
          //   "XX": 80,
          //   "RR": 45,
          //   "DD": 99
          // },
          // {
          //   "product": '22',
          //   "XX": 80,
          //   "RR": 90,
          //   "DD": 67
          // },
        ]
      },
      yAxis: [
        { name: 'KVA', type: 'value' }
      ],
      series: [
        // { type: 'line', stack: 'stack'},
        // { type: 'line', stack: 'stack'},
        // { type: 'line', stack: 'stack'},
        // { type: 'line', stack: 'stack'},
      ],
      seriesColor: ['#67e0e3', '#9fe6b8', '#ffdb5c', '#ff9f7f', '#fb7293', '#e690d1', '#8378ea', '#96bfff']
    }
  },
  created() {
    //初始化下拉框
    this.getDictParams({ code: this.optionsCode.bu_name });
    // this.getDictParams({ code: this.optionsCode.ai_id, item: '02' });
    this.onSubmit();
  },
  mounted() {
    //获取跳转url参数
    let bu_name_param = this.$route.query.bu_name;
    this.queryDataForm.bu_name = (bu_name_param instanceof Array) ? bu_name_param : (bu_name_param ? [bu_name_param] : []);
  },
  methods: {
    onSubmit() {
      this.$http({
        url: this.$http.adornUrl('/equipment/transformer/queryTransformerList'),
        method: 'post',
        data: this.$http.adornData(this.queryDataForm)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataset = data.chartData
          let tmpSeries = [];
          data.chartData.dimensions.forEach((item, index) => {
            if (index > 0) {
              tmpSeries.push({
                type: 'line', color: this.seriesColor[index - 1],
                markPoint: {
                  data: [
                    { type: 'max', name: 'Max', symbolSize: '80' },
                    { type: 'min', name: 'Min', symbolSize: '80' }
                  ]
                }
              })
            }
          })
          this.series = tmpSeries;
        } else {
          console.log(data);
        }
      })
    },
    selectChange($event) {
      // alert($event);
    },
    getDictParams(params) {
      params.page = 1;
      params.limit = 1000;
      this.$http({
        url: this.$http.adornUrl('/sys/dictitem/list'),
        method: 'get',
        params: this.$http.adornParams(params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          if (params.code == this.optionsCode.bu_name) {
            this.buNameOptions = data.page.list;
          } else if (params.code == this.optionsCode.ai_id) {
            this.transformerIdOptions = data.page.list;
          } else {
            console.log("params.code:" + params.code)
          }
        } else {
          console.log(data);
        }
      })
    },
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
    background-image: url("../../assets/img/report_bg.jpeg");
    background-size: 100% 100%;
    height: 100% !important;
    box-shadow: 0 0 3px blue;
    display: flex;
    flex-direction: column;
  }

  .main-header {
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    padding-left: 20px;
  }

  .main-container {
    height: calc(~"100% - 80px");

    .border-box-content {
      padding: 20px;
      box-sizing: border-box;
      // display: flex;
      // flex-direction: column;
    }
  }

  .top-chart-container {
    width: 100%;
    height: 100%;
    padding: 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
  }

  .item .el-form-item__label {
    color: #fff;
  }
}
</style>
