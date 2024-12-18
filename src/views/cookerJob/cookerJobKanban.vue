<template>
  <div>

    <div class="top-contain">
      <el-card style="height: 300px;">
        <el-row justify="center">
          <el-col :span="3" class="show-item">
            <el-card :body-style="{ padding: '10px' }">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div style="padding: 14px;">
                <span class="item-desc">1号拉</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="3" class="show-item">
            <el-card :body-style="{ padding: '10px' }">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div style="padding: 14px;">
                <span>1号拉</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="3" class="show-item">
            <el-card :body-style="{ padding: '10px' }">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div style="padding: 14px;">
                <span>1号拉</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="3" class="show-item">
            <el-card :body-style="{ padding: '10px' }">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div style="padding: 14px;">
                <span>1号拉</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="3" class="show-item">
            <el-card :body-style="{ padding: '10px' }">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div style="padding: 14px;">
                <span>1号拉</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="3" class="show-item">
            <el-card :body-style="{ padding: '10px' }">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div style="padding: 14px;">
                <span>1号拉</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
                  <el-col :span="3" class="show-item">
            <el-card :body-style="{ padding: '10px' }">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div style="padding: 14px;">
                <span>1号拉</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
             <el-col :span="3" class="show-item">
            <el-card :body-style="{ padding: '10px' }">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div style="padding: 14px;">
                <span>1号拉</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
          

        </el-row>
      </el-card>
    </div>

    <div class="main-contain">
      <el-card style="height: 550px;">
        <div class="main-contain-img">
        </div>
      </el-card>
    </div>

    <div class="right-contain">
      <el-card style="height: 550px;">
        <el-row>
          <el-col :span="24" class="show-item">
            <el-card :body-style="{ padding: '10px' }">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div style="padding: 14px;">
                <span class="item-desc">1号拉</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" class="show-item">
            <el-card :body-style="{ padding: '10px' }">
              <img src="../../assets/img/left-top-bg.jpg" class="image">
              <div style="padding: 14px;">
                <span class="item-desc">1号拉</span>
                <div class="bottom clearfix">
                  <time class="time">{{ currentDate }}</time>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>

  </div>
</template>  


<script>
export default {

  data() {
    return {

    }

  },
  components: {

  },
  computed: {

  },
  created() {
  },
  mounted() {

  },
  methods: {

  }
}
</script>
<style>
.top-contain {
  margin: 20px;
  height: 300px;
  width: 1870px;
  position: fixed;
}
.main-contain-img {
  background-image: url("../../assets/img/left-top-bg.jpg");
  background-size: cover; /* 让背景图片覆盖整个 div */
  background-position: center; /* 图片居中 */
  width: 100%;
  height: 500px;
}
.main-contain {
  position: fixed;
  top: 320px;
  width: 1520px;
  height: 550px;
  margin: 20px;
}
.right-contain {
  position: fixed;
  top: 320px;
  width: 330px;
  height: 550px;
  left: 1540px;
  margin: 20px;
}
.show-item {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}
.image {
  max-width: 100%; /* 防止图片超出容器 */
  max-height: 100%; /* 防止图片超出容器 */
  width: 185px;
}
.item-desc {
}
</style>