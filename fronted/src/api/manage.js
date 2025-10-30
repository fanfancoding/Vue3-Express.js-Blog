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
