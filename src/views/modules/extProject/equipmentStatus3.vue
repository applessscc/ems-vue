<template>
  <div class="machine-container">
    <img :src="require('@/assets/img/123.jpg')" alt="回流焊设备" class="machine-image" />

    <!-- 温区标签 -->
    <div v-for="(zone, index) in zones" :key="index" :style="getPositionStyle(zone)" class="temperature-zone"
      @click="openNew('equipmentStatusHitory', zone.name, equipment)">
      {{ zone.name }}:
      {{ zone.temperature }}°C
    </div>

    <!-- 传送带速度 -->
    <div class="speed-label" :style="{ top: '80%', left: '75%' }">
      传送带速度: {{ speedPV }} cm/min
    </div>
  </div>
</template>


<script>
export default {
  name: 'ReflowOvenDisplay',
  data() {
    return {
      zones: [
        { name: 'Zone 1', temperature: 0, position: { top: '11%', left: '20%' }, rotate: -3 },
        { name: 'Zone 2', temperature: 0, position: { top: '11%', left: '32%' }, rotate: -3 },
        { name: 'Zone 3', temperature: 0, position: { top: '11%', left: '44%' }, rotate: -3 },
        { name: 'Zone 4', temperature: 0, position: { top: '11%', left: '56%' }, rotate: -3 },
        { name: 'Zone 5', temperature: 0, position: { top: '11%', left: '68%' }, rotate: -3 },
        { name: 'Zone 6', temperature: 0, position: { top: '40%', left: '30%' }, rotate: -3 },
        { name: 'Zone 7', temperature: 0, position: { top: '38%', left: '42%' }, rotate: -3 },
        { name: 'Zone 8', temperature: 0, position: { top: '36%', left: '54%' }, rotate: -3 },
        { name: 'Zone 9', temperature: 0, position: { top: '34%', left: '66%' }, rotate: -3 },
        { name: 'Zone 10', temperature: 0, position: { top: '32%', left: '78%' }, rotate: -3 }
      ],
      speedPV: null, // 初始化传送带速度为null
      equipment: ''
    };
  },
  mounted() {
    this.fetchEquipmentStatus();
  },
  methods: {
    openNew(path, name,equipment) {
      const newUrl = this.$router.resolve({
        path: path,
        query: {
          name: name,
          equipment: equipment,

        }
      });
      console.log('打开新页面的URL:', newUrl.href);
      window.open(newUrl.href, '_blank');
    },
    async fetchEquipmentStatus() {
      const response = await this.$http({
        url: this.$http.adornUrl('/extProject/getEquipmentStatus'),
        method: 'get',
        params: { equipment: 'S2-G00000-003-0600' }
      });

      console.log('Equipment status response:', response.data.data.dataJSON);
      if (response.data && response.data.data && response.data.data.dataJSON) {
        const parsedData = JSON.parse(response.data.data.dataJSON);

        console.log('parsedData:', parsedData);
        // 更新每个温区的温度
        parsedData.slice(0, 10).forEach((item, index) => {
          this.zones[index].temperature = item.pv;
          this.zones[index].name = item.name;
        });
        this.equipment = response.data.data.equipment;

        // 更新传送带速度
        this.speedPV = parsedData.find(item => item.name === 'speed').pv;
      }
    },
    getPositionStyle(zone) {
      return {
        top: zone.position.top,
        left: zone.position.left,
        transform: `rotate(${zone.rotate}deg)`,
        transformOrigin: 'center'
      };
    }
  }
};
</script>


<style scoped>
/* 你的样式保持不变 */
.machine-container {
  position: relative;
  display: inline-block;
}

.machine-image {
  width: 100%;
  width: 950px;
  height: auto;
  display: block;
}

.temperature-zone {
  position: absolute;
  color: white;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  white-space: nowrap;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
  z-index: 5;
}

.speed-label {
  position: absolute;
  color: white;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  white-space: nowrap;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}
</style>