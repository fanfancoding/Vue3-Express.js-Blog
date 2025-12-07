<template>
  <div
    v-for="item in blogItem"
    :key="item.id"
    class="list-item-card w-full rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow mb-4"
    :style="{
      backgroundColor: 'var(--bg-secondary)',
      '--hover-bg-color': 'var(--bg-primary)'
    }"
    @click="handleClick(item.id)"
  >
    <h2
      class="item-title font-bold pb-7"
      :style="{ color: 'var(--text-primary)' }"
    >{{ item.title }}</h2>
    <div
      class="item-description line-clamp-3 font-normal"
      :style="{ color: 'var(--text-secondary)' }"
    >{{ item.description }}</div>
    <div
      class="item-meta py-4"
      :style="{ color: 'var(--text-secondary)' }"
    >
      <div class="meta-info flex justify-start items-center flex-wrap">
        <div class="meta-item">Tarzan</div>
        <div class="meta-divider">|</div>
        <div class="meta-item">{{ item.blogType?.name }}</div>
        <div class="meta-divider">|</div>
        <div class="flex items-center">
          <el-icon><View class="w-4 h-4" /></el-icon>
        </div>
        <div class="meta-item px-2">{{ item.scanNumber }}</div>
        <div class="meta-divider">|</div>
        <div class="meta-item meta-date">{{ formatDate(item.createDate) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { watch, ref } from 'vue'
import { useRouter } from 'vue-router'
import { View } from '@element-plus/icons-vue'
import dayjs from 'dayjs'

defineOptions({
  name: 'ListItem',
})

const router = useRouter()

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
})

const blogItem = ref({})

watch(
  () => props.item,
  (newVal) => {
    if (newVal instanceof Object) {
      blogItem.value = newVal
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

// 格式化日期（与详情页保持一致）
function formatDate(timestamp) {
  // 如果 timestamp 是字符串，转换为数字
  const ts = typeof timestamp === 'string' ? Number(timestamp) : timestamp
  return dayjs(ts).format('YYYY-MM-DD HH:mm:ss')
}

// 点击跳转到文章详情
function handleClick(articleId) {
  router.push({
    name: 'ArticleDetailPage',
    params: {
      id: articleId,
    },
  })
}
</script>

<style lang="scss" scoped>
.list-item-card {
  height: 180px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--hover-bg-color) !important;
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: 150px;
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    min-height: 130px;
  }

  .item-title {
    font-size: 20px;

    @media (max-width: 768px) {
      font-size: 18px;
      padding-bottom: 1rem;
    }

    @media (max-width: 480px) {
      font-size: 16px;
      padding-bottom: 0.75rem;
    }
  }

  .item-description {
    font-size: 14px;

    @media (max-width: 768px) {
      font-size: 13px;
      -webkit-line-clamp: 2;
    }

    @media (max-width: 480px) {
      font-size: 12px;
      -webkit-line-clamp: 2;
    }
  }

  .item-meta {
    @media (max-width: 768px) {
      padding: 0.75rem 0;
    }

    @media (max-width: 480px) {
      padding: 0.5rem 0;
    }

    .meta-info {
      font-size: 14px;
      gap: 0.25rem;

      @media (max-width: 768px) {
        font-size: 13px;
      }

      @media (max-width: 480px) {
        font-size: 11px;
        gap: 0.15rem;
      }

      .meta-item {
        @media (max-width: 480px) {
          padding: 0 0.25rem;
        }
      }

      .meta-divider {
        padding: 0 0.5rem;

        @media (max-width: 768px) {
          padding: 0 0.35rem;
        }

        @media (max-width: 480px) {
          padding: 0 0.25rem;
        }
      }

      .meta-date {
        @media (max-width: 480px) {
          font-size: 10px;
        }
      }
    }
  }
}
</style>
