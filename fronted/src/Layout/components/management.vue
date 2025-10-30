<template>
  <div>
    <h1>Management</h1>
    <router-view />
  </div>
</template>

<script setup>
import { defineOptions } from 'vue'

defineOptions({
  name: 'ManagementPage',
})
</script>

<style lang="scss" scoped></style>
