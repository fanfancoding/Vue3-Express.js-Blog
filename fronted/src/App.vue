<template>
  <div v-if="showLogin">
    <Login />
  </div>
  <div v-else>
    <Layout />
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import Login from '@/views/management/login/index.vue'
import Layout from '@/Layout/index.vue'

const route = useRoute()
const showLogin = ref(false)

// 使用 watchEffect 响应式地监听路由变化
watchEffect(() => {
  showLogin.value = route.path === '/login'
})
</script>

<style scoped></style>
