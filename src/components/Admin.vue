<template>
  <div class="admin-container">
    <div class="header">
      <h2>用户管理系统</h2>
      <div>
        <el-button @click="$router.push('/tasks')">返回任务</el-button>
        <el-button type="danger" @click="logout">退出登录</el-button>
      </div>
    </div>

    <el-table :data="users" v-loading="loading" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="role" label="角色"></el-table-column>
      <el-table-column prop="created_at" label="创建时间">
        <template #default="scope">
          {{ formatDate(scope.row.created_at) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button size="small" @click="openResetDialog(scope.row)">重置密码</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 重置密码对话框 -->
    <el-dialog v-model="resetDialogVisible" title="重置密码" width="30%">
      <p>正在为用户 <strong>{{ selectedUser?.username }}</strong> 重置密码</p>
      <el-input v-model="newPassword" type="password" placeholder="请输入新密码" show-password></el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmResetPassword">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from "element-plus";
import api from "../services/api";

export default {
  name: 'AdminPage',
  data() {
    return {
      users: [],
      loading: false,
      resetDialogVisible: false,
      selectedUser: null,
      newPassword: ''
    }
  },
  async mounted() {
    // 检查用户权限
    const userInfoStr = localStorage.getItem('user_info')
    if (!userInfoStr) {
      this.$router.push('/login')
      return
    }
    
    const userInfo = JSON.parse(userInfoStr)
    if (userInfo.role !== 'admin') {
      ElMessage.warning('权限不足')
      this.$router.push('/tasks')
      return
    }
    
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      this.loading = true;
      try {
        const response = await api.get('/admin/users');
        this.users = response.data;
      } catch (error) {
        console.error('获取用户列表失败:', error);
        ElMessage.error('获取用户列表失败: ' + (error.response?.data?.detail || error.message));
      } finally {
        this.loading = false;
      }
    },

    openResetDialog(user) {
      this.selectedUser = user;
      this.newPassword = '';
      this.resetDialogVisible = true;
    },

    async confirmResetPassword() {
      if (!this.newPassword) {
        ElMessage.warning('请输入新密码');
        return;
      }
      try {
        await api.put(`/admin/users/${this.selectedUser.id}/reset-password`, null, {
          params: { new_password: this.newPassword }
        });
        ElMessage.success('密码重置成功');
        this.resetDialogVisible = false;
      } catch (error) {
        console.error('重置密码失败:', error);
        ElMessage.error('重置密码失败: ' + (error.response?.data?.detail || error.message));
      }
    },

    async handleDelete(user) {
      try {
        await ElMessageBox.confirm(
          `确认要删除用户 "${user.username}" 吗？此操作不可恢复。`,
          '警告',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
        );
        await api.delete(`/admin/users/${user.id}`);
        ElMessage.success('用户删除成功');
        this.loadUsers(); // 重新加载列表
      } catch (error) {
        if (error !== 'cancel') {
          console.error('删除用户失败:', error);
          ElMessage.error('删除用户失败: ' + (error.response?.data?.detail || error.message));
        }
      }
    },
    
    logout() {
      ElMessageBox.confirm('确定要退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除本地存储的token和用户信息
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_info')
        ElMessage.success('已退出登录')
        // 跳转到登录页
        this.$router.push('/login')
      }).catch(() => {
        // 用户取消退出
      })
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    }
  }
}
</script>

<style scoped>
.admin-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>