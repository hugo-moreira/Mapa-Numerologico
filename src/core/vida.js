/**
 * @module vida
 * @description Tecnicas especiais de vida do mapa numerologico:
 * Tecnica 15 (Conquista Espontanea), Tecnica 16 (Realizacao Espontanea),
 * Tecnica 17 (Bloqueio Vibracional), Tecnica 20 (Renascimento),
 * Tecnica 23 (Legado), Tecnica 24 (Oposicoes Fortes)
 * e Tecnica 25 (Quintessencia / Quintuplicidade).
 */

import { tabularMapa } from './analises.js'

/**
 * Verifica Conquista Espontanea (Tecnica 15).
 *
 * Ocorre quando D1, D2 ou DM se repetem nas Realizacoes (R1, R2, R3 ou R4)
 * no MESMO periodo de idade. Nesse periodo, a pessoa deixa de aprender
 * o desafio porque a vida realiza isso para ela.
 *
 * @param {{ d1: number, d2: number, dm: number }} desafios
 * @param {Array<{vn: number, inicio: number, fim: number|null}>} realizacoes
 * @returns {Array<{desafio: string, vn: number, realizacao: string, periodo: string}>}
 * Array de conquistas espontaneas encontradas.
 */
export function calcularConquistaEspontanea(desafios, realizacoes) {
  const resultado = []
  const mapDesafios = { d1: desafios.d1, d2: desafios.d2, dm: desafios.dm }
  const nomesRealizacoes = ['R1', 'R2', 'R3', 'R4']

  for (const [nomeDesafio, vnDesafio] of Object.entries(mapDesafios)) {
    if (vnDesafio === 0) continue

    for (let i = 0; i < realizacoes.length; i++) {
      const r = realizacoes[i]
      if (r.vn !== vnDesafio) continue

      const periodoDesafio = nomeDesafio === 'd1' ? '0-28 anos'
        : nomeDesafio === 'd2' ? '29-56 anos' : 'toda a vida'

      const periodoReal = r.fim
        ? `${r.inicio} a ${r.fim} anos`
        : `acima de ${r.inicio} anos`

      resultado.push({
        desafio: nomeDesafio.toUpperCase(),
        vn: vnDesafio,
        realizacao: nomesRealizacoes[i],
        periodo: periodoReal,
        periodoDesafio,
      })
    }
  }

  return resultado
}

/**
 * Verifica Realizacao Espontanea (Tecnica 16).
 *
 * Ocorre quando MO, CD ou EU se repetem nas Realizacoes (R1, R2, R3 ou R4)
 * no mesmo periodo. Acontece somente na polaridade positiva.
 * Se houver Bloqueio Vibracional, nao havera conquistas.
 *
 * @param {number} mo - VN do MO.
 * @param {number} cd - VN do CD.
 * @param {number} eu - VN do EU.
 * @param {Array<{vn: number, inicio: number, fim: number|null}>} realizacoes
 * @returns {Array<{posicao: string, vn: number, realizacao: string, periodo: string}>}
 */
export function calcularRealizacaoEspontanea(mo, cd, eu, realizacoes) {
  const resultado = []
  const posicoes = { MO: mo, CD: cd, EU: eu }
  const nomesRealizacoes = ['R1', 'R2', 'R3', 'R4']

  for (const [nomePosicao, vn] of Object.entries(posicoes)) {
    for (let i = 0; i < realizacoes.length; i++) {
      if (realizacoes[i].vn !== vn) continue
      const r = realizacoes[i]
      const periodo = r.fim ? `${r.inicio} a ${r.fim} anos` : `acima de ${r.inicio} anos`
      resultado.push({
        posicao: nomePosicao,
        vn,
        realizacao: nomesRealizacoes[i],
        periodo,
      })
    }
  }

  return resultado
}

/**
 * Verifica Renascimento (Tecnica 20).
 *
 * Ocorre quando a VN 1 (ou qualquer VN que simbolize novo comeco conforme o
 * sistema pitagorico - aqui: VN 1) aparece na R2, R3 ou R4.
 *
 * O Renascimento representa a maior transformacao de vida conhecida na
 * Numerologia. Envolve:
 * - 2 anos anteriores: limpezas e transformacoes intensas.
 * - Periodo principal: 7 anos de conquistas.
 * - 2 anos posteriores: reencontros e novas conquistas.
 * - Vacuo 1: 1o ano do Renascimento (estagnacao).
 * - Vacuo 2: ultimo ano do Renascimento (estagnacao).
 * - Regressao da MO: 1 ano antes, a pessoa regride para VN anterior da MO.
 * - Liberacao do CD: 1 ano antes e 1 depois, dispensa praticar CD e MO.
 *
 * @param {Array<{vn: number, inicio: number, fim: number|null}>} realizacoes
 * @returns {Array<{realizacao: string, idadeInicio: number, vacuo1: number, vacuo2: number|null, periodoProveitoso: string}>}
 */
export function calcularRenascimento(realizacoes) {
  const nomesRealizacoes = ['R1', 'R2', 'R3', 'R4']
  const resultado = []

  for (let i = 1; i < realizacoes.length; i++) {
    const r = realizacoes[i]
    if (r.vn !== 1) continue

    const idadeInicio = r.inicio
    const vacuo1 = idadeInicio
    const vacuo2 = r.fim !== null ? r.fim : null
    const fimProveitoso = r.fim !== null ? r.fim - 1 : null

    resultado.push({
      realizacao: nomesRealizacoes[i],
      idadeInicio,
      preparacao: `${idadeInicio - 2} a ${idadeInicio - 1} anos (limpezas intensas)`,
      vacuo1: `${vacuo1} anos`,
      periodoProveitoso: fimProveitoso
        ? `${idadeInicio + 1} a ${fimProveitoso} anos`
        : `${idadeInicio + 1} anos em diante`,
      vacuo2: vacuo2 !== null ? `${vacuo2} anos` : null,
      anosApos: vacuo2 !== null ? `apos ${vacuo2} anos (redescobertas)` : null,
    })
  }

  return resultado
}

/**
 * Verifica Legado (Tecnica 23).
 *
 * O Legado ocorre quando MO ou CD e igual a uma Realizacao. Representa uma
 * contribuicao inovadora na area profissional que sera utilizada por outras
 * pessoas mesmo apos ser entregue.
 *
 * A pessoa tem 9 anos para desenvolver, entregar e ser reconhecida.
 * Inicia na entrada da Realizacao (exceto R1 que inicia aos 14 anos).
 *
 * @param {number} mo - VN do MO.
 * @param {number} cd - VN do CD.
 * @param {Array<{vn: number, inicio: number, fim: number|null}>} realizacoes
 * @returns {Array<{tipo: string, vn: number, realizacao: string, idadeInicio: number, idadeFim: number|null}>}
 */
export function calcularLegado(mo, cd, realizacoes) {
  const nomesRealizacoes = ['R1', 'R2', 'R3', 'R4']
  const resultado = []

  for (let i = 0; i < realizacoes.length; i++) {
    const r = realizacoes[i]
    const tipo = r.vn === mo ? 'MO' : r.vn === cd ? 'CD' : null
    if (!tipo) continue

    const idadeInicio = i === 0 ? 14 : r.inicio

    resultado.push({
      tipo,
      vn: r.vn,
      realizacao: nomesRealizacoes[i],
      idadeInicio,
      idadeFim: r.fim,
    })
  }

  return resultado
}

/**
 * Verifica Oposicoes Fortes (Tecnica 24).
 *
 * Pares de VNs com campos vibracionais opostos que, quando presentes
 * juntos no mapa, proporcionam perfeicao nas conquistas, apesar de dificuldades.
 *
 * Pares de Oposicao Forte:
 * - 1 x 2 (ou 1 x 11)
 * - 2 x 5
 * - 1 x 9, 4 x 9, 22 x 9, 7 x 8, 8 x 9
 * - 2 x 8 (ou 11 x 8)
 * - 4 x 5 (ou 22 x 5)
 * - 5 x 6
 *
 * @param {import('./analises.js').MapaCompleto} mapa - Mapa completo.
 * @returns {Array<{par: string, vn1: number, vn2: number}>}
 */
export function calcularOposicoesFortes(mapa) {
  const valores = new Set(tabularMapa(mapa))
  const resultado = []

  const pares = [
    [1, 2], [1, 11], [2, 5], [1, 9], [4, 9], [22, 9],
    [7, 8], [8, 9], [2, 8], [11, 8], [4, 5], [22, 5], [5, 6],
  ]

  for (const [a, b] of pares) {
    if (valores.has(a) && valores.has(b)) {
      resultado.push({ par: `${a} x ${b}`, vn1: a, vn2: b })
    }
  }

  return resultado
}

/**
 * Verifica Quintuplicidade (Tecnica 25).
 *
 * Ocorre quando uma VN aparece 5 ou mais vezes no mapa. Nesse caso,
 * a pessoa transmuta para o padrao devico e a VN migra para a VN seguinte
 * (Quintessencia). E condicao rara com acentuados riscos.
 *
 * Tipos de Quintuplicidade:
 * - Forte: 5+ repeticoes fixas no mapa (28 anos ou mais).
 * - Media: Quadruplicidade + AP com a mesma VN (1 ano).
 * - Fraca: Triplicidade + AP + CT com a mesma VN (3 meses).
 *
 * @param {import('./analises.js').MapaCompleto} mapa - Mapa completo.
 * @param {Array<{vn: number, quantidade: number, tipo: string}>} duplicidades
 * @returns {Array<{vn: number, quintessencia: number, tipo: 'Forte'|'Média'|'Fraca'}>}
 */
export function calcularQuintessencia(mapa, duplicidades) {
  return duplicidades
    .filter((d) => d.tipo === 'Qt')
    .map((d) => ({
      vn: d.vn,
      quintessencia: d.vn === 9 ? 1 : d.vn + 1,
      tipo: 'Forte',
    }))
}
