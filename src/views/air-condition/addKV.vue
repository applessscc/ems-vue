<template>
  <div>

    <div class="logo-container">
      <span class="logo-text">VTech 温区配置</span>
    </div>

    <div>
      <div class="workCalendarButton">
        <el-button @click="workCalendar()"><i class="el-icon-date"></i> 工作日历</el-button>
        <!-- <el-button @click="openNewWindow()"><i class="el-icon-date"></i> 温区看板</el-button> -->

      </div>

      <el-dialog :visible.sync="workCalendarDigStatus" width="40%">
        sbu<el-select v-model="calendarSbu" placeholder="sbu" filterable style="width: 80px;margin-left: 10px;">
          <el-option v-for="device in Array.from(new Set(devices.map(device => device.sbu))).sort()" :key="device"
            :label="device" :value="device">
          </el-option>
        </el-select>
        <el-button @click="flashCalender()" style="margin-left: 10px;">刷新日历</el-button>
        <el-button @click="selectWeekDaysOfMonth(selectedDate)">一键勾选当月工作日</el-button>

        <el-calendar v-model="selectedDate" @change="handleDateChange">
          <template slot="dateCell" slot-scope="{ date, data }">
            <div class="el-calendar-day" @click="handleDateClick(date)">
              <p>

                {{ data.day.split('-')[2] }}{{ isWorkDate(date) ? '✔️' : '' }}
              </p>
            </div>
          </template>
        </el-calendar>

      </el-dialog>
    </div>



    <div class="form-container">
      <el-form :model="form" label-width="60px" :inline="true">

        <el-form-item label="温区">
          <el-select v-model="groupId" placeholder="已添加的温区" style="width: 150px" clearable>
            <el-option v-for="groupId in groupIds" :key="groupId.groupId" :label="groupId.groupName"
              :value="groupId.groupId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="sbu">
          <el-select v-model="form.sbu" placeholder="sbu" filterable style="width: 80px">
            <el-option v-for="device in Array.from(new Set(devices.map(device => device.sbu))).sort()" :key="device"
              :label="device" :value="device">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="ID">
          <el-select v-model="form.id" placeholder="请选择设备" clearable filterable style="width: 170px"
            :disabled="!form.sbu">
            <el-option v-for="device in devices.filter(device => device.sbu === form.sbu)" :key="device.id"
              :label="device.id" :value="device.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="温度系数" label-width="100px">
          <el-input v-model="form.coefficient" style="width: 100px" placeholder="温度系数"
            @input="validateNumber('coefficient')"></el-input>
        </el-form-item>

        <el-form-item label="湿度系数" label-width="100px">
          <el-input v-model="form.coefficientH" style="width: 100px" placeholder="湿度系数"
            @input="validateNumber('coefficientH')"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit" plain>添加</el-button>
          <el-button type="danger" @click="clean" plain>一键清空</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="table-container">
      <el-table :data="tableData" border style="width: 100%" :max-height="420" :key="tableData.length">
        <el-table-column prop="sbu" label="sbu" width="100px" align="center"></el-table-column>
        <el-table-column prop="eqid" label="设备ID" width="240px" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <a :href="'http://10.97.245.114/sbu2/th-record/TH-dashboard-Report.php?ID=' + scope.row.eqid" target="_blank"
              :style="{
                color: scope.row.isOnline === 'true' ? '#409EFF' : '#F56C6C',
                textDecoration: 'none'
              }" @mouseover="e => e.target.style.textDecoration = 'underline'"
              @mouseout="e => e.target.style.textDecoration = 'none'">
              {{ scope.row.isOnline === 'true' ? scope.row.eqid : scope.row.eqid + '（离线）' }}
            </a>
          </template>
        </el-table-column>

        <el-table-column prop="t" label="实时温度" width="100px" align="center"></el-table-column>
        <!-- <el-table-column label="温度系数" width="100px" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.coefficient" size="mini" @input="updateTemperature(scope.row)" />
          </template>
        </el-table-column> -->

        <el-table-column prop="coefficient" label="温度系数" width="100px" align="center"></el-table-column>
        <el-table-column label="换算后的温度" width="120px" align="center">
          <template slot-scope="scope">
            {{ scope.row.t ? (scope.row.t * scope.row.coefficient).toFixed(2) : '' }}
          </template>
        </el-table-column>


        <el-table-column prop="h" label="实时湿度" width="100px" align="center"></el-table-column>

        <!-- <el-table-column label="湿度系数" width="100px" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.coefficientH" size="mini" @input="updateHumidity(scope.row)" />
          </template>
        </el-table-column> -->

        <el-table-column prop="coefficientH" label="温度系数" width="100px" align="center"></el-table-column>
        <el-table-column label="换算后的温度" width="120px" align="center">
          <template slot-scope="scope">
            {{ scope.row.h ? (scope.row.h * scope.row.coefficientH).toFixed(2) : '' }}
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="deleteRow(scope.$index)" type="danger" size="mini" plain>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="form-buttom-container">
      <el-form :inline="true" class="demo-form-inline" :rules="rules" ref="form" v-model="form">

        <el-row>
          <el-col :span="6">
            <el-form-item label="温区实时温度" v-if="tableData.length != 0">
              <el-tag type="success" @click.stop="openNewWindow()">{{ calculateAverageTemperature() }}C° </el-tag>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="温区实时湿度" v-if="tableData.length != 0">
              <el-tag type="success" @click.stop="openNewWindow()">{{ calculateAverageHumidity() }}%</el-tag>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="预期温度">
              <el-input v-model="form.expMinTem" placeholder="min" style="display: inline-block; width: 70px;"
                @input="validateNumber('expMinTem')"></el-input>
              <span style="display: inline-block; vertical-align: top;">C°</span>
              <span style="display: inline-block; vertical-align: top; margin-inline: 10px;">-</span>
              <el-input v-model="form.expMaxTem" placeholder="max" style="display: inline-block; width: 70px;"
                @input="validateNumber('expMaxTem')"></el-input>
              <span style="display: inline-block; vertical-align: top;">C°</span>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="预期湿度">
              <el-input v-model="form.expMinH" placeholder="min" style="display: inline-block; width: 70px;"
                @input="validateNumber('expMinH')"></el-input>
              <span style="display: inline-block; vertical-align: top;">%</span>
              <span style="display: inline-block; vertical-align: top; margin-inline: 10px;">-</span>
              <el-input v-model="form.expMaxH" placeholder="max" style="display: inline-block; width: 70px;"
                @input="validateNumber('expMaxH')"></el-input>
              <span style="display: inline-block; vertical-align: top;">%</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="温区sbu">

              <el-select v-model="form.groupSbu" placeholder="温区sbu" filterable style="width: 120px">
                <el-option v-for="device in Array.from(new Set(devices.map(device => device.sbu))).sort()" :key="device"
                  :label="device" :value="device">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="温区名称">
              <el-input v-model="form.groupName" style="width: 170px" placeholder="groupName"></el-input>
            </el-form-item>
          </el-col>


          <el-col :span="8">
            <el-form-item label="空调设备">
              <el-select v-model="form.appGroup.appId" placeholder="请选择设备" clearable filterable style="width: 170px">
                <el-option v-for="airDevice in airDevices" :key="airDevice.appId" :label="airDevice.name"
                  :value="airDevice.appId">
                </el-option>
              </el-select>
              <!-- <el-input  v-model="form.appGroup.appId" style="width: 200px" placeholder="空调设备ID"></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 早上 -->
        <el-row>
          <el-col :span="8">
            <el-form-item label="早班">
              <el-time-select placeholder="起始时间" v-model="form.mStartTime" :picker-options="{
                start: '08:00',
                step: '00:15',
                end: '12:15'
              }" style="width: 120px;"></el-time-select>
              <el-time-select placeholder="结束时间" v-model="form.mEndTime" :picker-options="{
                start: '08:00',
                step: '00:15',
                end: '12:15',
                minTime: form.mStartTime
              }" style="width: 120px;"></el-time-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="午班">
              <el-time-select placeholder="起始时间" v-model="form.aStartTime" :picker-options="{
                start: '13:00',
                step: '00:15',
                end: '18:00'
              }" style="width: 120px;"></el-time-select>
              <el-time-select placeholder="结束时间" v-model="form.aEndTime" :picker-options="{
                start: '13:00',
                step: '00:15',
                end: '18:00',
                minTime: form.aStartTime
              }" style="width: 120px;"></el-time-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="晚班">
              <el-time-select placeholder="起始时间" v-model="form.eStartTime" :picker-options="{
                start: '18:00',
                step: '00:15',
                end: '22:00'
              }" style="width: 120px;"></el-time-select>
              <el-time-select placeholder="结束时间" v-model="form.eEndTime" :picker-options="{
                start: '18:00',
                step: '00:15',
                end: '22:00',
                minTime: form.eStartTime
              }" style="width: 120px;"></el-time-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div class="table-submit-container">
      <el-button type="success" @click="onSubmitTable" plain round size="medium " v-if="groupId == ''">新增温区</el-button>
      <el-button type="warning" @click="onSubmitTable" plain round size="medium "
        v-if="groupId != '' && tableData.length != 0">确认修改温区</el-button>
      <el-button type="danger" @click="onSubmitTable" plain round size="medium "
        v-if="groupId != '' && tableData.length == 0">确认删除温区</el-button>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      offlineDevice: [],
      selectedDate: new Date(),
      calendarSbu: 2,
      workDateList: [
      ],
      workCalendarDigStatus: false,
      rules: {
        groupName: [
          { required: true, message: '请输入温区名称', trigger: 'blur' }
        ]

      },
      groupId: '',
      devices: [],
      airDevices: [],
      groupIds: [],
      sbu: [],
      tableData: [
      ],
      form: {
        groupName: '',
        groupSbu: '',
        areaName: '',
        expMinTem: '',
        expMaxTem: '',
        coefficient: '',
        coefficientH: '',
        sbu: '',
        id: '',
        t: '',
        h: '',
        mStartTime: '',
        mEndTime: '',
        aStartTime: '',
        aEndTime: '',
        eStartTime: '',
        eEndTime: '',
        coefficientT: '',
        appGroup: {
          appId: ''
        }
      }
    };
  },

  watch: {

    "calendarSbu"(n, o) {
      if (n !== o) {
        this.getWorkDayList();
      }
    },
    "form.sbu"(n, o) {
      if (n !== o) {
        this.form.id = '';
      }
    },

    "groupId"(n, o) {
      if (n !== o) {
        if (n != '') {
          this.getThKvRecord();
        } else {
          this.clean();
        }
      }
    }



  },
  created() {
    this.getAppInfoList();
    this.getThRecord();
    this.getThKvRecordGroups();
    this.getWorkDayList();
    this.getExceptionThKvRecord()

    // saveVisitLog('温度系数比值');
  },
  mounted() {
    this.intervalId = setInterval(() => {
      this.getExceptionThKvRecord()
    }, 20000);
  },
  methods: {
    openNewWindow() {
      const url = this.$router.resolve({ name: 'air-condition' , query: { groupId: this.groupId }}).href;
      window.open(url, '_blank');  // 在新窗口打开链接
    },
    send() {
      const params = {
        sysUrl: 'http://10.97.245.114/XX/login.html', // 系统入口链接, 可不传
        subject: "您有重要邮件通知待处理", // 邮件主题
        body: "Dear Boss,\n这是测试发送邮件内容,\n请尽快处理, 期待您的回复, 谢谢!\n\n\n", // 邮件内容
        sendBy: "PIGER WAY", // 发件人
        sendto: "PIGER WAY,YABING XIE", // 收件人, 多人英文的逗号隔开
        copyto: "ERIC WAI", // 抄送人, 多人英文的逗号隔开
        filePath: "" // 附件服务器磁盘的绝对路径, 可不传
      };

      this.$http({
        url: 'http://10.97.245.114/lsmSystem/sendEmail.do',
        method: 'get',
        params: params,
        withCredentials: true
      }).then((response) => {
        if (response.data.code !== "0") {
          console.info("发送失败: " + response.data.msg);
        } else {
          alert("发送成功");
        }
      }).catch((error) => {
        console.info("错误: ", error);
      });
    }
    ,
    handleDateChange(date) {
      this.selectedDate = date;  // 更新选中的日期
    },
    async selectWeekDaysOfMonth(date) {
      const currentMonth = date.getMonth();  // 获取当前日期的月份
      const currentYear = date.getFullYear();  // 获取当前日期的年份

      const targetMonth = currentMonth;  // 默认是当前月
      const firstDayOfMonth = new Date(currentYear, targetMonth, 1);  // 获取目标月的第一天
      const lastDayOfMonth = new Date(currentYear, targetMonth + 1, 0);  // 获取目标月的最后一天

      let currentDateIter = new Date(firstDayOfMonth);
      const workDays = [];

      // 获取目标月的所有周一到周五日期
      while (currentDateIter <= lastDayOfMonth) {
        const dayOfWeek = currentDateIter.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {  // 周一到周五
          const formattedDate = this.formatDate(currentDateIter);
          workDays.push(formattedDate);
        }
        currentDateIter.setDate(currentDateIter.getDate() + 1);
      }

      // 使用 for...of 保证异步操作顺序执行
      for (const date of workDays) {
        const isExisting = this.workDateList.some(d => d === date);
        if (!isExisting) {
          try {
            await this.addWorkDay(date);  // 添加工作日
          } catch (error) {
            console.error('添加工作日失败:', error);
          }
        }
      }

      // 所有添加工作日操作完成后，再刷新日期列表
      await this.getWorkDayList();

      // 发送成功消息
      this.$message.success('添加成功');
    },


    updateTemperature(row) {
      // 强制 Vue 更新表格中的数据
      this.$forceUpdate();
    },

    updateHumidity(row) {
      // 强制 Vue 更新表格中的数据
      this.$forceUpdate();
    },

    flashCalender() {
      try {
        this.getWorkDayList();
        this.$message.success('刷新成功！');
      } catch (error) {
        this.$message.error('刷新失败！');
        console.error('Error setting selected date:', error);
      }
    },
    getWorkDayList() {
      const params = {
        sbu: this.calendarSbu,
      };
      this.$http({
        url: this.$http.adornUrl('/extProject/getWorkDayList'),
        method: 'get',
        params: params,
      }).then((response) => {
        const data = response.data.data;
        // 使用 item.workDate，并格式化为 "yyyy-MM-dd"
        // this.workDateList = data.map(item => this.formatDate(new Date(item.workDate)));
        this.workDateList = [...data.map(item => this.formatDate(new Date(item.workDate)))];
        console.log('workDateList', this.workDateList);
      }).catch((error) => {
        console.log('error', error);
      });
    },

    formatDate(date) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 月份从 0 开始，所以需要加 1
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    addWorkDay(date) {
      const params = {
        workDay: date,
        sbu: this.calendarSbu,

      };
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/extProject/addWorkDay'),
          method: 'get',
          params: params,
        }).then((response) => {
          const data = response.data.data;
          if (data) {
            // this.$message.success('添加成功');
            resolve(data);  // 成功时调用 resolve
          } else {
            this.$message.error('添加失败');
            reject('添加失败');  // 失败时调用 reject
          }
        }).catch((error) => {
          console.log('error', error);
          reject(error);  // 出现异常时调用 reject
        });
      });
    },
    deleteWorkDay(date) {
      const params = {
        workDay: date,
        sbu: this.calendarSbu,
      };
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/extProject/deleteWorkDay'),
          method: 'get',
          params: params,
        }).then((response) => {
          const data = response.data.data;
          if (data) {
            // this.$message.success('删除成功');
            resolve(data);  // 成功时调用 resolve
          } else {
            this.$message.error('删除失败');
            reject('删除失败');  // 失败时调用 reject
          }
        }).catch((error) => {
          console.log('error', error);
          reject(error);  // 出现异常时调用 reject
        });
      });
    }
    ,
    async handleDateClick(date) {
      const dateString = this.formatDate(date);
      const isExisting = this.workDateList.some(d => d === dateString);

      console.log('handleDateClick', dateString);

      try {
        if (!isExisting) {
          await this.addWorkDay(dateString);  // 等待添加工作日操作完成
          this.$message.success('添加成功！');
        } else {
          await this.deleteWorkDay(dateString);  // 等待删除工作日操作完成
          this.$message.warning('删除成功！');
        }

        this.getWorkDayList();  // 在操作完成后调用获取工作日列表
      } catch (error) {
        console.log('操作失败', error);
      }
    },


    isWorkDate(date) {
      // console.log(this.formatDate(date), this.workDateList.some(workDate => {
      //   return workDate === this.formatDate(date)
      // }));
      return this.workDateList.some(workDate => {
        return workDate === this.formatDate(date)
      });
    }
    ,
    workCalendar() {
      this.workCalendarDigStatus = true;
    },
    calculateAverageTemperature() {
      const totalConvertedTemperature = this.tableData.reduce((acc, row) => {
        if (row.t && !isNaN(Number(row.t))) {
          acc += Number(row.t * row.coefficient);  // 将 row.h 转换为数字后累加
        } else {
          console.warn("Invalid row.h value:", row.t);  // 输出无效的值
        }
        return acc;
      }, 0);

      // const count = this.tableData.length;
      const count = this.tableData.filter(row => row.t && row.t != 0).length;

      return count > 0 ? (totalConvertedTemperature / count).toFixed(2) : '';
    },

    calculateAverageHumidity() {
      const totalHumidity = this.tableData.reduce((acc, row) => {
        // 确保 row.h 是有效的数字字符串
        if (row.h && !isNaN(Number(row.h))) {
          acc += Number(row.h * row.coefficientH);  // 将 row.h 转换为数字后累加
        } else {
          console.warn("Invalid row.h value:", row.h);  // 输出无效的值
        }
        return acc;
      }, 0);
      // const count = this.tableData.length;
      const count = this.tableData.filter(row => row.h && row.h != 0).length;
      return count > 0 ? (totalHumidity / count).toFixed(2) : '';
    }
    ,


    validateNumber(field) {
      this.form[field] = this.form[field].replace(/[^0-9.]/g, ''); // Allow only numbers and decimal points
    },
    clean() {
      this.groupId = '';
      this.tableData = [];
      this.form = {
        groupSbu: '',
        expMinTem: '',
        expMaxTem: '',
        expMinH: '',
        expMaxH: '',
        coefficient: '',
        coefficientH: '',
        groupName: '',
        sbu: '',
        id: '',
        coefficientT: '',
        mStartTime: '',
        mEndTime: '',
        aStartTime: '',
        aEndTime: '',
        eStartTime: '',
        eEndTime: '',
        appGroup: {
          appId: ''
        }
      };
    },
    onSubmitTable() {
      if (this.tableData.length == 0 && this.groupId == '') {
        this.$message.wa('请添加数据');
        return;
      }
      if (this.form.groupName == '') {
        this.$message.error('请填写组名称');
        return;
      }
      const data = {
        userId: this.$store.state.user.id,
        groupId: this.groupId,
        tableData: this.tableData,
        expMaxTem: this.form.expMaxTem,
        expMinTem: this.form.expMinTem,
        expMaxH: this.form.expMaxH,
        expMinH: this.form.expMinH,
        groupName: this.form.groupName,
        groupSbu: this.form.groupSbu,
        appId: this.form.appGroup.appId,
        mStartTime: this.form.mStartTime,
        mEndTime: this.form.mEndTime,
        aStartTime: this.form.aStartTime,
        aEndTime: this.form.aEndTime,
        eStartTime: this.form.eStartTime,
        eEndTime: this.form.eEndTime,
      };
      console.log("data", data);
      this.$http({
        url: this.$http.adornUrl('/extProject/addKV'),
        method: 'post',
        data: data,
      }).then((response) => {
        if (response.data.data == false) {
          this.$message({
            message: '温区名称重复！',
            type: 'warning',
            duration: 2000
          });
          return;
        }
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 2000
        });
        this.clean();
        this.getThKvRecordGroups();
        if (this.groupId != '') {
          this.getThKvRecord();
        }
      }).catch((error) => {
        console.log('error', error);
      });
    },
    getThRecord() {
      const params = {
      };
      this.$http({
        url: this.$http.adornUrl('/extProject/getThRecord'),
        method: 'get',
        params: params,
      }).then((response) => {
        const data = response.data.data;
        if (data) {
          this.devices = data.map(item => ({
            id: item.id,
            sbu: item.sbu,
          }));
        }
      }).catch((error) => {
        console.log('error', error);
      });
    },


    getAppInfoList() {
      const params = {
      };
      this.$http({
        url: this.$http.adornUrl('/extProject/getAppInfoList'),
        method: 'get',
        params: params,
      }).then((response) => {
        const data = response.data.data;
        if (data) {
          this.airDevices = data.map(item => ({
            appId: item.appId,
            name: item.name,
          }));
        }
      }).catch((error) => {
        console.log('error', error);
      });
    },

    getThRecord2(eqid) {
      const params = { eqid: eqid };
      return new Promise((resolve, reject) => {
        this.$http({
          url: this.$http.adornUrl('/extProject/getThRecord2'),
          method: 'get',
          params: params,
        })
          .then((response) => {
            const data = response.data.data;
            console.log("response", data);
            resolve(data);  // Resolve the promise with the data
          })
          .catch((error) => {
            console.log('error', error);
            reject(error);  // Reject the promise with the error
          });
      });
    },



    getThKvRecordGroups() {
      const params = {
      };

      this.$http({
        url: this.$http.adornUrl('/extProject/getThKvRecord'),
        method: 'post',
        data: params,
      }).then((response) => {
        const data = response.data.data;

        this.groupIds = data.map(item => ({
          groupId: item.groupId,
          groupName: item.groupName
        }));

        this.groupIds = [...new Map(this.groupIds.map(item => [item.groupId, item])).values()];

      }).catch((error) => {
        console.log('Error:', error);
      });
    },


    getThKvRecord() {
      const params = {
        groupId: this.groupId
      };

      this.$http({
        url: this.$http.adornUrl('/extProject/getThKvRecord'),
        method: 'post',
        data: params,
      }).then((response) => {
        const data = response.data.data;
        this.tableData = data
        this.form.sbu = data[0].sbu;
        this.form.expMaxTem = data[0].expMaxTem;
        this.form.expMinTem = data[0].expMinTem;
        this.form.expMaxH = data[0].expMaxH;
        this.form.expMinH = data[0].expMinH;
        this.form.groupName = data[0].groupName;
        this.form.groupSbu = data[0].groupSbu;
        this.form.coefficientT = data[0].coefficientT;
        this.form.mStartTime = data[0].mStartTime;
        this.form.mEndTime = data[0].mEndTime;
        this.form.aStartTime = data[0].aStartTime;
        this.form.aEndTime = data[0].aEndTime;
        this.form.eStartTime = data[0].eStartTime;
        this.form.eEndTime = data[0].eEndTime;
        this.form.appGroup = data[0].appGroup;
      }).catch((error) => {
        console.log('Error:', error);
      });
    },



    async onSubmit() {
      if (!this.form.coefficientH || !this.form.coefficient || !this.form.sbu || !this.form.id) {
        this.$message.error('请填写完整的表单数据');
        return;
      }
      const data = await this.getThRecord2(this.form.id);
      this.tableData.push({
        sbu: this.form.sbu,
        eqid: this.form.id,
        id: this.form.id,
        t: data.t,
        h: data.h,
        coefficient: this.form.coefficient,
        coefficientH: this.form.coefficientH,
        isOnline: data.isOnline,
      });
      // 延迟操作，确保表格渲染完成后再执行其他操作
      this.$nextTick(() => {
        this.$message.success('数据已成功添加');
      });

      this.getThKvRecordGroups();

    },
    deleteRow(index) {
      this.tableData.splice(index, 1);
      this.$message.success('数据已成功删除');
    },
    getExceptionThKvRecord() {
      this.$http({
        url: this.$http.adornUrl('/extProject/getExceptionThKvRecord'),
        method: 'get',
        params: {

        },
      }).then((response) => {
        response.data.data.filter(row => row.isOnline == "false").forEach(element => {
          console.log("!offlineDevice.some(device => device.eqid === element.eqid)", !this.offlineDevice.some(device => device.eqid === element.eqid));
          if (!this.offlineDevice.some(device => device.eqid === element.eqid)) {
            this.offlineDevice.push(element);
            this.$notify.error({
              dangerouslyUseHTMLString: true,  // 允许解析 HTML 字符串
              title: '设备离线通知',
              message: 
              "温区：" + element.groupName + "<br>" + 
              "设备：" + element.eqid+"<br>" + 
              "最后一次上线时间：" + element.lastTime

              ,
              duration: 0,
              onClose: () => {
                this.offlineDevice = this.offlineDevice.filter(device => device.eqid !== element.eqid);
              }
            });
          }
        });

      }).catch((error) => {
        console.error('Error fetching table data:', error);
      });
    },
  }

}
</script>

<style scoped>
.logo-container {
  text-align: center;
  margin-top: 50px;
  margin-bottom: 20px;
}

.logo-text {
  font-size: 50px;
  font-weight: bold;
  color: #4ec6fd;
  font-family: "Arial", sans-serif;
  display: inline-block;
  font-style: italic;
}

.form-container {
  text-align: center;
  width: 100%;
  margin: 20px auto;
}

.table-container {
  max-width: 60%;
  margin: 20px auto;
}

.table-submit-container {
  text-align: center;
  /* 使容器中的内容水平居中 */
  margin: 20px auto;
}

.form-buttom-container {
  text-align: center;
  width: 50%;
  margin: 20px auto;
  margin-top: 40px;


}

.el-row {
  display: flex;
  justify-content: center;
  /* 水平居中 */
  align-items: center;
  /* 垂直居中 */
}

.el-col {
  display: flex;
  justify-content: center;
  /* 居中列内的内容 */
}

.workCalendarButton {
  text-align: left;
  margin-left: 40px;
}
</style>
