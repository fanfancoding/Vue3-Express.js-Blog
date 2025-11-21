<template>
  <div
    v-for="item in blogItem"
    :key="item.id"
    class="h-[180px] w-full bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg hover:bg-[#d9d9d6] transition-shadow mb-4"
    @click="handleClick(item.id)"
  >
    <h2 class="text-[#82411c] text-[20px] font-bold pb-7">{{ item.title }}</h2>
    <div class="text-[14px] text-[black] line-clamp-3 font-normal">{{ item.description }}</div>
    <div class="py-4 text-[gray]">
      <div class="flex justify-start items-center">
        <div>Tarzan</div>
        <div class="px-2">|</div>
        <div>{{ item.blogType?.name }}</div>
        <div class="px-2">|</div>
        <div class="flex items-center">
          <el-icon><View class="w-4 h-4" /></el-icon>
        </div>
        <div class="px-2">{{ item.scanNumber }}</div>
        <div class="pr-2">|</div>
        <div>{{ formatDate(item.createDate) }}</div>
      </div>
      <div></div>
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

<style lang="scss" scoped></style>
