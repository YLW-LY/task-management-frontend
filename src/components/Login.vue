<template>
    <div class="login-container">
        <el-card class="login-card">
            <h2>任务管理系统登录</h2>
            <el-form :model="form" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                    <!--placeholder	输入框占位文本-->
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
                    <!--type	类型-- password 密码-->
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
                    <!--type	按钮类型-- primary 主要按钮-->
                </el-form-item>
                <p class="register-link">
                    还没有账号？
                    <a @click="showRegister = true" href="#">立即注册</a>
                </p>
            </el-form>


                <!--注册对话框-->
            <el-dialog v-model="showRegister" title="用户注册" width="30%">
                <el-form :model="registerForm" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input v-model="registerForm.username"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input v-model="registerForm.password" type="password"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleRegister" style="width:100%">注册</el-button>
                        <el-button @click="showRegister = false">取消</el-button>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { ElMessage } from "element-plus";
import api from "../services/api"

export default{
    name:"Login",
    data(){
        return{
            // 登录表单数据
            form:{
                username:"",
                password:""
                },
            // 注册表单数据
            registerForm:{
                username:"",
                password:""
                },
            // 控制注册弹窗显示
            showRegister:false
        }
    },
    created() {
      // 检查是否已登录，如果已登录则跳转到任务页
      const token = localStorage.getItem('access_token')
      if (token) {
        this.$router.push('/tasks')
      }
    },
    methods:{
        // 登录处理方法
        async handleLogin(){
            try{
                // 发送登录请求
                const formData =  new FormData(); 
                formData.append('username',this.form.username);
                formData.append('password',this.form.password);

                const response = await api.post('/login',formData)

                // 保存token到本地存储
                localStorage.setItem('access_token', response.data.access_token)

                ElMessage.success('登录成功')

                // 跳转到任务列表页面
                this.$router.push('/tasks')
            }catch(error){
                // 登录失败提示
                console.error('登录失败',error)
                ElMessage.error('登录失败: ' + (error.response?.data?.detail || '请检查用户名和密码'))
            }
        },
        // 注册处理方法
        async handleRegister(){
            try{
                // 发送注册请求
                await api.post('/register/',{
                    username:this.registerForm.username,
                    password: this.registerForm.password,
                })


                ElMessage.success('注册成功，请登录')
                this.showRegister = false
                // 重置注册表单
                this.registerForm={username:"",password:""}
            }catch(error){
                // 注册失败提示
                console.error('登录失败',error)
            }
        }
    }
}


</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
  padding: 20px;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}
</style>

                    