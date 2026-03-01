/**
 * @component BtnPDF
 * @description Botao que aciona a geracao e download do relatorio PDF do cliente.
 *
 * Recebe os dados necessarios para gerar o PDF completo e chama a funcao
 * `gerarRelatorioPDF` ao ser clicado, exibindo estado de carregamento
 * enquanto o documento e gerado.
 *
 * @prop {Object} mapa - Objeto completo do mapa numerologico calculado.
 * @prop {string} nome - Nome completo do cliente.
 * @prop {number} dia  - Dia de nascimento.
 * @prop {number} mes  - Mes de nascimento (1-12).
 * @prop {number} ano  - Ano de nascimento.
 */
<template>
  <button
    @click="gerarPDF"
    :disabled="gerando"
    class="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 disabled:opacity-50 rounded-lg text-white font-semibold transition flex items-center gap-2"
  >
    <span v-if="gerando">Gerando PDF...</span>
    <span v-else>Baixar PDF do Cliente</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { gerarRelatorioPDF } from '../relatorio/pdf.js'

const props = defineProps({
  mapa: Object,
  nome: String,
  dia:  Number,
  mes:  Number,
  ano:  Number,
})

const gerando = ref(false)

async function gerarPDF() {
  gerando.value = true
  try {
    await gerarRelatorioPDF(props.mapa, props.nome, props.dia, props.mes, props.ano)
  } finally {
    gerando.value = false
  }
}
</script>
