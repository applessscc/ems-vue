<template>
  <div class="image-view">
    <div class="image-bg">
      <div class="image-flag">
        <!-- {{labelName}}&nbsp; -->
        <el-button :type="labelStatus" :class="labelStatus == 'success' || labelStatus == 'primary' ? 'button_change' : ''" 
        style="width:100px;margin-bottom:2px;font-size:18px;font-weight:600">{{labelName}}</el-button>
      </div>
      <img :src="'http://10.97.245.205:86/mes/devicemastermanage/getfold/img/'+image" class="image">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: String,
      require: false,
      default: ''
    },
    status: {
      type: String,
      require: false,
      default: ''
    },
  },
  //监控 data 中的数据变化
  watch: {
    status(newStatus) {
      if(newStatus == '1'){
        this.labelName = '运行'
        this.labelStatus = 'success'
      }else if(newStatus == '2'){
        this.labelName = '空闲'
        this.labelStatus = 'primary'
      }else if(newStatus == '3'){
        this.labelName = '报警'
        this.labelStatus = 'warning'
      }else if(newStatus == '4'){
        this.labelName = '离线'
        this.labelStatus = 'info'
      }else{
        this.labelName = 'unknown'
        this.labelStatus = ''
      }
    }
  },
  created() {
  },
  data() {
    return {
      labelName:'unknown',
      labelStatus: '',
    }
  }
}
</script>

<style lang="less">
.image-view {
  width: 100%;
  height: 100%;
  // 想要让子容器相对父元素垂直居中，就要给父元素设置一个padding或者border
  padding: 1px;

  .image-bg {
    width: 70%;
    height: 80%;
    margin: calc(~"5% - 2px") auto;
    text-align: center;

    .image-flag {
      width: 100%;
      height: 50px;
      font-weight: bold;
      text-indent: 20px;
      font-size: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .image {
      width: 100%;
      height: calc(~"100% - 50px");
      display: block;
    }
  }
}


/* 呼吸灯 */
.button_change {
  animation: bgLight 3s linear infinite;
  -webkit-animation: bgLight 3s linear infinite;
}
 
@keyframes bgLight {
  0% {
    opacity: 0;
  }
  
  50% {
    opacity: 1;
  }
 
  100% {
    opacity: 1;
  }

  // 0% {
  //   opacity: 1;
  // }
 
  // 10% {
  //   opacity: 0.8;
  // }
 
  // 20% {
  //   opacity: 0.6;
  // }
 
  // 30% {
  //   opacity: 0.4;
  // }
 
  // 40% {
  //   opacity: 0.2;
  // }
 
  // 50% {
  //   opacity: 0;
  // }
 
  // 60% {
  //   opacity: 0.2;
  // }
 
  // 70% {
  //   opacity: 0.4;
  // }
 
  // 80% {
  //   opacity: 0.6;
  // }
 
  // 90% {
  //   opacity: 0.8;
  // }
 
  // 100% {
  //   opacity: 1;
  // }
}
</style>
