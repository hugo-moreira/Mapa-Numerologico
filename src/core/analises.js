/**
 * @module analises
 * @description Tecnicas de analise do mapa numerologico: Piramide (Tecnica 1),
 * Figuras Familiares (Tecnica 3), Duplicidades e Mais (Tecnica 4),
 * Ausencias e AVPs (Tecnica 5), Expressao 2a leitura (Tecnica 6)
 * e Pureza da Vibracao (Tecnica 12).
 *
 * Todas as funcoes recebem o mapa completo como objeto e retornam
 * estruturas de dados prontas para exibicao na interface.
 */

import { reduzir } from './pitagorico.js'

/**
 * Estrutura padrao do mapa completo utilizada neste modulo.
 * @typedef {Object} MapaCompleto
 * @property {number} mo - Motivacao (Alma)
 * @property {number} eu - Eu Intimo (Sonho)
 * @property {number} ex - Expressao (Talento)
 * @property {number} cd - Caminho de Destino
 * @property {number} merito
 * @property {number} tributo
 * @property {number} c1 - Ciclo 1 (0-28)
 * @property {number} c2 - Ciclo 2 (29-56)
 * @property {number} c3 - Ciclo 3 (57+)
 * @property {number} d1 - Desafio 1
 * @property {number} d2 - Desafio 2
 * @property {number} dm - Desafio Maior
 * @property {Array<{vn:number, inicio:number, fim:number|null}>} realizacoes
 */

/**
 * Palavras-chave da Piramide para cada VN, usadas para montar o texto corrido.
 * @type {Object.<number, string>}
 */
const PALAVRAS_PIRAMIDE = {
  1: 'liderar, de forma independente',
  2: 'através das uniões, em parceria, unir',
  3: 'através das vivências, através da comunicação, crescer',
  4: 'de forma segura, através de dedicação, foco, equilibrar',
  5: 'transformar, através das vivências, de forma livre, libertar',
  6: 'harmonizar, através do amor, conciliar',
  7: 'através do autoconhecimento e da espiritualidade, sabedoria',
  8: 'de forma justa e honesta, através da honestidade',
  9: 'ajudar almas',
  11: 'através da reciclagem de energias e da espiritualidade',
  22: 'através da mestria e da espiritualidade',
}

/**
 * Gera o texto corrido da Piramide Numerologica com base em CD, MO, DM e EU.
 *
 * A Piramide interpreta 50% do mapa. As quatro VNs funcionam como engrenagem:
 * - CD: "Voce veio para..."
 * - MO: "Voce e uma pessoa que..."
 * - DM: "Voce devera aprender a..."
 * - EU: combinado ao final com CD, MO e DM.
 *
 * @param {number} mo - VN do MO.
 * @param {number} cd - VN do CD.
 * @param {number} dm - VN do DM.
 * @param {number} eu - VN do EU.
 * @returns {{ textoCD: string, textoMO: string, textoDM: string, textoEU: string }}
 * Frases da piramide prontas para exibicao.
 */
export function gerarPiramide(mo, cd, dm, eu) {
  return {
    textoCD: `Você veio para ${PALAVRAS_PIRAMIDE[cd] || cd}.`,
    textoMO: `Você é uma pessoa que ${PALAVRAS_PIRAMIDE[mo] || mo}.`,
    textoDM: `Você deverá aprender a ${PALAVRAS_PIRAMIDE[dm] || dm}.`,
    textoEU: `Seu sonho de vida envolve ${PALAVRAS_PIRAMIDE[eu] || eu}.`,
  }
}

/**
 * Tabulacao das posicoes do mapa: retorna um array com todos os valores
 * numericos presentes (sem contar EX e sem duplicar posicoes do mesmo periodo).
 * Usado como base para os calculos de percentual das tecnicas 7, 8, 9, 11 e 21.
 *
 * Total de posicoes = 14 (ou 13 se DM for zero).
 *
 * Posicoes consideradas:
 * MO, EU, EX, CD, DM, Merito, Tributo, C1, C2, C3, D1, D2, R1, R2, R3, R4
 *
 * @param {MapaCompleto} mapa - Mapa numerologico completo.
 * @returns {number[]} Array com os 14 (ou 13) valores numericos do mapa.
 */
export function tabularMapa(mapa) {
  return [
    mapa.mo,
    mapa.eu,
    mapa.ex,
    mapa.cd,
    mapa.dm,
    mapa.merito,
    mapa.tributo,
    mapa.c1,
    mapa.c2,
    mapa.c3,
    mapa.d1,
    mapa.d2,
    mapa.realizacoes[0]?.vn,
    mapa.realizacoes[1]?.vn,
    mapa.realizacoes[2]?.vn,
    mapa.realizacoes[3]?.vn,
  ].filter((v) => v !== undefined && v !== null)
}

/**
 * Calcula as Duplicidades, Triplicidades, Quadruplicidades e Quintuplicidades
 * do mapa, separadas por VN.
 *
 * Regras:
 * - D (Duplicidade, 2x): a pessoa controla sozinha.
 * - T (Triplicidade, 3x): precisa de orientacao.
 * - Qd (Quadruplicidade, 4x): nao consegue controlar sozinha.
 * - Qt (Quintuplicidade, 5+x): nao consegue controlar - ver Tecnica 25.
 *
 * @param {MapaCompleto} mapa - Mapa numerologico completo.
 * @returns {Array<{vn: number, quantidade: number, tipo: 'D'|'T'|'Qd'|'Qt'}>}
 * Array de duplicidades encontradas, ordenadas por VN.
 */
export function calcularDuplicidades(mapa) {
  const valores = tabularMapa(mapa)
  const contagem = {}
  for (const v of valores) {
    contagem[v] = (contagem[v] || 0) + 1
  }

  return Object.entries(contagem)
    .filter(([, qtd]) => qtd >= 2)
    .map(([vn, qtd]) => ({
      vn: Number(vn),
      quantidade: qtd,
      tipo: qtd >= 5 ? 'Qt' : qtd === 4 ? 'Qd' : qtd === 3 ? 'T' : 'D',
    }))
    .sort((a, b) => a.vn - b.vn)
}

/**
 * Calcula as Ausencias (VNs de 1 a 9 que nao aparecem no mapa).
 *
 * Uma ausencia significa que a pessoa nao veio para praticar aquela VN
 * (ou ja tem dominio sobre ela - Dharma, ou tem muita dificuldade - Karma).
 *
 * @param {MapaCompleto} mapa - Mapa numerologico completo.
 * @returns {number[]} Array de VNs ausentes (1-9), ordenadas crescentemente.
 */
export function calcularAusencias(mapa) {
  const valores = new Set(tabularMapa(mapa).map((v) => (v === 11 ? 2 : v === 22 ? 4 : v)))
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((v) => !valores.has(v))
}

/**
 * Calcula as AVPs (Ausencias de Vibracao Positiva).
 *
 * AVP ocorre quando a VN aparece APENAS nos desafios (D1, D2 ou DM) e
 * nao aparece em nenhuma outra posicao do mapa. A pessoa so sente aquela
 * VN de forma negativa.
 *
 * - AVPc: VN do D1 ou D2 que nao aparece em mais nenhuma posicao.
 * - AVPf: VN do DM que nao aparece em mais nenhuma posicao.
 *
 * @param {MapaCompleto} mapa - Mapa numerologico completo.
 * @returns {{ avpc: number[], avpf: number[] }} Objeto com AVPc e AVPf.
 */
export function calcularAVP(mapa) {
  const posicoesSemDesafios = [
    mapa.mo, mapa.eu, mapa.ex, mapa.cd, mapa.merito, mapa.tributo,
    mapa.c1, mapa.c2, mapa.c3,
    ...mapa.realizacoes.map((r) => r.vn),
  ]
  const vnsSemDesafios = new Set(posicoesSemDesafios)

  const avpc = [mapa.d1, mapa.d2].filter(
    (vn) => vn > 0 && !vnsSemDesafios.has(vn)
  )
  const avpf = mapa.dm > 0 && !vnsSemDesafios.has(mapa.dm) ? [mapa.dm] : []

  return { avpc: [...new Set(avpc)], avpf }
}

/**
 * Determina o perfil de Expressao Oral (2a leitura da Expressao - Tecnica 6).
 *
 * Classificacao baseada na VN do EX:
 * - Bons Ouvintes (EX 1, 4, 7, 8): falam pouco e com objetividade.
 * - Bons Falantes (EX 3, 5, 9): dominam a expressao oral.
 * - Dispersivos (EX 2, 6, 11, 22): falam com calma e delicadeza.
 *
 * @param {number} ex - VN do EX.
 * @returns {{ perfil: string, orientacao: string }}
 */
export function calcularPerfilExpressao(ex) {
  const bonsOuvintes = [1, 4, 7, 8]
  const bonsFalantes = [3, 5, 9]

  if (bonsOuvintes.includes(ex)) {
    return {
      perfil: 'Bom Ouvinte',
      orientacao: 'Fala pouco e com objetividade. Só fala quando se sente seguro. No negativo: pode parecer frio ao se expressar.',
    }
  }
  if (bonsFalantes.includes(ex)) {
    return {
      perfil: 'Bom Falante',
      orientacao: 'Domina a expressão oral com criatividade e desprendimento. Atenção para não falar em excesso.',
    }
  }
  return {
    perfil: 'Dispersivo',
    orientacao: 'Fala com calma e delicadeza. Deve ser mais objetivo ao falar para evitar ser confuso ou cansativo.',
  }
}

/**
 * Calcula a Pureza da Vibracao (Tecnica 12).
 *
 * A Pureza ocorre quando uma VN aparece em 3 posicoes especificas do mapa,
 * tornando-a a VN mais importante. Acontece em cerca de 10% da populacao.
 *
 * Tipos:
 * - PA (Pureza Adquirida): pureza com facilidade.
 * - PPI (Processo de Pureza Iniciado): pureza com conquistas a realizar.
 * - PPC (Processo de Pureza em Conquista): pureza com dificuldade.
 *
 * As posicoes que formam Pureza sao: MO, CD, DM (fixas principais).
 * Verificacao secundaria inclui EX e Merito conforme a intensidade.
 *
 * @param {MapaCompleto} mapa - Mapa numerologico completo.
 * @returns {{ temPureza: boolean, vn: number|null, tipo: string|null } }
 */
export function calcularPureza(mapa) {
  const fixasPrincipais = [mapa.mo, mapa.cd, mapa.dm]
  const contagem = {}
  for (const v of fixasPrincipais) {
    const base = v === 11 ? 2 : v === 22 ? 4 : v
    contagem[base] = (contagem[base] || 0) + 1
  }

  for (const [vn, qtd] of Object.entries(contagem)) {
    if (qtd >= 3) {
      const temDesafio = [mapa.d1, mapa.d2].includes(Number(vn))
      const tipo = temDesafio ? 'PPC' : mapa.eu === Number(vn) ? 'PPI' : 'PA'
      return { temPureza: true, vn: Number(vn), tipo }
    }
  }

  return { temPureza: false, vn: null, tipo: null }
}

/**
 * Membro familiar associado a cada VN (1-9, 11, 22).
 *
 * Define qual figura familiar e representada por cada vibracao numerica
 * no contexto da Tecnica 3 - Figuras / Ligacoes Familiares.
 *
 * @type {Object.<number, string>}
 */
const FAMILIAR_POR_VN = {
  1: 'pai',
  2: 'mãe',
  3: 'irmão / irmã',
  4: 'avós',
  5: '',
  6: 'cônjuge / companheiro(a)',
  7: 'avô paterno / mestre',
  8: 'chefe / liderança',
  9: '',
  11: 'mãe',
  22: 'pai',
}

/**
 * Descricao do tipo de ligacao por posicao no mapa.
 *
 * Cada posicao do mapa cria um tipo especifico de vinculo com o familiar
 * indicado pelo seu VN. Posicoes sem descricao especifica retornam string vazia.
 *
 * @type {Object.<string, string>}
 */
const DESCRICAO_POR_POSICAO = {
  mo: 'Igualdade',
  eu: '',
  ex: 'Expressão',
  cd: 'Aproximação',
  merito: 'Conquista',
  tributo: 'Homenagem',
  c1: '',
  c2: '',
  c3: '',
  d1: 'Aprendizado de Relacionamento',
  d2: 'Aprendizado de Relacionamento',
  dm: 'Aprendizado de Relacionamento',
  r1: '',
  r2: '',
  r3: '',
  r4: '',
}

/**
 * Calcula as Ligacoes Familiares do mapa (Tecnica 3).
 *
 * Para cada posicao relevante do mapa (MO, EU, CD, C1, R1, DM, D1),
 * identifica qual membro familiar e representado pelo VN daquela posicao
 * e qual tipo de ligacao esse posicionamento cria.
 *
 * Regra de mapeamento:
 * - O MEMBRO FAMILIAR e determinado pelo valor numerico do VN da posicao.
 * - O TIPO DE LIGACAO e determinado pela natureza da posicao no mapa
 *   (ex: MO = "Igualdade", CD = "Aproximacao", DM = "Aprendizado de Relacionamento").
 * - Posicoes sem descricao especifica mostram "-".
 *
 * @param {MapaCompleto} mapa - Mapa numerologico completo.
 * @returns {Array<{posicao: string, vn: number, descricao: string, familiar: string}>}
 * Array de 7 entradas, uma por posicao relevante, com a posicao, o VN,
 * a descricao do tipo de ligacao e o familiar associado.
 *
 * @example
 * // Symone (MO=11, EU=6, CD=2, C1=9, R1=5, DM=1, D1=4):
 * // MO | 02 | Igualdade | mae
 * // EU | 06 | -         | -
 * // CD | 02 | Aproximacao | mae
 * // C1 | 09 | -         | -
 * // R1 | 05 | -         | -
 * // DM | 01 | Aprendizado de Relacionamento | pai
 * // D1 | 04 | Aprendizado de Relacionamento | avos
 */
export function calcularLigacoesFamiliares(mapa) {
  const posicoes = [
    { key: 'mo',  label: 'MO', vn: mapa.mo },
    { key: 'eu',  label: 'EU', vn: mapa.eu },
    { key: 'cd',  label: 'CD', vn: mapa.cd },
    { key: 'c1',  label: 'C1', vn: mapa.c1 },
    { key: 'r1',  label: 'R1', vn: mapa.realizacoes[0]?.vn },
    { key: 'dm',  label: 'DM', vn: mapa.dm },
    { key: 'd1',  label: 'D1', vn: mapa.d1 },
  ]

  return posicoes.map(({ key, label, vn }) => {
    const vnBase = vn === 11 ? 11 : vn === 22 ? 22 : vn
    const descricao = DESCRICAO_POR_POSICAO[key] || ''
    const familiar = (vn && FAMILIAR_POR_VN[vnBase]) ? FAMILIAR_POR_VN[vnBase] : ''
    return { posicao: label, vn: vn ?? 0, descricao, familiar }
  })
}
