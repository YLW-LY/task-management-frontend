import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Tasks from '../components/Tasks.vue'
import { setupRouterGuard } from './guards'
import Admin from '../components/Admin.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: Tasks,
    meta: { requiresAuth: true } // 需要认证
  },

  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true }
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('access_token')
  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}')
  // 如果前往管理员页面，检查是否是管理员
  if (to.path === '/admin') {
    if (!isAuthenticated) {
      next('/login')
      return
    }
    if (userInfo.role !== 'admin') {
      // 不是管理员，重定向到任务页
      next('/tasks')
      return
    }
  }
  
  // 如果用户已登录，不允许访问登录页
  if (to.path === '/login' && isAuthenticated) {
    next('/tasks')
    return
  }
  
  next()
})


setupRouterGuard(router)

export default router