<template>
  <div class="chart-container">
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { create } from 'lodash';

export default {
  name: 'ReflowFurnaceChart',
  create() {
    return {};
  },
  data() {
    return {
      deviceNo: '',
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
      speedSV: '0',
      speedPV: '0',

      conveyorOffset: 0,
      animationFrameId: null,
    };
  },

  mounted() {
    this.chart = echarts.init(this.$refs.chart);
    this.fetchData();
    this.timer = setInterval(this.fetchData, 5000);
    this.animateConveyor();
  },

  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.chart) this.chart.dispose();
  },

  methods: {
    async fetchData() {
      try {
        const response = await this.$http({
          url: this.$http.adornUrl('/extProject/getEquipmentStatus'),
          method: 'get',
          params: { equipment: 'S2-G00000-003-0600' }
        });

        const json = response.data;
        const dataJSON = JSON.parse(json.data.dataJSON);
        this.deviceNo = json.data.equipment;

        for (let i = 0; i < this.zoneCount; i++) {
          this.topSetValues[i] = dataJSON[i].sv || 0;
          this.topActualValues[i] = dataJSON[i].pv || 0;
          this.bottomSetValues[i] = dataJSON[i + this.zoneCount].sv || 0;
          this.bottomActualValues[i] = dataJSON[i + this.zoneCount].pv || 0;
        }

        const speedData = dataJSON[20];
        if (speedData && speedData.name === 'speed') {
          this.speedSV = String(speedData.sv || '0');
          this.speedPV = String(speedData.pv || '0');
        }

        this.drawChart();
      } catch (err) {
        console.error('获取设备数据失败:', err);
      }
    },

    animateConveyor() {
      const animate = () => {
        const baseSpeed = parseFloat(this.speedPV) || 0;
        const animSpeed = Math.min(3, Math.max(0.3, baseSpeed / 20));
        this.conveyorOffset = (this.conveyorOffset + animSpeed) % 20;
        if (this.chart) this.drawChart();
        this.animationFrameId = requestAnimationFrame(animate);
      };
      this.animationFrameId = requestAnimationFrame(animate);
    },

    drawChart() {
      const graphics = [];

      // === 样式 ===
      const FONT_FAMILY = 'Microsoft YaHei, sans-serif';
      const LABEL_FONT = '14px ' + FONT_FAMILY;
      const VALUE_FONT = 'bold 14px monospace';
      const TITLE_FONT = 'bold 22px ' + FONT_FAMILY;

      const SET_VALUE_COLOR = '#666';
      const ACTUAL_VALUE_COLOR = '#2e8b57';

      const ZONE_BG = '#fff';
      const ZONE_BORDER = '#999';

      const FURNACE_BODY_FILL = '#d9d9d9';
      const FURNACE_BODY_STROKE = '#555';






      
      // 灰色金属传送带
      const CONVEYOR_DARK = '#5a5a5a';
      const CONVEYOR_LIGHT = '#a0a0a0';





      // 入口阴影
      graphics.push({
        type: 'rect',
        shape: {
          x: this.startX - 60,
          y: this.topY + 40,
          width: 30,
          height: this.bottomY - this.topY + 20
        },
        style: {
          fill: 'rgba(0,0,0,0.25)'
        }
      });

      // 黑色进板口
      graphics.push({
        type: 'rect',
        shape: {
          x: this.startX - 70,
          y: this.topY + 60,
          width: 20,
          height: this.bottomY - this.topY - 10
        },
        style: {
          fill: '#111'
        }
      });









      // =====  炉体结构  =====
      const leftWing = [
        [this.startX - 120, this.topY + 20],
        [this.startX - 60, this.topY],
        [this.startX - 60, this.bottomY + 100],
        [this.startX - 120, this.bottomY + 80]
      ];

      const rightWing = [
        [this.startX + this.zoneCount * this.zoneWidth + 60, this.topY],
        [this.startX + this.zoneCount * this.zoneWidth + 120, this.topY + 20],
        [this.startX + this.zoneCount * this.zoneWidth + 120, this.bottomY + 80],
        [this.startX + this.zoneCount * this.zoneWidth + 60, this.bottomY + 100]
      ];

      graphics.push(
        { type: 'polygon', shape: { points: leftWing }, style: { fill: '#bbb', stroke: '#666', lineWidth: 2 } },
        { type: 'polygon', shape: { points: rightWing }, style: { fill: '#bbb', stroke: '#666', lineWidth: 2 } },
        { type: 'rect', shape: { x: this.startX - 60, y: this.topY, width: this.zoneCount * this.zoneWidth + 120, height: 100 }, style: { fill: FURNACE_BODY_FILL, stroke: FURNACE_BODY_STROKE, lineWidth: 2 } },
        { type: 'rect', shape: { x: this.startX - 60, y: this.bottomY, width: this.zoneCount * this.zoneWidth + 120, height: 100 }, style: { fill: FURNACE_BODY_FILL, stroke: FURNACE_BODY_STROKE, lineWidth: 2 } }
      );

      // ===== 动态传送带 =====
      const beltTopY = this.topY + 110;
      const beltBottomY = this.bottomY - 20;
      const beltHeight = 10;
      const beltTotalWidth = this.zoneCount * this.zoneWidth + 80;

      const segmentWidth = 20;
      const totalSegments = Math.ceil(beltTotalWidth / segmentWidth) + 5;

      const startX = this.startX - 40;
      const endX = startX + beltTotalWidth;


    
      
      // 顶部导轨线
      graphics.push({
        type: 'line',
        shape: { x1: startX, y1: beltTopY - 5, x2: endX, y2: beltTopY - 5 },
        style: { stroke: '#444', lineWidth: 2 }
      });
      graphics.push({
        type: 'line',
        shape: { x1: startX, y1: beltTopY + 15, x2: endX, y2: beltTopY + 15 },
        style: { stroke: '#444', lineWidth: 2 }
      });

      // 底部导轨线
      graphics.push({
        type: 'line',
        shape: { x1: startX, y1: beltBottomY - 5, x2: endX, y2: beltBottomY - 5 },
        style: { stroke: '#444', lineWidth: 2 }
      });
      graphics.push({
        type: 'line',
        shape: { x1: startX, y1: beltBottomY + 15, x2: endX, y2: beltBottomY + 15 },
        style: { stroke: '#444', lineWidth: 2 }
      });

      for (let i = 0; i < totalSegments; i++) {
        const x = startX + (i * segmentWidth + this.conveyorOffset) % (totalSegments * segmentWidth);
        if (x > endX || x + segmentWidth < startX) continue;

        graphics.push({
          type: 'rect',
          shape: { x, y: beltTopY, width: segmentWidth, height: beltHeight },
          style: {
            fill: i % 2 === 0 ? CONVEYOR_DARK : CONVEYOR_LIGHT,
            stroke: '#333',
            lineWidth: 0.8
          }
        });
      }

      for (let i = 0; i < totalSegments; i++) {
        const x = startX + (i * segmentWidth + this.conveyorOffset) % (totalSegments * segmentWidth);
        if (x > endX || x + segmentWidth < startX) continue;

        graphics.push({
          type: 'rect',
          shape: { x, y: beltBottomY, width: segmentWidth, height: beltHeight },
          style: {
            fill: i % 2 === 0 ? CONVEYOR_DARK : CONVEYOR_LIGHT,
            stroke: '#333',
            lineWidth: 0.8
          }
        });
      }


      graphics.push({
  type: 'rect',
  shape: {
    x: this.startX + this.zoneCount * this.zoneWidth + 80,
    y: this.topY + 60,
    width: 20,
    height: this.bottomY - this.topY - 10
  },
  style: { fill: '#111' }
});

// 出口小光亮效果
graphics.push({
  type: 'rect',
  shape: {
    x: this.startX + this.zoneCount * this.zoneWidth + 100,
    y: this.topY + 60,
    width: 10,
    height: this.bottomY - this.topY - 10
  },
  style: { fill: 'rgba(255,255,255,0.1)' }
});


      // ===== 信号灯 =====

      
      graphics.push(
        { type: 'rect', shape: { x: this.startX - 140, y: this.topY - 100, width: 10, height: 100 }, style: { fill: '#666' } },
        { type: 'rect', shape: { x: this.startX - 145, y: this.topY - 120, width: 20, height: 20 }, style: { fill: '#00ff00', stroke: '#333' } },
        { type: 'rect', shape: { x: this.startX - 145, y: this.topY - 140, width: 20, height: 20 }, style: { fill: '#ffff00', stroke: '#333' } },
        { type: 'rect', shape: { x: this.startX - 145, y: this.topY - 160, width: 20, height: 20 }, style: { fill: '#ff0000', stroke: '#333' } }
      );

      // ===== 温区显示 =====
      for (let i = 0; i < this.zoneCount; i++) {
        const x = this.startX + i * this.zoneWidth;

        graphics.push(
          { type: 'rect', shape: { x, y: this.topY + 20, width: this.zoneWidth - 5, height: 30 }, style: { fill: ZONE_BG, stroke: ZONE_BORDER } },
          { type: 'rect', shape: { x, y: this.bottomY + 45, width: this.zoneWidth - 5, height: 30 }, style: { fill: ZONE_BG, stroke: ZONE_BORDER } }
        );

        if (i === 0) {
          const labelStyle = { font: '12px ' + FONT_FAMILY, fill: '#333' };

          graphics.push(
            { type: 'rect', shape: { x: x - 60, y: this.topY + 30, width: 55, height: 20 }, style: { fill: 'rgba(200,200,200,0.2)' } },
            { type: 'text', style: { ...labelStyle, x: x - 55, y: this.topY + 30, text: '设定值' } },
            { type: 'text', style: { ...labelStyle, x: x - 55, y: this.topY + 55, text: '实际值' } },

            { type: 'rect', shape: { x: x - 60, y: this.bottomY + 10, width: 55, height: 20 }, style: { fill: 'rgba(200,200,200,0.2)' } },
            { type: 'text', style: { ...labelStyle, x: x - 55, y: this.bottomY + 30, text: '实际值' } },
            { type: 'text', style: { ...labelStyle, x: x - 55, y: this.bottomY + 60, text: '设定值' } }
          );
        }

        graphics.push(
          { type: 'text', style: { x: x + 10, y: this.topY + 30, text: `${this.topSetValues[i]}℃`, font: LABEL_FONT, fill: SET_VALUE_COLOR } },
          { type: 'text', style: { x: x + 10, y: this.topY + 55, text: `${this.topActualValues[i]}℃`, font: VALUE_FONT, fill: ACTUAL_VALUE_COLOR } },

          { type: 'text', style: { x: x + 10, y: this.bottomY + 25, text: `${this.bottomSetValues[i]}℃`, font: VALUE_FONT, fill: ACTUAL_VALUE_COLOR } },
          { type: 'text', style: { x: x + 10, y: this.bottomY + 55, text: `${this.bottomActualValues[i]}℃`, font: LABEL_FONT, fill: SET_VALUE_COLOR } }
        );
      }

      // ===== 速度显示 =====
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

      graphics.push({
        type: 'text',
        style: {
          x: startX + labelWidth / 2,
          y: speedY,
          text: '传送带',
          font: 'bold 14px ' + FONT_FAMILY,
          fill: '#555',
          textAlign: 'center',
          textBaseline: 'middle'
        }
      });

      graphics.push(
        {
          type: 'rect',
          shape: { x: startX + labelWidth, y: startY + 5, width: svWidth, height: itemHeight },
          style: { fill: '#f5f5f5', stroke: '#ccc', radius: 4 }
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

      graphics.push(
        {
          type: 'rect',
          shape: { x: startX + labelWidth + svWidth, y: startY + 5, width: pvWidth, height: itemHeight },
          style: { fill: '#d0f0d0', stroke: '#88cc88', radius: 4 }
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


      

      // ===== 标题 =====
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
  width: 1100PX;
  height: 550px;
  /* background: #e5f0f7; */
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart {
  width: 100%;
  height: 100%;
  /* background: #fff; */
  border-radius: 10px;
  /* box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); */
}
</style>
