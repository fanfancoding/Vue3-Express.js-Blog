<template>
  <div class="about-site-container">
    <div class="content-wrapper bg-white rounded-xl shadow-md p-10 my-10">
      <h1 class="text-4xl font-bold mb-8 text-[#82411c] flex items-center gap-3">
        <el-icon :size="40"><Monitor /></el-icon>
        关于网站
      </h1>

      <div class="prose prose-lg leading-relaxed space-y-6">
        <!-- 网站介绍 -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-[#82411c]">🌐 网站简介</h2>
          <p class="text-gray-700 mb-4">
            欢迎来到
            <strong class="text-[#82411c]">Tarzan's Blog</strong
            >！这是一个专注于技术分享和生活记录的个人博客平台。
          </p>
          <p class="text-gray-700 mb-4">
            在这里，我会分享前端开发、后端技术、编程经验以及日常生活的点滴。希望通过这个平台，能够帮助到更多对技术感兴趣的朋友，同时也记录自己的成长轨迹。
          </p>
        </section>

        <!-- 技术架构 -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-[#82411c]">🛠️ 技术架构</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="p-4 bg-[#fef5f0] rounded-lg">
              <h3 class="font-semibold text-[#82411c] mb-2">前端技术</h3>
              <ul class="text-gray-700 space-y-1 text-sm pl-4">
                <li>Vue 3 - 渐进式 JavaScript 框架</li>
                <li>Element Plus - UI 组件库</li>
                <li>Unocss - 实用优先的 CSS 框架</li>
                <li>Vite - 下一代前端构建工具</li>
                <li>Vue Router - 官方路由管理器</li>
                <li>Pinia - Vue 状态管理</li>
              </ul>
            </div>
            <div class="p-4 bg-[#fef5f0] rounded-lg">
              <h3 class="font-semibold text-[#82411c] mb-2">后端技术</h3>
              <ul class="text-gray-700 space-y-1 text-sm pl-4">
                <li>Node.js - JavaScript 运行时</li>
                <li>Express - Web 应用框架</li>
                <li>Sequelize - ORM 框架</li>
                <li>MySQL - 关系型数据库</li>
                <li>JWT - 身份验证</li>
                <li>Markdown-it - Markdown 解析器</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- 功能特性 -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-[#82411c]">✨ 功能特性</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div class="flex items-start gap-2">
              <el-icon :size="20" color="#82411c" class="mt-1"><CircleCheck /></el-icon>
              <div>
                <p class="font-semibold text-gray-800">文章管理</p>
                <p class="text-sm text-gray-600">支持 Markdown 编辑，文章分类管理</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <el-icon :size="20" color="#82411c" class="mt-1"><CircleCheck /></el-icon>
              <div>
                <p class="font-semibold text-gray-800">搜索功能</p>
                <p class="text-sm text-gray-600">快速搜索文章标题和内容</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <el-icon :size="20" color="#82411c" class="mt-1"><CircleCheck /></el-icon>
              <div>
                <p class="font-semibold text-gray-800">分类筛选</p>
                <p class="text-sm text-gray-600">按技术、随笔、生活等分类浏览</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <el-icon :size="20" color="#82411c" class="mt-1"><CircleCheck /></el-icon>
              <div>
                <p class="font-semibold text-gray-800">响应式设计</p>
                <p class="text-sm text-gray-600">适配各种设备屏幕尺寸</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <el-icon :size="20" color="#82411c" class="mt-1"><CircleCheck /></el-icon>
              <div>
                <p class="font-semibold text-gray-800">代码高亮</p>
                <p class="text-sm text-gray-600">支持多种编程语言语法高亮</p>
              </div>
            </div>
            <div class="flex items-start gap-2">
              <el-icon :size="20" color="#82411c" class="mt-1"><CircleCheck /></el-icon>
              <div>
                <p class="font-semibold text-gray-800">后台管理</p>
                <p class="text-sm text-gray-600">完善的内容管理后台系统</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 版本信息 -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-[#82411c]">📦 版本信息</h2>
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span class="text-gray-600">当前版本：</span>
                <span class="font-semibold text-gray-800">v1.0.0</span>
              </div>
              <div>
                <span class="text-gray-600">更新日期：</span>
                <span class="font-semibold text-gray-800">2025-11-22</span>
              </div>
              <div>
                <span class="text-gray-600">运行天数：</span>
                <span class="font-semibold text-gray-800">{{ runningDays }} 天</span>
              </div>
              <div>
                <span class="text-gray-600">文章总数：</span>
                <span class="font-semibold text-gray-800">{{ totalArticles }} 篇</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 开发计划 -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-[#82411c]">🚀 开发计划</h2>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-start gap-2">
              <el-icon :size="16" color="#82411c" class="mt-1"><Clock /></el-icon>
              <span>评论系统优化</span>
            </li>
            <li class="flex items-start gap-2">
              <el-icon :size="16" color="#82411c" class="mt-1"><Clock /></el-icon>
              <span>留言板</span>
            </li>
            <li class="flex items-start gap-2">
              <el-icon :size="16" color="#82411c" class="mt-1"><Clock /></el-icon>
              <span>访问统计分析</span>
            </li>
            <li class="flex items-start gap-2">
              <el-icon :size="16" color="#82411c" class="mt-1"><Clock /></el-icon>
              <span>深色模式支持</span>
            </li>
            <li class="flex items-start gap-2">
              <el-icon :size="16" color="#82411c" class="mt-1"><Clock /></el-icon>
              <span>语言切换功能</span>
            </li>
            <li class="flex items-start gap-2">
              <el-icon :size="16" color="#82411c" class="mt-1"><Clock /></el-icon>
              <span>友情链接</span>
            </li>
          </ul>
        </section>

        <!-- 致谢 -->
        <section class="mt-10 p-6 bg-[#fef5f0] rounded-lg border-l-4 border-[#82411c]">
          <h3 class="text-xl font-semibold mb-3 text-[#82411c]">💖 特别感谢</h3>
          <p class="text-gray-700">
            UI以及交互设计借鉴了以下开源项目：
            <a
              href="https://flowersink.com/welcome"
              target="_blank"
              class="text-[#82411c] hover:text-[#a0522d]"
              >Flowersink</a
            >
          </p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Monitor, CircleCheck, Clock } from '@element-plus/icons-vue'
import { useBlogTypeStore } from '@/stores'

defineOptions({
  name: 'AboutSitePage',
})

const blogTypeStore = useBlogTypeStore()

// 计算网站运行天数（从 2025-11-01 开始）
const runningDays = computed(() => {
  const startDate = new Date('2025-11-01')
  const today = new Date()
  const diffTime = Math.abs(today - startDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
})

// 计算文章总数
const totalArticles = computed(() => {
  return blogTypeStore.blogTypeList.reduce((sum, item) => sum + (item.articleCount || 0), 0)
})
</script>

<style lang="scss" scoped>
.about-site-container {
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    max-width: 100%;
  }

  .content-wrapper {
    @media (max-width: 768px) {
      padding: 1.5rem !important;
      margin: 1.5rem 0 !important;
    }

    @media (max-width: 480px) {
      padding: 1rem !important;
      margin: 1rem 0 !important;
    }

    h1 {
      @media (max-width: 768px) {
        font-size: 1.75rem;
      }

      @media (max-width: 480px) {
        font-size: 1.5rem;
      }
    }

    h2 {
      @media (max-width: 768px) {
        font-size: 1.5rem;
      }

      @media (max-width: 480px) {
        font-size: 1.25rem;
      }
    }

    h3 {
      @media (max-width: 768px) {
        font-size: 1.25rem;
      }

      @media (max-width: 480px) {
        font-size: 1.1rem;
      }
    }

    .prose {
      @media (max-width: 768px) {
        font-size: 15px;
      }

      @media (max-width: 480px) {
        font-size: 14px;
      }

      p,
      ul,
      li,
      div {
        @media (max-width: 768px) {
          font-size: 15px;
        }

        @media (max-width: 480px) {
          font-size: 14px;
        }
      }
    }

    section {
      @media (max-width: 768px) {
        margin-bottom: 1.5rem !important;
      }

      @media (max-width: 480px) {
        margin-bottom: 1rem !important;
      }
    }

    .grid {
      @media (max-width: 768px) {
        grid-template-columns: 1fr !important;
        gap: 0.75rem !important;
      }
    }

    .bg-gray-50 {
      @media (max-width: 768px) {
        padding: 1rem !important;
      }

      @media (max-width: 480px) {
        padding: 0.75rem !important;
      }
    }
  }

  :deep(.el-icon) {
    @media (max-width: 768px) {
      font-size: 18px;
    }

    @media (max-width: 480px) {
      font-size: 16px;
    }
  }
}
</style>
