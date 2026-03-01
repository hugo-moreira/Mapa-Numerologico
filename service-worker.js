/**
 * Service Worker - Mapa Numerologico Pitagorico
 *
 * Implementa cache-first para o shell da aplicacao (HTML, CSS, JS) e
 * network-first para recursos dinamicos. Permite funcionamento offline
 * apos o primeiro acesso, essencial para uso em consultas sem internet.
 *
 * Estrategia:
 * - INSTALL: pre-cacheia os assets essenciais da aplicacao.
 * - ACTIVATE: limpa caches antigos de versoes anteriores.
 * - FETCH: serve do cache se disponivel; caso contrario, busca na rede.
 */

const CACHE_NOME = 'mapa-numerologico-v1'

const ASSETS_ESSENCIAIS = [
  './',
  './index.html',
  './manifest.json',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NOME).then((cache) => {
      return cache.addAll(ASSETS_ESSENCIAIS)
    })
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((nomes) =>
      Promise.all(
        nomes
          .filter((nome) => nome !== CACHE_NOME)
          .map((nome) => caches.delete(nome))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NOME).then((cache) => cache.put(event.request, clone))
        }
        return response
      })
      return cached || fetchPromise
    })
  )
})
