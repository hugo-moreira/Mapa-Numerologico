<template>
  <div class="min-h-screen bg-stone-50 px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <router-link to="/" class="text-stone-500 hover:text-stone-800">← Voltar</router-link>
        <h2 class="text-2xl font-light text-stone-800">Histórico de Clientes</h2>
      </div>

      <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 mb-4">
        <input
          v-model="busca"
          type="text"
          placeholder="Buscar por nome ou data..."
          class="w-full border border-stone-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400"
        />
      </div>

      <div v-if="registrosFiltrados.length === 0" class="text-center text-stone-400 py-16">
        Nenhum cliente salvo ainda.
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="registro in registrosFiltrados"
          :key="registro.id"
          class="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 flex justify-between items-center"
        >
          <div>
            <p class="font-medium text-stone-800">{{ registro.nome }}</p>
            <p class="text-sm text-stone-500 mt-0.5">{{ registro.dataNascimento }}</p>
            <p class="text-xs text-stone-400 mt-1">Calculado em {{ formatarData(registro.dataCalculo) }}</p>
          </div>
          <div class="flex gap-2">
            <button
              @click="reabrir(registro)"
              class="px-3 py-1.5 text-sm bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition"
            >
              Abrir
            </button>
            <button
              @click="remover(registro.id)"
              class="px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 rounded-lg text-red-500 transition"
            >
              Remover
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoricoStore } from '../stores/historico.js'
import { useMapaStore } from '../stores/mapa.js'

const router = useRouter()
const historicoStore = useHistoricoStore()
const mapaStore = useMapaStore()

const busca = ref('')

const registrosFiltrados = computed(() => {
  if (!busca.value.trim()) return historicoStore.registros
  return historicoStore.buscar(busca.value)
})

function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function reabrir(registro) {
  const [d, m, a] = registro.dataNascimento.split('/')
  mapaStore.calcular(registro.nome, Number(d), Number(m), Number(a))
  router.push('/mapa')
}

function remover(id) {
  if (confirm('Remover este cliente do histórico?')) {
    historicoStore.remover(id)
  }
}
</script>
