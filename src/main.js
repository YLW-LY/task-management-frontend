import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // 添加这行 - 引入路由配置
import ElementPlus from 'element-plus' // 添加这行 - 引入ElementPlus
import 'element-plus/dist/index.css' // 添加这行 - 引入ElementPlus样式

const app = createApp(App)
app.use(router) // 添加这行 - 使用路由
app.use(ElementPlus) // 添加这行 - 使用ElementPlus
app.mount('#app')