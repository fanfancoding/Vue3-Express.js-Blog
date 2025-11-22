<template>
  <div class="about-me-container">
    <div class="content-wrapper bg-white rounded-xl shadow-md p-10 my-10">
      <h1 class="text-4xl font-bold mb-8 text-[#82411c] flex items-center gap-3">
        <el-icon :size="40"><User /></el-icon>
        关于我
      </h1>

      <div class="prose prose-lg leading-relaxed space-y-6">
        <!-- 个人介绍 -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-[#82411c]">👋 你好</h2>
          <p class="text-gray-700 my-4">
            我是
            <strong class="text-[#82411c]">Tarzan</strong
            >，一名热爱技术的开发者和内容创作者,当前居住在杭州。
          </p>
          <p>
            <strong class="text-[#82411c]">Tarzan</strong>
            的昵称来源于
            <a
              href="https://zh.wikipedia.org/wiki/%E4%BA%BA%E7%8C%BF%E6%B3%B0%E5%B1%B1"
              target="_blank"
              class="text-[#82411c] hover:text-[#a0522d]"
              >《人猿泰山》</a
            >
            ，寓意着勇敢、自由、坚强,
            <strong class="text-[#82411c]">Tarzan</strong> 也是一名LOL一名我很喜爱的职业选手,
            希望我们都能勇敢、自由、坚强的对待生活
          </p>
          <p class="text-gray-700 my-4">
            我喜欢探索新技术、分享知识，并通过代码创造有价值的东西。这个博客是我记录学习历程、分享技术见解和生活感悟的地方。
          </p>
        </section>

        <!-- 技术栈 -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-[#82411c]">💻 技术栈</h2>
          <div class="flex flex-wrap gap-2">
            <el-tag effect="plain" type="warning">Vue.js</el-tag>
            <el-tag effect="plain" type="warning">Uniapp</el-tag>
            <el-tag effect="plain" type="warning">React</el-tag>
            <el-tag effect="plain" type="warning">Node.js</el-tag>
            <el-tag effect="plain" type="warning">Express</el-tag>
            <el-tag effect="plain" type="warning">MySQL</el-tag>
            <el-tag effect="plain" type="warning">JavaScript</el-tag>
            <el-tag effect="plain" type="warning">TypeScript</el-tag>
            <el-tag effect="plain" type="warning">Unocss</el-tag>
          </div>
        </section>

        <!-- 兴趣爱好 -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-[#82411c]">🎯 兴趣爱好</h2>
          <ul class="list-disc list-inside text-gray-700 space-y-2">
            <li>💡 学习新技术和最佳实践</li>
            <li>📝 技术写作和知识分享</li>
            <li>🎨 探索 UI/UX 设计</li>
            <li>🌍 开源项目贡献</li>
            <li>📚 阅读技术书籍</li>
          </ul>
        </section>

        <!-- 联系方式 -->
        <section class="mb-8">
          <h2 class="text-2xl font-semibold mb-4 text-[#82411c]">📫 联系我</h2>
          <p class="text-gray-700 mb-4">
            如果你对我的文章感兴趣，或者想与我交流技术、合作项目，欢迎通过以下方式联系我：
          </p>
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-2">
              <el-icon :size="20" color="#82411c"><Message /></el-icon>
              <span class="text-gray-700"
                >邮箱：<a
                  href="mailto:3279913400@qq.com"
                  class="text-[#82411c] underline hover:text-[#a0522d]"
                  >3279913400@qq.com</a
                ></span
              >
            </div>
            <div class="flex items-center gap-2">
              <el-icon :size="20" color="#82411c"><Link /></el-icon>
              <span class="text-gray-700"
                >GitHub：<a
                  href="https://github.com/fanfancoding"
                  target="_blank"
                  class="text-[#82411c] underline hover:text-[#a0522d]"
                  >@fanfancoding</a
                ></span
              >
            </div>
          </div>
        </section>

        <!-- 座右铭 -->
        <section class="mt-10 p-6 bg-[#fef5f0] rounded-lg border-l-4 border-[#82411c]">
          <p class="text-lg italic text-gray-700 text-center">"代码改变世界，技术创造未来。"</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { User, Message, Link } from '@element-plus/icons-vue'

defineOptions({
  name: 'AboutMePage',
})
</script>

<style lang="scss" scoped>
.about-me-container {
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 1024px) {
    max-width: 100%;
  }

  .content-wrapper {
    @media (max-width: 768px) {
      padding: 1.5rem !important;
      margin: 1.5rem 0 !important;
    }

    @media (max-width: 480px) {
      padding: 1rem !important;
      margin: 1rem 0 !important;
    }

    h1 {
      @media (max-width: 768px) {
        font-size: 1.75rem;
      }

      @media (max-width: 480px) {
        font-size: 1.5rem;
      }
    }

    h2 {
      @media (max-width: 768px) {
        font-size: 1.5rem;
      }

      @media (max-width: 480px) {
        font-size: 1.25rem;
      }
    }

    .prose {
      @media (max-width: 768px) {
        font-size: 15px;
      }

      @media (max-width: 480px) {
        font-size: 14px;
      }

      p,
      ul,
      div {
        @media (max-width: 768px) {
          font-size: 15px;
        }

        @media (max-width: 480px) {
          font-size: 14px;
        }
      }
    }

    section {
      @media (max-width: 768px) {
        margin-bottom: 1.5rem !important;
      }

      @media (max-width: 480px) {
        margin-bottom: 1rem !important;
      }
    }
  }

  :deep(.el-tag) {
    --el-tag-bg-color: #fef5f0;
    --el-tag-border-color: #f4d1be;
    --el-tag-text-color: #82411c;
    --el-tag-hover-color: #82411c;

    @media (max-width: 768px) {
      font-size: 13px;
      padding: 4px 8px;
    }

    @media (max-width: 480px) {
      font-size: 12px;
      padding: 3px 6px;
    }
  }

  :deep(.el-icon) {
    @media (max-width: 768px) {
      font-size: 18px;
    }

    @media (max-width: 480px) {
      font-size: 16px;
    }
  }
}
</style>
