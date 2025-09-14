<template>
  <div class="tasks-container">
    <div class="header">
      <h2>任务管理</h2>
      <el-button type="danger" @click="logout">退出登录</el-button>
    </div>
    <el-button 
      type="primary" 
      @click="showDialog = true" 
      class="add-btn"
      :loading="loading"
    >
      添加任务
    </el-button>

    <el-table :data="tasks" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="60"></el-table-column>
      <el-form :model="currentTask" :rules="formRules">
        <el-form-item label="任务标题" prop="title">
            <el-input v-model="currentTask.title"></el-input>
        </el-form-item>
      </el-form>
      <el-table-column prop="description" label="任务描述"></el-table-column>
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="editTask(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteTask(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑任务对话框 -->
    <el-dialog v-model="showDialog" :title="isEditing ? '编辑任务' : '添加任务'">
      <el-form :model="currentTask">
        <el-form-item label="任务标题">
          <el-input v-model="currentTask.title"></el-input>
        </el-form-item>
        <el-form-item label="任务描述"> 
          <el-input v-model="currentTask.description" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="saveTask">保存</el-button> 
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import api from "../services/api";

export default {
  name: 'TasksPage',
  data() {
    return {
      tasks: [],
      loading: false,
      showDialog: false,
      isEditing: false,
      currentTask: {
        id: null,
        title: '',
        description: '',
        
      }
    }
  },
  async mounted() {
    await this.loadTasks();
  },
  methods: {
    async loadTasks() {
      try {
        const response = await api.get('/tasks/') 
        this.tasks = response.data;
      } catch(error) {
        console.error('获取任务失败:', error)
      }
    },
    
    editTask(task) {
      this.currentTask = {...task};
      this.isEditing = true;
      this.showDialog = true;
    },
    
    async loadTasks() {
      this.loading = true
      try {
        const response = await api.get('/tasks/')
        this.tasks = response.data
      } catch(error) {
        console.error('获取任务失败:', error)
        ElMessage.error('获取任务失败')
      } finally {
        this.loading = false
      }
    },


    async saveTask() {
      try {
        if(this.isEditing) {
          await api.put(`/tasks/${this.currentTask.id}`, this.currentTask)
          ElMessage.success('更新成功！')
        } else {
          await api.post('/tasks/', this.currentTask) 
          ElMessage.success('任务添加成功！')
        }
        this.showDialog = false;
        this.resetCurrentTask();
        await this.loadTasks();
      } catch(error) {
        console.error('操作失败:', error)
      }
    },
    
    async deleteTask(id) {
      try {
        
        await ElMessageBox.confirm('确定要删除这个任务吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        await api.delete(`/tasks/${id}`)
        ElMessage.success('删除成功！')
        await this.loadTasks()
      } catch(error) {
        if(error !== 'cancel') {
          console.error('删除失败:', error)
        }
      }
    },
    logout() {
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除本地存储的token
        localStorage.removeItem('access_token')
        ElMessage.success('已退出登录')
        // 跳转到登录页
        this.$router.push('/login')
      }).catch(() => {
        // 用户取消退出
      })
    },

    async handleLogin() {
        try {
            // API调用
        } catch(error) {
            const errorMessage = error.response?.data?.detail || '操作失败，请稍后重试'
            ElMessage.error(errorMessage)
            console.error('操作失败详情:', error)
        }
    },
    
    
    resetCurrentTask() { 
      this.currentTask = {
        id: null,
        title: '',
        description: ''
      }
      this.isEditing = false
    }
    
  }
}
</script>

<style scoped>
.tasks-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.add-btn {
  margin-bottom: 20px;
}
</style>