<template>
  <div class="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-light text-stone-800 tracking-wide">Mapa Numerológico</h1>
        <p class="text-stone-500 mt-2 text-sm">Numerologia Pitagórica</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-stone-200 p-8">
        <form @submit.prevent="calcular" novalidate>
          <div class="mb-6">
            <label class="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
              Nome completo de registro
            </label>
            <input
              v-model="nome"
              type="text"
              placeholder="Ex: Maria Aparecida da Silva"
              class="w-full border border-stone-300 rounded-lg px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:border-transparent transition"
              autocomplete="off"
            />
          </div>

          <div class="mb-8">
            <label class="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-2">
              Data de nascimento
            </label>
            <div class="grid grid-cols-3 gap-3">
              <div>
                <input
                  v-model.number="dia"
                  type="number"
                  min="1" max="31"
                  placeholder="Dia"
                  class="w-full border border-stone-300 rounded-lg px-3 py-3 text-stone-800 text-center focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
                />
              </div>
              <div>
                <input
                  v-model.number="mes"
                  type="number"
                  min="1" max="12"
                  placeholder="Mês"
                  class="w-full border border-stone-300 rounded-lg px-3 py-3 text-stone-800 text-center focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
                />
              </div>
              <div>
                <input
                  v-model.number="ano"
                  type="number"
                  min="1900" max="2100"
                  placeholder="Ano"
                  class="w-full border border-stone-300 rounded-lg px-3 py-3 text-stone-800 text-center focus:outline-none focus:ring-2 focus:ring-stone-400 transition"
                />
              </div>
            </div>
          </div>

          <p v-if="mapaStore.erro" class="text-red-500 text-sm mb-4 text-center">
            {{ mapaStore.erro }}
          </p>

          <button
            type="submit"
            class="w-full bg-stone-800 text-white rounded-lg py-3 font-medium tracking-wide hover:bg-stone-700 transition"
          >
            Calcular Mapa
          </button>
        </form>
      </div>

      <div class="flex justify-center gap-6 mt-6">
        <router-link
          to="/sinastria"
          class="text-sm text-stone-500 hover:text-stone-800 transition"
        >
          Sinastria
        </router-link>
        <router-link
          to="/historico"
          class="text-sm text-stone-500 hover:text-stone-800 transition"
        >
          Histórico ({{ historicoStore.registros.length }})
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMapaStore } from '../stores/mapa.js'
import { useHistoricoStore } from '../stores/historico.js'

const router = useRouter()
const mapaStore = useMapaStore()
const historicoStore = useHistoricoStore()

const nome = ref('')
const dia = ref(null)
const mes = ref(null)
const ano = ref(null)

function calcular() {
  mapaStore.calcular(nome.value, dia.value, mes.value, ano.value)
  if (mapaStore.calculado) {
    router.push('/mapa')
  }
}
</script>
