<template>
  <div class="mod-demo-echarts">
    <div id="J_chartLineBox" ref="chartLineBarDiv" class="chart-box"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getElectricityEChartsTemplate } from '@/utils/eChartsTemplate'
import dark from '@/theme/dark.json'
import moment from 'moment';
import { addZero } from '@/utils'

export default {
  data() {
    return {
      chartLine: null,
    }
  },
  mounted() {
    // this.getDataList()
  },
  activated() {
    // 由于给echart添加了resize事件, 在组件激活时需要重新resize绘画一次, 否则出现空白bug
    if (this.chartLine) {
      this.chartLine.resize()
    }
  },
  methods: {
    // 获取数据列表
    getDataList(params, url) {
      if (!url || url.length == 0) {
        return;
      }
      this.$http({
        url: this.$http.adornUrl(url),
        method: 'post',
        data: this.$http.adornData(params)
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.refreshData(data, params);
        } else {
          console.log(data);
        }
      })
    },
    //组装并刷新图表数据
    refreshData(data, params) {
      var maxValue = 0; //保存堆叠柱形最大值（所有堆叠柱中的最大值）
      var total = []; //保存堆叠柱形加总数据
      var stackTop3Date = []; //保存每根堆叠柱状条前三数据
      let optionData = getElectricityEChartsTemplate();
      optionData.title.text = params.title;

      //设置Y轴单位
      var unit = (params.query_type == '1') ? 'KW/H' : 'T';
      optionData.yAxis[0].axisLabel.formatter = '{value} ' + unit;

      //柱状条数据组装
      data.page.legendBar.forEach((element, i) => {
        //组装legend
        optionData.legend.data.push(element);

        //组装series
        let sData = data.page.seriesDataBar[i];
        let seriesDate = {
          name: element, data: sData, type: "bar", stack: "counter_name", barMaxWidth: '40',
          itemStyle: {
            normal: {
              label: {
                show: true,
                position: 'inside',
                formatter: function (pieceParams) {
                  if (params.date_type != 'date' || pieceParams.value <= 0 || (maxValue / pieceParams.value > 10)) return '';
                  for (let i = 0; i < stackTop3Date[pieceParams.dataIndex].length; i++) {
                    if (pieceParams.seriesIndex == stackTop3Date[pieceParams.dataIndex][i].index) {
                      return parseFloat(pieceParams.value.toFixed(2));
                    }
                  }
                  return '';
                },
                textStyle: {
                  color: '#fff'
                }
              }
            }
          }
        }

        sData.forEach((value, j) => {
          //统计total数据
          i == 0 ? total.push(value) : total[j] += value;

          //计算每根堆叠柱状数据（纵向数据）
          i == 0 ? stackTop3Date.push([{ value: value, index: i }]) : stackTop3Date[j].push({ value: value, index: i });

          //保存最大值
          if (value > maxValue) maxValue = value;
        })

        optionData.series.push(seriesDate);
      });

      //设置目标值line-废弃方案
      // let targetLineData = this.setTargetValueLine(optionData, total, params, data);

      //根据目标值设置超标提示bar
      // this.setWarnBar(optionData, total, targetLineData);

      //排序并截取前三数据
      stackTop3Date.forEach((arr, i) => {
        arr.sort((a, b) => a.value - b.value)
        let tmpArr = arr.slice(-3);
        stackTop3Date[i] = tmpArr;
      })

      //折线条数据组装
      data.page.legendLine.forEach((element, i) => {
        if (i == 0) {
          //组装limit目标值
          optionData.legend.data.push(element);
          let sData = data.page.seriesDataLine[i];
          optionData.series.push({
            name: element, data: sData, type: "line", step: 'middle', smooth: 1,
            lineStyle: { color: '#fff', width: 2, type: 'dashed' }, itemStyle: { color: '#fff' }
          });

          //根据目标值设置超标提示bar
          this.setWarnBar(optionData, total, sData);
        }

        // //组装legend
        // optionData.legend.data.push(element);

        // //组装series
        // let sData = data.page.seriesDataLine[i];
        // optionData.series.push({ name: element, data: sData, type: "line", yAxisIndex: 1 });
      });

      //组装x轴
      optionData.xAxis.data = data.page.xData;

      //双Y轴对齐
      // this.yAxisAlignment(optionData, data.page.seriesDataBar, data.page.seriesDataLine, 5);

      //设置grigger回调函数
      optionData.tooltip.formatter = (item) => {
        let sum = parseFloat(total[item.dataIndex].toFixed(2));
        let target = data.page.seriesDataLine.length > 0 ? data.page.seriesDataLine[0][item.dataIndex] : 'unknown';
        let cur = parseFloat(item.value.toFixed(2));
        let ri = parseFloat((cur / sum * 100).toFixed(2));
        return '总计：' + sum + ' ' + unit + '<br/>目标值：' + target + ' ' + unit + '<br/>' + item.seriesName + '：' + cur + ' ' + unit + '<br/>占比：' + ri + '%';
      }

      //最后一个series添加markPoint在顶部展示总数
      if (params.date_type == 'date' && optionData.series.length > 2) {
        let markData = [];
        total.forEach((markValue, markIndex) => {
          markData.push({ coord: [markIndex, markValue], value: parseFloat(markValue.toFixed(2)) });
        })
        optionData.series[optionData.series.length - 2].markPoint = {
          symbolSize: 0,
          label: {
            show: true,
            position: 'top',
            formatter: '{@score}'
          },
          data: markData
        }
      }

      if (!this.chartLine) {
        //id获取dom方式不可复用采用ref方式
        // this.chartLine = echarts.init(document.getElementById('J_chartLineBox'), dark)
        this.chartLine = echarts.init(this.$refs.chartLineBarDiv, dark)
        window.addEventListener('resize', () => {
          this.chartLine.resize();
        })

        //柱型点击事件-年图刷月图 月图刷日图
        if (params.date_type != 'date') {
          this.chartLine.on('click', event => {
            // let params2 = { counter_name: [event.seriesName] }; 
            let params2 = {};
            if (params.date_type == 'year') {
              params2.month = moment().format('YYYY') + addZero(event.name);
              //当前要查询的日期不存在则取一号的数据
              let tmpDate = params2.month + moment().format('DD');
              if (moment(tmpDate)._isValid) {
                params2.date = tmpDate;
              } else {
                params2.date = moment(params2.month).startOf('month').format('YYYYMMDD');
              }
              this.$emit('refreshData', "month", params2);
              this.$emit('refreshData', "date", params2);
            } else {
              let title = this.chartLine.getOption().title[0].text;
              params2.date = title.slice(-7, -1) + addZero(event.name);
              this.$emit('refreshData', "date", params2);
            }
          })
        }
      }

      //重新生成option对象刷新数据
      this.chartLine.setOption(optionData, true);
    },
    //超过目标线的数据设置边框特效提醒
    setWarnBar(optionData, total, targetLineData) {
      if(!targetLineData || targetLineData.length < 1){
        return;
      }
      let warnIndex = [];
      total.forEach((ct, i) => {
        if (ct > targetLineData[i]) {
          warnIndex.push(i)
        }
      })
      optionData.series.forEach((barData) => {
        let sData = [];
        barData.data.forEach((item, i) => {
          if (warnIndex.includes(i)) {
            sData.push({
              value: item,
              itemStyle: {
                shadowColor: 'rgba(255, 255, 0)',
                shadowBlur: 8
              }
            })
          } else {
            sData.push({ value: item })
          }
        })
        barData.data = sData;
      })
    },
    //设置用电/用水量目标值
    setTargetValueLine(optionData, total, params, data) {
      let targetLineData = [];
      if (params.date_type == 'year') {
        let monthTarget = data.page.targetValue.month;
        total.forEach((e, i) => {
          targetLineData.push(monthTarget);
        })
        //组装legend
        optionData.legend.data.push("目标值");
        //组装series
        optionData.series.push({ name: "目标值", data: targetLineData, type: "line", step: 'middle', smooth: 1, lineStyle: { color: '#fff', width: 2, type: 'dashed' }, itemStyle: { color: '#fff' } });
      } else {
        let weekTarget = params.date_type == 'date' ? data.page.targetValue.hour_week : data.page.targetValue.day_week;
        let restTarget = params.date_type == 'date' ? data.page.targetValue.hour_rest : data.page.targetValue.day_rest;
        let falgValue = 0;
        if (params.date_type == 'date') {
          falgValue = (params.query_type == '1') ? 150 : 20;
        } else if (params.date_type == 'month') {
          falgValue = (params.query_type == '1') ? 2000 : 200;
        }
        total.forEach((e, i) => {
          if (e > falgValue) {
            targetLineData.push(weekTarget);
          } else {
            targetLineData.push(restTarget);
          }
        })
        //组装legend
        optionData.legend.data.push("目标值");
        //组装series
        optionData.series.push({ name: "目标值", data: targetLineData, type: "line", step: 'middle', smooth: 1, lineStyle: { color: '#fff', width: 2, type: 'dashed' }, itemStyle: { color: '#fff' } });
      }
      return targetLineData;
    },
    //计算双Y轴对齐
    yAxisAlignment(optionData, leftData, rightData, splitNumber) {
      //左轴
      if (leftData && leftData.length > 0) {
        let sumLeftData = [...leftData[0]];
        for (let i = 1; i < leftData.length; i++) {
          if (optionData.series[0].stack) {
            for (let j = 0; j < sumLeftData.length; j++) {
              sumLeftData[j] = sumLeftData[j] + leftData[i][j];
            }
          } else {
            sumLeftData = sumLeftData.concat(element);
          }
        }
        let intervalLeft = Math.ceil(Math.max(...sumLeftData) / splitNumber);
        let maxLeft = intervalLeft * splitNumber;
        optionData.yAxis[0].max = maxLeft;
        optionData.yAxis[0].interval = intervalLeft;
        optionData.yAxis[0].min = 0;
      }

      //右轴
      if (rightData && rightData.length > 0) {
        let sumRightData = []
        rightData.forEach(element => {
          sumRightData = sumRightData.concat(element);
        });
        let intervalRight = Math.ceil(Math.max(...sumRightData) / splitNumber);
        let maxRight = intervalRight * splitNumber;
        optionData.yAxis[1].max = maxRight;
        optionData.yAxis[1].interval = intervalRight;
        optionData.yAxis[1].min = 0;
      }
    }
  }
}
</script>

<style lang="less">
.mod-demo-echarts {
  width: 100%;
  height: 100%;
  .chart-box {
    min-height: 100%;
  }
}
</style>
