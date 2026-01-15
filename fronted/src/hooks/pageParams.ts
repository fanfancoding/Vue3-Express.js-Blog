import { reactive } from 'vue'

export const usePageParams = ({ pageNum = 1, pageSize = 10 }) => {
  const pageParams = reactive({
    pageNum,
    pageSize,
  })

  const resetPageParams = () => {
    pageParams.pageNum = pageNum
    pageParams.pageSize = pageSize
  }

  return { pageParams, resetPageParams }
}
