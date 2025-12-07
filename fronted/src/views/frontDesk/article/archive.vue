<template>
  <div class="archive-page">
    <div class="archive-header">
      <h1>文归档</h1>
    </div>

    <el-skeleton v-if="loading" :rows="6" animated />

    <div v-else class="archive-list">
      <div v-for="(items, ym) in grouped" :key="ym" class="archive-block">
        <div class="archive-title">
          <span class="dot" />
          <h2>{{ ym }}</h2>
          <span class="count">共 {{ items.length }} 篇</span>
        </div>
        <ul>
          <li v-for="item in items" :key="item.id" @click="goDetail(item.id)">
            <span class="date">{{ formatDate(item.createDate, 'MM-DD') }}</span>
            <span class="title">{{ item.title }}</span>
            <span class="meta"
              >{{ item.blogType?.name || '未分类' }} · {{ item.scanNumber }} 阅读</span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { getBlogListRequest } from '@/api/blog'
import { handleResponse } from '@/utils/common'

defineOptions({ name: 'ArticleArchivePage' })

const router = useRouter()
const loading = ref(false)
const list = ref([])

const formatDate = (date, fmt = 'YYYY-MM-DD') => {
  return dayjs(Number(date)).format(fmt)
}

const grouped = computed(() => {
  const map = {}
  list.value.forEach((item) => {
    const ym = formatDate(item.createDate, 'YYYY-MM')
    if (!map[ym]) map[ym] = []
    map[ym].push(item)
  })
  // 排序：年月降序
  return Object.fromEntries(Object.entries(map).sort(([a], [b]) => (a > b ? -1 : 1)))
})

const goDetail = (id) => {
  router.push({ name: 'ArticleDetailPage', params: { id } })
}

const fetchData = async () => {
  loading.value = true
  try {
    // 拉取足够大的页数，确保覆盖全部
    const res = await getBlogListRequest({ page: 1, limit: 1000 })
    const data = handleResponse(res, false)
    list.value = (data?.rows || data?.list || []).sort(
      (a, b) => Number(b.createDate) - Number(a.createDate),
    )
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped lang="scss">
.archive-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px 40px;
  color: var(--text-secondary);
}

.archive-header {
  margin-bottom: 24px;

  h1 {
    font-size: 26px;
    color: var(--text-primary, #82411c);
    margin-bottom: 6px;
  }

  p {
    color: var(--text-muted, #606266);
    font-size: 14px;
  }
}

.archive-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.archive-block {
  background: var(--bg-secondary);
  border-radius: 10px;
  padding: 16px 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    background: var(--bg-primary);
  }
}

.archive-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;

  .dot {
    width: 10px;
    height: 10px;
    background: var(--accent-color);
    border-radius: 50%;
  }

  h2 {
    font-size: 18px;
    color: var(--text-primary);
    margin: 0;
  }

  .count {
    font-size: 13px;
    color: var(--text-secondary);
  }
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: grid;
    grid-template-columns: 70px 1fr auto;
    gap: 12px;
    align-items: center;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition:
      background 0.2s ease,
      transform 0.2s ease;
    color: inherit;

    &:hover {
      background: var(--hover-bg);
      color: #fff;
      transform: translateX(4px);
    }

    .date {
      color: var(--accent-color);
      font-weight: 600;
      font-size: 13px;
    }

    .title {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-primary);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .meta {
      font-size: 12px;
      color: var(--text-muted, #606266);
      text-align: right;
      white-space: nowrap;
    }
  }
}

@media (max-width: 640px) {
  .archive-page {
    padding: 16px 12px 28px;
  }

  ul li {
    grid-template-columns: 60px 1fr;
    grid-template-rows: auto auto;
    gap: 6px;

    .meta {
      grid-column: 1 / -1;
      text-align: left;
    }
  }
}
</style>
