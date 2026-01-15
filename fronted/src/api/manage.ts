import request from '@/utils/request'

// 登录
export const login = (data) => {
  return request({
    url: '/admin/login',
    method: 'POST',
    data,
  })
}

// 获取验证码
export const getCaptcha = () => {
  return request({
    url: '/captcha',
    method: 'GET',
    responseType: 'blob', // 接收二进制数据
  })
}

// 获取文章列表
export const getArticleListRequest = (params) => {
  return request({
    url: '/blog',
    method: 'GET',
    params,
  })
}

// 获取文章类型
export const getArticleTypeRequest = () => {
  return request({
    url: '/blogType',
    method: 'GET',
  })
}

// 新增文章类型
export const addArticleTypeRequest = (data) => {
  return request({
    url: '/blogType',
    method: 'POST',
    data,
  })
}

// 删除单个文章类型
export const deleteArticleTypeRequest = (id) => {
  return request({
    url: `/blogType/${id}`,
    method: 'DELETE',
  })
}

// 更新单个文章类型
export const updateArticleTypeRequest = (id, data) => {
  return request({
    url: `/blogType/${id}`,
    method: 'PUT',
    data,
  })
}

// 获取单个文章类型
export const getArticleTypeByIdRequest = (id) => {
  return request({
    url: `/blogType/${id}`,
    method: 'GET',
  })
}

// ========== 文章相关 API ==========

// 获取单个文章详情
export const getArticleByIdRequest = (id) => {
  return request({
    url: `/blog/${id}`,
    method: 'GET',
  })
}

// 新增文章
export const addArticleRequest = (data) => {
  return request({
    url: '/blog',
    method: 'POST',
    data,
  })
}

// 更新文章
export const updateArticleRequest = (id, data) => {
  return request({
    url: `/blog/${id}`,
    method: 'PUT',
    data,
  })
}

// 删除文章
export const deleteArticleRequest = (id) => {
  return request({
    url: `/blog/${id}`,
    method: 'DELETE',
  })
}

// 上传图片
export const uploadImageRequest = (formData) => {
  return request({
    url: '/upload',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

// 修改账号信息
export const updateAdminInfoRequest = (data) => {
  return request({
    url: '/admin',
    method: 'PUT',
    data,
  })
}

// 获取所有评论统计（后台管理用）
export const getAllCommentsRequest = () => {
  return request({
    url: '/comment/all',
    method: 'GET',
  })
}

// 获取文章的所有评论统计
export const getCommentsByBlogIdRequest = (blogId) => {
  return request({
    url: `/comment/blog/${blogId}`,
    method: 'GET',
  })
}
