<template>
    <div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin: 20px 20px;">
            <div style="display: flex; align-items: center;">
                sbu
                <el-select v-model="calendarSbu" placeholder="sbu" filterable style="width: 80px; margin-left: 10px;">
                    <el-option v-for="device in Array.from(new Set(devices.map(device => device.sbu))).sort()"
                        :key="device" :label="device" :value="device">
                    </el-option>
                </el-select>
                <el-button @click="flashCalender()" style="margin-left: 10px;">刷新日历</el-button>
                <el-button @click="selectWeekDaysOfMonth(selectedDate)" style="margin-left: 10px;">一键勾选当月工作日</el-button>
            </div>
            <el-button-group>
                <el-button @click="goToPreviousWeek">上周</el-button>
                <el-button @click="goToCurrentWeek">当周</el-button>
                <el-button @click="goToNextWeek">下周</el-button>
            </el-button-group>
        </div>

        <el-calendar v-model="selectedDate" @change="handleDateChange" :range="getWeekRange()">
            <template slot="dateCell" slot-scope="{ date, data }">
                <div class="el-calendar-day" @click="handleDateClick(date)" style="text-align:center;">
                    <p> {{ data.day.split('-')[2] }}</p>
                    <div v-for="group in groupIds" :key="group.id" style="margin: 10px;">
                        <template>
                            <div>
                                <span>{{ group.groupName }}</span>
                                <template v-if="isWorkDate(date, group)">
                                    <el-button size="mini" round @click.stop="handleDateClick(date, group)"
                                        type="danger" plain style="margin-left: 8px;">
                                        删除
                                    </el-button>
                                </template>
                                <template v-else>
                                    <el-button size="mini" round @click.stop="handleDateClick(date, group)"
                                        type="success" plain style="margin-left: 8px;">
                                        选择
                                    </el-button>
                                </template>

                            </div>
                        </template>
                    </div>
                </div>
            </template>
        </el-calendar>
    </div>
</template>

<script>
export default {
    data() {
        return {
            weekOffset: 0, // 当前偏移了多少周
            currentDate: new Date(),
            selectedDate: new Date(),
            calendarSbu: 2,
            workDateList: [],
            devices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => ({ id: i, sbu: i })),
            groupIds: [],
            // groupIds: [1, 1, 1, 4, 5, 6, 7, 8, 9, 10].map(i => ({
            //     groupId: crypto.randomUUID(),
            //     // groupName: `Group ${i}`,
            //     groupName: 'B94F-ASSY1',
            //     sbu: i
            // }))
        };
    },
    watch: {
        calendarSbu(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.getWorkDayList(); // Fetch work days when SBU changes
                this.getGroupName();
            }
        }
    },
    created() {
        this.getWorkDayList(); // 初始获取工作日列表
        this.getGroupName(); // Fetch group names if needed
    },
    computed: {

    },
    methods: {
        goToPreviousWeek() {
            this.weekOffset -= 1;
        },
        goToNextWeek() {
            this.weekOffset += 1;
        },
        goToCurrentWeek() {
            this.weekOffset = 0;
            this.selectedDate = new Date(); // 可选：自动跳回今天
        },
        getWeekRange() {
            const now = new Date();
            now.setDate(now.getDate() + this.weekOffset * 7); // 根据偏移调整日期
            const day = now.getDay() || 7; // 把周日从0变成7
            const monday = new Date(now);
            monday.setDate(now.getDate() - day + 1);
            monday.setHours(0, 0, 0, 0);
            const sunday = new Date(monday);
            sunday.setDate(monday.getDate() + 6);
            sunday.setHours(0, 0, 0, 0);
            function formatDate(date) {
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, '0');
                const d = String(date.getDate()).padStart(2, '0');
                return `${y}-${m}-${d}`;
            }

            return [formatDate(monday), formatDate(sunday)];
        },

        getGroupName() {
            this.$http({
                url: this.$http.adornUrl('/extProject/getGroupNameList'),
                method: 'get',
                params: {
                    sbu: this.calendarSbu, // 使用当前选中的sbu
                },
            }).then((response) => {
                const data = response.data.data;
                this.groupIds = data
                // this.groupIds = data.map(item => ({
                //     groupId: item.groupId,
                //     groupName: item.groupName,
                //     sbu: item.sub
                // }));
                console.log('Group Names:', this.groupIds);

            }).catch((error) => {
                console.log('Error:', error);
            });
        },

        handleDateChange(date) {
            this.selectedDate = date; // Update the selected date
        },
        async selectWeekDaysOfMonth(date) {
            const currentMonth = date.getMonth();
            const currentYear = date.getFullYear();
            const targetMonth = currentMonth;
            const firstDayOfMonth = new Date(currentYear, targetMonth, 1);
            const lastDayOfMonth = new Date(currentYear, targetMonth + 1, 0);
            let currentDateIter = new Date(firstDayOfMonth);
            const workDays = [];
            while (currentDateIter <= lastDayOfMonth) {
                const dayOfWeek = currentDateIter.getDay();
                if (dayOfWeek >= 1 && dayOfWeek <= 5) { // Monday to Friday
                    const formattedDate = this.formatDate(currentDateIter);
                    workDays.push(formattedDate);
                }
                currentDateIter.setDate(currentDateIter.getDate() + 1);
            }
            for (const d of workDays) {
                for (const group of this.groupIds) {
                    try {
                        await this.addWorkDay(d, group);
                    } catch (error) {
                        console.error('Failed to add work day:', error);
                    }
                }
            }
            await this.getWorkDayList();
            this.$message.success('Added successfully!');
        },

        // 刷新日历
        flashCalender() {
            try {
                this.getWorkDayList();
                this.$message.success('Refreshed successfully!');
            } catch (error) {
                this.$message.error('Refresh failed!');
                console.error('Error refreshing calendar:', error);
            }
        },
        // 获取工作日列表
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
                this.workDateList = data.map(item => ({
                    workDate: this.formatDate(new Date(item.workDate)),
                    groupName: item.groupName,
                    sbu: item.sbu,
                }));
            }).catch((error) => {
                console.log('Error fetching work day list:', error);
            });
        },
        // 格式化日期为 YYYY-MM-DD
        formatDate(date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}-${month}-${day}`;
        },
        // 添加工作日
        addWorkDay(date, group) {
            const params = {
                workDay: date,
                sbu: group.sbu,
                groupName: group.groupName,
            };
            return new Promise((resolve, reject) => {
                this.$http({
                    url: this.$http.adornUrl('/extProject/addWorkDay'),
                    method: 'get',
                    params: params,
                }).then((response) => {
                    const data = response.data.data;
                    if (data) {
                        resolve(data);
                    } else {
                        this.$message.error('Failed to add!');
                        reject('Failed to add!');
                    }
                }).catch((error) => {
                    console.log('Error adding work day:', error);
                    reject(error);
                });
            });
        },
        deleteWorkDay(date, group) {
            const params = {
                workDay: date,
                sbu: this.calendarSbu,
                groupName: group.groupName,
            };
            return new Promise((resolve, reject) => {
                this.$http({
                    url: this.$http.adornUrl('/extProject/deleteWorkDay'),
                    method: 'get',
                    params: params,
                }).then((response) => {
                    const data = response.data.data;
                    if (data) {
                        resolve(data);
                    } else {
                        this.$message.error('Failed to delete!');
                        reject('Failed to delete!');
                    }
                }).catch((error) => {
                    console.log('Error deleting work day:', error);
                    reject(error);
                });
            });
        },
        async handleDateClick(date, group) {
            const dateString = this.formatDate(date);
            const isExisting = this.workDateList.some(d => d.workDate === dateString && d.groupName === group.groupName);
            try {
                if (!isExisting) {
                    await this.addWorkDay(dateString, group);
                    this.$message.success('Added successfully!');
                } else {
                    await this.deleteWorkDay(dateString, group);
                    this.$message.warning('Deleted successfully!');
                }
                this.getWorkDayList(); // Refresh the list after operation
            } catch (error) {
                console.log('Operation failed', error);
            }
        },
        isWorkDate(date, group) {
            console.log('Checking work date:', date, group);
            if (group === undefined) {
                console.error('Group is undefined, cannot check work date.');
                return false;
            }
            return this.workDateList.some(workDate => workDate && workDate.workDate === this.formatDate(date) && workDate.groupName === group.groupName);
        }
    }
};
</script>

<style>
/* You can add specific styles for the calendar component here if needed */
.el-calendar-day {
    cursor: pointer;
}

.el-calendar-table .el-calendar-day {
    height: auto !important;
    /* 去掉固定高度 */
    overflow: visible;
    /* 让内容完全显示 */
}
</style>