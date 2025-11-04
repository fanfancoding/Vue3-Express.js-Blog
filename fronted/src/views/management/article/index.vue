<template>
  <div class="article-list-container">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h2>文章列表</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增文章
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form ref="myFormModalRef" :model="myForm" inline>
        <el-form-item label="文章分类">
          <el-select
            v-model="myForm.categoryId"
            placeholder="请选择分类"
            clearable
            style="width: 150px"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 文章表格 -->
    <div class="table-container">
      <el-table v-loading="loading" :data="articleList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="文章标题" min-width="200" show-overflow-tooltip />
        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            <el-tag>{{ getCategoryName(row.categoryId) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="scanNumber" label="浏览量" width="100" />
        <el-table-column prop="commentNumber" label="评论数" width="100" />
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.createDate) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleEdit(row)"> 编辑 </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { defineOptions, ref, onMounted, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { getArticleListRequest, getArticleTypeRequest, deleteArticleRequest } from '@/api/manage'
import { useFormModal } from '@/hooks/formModal'
import { handleResponse } from '@/utils/common'
import { useRouter } from 'vue-router'
const router = useRouter()

defineOptions({
  name: 'ArticleListPage',
})

// 添加分页相关的响应式数据
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

const { myForm, myFormModalRef } = useFormModal({
  categoryId: '',
})

async function getArticleList() {
  loading.value = true
  await getArticleListRequest({
    page: pagination.currentPage,
    limit: pagination.pageSize,
    categoryId: myForm.categoryId,
  })
    .then((res) => {
      const data = handleResponse(res) || {}
      articleList.value = data.rows || []
      pagination.total = data.total || 0
    })
    .finally(() => {
      loading.value = false
    })
}

async function getArticleTypeList() {
  const res = await getArticleTypeRequest()
  const data = handleResponse(res) || []
  categoryOptions.value = data.map((item) => ({
    id: item.id,
    name: item.name,
  }))
}
onMounted(() => {
  getArticleTypeList()
  getArticleList()
})

// 分类选项
const categoryOptions = ref([])

// 文章列表
const articleList = ref([])
const loading = ref(false)

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  getArticleList()
}

// 重置搜索
const handleReset = () => {
  Object.keys(myForm).forEach((key) => {
    myForm[key] = undefined
  })
  pagination.currentPage = 1
  getArticleList()
}

// 新增文章
const handleAdd = () => {
  router.push('/management/article/add')
}

// 编辑文章
const handleEdit = (row) => {
  router.push(`/management/article/edit/${row.id}`)
}

// 删除文章
const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(`确定要删除文章"${row.title}"吗？`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    const res = await deleteArticleRequest(row.id)
    handleResponse(res)
    // ElMessage.success('删除成功')
    getArticleList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// 根据分类ID获取分类名称
const getCategoryName = (categoryId) => {
  const category = categoryOptions.value.find((item) => item.id === categoryId)
  return category ? category.name : '-'
}

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = new Date(Number(timestamp))
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}

// 分页大小改变
const handleSizeChange = (val) => {
  pagination.pageSize = val
  getArticleList()
}

// 当前页改变
const handleCurrentChange = (val) => {
  pagination.currentPage = val
  getArticleList()
}
</script>

<style scoped>
.article-list-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #303133;
}

.search-container {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 4px;
  margin-bottom: 20px;
}

.table-container {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
}
</style>
