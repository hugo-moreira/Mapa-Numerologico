/**
 * @module router
 * @description Configuracao das rotas da aplicacao Vue.js.
 * Define as 5 telas principais do sistema de Mapa Numerologico.
 */

import { createRouter, createWebHashHistory } from 'vue-router'
import Entrada from '../views/Entrada.vue'

const routes = [
  {
    path: '/',
    name: 'Entrada',
    component: Entrada,
    meta: { title: 'Novo Mapa' },
  },
  {
    path: '/mapa',
    name: 'Mapa',
    component: () => import('../views/Mapa.vue'),
    meta: { title: 'Mapa Numerológico' },
  },
  {
    path: '/previsao',
    name: 'PrevisaoAnual',
    component: () => import('../views/PrevisaoAnual.vue'),
    meta: { title: 'Previsão Anual' },
  },
  {
    path: '/sinastria',
    name: 'Sinastria',
    component: () => import('../views/Sinastria.vue'),
    meta: { title: 'Sinastria' },
  },
  {
    path: '/historico',
    name: 'Historico',
    component: () => import('../views/Historico.vue'),
    meta: { title: 'Histórico de Clientes' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'Mapa'} | Numerologia Pitagórica`
})

export default router
