import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/blog/home',
    },
    {
      path: '/login',
      name: 'loginPage',
      component: () => import('@/views/management/login/index.vue'),
    },

    {
      path: '/management',
      name: 'managementPage',
      redirect: '/management/article',
      children: [
        {
          path: 'article',
          name: 'articlePage',
          component: () => import('@/views/management/article/index.vue'),
        },
        {
          path: 'article/add',
          name: 'addArticlePage',
          component: () => import('@/views/management/article/components/addArtucle.vue'),
        },
        {
          path: 'article/edit/:id',
          name: 'editArticlePage',
          component: () => import('@/views/management/article/components/addArtucle.vue'),
        },
        {
          path: 'category',
          name: 'categoryPage',
          component: () => import('@/views/management/category/index.vue'),
        },
        {
          path: 'user',
          name: 'userPage',
          component: () => import('@/views/management/user/index.vue'),
        },
        {
          path: 'settings',
          name: 'settingsPage',
          component: () => import('@/views/management/settings/index.vue'),
        },
        {
          path: 'message-board',
          name: 'messageBoardPage',
          component: () => import('@/views/management/messageBoard/index.vue'),
        },
      ],
    },
    {
      path: '/blog',
      name: 'blogPage',
      redirect: '/blog/home',
      children: [
        {
          path: 'home',
          name: 'blogHomePage',
          component: () => import('@/views/frontDesk/home/index.vue'),
        },
        {
          path: 'article',
          name: 'ArticlePage',
          component: () => import('@/views/frontDesk/article/index.vue'),
        },
        {
          path: 'article/archive',
          name: 'ArticleArchivePage',
          component: () => import('@/views/frontDesk/article/archive.vue'),
        },
        {
          path: 'article/detail/:id',
          name: 'ArticleDetailPage',
          component: () => import('@/views/frontDesk/article/detail.vue'),
        },
        {
          path: 'about',
          name: 'AboutPage',
          component: () => import('@/views/frontDesk/about/index.vue'),
        },
        {
          path: 'about/me',
          name: 'AboutMePage',
          component: () => import('@/views/frontDesk/about/about-me.vue'),
        },
        {
          path: 'about/site',
          name: 'AboutSitePage',
          component: () => import('@/views/frontDesk/about/about-site.vue'),
        },
        {
          path: 'about/message-board',
          name: 'MessageBoardPage',
          component: () => import('@/views/frontDesk/about/message-board.vue'),
        },
      ],
    },
  ],
})

// 路由守卫：检查管理后台页面的访问权限
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 如果token正在验证中，等待验证完成
  if (userStore.tokenValidating) {
    // 等待token验证完成
    while (userStore.tokenValidating) {
      await new Promise(resolve => setTimeout(resolve, 50))
    }
  }

  // 检查是否访问管理后台页面
  if (to.path.startsWith('/management')) {
    // 如果没有有效的登录状态，跳转到登录页面
    if (!userStore.isLoggedIn) {
      ElMessage.warning('请先登录后再访问管理后台')
      next('/login')
      return
    }
  }

  // 检查是否访问登录页面但已经登录
  if (to.path === '/login' && userStore.isLoggedIn) {
    // 如果已经登录，跳转到管理后台
    next('/management/article')
    return
  }

  // 其他情况正常放行
  next()
})

export default router
