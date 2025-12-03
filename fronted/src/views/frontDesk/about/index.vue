<template>
  <div class="max-w-1200px mx-auto p-20px lt-lg:max-w-100% lt-lg:p-15px lt-md:p-10px lt-sm:p-8px">
    <div
      class="bg-white rounded-8px p-40px shadow-[0_2px_12px_rgba(0,0,0,0.1)] lt-md:p-24px lt-md:rounded-6px lt-sm:p-16px lt-sm:rounded-4px"
    >
      <h1
        class="text-32px font-bold mb-20px text-[#82411c] lt-md:text-24px lt-md:mb-16px lt-sm:text-20px lt-sm:mb-12px"
      >
        关于
      </h1>

      <div
        class="about-menu grid grid-cols-1 md:grid-cols-2 gap-20px lt-md:gap-16px lt-sm:gap-12px"
      >
        <router-link to="/blog/about/me" class="about-card">
          <el-card shadow="hover" class="h-full cursor-pointer transition-all hover:shadow-lg">
            <div class="flex flex-col items-center text-center p-20px lt-md:p-16px lt-sm:p-12px">
              <el-icon :size="48" class="text-[#82411c] mb-12px lt-md:text-40px lt-sm:text-32px">
                <User />
              </el-icon>
              <h3
                class="text-20px font-semibold text-[#82411c] mb-8px lt-md:text-18px lt-sm:text-16px"
              >
                关于我
              </h3>
              <p class="text-14px text-[#606266] lh-1.6 lt-sm:text-13px">
                了解我的个人经历和兴趣爱好
              </p>
            </div>
          </el-card>
        </router-link>

        <router-link to="/blog/about/site" class="about-card">
          <el-card shadow="hover" class="h-full cursor-pointer transition-all hover:shadow-lg">
            <div class="flex flex-col items-center text-center p-20px lt-md:p-16px lt-sm:p-12px">
              <el-icon :size="48" class="text-[#82411c] mb-12px lt-md:text-40px lt-sm:text-32px">
                <InfoFilled />
              </el-icon>
              <h3
                class="text-20px font-semibold text-[#82411c] mb-8px lt-md:text-18px lt-sm:text-16px"
              >
                关于网站
              </h3>
              <p class="text-14px text-[#606266] lh-1.6 lt-sm:text-13px">了解这个博客网站的信息</p>
            </div>
          </el-card>
        </router-link>

        <router-link to="/blog/about/message-board" class="about-card md:col-span-2">
          <el-card shadow="hover" class="h-full cursor-pointer transition-all hover:shadow-lg">
            <div class="flex flex-col items-center text-center p-20px lt-md:p-16px lt-sm:p-12px">
              <el-icon :size="48" class="text-[#82411c] mb-12px lt-md:text-40px lt-sm:text-32px">
                <ChatLineRound />
              </el-icon>
              <h3
                class="text-20px font-semibold text-[#82411c] mb-8px lt-md:text-18px lt-sm:text-16px"
              >
                留言板
              </h3>
              <p class="text-14px text-[#606266] lh-1.6 lt-sm:text-13px">
                给我留言，分享你的想法和建议
              </p>
            </div>
          </el-card>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User, InfoFilled, ChatLineRound } from '@element-plus/icons-vue'

defineOptions({
  name: 'AboutPage',
})
</script>

<style lang="scss" scoped>
.about-card {
  text-decoration: none;
  color: inherit;

  &:hover {
    transform: translateY(-2px);
  }

  :deep(.el-card) {
    border: 1px solid #ebeef5;

    &:hover {
      border-color: #82411c;
    }
  }
}
</style>
