<template>
  <div>
    <h1 class="text-3xl font-bold mb-12">Writing</h1>
    
    <div class="space-y-2">
      <ArticleCard 
        v-for="item in blogList" 
        :key="item.id" 
        :article="item" 
      />
    </div>

    <!-- Simple Pagination -->
    <div class="mt-12 flex justify-center gap-4" v-if="total > limit">
      <button 
        @click="changePage(page - 1)" 
        :disabled="page === 1"
        class="px-4 py-2 border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
      >
        Previous
      </button>
      <span class="py-2 text-gray-500">Page {{ page }}</span>
      <button 
        @click="changePage(page + 1)" 
        :disabled="blogList.length < limit"
        class="px-4 py-2 border border-gray-200 disabled:opacity-50 hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getBlogListRequest } from '@/api/blog'
import ArticleCard from '@/components/ArticleCard.vue'
import { handleResponse } from '@/utils/common'

defineOptions({
  name: 'WritingPage',
})

const blogList = ref([])
const page = ref(1)
const limit = 10
const total = ref(0)

async function getBlogList() {
  try {
    const res = await getBlogListRequest({
      page: page.value,
      limit: limit,
      type: 'article'
    })
    const data = handleResponse(res, false)
    blogList.value = data.rows || data
    total.value = data.total || 0
  } catch (error) {
    console.error('Failed to fetch writing list:', error)
  }
}

const changePage = (newPage) => {
  page.value = newPage
  getBlogList()
  window.scrollTo(0, 0)
}

onMounted(() => {
  getBlogList()
})
</script>
