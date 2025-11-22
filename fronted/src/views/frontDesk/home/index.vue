<template>
  <div class="home-container">
    <!-- Title -->
    <div class="title-wrapper flex justify-center my-[50px] text-[#82411c] font-bold">
      <h1 class="main-title">Welcome To Tarzan's Blog</h1>
    </div>

    <div class="w-full">
      <el-row :gutter="20" class="w-full">
        <el-col :xs="24" :sm="24" :md="24" :lg="19" :xl="19">
          <ListItem :item="blogList" />
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="5" :xl="5">
          <div class="sidebar-wrapper">
            <div class="profile-card bg-[white] shadow-md p-6 rounded-xl overflow-hidden">
              <div
                class="profile-img-wrapper flex justify-center align-center items-center overflow-hidden"
              >
                <img :src="cat" alt="cat" class="w-full h-full object-contain" />
              </div>
              <h2 class="flex justify-center text-[#7a4525] profile-name">Tarzan</h2>
              <div class="text-center py-6px profile-text">你好,我是Tarzan</div>
              <div class="text-center py-6px profile-text">这里是我分享技术 文章生活点滴的地方</div>
              <div class="text-center py-6px profile-text">希望你能在这里收获知识或者好心情</div>
            </div>
            <div class="stats-card bg-[white] shadow-md p-6 rounded-xl overflow-hidden mt-[15px]">
              <div class="flex items-center justify-center manuel-tag stats-grid">
                <div class="stat-item">
                  <el-tag effect="dark">{{ techArticleCount }}篇</el-tag>
                  <div class="mt-2 stat-label">技术文章</div>
                </div>
                <div class="stat-item">
                  <el-tag effect="dark">{{ essayArticleCount }}篇</el-tag>
                  <div class="mt-2 stat-label">随笔杂文</div>
                </div>
                <div class="stat-item">
                  <el-tag effect="dark">20天</el-tag>
                  <div class="mt-2 stat-label">网站运行</div>
                </div>
              </div>
              <el-button class="mt-2 w-full button-aligned" @click="handleRoutePush('AboutMePage')">
                了解Tarzan
              </el-button>
              <el-button
                class="mt-2 w-full button-aligned"
                @click="handleRoutePush('AboutSitePage')"
              >
                了解网站
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { getBlogListRequest } from '@/api/blog'
import ListItem from '@/components/listItem.vue'
import { handleResponse } from '@/utils/common'
import cat from '@/assets/cat.gif'
import { useBlogTypeStore } from '@/stores'
import { useRouter } from 'vue-router'
const blogTypeStore = useBlogTypeStore()
const router = useRouter()
const handleRoutePush = (name) => {
  router.push({ name: name })
}
const techArticleCount = computed(() => {
  const techCategory = blogTypeStore.blogTypeList.find((item) => item.name === '技术')
  return techCategory ? techCategory.articleCount : 0
})

const essayArticleCount = computed(() => {
  return blogTypeStore.blogTypeList
    .filter((item) => item.name === '随笔' || item.name === '生活')
    .reduce((sum, item) => sum + (item.articleCount || 0), 0)
})
defineOptions({
  name: 'HomePage',
})

const blogList = ref([])
async function getBlogList() {
  await getBlogListRequest({
    page: 1,
    limit: 10,
  }).then((res) => {
    blogList.value = handleResponse(res, false).rows
  })
}
onMounted(() => {
  getBlogList()
})
</script>

<style lang="scss" scoped>
.home-container {
  .title-wrapper {
    .main-title {
      font-size: 2rem;
      text-align: center;

      @media (max-width: 768px) {
        font-size: 1.5rem;
      }

      @media (max-width: 480px) {
        font-size: 1.25rem;
      }
    }
  }

  .sidebar-wrapper {
    @media (max-width: 1024px) {
      margin-top: 2rem;
    }
  }

  .profile-card {
    .profile-img-wrapper {
      width: 200px;
      height: 150px;
      margin: 0 auto;

      @media (max-width: 768px) {
        width: 150px;
        height: 112px;
      }

      @media (max-width: 480px) {
        width: 120px;
        height: 90px;
      }
    }

    .profile-name {
      margin-top: -30px;

      @media (max-width: 768px) {
        margin-top: -20px;
        font-size: 1.25rem;
      }

      @media (max-width: 480px) {
        margin-top: -15px;
        font-size: 1.1rem;
      }
    }

    .profile-text {
      font-size: 14px;

      @media (max-width: 768px) {
        font-size: 13px;
      }

      @media (max-width: 480px) {
        font-size: 12px;
      }
    }
  }

  .stats-card {
    height: auto;
    min-height: 180px;

    @media (max-width: 768px) {
      min-height: auto;
    }

    .stats-grid {
      gap: 2rem;
      flex-wrap: wrap;

      @media (max-width: 768px) {
        gap: 1.5rem;
      }

      @media (max-width: 480px) {
        gap: 1rem;
      }
    }

    .stat-item {
      text-align: center;

      .stat-label {
        font-size: 14px;

        @media (max-width: 768px) {
          font-size: 13px;
        }

        @media (max-width: 480px) {
          font-size: 12px;
        }
      }
    }
  }
}

.button-aligned {
  margin-left: 0 !important;
  margin-right: 0 !important;
  display: block;
  background-color: #fff;
  border-color: #82411c;
  color: #82411c;
  transition:
    background-color 0.3s,
    color 0.3s;

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px 15px;
  }

  @media (max-width: 480px) {
    font-size: 13px;
    padding: 6px 12px;
  }

  &:hover {
    background-color: #82411c;
    color: #fff;
  }
}

.manuel-tag {
  :deep(.el-tag) {
    --el-tag-bg-color: #82411c !important;
    --el-tag-border-color: #82411c !important;
    --el-tag-hover-color: #82411c !important;
    background-color: #82411c !important;
    border-color: #82411c !important;
    border: none !important;

    @media (max-width: 768px) {
      font-size: 13px;
      padding: 4px 8px;
    }

    @media (max-width: 480px) {
      font-size: 12px;
      padding: 3px 6px;
    }
  }
}
</style>
