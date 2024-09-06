<template>
  <div id="data-view">
    <dv-full-screen-container>
      <div class="main-header">
        <div class="mh-left">
          <el-switch v-model="pageTimerSwitch" active-text="实时数据" @change="pageTimerSwitchChange($event)" />
        </div>
        <div>
          <el-select v-model="form.bu_name" placeholder="请选择BU" @change="selectChange()" :clearable="true" multiple collapse-tags>
            <el-option v-for="op in buNameOptions" :key="op.item" :label="op.value" :value="op.item" />
          </el-select>
        </div>
        <div>
          <el-select v-model="form.position_name" placeholder="请选择位置" @change="selectChange()" :clearable="true" multiple collapse-tags>
            <el-option v-for="op in positionNameOptions" :key="op.item" :label="op.value" :value="op.value" />
          </el-select>
        </div>
        <div class="mh-middle">CMS 能耗看板</div>
        <div>
          <el-select v-model="form.counter_type" placeholder="请选择类型" @change="selectChange()" :clearable="true" multiple collapse-tags>
            <el-option v-for="op in counterTypeOptions" :key="op.item" :label="op.value" :value="op.item" />
          </el-select>
        </div>
        <div>
          <el-select v-model="form.counter_id" style="width:250px" @change="selectChange()" @focus="queryCounterSelect()" :clearable="true" placeholder="请选择电表" multiple collapse-tags filterable>
            <el-option v-for="op in counterIdOptions" :key="op.counterId" :label="op.counterName" :value="op.counterId" />
          </el-select>
        </div>
        <div class="mh-right">
          <el-radio-group v-model="form.query_type" @change="queryTypeChange($event)" size="small" class="radio-class">
            <el-radio-button type="success" label="1">用电</el-radio-button>
            <el-radio-button type="success" label="2">用水</el-radio-button>
          </el-radio-group>
          <!-- <dv-border-box-7 style="width: 120px; height: 50px; line-height: 50px; text-align:center;">
            <el-button type="text" icon="el-icon-setting" @click="dialogFormVisible = true">参数设置</el-button>
          </dv-border-box-7> -->
        </div>
      </div>

      <dv-border-box-1 class="main-container" :dur="66">
        <div class="top-main-container">
          <dv-border-box-10 class="top-left-container">
            <div class="go-history-div" @dblclick="goHistory('date')">
              <chart-Line-Bar ref="chartLineBar1" @refreshData="refreshData" />
            </div>
          </dv-border-box-10>

          <dv-border-box-10 class="top-right-container">
            <el-row :gutter="10" style="height:50%;">
              <el-col :span="15" style="height:100%;">
                <!-- <dv-water-level-pond :config="{data: [66],waveHeight:0}" style="width:60%;height:60%" /> -->
                <pie-chart :title="pieTopTitle" :form="form" :data="pieTopData" radius="68%" ref="pieTopChart" />
              </el-col>
              <el-col :span="9" style="height:100%;">
                <!-- <dv-water-level-pond :config="{data: [55]}" style="width:150px;height:200px" /> -->
                <!-- <dv-digital-flop :config="{number: [64],content: '{nt}°C'}" style="width:200px;height:50px;" /> -->
                <!-- <dv-percent-pond :config="{value: 66, colors: ['#ffab91', '#fb7293'], formatter:'{value} °C'}" style="margin-top:25%;width:100%;height:50%;" /> -->
                <!-- <wendu-bar ref="wenduBarTop" /> -->
                <!-- <pie-chart :data="pieTopData"/> -->
                <wendu-text :load="loadValueTop" :loadRate="loadRateValueTop" :wendu="wenduValueTop" :shidu="shiduValueTop" />
              </el-col>
            </el-row>
            <el-row :gutter="10" style="height:50%;">
              <el-col :span="15" style="height:100%;">
                <pie-chart :title="pieBottomTitle" :form="form" :data="pieBottomData" radius="68%" ref="pieBottomChart" />
              </el-col>
              <el-col :span="9" style="height:100%;">
                <wendu-text :load="loadValueBottom" :loadRate="loadRateValueBottom" :wendu="wenduValueBottom" :shidu="shiduValueBottom" />
                <!-- <wendu-bar ref="wenduBarBottom" /> -->
                <!-- <pie-chart :data="pieTopData"/> -->
              </el-col>
            </el-row>
          </dv-border-box-10>
        </div>

        <div class="bottom-main-container">
          <dv-border-box-10 class="bottom-left-container">
            <div class="go-history-div" @dblclick="goHistory('month')">
              <chart-Line-Bar ref="chartLineBar2" @refreshData="refreshData" />
            </div>
          </dv-border-box-10>
          <dv-border-box-10 class="bottom-right-container">
            <div class="go-history-div" @dblclick="goHistory('year')">
              <chart-Line-Bar ref="chartLineBar3" @refreshData="refreshData" />
            </div>
          </dv-border-box-10>
        </div>
      </dv-border-box-1>
    </dv-full-screen-container>
  </div>
</template>

<script>
import moment from 'moment';
import WenduText from './electricity-wendu-text';
import PieChart from './electricity-pie-chart';
import ChartLineBar from './electricity-his-chart-1'
import { saveVisitLog } from '@/utils/commonUtils.js'
import WenduBar from '@/components/kanban/wendu-bar';

export default {
  name: 'DataView',
  components: {
    ChartLineBar,
    PieChart,
    WenduBar,
    WenduText
  },
  data() {
    return {
      dialogFormVisible: true,
      oldForm: {
        bu_name: ['02'],
      },
      form: {
        query_type: '1',
        bu_name: this.$route.query.bu_name ? [this.$route.query.bu_name] : ['02'],
        position_name: [],
        counter_type: [],
        counter_id: [],
        // date_type: '',
        year: '',
        month: '',
        date: '',
      },
      pieTopTitle: '1600KVA',
      pieBottomTitle: '1000KVA',
      pieTopData: [
        { value: 500, name: '负载44%', itemStyle: { color: '#fac858' } },
        { value: 1100, name: '空闲56%', itemStyle: { color: '#9fe6b8' }, label: {show:false, fontSize: 20}},
      ],
      pieBottomData: [
        { value: 400, name: '负载40%', itemStyle: { color: '#fac858' } },
        { value: 600, name: '空闲60%', itemStyle: { color: '#9fe6b8' }, label: {show:false, fontSize: 20}},
      ],
      loadValueTop: 0,
      loadValueBottom:0,
      loadRateValueTop: 0,
      loadRateValueBottom:0,
      wenduValueTop: 0,
      wenduValueBottom: 0,
      shiduValueTop: 0,
      shiduValueBottom: 0,
      optionsCode: { 'bu_name': '1001', 'position_name': '1002', 'counter_type': '1003', 'counter_id': '1004' },
      buNameOptions: [],
      positionNameOptions: [],
      counterTypeOptions: [],
      counterIdOptions: [],
      dateParams: null,
      monthParams: null,
      yearParams: null,
      formLabelWidth: '60px',
      pageTimer: null,
      pageTimerSwitch: true,
    }
  },
  created() {
    //记录访问日志
    saveVisitLog('CMS 能耗看板-访问');
    this.queryTransformerNowByDict();

    this.getDictParams({ code: this.optionsCode.bu_name });
    this.getDictParams({ code: this.optionsCode.position_name });
    this.getDictParams({ code: this.optionsCode.counter_type });
  },
  mounted() {
    //启动能耗定时任务刷新
    this.startTimer();
    //启动变压器定时任务刷新
    setInterval(this.queryTransformerNowByDict, 1000 * 30)
  },
  methods: {
    goHistory(date_type) {
      if (date_type == 'date' && this.dateParams) {
        this.setCounterIdByCode(this.dateParams);
        let newUrl = this.$router.resolve({ path: 'electricity-his', query: this.dateParams });
        window.open(newUrl.href, '_blank');
      } else if (date_type == 'month' && this.monthParams) {
        this.setCounterIdByCode(this.monthParams);
        let newUrl = this.$router.resolve({ path: 'electricity-his', query: this.monthParams });
        window.open(newUrl.href, '_blank');
      } else if (date_type == 'year' && this.yearParams) {
        this.setCounterIdByCode(this.yearParams);
        let newUrl = this.$router.resolve({ path: 'electricity-his', query: this.yearParams });
        window.open(newUrl.href, '_blank');
      } else {
        console.log(date_type);
      }
    },
    //根据counter_code获取counter_id
    setCounterIdByCode(params) {
      if (params.counter_code) {
        this.counterIdOptions.forEach((item, index) => {
          if (item.value == params.counter_code) {
            params.counter_id = item.item
          }
        })
      }
    },
    onSubmit() {
      this.dialogFormVisible = false;
      this.$nextTick(() => {
        this.refreshData();
      })
    },
    /**
     * 刷新数据
     * refresh：需要刷新的组件{'year','month','date'} 默认为'all'
     * params：参数 刷新所有组件时取实时数据
     */
    refreshData(refresh = 'all', params) {
      let isAll = refresh.includes('all');
      let isYear = isAll || refresh.includes('year');
      let isMonth = isAll || refresh.includes('month');
      let isDate = isAll || refresh.includes('date');

      //刷新单个组件时关闭实时刷新按钮
      if (!isAll) {
        this.pageTimerSwitch = false;
        this.pageTimerSwitchChange(false);
      }

      if (isDate) {
        this.dateParams = { ...this.form, ...params };
        if (isAll) {
          // this.dateParams = { ...this.form };
          this.dateParams.date = moment().format('YYYYMMDD');
        }
        this.dateParams.date_type = 'date';
        this.dateParams.title = this.getChartTitle('小时') + '(' + this.dateParams.date + ')';
        this.$refs.chartLineBar1.getDataList(this.dateParams, '/report/electricitybu/queryElectricityConsumptionByHour');
      }

      if (isMonth) {
        this.monthParams = { ...this.form, ...params };
        if (isAll) {
          // this.monthParams = { ...this.form };
          this.monthParams.month = moment().format('YYYYMM');
        }
        this.monthParams.date_type = "month";
        this.monthParams.title = this.getChartTitle('日') + '(' + this.monthParams.month + ')';
        this.$refs.chartLineBar2.getDataList(this.monthParams, '/report/electricitybu/queryElectricityConsumptionByDay');
      }

      if (isYear) {
        this.yearParams = { ...this.form, ...params }
        if (isAll) {
          // this.yearParams = { ...this.form };
          this.yearParams.year = moment().format('YYYY');
        }
        this.yearParams.date_type = "year";
        this.yearParams.title = this.getChartTitle('月') + '(' + this.yearParams.year + ')';
        this.$refs.chartLineBar3.getDataList(this.yearParams, '/report/electricitybu/queryElectricityConsumptionByMonth');
      }

    },
    getChartTitle(titleKey) {
      return '每' + titleKey + (this.form.query_type == '1' ? '用电' : '用水') + '量';
    },
    startTimer() {
      setTimeout(this.refreshData, 100);
      this.clearTimer();
      this.pageTimer = setInterval(() => {
        this.refreshData()
      }, 1000 * 60 * 3)
    },
    clearTimer() {
      if (this.pageTimer) {
        clearInterval(this.pageTimer)
      }
    },
    pageTimerSwitchChange($event) {
      if ($event) {
        this.startTimer();
      } else {
        this.clearTimer();
      }
    },
    selectChange() {
      if (this.form.bu_name.length == 0) {
        this.form.bu_name = this.oldForm.bu_name;
      }
      this.oldForm.bu_name = this.form.bu_name;
      this.refreshData()
    },
    queryTypeChange($event) {
      this.form.counter_type = [];
      this.form.counter_id = [];
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
    //查询电表下拉选项
    queryCounterSelect() {
      let params = { ...this.form };
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
    },
    //查询最近变压器数据（功耗和温度）
    queryTransformerNowByDict() {
      this.$http({
        url: this.$http.adornUrl('/equipment/transformer/queryTransformerNowByDict'),
        method: 'post',
        // data: this.$http.adornData(params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.list.forEach((item, index) => {
            if (index == 0) {
              this.pieTopTitle = item.remark
              this.pieTopData[0].name = "负载" + item.nowRate + "%"
              this.pieTopData[0].value = item.nowValue
              this.pieTopData[1].name = "空闲" + item.freeRate + "%"
              this.pieTopData[1].value = item.freeValue

              this.loadRateValueTop = item.nowRate
              this.loadValueTop = item.nowValue

              this.$nextTick(() => {
                this.$refs.pieTopChart.refreshChart();
              })
            } else if (index == 1) {
              this.pieBottomTitle = item.remark
              this.pieBottomData[0].name = "负载" + item.nowRate + "%"
              this.pieBottomData[0].value = item.nowValue
              this.pieBottomData[1].name = "空闲" + item.freeRate + "%"
              this.pieBottomData[1].value = item.freeValue

              this.loadRateValueBottom = item.nowRate
              this.loadValueBottom = item.nowValue

              this.$nextTick(() => {
                this.$refs.pieBottomChart.refreshChart();
              })
            } else if (index == 2) {
              this.wenduValueTop = item.nowValue
              // this.$nextTick(() => {
              //   this.$refs.wenduBarTop.refreshChart(item.nowValue);
              // })
            } else if (index == 3) {
              this.wenduValueBottom = item.nowValue
              // this.$nextTick(() => {
              //   this.$refs.wenduBarBottom.refreshChart(item.nowValue);
              // })
            } else if (index == 4) {
              this.shiduValueTop = item.nowValue
            } else {
              this.shiduValueBottom = item.nowValue
            }
          })
        } else {
          console.log(data);
        }
      })
    },
    //记录访问日志
    // saveVisitLog(){
    //   let visitUrl = window.location.href;
    //   let params = {
    //     operation: 'CMS 能耗看板-访问',
    //     method: 'report',
    //     params: visitUrl
    //    };
    //   this.$http({
    //     url: this.$http.adornUrl('/report/electricitybu/saveVisitLog'),
    //     method: 'post',
    //     data: this.$http.adornData(params)
    //   }).then(({ data }) => {
    //       console.log(data);
    //   })
    // }
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
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .mh-left {
      padding-left: 20px;
    }

    .mh-middle {
      font-size: 35px;
    }

    .radio-class {
      float: right;
      margin-right: 20px;
    }

    .mh-left,
    .mh-right {
      width: 240px;
    }
  }

  .main-container {
    height: calc(~"100% - 80px");

    .border-box-content {
      padding: 20px;
      box-sizing: border-box;
    }
  }

  .go-history-div {
    height: 100%;
    width: 100%;
  }

  .top-main-container {
    width: 100%;
    height: calc(~"50% - 5px");
    box-sizing: border-box;
    display: flex;
    flex-direction: row;

    .top-left-container {
      width: 73%;
    }
    .top-right-container {
      width: 27%;
      margin-left: 10px;
    }
  }

  // .top-left-container {
  //   width: 70%;
  //   height: calc(~"50% - 5px");
  //   padding: 10px;
  //   margin-bottom: 10px;
  //   box-sizing: border-box;
  // }

  // .top-right-container {
  //   width: 30%;
  //   height: calc(~"50% - 5px");
  //   padding: 10px;
  //   margin-bottom: 10px;
  //   box-sizing: border-box;
  // }

  .bottom-main-container {
    width: 100%;
    height: calc(~"50% - 5px");
    box-sizing: border-box;
    display: flex;
    flex-direction: row;

    .bottom-left-container {
      width: 50%;
    }
    .bottom-right-container {
      width: 50%;
      margin-left: 10px;
    }
  }

  .item .el-form-item__label {
    color: #fff;
  }
}
</style>
