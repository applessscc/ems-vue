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

      // 左右斜角炉体
      graphics.push(
        { type: 'polygon', shape: { points: [[this.startX - 120, this.topY + 20], [this.startX - 60, this.topY], [this.startX - 60, this.bottomY + 100], [this.startX - 120, this.bottomY + 80]] }, style: { fill: '#bbb', stroke: '#666', lineWidth: 2 } },
        { type: 'polygon', shape: { points: [[this.startX + this.zoneCount * this.zoneWidth + 60, this.topY], [this.startX + this.zoneCount * this.zoneWidth + 120, this.topY + 20], [this.startX + this.zoneCount * this.zoneWidth + 120, this.bottomY + 80], [this.startX + this.zoneCount * this.zoneWidth + 60, this.bottomY + 100]] }, style: { fill: '#bbb', stroke: '#666', lineWidth: 2 } }
      );

      // 上下层外框
      graphics.push(
        { type: 'rect', shape: { x: this.startX - 60, y: this.topY, width: this.zoneCount * this.zoneWidth + 120, height: 100 }, style: { fill: '#d9d9d9', stroke: '#555', lineWidth: 2 } },
        { type: 'rect', shape: { x: this.startX - 60, y: this.bottomY, width: this.zoneCount * this.zoneWidth + 120, height: 100 }, style: { fill: '#d9d9d9', stroke: '#555', lineWidth: 2 } }
      );

      // 传送带
      graphics.push(
        { type: 'rect', shape: { x: this.startX - 40, y: this.topY + 110, width: this.zoneCount * this.zoneWidth + 80, height: 10 }, style: { fill: '#0044cc' } },
        { type: 'rect', shape: { x: this.startX - 40, y: this.bottomY - 10, width: this.zoneCount * this.zoneWidth + 80, height: 10 }, style: { fill: '#0044cc' } }
      );

      // 信号灯柱
      graphics.push(
        { type: 'rect', shape: { x: this.startX - 140, y: this.topY - 100, width: 10, height: 100 }, style: { fill: '#666' } },
        { type: 'rect', shape: { x: this.startX - 145, y: this.topY - 120, width: 20, height: 20 }, style: { fill: '#00ff00', stroke: '#333' } },
        { type: 'rect', shape: { x: this.startX - 145, y: this.topY - 140, width: 20, height: 20 }, style: { fill: '#ffff00', stroke: '#333' } },
        { type: 'rect', shape: { x: this.startX - 145, y: this.topY - 160, width: 20, height: 20 }, style: { fill: '#ff0000', stroke: '#333' } }
      );

      for (let i = 0; i < this.zoneCount; i++) {
        const x = this.startX + i * this.zoneWidth;

        // 上层温区
        graphics.push({ type: 'rect', shape: { x, y: this.topY + 10, width: this.zoneWidth - 5, height: 40 }, style: { fill: '#fff', stroke: '#999', lineWidth: 1 } });

        // 下层温区
        graphics.push({ type: 'rect', shape: { x, y: this.bottomY + 10, width: this.zoneWidth - 5, height: 40 }, style: { fill: '#fff', stroke: '#999', lineWidth: 1 } });

        if (i === 0) {
          // 上层标签

          graphics.push({ type: 'text', style: { x: x - 55, y: this.topY + 25, text: '设定值', font: '12px monospace', fill: '#333' } });
          graphics.push({ type: 'rect', shape: { x: x - 60, y: this.topY + 30, width: 55, height: 20 }, style: { fill: 'rgba(200,200,200,0.2)', stroke: 'rgba(200,200,200,0.2)', lineWidth: 0.5, radius: 3 } });
          graphics.push({ type: 'text', style: { x: x - 55, y: this.topY + 45, text: '实际值', font: '12px monospace', fill: '#333' } });




          graphics.push({ type: 'rect', shape: { x: x - 60, y: this.bottomY + 10, width: 55, height: 20 }, style: { fill: 'rgba(200,200,200,0.2)', stroke: 'rgba(200,200,200,0.2)', lineWidth: 0.5, radius: 3 } });
          graphics.push({ type: 'text', style: { x: x - 55, y: this.bottomY + 25, text: '实际值', font: '12px monospace', fill: '#333' } });
          graphics.push({ type: 'text', style: { x: x - 55, y: this.bottomY + 45, text: '设定值', font: '12px monospace', fill: '#333' } });
        }

        // 温度值
        graphics.push({ type: 'text', style: { x: x + 10, y: this.topY + 30, text: `${this.topSetValues[i]}℃`, font: '14px monospace', fill: '#333' } });
        graphics.push({ type: 'text', style: { x: x + 10, y: this.topY + 55, text: `${this.topActualValues[i]}℃`, font: 'bold 14px monospace', fill: '#00aa00' } });

        graphics.push({ type: 'text', style: { x: x + 10, y: this.bottomY + 30, text: `${this.bottomSetValues[i]}℃`, font: '14px monospace', fill: '#333' } });
        graphics.push({ type: 'text', style: { x: x + 10, y: this.bottomY + 55, text: `${this.bottomActualValues[i]}℃`, font: 'bold 14px monospace', fill: '#00aa00' } });
      }

// ========== 传送带速度显示（上下+左右完全居中） ==========
const totalWidth = this.zoneCount * this.zoneWidth;
const centerX = this.startX + totalWidth / 2; // 炉体中心 X
const speedY = this.bottomY + 150; // 垂直位置（可根据需要微调）

// 格式化数值
const sv = parseFloat(this.speedSV).toFixed(1); // 如: "75.0"
const pv = parseInt(this.speedPV, 10);         // 如: 75

// 元素尺寸
const labelWidth = 80;   // "传送带 1"
const svWidth = 60;      // 设定值框
const pvWidth = 60;      // 实际值框
const unitWidth = 80;    // "厘米/min"

const itemHeight = 28;   // 所有元素统一高度（含 padding）
const startY = speedY - itemHeight / 2; // 矩形的 top Y（使整体垂直居中于 speedY）

// 整体起始 X（用于水平居中）
const startX = centerX - (labelWidth + svWidth + pvWidth + unitWidth) / 2;

// 背景底框（可选，提升视觉层次）
graphics.push({
  type: 'rect',
  shape: {
    x: startX - 10,
    y: startY - 4,
    width: labelWidth + svWidth + pvWidth + unitWidth + 20,
    height: itemHeight + 8
  },
  style: {
    fill: 'rgba(245, 245, 245, 0.4)',
    stroke: '#ddd',
    lineWidth: 0.8,
    radius: 5
  }
});

// 1. "传送带 1" 文字（蓝色，居中）
graphics.push({
  type: 'text',
  style: {
    x: startX + labelWidth / 2,
    y: speedY,
    text: '传送带 1',
    font: 'bold 14px Microsoft YaHei',
    fill: '#0066cc',
    textAlign: 'center',
    textBaseline: 'middle'
  }
});

// 2. 设定值框 [75.0]
graphics.push(
  // 白色背景矩形
  {
    type: 'rect',
    shape: {
      x: startX + labelWidth,
      y: startY,
      width: svWidth,
      height: itemHeight
    },
    style: {
      fill: '#ffffff',
      stroke: '#cccccc',
      lineWidth: 1,
      radius: 4
    }
  },
  // 数值文本
  {
    type: 'text',
    style: {
      x: startX + labelWidth + svWidth / 2,
      y: speedY,
      text: sv,
      font: '14px monospace',
      fill: '#333333',
      textAlign: 'center',
      textBaseline: 'middle'
    }
  }
);

// 3. 实际值框 [75]
graphics.push(
  // 绿色背景矩形
  {
    type: 'rect',
    shape: {
      x: startX + labelWidth + svWidth,
      y: startY,
      width: pvWidth,
      height: itemHeight
    },
    style: {
      fill: '#90ee90', // 浅绿色
      stroke: '#66cc66',
      lineWidth: 1,
      radius: 4
    }
  },
  // 数值文本（白色加粗）
  {
    type: 'text',
    style: {
      x: startX + labelWidth + svWidth + pvWidth / 2,
      y: speedY,
      text: pv.toString(),
      font: 'bold 14px monospace',
      fill: '#ffffff',
      textAlign: 'center',
      textBaseline: 'middle'
    }
  }
);

// 4. 单位 "厘米/min"
graphics.push({
  type: 'text',
  style: {
    x: startX + labelWidth + svWidth + pvWidth,
    y: speedY,
    text: '厘米/min',
    font: '14px Microsoft YaHei',
    fill: '#666666',
    textAlign: 'left',
    textBaseline: 'middle'
  }
});
      // 标题
      graphics.push({
        type: 'text',
        left: 'center',
        top: 30,
        style: {
          text: `回流焊炉温区（${this.deviceNo}）`,
          font: 'bold 22px Microsoft YaHei',
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
