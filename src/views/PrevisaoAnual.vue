<template>
  <div class="min-h-screen bg-stone-50 px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <router-link to="/mapa" class="text-stone-500 hover:text-stone-800">← Voltar</router-link>
        <h2 class="text-2xl font-light text-stone-800">Previsão Anual</h2>
      </div>

      <div v-if="!mapaStore.calculado" class="text-stone-500">
        Nenhum mapa calculado.
        <router-link to="/" class="underline">Calcular agora</router-link>
      </div>

      <div v-else>
        <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-6">
          <p class="text-stone-500 text-sm mb-4">{{ mapaStore.nome }}</p>
          <div class="flex items-center gap-4">
            <label class="text-sm text-stone-600">Ano de interesse:</label>
            <input
              v-model.number="anoInteresse"
              type="number"
              min="2000" max="2100"
              class="border border-stone-300 rounded-lg px-3 py-2 w-28 text-center focus:outline-none focus:ring-2 focus:ring-stone-400"
            />
            <button
              @click="calcularPrevisao"
              class="px-4 py-2 bg-stone-800 text-white rounded-lg text-sm hover:bg-stone-700 transition"
            >
              Calcular
            </button>
          </div>
        </div>

        <div v-if="previsao" class="space-y-4">
          <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <div class="flex items-baseline gap-3 mb-3">
              <NumeroCard :vn="previsao.ap" tamanho="grande" />
              <div>
                <p class="text-xs text-stone-500 uppercase tracking-wider">Ano Pessoal {{ anoInteresse }}</p>
                <p class="text-stone-700 mt-1 text-sm">{{ previsao.interpretacaoAP.caracteristicas }}</p>
              </div>
            </div>
            <p class="text-sm text-amber-700 bg-amber-50 rounded-lg px-4 py-2 mt-2">
              <strong>Atenção:</strong> {{ previsao.interpretacaoAP.riscos }}
            </p>
          </div>

          <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <h3 class="text-sm font-medium text-stone-600 uppercase tracking-wider mb-4">Ciclos Trimestrais</h3>
            <div class="space-y-3">
              <div
                v-for="ct in previsao.periodosCTs"
                :key="ct.ct"
                class="flex gap-4 items-start p-3 rounded-lg bg-stone-50"
              >
                <div class="text-center min-w-[3rem]">
                  <p class="text-xs text-stone-500">{{ ct.ct }}</p>
                  <NumeroCard :vn="previsao.cts[ct.ct.toLowerCase()]" tamanho="medio" />
                </div>
                <div>
                  <p class="text-xs text-stone-400">{{ ct.inicio }} a {{ ct.fim }}</p>
                  <p class="text-sm text-stone-700 mt-1">{{ ct.interpretacao }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="previsao.eventosFavoraveis.length > 0" class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
            <h3 class="text-sm font-medium text-stone-600 uppercase tracking-wider mb-3">Eventos Favoráveis</h3>
            <ul class="space-y-1">
              <li
                v-for="evento in previsao.eventosFavoraveis"
                :key="evento"
                class="text-sm text-stone-700 flex items-center gap-2"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-stone-400 flex-shrink-0"></span>
                {{ evento }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMapaStore } from '../stores/mapa.js'
import { calcularPrevisaoAnual } from '../core/previsoes.js'
import { cicloAtivoPorIdade, realizacaoAtivaPorIdade } from '../core/jornada.js'
import NumeroCard from '../components/NumeroCard.vue'

const mapaStore = useMapaStore()
const anoInteresse = ref(new Date().getFullYear())
const previsao = ref(null)

function calcularPrevisao() {
  if (!mapaStore.calculado) return
  const m = mapaStore.mapa
  const idade = m.idade
  const cicloKey = cicloAtivoPorIdade(idade)
  const cicloAtual = m[cicloKey]
  const idxReal = realizacaoAtivaPorIdade(idade, m.realizacoes)
  const realizacaoAtual = m.realizacoes[idxReal].vn

  previsao.value = calcularPrevisaoAnual(
    mapaStore.dia,
    mapaStore.mes,
    anoInteresse.value,
    cicloAtual,
    realizacaoAtual,
    m.dm
  )
}
</script>
