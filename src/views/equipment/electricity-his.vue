<template>
  <div id="data-view">
    <dv-full-screen-container>
      <div class="main-header">
        <el-form :inline="true" :model="queryDataForm" @keyup.enter.native="onSubmit()">
          <el-form-item :label-width="formLabelWidth" class="item">
            <el-radio-group v-model="queryDataForm.query_type" @change="queryTypeChange($event)" class="radio-class">
              <el-radio-button type="success" label="1">用电</el-radio-button>
              <el-radio-button type="success" label="2">用水</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label-width="formLabelWidth" class="item">
            <el-select v-model="queryDataForm.date_type" placeholder="类型" style="width:60px">
              <el-option label="年" value="year"></el-option>
              <el-option label="月" value="month"></el-option>
              <el-option label="日" value="date"></el-option>
            </el-select>
            <el-date-picker v-if="queryDataForm.date_type == 'year'" v-model="queryDataForm.year" type="year" value-format="yyyy" placeholder="选择年" />
            <el-date-picker v-if="queryDataForm.date_type == 'month'" v-model="queryDataForm.month" type="month" value-format="yyyyMM" placeholder="选择月" />
            <el-date-picker v-if="queryDataForm.date_type == 'date'" v-model="queryDataForm.date" type="date" value-format="yyyyMMdd" placeholder="选择日期" />
          </el-form-item>
          <el-form-item label="BU" :label-width="formLabelWidth" class="item">
            <el-select v-model="queryDataForm.bu_name" placeholder="请选择BU" @change="selectChange()" :clearable="true" multiple collapse-tags>
              <el-option v-for="op in buNameOptions" :key="op.item" :label="op.value" :value="op.item" />
            </el-select>
          </el-form-item>
          <el-form-item label="位置" :label-width="formLabelWidth" class="item">
            <el-select v-model="queryDataForm.position_name" placeholder="请选择位置" :clearable="true" multiple collapse-tags>
              <el-option v-for="op in positionNameOptions" :key="op.item" :label="op.value" :value="op.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型" :label-width="formLabelWidth" class="item">
            <el-select v-model="queryDataForm.counter_type" placeholder="请选择类型" :clearable="true" multiple collapse-tags>
              <el-option v-for="op in counterTypeOptions" :key="op.item" :label="op.value" :value="op.item" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备" :label-width="formLabelWidth" class="item">
            <el-select v-model="queryDataForm.counter_id" placeholder="请选择设备" @focus="queryCounterSelect()" :clearable="true" style="width:250px" multiple collapse-tags filterable>
              <el-option v-for="op in counterIdOptions" :key="op.counterId" :label="op.counterName" :value="op.counterId" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <dv-border-box-1 class="main-container">
        <dv-border-box-10 class="top-chart-container">
          <electricity-his-chart-1 ref="topChart1" />
        </dv-border-box-10>
      </dv-border-box-1>
    </dv-full-screen-container>
  </div>
</template>

<script>
import ElectricityHisChart1 from './electricity-his-chart-1'
import moment from 'moment';

export default {
  name: 'DataView',
  components: {
    ElectricityHisChart1
  },
  data() {
    return {
      oldForm: {
        bu_name: ['02'],
      },
      queryDataForm: {
        query_type: '1',
        bu_name: ['02'],
        position_name: [],
        counter_type: [],
        counter_id: [],
        counter_name: [],
        date_type: 'date',
        year: '',
        month: '',
        date: moment().format('YYYYMMDD'),
        url: ''
      },
      optionsCode: { 'bu_name': '1001', 'position_name': '1002', 'counter_type': '1003', 'counter_id': '1004' },
      buNameOptions: [],
      positionNameOptions: [],
      counterTypeOptions: [],
      counterIdOptions: [],
      dialogFormVisible: true,
      form: {},
      formLabelWidth: '50px'
    }
  },
  mounted() {
    //初始化下拉框
    this.getDictParams({ code: this.optionsCode.bu_name });
    this.getDictParams({ code: this.optionsCode.position_name });
    this.getDictParams({ code: this.optionsCode.counter_type });

    //获取跳转url参数
    if (this.$route.query.date_type) {
      this.queryDataForm.date_type = this.$route.query.date_type;
      this.queryDataForm.year = this.$route.query.year;
      this.queryDataForm.month = this.$route.query.month;
      this.queryDataForm.date = this.$route.query.date;
      this.queryDataForm.query_type = this.$route.query.query_type;

      let bu_name_param = this.$route.query.bu_name;
      let position_name_param = this.$route.query.position_name;
      let counter_type_param = this.$route.query.counter_type;
      let counter_id_param = this.$route.query.counter_id;
      let counter_name_param = this.$route.query.counter_name;
      this.queryDataForm.bu_name = (bu_name_param instanceof Array) ? bu_name_param : (bu_name_param ? [bu_name_param] : []);
      this.queryDataForm.position_name = (position_name_param instanceof Array) ? position_name_param : (position_name_param ? [position_name_param] : []);
      this.queryDataForm.counter_type = (counter_type_param instanceof Array) ? counter_type_param : (counter_type_param ? [counter_type_param] : []);
      this.queryDataForm.counter_id = (counter_id_param instanceof Array) ? counter_id_param : (counter_id_param ? [counter_id_param] : []);
      this.queryDataForm.counter_name = (counter_name_param instanceof Array) ? counter_name_param : (counter_name_param ? [counter_name_param] : []);
      console.log(this.queryDataForm);
    }
    this.$nextTick(() => {
      setTimeout(this.onSubmit, 100);
    })
  },
  methods: {
    onSubmit() {
      if (this.queryDataForm.date_type == 'year') {
        this.queryDataForm.title = this.getChartTitle('月');
        this.queryDataForm.url = '/report/electricitybu/queryElectricityConsumptionByMonth'
      } else if (this.queryDataForm.date_type == 'month') {
        this.queryDataForm.title = this.getChartTitle('日');
        this.queryDataForm.url = '/report/electricitybu/queryElectricityConsumptionByDay'
      } else {
        this.queryDataForm.title = this.getChartTitle('小时');
        this.queryDataForm.url = '/report/electricitybu/queryElectricityConsumptionByHour'
      }
      this.$refs.topChart1.getDataList(this.queryDataForm, this.queryDataForm.url);
    },
    getChartTitle(titleKey) {
      return '每' + titleKey + (this.queryDataForm.query_type == '1' ? '用电' : '用水') + '量';
    },
    selectChange() {
      if (this.queryDataForm.bu_name.length == 0) {
        this.queryDataForm.bu_name = this.oldForm.bu_name;
      }
      this.oldForm.bu_name = this.queryDataForm.bu_name;
      this.refreshData()
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
          } else if (params.code == this.optionsCode.position_name) {
            this.positionNameOptions = data.page.list;
          } else if (params.code == this.optionsCode.counter_type) {
            this.counterTypeOptions = data.page.list;
          } else {
            console.log("params.code:" + params.code)
          }
        } else {
          console.log(data);
        }
      })
    },
    queryTypeChange($event) {
      this.queryDataForm.counter_type = [];
      this.queryDataForm.counter_id = [];
      if ($event == '1') {
        //用电
        this.optionsCode = { 'bu_name': '1001', 'position_name': '1002', 'counter_type': '1003', 'counter_id': '1004' }
      } else {
        //用水
        this.optionsCode = { 'bu_name': '1001', 'position_name': '1002', 'counter_type': '1006', 'counter_id': '1005' }
      }
      //刷新下拉框和数据
      this.getDictParams({ code: this.optionsCode.counter_type });
      this.refreshData();
    },
    //查询电表下拉选项
    queryCounterSelect() {
      let params = { ...this.queryDataForm };
      this.$http({
        url: this.$http.adornUrl('/report/electricitybu/selectCounterName'),
        method: 'post',
        data: this.$http.adornData(params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.counterIdOptions = data.list
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
