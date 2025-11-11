<template>
  <div class="front-desk-container h-screen flex flex-col overflow-hidden">
    <!-- header -->
    <div class="flex items-center justify-center bg-[#fff] text-[#82411c] flex-shrink-0">
      <el-row :gutter="20" class="w-full">
        <el-col :span="2">
          <img :src="logo" alt="logo" class="w-30 h-12 mt-[7px]" />
        </el-col>
        <el-col :span="20">
          <div class="flex gap-26 justify-center items-center h-full">
            <el-link href="/blog/home">
              <div class="flex items-center gap-1 whitespace-nowrap">
                <el-icon><HomeFilled /></el-icon>
                <span class="text-[16px]">首页</span>
              </div>
            </el-link>
            <el-link href="/blog/article">
              <div class="flex items-center gap-1 whitespace-nowrap">
                <el-icon><Reading /></el-icon>
                <span class="text-[16px]">文章</span>
              </div>
            </el-link>
            <el-link href="/blog/about">
              <div class="flex items-center gap-1 whitespace-nowrap">
                <el-icon><Collection /></el-icon>
                <span class="text-[16px]">关于</span>
              </div>
            </el-link>
            <el-link href="/blog/contact">
              <div class="flex items-center gap-1 whitespace-nowrap">
                <el-icon><Avatar /></el-icon>
                <span class="text-[16px]">联系</span>
              </div>
            </el-link>
          </div>
        </el-col>
        <el-col :span="2" class="flex items-center mt-[10px]">
          <img :src="cat" alt="cat" class="w-12 h-12" />
        </el-col>
      </el-row>
    </div>

    <!-- container -->
    <div class="flex-1 bg-[#eef0f3] overflow-y-auto px-50 min-h-0">
      <router-view />
    </div>

    <!-- footer -->
    <div class="flex-shrink-0 h-[100px] bg-[#eef0f3] text-[#82411c] footer-container">
      <div class="flex items-center justify-center h-full">
        <span>Copyright © 2025 Blog. All rights reserved.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElLink } from 'element-plus'
import { HomeFilled, Reading, Collection, Avatar } from '@element-plus/icons-vue'
import cat from '@/assets/cat-gun.gif'
import logo from '@/assets/logo.png'

defineOptions({
  name: 'FrontDeskPage',
})
</script>

<style lang="scss" scoped>
.front-desk-container {
  background-color: #eef0f3;
  :deep(.el-link) {
    --el-link-text-color: #82411c;
    --el-link-hover-text-color: #fff;
    padding: 6px 12px;
    font-weight: 400;
    &:hover {
      background-color: #82411c;
      border-radius: 8px;
    }
  }
  .footer-container {
    border-top: 1px solid #d3d3d3;
  }
}
</style>
