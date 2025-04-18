<template>
    <div class="send-email">
        <h1>Send Email</h1>
        <p>This is the send email page.</p>
        <el-button type="primary" @click="sendEmail">Send Email</el-button>
        <el-dialog :visible.sync="dialogVisible" title="Email Sent">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="打开地址">
                    <el-input v-model="form.sysUrl"></el-input>
                </el-form-item>
                <el-form-item label="主题">
                    <el-input v-model="form.subject"></el-input>
                </el-form-item>

                <el-form-item label="内容">
                    <el-input v-model="form.body"></el-input>
                </el-form-item>

                <el-form-item label="发送人">
                    <el-input v-model="form.sendBy"></el-input>
                </el-form-item>

                <el-form-item label="发送给">
                    <el-select v-model="form.sendto" multiple style="margin-left: 20px; width: 400px;"
                        placeholder="请选择">
                        <el-option v-for="item in sendtoList" :key="item" :label="item"
                            :value="item"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="抄送人">
                    <el-select v-model="form.copyto" multiple style="margin-left: 20px; width: 400px;"
                        placeholder="请选择">
                        <el-option v-for="item in copytoList" :key="item" :label="item"
                            :value="item"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="附件">
                    <el-input v-model="form.filePath"></el-input>
                </el-form-item>


            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: false,
            form: {
                sysUrl: '',
                subject: '',
                body: '',
                sendBy: '',
                sendto: [],
                copyto: [],
                filePath: '',
            },

            sendtoList: [1,2,3,4,5,6,7,8],
            sendByList: [1,2,3,4,5,6,7,8],
            copytoList: [1,2,3,4,5,6,7,8]

        };
    },

    methods: {
        sendEmail() {

        const sendToString = this.form.sendto.join(', ');
            // Simulate sending an email
                this.dialogVisible = true;
        },
    },
};

</script>