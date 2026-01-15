import { useUserStore } from '@/stores'
import axios from 'axios'
import router from '@/router'

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

    // // 定义需要token的API路径
    // const requiresAuth = [
    //   '/admin', // 管理员接口
    //   '/blog', // 博客管理接口 (POST, PUT, DELETE需要token)
    //   '/blogType', // 分类管理接口 (POST, PUT, DELETE需要token)
    //   '/upload', // 文件上传接口
    //   '/comment/all', // 评论管理接口
    // ]

    // 检查当前请求是否需要认证
    // const method = config.method?.toUpperCase()
    // const url = config.url

    // 管理端接口（包含 /admin 的路径）所有方法都需要token
    // const isAdminPath = url && url.includes('/admin')

    // 留言板接口的特殊处理
    // const isMessageBoardPath = url?.includes('/messageBoard')
    // 公开的留言板接口（不需要token）
    // const isMessageBoardPublic =
    //   (url === '/messageBoard' && method === 'POST') || // 创建留言
    //   (url === '/messageBoard/list' && method === 'GET') // 获取留言列表

    // 留言板的管理操作（需要token）
    // const isMessageBoardManagement =
    //   isMessageBoardPath && !isMessageBoardPublic && ['PUT', 'DELETE'].includes(method) // 回复、删除等操作

    // const requiresToken = isAdminPath
    //   ? true // 管理端接口所有方法都需要token
    //   : isMessageBoardManagement
    //     ? true // 留言板的管理操作需要token
    //     : requiresAuth.some((path) => url.includes(path)) &&
    //       ['POST', 'PUT', 'DELETE'].includes(method) // 其他接口的POST/PUT/DELETE需要token

    // // 只有在需要认证的接口才发送token
    // if (requiresToken && userStore.token) {
    //   config.headers['Authorization'] = `Bearer ${userStore.token}`
    // }

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

    if (config.method === 'GET') {
      config.params = config.data
      delete config.data
    }
    return config
  },
  (error) => {
    resetLoading()
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
    resetLoading()

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
