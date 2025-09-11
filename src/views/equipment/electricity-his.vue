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
            <el-date-picker v-if="queryDataForm.date_type == 'year'" v-model="queryDataForm.year" type="year"
              value-format="yyyy" placeholder="选择年" />
            <el-date-picker v-if="queryDataForm.date_type == 'month'" v-model="queryDataForm.month" type="month"
              value-format="yyyyMM" placeholder="选择月" />
            <el-date-picker v-if="queryDataForm.date_type == 'date'" v-model="queryDataForm.date" type="date"
              value-format="yyyyMMdd" placeholder="选择日期" />
          </el-form-item>

          <!-- BU -->
          <el-form-item label="BU" :label-width="formLabelWidth" class="item">

            <el-select :value="queryDataForm.bu_name[0] || ''" placeholder="请选择BU" @input="handleInput" :clearable="false" @change="selectChange">
              <el-option v-for="op in buNameOptions" :key="op.item" :label="op.value" :value="op.item" />
            </el-select>


            <!-- <el-select v-model="queryDataForm.bu_name" placeholder="请选择BU" @change="selectChange" :clearable="true"
              multiple collapse-tags>
              <el-option v-for="op in buNameOptions" :key="op.item" :label="op.value" :value="op.item" />
            </el-select> -->
          </el-form-item>
          <el-form-item label="位置" :label-width="formLabelWidth" class="item">
            <el-select v-model="queryDataForm.position_name" placeholder="请选择位置" :clearable="true" multiple
              collapse-tags>
              <el-option v-for="op in positionNameOptions" :key="op.item" :label="op.value" :value="op.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="类型" :label-width="formLabelWidth" class="item">
            <el-select v-model="queryDataForm.counter_type" placeholder="请选择类型" :clearable="true" multiple
              collapse-tags>
              <el-option v-for="op in counterTypeOptions" :key="op.item" :label="op.value" :value="op.item" />
            </el-select>
          </el-form-item>
          <el-form-item label="设备" :label-width="formLabelWidth" class="item">
            <el-select v-model="queryDataForm.counter_id" placeholder="请选择设备" @focus="queryCounterSelect()"
              :clearable="true" style="width:250px" multiple collapse-tags filterable>
              <el-option v-for="op in counterIdOptions" :key="op.counterId" :label="op.counterName"
                :value="op.counterId" />
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

    // 获取路由传参
    if (this.$route.query.date_type) {
      Object.keys(this.queryDataForm).forEach(key => {
        if (this.$route.query[key] !== undefined) {
          const val = this.$route.query[key]
          this.queryDataForm[key] = Array.isArray(val) ? val : [val]
        }
      })
      this.queryDataForm.date_type = this.$route.query.date_type
      this.queryDataForm.year = this.$route.query.year || ''
      this.queryDataForm.month = this.$route.query.month || ''
      this.queryDataForm.date = this.$route.query.date || moment().format('YYYYMMDD')
      this.queryDataForm.query_type = this.$route.query.query_type || '1'
    }

    this.$nextTick(() => {
      setTimeout(this.onSubmit, 100);
    })
  },
  methods: {
        handleInput(val) {
      // 强制变成数组
      this.queryDataForm.bu_name = val ? [val] : [];
      this.selectChange();
    },
    onSubmit() {
      if (this.queryDataForm.date_type == 'year') {
        this.queryDataForm.title = this.getChartTitle('月');

        // 缓存key
        const currentYear = new Date().getFullYear();
        this.queryDataForm.cacheKey =
          this.queryDataForm.year + ':' +
          (this.queryDataForm.year === currentYear
            ? String(new Date().getDate()).padStart(2, '0') + ':'
            : '') +
          this.queryDataForm.query_type + ':' +
          this.queryDataForm.bu_name + ':' +
          this.queryDataForm.counter_id + ':' +
          this.queryDataForm.counter_type + ':' +
          this.queryDataForm.position_name;

        this.queryDataForm.url = '/report/electricitybu/queryElectricityConsumptionByMonth'
      } else if (this.queryDataForm.date_type == 'month') {
        this.queryDataForm.title = this.getChartTitle('日');

        // 缓存key
        const now = new Date();
        const currentMonth = now.getFullYear().toString() +
          String(now.getMonth() + 1).padStart(2, '0'); // 当前年月，格式"YYYYMM"
        const { month, query_type, bu_name } = this.queryDataForm;
        if (month === currentMonth) {
          const currentDate = currentMonth + String(now.getDate()).padStart(2, '0'); // 20250709
          this.queryDataForm.cacheKey = query_type + ':' + currentDate + ':' + bu_name + ':'
            + this.queryDataForm.counter_id + ':'
            + this.queryDataForm.counter_type + ':'
            + this.queryDataForm.position_name;
        } else {
          this.queryDataForm.cacheKey = query_type + ':' + month + ':' + bu_name + ':'
            + this.queryDataForm.counter_id + ':'
            + this.queryDataForm.counter_type + ':'
            + this.queryDataForm.position_name;
        }

        this.queryDataForm.url = '/report/electricitybu/queryElectricityConsumptionByDay'
      } else {
        this.queryDataForm.title = this.getChartTitle('小时');
        this.queryDataForm.url = '/report/electricitybu/queryElectricityConsumptionByHour'
      }

      // 深拷贝保证响应式
      const params = JSON.parse(JSON.stringify(this.queryDataForm))
      if (this.$refs.topChart1 && this.$refs.topChart1.getDataList) {
        this.$refs.topChart1.getDataList(params, params.url)
      } else {
        console.warn('topChart1 未挂载或 getDataList 不存在')
      }
    },
    getChartTitle(key) {
      return '每' + key + (this.queryDataForm.query_type == '1' ? '用电' : '用水') + '量'
    },
    selectChange() {
      if (this.queryDataForm.bu_name.length === 0) {
        this.queryDataForm.bu_name = this.oldForm.bu_name
      }
      this.oldForm.bu_name = [...this.queryDataForm.bu_name]
      this.refreshData()
    },
    refreshData() {
      this.onSubmit()
    },
    queryTypeChange(val) {
      this.queryDataForm.counter_type = []
      this.queryDataForm.counter_id = []
      if (val == '1') {
        this.optionsCode = { bu_name: '1001', position_name: '1002', counter_type: '1003', counter_id: '1004' }
      } else {
        this.optionsCode = { bu_name: '1001', position_name: '1002', counter_type: '1006', counter_id: '1005' }
      }
      this.getDictParams({ code: this.optionsCode.counter_type })
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
          if (params.code == this.optionsCode.bu_name)
            this.buNameOptions = data.page.list;
          else if (params.code == this.optionsCode.position_name) this.positionNameOptions = data.page.list
          else if (params.code == this.optionsCode.counter_type) this.counterTypeOptions = data.page.list
        } else {
          console.log('获取字典失败', data)
        }
      })
    },
    queryCounterSelect() {
      const params = JSON.parse(JSON.stringify(this.queryDataForm))
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
