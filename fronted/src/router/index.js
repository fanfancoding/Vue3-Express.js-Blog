import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'loginPage',
      component: () => import('@/views/management/login/index.vue'),
    },
    {
      path: '/',
      redirect: '/management',
    },
    {
      path: '/management',
      name: 'managementPage',
      component: () => import('@/Layout/index.vue'),
      children: [
        {
          path: '/article',
          name: 'articlePage',
          component: () => import('@/views/management/article/index.vue'),
        },
      ],
    },
  ],
})

export default router
