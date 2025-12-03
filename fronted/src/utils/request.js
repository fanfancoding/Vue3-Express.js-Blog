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

    // 定义需要token的API路径
    const requiresAuth = [
      '/admin', // 管理员接口
      '/blog', // 博客管理接口 (POST, PUT, DELETE需要token)
      '/blogType', // 分类管理接口 (POST, PUT, DELETE需要token)
      '/upload', // 文件上传接口
      '/comment/all', // 评论管理接口
    ]

    // 检查当前请求是否需要认证
    const method = config.method?.toUpperCase()
    const url = config.url

    // 管理端接口（包含 /admin 的路径）所有方法都需要token
    const isAdminPath = url.includes('/admin')

    // 留言板接口的特殊处理
    const isMessageBoardPath = url.includes('/messageBoard')
    // 公开的留言板接口（不需要token）
    const isMessageBoardPublic =
      (url === '/messageBoard' && method === 'POST') || // 创建留言
      (url === '/messageBoard/list' && method === 'GET') // 获取留言列表

    // 留言板的管理操作（需要token）
    const isMessageBoardManagement =
      isMessageBoardPath && !isMessageBoardPublic && ['PUT', 'DELETE'].includes(method) // 回复、删除等操作

    const requiresToken = isAdminPath
      ? true // 管理端接口所有方法都需要token
      : isMessageBoardManagement
        ? true // 留言板的管理操作需要token
        : requiresAuth.some((path) => url.includes(path)) &&
          ['POST', 'PUT', 'DELETE'].includes(method) // 其他接口的POST/PUT/DELETE需要token

    // 只有在需要认证的接口才发送token
    if (requiresToken && userStore.token) {
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
