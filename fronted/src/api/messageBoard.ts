import request from '@/utils/request'

// 创建留言
export const createMessageRequest = (data) => {
  return request({
    url: '/messageBoard',
    method: 'POST',
    data,
  })
}

// 获取留言列表（前台）
export const getMessageListRequest = (params) => {
  return request({
    url: '/messageBoard/list',
    method: 'GET',
    params,
  })
}

// 获取留言列表（后台）
export const getMessageListAdminRequest = (params) => {
  return request({
    url: '/messageBoard/admin/list',
    method: 'GET',
    params,
  })
}

// 获取留言详情
export const getMessageDetailRequest = (id) => {
  return request({
    url: `/messageBoard/${id}`,
    method: 'GET',
  })
}

// 回复留言
export const replyMessageRequest = (id, reply) => {
  return request({
    url: `/messageBoard/${id}/reply`,
    method: 'PUT',
    data: { reply },
  })
}

// 删除留言
export const deleteMessageRequest = (id) => {
  return request({
    url: `/messageBoard/${id}`,
    method: 'DELETE',
  })
}

// 批量删除留言
export const batchDeleteMessageRequest = (ids) => {
  return request({
    url: '/messageBoard/batch/delete',
    method: 'DELETE',
    data: { ids },
  })
}

// 审核留言（通过）
export const approveMessageRequest = (id) => {
  return request({
    url: `/messageBoard/admin/${id}/approve`,
    method: 'PUT',
  })
}

// 拒绝留言
export const rejectMessageRequest = (id) => {
  return request({
    url: `/messageBoard/admin/${id}/reject`,
    method: 'PUT',
  })
}

// 批量审核留言
export const batchApproveMessageRequest = (ids) => {
  return request({
    url: '/messageBoard/admin/batch/approve',
    method: 'PUT',
    data: { ids },
  })
}

// 获取留言统计
export const getMessageStatsRequest = () => {
  return request({
    url: '/messageBoard/admin/stats',
    method: 'GET',
  })
}
