/**
 * @module stores/jornadaStore
 * @description Store Pinia para o modulo de Jornada de Vida.
 *
 * Calcula apenas os elementos derivados da data de nascimento, sem
 * necessidade do nome: CD, Ciclos de Vida, Desafios, Realizacoes,
 * Ano Pessoal e Ciclos Trimestrais do ano atual.
 *
 * Util para consultas rapidas de jornada sem dados pessoais de nome.
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  calcularCD,
  calcularCiclos,
  calcularDesafios,
  calcularRealizacoes,
  calcularAP,
  calcularCTs,
  calcularIdade,
  cicloAtivoPorIdade,
  realizacaoAtivaPorIdade,
} from '../core/jornada.js'

export const useJornadaStore = defineStore('jornada', () => {
  const dia = ref(null)
  const mes = ref(null)
  const ano = ref(null)
  const calculado = ref(false)
  const erro = ref('')
  const dados = ref(null)

  /**
   * Calcula a jornada de vida completa com base apenas na data de nascimento.
   *
   * Popula `dados` com CD, ciclos, desafios, realizacoes e previsao do ano atual.
   *
   * @param {number} diaInput - Dia de nascimento (1-31).
   * @param {number} mesInput - Mes de nascimento (1-12).
   * @param {number} anoInput - Ano de nascimento (ex: 1990).
   */
  function calcular(diaInput, mesInput, anoInput) {
    erro.value = ''
    if (!diaInput || !mesInput || !anoInput) {
      erro.value = 'Preencha dia, mês e ano.'
      return
    }

    dia.value = diaInput
    mes.value = mesInput
    ano.value = anoInput

    const cd = calcularCD(diaInput, mesInput, anoInput)
    const ciclos = calcularCiclos(diaInput, mesInput, anoInput)
    const desafios = calcularDesafios(diaInput, mesInput, anoInput)
    const realizacoes = calcularRealizacoes(diaInput, mesInput, anoInput, cd, {
      modoCompatPdfManual: true,
    })
    const idade = calcularIdade(diaInput, mesInput, anoInput)

    const hoje = new Date()
    const anoAtual = hoje.getFullYear()
    const mesHoje = hoje.getMonth() + 1
    const diaHoje = hoje.getDate()
    const ap = calcularAP(diaInput, mesInput, anoAtual, mesHoje, diaHoje)

    const cicloKey = cicloAtivoPorIdade(idade)
    const cicloAtual = ciclos[cicloKey]
    const idxReal = realizacaoAtivaPorIdade(idade, realizacoes)
    const realizacaoAtual = realizacoes[idxReal].vn

    const cts = calcularCTs(ap, cicloAtual, realizacaoAtual, desafios.dm)

    dados.value = {
      cd,
      ciclos,
      desafios,
      realizacoes,
      idade,
      ap,
      cts,
      anoAtual,
      cicloKey,
    }

    calculado.value = true
  }

  /**
   * Limpa o estado da store, resetando todos os campos.
   */
  function limpar() {
    dia.value = null
    mes.value = null
    ano.value = null
    calculado.value = false
    dados.value = null
    erro.value = ''
  }

  return { dia, mes, ano, calculado, erro, dados, calcular, limpar }
})
