<template>
  <div>
    <h1>Front Desk</h1>
    <router-view />
  </div>
</template>

<script setup>
import { defineOptions } from 'vue'

defineOptions({
  name: 'FrontDeskPage',
})
</script>

<style lang="scss" scoped></style>
