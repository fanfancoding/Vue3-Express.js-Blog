<template>
  <div>
    <h1 class="text-3xl font-bold mb-12">Insights</h1>
    
    <div class="grid gap-8 md:grid-cols-2">
      <div 
        v-for="item in blogList" 
        :key="item.id" 
        class="p-6 border border-gray-100 hover:shadow-sm transition-shadow"
      >
        <div class="text-sm text-gray-400 mb-4 font-mono">
          {{ formatDate(item.createDate) }}
        </div>
        <h2 class="text-xl font-medium mb-3">
          <router-link :to="`/blog/article/detail/${item.id}`" class="hover:underline">
            {{ item.title }}
          </router-link>
        </h2>
        <p class="text-gray-600 line-clamp-4 leading-relaxed">
          {{ item.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getBlogListRequest } from '@/api/blog'
import { handleResponse } from '@/utils/common'
import dayjs from 'dayjs'

defineOptions({
  name: 'InsightsPage',
})

const blogList = ref([])

async function getBlogList() {
  try {
    const res = await getBlogListRequest({
      page: 1,
      limit: 20,
      type: 'insight'
    })
    const data = handleResponse(res, false)
    blogList.value = data.rows || data
  } catch (error) {
    console.error('Failed to fetch insights list:', error)
  }
}

const formatDate = (date) => {
  return dayjs(Number(date)).format('MMM DD, YYYY')
}

onMounted(() => {
  getBlogList()
})
</script>
