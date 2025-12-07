<template>
  <!-- Title -->
  <div
    class="flex justify-center my-[50px] font-bold"
    :style="{ color: 'var(--text-primary)' }"
  >
    <h1>{{ currentCategoryName || '全部文章' }}</h1>
  </div>

  <div class="w-full article-container">
    <el-row :gutter="20" class="w-full">
      <!-- 文章列表区域 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="19" :xl="19">
        <div v-if="loading" class="text-center py-10">
          <el-icon class="is-loading" :size="40">
            <Loading />
          </el-icon>
          <div class="mt-4 text-gray-500">加载中...</div>
        </div>
        <div v-else-if="articleList.length === 0" class="text-center py-20">
          <el-empty description="暂无文章" />
        </div>
        <div v-else>
          <ListItem :item="articleList" />
        </div>

        <!-- 分页（只有当总数大于每页数量时才显示） -->
        <div
          v-if="total > pageParams.limit"
          class="pagination-wrapper flex justify-center mt-8 mb-8"
        >
          <el-pagination
            v-model:current-page="pageParams.page"
            v-model:page-size="pageParams.limit"
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            :layout="paginationLayout"
            :small="isMobile"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-col>

      <!-- 右侧分类筛选区域 -->
      <el-col :xs="24" :sm="24" :md="24" :lg="5" :xl="5">
        <div
          class="sidebar-filter shadow-md p-6 rounded-xl overflow-hidden sticky top-4"
          :style="{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-secondary)'
          }"
        >
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章"
            :suffix-icon="Search"
            @input="handleSearch"
          />
          <div class="category-list mt-4">
            <el-tag
              class="category-item"
              :class="{ active: !category }"
              @click="selectCategory('')"
              effect="light"
              type="warning"
            >
              <span class="category-name">全部</span>
              <span class="category-count" size="small">{{ totalArticleCount }}篇</span>
            </el-tag>
            <el-tag
              v-for="item in blogTypeStore.blogTypeList"
              :key="item.id"
              class="category-item"
              :class="{ active: category === item.id }"
              @click="selectCategory(item.id)"
              effect="light"
              type="warning"
            >
              <span class="category-name">{{ item.name }}</span>
              <span class="category-count" size="small"> {{ item.articleCount || 0 }}篇 </span>
            </el-tag>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { defineOptions, ref, watch, reactive, computed, onMounted, onUnmounted } from 'vue'
import { getArticleListRequest } from '@/api/manage'
import { useRoute, useRouter } from 'vue-router'
import { handleResponse } from '@/utils/common'
import { useBlogTypeStore } from '@/stores'
import ListItem from '@/components/listItem.vue'
import { Loading, Search } from '@element-plus/icons-vue'

defineOptions({
  name: 'ArticlePage',
})

const route = useRoute()
const router = useRouter()
const blogTypeStore = useBlogTypeStore()

const articleList = ref([])
const category = ref('')
const total = ref(0)
const loading = ref(false)
const searchKeyword = ref('')
const pageParams = reactive({
  page: 1,
  limit: 10,
})

// 移动端判断
const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

// 分页布局根据屏幕大小调整
const paginationLayout = computed(() => {
  if (window.innerWidth <= 480) {
    return 'prev, pager, next'
  } else if (window.innerWidth <= 768) {
    return 'total, prev, pager, next'
  } else {
    return 'total, sizes, prev, pager, next, jumper'
  }
})

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// 计算当前分类名称
const currentCategoryName = computed(() => {
  if (!category.value) return ''
  const currentCategory = blogTypeStore.blogTypeList.find((item) => item.id === category.value)
  return currentCategory?.name || ''
})

// 计算所有分类的文章总数
const totalArticleCount = computed(() => {
  return blogTypeStore.blogTypeList.reduce((sum, item) => sum + (item.articleCount || 0), 0)
})

// 监听路由变化
watch(
  () => route.query,
  (newQuery) => {
    // 确保 category 的类型一致（转换为数字或空字符串）
    category.value = newQuery.category ? Number(newQuery.category) : ''
    searchKeyword.value = newQuery.keyword || ''
    pageParams.page = Number(newQuery.page) || 1
    pageParams.limit = Number(newQuery.limit) || 10
    getArticleListByCategory()
  },
  {
    immediate: true,
  },
)

// 获取文章列表
async function getArticleListByCategory() {
  try {
    loading.value = true
    const params = {
      page: pageParams.page,
      limit: pageParams.limit,
    }
    // 只有在有分类ID时才添加 categoryId 参数
    if (category.value) {
      params.categoryId = category.value
    }
    // 如果有搜索关键字，添加到请求参数中
    if (searchKeyword.value && searchKeyword.value.trim()) {
      params.keyword = searchKeyword.value.trim()
    }
    const res = await getArticleListRequest(params)
    const data = handleResponse(res, false) || {}
    articleList.value = data.rows || []
    total.value = data.total || 0
  } catch (error) {
    console.error('获取文章列表失败:', error)
    articleList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 选择分类
function selectCategory(categoryId) {
  const query = {
    page: 1,
    limit: pageParams.limit,
  }
  // 如果选择了分类，添加分类参数
  if (categoryId) {
    query.category = categoryId
  }
  // 保留搜索关键字
  if (searchKeyword.value && searchKeyword.value.trim()) {
    query.keyword = searchKeyword.value.trim()
  }
  router.push({
    name: 'ArticlePage',
    query,
  })
}

// 分页大小改变
function handleSizeChange(newSize) {
  const query = {
    page: 1,
    limit: newSize,
  }
  if (category.value) {
    query.category = category.value
  }
  if (searchKeyword.value && searchKeyword.value.trim()) {
    query.keyword = searchKeyword.value.trim()
  }
  router.push({
    path: '/article',
    query,
  })
}

// 页码改变
function handleCurrentChange(newPage) {
  const query = {
    page: newPage,
    limit: pageParams.limit,
  }
  if (category.value) {
    query.category = category.value
  }
  if (searchKeyword.value && searchKeyword.value.trim()) {
    query.keyword = searchKeyword.value.trim()
  }
  router.push({
    path: '/article',
    query,
  })
}

// 搜索处理：使用防抖优化
let searchTimer = null
function handleSearch() {
  // 清除之前的定时器
  if (searchTimer) {
    clearTimeout(searchTimer)
  }
  // 设置新的定时器，500ms后执行搜索
  searchTimer = setTimeout(() => {
    const query = {
      page: 1,
      limit: pageParams.limit,
    }
    if (category.value) {
      query.category = category.value
    }
    if (searchKeyword.value && searchKeyword.value.trim()) {
      query.keyword = searchKeyword.value.trim()
    }
    router.push({
      name: 'ArticlePage',
      query,
    })
  }, 500)
}
</script>

<style lang="scss" scoped>
.article-container {
  // 标题响应式
  :deep(h1) {
    font-size: 2rem;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }

    @media (max-width: 480px) {
      font-size: 1.25rem;
    }
  }

  // 侧边栏在移动端的样式
  .sidebar-filter {
    @media (max-width: 1024px) {
      margin-top: 1.5rem;
      position: static !important;
    }

    @media (max-width: 768px) {
      padding: 1rem;
    }

    @media (max-width: 480px) {
      padding: 0.75rem;
    }
  }

  // 分页响应式
  .pagination-wrapper {
    :deep(.el-pagination) {
      @media (max-width: 768px) {
        .el-pagination__sizes,
        .el-pagination__jump {
          display: none;
        }
      }

      @media (max-width: 480px) {
        .el-pagination__total {
          display: none;
        }

        button,
        .el-pager li {
          min-width: 28px;
          height: 28px;
          line-height: 28px;
          font-size: 12px;
        }
      }
    }
  }
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    gap: 6px;
  }
}

.category-item {
  display: flex;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid var(--border-color);
  min-width: 60px;
  min-height: 32px;

  @media (max-width: 768px) {
    min-height: 28px;
    font-size: 13px;
  }

  @media (max-width: 480px) {
    min-height: 26px;
    font-size: 12px;
  }

  &:hover {
    background-color: var(--bg-primary);
    border-color: var(--accent-color);
  }

  &.active {
    background-color: var(--accent-color);
    color: white;
    border-color: var(--accent-color);

    .category-count {
      --el-tag-bg-color: rgba(255, 255, 255, 0.2);
      --el-tag-text-color: white;
      --el-tag-border-color: rgba(255, 255, 255, 0.3);
    }
  }

  .category-name {
    font-weight: 500;
    margin-right: 10px;

    @media (max-width: 768px) {
      margin-right: 8px;
      font-size: 13px;
    }

    @media (max-width: 480px) {
      margin-right: 6px;
      font-size: 12px;
    }
  }

  .category-count {
    min-width: 32px;
    text-align: center;

    @media (max-width: 768px) {
      min-width: 28px;
      font-size: 12px;
    }

    @media (max-width: 480px) {
      min-width: 26px;
      font-size: 11px;
    }
  }
}

:deep(.sidebar-filter .el-input__wrapper) {
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  border-color: var(--border-color);
}

:deep(.sidebar-filter .el-input__inner) {
  color: var(--text-secondary);
}

:deep(.el-pagination) {
  .btn-prev,
  .btn-next,
  .el-pager li {
    &:hover {
      color: var(--accent-color);
    }
    &.is-active {
      background-color: var(--accent-color);
      color: white;
    }
  }
}

:deep(.el-loading-spinner) {
  .circular {
    stroke: var(--accent-color);
  }
}

// 搜索框聚焦样式
:deep(.el-input) {
  .el-input__wrapper {
    &.is-focus {
      box-shadow: 0 0 0 1px var(--accent-color) inset;
    }
    &:hover {
      box-shadow: 0 0 0 1px var(--accent-color) inset;
    }

    @media (max-width: 768px) {
      font-size: 14px;
    }

    @media (max-width: 480px) {
      font-size: 13px;
    }
  }
}
</style>
