<template>
  <div class="category-container">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h2>文章分类</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增分类
      </el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form :model="searchForm" inline>
        <el-form-item label="分类名称">
          <el-select
            v-model="searchForm.name"
            placeholder="请选择分类名称"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 分类表格 -->
    <div class="table-container">
      <el-table v-loading="loading" :data="filteredCategoryList" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" min-width="150" />
        <el-table-column prop="articleCount" label="文章数量" width="100" />
        <el-table-column prop="order" label="排序" width="100" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="handleEdit(row)"> 编辑 </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增/编辑分类对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form ref="formRef" :model="formData" :rules="FORM_RULES" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入分类名称"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="formData.order" :min="0" :max="999" controls-position="right" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editArticleType">确定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { defineOptions, ref, reactive, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import {
  getArticleTypeRequest,
  addArticleTypeRequest,
  deleteArticleTypeRequest,
  updateArticleTypeRequest,
} from '@/api/manage'
import { handleResponse } from '@/utils/common'
import { DIALOG_TITLE, FORM_RULES } from './static'
defineOptions({
  name: 'CategoryPage',
})

onMounted(() => {
  getArticleTypeList()
})

// 搜索表单
const searchForm = reactive({
  name: '',
  status: '',
})

// 分类列表
const categoryList = ref([])
const loading = ref(false)

// 过滤后的分类列表（用于搜索）
const filteredCategoryList = ref([])

// 对话框相关
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formRef = ref()
const formData = reactive({
  id: null,
  name: '',
  order: 0,
})

// 获取分类列表
async function getArticleTypeList() {
  loading.value = true
  await getArticleTypeRequest()
    .then((res) => {
      const data = handleResponse(res) || []
      categoryList.value = data
      filteredCategoryList.value = data
    })
    .finally(() => {
      loading.value = false
    })
}

// 新增文章类型
async function editArticleType() {
  if (dialogTitle.value === DIALOG_TITLE.ADD) {
    await addArticleType({
      name: formData.name,
      order: formData.order,
    })
  } else if (dialogTitle.value === DIALOG_TITLE.EDIT) {
    await updateArticleType({
      id: formData.id,
      name: formData.name,
      order: formData.order,
    })
  } else {
    throw new Error('Invalid dialog title')
  }
}

// 删除单个文章类型
async function deleteArticleType(row) {
  await deleteArticleTypeRequest(row.id).then((res) => {
    handleResponse(res)
    getArticleTypeList()
  })
}

// 更新单个文章类型
async function updateArticleType({ id, name, order }) {
  await updateArticleTypeRequest(id, {
    name,
    order,
  }).then((res) => {
    handleResponse(res)
    getArticleTypeList()
    dialogVisible.value = false
  })
}

// 新增单个文章类型
async function addArticleType({ name, order }) {
  await addArticleTypeRequest({
    name,
    order,
  }).then((res) => {
    handleResponse(res)
    getArticleTypeList()
    dialogVisible.value = false
  })
}

// 搜索
const handleSearch = () => {
  if (!searchForm.name) {
    filteredCategoryList.value = categoryList.value
    return
  }

  filteredCategoryList.value = categoryList.value.filter((item) => {
    return item.name.toLowerCase().includes(searchForm.name.toLowerCase())
  })
}

// 重置搜索
const handleReset = () => {
  Object.keys(searchForm).forEach((key) => {
    searchForm[key] = ''
  })
  filteredCategoryList.value = categoryList.value
}

// 新增分类
const handleAdd = () => {
  dialogTitle.value = '新增分类'
  resetFormData()
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row) => {
  dialogTitle.value = '编辑分类'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 删除分类
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除分类"${row.name}"吗？`, '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteArticleType(row)
  })
}

// 提交表单
// const handleSubmit = async () => {
//   if (!formRef.value) return

//   try {
//     await formRef.value.validate()

//     // 这里应该调用实际的API
//     if (formData.id) {
//       ElMessage.success('编辑成功')
//     } else {
//       ElMessage.success('新增成功')
//     }

//     dialogVisible.value = false
//     getArticleTypeList()
//   } catch {
//     ElMessage.error('表单验证失败')
//   }
// }

// 对话框关闭
const handleDialogClose = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
  resetFormData()
}

// 重置表单数据
const resetFormData = () => {
  Object.assign(formData, {
    id: null,
    name: '',
    order: 0,
  })
}
</script>

<style scoped>
.category-container {
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

.dialog-footer {
  text-align: right;
}
</style>
