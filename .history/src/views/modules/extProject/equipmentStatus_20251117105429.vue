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
      timer: null
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

        for (let i = 0; i < this.zoneCount; i++) {
          this.topSetValues[i] = dataJSON[i].sv;
          this.topActualValues[i] = dataJSON[i].pv;
          this.bottomSetValues[i] = dataJSON[i + this.zoneCount].sv;
          this.bottomActualValues[i] = dataJSON[i + this.zoneCount].pv;
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
        { type: 'polygon', shape: { points: [[this.startX-120, this.topY+20],[this.startX-60, this.topY],[this.startX-60, this.bottomY+100],[this.startX-120, this.bottomY+80]] }, style: { fill: '#bbb', stroke: '#666', lineWidth: 2 } },
        { type: 'polygon', shape: { points: [[this.startX+this.zoneCount*this.zoneWidth+60, this.topY],[this.startX+this.zoneCount*this.zoneWidth+120, this.topY+20],[this.startX+this.zoneCount*this.zoneWidth+120, this.bottomY+80],[this.startX+this.zoneCount*this.zoneWidth+60, this.bottomY+100]] }, style: { fill: '#bbb', stroke: '#666', lineWidth: 2 } }
      );

      // 上下层外框
      graphics.push(
        { type: 'rect', shape: { x: this.startX-60, y: this.topY, width: this.zoneCount*this.zoneWidth+120, height: 100 }, style: { fill: '#d9d9d9', stroke: '#555', lineWidth: 2 } },
        { type: 'rect', shape: { x: this.startX-60, y: this.bottomY, width: this.zoneCount*this.zoneWidth+120, height: 100 }, style: { fill: '#d9d9d9', stroke: '#555', lineWidth: 2 } }
      );

      // 传送带
      graphics.push(
        { type: 'rect', shape: { x: this.startX-40, y: this.topY+110, width: this.zoneCount*this.zoneWidth+80, height: 10 }, style: { fill: '#0044cc' } },
        { type: 'rect', shape: { x: this.startX-40, y: this.bottomY-10, width: this.zoneCount*this.zoneWidth+80, height: 10 }, style: { fill: '#0044cc' } }
      );

      // 信号灯柱
      graphics.push(
        { type: 'rect', shape: { x: this.startX-140, y: this.topY-100, width: 10, height: 100 }, style: { fill: '#666' } },
        { type: 'rect', shape: { x: this.startX-145, y: this.topY-120, width: 20, height: 20 }, style: { fill: '#00ff00', stroke: '#333' } },
        { type: 'rect', shape: { x: this.startX-145, y: this.topY-140, width: 20, height: 20 }, style: { fill: '#ffff00', stroke: '#333' } },
        { type: 'rect', shape: { x: this.startX-145, y: this.topY-160, width: 20, height: 20 }, style: { fill: '#ff0000', stroke: '#333' } }
      );

      for (let i = 0; i < this.zoneCount; i++) {
        const x = this.startX + i * this.zoneWidth;

        // 上层温区
        graphics.push({ type: 'rect', shape: { x, y: this.topY+10, width: this.zoneWidth-5, height: 40 }, style: { fill: '#fff', stroke: '#999', lineWidth: 1 } });

        // 下层温区
        graphics.push({ type: 'rect', shape: { x, y: this.bottomY+10, width: this.zoneWidth-5, height: 40 }, style: { fill: '#fff', stroke: '#999', lineWidth: 1 } });

        if (i === 0) {
          // 上层标签
          graphics.push({ type: 'text', style: { x: x-55, y: this.topY + 25, text: '设定值', font: '12px monospace', fill: '#333' } });
          graphics.push({ type: 'rect', shape: { x: x-60, y: this.topY+30, width: 55, height: 20 }, style: { fill: 'rgba(200,200,200,0.2)', stroke: 'rgba(200,200,200,0.2)', lineWidth: 0.5, radius: 3 } });
          graphics.push({ type: 'text', style: { x: x-55, y: this.topY + 45, text: '实际值', font: '12px monospace', fill: '#333' } });

          graphics.push({ type: 'rect', shape: { x: x-60, y: this.bottomY+10, width: 55, height: 20 }, style: { fill: 'rgba(200,200,200,0.2)', stroke: 'rgba(200,200,200,0.2)', lineWidth: 0.5, radius: 3 } });
          graphics.push({ type: 'text', style: { x: x-55, y: this.bottomY + 25, text: '实际值', font: '12px monospace', fill: '#333' } });
          graphics.push({ type: 'text', style: { x: x-55, y: this.bottomY + 45, text: '设定值', font: '12px monospace', fill: '#333' } });
        }

        // 温度值
        graphics.push({ type: 'text', style: { x: x + 10, y: this.topY + 30, text: `${this.topSetValues[i]}℃`, font: '14px monospace', fill: '#333' } });
        graphics.push({ type: 'text', style: { x: x + 10, y: this.topY + 55, text: `${this.topActualValues[i]}℃`, font: 'bold 14px monospace', fill: '#00aa00' } });

        graphics.push({ type: 'text', style: { x: x + 10, y: this.bottomY + 30, text: `${this.bottomSetValues[i]}℃`, font: '14px monospace', fill: '#333' } });
        graphics.push({ type: 'text', style: { x: x + 10, y: this.bottomY + 55, text: `${this.bottomActualValues[i]}℃`, font: 'bold 14px monospace', fill: '#00aa00' } });
      }

      // 标题
      graphics.push({
        type: 'text',
        left: 'center',
        top: 30,
        style: { text: '回流焊炉温区示意图（ECharts）', font: 'bold 22px Microsoft YaHei', fill: '#333' }
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
  box-shadow: 0 0 10px rgba(0,0,0,0.15);
}
</style>
