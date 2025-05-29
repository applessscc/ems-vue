<template>
  <div>
    <div class="container">
      <div class="video-section">
        <h2>实时视频播放</h2>
        <video ref="videoPlayer" autoplay muted playsinline></video>
      </div>
      <div class="video-section">
        <h2>热成像</h2>
        <video ref="thermalPlayer" autoplay muted playsinline></video>
      </div>
    </div>
        <div class="button-group">
      <el-button type="success" plain @click="startCamera" v-if="startCameraStatus">连接摄像头</el-button>
      <el-button type="danger" plain @click="stopCamera" v-if="stopCameraStatus">断开摄像头连接</el-button>
    </div>
  </div>
</template>

<script>
import Hls from 'hls.js';

export default {
  name: 'LiveVideo',
  data() {
    return {
      startCameraStatus: false,
      stopCameraStatus: false,
      m3u8Url: this.$http.adornUrl(`/videos/stream.m3u8`),
      thermalUrl: this.$http.adornUrl(`/videos/thermal.m3u8`),
    };
  },

  beforeDestroy() {
    // 组件销毁时清除定时器
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },
  mounted() {

    this.getActiveStreams();  // 先调用一次
    this.intervalId = setInterval(() => {
      this.getActiveStreams();
    }, 10000);  // 10秒
    this.initPlayer(this.$refs.videoPlayer, this.m3u8Url);
    this.initPlayer(this.$refs.thermalPlayer, this.thermalUrl);
  },
  methods: {
    initPlayer(videoElement, url) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          startPosition: -1,        // 默认直播行为，从最新位置开始播放
          lowLatencyMode: true,    // 低延迟模式（可选）
          liveSyncDuration: 3,     // 与直播点的同步延迟（单位：秒，可选）
          maxLiveSyncPlaybackRate: 1.5, // 当直播滞后时，加速追赶（可选）
        }); 
        hls.loadSource(url);
        hls.attachMedia(videoElement);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoElement.play();
        });
      } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        videoElement.src = url;
        videoElement.addEventListener('loadedmetadata', () => {
          videoElement.play();
        });
      } else {
        alert('你的浏览器不支持HLS播放，请使用Chrome或Safari');
      }
    },
    startCamera() {
      this.$http({
        url: this.$http.adornUrl(`/extProject/startVideo`),
        method: 'get'
      }).then(() => {
        this.$message({
          message: '摄像头已连接',
          type: 'success',
          duration: 800
        });
        this.getActiveStreams();
      }).catch(() => {
        this.$message({
          message: '连接摄像头失败',
          type: 'error',
          duration: 800
        });
        this.getActiveStreams();
      });
    },
    stopCamera() {
      this.$http({
        url: this.$http.adornUrl(`/extProject/stopVideo`),
        method: 'get'
      }).then(() => {
        this.$message({
          message: '摄像头已断开',
          type: 'warning',
          duration: 800
        });
        this.getActiveStreams();
      }).catch(() => {
        this.$message({
          message: '断开摄像头失败',
          type: 'error',
          duration: 800
        });
        this.getActiveStreams();
      });
    },

    getActiveStreams() {
      this.$http({
        url: this.$http.adornUrl(`/extProject/getActiveStreams`),
        method: 'get'
      }).then((response) => {
        const streams = response.data.data;
        console.log('当前活跃的流', streams);
        if (!streams) {
          this.startCameraStatus = false;
          this.stopCameraStatus = true;
          console.info('streams', streams);
        } else {
          this.startCameraStatus = true;
          this.stopCameraStatus = false;
          console.info('streams2', streams);
        }
      }).catch((error) => {
        console.error('getActiveStreams', error);
      });
    }

  }
};
</script>

<style scoped>
.button-group {
  text-align: center;
  margin: 30px 0;
  margin-top: 90px;
}

.button-group .el-button:first-child {
  margin-right: 20px;
}

.container {
  display: flex;
  align-items: flex-start;
  margin: 20px;
}

.video-section {
  flex: 1;
  margin: 0;
  padding: 0;
}

.video-section h2 {
  margin: 0 0 8px;
  text-align: center;
}

video {
  width: 100%;
  height: auto;
  display: block;
}
</style>
