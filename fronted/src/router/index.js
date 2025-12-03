import { createRouter, createWebHistory } from 'vue-router'

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

export default router
