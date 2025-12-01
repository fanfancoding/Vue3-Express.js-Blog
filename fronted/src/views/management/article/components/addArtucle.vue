<template>
  <div class="article-editor-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" :icon="ArrowLeft">返回</el-button>
        <h2>{{ isEdit ? '编辑文章' : '新增文章' }}</h2>
      </div>
      <div class="header-right">
        <el-button @click="handleSaveDraft">保存草稿</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
          {{ isEdit ? '更新文章' : '发布文章' }}
        </el-button>
      </div>
    </div>

    <!-- 文章表单 -->
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
      <el-card class="form-card">
        <template #header>
          <span>基本信息</span>
        </template>

        <el-form-item label="文章标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入文章标题"
            maxlength="100"
            show-word-limit
            clearable
          />
        </el-form-item>

        <el-form-item label="文章分类" prop="categoryId">
          <el-select
            v-model="formData.categoryId"
            placeholder="请选择文章分类"
            clearable
            style="width: 300px"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="文章描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入文章描述（用于列表展示和SEO）"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="缩略图" prop="thumb">
          <div class="upload-container">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleUploadSuccess"
              :on-error="handleUploadError"
              :before-upload="beforeUpload"
              :headers="uploadHeaders"
            >
              <img v-if="formData.thumb" :src="getImageUrl(formData.thumb)" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tips">
              <p>建议尺寸：800 x 450 像素</p>
              <p>支持 jpg、png 格式，大小不超过 2MB</p>
            </div>
          </div>
        </el-form-item>
      </el-card>

      <el-card class="form-card content-card">
        <template #header>
          <div class="content-header">
            <span>文章内容（Markdown 格式）</span>
          </div>
        </template>

        <el-form-item label=" " prop="content" label-width="0">
          <div class="editor-container">
            <!-- Markdown 编辑器 -->
            <div class="markdown-editor-wrapper">
              <MdEditor
                v-model="formData.markdownContent"
                :preview-theme="'github'"
                :code-theme="'github'"
                :placeholder="'请输入 Markdown 格式的文章内容...'"
                @on-upload-img="handleUploadImg"
                @on-save="handleSubmit"
                :toolbars="toolbars"
              />
            </div>
          </div>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script setup>
import { defineOptions, ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowLeft, Plus } from '@element-plus/icons-vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import {
  getArticleTypeRequest,
  getArticleByIdRequest,
  addArticleRequest,
  updateArticleRequest,
  uploadImageRequest,
} from '@/api/manage'
import { handleResponse } from '@/utils/common'

defineOptions({
  name: 'AddArticle',
})

const router = useRouter()
const route = useRoute()

// 判断是新增还是编辑
const isEdit = computed(() => !!route.params.id)
const articleId = computed(() => route.params.id)

// 表单引用
const formRef = ref(null)
const submitLoading = ref(false)

// 分类选项
const categoryOptions = ref([])

// 上传配置
const uploadUrl = ref(`${import.meta.env.VITE_BASE_URL || 'http://localhost:3001/api'}upload`)
const uploadHeaders = computed(() => {
  const token = localStorage.getItem('token')
  return {
    Authorization: token ? `Bearer ${token}` : '',
  }
})

// 表单数据
const formData = reactive({
  title: '',
  categoryId: null,
  description: '',
  thumb: '',
  markdownContent: '',
})

// Markdown 编辑器工具栏配置
const toolbars = [
  'bold',
  'underline',
  'italic',
  'strikeThrough',
  '-',
  'title',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  '-',
  'revoke',
  'next',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'previewOnly',
  'htmlPreview',
  'catalog',
]

// 表单验证规则
const formRules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择文章分类', trigger: 'change' }],
  description: [{ required: true, message: '请输入文章描述', trigger: 'blur' }],
  content: [
    {
      validator: (rule, value, callback) => {
        if (!formData.markdownContent || !formData.markdownContent.trim()) {
          callback(new Error('请输入文章内容'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
}

// 获取分类列表
async function getCategoryList() {
  try {
    const res = await getArticleTypeRequest()
    const data = handleResponse(res) || []
    categoryOptions.value = data
  } catch {
    ElMessage.error('获取分类列表失败')
  }
}

// 获取文章详情（编辑时）
async function getArticleDetail() {
  if (!isEdit.value) return

  try {
    const res = await getArticleByIdRequest(articleId.value)
    const data = handleResponse(res)
    if (data) {
      Object.assign(formData, {
        title: data.title || '',
        categoryId: data.categoryId || null,
        description: data.description || '',
        thumb: data.thumb || '', // 保存相对路径
        markdownContent: data.markdownContent || '',
      })
    }
  } catch {
    ElMessage.error('获取文章详情失败')
  }
}

// Markdown 编辑器图片上传
const handleUploadImg = async (files, callback) => {
  try {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData()
      formData.append('file', file)

      const res = await uploadImageRequest(formData)
      if (res.code === 200 && res.data) {
        // 临时方案：通过API代理访问静态资源（已在后端JWT白名单中添加）
        const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001/api'
        const imageUrl = `${baseUrl}/${res.data}`
        return imageUrl
      }
      return ''
    })

    const urls = await Promise.all(uploadPromises)
    callback(urls)
    ElMessage.success('图片上传成功')
  } catch {
    ElMessage.error('图片上传失败')
  }
}

// 图片上传前的校验
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 图片上传成功
const handleUploadSuccess = (response) => {
  if (response.code === 200 && response.data) {
    // 后端返回的是相对路径，如 "static/uploads/images-xxx.jpeg"
    const relativePath = response.data.url || response.data
    // 保存相对路径（用于提交）
    formData.thumb = relativePath
    ElMessage.success('图片上传成功')
  } else {
    ElMessage.error(response.msg || '图片上传失败')
  }
}

// 获取完整的图片URL（用于显示）
const getImageUrl = (relativePath) => {
  if (!relativePath) return ''
  // 如果已经是完整URL，直接返回
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath
  }
  // 临时方案：通过API代理访问静态资源（已在后端JWT白名单中添加）
  const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:3001/api'
  console.log(`${baseUrl}/${relativePath}`, 'baseUrl')
  return `${baseUrl}/${relativePath}`
}

// 图片上传失败
const handleUploadError = () => {
  ElMessage.error('图片上传失败')
}

// 返回列表
const handleBack = () => {
  router.back()
}

// 保存草稿
const handleSaveDraft = async () => {
  ElMessage.info('草稿功能待实现')
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    // 验证表单
    await formRef.value.validate()

    submitLoading.value = true

    // 准备提交数据 - 只使用 Markdown
    const submitData = {
      title: formData.title,
      categoryId: formData.categoryId,
      description: formData.description,
      thumb: formData.thumb || '', // 已经是相对路径，直接使用
      createDate: Date.now(), // 时间戳
      markdownContent: formData.markdownContent, // 只传递 Markdown 内容
    }

    let res
    if (isEdit.value) {
      // 更新文章
      res = await updateArticleRequest(articleId.value, submitData)
    } else {
      // 新增文章
      res = await addArticleRequest(submitData)
    }

    const data = handleResponse(res)
    if (data) {
      console.log(data, 'data')
      ElMessage.success(isEdit.value ? '文章更新成功' : '文章发布成功')

      // 延迟跳转，让用户看到成功提示
      setTimeout(() => {
        router.push('/management/article')
      }, 1000)
    } else {
      ElMessage.error(data.msg)
    }
  } catch (error) {
    console.log(error, 'error')
  }
}

// 初始化
onMounted(() => {
  getCategoryList()
  if (isEdit.value) {
    getArticleDetail()
  }
})
</script>

<style scoped>
.article-editor-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h2 {
  margin: 0;
  color: #303133;
  font-size: 20px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-card {
  margin-bottom: 20px;
}

.content-card {
  margin-bottom: 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.upload-container {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-uploader:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 180px;
  height: 180px;
  object-fit: cover;
  display: block;
}

.upload-tips {
  color: #909399;
  font-size: 12px;
  line-height: 1.8;
}

.upload-tips p {
  margin: 0;
}

.editor-container {
  width: 100%;
}

/* Markdown 编辑器样式 */
.markdown-editor-wrapper {
  width: 100%;
  min-height: 600px;
}

.markdown-editor-wrapper :deep(.md-editor) {
  min-height: 600px;
  border-radius: 4px;
}

.markdown-editor-wrapper :deep(.md-editor-preview-wrapper) {
  padding: 20px;
}

.markdown-editor-wrapper :deep(.md-editor-preview) {
  font-size: 14px;
  line-height: 1.8;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .article-editor-container {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .header-left,
  .header-right {
    width: 100%;
    justify-content: flex-start;
  }

  .header-right {
    flex-wrap: wrap;
  }

  .upload-container {
    flex-direction: column;
  }

  .markdown-editor-wrapper {
    min-height: 400px;
  }

  .markdown-editor-wrapper :deep(.md-editor) {
    min-height: 400px;
  }
}
</style>
