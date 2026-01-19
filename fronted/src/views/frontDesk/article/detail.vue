<template>
  <div class="max-w-1800px mx-auto p-20px lt-lg:max-w-100% lt-lg:p-15px lt-md:p-10px lt-sm:p-8px">
    <div v-if="loading" class="p-40px lt-md:p-30px lt-sm:p-20px">
      <el-skeleton :rows="10" animated />
    </div>
    <div
      v-else-if="article"
      class="rounded-8px p-40px shadow-[0_2px_12px_rgba(0,0,0,0.1)] lt-md:p-24px lt-md:rounded-6px lt-sm:p-16px lt-sm:rounded-4px"
      :style="{
        backgroundColor: 'var(--bg-secondary)',
        color: 'var(--text-secondary)',
      }"
    >
      <!-- 文章标题 -->
      <h1
        class="text-32px font-bold mb-20px lh-1.5 lt-md:text-24px lt-md:mb-16px lt-sm:text-20px lt-sm:mb-12px lt-sm:lh-1.4"
        :style="{ color: 'var(--text-primary)' }"
      >
        {{ article.title }}
      </h1>

      <!-- 文章信息 -->
      <div
        class="flex items-center gap-10px text-14px mb-30px pb-20px border-b-1px border-b-solid flex-wrap lt-md:text-13px lt-md:gap-8px lt-md:mb-20px lt-md:pb-15px lt-sm:text-11px lt-sm:gap-6px lt-sm:mb-15px lt-sm:pb-12px"
        :style="{
          color: 'var(--text-secondary)',
          borderBottomColor: 'var(--border-color)',
        }"
      >
        <span>作者: Tarzan</span>
        <span class="lt-sm:mx-2px" :style="{ color: 'var(--border-color)' }">|</span>
        <span>分类: {{ article.blogType?.name }}</span>
        <span class="lt-sm:mx-2px" :style="{ color: 'var(--border-color)' }">|</span>
        <span>浏览量: {{ article.scanNumber }}</span>
        <span class="lt-sm:mx-2px" :style="{ color: 'var(--border-color)' }">|</span>
        <span>评论数: {{ article.commentNumber }}</span>
        <span class="lt-sm:mx-2px" :style="{ color: 'var(--border-color)' }">|</span>
        <span>发布时间: {{ formatDate(article.createDate) }}</span>
      </div>

      <!-- 文章描述 -->
      <div
        v-if="article.description"
        class="text-16px lh-[30px] mb-30px p-20px rounded-4px lt-md:text-15px lt-md:p-16px lt-md:mb-20px lt-sm:text-14px lt-sm:p-12px lt-sm:mb-16px lt-sm:lh-1.6"
        :style="{
          color: 'var(--text-secondary)',
          backgroundColor: 'var(--bg-primary)',
        }"
      >
        {{ article.description }}
      </div>

      <!-- 文章内容 -->
      <div class="article-body" v-html="renderedContent"></div>

      <!-- 评论区域 -->
      <div
        class="mt-50px pt-30px border-t-2px border-t-solid lt-md:mt-35px lt-md:pt-20px lt-sm:mt-25px lt-sm:pt-15px"
        :style="{ borderTopColor: 'var(--border-color)' }"
      >
        <h3
          class="text-20px font-600 mb-20px lt-md:text-18px lt-md:mb-16px lt-sm:text-16px lt-sm:mb-12px"
          :style="{ color: 'var(--accent-color)' }"
        >
          留个Emoji
        </h3>
        <div class="flex gap-20px flex-wrap lt-md:gap-15px lt-md:justify-center lt-sm:gap-10px">
          <div
            v-for="(comment, index) in comments"
            :key="index"
            class="flex flex-col items-center p-15px-20px border-2px border-solid rounded-8px cursor-pointer transition-all duration-300 min-w-80px hover:-translate-y-2px lt-md:p-12px-16px lt-md:min-w-70px lt-md:hover:-translate-y-1px lt-sm:p-10px-12px lt-sm:min-w-60px lt-sm:border-1.5px"
            :style="{
              borderColor: comment.clicked ? 'var(--accent-color)' : 'var(--border-color)',
              backgroundColor: comment.clicked ? 'var(--bg-primary)' : 'var(--bg-secondary)',
              boxShadow: comment.clicked ? '0 4px 12px rgba(0,0,0,0.25)' : 'none',
            }"
            @click="handleEmojiClick(comment.emoji)"
          >
            <div class="text-32px mb-8px lt-md:text-28px lt-md:mb-6px lt-sm:text-24px lt-sm:mb-4px">
              {{ comment.emoji }}
            </div>
            <div
              class="text-14px font-500 lt-md:text-13px lt-sm:text-12px"
              :style="{ color: 'var(--text-secondary)' }"
            >
              {{ comment.count }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="p-40px text-center lt-md:p-30px lt-sm:p-20px">
      <el-empty description="文章不存在" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getBlogDetailRequest, addCommentRequest, getCommentsByBlogIdRequest } from '@/api/blog'
import { handleResponse } from '@/utils/common'
import dayjs from 'dayjs'
import hljs from 'highlight.js'
import 'highlightjs-vue'
import MarkdownIt from 'markdown-it'

defineOptions({
  name: 'ArticleDetailPage',
})

// 配置markdown-it
const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang) {
      // 处理不同语言
      let language = lang.toLowerCase()

      // 特殊处理 Vue 代码
      if (language === 'vue') {
        // 使用 highlightjs-vue 插件进行高亮
        try {
          const highlighted = hljs.highlight(str, { language: 'vue' }).value
          return `<div class="code-block-container"><button class="copy-btn" onclick="copyToClipboard(this)">复制</button><pre class="hljs"><code class="hljs language-vue">${highlighted}</code></pre></div>`
        } catch (e) {
          console.warn('Vue highlighting failed:', e)
          // 降级到 HTML 高亮
          try {
            const highlighted = hljs.highlight(str, { language: 'html' }).value
            return `<div class="code-block-container"><button class="copy-btn" onclick="copyToClipboard(this)">复制</button><pre class="hljs"><code class="hljs language-vue">${highlighted}</code></pre></div>`
          } catch (e2) {
            console.warn('Fallback HTML highlighting also failed:', e2)
          }
        }
      }

      // 检查是否支持该语言
      if (hljs.getLanguage(language)) {
        try {
          const highlighted = hljs.highlight(str, { language }).value
          return `<div class="code-block-container"><button class="copy-btn" onclick="copyToClipboard(this)">复制</button><pre class="hljs"><code class="hljs language-${language}">${highlighted}</code></pre></div>`
        } catch (e) {
          console.warn(`${language} highlighting failed:`, e)
        }
      }

      // 对于不支持的语言，使用纯文本
      console.warn(`Language '${lang}' not supported, falling back to plain text`)
    }

    // 默认处理
    return `<div class="code-block-container"><button class="copy-btn" onclick="copyToClipboard(this)">复制</button><pre class="hljs"><code class="hljs">${md.utils.escapeHtml(str)}</code></pre></div>`
  }
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

// 渲染后的文章内容
const renderedContent = computed(() => {
  if (!article.value?.markdownContent) return ''
  return md.render(article.value.markdownContent)
})

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

function formatDate(timestamp) {
  // 如果 timestamp 是字符串，转换为数字
  const ts = typeof timestamp === 'string' ? Number(timestamp) : timestamp
  return dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
}

// 复制代码到剪贴板
function copyToClipboard(button) {
  const codeBlock = button.nextElementSibling
  const code = codeBlock.textContent || codeBlock.innerText

  if (navigator.clipboard && window.isSecureContext) {
    // 使用现代 Clipboard API
    navigator.clipboard.writeText(code).then(() => {
      ElMessage.success('复制成功')
    }).catch(() => {
      ElMessage.error('复制失败')
      fallbackCopyTextToClipboard(code, button)
    })
  } else {
    // 降级到 execCommand
    fallbackCopyTextToClipboard(code, button)
  }
}

// 降级复制方法
function fallbackCopyTextToClipboard(text, button) {
  const textArea = document.createElement('textarea')
  textArea.value = text
  textArea.style.position = 'fixed'
  textArea.style.left = '-999999px'
  textArea.style.top = '-999999px'
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    const successful = document.execCommand('copy')
    if (successful) {
      ElMessage.success('复制成功')
    } else {
      ElMessage.error('复制失败')
    }
  } catch (err) {
    ElMessage.error('复制失败')
  }

  document.body.removeChild(textArea)
}

// 显示复制反馈
function showCopyFeedback(button, message, isError = false) {
  const originalText = button.textContent
  button.textContent = message
  button.style.backgroundColor = isError ? '#f56c6c' : '#67c23a'
  button.style.color = '#ffffff'

  setTimeout(() => {
    button.textContent = originalText
    button.style.backgroundColor = ''
    button.style.color = ''
  }, 2000)
}

// 将复制函数添加到全局作用域
if (typeof window !== 'undefined') {
  window.copyToClipboard = copyToClipboard
}

onMounted(() => {
  getArticleDetail()
})
</script>

<style>
/* highlight.js 全局样式 - One Dark Pro 主题 */
.hljs {
  background: #282c34;
  color: #abb2bf;
}

.hljs-keyword {
  color: #e06c75;
}

.hljs-string {
  color: #98c379;
}

.hljs-function {
  color: #61afef;
}

.hljs-variable {
  color: #d19a66;
}

.hljs-comment {
  color: #5c6370;
}

.hljs-number {
  color: #d19a66;
}

.hljs-operator {
  color: #56b6c2;
}
</style>

<style scoped>
.article-body {
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-secondary);
  margin-bottom: 50px;

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 1.7;
    margin-bottom: 35px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 25px;
  }
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

  @media (max-width: 768px) {
    margin-top: 20px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    margin-top: 16px;
    margin-bottom: 10px;
  }
}

.article-body :deep(h1) {
  @media (max-width: 768px) {
    font-size: 24px;
  }

  @media (max-width: 480px) {
    font-size: 20px;
  }
}

.article-body :deep(h2) {
  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
}

.article-body :deep(h3) {
  @media (max-width: 768px) {
    font-size: 18px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
}

.article-body :deep(p) {
  margin-bottom: 16px;

  @media (max-width: 768px) {
    margin-bottom: 14px;
  }

  @media (max-width: 480px) {
    margin-bottom: 12px;
  }
}

.article-body :deep(code) {
  padding: 2px 4px;
  background: #282c34;
  border-radius: 3px;
  font-family: 'Courier New', monospace;

  @media (max-width: 768px) {
    font-size: 13px;
  }

  @media (max-width: 480px) {
    font-size: 12px;
    padding: 1px 3px;
  }
}

.article-body :deep(pre) {
  padding: 16px;
  background: #282c34;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 0;

  @media (max-width: 768px) {
    padding: 12px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    font-size: 12px;
  }
}

.article-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 16px 0;

  @media (max-width: 768px) {
    margin: 12px 0;
  }

  @media (max-width: 480px) {
    margin: 10px 0;
  }
}

/* 代码块容器样式 */
.article-body :deep(.code-block-container) {
  position: relative;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    margin-bottom: 10px;
  }
}

/* 复制按钮样式 */
.article-body :deep(.copy-btn) {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  color: #abb2bf;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
    color: #ffffff;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    top: 6px;
    right: 6px;
    padding: 4px 8px;
    font-size: 11px;
  }

  @media (max-width: 480px) {
    top: 4px;
    right: 4px;
    padding: 3px 6px;
    font-size: 10px;
  }
}
</style>
