<template>
  <div class="article-detail-container">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    <div v-else-if="article" class="article-content">
      <!-- 文章标题 -->
      <h1 class="article-title">{{ article.title }}</h1>

      <!-- 文章信息 -->
      <div class="article-meta">
        <span>作者: Tarzan</span>
        <span class="divider">|</span>
        <span>分类: {{ article.blogType?.name }}</span>
        <span class="divider">|</span>
        <span>浏览量: {{ article.scanNumber }}</span>
        <span class="divider">|</span>
        <span>评论数: {{ article.commentNumber }}</span>
        <span class="divider">|</span>
        <span>发布时间: {{ formatDate(article.createDate) }}</span>
      </div>

      <!-- 文章描述 -->
      <div v-if="article.description" class="article-description">
        {{ article.description }}
      </div>

      <!-- 文章内容 -->
      <div class="article-body" v-html="article.htmlContent"></div>

      <!-- 评论区域 -->
      <div class="comment-section">
        <h3 class="comment-title">你觉得这篇文章怎么样？</h3>
        <div class="emoji-container">
          <div
            v-for="(comment, index) in comments"
            :key="index"
            class="emoji-item"
            :class="{ active: comment.clicked }"
            @click="handleEmojiClick(comment.emoji)"
          >
            <div class="emoji">{{ comment.emoji }}</div>
            <div class="emoji-count">{{ comment.count }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="error-container">
      <el-empty description="文章不存在" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getBlogDetailRequest, addCommentRequest, getCommentsByBlogIdRequest } from '@/api/blog'
import { handleResponse } from '@/utils/common'
import dayjs from 'dayjs'

defineOptions({
  name: 'ArticleDetailPage',
})

const route = useRoute()
const loading = ref(true)
const article = ref(null)
const comments = ref([
  { emoji: '👍', count: 0, clicked: false },
  { emoji: '❤️', count: 0, clicked: false },
  { emoji: '😂', count: 0, clicked: false },
  { emoji: '😮', count: 0, clicked: false },
  { emoji: '😢', count: 0, clicked: false },
  { emoji: '😡', count: 0, clicked: false },
])

// 获取文章详情
async function getArticleDetail() {
  const articleId = route.params.id
  if (!articleId) {
    ElMessage.error('文章ID不存在')
    return
  }

  loading.value = true
  try {
    const res = await getBlogDetailRequest(articleId)
    article.value = handleResponse(res, false)
    // 获取评论统计
    await getComments()
  } catch (error) {
    ElMessage.error('获取文章详情失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

// 获取评论统计
async function getComments() {
  const articleId = route.params.id
  if (!articleId) return

  try {
    const res = await getCommentsByBlogIdRequest(articleId)
    const data = handleResponse(res, false) || []
    // 更新评论数据
    const updatedComments = comments.value.map((item) => {
      const found = data.find((d) => d.emoji === item.emoji)
      return {
        ...item,
        count: found ? found.count : 0,
      }
    })
    comments.value = updatedComments

    const totalComments = updatedComments.reduce((sum, current) => sum + current.count, 0)
    if (article.value) {
      article.value.commentNumber = totalComments
    }
  } catch (error) {
    console.error('获取评论统计失败:', error)
  }
}

// 处理emoji点击
async function handleEmojiClick(emoji) {
  const articleId = route.params.id
  if (!articleId) return

  try {
    await addCommentRequest({
      blogId: Number(articleId),
      emoji,
    })

    await getComments()

    const target = comments.value.find((c) => c.emoji === emoji)
    if (target) {
      target.clicked = true
      setTimeout(() => {
        target.clicked = false
      }, 1000)
    }
  } catch (error) {
    ElMessage.error('评论失败，请稍后重试')
    console.error(error)
  }
}

// 格式化日期（以详情页为准，确保正确处理字符串时间戳）
function formatDate(timestamp) {
  // 如果 timestamp 是字符串，转换为数字
  const ts = typeof timestamp === 'string' ? Number(timestamp) : timestamp
  return dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
}

onMounted(() => {
  getArticleDetail()
})
</script>

<style scoped>
.article-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading-container {
  padding: 40px;
}

.article-content {
  background: white;
  border-radius: 8px;
  padding: 40px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.article-title {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
  line-height: 1.5;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #909399;
  font-size: 14px;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.divider {
  color: #dcdfe6;
}

.article-description {
  font-size: 16px;
  color: #606266;
  line-height: 1.8;
  margin-bottom: 30px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.article-body {
  font-size: 16px;
  line-height: 1.8;
  color: #303133;
  margin-bottom: 50px;
}

.article-body :deep(h1),
.article-body :deep(h2),
.article-body :deep(h3),
.article-body :deep(h4),
.article-body :deep(h5),
.article-body :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.article-body :deep(p) {
  margin-bottom: 16px;
}

.article-body :deep(code) {
  padding: 2px 4px;
  background: #f5f7fa;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.article-body :deep(pre) {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 16px;
}

.article-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 16px 0;
}

.comment-section {
  margin-top: 50px;
  padding-top: 30px;
  border-top: 2px solid #ebeef5;
}

.comment-title {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 20px;
}

.emoji-container {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.emoji-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px 20px;
  border: 2px solid #ebeef5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  min-width: 80px;
}

.emoji-item:hover {
  border-color: #409eff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.2);
}

.emoji-item.active {
  border-color: #409eff;
  background: #ecf5ff;
  transform: scale(1.05);
}

.emoji {
  font-size: 32px;
  margin-bottom: 8px;
}

.emoji-count {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}

.error-container {
  padding: 40px;
  text-align: center;
}
</style>
