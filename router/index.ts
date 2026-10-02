import { createRouter, createWebHistory } from 'vue-router'
import { authMiddleware } from '@/middleware/auth.middleware'
import AppShell from '@/layouts/AppShell.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/bem-vindo',
      name: 'apresentacao',
      component: () => import('@/pages/apresentacao/ApresentacaoPage.vue'),
      meta: { publica: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/pages/auth/LoginPage.vue'),
      meta: { publica: true },
    },
    {
      path: '/registro',
      name: 'registro',
      component: () => import('@/pages/auth/RegistroPage.vue'),
      meta: { publica: true },
    },
    {
      path: '/',
      component: AppShell,
      children: [
        { path: '', redirect: { name: 'inicio' } },
        {
          path: 'inicio',
          name: 'inicio',
          component: () => import('@/pages/inicio/InicioPage.vue'),
        },
        {
          path: 'movimentacoes',
          name: 'movimentacoes',
          component: () => import('@/pages/movimentacoes/MovimentacoesPage.vue'),
        },
        {
          path: 'evolucao',
          name: 'evolucao',
          component: () => import('@/pages/evolucao/EvolucaoPage.vue'),
        },
        {
          path: 'planejamento',
          name: 'planejamento',
          component: () => import('@/pages/planejamento/PlanejamentoPage.vue'),
        },
        {
          path: 'perfil',
          name: 'perfil',
          component: () => import('@/pages/perfil/PerfilPage.vue'),
        },
        {
          path: 'perfil/categorias',
          name: 'categorias',
          component: () => import('@/pages/categorias/CategoriasPage.vue'),
          meta: { aba: 'perfil' },
        },
        {
          path: 'perfil/sobre',
          name: 'sobre',
          component: () => import('@/pages/sobre/SobrePage.vue'),
          meta: { aba: 'perfil' },
        },
      ],
    },
  ],
})

router.beforeEach(authMiddleware)

export default router
