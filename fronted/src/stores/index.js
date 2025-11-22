import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getBlogCategoryListRequest } from '@/api/blog'
import { handleResponse } from '@/utils/common'

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))

  // 计算属性
  const isLoggedIn = computed(() => !!token.value)

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
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  function login(tokenValue, userInfoValue) {
    setToken(tokenValue)
    setUserInfo(userInfoValue)
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    logout,
    login,
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
