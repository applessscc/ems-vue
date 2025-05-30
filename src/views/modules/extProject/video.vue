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
      <div v-if="startCameraStatus" class="form-wrapper">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="name" style="width: 250px;">
            <el-select v-model="videoInfo" placeholder="请选择摄像头名称" :clearable="true">
              <el-option v-for="item in videoInfoList" :key="item.name" :label="item.name" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="ip" style="width: 250px;">
            <el-input v-model="form.ip" placeholder="请输入摄像头IP地址"></el-input>
          </el-form-item>
          <el-form-item label="password" style="width: 250px;">
            <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item style="width: 250px;">
            <el-button type="success" plain @click="startCamera">连接摄像头</el-button>
          </el-form-item>
        </el-form>

      </div>

      <div v-if="stopCameraStatus" class="form-wrapper">
        <el-button type="danger" plain @click="stopCamera">断开摄像头连接</el-button>
      </div>

    </div>

  </div>
</template>

<script>
import Hls from 'hls.js';
import { watch } from 'less';

export default {
  name: 'LiveVideo',
  data() {
    return {
      videoInfo: {},
      form: {
        name: '',
        ip: '',
        password: ''
      },
      videoInfoList: [],
      searchForm: '',
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
    this.fetchVideoInfo();
    this.getActiveStreams();  // 先调用一次
    this.intervalId = setInterval(() => {
      this.getActiveStreams();
      this.fetchVideoInfo();

    }, 15000);  // 10秒
    this.initPlayer(this.$refs.videoPlayer, this.m3u8Url);
    this.initPlayer(this.$refs.thermalPlayer, this.thermalUrl);
  },

  watch: {
    videoInfo(newVal) {
      this.form.ip = newVal.ip || '';
      this.form.password = newVal.password || '';
      this.form.name = newVal.name || '';
    }
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
        method: 'get',
        params: {
          ip: this.form.ip,
          password: this.form.password,
        }
      }).then((response) => {
        if (response.data.code === 200) {
          this.$message({
            message: '摄像头已连接',
            type: 'success',
            duration: 800
          });
        } else {
          this.$message({
            message: '摄像头连接失败！',
            type: 'error',
            duration: 1000
          });
        }
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
    },

    fetchVideoInfo() {
      this.$http({
        url: this.$http.adornUrl('/extProject/getVideoInfoList'),
        method: 'get',
        params: {
          searchForm: this.searchForm
        }
      }).then((response) => {
        if (response.data.code === 200) {
          this.videoInfoList = response.data.data;
        } else {
          this.$message.error(response.data.msg);
        }
      }).catch((error) => {
        console.error(error);
      });
    },

  }
};
</script>

<style scoped>
.button-group {
  text-align: center;
  margin: 30px 0;
  margin-top: 50px;
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

.form-wrapper {
  display: flex;
  justify-content: center;
}
</style>
