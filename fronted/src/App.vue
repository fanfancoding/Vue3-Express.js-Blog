<template>
  <div class="m-0">
    <div v-if="showLogin">
      <Login />
    </div>
    <div v-else>
      <Layout />
    </div>
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

<style>
/* 全局样式重置 - 清除浏览器默认的8px margin */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

html {
  margin: 0;
  padding: 0;
}
</style>

<style scoped>
body {
  margin: 0 !important;
}
</style>
