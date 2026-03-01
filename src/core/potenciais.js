/**
 * @module potenciais
 * @description Calcula os Potenciais e Riscos do mapa numerologico:
 * Tecnica 7 (Razao vs Emocao), Tecnica 8 (Como Reagem / Planos),
 * Tecnica 9 (Riscos CP/VG/SC), Tecnica 10 (Adequacao de Linguagem),
 * Tecnica 11 (Vicios) e Tecnica 21 (Intensidade Sexual).
 *
 * Todas as tecnicas utilizam tabulacao e percentualizacao das VNs do mapa.
 * Total de posicoes = 14 (ou 13 se DM = 0).
 */

import { tabularMapa } from './analises.js'

/**
 * Calcula o percentual de ocorrencia de um grupo de VNs no mapa.
 *
 * @param {number[]} mapaValores - Array de todas as VNs do mapa (de tabularMapa).
 * @param {number[]} grupo - VNs do grupo a percentualizar.
 * @returns {number} Percentual (0-100), arredondado para 1 casa decimal.
 */
function percentualGrupo(mapaValores, grupo) {
  const total = mapaValores.length
  const count = mapaValores.filter((v) => grupo.includes(v)).length
  return Math.round((count / total) * 1000) / 10
}

/**
 * Calcula o Potencial Como Sentem (Tecnica 7): Razao vs Emocao.
 *
 * Define como a pessoa toma decisoes:
 * - Razao: VNs 1, 4, 7, 8, 22
 * - Emocao: VNs 2, 3, 6, 9, 11
 * - Razao e Emocao: quando ambos os grupos estao equilibrados (diferenca < 10%)
 *
 * @param {import('./analises.js').MapaCompleto} mapa - Mapa completo.
 * @returns {{ razao: number, emocao: number, predominante: string }}
 * Percentuais e predominancia ('Razão', 'Emoção' ou 'Razão e Emoção').
 */
export function calcularRazaoEmocao(mapa) {
  const valores = tabularMapa(mapa)
  const pRazao = percentualGrupo(valores, [1, 4, 7, 8, 22])
  const pEmocao = percentualGrupo(valores, [2, 3, 6, 9, 11])

  let predominante
  if (Math.abs(pRazao - pEmocao) < 10) predominante = 'Razão e Emoção'
  else if (pRazao > pEmocao) predominante = 'Razão'
  else predominante = 'Emoção'

  return { razao: pRazao, emocao: pEmocao, predominante }
}

/**
 * Calcula o Potencial Como Reagem (Tecnica 8): Planos de acao.
 *
 * Define o que a pessoa mais veio para praticar nesta vida:
 * - Espiritual: VNs 7, 9, 11, 22
 * - Fisico Possuir: VNs 1, 4, 8
 * - Fisico Compartilhar: VNs 2, 6
 * - Fisico Vivenciar: VNs 3, 5
 *
 * VNs 11 e 22 contam para Espiritual E para o plano fisico correspondente.
 *
 * @param {import('./analises.js').MapaCompleto} mapa - Mapa completo.
 * @returns {{ espiritual: number, possuir: number, compartilhar: number, vivenciar: number, predominantes: string[] }}
 */
export function calcularComoReagem(mapa) {
  const valores = tabularMapa(mapa)
  const espiritual = percentualGrupo(valores, [7, 9, 11, 22])
  const possuir = percentualGrupo(valores, [1, 4, 8])
  const compartilhar = percentualGrupo(valores, [2, 6])
  const vivenciar = percentualGrupo(valores, [3, 5])

  const max = Math.max(espiritual, possuir, compartilhar, vivenciar)
  const predominantes = []
  if (espiritual === max) predominantes.push('Espiritual')
  if (possuir === max) predominantes.push('Físico - Possuir')
  if (compartilhar === max) predominantes.push('Físico - Compartilhar')
  if (vivenciar === max) predominantes.push('Físico - Vivenciar')

  return { espiritual, possuir, compartilhar, vivenciar, predominantes }
}

/**
 * Calcula os Riscos do mapa (Tecnica 9): CP, VG e SC.
 *
 * Tres grupos de risco identificados por concentracao de VNs:
 * - CP (Crime Passional / Solidao / Violencia): VNs 1, 4, 7, 8
 * - VG (Vulgaridade / Incerteza / Inseguranca): VNs 3, 5, 9
 * - SC (Suicidio / Dependencia / Depressao): VNs 2, 4, 6
 *
 * Risco considerado ALTO quando acima de 40%.
 * Risco de CP quando soma A + C > 80%.
 * Risco de SC quando soma A + B > 80%.
 *
 * @param {import('./analises.js').MapaCompleto} mapa - Mapa completo.
 * @returns {{ cp: number, vg: number, sc: number, riscoCP: boolean, riscoSC: boolean, altos: string[] }}
 */
export function calcularRiscos(mapa) {
  const valores = tabularMapa(mapa)
  const cp = percentualGrupo(valores, [1, 4, 7, 8])
  const vg = percentualGrupo(valores, [3, 5, 9])
  const sc = percentualGrupo(valores, [2, 4, 6])

  return {
    cp,
    vg,
    sc,
    riscoCP: cp + sc > 80,
    riscoSC: cp + vg > 80,
    altos: [
      cp > 40 ? 'CP' : null,
      vg > 40 ? 'VG' : null,
      sc > 40 ? 'SC' : null,
    ].filter(Boolean),
  }
}

/**
 * Calcula a Intensidade Sexual (Tecnica 21).
 *
 * Baseada no percentual das VNs impares (1, 3, 5, 7, 9) no mapa.
 * - Fraca: abaixo de 30%
 * - Media: de 30% a 60%
 * - Forte: acima de 60%
 *
 * So se interpreta quando Fraca ou Forte (media nao e comentada).
 *
 * @param {import('./analises.js').MapaCompleto} mapa - Mapa completo.
 * @returns {{ percentual: number, intensidade: 'Fraca'|'Média'|'Forte' }}
 */
export function calcularIntensidadeSexual(mapa) {
  const valores = tabularMapa(mapa)
  const percentual = percentualGrupo(valores, [1, 3, 5, 7, 9])
  let intensidade
  if (percentual < 30) intensidade = 'Fraca'
  else if (percentual <= 60) intensidade = 'Média'
  else intensidade = 'Forte'
  return { percentual, intensidade }
}

/**
 * Determina a Adequacao de Linguagem (Tecnica 10).
 *
 * Indica como o numerologista deve se comunicar com o cliente durante
 * a sessao, baseando-se na VN predominante nas duplicidades fixas.
 *
 * Prioridade: Duplicidades fixas > CD > demais.
 *
 * @param {import('./analises.js').MapaCompleto} mapa - Mapa completo.
 * @param {Array<{vn: number, tipo: string}>} duplicidades - Resultado de calcularDuplicidades.
 * @returns {{ vn: number, orientacao: string }}
 */
export function calcularAdequacaoLinguagem(mapa, duplicidades) {
  const LINGUAGENS = {
    1: 'Fale com clareza, com certa rapidez e sem se prender a detalhes.',
    2: 'Fale com calma, pausadamente e com cuidado ao fazer revelações.',
    3: 'Fale de forma descontraída, bem-humorada, espirituosa e criativa.',
    4: 'Fale de forma precisa, segura, objetiva e sucinta.',
    5: 'Fale com profundidade; esta pessoa tem maior capacidade de absorção.',
    6: 'Fale com afeto, mostrando cuidado genuíno nas orientações.',
    7: 'Fale com profundidade e espiritualidade; encoraje o autoconhecimento.',
    8: 'Fale de forma direta, objetiva e baseada em fatos concretos.',
    9: 'Fale com amplitude, abrangendo varios aspectos da vida.',
    11: 'Fale com sensibilidade e espiritualidade; use exemplos intuitivos.',
    22: 'Fale com visao ampla, conectando pratica e espiritualidade.',
  }

  const fixas = [mapa.mo, mapa.cd, mapa.dm]
  const dupFixas = duplicidades.filter((d) => fixas.includes(d.vn))

  const vnLinguagem = dupFixas.length > 0
    ? dupFixas.sort((a, b) => b.quantidade - a.quantidade)[0].vn
    : mapa.cd

  return { vn: vnLinguagem, orientacao: LINGUAGENS[vnLinguagem] || '' }
}
