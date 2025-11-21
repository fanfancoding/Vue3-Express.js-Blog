<template>
  <div>22222</div>
</template>

<script setup>
import { defineOptions, ref, onMounted, watchEffect } from 'vue'
import { getArticleListRequest } from '@/api/manage'
import { useRoute } from 'vue-router'
import { handleResponse } from '@/utils/common'
import { useBlogTypeStore } from '@/stores'
defineOptions({
  name: 'ArticlePage',
})

const route = useRoute()
const articleList = ref([])
const category = ref('')

watchEffect(() => {
  category.value = route.query.category
  console.log(category.value)
  getArticleListByCategory()
})

async function getArticleListByCategory() {
  const res = await getArticleListRequest({ category: category.value })
  const data = handleResponse(res) || []
  articleList.value = data.rows || []
}

const { getBlogTypeList } = useBlogTypeStore()
onMounted(() => {
  getBlogTypeList()
  console.log()
  getArticleListByCategory()
})
</script>

<style scoped></style>
