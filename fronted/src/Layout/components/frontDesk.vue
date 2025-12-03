<template>
  <div class="front-desk-container h-screen flex flex-col overflow-hidden">
    <!-- header -->
    <div
      class="header-wrapper flex items-center justify-center bg-[#fff] text-[#82411c] flex-shrink-0"
    >
      <el-row :gutter="20" class="w-full header-row">
        <el-col :xs="4" :sm="3" :md="2" :lg="2">
          <!-- <img :src="logo" alt="logo" class="logo-img" /> -->
        </el-col>
        <el-col :xs="16" :sm="18" :md="20" :lg="20">
          <div class="nav-menu flex justify-center items-center h-full">
            <el-link href="/blog/home" class="nav-link">
              <div class="flex items-center gap-1 whitespace-nowrap">
                <el-icon><HomeFilled /></el-icon>
                <span class="nav-text">首页</span>
              </div>
            </el-link>
            <div class="relative dropdown-container">
              <el-link class="nav-link">
                <div class="flex items-center gap-1 whitespace-nowrap">
                  <el-icon><Reading /></el-icon>
                  <span class="nav-text">文章</span>
                </div>
              </el-link>
              <div class="dropdown-menu">
                <el-link
                  v-for="item in blogTypeList"
                  :key="item.value"
                  @click="handleCategoryClick(item.value)"
                  class="dropdown-item"
                >
                  <span class="text-[16px]">{{ item.label }}</span>
                </el-link>
              </div>
            </div>
            <div class="relative dropdown-container">
              <el-link class="nav-link">
                <div class="flex items-center gap-1 whitespace-nowrap">
                  <el-icon><Collection /></el-icon>
                  <span class="nav-text">关于</span>
                </div>
              </el-link>
              <div class="dropdown-menu">
                <el-link @click="handleRoutePush('AboutMePage')" class="dropdown-item">
                  <span class="text-[16px]">关于我</span>
                </el-link>
                <el-link @click="handleRoutePush('AboutSitePage')" class="dropdown-item">
                  <span class="text-[16px]">关于网站</span>
                </el-link>
              </div>
            </div>
          </div>
        </el-col>
        <!-- <el-col :xs="4" :sm="3" :md="2" :lg="2" class="flex items-center justify-end cat-wrapper">
          <img :src="cat" alt="cat" class="cat-img" />
        </el-col> -->
      </el-row>
    </div>

    <!-- container -->
    <div class="flex-1 bg-[#eef0f3] overflow-y-auto content-wrapper min-h-0">
      <router-view />
    </div>

    <!-- footer -->
    <div class="footer-wrapper flex-shrink-0 bg-[#eef0f3] text-[#82411c] footer-container">
      <div class="flex items-center justify-center h-full px-4">
        <span class="footer-text text-center">Copyright © 2025 Blog. All rights reserved.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElLink } from 'element-plus'
import { HomeFilled, Reading, Collection } from '@element-plus/icons-vue'
// import cat from '@/assets/cat-gun.gif'
// import logo from '@/assets/logo.png'
import { useRouter } from 'vue-router'
import { useBlogTypeStore } from '@/stores'
const blogTypeStore = useBlogTypeStore()
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
onMounted(async () => {
  blogTypeList.value = (await blogTypeStore.getBlogTypeList()).map((item) => {
    return {
      value: item.id,
      label: item.name,
    }
  })
})
</script>

<style lang="scss" scoped>
.front-desk-container {
  background-color: #eef0f3;

  // 响应式头部
  .header-wrapper {
    padding: 0.5rem 1rem;

    @media (max-width: 768px) {
      padding: 0.5rem 0.5rem;
    }
  }

  .header-row {
    align-items: center;
  }

  .logo-img {
    width: 7.5rem;
    height: 3rem;
    margin-top: 0.4rem;

    @media (max-width: 768px) {
      width: 3rem;
      height: 2.5rem;
      margin-top: 0.2rem;
    }
  }

  .nav-menu {
    gap: 6.5rem;

    @media (max-width: 1200px) {
      gap: 3rem;
    }

    @media (max-width: 992px) {
      gap: 2rem;
    }

    @media (max-width: 768px) {
      gap: 1rem;
      justify-content: space-around !important;
    }
  }

  .nav-text {
    font-size: 16px;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .cat-wrapper {
    margin-top: 0.6rem;

    @media (max-width: 768px) {
      margin-top: 0.2rem;
      justify-content: center !important;
    }
  }

  .cat-img {
    width: 3rem;
    height: 3rem;

    @media (max-width: 768px) {
      width: 2rem;
      height: 2rem;
    }
  }

  // 内容区域响应式
  .content-wrapper {
    padding: 0 12.5rem;

    @media (max-width: 1200px) {
      padding: 0 4rem;
    }

    @media (max-width: 768px) {
      padding: 0 1rem;
    }

    @media (max-width: 480px) {
      padding: 0 0.5rem;
    }
  }

  // 底部响应式
  .footer-wrapper {
    height: 100px;
    border-top: 1px solid #d3d3d3;

    @media (max-width: 768px) {
      height: 80px;
    }

    @media (max-width: 480px) {
      height: 60px;
    }
  }

  .footer-text {
    font-size: 14px;

    @media (max-width: 768px) {
      font-size: 12px;
    }

    @media (max-width: 480px) {
      font-size: 10px;
    }
  }

  :deep(.el-link) {
    --el-link-text-color: #82411c;
    --el-link-hover-text-color: #fff;
    padding: 6px 12px;
    font-weight: 400;

    @media (max-width: 768px) {
      padding: 4px 6px;
    }

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

    @media (max-width: 768px) {
      // 移动端触摸支持
      &:active .dropdown-menu {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
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

    @media (max-width: 768px) {
      min-width: 100px;
      left: 50%;
      transform: translateX(-50%) translateY(-10px);

      &.visible {
        transform: translateX(-50%) translateY(0);
      }
    }

    .dropdown-item {
      display: block;
      padding: 10px 20px;
      text-decoration: none;
      transition: all 0.2s ease;
      border-radius: 8px;

      @media (max-width: 768px) {
        padding: 8px 16px;
      }

      &:hover {
        background-color: #82411c;
      }
    }
  }
}
</style>
