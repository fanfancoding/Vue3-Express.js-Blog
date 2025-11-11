import request from '@/utils/request'

// 获取博客文章列表（前台）
export const getBlogListRequest = (params) => {
  return request({
    url: '/blog',
    method: 'GET',
    params,
  })
}

// 获取文章详情
export const getBlogDetailRequest = (id) => {
  return request({
    url: `/blog/${id}`,
    method: 'GET',
  })
}

// 获取文章分类列表
export const getBlogCategoryListRequest = () => {
  return request({
    url: '/blogType',
    method: 'GET',
  })
}

// 添加评论（点击emoji）
export const addCommentRequest = (data) => {
  return request({
    url: '/comment',
    method: 'POST',
    data,
  })
}

// 获取文章的所有评论统计
export const getCommentsByBlogIdRequest = (blogId) => {
  return request({
    url: `/comment/blog/${blogId}`,
    method: 'GET',
  })
}
