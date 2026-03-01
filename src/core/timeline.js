/**
 * @module timeline
 * @description Calculos de linha do tempo do mapa numerologico:
 * - AP Mensal: valor numerologico de cada mes do Ano Pessoal
 * - Previsao Multi-Ano: dados completos de AP/CTs para 3 anos (anterior, atual, proximo)
 * - Duplicidades por Idade: tabela mostrando quais VNs estao em duplicidade em cada idade
 * - Percentuais por Ciclo: Racional/Emocional, Espiritual/Fisico etc. separados por ciclo
 * - Anos de AP 9: linha temporal dos anos em que o AP = 9 (virada de ciclo de 9 anos)
 */

import { reduzir } from './pitagorico.js'
import { calcularAP, calcularCTs } from './jornada.js'

/** Nomes dos meses em portugues (abreviado). */
const MESES_NOME = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

/** Nomes completos dos meses em portugues. */
const MESES_NOME_COMPLETO = ['janeiro','fevereiro','marco','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']

/**
 * Calcula o valor numerologico de cada mes dentro do Ano Pessoal vigente.
 *
 * Formula: reduzirSimples(reduzir(dia_nasc) + mes_calendario + reduzir(sum_digitos(ano)))
 * O calculo usa o ano de inicio do AP (anoInteresse) para TODOS os 12 meses,
 * independente de o mes cair no ano seguinte (o AP rege o ciclo do aniversario
 * ao proximo aniversario, nao o ano civil).
 *
 * @param {number} diaNasc - Dia de nascimento.
 * @param {number} mesNasc - Mes de nascimento (1-12).
 * @param {number} anoInteresse - Ano do AP (o AP inicia no aniversario deste ano).
 * @returns {Array<{mes: string, mesNum: number, valor: number}>}
 * Array de 12 objetos, um por mes, na ordem do ciclo do AP
 * (começa no mes de nascimento, gira 12 meses).
 *
 * @example
 * calcularAPMensal(23, 9, 2025)
 * // setembro=5, outubro=6, novembro=7, dezembro=8,
 * // janeiro=6, fevereiro=7, marco=8, abril=9,
 * // maio=1, junho=2, julho=3, agosto=4
 */
export function calcularAPMensal(diaNasc, mesNasc, anoInteresse) {
  const diaR = reduzir(diaNasc)
  const anoR = reduzir(
    String(anoInteresse).split('').reduce((a, d) => a + parseInt(d), 0)
  )

  const resultado = []
  for (let i = 0; i < 12; i++) {
    const mesNum = ((mesNasc - 1 + i) % 12) + 1
    const soma = diaR + mesNum + anoR
    const valor = reduzirCompleto(soma)
    resultado.push({
      mes: MESES_NOME[mesNum - 1],
      mesCompleto: MESES_NOME_COMPLETO[mesNum - 1],
      mesNum,
      valor,
    })
  }
  return resultado
}

/**
 * Reducao numerologica simples sem preservar numeros mestres.
 * Usada internamente para valores mensais (que nao preservam 11/22).
 *
 * @param {number} n
 * @returns {number}
 */
function reduzirCompleto(n) {
  if (n <= 9) return n
  const s = String(n).split('').reduce((a, d) => a + parseInt(d), 0)
  return s > 9 ? reduzirCompleto(s) : s
}

/**
 * Formata uma data para o padrao dd/mmm/aa usado no mapa (ex: 23/set/25).
 *
 * @param {number} dia
 * @param {number} mesNum - Mes (1-12).
 * @param {number} ano - Ano com 4 digitos.
 * @returns {string}
 */
function formatarData(dia, mesNum, ano) {
  const dd = String(dia).padStart(2, '0')
  const mmm = MESES_NOME[mesNum - 1]
  const yy = String(ano).slice(-2)
  return `${dd}/${mmm}/${yy}`
}

/**
 * Calcula os periodos (datas de inicio e fim) dos 4 Ciclos Trimestrais
 * dentro do Ano Pessoal.
 *
 * Cada CT dura exatamente 3 meses, começa no dia do aniversario do mes
 * correspondente e termina no dia anterior ao inicio do proximo CT.
 *
 * @param {number} diaNasc - Dia de nascimento.
 * @param {number} mesNasc - Mes de nascimento (1-12).
 * @param {number} anoInteresse - Ano de inicio do AP.
 * @returns {Array<{inicio: string, fim: string, meses: number[]}>}
 * Array de 4 periodos, cada um com inicio, fim e os 3 meses calendário cobertos.
 *
 * @example
 * calcularPeriodosCT(23, 9, 2025)
 * // CT1: 23/set/25 à 22/dez/25 (meses 9, 10, 11)
 * // CT2: 23/dez/25 à 22/mar/26 (meses 12, 1, 2)
 * // CT3: 23/mar/26 à 22/jun/26 (meses 3, 4, 5)
 * // CT4: 23/jun/26 à 22/set/26 (meses 6, 7, 8)
 */
export function calcularPeriodosCT(diaNasc, mesNasc, anoInteresse) {
  const periodos = []
  const diaFim = diaNasc - 1 <= 0 ? 1 : diaNasc - 1

  for (let q = 0; q < 4; q++) {
    // Mes de inicio do CT (1-12)
    const mesInicioNum = ((mesNasc - 1 + q * 3) % 12) + 1
    const anoInicio = mesInicioNum >= mesNasc || q === 0
      ? (mesInicioNum <= mesNasc || q === 0
        ? anoInteresse + Math.floor((mesNasc - 1 + q * 3) / 12)
        : anoInteresse)
      : anoInteresse + 1

    const mesInicioReal = ((mesNasc - 1 + q * 3) % 12) + 1
    const anoInicioReal = anoInteresse + Math.floor((mesNasc - 1 + q * 3) / 12)

    // Mes de fim (dia anterior ao inicio do proximo CT)
    const mesFimNum = ((mesNasc - 1 + (q + 1) * 3) % 12) + 1
    const anoFimReal = anoInteresse + Math.floor((mesNasc - 1 + (q + 1) * 3) / 12)

    // Os 3 meses cobridos por este CT
    const meses = [0, 1, 2].map(i => ((mesNasc - 1 + q * 3 + i) % 12) + 1)

    periodos.push({
      inicio: formatarData(diaNasc, mesInicioReal, anoInicioReal),
      fim: formatarData(diaFim || diaNasc - 1, mesFimNum, anoFimReal),
      meses,
    })
  }
  return periodos
}

/**
 * Determina qual ciclo (C1, C2 ou C3) esta ativo em uma determinada idade.
 *
 * @param {number} idade
 * @returns {'c1'|'c2'|'c3'}
 */
function cicloKey(idade) {
  if (idade <= 28) return 'c1'
  if (idade <= 56) return 'c2'
  return 'c3'
}

/**
 * Retorna a realizacao ativa em uma dada idade com base nas faixas calculadas.
 *
 * @param {number} idade
 * @param {Array<{vn: number, inicio: number, fim: number|null}>} realizacoes
 * @returns {number} VN da realizacao ativa.
 */
function realizacaoAtiva(idade, realizacoes) {
  for (const r of realizacoes) {
    if (r.fim === null || idade <= r.fim) return r.vn
  }
  return realizacoes[3]?.vn ?? 0
}

/**
 * Calcula a previsao completa de tres anos: anterior, atual e proximo.
 *
 * Para cada ano retorna: AP, CTs com seus valores e periodos de datas,
 * e os valores mensais para todos os 12 meses do AP.
 *
 * @param {number} diaNasc - Dia de nascimento.
 * @param {number} mesNasc - Mes de nascimento (1-12).
 * @param {number} anoNasc - Ano de nascimento.
 * @param {Object} mapaBase - Objeto com mo, eu, ex, cd, merito, tributo, c1, c2, c3, d1, d2, dm, realizacoes.
 * @returns {Array<{label: string, ano: number, ap: number, idadeNoAno: number,
 *   cts: {ct1: number, ct2: number, ct3: number, ct4: number},
 *   periodosCT: Array<{inicio: string, fim: string, meses: number[]}>,
 *   mensais: Array<{mes: string, mesNum: number, valor: number}>
 * }>}
 * Array de 3 objetos (anterior, atual, proximo) com todos os dados de previsao.
 */
export function calcularMultiAnoAP(diaNasc, mesNasc, anoNasc, mapaBase) {
  const hoje = new Date()
  const anoCalendario = hoje.getFullYear()
  const mesHoje = hoje.getMonth() + 1
  const diaHoje = hoje.getDate()

  // O AP muda no aniversario, nao em 1/jan.
  // Se ainda nao fez aniversario este ano, o AP vigente e o do ano anterior.
  const jaFezAniversario =
    mesHoje > mesNasc || (mesHoje === mesNasc && diaHoje >= diaNasc)
  const anoAPAtual = jaFezAniversario ? anoCalendario : anoCalendario - 1

  const anos = [anoAPAtual - 1, anoAPAtual, anoAPAtual + 1]
  const labels = ['PERÍODO ANTERIOR', 'PERÍODO ATUAL', 'PRÓXIMO PERÍODO']

  return anos.map((ano, i) => {
    const ap = calcularAP(diaNasc, mesNasc, ano)
    const idadeNoAno = ano - anoNasc

    const cicloAtualKey = cicloKey(idadeNoAno)
    const cicloAtualVN = mapaBase[cicloAtualKey]
    const realizacaoAtualVN = realizacaoAtiva(idadeNoAno, mapaBase.realizacoes)

    const cts = calcularCTs(ap, cicloAtualVN, realizacaoAtualVN, mapaBase.dm)
    const periodosCT = calcularPeriodosCT(diaNasc, mesNasc, ano)
    const mensais = calcularAPMensal(diaNasc, mesNasc, ano)

    return {
      label: labels[i],
      ano,
      ap,
      idadeNoAno,
      cts,
      periodosCT,
      mensais,
      cicloAtualVN,
      realizacaoAtualVN,
    }
  })
}

/**
 * Encontra os anos em que o AP da pessoa e igual a 9 (fim de ciclo de 9 anos),
 * a partir do nascimento ate o limite de longevidade.
 *
 * Estes sao os anos de grande limpeza e transformacao, marcando a virada
 * de cada ciclo de 9 anos na vida da pessoa.
 *
 * @param {number} diaNasc - Dia de nascimento.
 * @param {number} mesNasc - Mes de nascimento (1-12).
 * @param {number} anoNasc - Ano de nascimento.
 * @returns {Array<{ano: number, idade: number}>}
 * Lista de todos os anos AP 9, com o ano civil e a idade da pessoa naquele aniversario.
 */
export function calcularAnosAP9(diaNasc, mesNasc, anoNasc) {
  // Encontrar o primeiro ano AP 9 a partir do nascimento
  let primeiroAno = anoNasc
  for (let y = anoNasc; y <= anoNasc + 9; y++) {
    if (calcularAP(diaNasc, mesNasc, y) === 9) {
      primeiroAno = y
      break
    }
  }

  const resultado = []
  let ano = primeiroAno
  while (ano <= anoNasc + 120) {
    resultado.push({ ano, idade: ano - anoNasc })
    ano += 9
  }
  return resultado
}

/**
 * Calcula todos os VNs ativos em uma determinada idade.
 * Inclui as posicoes fixas (mo, eu, ex, cd, merito, tributo, dm),
 * o ciclo e desafio vigentes, e a realizacao vigente.
 *
 * Os valores mestres (11, 22) sao preservados para analise de duplicidades.
 *
 * @param {Object} mapaBase - Objeto com todas as VNs do mapa.
 * @param {number} idade - Idade da pessoa.
 * @returns {number[]} Array de VNs ativas na idade.
 */
export function vnsPorIdade(mapaBase, idade) {
  const estaticas = [
    mapaBase.mo, mapaBase.eu, mapaBase.ex, mapaBase.cd,
    mapaBase.merito, mapaBase.tributo, mapaBase.dm,
  ]

  const ciclo = mapaBase[cicloKey(idade)]
  const desafio = idade <= 28 ? mapaBase.d1 : idade <= 56 ? mapaBase.d2 : mapaBase.dm
  const realizacao = realizacaoAtiva(idade, mapaBase.realizacoes)

  return [...estaticas, ciclo, desafio, realizacao].filter(v => v > 0)
}

/**
 * Gera a tabela de duplicidades por faixa de idades.
 *
 * Para cada idade no intervalo, calcula quais VNs (base 1-9) estao em
 * duplicidade (D), triplicidade (T), quadruplicidade (Qd) ou quintuplicidade (Qt).
 *
 * O VN 11 conta como 2, o VN 22 conta como 4 para fins de duplicidade.
 *
 * @param {Object} mapaBase - Objeto com todas as VNs do mapa.
 * @param {number} [idadeInicio=0] - Idade inicial do intervalo.
 * @param {number} [idadeFim=80] - Idade final do intervalo.
 * @returns {Object.<number, Object.<number, {quantidade: number, tipo: string}>>}
 * Objeto indexado por idade, cada um contendo um objeto indexado por VN base (1-9)
 * com quantidade e tipo quando ha duplicidade.
 */
export function calcularDuplicidadesPorIdade(mapaBase, idadeInicio = 0, idadeFim = 80) {
  const resultado = {}

  for (let idade = idadeInicio; idade <= idadeFim; idade++) {
    const vns = vnsPorIdade(mapaBase, idade)
    const contagem = {}
    for (const v of vns) {
      const base = v === 11 ? 2 : v === 22 ? 4 : v
      if (base > 0 && base <= 9) contagem[base] = (contagem[base] || 0) + 1
    }

    resultado[idade] = {}
    for (const [vn, qtd] of Object.entries(contagem)) {
      if (qtd >= 2) {
        resultado[idade][Number(vn)] = {
          quantidade: qtd,
          tipo: qtd >= 5 ? 'Qt' : qtd === 4 ? 'Qd' : qtd === 3 ? 'T' : 'D',
        }
      }
    }
  }

  return resultado
}

/**
 * Calcula os percentuais Racional/Emocional, Espiritual/Fisico (Possuir,
 * Compartilhar, Vivenciar), Intensidade e Riscos para o mapa completo
 * e separados por ciclo de vida (C1, C2, C3).
 *
 * Os percentuais de cada par somam 100% (normalizados sobre o total de VNs
 * classificadas no par correspondente).
 *
 * Classificacoes:
 * - Racional: 1, 4, 7, 8, 22 | Emocional: 2, 3, 5, 6, 9, 11
 * - Espiritual: 7, 9, 11, 22 | Fisico: 1, 2, 3, 4, 5, 6, 8
 * - Possuir (Fisico): 1, 4, 8 | Compartilhar: 2, 6 | Vivenciar: 3, 5
 * - Intensa: 1, 3, 5, 8 | Media: 2, 4, 6 | Fraca: 7, 9
 * - Agressividade: 1, 4, 7, 8 | Inseguranca: 3, 5, 9 | Dependencia: 2, 4, 6
 *
 * @param {Object} mapaBase - Objeto com todas as VNs do mapa (mo, eu, ex, cd, merito, tributo, dm, c1, c2, c3, d1, d2, realizacoes).
 * @returns {{
 *   total: PercentuaisBloco,
 *   c1: PercentuaisBloco,
 *   c2: PercentuaisBloco,
 *   c3: PercentuaisBloco
 * }}
 */
export function calcularPercentuaisPorCiclo(mapaBase) {
  // VNs por ciclo: estaticas + ciclo + desafio do periodo + realizacao representativa
  function vnsParaCiclo(cicloKey, desafioKey, realizacaoVN) {
    const estaticas = [
      mapaBase.mo, mapaBase.eu, mapaBase.ex, mapaBase.cd,
      mapaBase.merito, mapaBase.tributo, mapaBase.dm,
    ]
    const ciclo = mapaBase[cicloKey]
    const desafio = mapaBase[desafioKey]
    return [...estaticas, ciclo, desafio, realizacaoVN].filter(v => v > 0)
  }

  // Realizacao representativa de cada ciclo (pelo periodo de maior sobreposicao)
  const r = mapaBase.realizacoes
  const r1 = r[0]?.vn ?? 0
  const r2 = r[1]?.vn ?? 0
  const r3 = r[2]?.vn ?? 0
  const r4 = r[3]?.vn ?? 0

  // C1 (0-28): ciclo c1, desafio d1, realizacao r1 (cobre 0-34 → maior parte em C1)
  const vnsC1 = vnsParaCiclo('c1', 'd1', r1)
  // C2 (29-56): ciclo c2, desafio d2, realizacao r2 (cobre 35-44, centro de C2)
  const vnsC2 = vnsParaCiclo('c2', 'd2', r2)
  // C3 (57+): ciclo c3, desafio dm, realizacao r4 (cobre 55+)
  const vnsC3 = vnsParaCiclo('c3', 'dm', r4)
  // Total: todas as 16 posicoes
  const vnsTotal = [
    mapaBase.mo, mapaBase.eu, mapaBase.ex, mapaBase.cd,
    mapaBase.merito, mapaBase.tributo, mapaBase.dm,
    mapaBase.c1, mapaBase.c2, mapaBase.c3,
    mapaBase.d1, mapaBase.d2,
    r1, r2, r3, r4,
  ].filter(v => v !== undefined && v !== null && v > 0)

  return {
    total: calcularBlocoPercentual(vnsTotal),
    c1: calcularBlocoPercentual(vnsC1),
    c2: calcularBlocoPercentual(vnsC2),
    c3: calcularBlocoPercentual(vnsC3),
  }
}

/**
 * Calcula todos os percentuais de um bloco de VNs.
 *
 * @param {number[]} vns - Array de VNs.
 * @returns {PercentuaisBloco}
 *
 * @typedef {Object} PercentuaisBloco
 * @property {number} razao - Percentual racional (%).
 * @property {number} emocao - Percentual emocional (%).
 * @property {number} espiritual - Percentual espiritual (%).
 * @property {number} possuir - Percentual fisico-possuir (%).
 * @property {number} compartilhar - Percentual fisico-compartilhar (%).
 * @property {number} vivenciar - Percentual fisico-vivenciar (%).
 * @property {number} intensa - Percentual intensidade intensa (%).
 * @property {number} media - Percentual intensidade media (%).
 * @property {number} fraca - Percentual intensidade fraca (%).
 * @property {number} agressividade - Percentual risco agressividade (%).
 * @property {number} inseguranca - Percentual risco inseguranca (%).
 * @property {number} dependencia - Percentual risco dependencia (%).
 * @property {number} cp - Percentual CP (crime passional / solidao) (%).
 */
function calcularBlocoPercentual(vns) {
  function pct(grupo, base) {
    const b = base ?? vns
    const n = b.filter(v => grupo.includes(v)).length
    const t = b.length
    return t === 0 ? 0 : Math.round((n / t) * 100)
  }

  function pctNormalizado(grupoA, grupoB) {
    const nA = vns.filter(v => grupoA.includes(v)).length
    const nB = vns.filter(v => grupoB.includes(v)).length
    const total = nA + nB
    if (total === 0) return { a: 0, b: 0 }
    const pA = Math.round((nA / total) * 100)
    return { a: pA, b: 100 - pA }
  }

  const re = pctNormalizado([1, 4, 7, 8, 22], [2, 3, 5, 6, 9, 11])
  const ef = pctNormalizado([7, 9, 11, 22], [1, 2, 3, 4, 5, 6, 8])
  const pcv = (() => {
    const possuir = vns.filter(v => [1, 4, 8].includes(v)).length
    const comp = vns.filter(v => [2, 6].includes(v)).length
    const viv = vns.filter(v => [3, 5].includes(v)).length
    const total = possuir + comp + viv
    if (total === 0) return { possuir: 0, compartilhar: 0, vivenciar: 0 }
    return {
      possuir: Math.round((possuir / total) * 100),
      compartilhar: Math.round((comp / total) * 100),
      vivenciar: Math.round((viv / total) * 100),
    }
  })()

  const imf = (() => {
    const i = vns.filter(v => [1, 3, 5, 8].includes(v)).length
    const m = vns.filter(v => [2, 4, 6].includes(v)).length
    const f = vns.filter(v => [7, 9].includes(v)).length
    const total = i + m + f
    if (total === 0) return { intensa: 0, media: 0, fraca: 0 }
    return {
      intensa: Math.round((i / total) * 100),
      media: Math.round((m / total) * 100),
      fraca: Math.round((f / total) * 100),
    }
  })()

  const riscos = (() => {
    const ag = vns.filter(v => [1, 4, 7, 8].includes(v)).length
    const ins = vns.filter(v => [3, 5, 9].includes(v)).length
    const dep = vns.filter(v => [2, 4, 6].includes(v)).length
    const total = ag + ins + dep
    if (total === 0) return { agressividade: 0, inseguranca: 0, dependencia: 0 }
    return {
      agressividade: Math.round((ag / total) * 100),
      inseguranca: Math.round((ins / total) * 100),
      dependencia: Math.round((dep / total) * 100),
    }
  })()

  return {
    razao: re.a,
    emocao: re.b,
    espiritual: ef.a,
    fisico: ef.b,
    possuir: pcv.possuir,
    compartilhar: pcv.compartilhar,
    vivenciar: pcv.vivenciar,
    intensa: imf.intensa,
    media: imf.media,
    fraca: imf.fraca,
    agressividade: riscos.agressividade,
    inseguranca: riscos.inseguranca,
    dependencia: riscos.dependencia,
    cp: pct([1, 4, 7, 8]),
  }
}
