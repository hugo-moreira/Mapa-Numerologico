<template>
  <button
    @click="gerarPDF"
    :disabled="gerando"
    class="px-4 py-2 text-sm bg-stone-100 hover:bg-stone-200 disabled:opacity-50 rounded-lg text-stone-700 transition"
  >
    {{ gerando ? 'Gerando...' : 'Gerar PDF' }}
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { gerarRelatorioPDF } from '../relatorio/pdf.js'

const props = defineProps({
  mapa: Object,
  nome: String,
})

const gerando = ref(false)

async function gerarPDF() {
  gerando.value = true
  try {
    await gerarRelatorioPDF(props.mapa, props.nome)
  } finally {
    gerando.value = false
  }
}
</script>
