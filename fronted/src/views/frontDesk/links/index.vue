<template>
  <div>
    <h1 class="text-3xl font-bold mb-12">Links</h1>
    
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <a 
        v-for="link in linkList" 
        :key="link.id" 
        :href="link.url"
        target="_blank"
        class="group p-6 border border-gray-100 hover:border-black transition-colors"
      >
        <div class="flex items-center gap-3 mb-3">
          <img 
            v-if="link.icon" 
            :src="link.icon" 
            :alt="link.name"
            class="w-6 h-6 rounded-full"
          />
          <div v-else class="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold">
            {{ link.name.charAt(0) }}
          </div>
          <h3 class="font-medium group-hover:underline">{{ link.name }}</h3>
        </div>
        <p class="text-sm text-gray-500 leading-relaxed">
          {{ link.description }}
        </p>
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import request from '@/utils/request' // Assuming direct request usage or need to create api/link.js

defineOptions({
  name: 'LinksPage',
})

const linkList = ref([])

async function getLinkList() {
  try {
    // We haven't created api/link.js yet, so using request directly or we should create it.
    // Let's assume we'll create api/link.js next or use direct axios if simple.
    // For consistency, I'll use a direct request here if api file not exists, 
    // but better to create the api file.
    const res = await request.get('/link/list')
    if (res.code === 0 || res.code === 200) {
      linkList.value = res.data
    }
  } catch (error) {
    console.error('Failed to fetch links:', error)
  }
}

onMounted(() => {
  getLinkList()
})
</script>
