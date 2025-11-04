<template>
  <div>
    <template v-if="isShowManagement">
      <Management />
    </template>
    <template v-else>
      <FrontDesk />
    </template>
  </div>
</template>

<script setup>
import { defineOptions, ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import FrontDesk from '@/Layout/components/frontDesk.vue'
import Management from '@/Layout/components/management.vue'
const isShowManagement = ref(false)
const route = useRoute()

defineOptions({
  name: 'LayoutPage',
})

// 使用 watchEffect 响应式地监听路由变化
watchEffect(() => {
  isShowManagement.value = route.path.startsWith('/management')
})
</script>

<style scoped></style>
