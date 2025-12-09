import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getBlogCategoryListRequest } from '@/api/blog'
import { handleResponse } from '@/utils/common'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))
  const tokenValidating = ref(false)

  // 计算属性
  const isLoggedIn = computed(() => !!token.value && !tokenValidating.value)

  // 方法
  function setToken(newToken) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('token', newToken)
    } else {
      localStorage.removeItem('token')
    }
  }

  function setUserInfo(info) {
    userInfo.value = info
    if (info && Object.keys(info).length > 0) {
      localStorage.setItem('userInfo', JSON.stringify(info))
    } else {
      localStorage.removeItem('userInfo')
    }
  }

  function logout() {
    token.value = ''
    userInfo.value = {}
    tokenValidating.value = false
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  function login(tokenValue, userInfoValue) {
    setToken(tokenValue)
    setUserInfo(userInfoValue)
    tokenValidating.value = false
  }

  // 验证token有效性
  async function validateToken() {
    if (!token.value) {
      return false
    }

    tokenValidating.value = true
    try {
      // 调用后端的token验证接口
      const response = await fetch('/api/admin/restore', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        if (result.code === 200) {
          // token有效，更新用户信息
          setUserInfo(result.data)
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Token validation failed:', error)
      return false
    } finally {
      tokenValidating.value = false
    }
  }

  // 初始化时验证token
  async function initAuth() {
    if (token.value && !tokenValidating.value) {
      const isValid = await validateToken()
      if (!isValid) {
        // token无效，清除登录状态
        logout()
      }
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    tokenValidating,
    setToken,
    setUserInfo,
    logout,
    login,
    validateToken,
    initAuth,
  }
})

export const useBlogTypeStore = defineStore('blogType', () => {
  const blogTypeList = ref([])
  const loading = ref(false)

  // 计算属性：判断数据是否已加载
  const hasData = computed(() => blogTypeList.value.length > 0)

  // 获取博客分类列表（带缓存）
  async function getBlogTypeList(forceRefresh = false) {
    // 如果已有数据且不强制刷新，直接返回
    if (hasData.value && !forceRefresh) {
      return blogTypeList.value
    }

    // 防止重复请求
    if (loading.value) {
      return blogTypeList.value
    }

    try {
      loading.value = true
      const res = await getBlogCategoryListRequest()
      const data = handleResponse(res, false) || []
      blogTypeList.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  // 清空数据
  function clearBlogTypeList() {
    blogTypeList.value = []
  }

  return {
    blogTypeList,
    loading,
    hasData,
    getBlogTypeList,
    clearBlogTypeList,
  }
})
