<template>
  <div class="chart-container">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'ReflowFurnaceChart',
  data() {
    return {
      deviceNo: ''
      ,
      chart: null,
      zoneCount: 10,
      zoneWidth: 80,
      startX: 160,
      topY: 180,
      bottomY: 360,
      topSetValues: Array(10).fill(0),
      topActualValues: Array(10).fill(0),
      bottomSetValues: Array(10).fill(0),
      bottomActualValues: Array(10).fill(0),
      timer: null,
      speedSV: '0',   // 新增
      speedPV: '0',   // 新增

    };
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart);
    this.fetchData();
    this.timer = setInterval(this.fetchData, 5000);
  },
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.chart) this.chart.dispose();
  },
  methods: {
    async fetchData() {
      try {
        const res = await fetch('http://localhost:8080/ems-admin/extProject/getEquipmentStatus?equipment=S2-G00000-003-0600');
        const json = await res.json();
        const dataJSON = JSON.parse(json.data.dataJSON);
        this.deviceNo = json.data.equipment;   // 取设备号

        for (let i = 0; i < this.zoneCount; i++) {
          this.topSetValues[i] = dataJSON[i].sv;
          this.topActualValues[i] = dataJSON[i].pv;
          this.bottomSetValues[i] = dataJSON[i + this.zoneCount].sv;
          this.bottomActualValues[i] = dataJSON[i + this.zoneCount].pv;
        }

        // 解析 speed（第21项，索引20）
        const speedData = dataJSON[20]; // {"name":"speed","sv":"75","pv":"75"}
        if (speedData && speedData.name === 'speed') {
          this.speedSV = speedData.sv;
          this.speedPV = speedData.pv;
        }


        this.drawChart();
      } catch (err) {
        console.error('获取设备数据失败:', err);
      }
    },
drawChart() {
  const graphics = [];

  // === 全局样式常量 ===
  const FONT_FAMILY = 'Microsoft YaHei, sans-serif';
  const LABEL_FONT = '14px ' + FONT_FAMILY;
  const VALUE_FONT = 'bold 14px monospace';
  const TITLE_FONT = 'bold 22px ' + FONT_FAMILY;
  const SET_VALUE_COLOR = '#666';
  const ACTUAL_VALUE_COLOR = '#2e8b57'; // 深一点的绿色，更稳重
  const ZONE_BG = '#fff';
  const ZONE_BORDER = '#999';
  const FURNACE_BODY_FILL = '#d9d9d9';
  const FURNACE_BODY_STROKE = '#555';
  const CONVEYOR_COLOR = '#0044cc';

  // === 炉体结构 ===
  const leftWing = [[this.startX - 120, this.topY + 20], [this.startX - 60, this.topY], [this.startX - 60, this.bottomY + 100], [this.startX - 120, this.bottomY + 80]];
  const rightWing = [[this.startX + this.zoneCount * this.zoneWidth + 60, this.topY], [this.startX + this.zoneCount * this.zoneWidth + 120, this.topY + 20], [this.startX + this.zoneCount * this.zoneWidth + 120, this.bottomY + 80], [this.startX + this.zoneCount * this.zoneWidth + 60, this.bottomY + 100]];

  graphics.push(
    { type: 'polygon', shape: { points: leftWing }, style: { fill: '#bbb', stroke: '#666', lineWidth: 2 } },
    { type: 'polygon', shape: { points: rightWing }, style: { fill: '#bbb', stroke: '#666', lineWidth: 2 } },
    { type: 'rect', shape: { x: this.startX - 60, y: this.topY, width: this.zoneCount * this.zoneWidth + 120, height: 100 }, style: { fill: FURNACE_BODY_FILL, stroke: FURNACE_BODY_STROKE, lineWidth: 2 } },
    { type: 'rect', shape: { x: this.startX - 60, y: this.bottomY, width: this.zoneCount * this.zoneWidth + 120, height: 100 }, style: { fill: FURNACE_BODY_FILL, stroke: FURNACE_BODY_STROKE, lineWidth: 2 } }
  );

  // === 传送带 ===
  graphics.push(
    { type: 'rect', shape: { x: this.startX - 40, y: this.topY + 110, width: this.zoneCount * this.zoneWidth + 80, height: 10 }, style: { fill: CONVEYOR_COLOR } },
    { type: 'rect', shape: { x: this.startX - 40, y: this.bottomY - 10, width: this.zoneCount * this.zoneWidth + 80, height: 10 }, style: { fill: CONVEYOR_COLOR } }
  );

  // === 信号灯柱 ===
  graphics.push(
    { type: 'rect', shape: { x: this.startX - 140, y: this.topY - 100, width: 10, height: 100 }, style: { fill: '#666' } },
    { type: 'rect', shape: { x: this.startX - 145, y: this.topY - 120, width: 20, height: 20 }, style: { fill: '#00ff00', stroke: '#333' } },
    { type: 'rect', shape: { x: this.startX - 145, y: this.topY - 140, width: 20, height: 20 }, style: { fill: '#ffff00', stroke: '#333' } },
    { type: 'rect', shape: { x: this.startX - 145, y: this.topY - 160, width: 20, height: 20 }, style: { fill: '#ff0000', stroke: '#333' } }
  );

  // === 温区与数值 ===
  for (let i = 0; i < this.zoneCount; i++) {
    const x = this.startX + i * this.zoneWidth;

    // 上下层温区框
    graphics.push(
      { type: 'rect', shape: { x, y: this.topY + 10, width: this.zoneWidth - 5, height: 40 }, style: { fill: ZONE_BG, stroke: ZONE_BORDER, lineWidth: 1 } },
      { type: 'rect', shape: { x, y: this.bottomY + 10, width: this.zoneWidth - 5, height: 40 }, style: { fill: ZONE_BG, stroke: ZONE_BORDER, lineWidth: 1 } }
    );

    // 左侧标签（仅第一区）
    if (i === 0) {
      const labelStyle = { font: '12px ' + FONT_FAMILY, fill: '#333' };
      graphics.push(
        // 上层
        { type: 'text', style: { ...labelStyle, x: x - 55, y: this.topY + 25, text: '设定值' } },
        { type: 'rect', shape: { x: x - 60, y: this.topY + 30, width: 55, height: 20 }, style: { fill: 'rgba(200,200,200,0.2)', stroke: 'rgba(200,200,200,0.2)', lineWidth: 0.5, radius: 3 } },
        { type: 'text', style: { ...labelStyle, x: x - 55, y: this.topY + 45, text: '实际值' } },

        // 下层
        { type: 'rect', shape: { x: x - 60, y: this.bottomY + 10, width: 55, height: 20 }, style: { fill: 'rgba(200,200,200,0.2)', stroke: 'rgba(200,200,200,0.2)', lineWidth: 0.5, radius: 3 } },
        { type: 'text', style: { ...labelStyle, x: x - 55, y: this.bottomY + 25, text: '实际值' } },
        { type: 'text', style: { ...labelStyle, x: x - 55, y: this.bottomY + 45, text: '设定值' } }
      );
    }

    // 温度数值
    graphics.push(
      // 上层
      { type: 'text', style: { x: x + 10, y: this.topY + 30, text: `${this.topSetValues[i]}℃`, font: LABEL_FONT, fill: SET_VALUE_COLOR } },
      { type: 'text', style: { x: x + 10, y: this.topY + 55, text: `${this.topActualValues[i]}℃`, font: VALUE_FONT, fill: ACTUAL_VALUE_COLOR } },

      // 下层
      { type: 'text', style: { x: x + 10, y: this.bottomY + 30, text: `${this.bottomSetValues[i]}℃`, font: LABEL_FONT, fill: SET_VALUE_COLOR } },
      { type: 'text', style: { x: x + 10, y: this.bottomY + 55, text: `${this.bottomActualValues[i]}℃`, font: VALUE_FONT, fill: ACTUAL_VALUE_COLOR } }
    );
  }

  // === 传送带速度显示 ===
  const totalWidth = this.zoneCount * this.zoneWidth;
  const centerX = this.startX + totalWidth / 2;
  const speedY = this.bottomY + 150;
  const sv = parseFloat(this.speedSV).toFixed(1);
  const pv = parseFloat(this.speedPV).toFixed(1);

  const labelWidth = 80;
  const svWidth = 60;
  const pvWidth = 60;
  const unitWidth = 80;
  const itemHeight = 28;
  const startY = speedY - itemHeight / 2;
  const startX = centerX - (labelWidth + svWidth + pvWidth + unitWidth) / 2;

  // 背景底框
  graphics.push({
    type: 'rect',
    shape: {
      x: startX - 10,
      y: startY - 4,
      width: labelWidth + svWidth + pvWidth + unitWidth + 20,
      height: itemHeight + 8
    },
    style: {
      fill: 'rgba(245, 245, 245, 0.6)',
      stroke: '#ddd',
      lineWidth: 0.8,
      radius: 5
    }
  });

  // "传送带 1"
  graphics.push({
    type: 'text',
    style: {
      x: startX + labelWidth / 2,
      y: speedY,
      text: '传送带',
      font: 'bold 14px ' + FONT_FAMILY,
      fill: '#0066cc',
      textAlign: 'center',
      textBaseline: 'middle'
    }
  });

  // 设定值框
  graphics.push(
    {
      type: 'rect',
      shape: { x: startX + labelWidth, y: startY, width: svWidth, height: itemHeight },
      style: { fill: '#ffffff', stroke: '#cccccc', lineWidth: 1, radius: 4 }
    },
    {
      type: 'text',
      style: {
        x: startX + labelWidth + svWidth / 2,
        y: speedY,
        text: sv,
        font: '14px monospace',
        fill: SET_VALUE_COLOR,
        textAlign: 'center',
        textBaseline: 'middle'
      }
    }
  );

  // 实际值框（绿色背景 + 白字）
  graphics.push(
    {
      type: 'rect',
      shape: { x: startX + labelWidth + svWidth, y: startY, width: pvWidth, height: itemHeight },
      style: { fill: '#90ee90', stroke: '#66cc66', lineWidth: 1, radius: 4 }
    },
    {
      type: 'text',
      style: {
        x: startX + labelWidth + svWidth + pvWidth / 2,
        y: speedY,
        text: pv,
        font: 'bold 14px monospace',
        fill: '#000',
        textAlign: 'center',
        textBaseline: 'middle'
      }
    }
  );

  // 单位
  graphics.push({
    type: 'text',
    style: {
      x: startX + labelWidth + svWidth + pvWidth + 5,
      y: speedY,
      text: '厘米/min',
      font: '14px ' + FONT_FAMILY,
      fill: '#666',
      textAlign: 'left',
      textBaseline: 'middle'
    }
  });

  // === 标题 ===
  graphics.push({
    type: 'text',
    left: 'center',
    top: 30,
    style: {
      text: `回流焊炉温区（${this.deviceNo}）`,
      font: TITLE_FONT,
      fill: '#333'
    }
  });

  this.chart.setOption({ graphic: graphics });
}
  }
};
</script>

<style scoped>
.chart-container {
  width: 1200px;
  height: 650px;
  margin: auto;
  background: #e5f0f7;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}
</style>
