import { ElMessage } from 'element-plus'
export function handleResponse(response, isShowMessage = true) {
  if (response.data.code === 200) {
    if (isShowMessage) {
      ElMessage.success(response.data.msg)
    }
    return response.data.data
  } else {
    if (isShowMessage) {
      ElMessage.error(response.data.msg)
    }
    return Promise.reject(response.data)
  }
}
