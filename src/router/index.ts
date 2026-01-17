import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import GamePage from '../views/GamePage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/game/:modeId',
      name: 'game',
      component: GamePage,
      props: true,
    },
  ],
})

export default router
