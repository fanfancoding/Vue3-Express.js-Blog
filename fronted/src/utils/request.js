import { useUserStore } from '@/stores'
import axios from 'axios'
import router from '@/router'

import { ElLoading } from 'element-plus'
import { responseTypeMap } from '@/enum/index.js'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
})

// 创建一个loading实例的引用
let loadingInstance = null

request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    config.headers['Authorization_Token'] = userStore.token
    config.headers['Content-Type'] = responseTypeMap.get(config.responseType || 'json')
    
    // 开启loading
    loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
    })
    
    if (request.isParams) {
      config.params = config.data
      delete config.data
    }
    return config
  },
  (error) => {
    // 关闭loading
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    // 关闭loading
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
    
    const userStore = useUserStore()
    const { token } = response.data
    if (token) {
      userStore.setToken(token)
    }
    return response
  },
  (error) => {
    // 关闭loading
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }
    
    // 处理错误
    if (error.response && error.response.status === 401) {
      const userStore = useUserStore()
      
      // 未授权，清除token并跳转到登录页
      userStore.logout()
      router.push({ name: 'loginPage' })
    }
    return Promise.reject(error)
  },
)

export default request
