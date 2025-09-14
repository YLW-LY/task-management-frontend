import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8000', // 后端 API 地址
  timeout: 10000, // 请求超时时间
})

// 请求拦截器 - 自动添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 统一处理错误
api.interceptors.response.use(
  (response) => {
    // 对响应数据不做任何处理，直接返回
    return response
  },
  (error) => {
    // 如果有响应错误，根据状态码进行处理
    if (error.response?.status === 401) {
      // 401表示未授权，可能是token过期或无效
      ElMessage.error('登录已过期，请重新登录')
      // 移除本地存储中的token
      localStorage.removeItem('access_token')
      // 跳转到登录页面
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else if (error.response?.status === 500) {
      // 500表示服务器内部错误
      ElMessage.error('服务器内部错误，请稍后再试')
    } else if (error.response?.data?.detail) {
      // 如果响应数据中有detail字段，显示该错误信息
      ElMessage.error(error.response.data.detail)
    } else {
      // 其他错误，显示网络错误
      ElMessage.error('网络错误，请检查连接')
    }
    return Promise.reject(error)
  }
)

export default api