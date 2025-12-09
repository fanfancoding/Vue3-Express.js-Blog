import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'virtual:uno.css'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {translateJsVueUseModel} from './utils/translate' // 多语言切换, 导入translate插件
import App from './App.vue'
import router from './router'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(translateJsVueUseModel)

// 应用启动后验证token
app.mount('#app')

// 应用启动时验证token
const { useUserStore } = await import('@/stores')
const userStore = useUserStore()
userStore.initAuth().catch(console.error)
