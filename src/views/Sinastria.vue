<template>
  <div class="min-h-screen bg-stone-50 px-4 py-8">
    <div class="max-w-3xl mx-auto">
      <div class="flex items-center gap-4 mb-8">
        <router-link to="/" class="text-stone-500 hover:text-stone-800">← Voltar</router-link>
        <h2 class="text-2xl font-light text-stone-800">Sinastria entre Mapas</h2>
      </div>

      <div class="grid md:grid-cols-2 gap-4 mb-6">
        <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h3 class="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4">Pessoa 1</h3>
          <input v-model="nome1" type="text" placeholder="Nome completo" class="w-full border border-stone-300 rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
          <div class="grid grid-cols-3 gap-2">
            <input v-model.number="dia1" type="number" placeholder="Dia" class="border border-stone-300 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-stone-400" />
            <input v-model.number="mes1" type="number" placeholder="Mês" class="border border-stone-300 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-stone-400" />
            <input v-model.number="ano1" type="number" placeholder="Ano" class="border border-stone-300 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-stone-400" />
          </div>
        </div>

        <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h3 class="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4">Pessoa 2</h3>
          <input v-model="nome2" type="text" placeholder="Nome completo" class="w-full border border-stone-300 rounded-lg px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400" />
          <div class="grid grid-cols-3 gap-2">
            <input v-model.number="dia2" type="number" placeholder="Dia" class="border border-stone-300 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-stone-400" />
            <input v-model.number="mes2" type="number" placeholder="Mês" class="border border-stone-300 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-stone-400" />
            <input v-model.number="ano2" type="number" placeholder="Ano" class="border border-stone-300 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-stone-400" />
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 mb-6">
        <label class="text-sm text-stone-600 mr-3">Condição de convívio:</label>
        <select v-model="condicaoConvivio" class="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-400">
          <option value="Continua">Contínua (diária, mesmo quarto)</option>
          <option value="Intercalada">Intercalada (intervalo de 24h)</option>
          <option value="Eventual">Eventual (intervalo 24h a 96h)</option>
          <option value="Sem risco">Sem risco (intervalo > 96h)</option>
        </select>
      </div>

      <button
        @click="calcularSinastria"
        class="w-full bg-stone-800 text-white rounded-lg py-3 font-medium tracking-wide hover:bg-stone-700 transition mb-8"
      >
        Analisar Sinastria
      </button>

      <div v-if="resultado" class="space-y-4">
        <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-2xl font-light text-stone-800">{{ resultado.sinastria.intensidade }}</span>
            <span class="text-xs text-stone-500 bg-stone-100 px-3 py-1 rounded-full uppercase tracking-wider">Sinastria</span>
          </div>
          <p class="text-sm text-stone-600">{{ resultado.sinastria.descricaoIntensidade }}</p>
          <div v-if="resultado.sinastria.aspectosRelacao.length > 0" class="mt-3">
            <p class="text-xs text-stone-500 mb-2">Relação baseada em:</p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="aspecto in resultado.sinastria.aspectosRelacao"
                :key="aspecto"
                class="text-xs bg-stone-100 text-stone-700 px-3 py-1 rounded-full"
              >
                {{ aspecto }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="resultado.simbiose.temSimbiose" class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
          <h3 class="text-sm font-medium text-stone-500 uppercase tracking-wider mb-4">
            Simbiose — Risco {{ resultado.simbiose.riscoGeral }}
          </h3>
          <p class="text-sm text-stone-600 mb-3">{{ resultado.simbiose.orientacao }}</p>
          <div class="space-y-2">
            <div
              v-for="r in resultado.simbiose.riscosCristalizacao"
              :key="r.vn"
              class="flex gap-3 items-center text-sm p-2 rounded-lg bg-stone-50"
            >
              <NumeroCard :vn="r.vn" tamanho="pequeno" />
              <span class="text-stone-600">{{ r.tipo }}</span>
              <span v-if="r.tipo !== 'Nao Interfere'" class="text-stone-400 text-xs">
                {{ r.quemCede }} → {{ r.quemRecebe }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { calcularCD, calcularCiclos, calcularDesafios, calcularRealizacoes, calcularIdade } from '../core/jornada.js'
import { calcularPersonalidade } from '../core/personalidade.js'
import { calcularDuplicidades } from '../core/analises.js'
import { calcularSinastria as _calcularSinastria, calcularSimbiose } from '../core/sinastria.js'
import NumeroCard from '../components/NumeroCard.vue'

const nome1 = ref(''); const dia1 = ref(null); const mes1 = ref(null); const ano1 = ref(null)
const nome2 = ref(''); const dia2 = ref(null); const mes2 = ref(null); const ano2 = ref(null)
const condicaoConvivio = ref('Continua')
const resultado = ref(null)

function montarMapa(nome, dia, mes, ano) {
  const cd = calcularCD(dia, mes, ano)
  const { mo, eu, ex, merito, tributo } = calcularPersonalidade(nome, cd)
  const { c1, c2, c3 } = calcularCiclos(dia, mes, ano)
  const { d1, d2, dm } = calcularDesafios(dia, mes, ano)
  const realizacoes = calcularRealizacoes(dia, mes, ano, cd)
  return { mo, eu, ex, cd, merito, tributo, c1, c2, c3, d1, d2, dm, realizacoes }
}

function calcularSinastria() {
  const m1 = montarMapa(nome1.value, dia1.value, mes1.value, ano1.value)
  const m2 = montarMapa(nome2.value, dia2.value, mes2.value, ano2.value)
  const sinastria = _calcularSinastria(m1, m2)
  const simbiose = calcularSimbiose(m1, m2, condicaoConvivio.value, sinastria)
  resultado.value = { sinastria, simbiose }
}
</script>
