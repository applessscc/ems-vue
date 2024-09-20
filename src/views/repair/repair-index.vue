<template>
  <el-main>
    <!-- 报修统计 -->
    <el-row :gutter="20" type="flex" class="row-bg" justify="center" style="margin-bottom: 40px">
      <el-col :span="6" v-if="typeCon != '0'">
        <div class="show-header" style="background: #409EFF">
          <div class="show-num">{{ readerCount }}</div>
          <div class="bottom-text">待处理</div>
        </div>
      </el-col>
      <el-col :span="6" v-if="typeCon != '0'">
        <div class="show-header" style="background: #67C23A">
          <div class="show-num">{{ applyReader }}</div>
          <div class="bottom-text">待完成</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="show-header" style="background: rgb(255,165,0">
          <div class="show-num">{{ borrowApplyCount }}</div>
          <div class="bottom-text">待确认</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="show-header" style="background: #909399">
          <div class="show-num">{{ borrowApplyCount }}</div>
          <div class="bottom-text">已取消</div>
        </div>
      </el-col>
    </el-row>
    <repairListVue></repairListVue>
  </el-main>

</template>

<script>
import repairListVue from './repair-list.vue'
export default {
  name: 'Dashboard',
  components: {
    repairListVue
  },
  data() {
    return {
      readerCount: 0,
      applyReader: 0,
      borrowApplyCount: 0,
      borrowReturnCount: 0,
      borrowReturnCount2: 0,
      borrowReturnCount3: 0,
      noticeList: [],
      list: [1, 2, 3, 4, 11, 56],
      roleType: '',
      tableData: [
        { name: '项目1', date: '2024-01-01', status: '完成' },
        { name: '项目2', date: '2024-01-02', status: '处理中' },
        { name: '项目3', date: '2024-01-03', status: '已确认' },
      ],
      roleId: '',
      typeCon: ''
    }
  },
  mounted() {
    // 这里可以添加获取表格数据的逻辑
  },
  methods: {
    // 其他方法
  }
}
</script>

<style lang="scss" scoped>
.bottom-text {
  bottom: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.1);
  height: 25px;
  line-height: 25px;
  text-align: center;
  position: absolute;
  font-weight: 600;
}

.show-header {
  background: #00c0ef;
  color: #fff;
  height: 80px;
  border-radius: 5px;
  position: relative;
}

.show-num {
  font-size: 38px;
  font-weight: 600;
  padding: 5px;
  display: flex;
  justify-content: center;
}
</style>
