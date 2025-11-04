import { ElMessage } from 'element-plus'
export function handleResponse(response) {
  if (response.data.code === 200) {
    ElMessage.success(response.data.msg)
    return response.data.data
  } else {
    ElMessage.error(response.data.msg)
    return Promise.reject(response.data)
  }
}
