<template>
  <div>
    <div class="container">
      <div class="video-section">
        <!-- <h2>实时视频播放</h2> -->
        <video ref="videoPlayer" autoplay muted playsinline></video>
      </div>
      <div class="video-section" v-show="this.$route.query.videoUrl? this.$route.query.videoUrl.split(',').length > 1 : false">
        <!-- <h2>热成像</h2> -->
        <video ref="videoPlayer2" autoplay muted playsinline></video>
      </div>
    </div>

    <div class="button-group">
      <div v-if="startCameraStatus" class="form-wrapper">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="name" style="width: 250px;" v-show="false">
            <el-select v-model="videoInfo" placeholder="请选择摄像头名称" :clearable="true">
              <el-option v-for="item in videoInfoList" :key="item.name" :label="item.name" :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="ip" style="width: 250px;" v-show="false">
            <el-input v-model="form.ip" placeholder="请输入摄像头IP地址"></el-input>
          </el-form-item>
          <el-form-item label="password" style="width: 250px;" v-show="false">
            <el-input v-model="form.password" placeholder="请输入密码" show-password></el-input>
          </el-form-item>
          <el-form-item label="videoUrl" style="width: 250px;" v-show="false">
            <el-input v-model="form.videoUrl" placeholder="请输入摄像头Url"></el-input>
          </el-form-item>
          <el-form-item style="width: 250px;">
            <el-button type="success" plain :loading="loading" :disabled="loading" @click="startCamera">
              连接摄像头
            </el-button>
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
import { saveVisitLog } from '@/utils/commonUtils.js'

export default {
  name: 'LiveVideo',
  data() {
    return {

      // 控制视频流的显示
      stream1channel2Show: false,
      stream1Show: false,
      stepShow: false,



      videoInfo: {},
      form: {
        name: '',
        ip: '',
        password: '',
        videoUrl: '', // 视频流URL
      },


      videoInfoList: [],
      searchForm: '',

      // 摄像头连接状态
      loading: false, // ← 新增
      startCameraStatus: false,
      stopCameraStatus: false,

      // 视频流的URL
      // m3u8Url: this.$http.adornUrl(`/videos/` + this.$route.query.ip + `stream1.m3u8`),
      m3u8Url: this.m3u8Url = this.$http.adornUrl(
        `/videos/` + this.$route.query.ip +
        ((this.$route.query.videoUrl && this.$route.query.videoUrl.length > 1)
          ? this.$route.query.videoUrl.split(',')[0] + '.m3u8'
          : 'stream1.m3u8')
      ),

      // thermalUrl: this.$http.adornUrl(`/videos/` + this.$route.query.ip + `stream1&channel=2.m3u8`),

      thermalUrl: this.thermalUrl = this.$http.adornUrl(
        `/videos/` + this.$route.query.ip +
        ((this.$route.query.videoUrl && this.$route.query.videoUrl.length > 2)
          ? this.$route.query.videoUrl.split(',')[1] + '.m3u8'
          : 'stream1&channel=2.m3u8')
      )

    };
  },

  beforeDestroy() {
    // 组件销毁时清除定时器
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  },
    created() {
     saveVisitLog('CMS 视频监控-访问');
  },
  mounted() {
    this.fetchVideoInfo();
    this.intervalId = setInterval(() => {
      this.getActiveStreams();
      this.fetchVideoInfo();

    }, 15000);  // 10秒

    if ((this.$route.query.ip && this.$route.query.password)) {
      this.form.ip = this.$route.query.ip;
      this.form.password = this.$route.query.password;
      this.startCamera();
    } else if (this.$route.query.name) {
      this.startCamera();
    } else {
      this.stream1channel2Show = true,
      this.stream1Show = true,
      this.form.ip = '10.9.42.13'
      this.form.password = 'hugo@test'
      this.form.name = 'IR_CAM'
      this.initPlayer(this.$refs.videoPlayer, this.m3u8Url);
      this.initPlayer(this.$refs.videoPlayer2, this.thermalUrl);
    }
    this.getActiveStreams();

  },

  watch: {
    'videoInfo'(newVal) {
      console.log('watchVideoInfo', newVal);
      this.form.ip = newVal.ip || '';
      this.form.password = newVal.password || '';
      this.form.name = newVal.name || '';
      this.form.videoUrl = newVal.videoUrl || '';
    },

    '$route.query.ip'(newVal, oldVal) {
      console.log('watchIp', newVal, oldVal);
      if (newVal && newVal !== oldVal && this.form.ip !== newVal) {
        this.form.ip = newVal;
      }
    },

    'form.ip'(newVal, oldVal) {
      if (newVal && newVal !== oldVal && this.$route.query.ip !== newVal) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            ip: newVal
          }
        });
      }
    },

    '$route.query.password'(newVal, oldVal) {
      console.log('watchPassword', newVal, oldVal);
      if (newVal && newVal !== oldVal && this.form.password !== newVal) {
        this.form.password = newVal;
      }
    },

    'form.password'(newVal, oldVal) {
      if (newVal && newVal !== oldVal && this.$route.query.password !== newVal) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            password: newVal
          }
        });
      }
    },
    'videoInfoList'(newVal, oldVal) {
      if (newVal && newVal.length > 0 && this.$route.query.name) {
        this.videoInfo = newVal.find(item => item.name === this.$route.query.name) || {};
        this.form.ip = this.videoInfo.ip || '';
        this.form.password = this.videoInfo.password || '';
      }
    },

    '$route.query.name'(newVal, oldVal) {
      if (newVal && newVal !== oldVal && this.form.name !== newVal) {
        this.form.name = newVal;
        this.videoInfo = this.videoInfoList.find(item => item.name === this.$route.query.name) || {};
        this.form.ip = this.videoInfo.ip || '';
        this.form.password = this.videoInfo.password || '';
      }
    },
    'form.name'(newVal, oldVal) {
      if (newVal && newVal !== oldVal && this.$route.query.name !== newVal) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            name: newVal
          }
        });
      }
    },



    '$route.query.videoUrl'(newVal, oldVal) {
      if (newVal && newVal !== oldVal && this.form.videoUrl !== newVal) {
        this.form.videoUrl = newVal;
      }
    },
    'form.videoUrl'(newVal, oldVal) {
      if (newVal && newVal !== oldVal && this.$route.query.videoUrl !== newVal) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            videoUrl: newVal
          }
        });
      }
    },


  },

  methods: {

    //     this.m3u8Url = this.$http.adornUrl(`/videos/` + this.$route.query.ip + videoUrl ? this.$route.query.videoUrl.split(',')[0] +'.m3u8': 'stream1.m3u8'),
    // this.initPlayer(this.$refs.videoPlayer, this.m3u8Url);
    // if (this.$route.query.videoNum == 2) {
    //   this.thermalUrl = this.$http.adornUrl(`/videos/` + this.$route.query.ip + videoUrl ? this.$route.query.videoUrl.split(',')[1] +'.m3u8': 'stream1&channel=2.m3u8'),
    //   this.initPlayer(this.$refs.videoPlayer2, this.thermalUrl);
    // }
    startPlay() {
      // this.m3u8Url = this.$http.adornUrl(`/videos/` + this.$route.query.ip + `stream1.m3u8`),
      this.m3u8Url = this.$http.adornUrl(
        `/videos/` + this.$route.query.ip +
        ((this.$route.query.videoUrl && this.$route.query.videoUrl.length > 1)
          ? this.$route.query.videoUrl.split(',')[0] + '.m3u8'
          : 'stream1.m3u8')
      )
      // this.thermalUrl = this.$http.adornUrl(`/videos/` + this.$route.query.ip + `stream1&channel=2.m3u8`),
      this.initPlayer(this.$refs.videoPlayer, this.m3u8Url);
      if (this.$route.query.videoUrl? this.$route.query.videoUrl.split(',').length > 1 : false) {
        this.thermalUrl = this.$http.adornUrl(
          `/videos/` + this.$route.query.ip +
          ((this.$route.query.videoUrl && this.$route.query.videoUrl.length > 2)
            ? this.$route.query.videoUrl.split(',')[1] + '.m3u8'
            : 'stream1&channel=2.m3u8')
        )
        this.initPlayer(this.$refs.videoPlayer2, this.thermalUrl);
      }

    },
    pauseAndClearVideo(videoElement) {
      if (videoElement) {
        videoElement.pause();
        videoElement.removeAttribute('src');  // 移除src
        videoElement.load();                  // 重新加载，清除已加载的数据
      }
    },
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
      this.loading = true; // 开始加载
      this.$http({
        url: this.$http.adornUrl(`/extProject/startVideo`),
        method: 'get',
        params: {
          ip: this.form.ip,
          password: this.form.password,
          name: this.$route.query.name,
          videoUrl: this.$route.query.videoUrl
        }
      }).then((response) => {
        if (response.data.code === 200) {
          this.startCameraStatus = false;
          this.stopCameraStatus = true;
          this.startPlay()
          this.$message({
            message: '摄像头已连接',
            type: 'success',
            duration: 1500
          });
        } else {
          this.$message({
            message: response.data.msg || '连接摄像头失败!',
            type: 'error',
            duration: 1500
          });
        }
      }).catch(() => {
        this.$message({
          message: response.data.msg || '连接摄像头失败!',
          type: 'error',
          duration: 1500
        });
        this.getActiveStreams();
      }).finally(() => {
        this.loading = false; // 无论成功失败都关闭 loading
      });
    },

    stopCamera() {
      this.$http({
        url: this.$http.adornUrl(`/extProject/stopVideo`),
        method: 'get',
        params: {
          ip: this.form.ip,
          password: this.form.password,
          name: this.$route.query.name,
        }
      }).then((response) => {
        if (response.data.code === 200) {
          this.$message({
            message: '摄像头已断开',
            type: 'success',
            duration: 1500
          });
          this.getActiveStreams();
        } else {
          this.$message({
            message: response.data.msg || '断开摄像头失败!',
            type: 'error',
            duration: 1500
          });
        }
        this.getActiveStreams();
      }).catch(() => {
        this.$message({
          message: response.data.msg || '断开摄像头失败!',
          type: 'error',
          duration: 1500
        });
        this.getActiveStreams();
      });


    },

    getActiveStreams() {
      this.$http({
        url: this.$http.adornUrl(`/extProject/getActiveStreams`),
        method: 'get',
        params: {
          ip: this.form.ip,
          name: this.$route.query.name
        }
      }).then((response) => {
        const streams = response.data.data;
        if (!streams) {
          this.startCameraStatus = false;
          this.stopCameraStatus = true;
        } else {
          this.startCameraStatus = true;
          this.stopCameraStatus = false;
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
  margin-top: 30px;
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
}

.video-section {
  max-width: 900px;
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
