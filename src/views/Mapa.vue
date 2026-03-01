<template>
  <div class="min-h-screen bg-stone-50">
    <div v-if="!mapaStore.calculado" class="flex items-center justify-center min-h-screen">
      <p class="text-stone-500">Nenhum mapa calculado. <router-link to="/" class="underline">Voltar</router-link></p>
    </div>

    <div v-else class="max-w-3xl mx-auto px-4 py-8">
      <!-- Cabecalho -->
      <div class="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-6">
        <div class="flex justify-between items-start flex-wrap gap-4">
          <div>
            <h2 class="text-2xl font-light text-stone-800">{{ mapaStore.nome }}</h2>
            <p class="text-stone-500 text-sm mt-1">
              {{ mapaStore.dia }}/{{ mapaStore.mes }}/{{ mapaStore.ano }}
              &nbsp;·&nbsp; {{ mapaStore.mapa.idade }} anos
            </p>
          </div>
          <div class="flex gap-2 flex-wrap">
            <button
              @click="irParaPrevisao"
              class="px-4 py-2 text-sm bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition"
            >
              Previsão Anual
            </button>
            <button
              @click="salvar"
              class="px-4 py-2 text-sm bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-700 transition"
            >
              Salvar
            </button>
            <BtnPDF :mapa="mapaStore.mapa" :nome="mapaStore.nome" />
            <router-link
              to="/"
              class="px-4 py-2 text-sm bg-stone-800 hover:bg-stone-700 rounded-lg text-white transition"
            >
              Novo Mapa
            </router-link>
          </div>
        </div>
      </div>

      <!-- Piramide -->
      <Grupo titulo="Pirâmide Numerológica" aberto>
        <Piramide
          :mo="mapaStore.mapa.mo"
          :cd="mapaStore.mapa.cd"
          :dm="mapaStore.mapa.dm"
          :eu="mapaStore.mapa.eu"
          :piramide="mapaStore.mapa.piramide"
        />
      </Grupo>

      <!-- Personalidade -->
      <Grupo titulo="Personalidade">
        <TabelaMapa :mapa="mapaStore.mapa" secao="personalidade" />
      </Grupo>

      <!-- Jornada de Vida -->
      <Grupo titulo="Jornada de Vida">
        <TabelaMapa :mapa="mapaStore.mapa" secao="jornada" />
      </Grupo>

      <!-- Duplicidades e Ausencias -->
      <Grupo titulo="Duplicidades e Ausências">
        <TabelaMapa :mapa="mapaStore.mapa" secao="duplicidades" />
      </Grupo>

      <!-- Potenciais -->
      <Grupo titulo="Potenciais">
        <TabelaMapa :mapa="mapaStore.mapa" secao="potenciais" />
      </Grupo>

      <!-- Riscos -->
      <Grupo titulo="Riscos">
        <TabelaMapa :mapa="mapaStore.mapa" secao="riscos" />
      </Grupo>

      <!-- Vida Pessoal -->
      <Grupo titulo="Vida Pessoal">
        <TabelaMapa :mapa="mapaStore.mapa" secao="vidaPessoal" />
      </Grupo>

      <!-- Especiais -->
      <Grupo titulo="Características Especiais">
        <TabelaMapa :mapa="mapaStore.mapa" secao="especiais" />
      </Grupo>

      <!-- Enfermidades -->
      <Grupo titulo="Saúde - Prevenção">
        <TabelaMapa :mapa="mapaStore.mapa" secao="enfermidades" />
      </Grupo>

      <!-- Orientacao Profissional -->
      <Grupo titulo="Orientação Profissional">
        <TabelaMapa :mapa="mapaStore.mapa" secao="profissional" />
      </Grupo>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useMapaStore } from '../stores/mapa.js'
import { useHistoricoStore } from '../stores/historico.js'
import Grupo from '../components/Grupo.vue'
import Piramide from '../components/Piramide.vue'
import TabelaMapa from '../components/TabelaMapa.vue'
import BtnPDF from '../components/BtnPDF.vue'

const router = useRouter()
const mapaStore = useMapaStore()
const historicoStore = useHistoricoStore()

function irParaPrevisao() {
  router.push('/previsao')
}

function salvar() {
  historicoStore.salvar(
    mapaStore.nome,
    mapaStore.dia,
    mapaStore.mes,
    mapaStore.ano,
    mapaStore.mapa
  )
  alert('Mapa salvo no histórico.')
}
</script>
