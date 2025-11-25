import { useUserStore } from '@/stores'
import axios from 'axios'
import router from '@/router'

import { ElLoading } from 'element-plus'
import { responseTypeMap } from '@/enum/index.js'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '/api',
  timeout: 60000, // 增加到60秒以支持长文章上传
  withCredentials: true, // 允许携带cookie，支持session
})

// 创建一个loading实例的引用
let loadingInstance = null

request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    // 设置 Authorization 请求头，格式为 Bearer <token>
    if (userStore.token) {
      config.headers['Authorization'] = `Bearer ${userStore.token}`
    }
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

    if (response.data.code === 401) {
      console.log('401啦')
      ElMessage.error(response.data.msg)
      const userStore = useUserStore()
      // 未授权，清除token并跳转到登录页
      userStore.logout()
      router.push({ name: 'loginPage' })
      return Promise.reject(response.data)
    }

    // 检查响应头中的token（用于登录接口）
    const userStore = useUserStore()
    const headerToken = response.headers.authorization || response.headers.Authorization
    if (headerToken) {
      userStore.setToken(headerToken)
    }

    // 检查响应数据中的token（兼容其他可能的接口）
    const { token } = response.data || {}
    if (token) {
      userStore.setToken(token)
    }

    return response
  },
  (error) => {
    console.log(error, 'error')
    // 关闭loading
    if (loadingInstance) {
      loadingInstance.close()
      loadingInstance = null
    }

    // 处理错误响应
    if (error.response) {
      const { data, status } = error.response

      // 401 未授权错误
      if (status === 401 || data?.code === 401) {
        ElMessage.error(data?.msg || '登录已过期，请重新登录')
        const userStore = useUserStore()
        userStore.logout()
        router.push({ name: 'loginPage' })
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
      ElMessage.error(error.message || '请求失败，请稍后重试')
    }

    return Promise.reject(error)
  },
)

export default request
