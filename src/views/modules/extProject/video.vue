<template>
  <div style="display: flex; align-items: flex-start;">
    <div style="flex: 1; margin: 0; padding: 0;">
      <h2 style="margin: 0 0 8px;">实时视频播放</h2>
      <video ref="videoPlayer" autoplay muted style="width: 100%; height: auto; display: block;"></video>
    </div>
    <div style="flex: 1; margin: 0; padding: 0;">
      <h2 style="margin: 0 0 8px;">热成像</h2>
      <video ref="thermalPlayer" autoplay muted style="width: 100%; height: auto; display: block;"></video>
    </div>
  </div>


</template>

<script>
import Hls from 'hls.js';

export default {
  name: 'LiveVideo',
  data() {
    return {
      m3u8Url: this.$http.adornUrl(`/videos/stream.m3u8`),
      thermalUrl: this.$http.adornUrl(`/videos/thermal.m3u8`),

    };
  },
  mounted() {
    this.initPlayer(this.$refs.videoPlayer, this.m3u8Url);
    this.initPlayer(this.$refs.thermalPlayer, this.thermalUrl);
  },
  methods: {
    initPlayer(videoElement, url) {
      if (Hls.isSupported()) {
        const hls = new Hls();
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
    }
  }
};
</script>
