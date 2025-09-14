import { createRouter, createWebHistory } from 'vue-router'
import Login from '../components/Login.vue'
import Tasks from '../components/Tasks.vue'
import { setupRouterGuard } from './guards'

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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

setupRouterGuard(router)

export default router