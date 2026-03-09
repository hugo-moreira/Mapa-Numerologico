/**
 * @module stores/mapa
 * @description Store Pinia para o estado do mapa numerologico atualmente em calculo.
 *
 * Centraliza os dados de entrada (nome, data), todos os calculos das 33 tecnicas
 * e o estado da interface (secao aberta, erro de validacao, etc).
 *
 * O store e o ponto central de dados entre o formulario de entrada,
 * a tela do mapa e o gerador de PDF.
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { calcularCD } from '../core/jornada.js'
import { calcularPersonalidade } from '../core/personalidade.js'
import { calcularCiclos, calcularDesafios, calcularRealizacoes, calcularIdade } from '../core/jornada.js'
import { calcularDuplicidades, calcularAusencias, calcularAVP, calcularPureza, gerarPiramide, calcularPerfilExpressao, calcularLigacoesFamiliares, tabularMapa } from '../core/analises.js'
import { calcularRazaoEmocao, calcularComoReagem, calcularRiscos, calcularIntensidadeSexual, calcularAdequacaoLinguagem } from '../core/potenciais.js'
import { calcularConquistaEspontanea, calcularRealizacaoEspontanea, calcularRenascimento, calcularLegado, calcularQuintessencia } from '../core/vida.js'
import { analisarPraticaAfetiva, analisarFertilidade, gerarPedagioCósmico } from '../core/afetivo.js'
import { calcularEnfermidades } from '../core/enfermidades.js'
import { calcularOrientacaoProfissional } from '../core/profissional.js'
import { gerarFrases } from '../core/frases.js'
import { calcularMultiAnoAP, calcularAnosAP9, calcularDuplicidadesPorIdade, calcularPercentuaisPorCiclo } from '../core/timeline.js'

export const useMapaStore = defineStore('mapa', () => {
  /**
   * Modo de compatibilidade com mapas manuais legados.
   *
   * Quando ativo, ajusta regras de:
   * - Realizacoes (janelas etarias no padrao manual)
   * - Pureza (criterio de repeticao global)
   * - Potenciais predominantes (top 3 forcas narrativas)
   * - Orientacao profissional (curadoria mais aderente ao formato manual)
   */
  const MODO_COMPAT_PDF_MANUAL = true

  const nome = ref('')
  const dia = ref(null)
  const mes = ref(null)
  const ano = ref(null)
  const calculado = ref(false)
  const erro = ref('')

  const mapa = ref(null)

  /**
   * Executa todos os calculos das 33 tecnicas com base nos dados de entrada.
   * Popula o objeto mapa com todos os resultados.
   *
   * @param {string} nomeCompleto - Nome completo de registro.
   * @param {number} diaInput - Dia de nascimento.
   * @param {number} mesInput - Mes de nascimento.
   * @param {number} anoInput - Ano de nascimento.
   */
  function calcular(nomeCompleto, diaInput, mesInput, anoInput) {
    erro.value = ''
    if (!nomeCompleto || !diaInput || !mesInput || !anoInput) {
      erro.value = 'Preencha todos os campos.'
      return
    }

    nome.value = nomeCompleto
    dia.value = diaInput
    mes.value = mesInput
    ano.value = anoInput

    const cd = calcularCD(diaInput, mesInput, anoInput)
    const { mo, eu, ex, merito, tributo } = calcularPersonalidade(nomeCompleto, cd)
    const { c1, c2, c3 } = calcularCiclos(diaInput, mesInput, anoInput)
    const { d1, d2, dm } = calcularDesafios(diaInput, mesInput, anoInput)
    const realizacoes = calcularRealizacoes(diaInput, mesInput, anoInput, cd, {
      modoCompatPdfManual: MODO_COMPAT_PDF_MANUAL,
    })
    const idade = calcularIdade(diaInput, mesInput, anoInput)

    const mapaBase = { mo, eu, ex, cd, merito, tributo, c1, c2, c3, d1, d2, dm, realizacoes }

    const duplicidades = calcularDuplicidades(mapaBase)
    const ausencias = calcularAusencias(mapaBase)
    const avp = calcularAVP(mapaBase)
    const pureza = calcularPureza(mapaBase, {
      modoCompatPdfManual: MODO_COMPAT_PDF_MANUAL,
    })
    const piramide = gerarPiramide(mo, cd, dm, eu)
    const expressao = calcularPerfilExpressao(ex)

    const razaoEmocao = calcularRazaoEmocao(mapaBase)
    const comoReagem = calcularComoReagem(mapaBase, {
      modoCompatPdfManual: MODO_COMPAT_PDF_MANUAL,
    })
    const riscos = calcularRiscos(mapaBase)
    const intensidadeSexual = calcularIntensidadeSexual(mapaBase)
    const linguagem = calcularAdequacaoLinguagem(mapaBase, duplicidades)

    const conquistaEspontanea = calcularConquistaEspontanea({ d1, d2, dm }, realizacoes)
    const realizacaoEspontanea = calcularRealizacaoEspontanea(mo, cd, eu, realizacoes)
    const renascimento = calcularRenascimento(realizacoes)
    const legado = calcularLegado(mo, cd, realizacoes)
    const quintessencia = calcularQuintessencia(mapaBase, duplicidades)

    const praticaAfetiva = analisarPraticaAfetiva(mapaBase)
    const fertilidade = analisarFertilidade(mapaBase)
    const pedagio = gerarPedagioCósmico(dm)

    const enfermidades = calcularEnfermidades(duplicidades, mapaBase)
    const VNS_ESPIRITUAIS = [7, 9, 11, 22]
    const todosValores = tabularMapa(mapaBase)
    const percEspiritual = todosValores.length > 0
      ? Math.round((todosValores.filter(v => VNS_ESPIRITUAIS.includes(v)).length / todosValores.length) * 100)
      : 0
    const orientacaoProfissional = calcularOrientacaoProfissional({ ...mapaBase, idade }, pureza, percEspiritual, {
      modoCompatPdfManual: MODO_COMPAT_PDF_MANUAL,
    })

    const ligacoesFamiliares = calcularLigacoesFamiliares(mapaBase)
    const frases = gerarFrases(mo, eu, ex, cd, dm)
    const multiAnoAP = calcularMultiAnoAP(diaInput, mesInput, anoInput, { ...mapaBase })
    const anosAP9 = calcularAnosAP9(diaInput, mesInput, anoInput)
    const dupPorIdade = calcularDuplicidadesPorIdade(mapaBase, 0, 80)
    const percentuaisCiclo = calcularPercentuaisPorCiclo(mapaBase)

    mapa.value = {
      ...mapaBase,
      idade,
      duplicidades,
      ausencias,
      avp,
      pureza,
      piramide,
      expressao,
      razaoEmocao,
      comoReagem,
      riscos,
      intensidadeSexual,
      linguagem,
      conquistaEspontanea,
      realizacaoEspontanea,
      renascimento,
      legado,
      quintessencia,
      praticaAfetiva,
      fertilidade,
      pedagio,
      enfermidades,
      orientacaoProfissional,
      ligacoesFamiliares,
      frases,
      multiAnoAP,
      anosAP9,
      dupPorIdade,
      percentuaisCiclo,
    }

    calculado.value = true
  }

  function limpar() {
    nome.value = ''
    dia.value = null
    mes.value = null
    ano.value = null
    calculado.value = false
    mapa.value = null
    erro.value = ''
  }

  return { nome, dia, mes, ano, calculado, erro, mapa, calcular, limpar }
})
