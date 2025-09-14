import { ElMessage } from 'element-plus'

export function setupRouterGuard(router) {
  router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('access_token')
    console.log('路由守卫: ', to.name, 'token: ', token)
    
    // 检查路由是否需要认证
    if (to.meta.requiresAuth && !token) {
      console.log('需要认证但无token，重定向到登录页')
      ElMessage.warning('请先登录')
      next('/login')
      return
    }
    
    // 如果已登录但访问登录页，重定向到任务页
    if (to.name === 'Login' && token) {
      console.log('已登录但访问登录页，重定向到任务页')
      next('/tasks')
      return
    }
    
    console.log('正常导航')
    next()
  })
}