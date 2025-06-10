<template>
    <div>
        sbu
        <el-select v-model="calendarSbu" placeholder="sbu" filterable style="width: 80px;margin-left: 10px;">
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
    </div>

</template>

<script>
export default {
    props: {
        // Pass the list of SBU options from the parent
        sbuOptions: {
            type: Array,
            default: () => []
        },
        // Initial SBU selection for the calendar
        initialSbu: {
            type: [String, Number],
            default: ''
        }
    },
    data() {
        return {
            selectedDate: new Date(),
            calendarSbu: this.initialSbu,
            workDateList: [],
            devices: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => ({ id: i, sbu: i })) // Example data
        };
    },
    watch: {
        calendarSbu(newVal, oldVal) {
            if (newVal !== oldVal) {
                this.getWorkDayList(); // Fetch work days when SBU changes
            }
        }
    },
    created() {
        this.getThRecord(); // Fetch SBU records on component creation
    },
    methods: {
        
        // sbu
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
                const isExisting = this.workDateList.some(wd => wd === d);
                if (!isExisting) {
                    try {
                        await this.addWorkDay(d);
                    } catch (error) {
                        console.error('Failed to add work day:', error);
                    }
                }
            }

            await this.getWorkDayList();
            this.$message.success('Added successfully!');
        },
        flashCalender() {
            try {
                this.getWorkDayList();
                this.$message.success('Refreshed successfully!');
            } catch (error) {
                this.$message.error('Refresh failed!');
                console.error('Error refreshing calendar:', error);
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
                this.workDateList = [...data.map(item => this.formatDate(new Date(item.workDate)))];
            }).catch((error) => {
                console.log('Error fetching work day list:', error);
            });
        },
        formatDate(date) {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
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
        async handleDateClick(date) {
            const dateString = this.formatDate(date);
            const isExisting = this.workDateList.some(d => d === dateString);

            try {
                if (!isExisting) {
                    await this.addWorkDay(dateString);
                    this.$message.success('Added successfully!');
                } else {
                    await this.deleteWorkDay(dateString);
                    this.$message.warning('Deleted successfully!');
                }
                this.getWorkDayList(); // Refresh the list after operation
            } catch (error) {
                console.log('Operation failed', error);
            }
        },
        isWorkDate(date) {
            return this.workDateList.some(workDate => workDate === this.formatDate(date));
        }
    }
};
</script>

<style scoped>
/* You can add specific styles for the calendar component here if needed */
.el-calendar-day {
    cursor: pointer;
}
</style>