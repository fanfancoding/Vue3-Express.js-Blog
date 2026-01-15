import { useUserStore } from '@/stores'
import axios from 'axios'
import router from '@/router'
import '@/style/index.scss'
import { ElLoading } from 'element-plus'
import { responseTypeMap } from '@/enum/index.js'
import { ElMessage } from 'element-plus'

function resetLoading(): void {
  if (loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '/api',
  timeout: 60000,
  withCredentials: true, // 允许携带cookie，支持session
})

// 创建一个loading实例的引用
let loadingInstance: any | null = null

// 统一的401处理函数
const handleUnauthorized = (message?: string) => {
  const userStore = useUserStore()
  ElMessage.error(message || '登录已过期，请重新登录')
  userStore.logout()
  router.push({ name: 'loginPage' })
}

request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()

    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }

    config.headers['Content-Type'] = responseTypeMap.get(config.responseType || 'json')

    // 开启loading
    loadingInstance = ElLoading.service({
      lock: true,
      text: '全力加载中...',
      background: 'rgba(0, 0, 0, 0.7)',
      customClass: 'custom-loading',
    })

    if (config.method === 'GET') {
      config.params = config.data
      delete config.data
    }
    return config
  },
  (error) => {
    // resetLoading()
    return Promise.reject(error)
  },
)

request.interceptors.response.use(
  (response) => {
    // 关闭loading
    resetLoading()

    // 设置token
    const userStore = useUserStore()
    const headerToken = response.headers.Authorization
    if (headerToken) {
      userStore.setToken(headerToken)
    }
    return response
  },
  (error) => {
    // 关闭loading
    // resetLoading()

    // 处理错误响应
    if (error.response) {
      const { data, status } = error.response

      // 401 未授权错误
      if (status === 401) {
        handleUnauthorized(data?.msg)
        return Promise.reject(error)
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      if (error.code === 'ECONNABORTED') {
        ElMessage.error('请求超时，请稍后重试')
      } else {
        ElMessage.error('网络错误，请检查网络连接')
      }
    } else {
      // 其他错误
      ElMessage.error(error.message || '未知错误，请稍后重试')
    }

    return Promise.reject(error)
  },
)

export default request
