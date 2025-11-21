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
            <div class="relative dropdown-container">
              <el-link>
                <div class="flex items-center gap-1 whitespace-nowrap">
                  <el-icon><Reading /></el-icon>
                  <span class="text-[16px]">文章</span>
                </div>
              </el-link>
              <div class="dropdown-menu">
                <el-link @click="handleCategoryClick('article')" class="dropdown-item">
                  <span class="text-[16px]">技术</span>
                </el-link>
                <el-link @click="handleCategoryClick('essay')" class="dropdown-item">
                  <span class="text-[16px]">生活</span>
                </el-link>
                <el-link @click="handleCategoryClick('all')" class="dropdown-item">
                  <span class="text-[16px]">归档</span>
                </el-link>
              </div>
            </div>
            <el-link @click="handleRoutePush('aboutPage')">
              <div class="flex items-center gap-1 whitespace-nowrap">
                <el-icon><Collection /></el-icon>
                <span class="text-[16px]">关于</span>
              </div>
            </el-link>
            <el-link @click="handleRoutePush('contactPage')">
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
import { onMounted, ref } from 'vue'
import { ElLink } from 'element-plus'
import { HomeFilled, Reading, Collection, Avatar } from '@element-plus/icons-vue'
import cat from '@/assets/cat-gun.gif'
import logo from '@/assets/logo.png'
import { useRouter } from 'vue-router'
import { useBlogTypeStore } from '@/stores'
const { getBlogTypeList } = useBlogTypeStore()
defineOptions({
  name: 'FrontDeskPage',
})

const router = useRouter()
const handleRoutePush = (name) => {
  router.push({ name: name })
}

const handleCategoryClick = (category) => {
  router.push({
    name: 'ArticlePage',
    query: { category: category },
  })
}

const blogTypeList = ref([])
onMounted(() => {
  getBlogTypeList()
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

  .dropdown-container {
    &:hover .dropdown-menu {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
  }

  .dropdown-menu {
    position: absolute;
    background-color: #ebeef1;
    top: 100%;
    left: 0;
    margin-top: 8px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 120px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 1000;
    padding: 8px 0;

    .dropdown-item {
      display: block;
      padding: 10px 20px;
      text-decoration: none;
      transition: all 0.2s ease;
      border-radius: 8px;

      &:hover {
        background-color: #82411c;
      }
    }
  }
}
</style>
