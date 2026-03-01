/**
 * @module sinastria
 * @description Tecnicas 27 (Sinastria entre Mapas) e 28 (Simbiose entre Mapas).
 *
 * A Sinastria compara dois ou mais Mapas Numerologicos Natais revelando a
 * qualidade e intensidade da relacao entre duas pessoas.
 *
 * A Simbiose indica a troca vibracional numerica que ocorre pelo convivio
 * entre duas pessoas, podendo gerar Exaltacao ou Cristalizacao de VNs.
 */

import { tabularMapa } from './analises.js'

/**
 * Niveis de intensidade da Sinastria e seus significados.
 * @type {Object.<string, string>}
 */
export const INTENSIDADES_SINASTRIA = {
  Fortissima: 'Relacao de acentuada identificacao, comprometimento e vivencias significativas.',
  Forte: 'Relacao com identificacao, comprometimento e vivencias com inclusao de riscos ou dificuldade.',
  Media: 'Relacao com identificacao e vivencias significativas temporarias.',
  Fraca: 'Relacao com identificacao e vivencias temporarias de menor grau.',
  Ausencia: 'Nao apresentara identificacao, comprometimento ou vivencias significativas.',
}

/**
 * Calcula a Sinastria entre dois mapas (Tecnica 27).
 *
 * A Sinastria e determinada pela quantidade e qualidade das VNs em comum
 * entre os dois mapas, considerando os periodos de vivencia.
 *
 * Intensidades:
 * - Fortissima: 3 ou mais VNs comuns nas posicoes Piramide (CD, MO, DM, EU).
 * - Forte: 2 VNs comuns nas posicoes Piramide, ou 3+ no total com riscos.
 * - Media: 1 VN comum nas posicoes Piramide, ou 2 no total.
 * - Fraca: 1 VN comum apenas no total.
 * - Ausencia: Sem VNs comuns.
 *
 * @param {import('./analises.js').MapaCompleto} mapa1 - Mapa da pessoa 1.
 * @param {import('./analises.js').MapaCompleto} mapa2 - Mapa da pessoa 2.
 * @returns {{
 *   intensidade: string,
 *   descricaoIntensidade: string,
 *   vnsComuns: number[],
 *   vnsPiramideComuns: number[],
 *   aspectosRelacao: string[],
 *   atracaoEspontanea: boolean,
 *   repulsaoEspontanea: boolean
 * }}
 */
export function calcularSinastria(mapa1, mapa2) {
  const piramide1 = new Set([mapa1.mo, mapa1.cd, mapa1.dm, mapa1.eu])
  const piramide2 = new Set([mapa2.mo, mapa2.cd, mapa2.dm, mapa2.eu])

  const todos1 = new Set(tabularMapa(mapa1))
  const todos2 = new Set(tabularMapa(mapa2))

  const vnsComuns = [...todos1].filter((v) => todos2.has(v)).sort((a, b) => a - b)
  const vnsPiramideComuns = [...piramide1].filter((v) => piramide2.has(v)).sort((a, b) => a - b)

  let intensidade
  if (vnsPiramideComuns.length >= 3) intensidade = 'Fortissima'
  else if (vnsPiramideComuns.length === 2) intensidade = 'Forte'
  else if (vnsPiramideComuns.length === 1 || vnsComuns.length >= 3) intensidade = 'Media'
  else if (vnsComuns.length >= 1) intensidade = 'Fraca'
  else intensidade = 'Ausencia'

  const ASPECTOS = {
    1: 'Independência e liderança',
    2: 'União e companheirismo',
    3: 'Criatividade e comunicação',
    4: 'Estabilidade e segurança',
    5: 'Liberdade e transformação',
    6: 'Amor e harmonia familiar',
    7: 'Autoconhecimento e espiritualidade',
    8: 'Justiça e conquistas materiais',
    9: 'Ajuda ao próximo e desprendimento',
    11: 'Espiritualidade e sensibilidade',
    22: 'Mestria e grandes realizações',
  }

  const aspectosRelacao = vnsPiramideComuns.map((vn) => ASPECTOS[vn] || `VN ${vn}`)

  const atracaoEspontanea = vnsPiramideComuns.length >= 1
  const repulsaoEspontanea = false

  return {
    intensidade,
    descricaoIntensidade: INTENSIDADES_SINASTRIA[intensidade] || '',
    vnsComuns,
    vnsPiramideComuns,
    aspectosRelacao,
    atracaoEspontanea,
    repulsaoEspontanea,
  }
}

/**
 * Calcula a Simbiose entre duas pessoas (Tecnica 28).
 *
 * A Simbiose indica a troca vibracional numerica que ocorre pelo convivio
 * (mais de 4 horas continuas, raio inferior a 4 metros, sem barreiras fisicas).
 *
 * Tipos de Simbiose:
 * - Exaltacao: quem recebe desenvolve a VN com mais facilidade.
 * - Cristalizacao: quem cede vai perdendo a VN (risco de desequilibrio).
 * - Dificulta: VN do mapa 1 e desafio no mapa 2 (ou vice-versa).
 * - Nao Interfere: VNs na mesma condicao e intensidade.
 *
 * Condicoes de risco de Cristalizacao conforme frequencia de convivio:
 * - Continua (diaria, intervalo < 24h): risco Alto.
 * - Intercalada (intervalo 24h): risco Medio.
 * - Eventual (intervalo 24h a 96h): risco Fraco.
 * - Sem risco (intervalo > 96h): sem risco.
 *
 * @param {import('./analises.js').MapaCompleto} mapa1 - Mapa da pessoa 1.
 * @param {import('./analises.js').MapaCompleto} mapa2 - Mapa da pessoa 2.
 * @param {'Continua'|'Intercalada'|'Eventual'|'Sem risco'} condicaoConvivio
 * @param {object} sinastria - Resultado de calcularSinastria.
 * @returns {{
 *   temSimbiose: boolean,
 *   condicaoConvivio: string,
 *   riscosCristalizacao: Array<{vn: number, quemCede: string, quemRecebe: string, tipo: string}>,
 *   riscoGeral: 'Alto'|'Médio'|'Fraco'|'Nenhum',
 *   orientacao: string
 * }}
 */
export function calcularSimbiose(mapa1, mapa2, condicaoConvivio, sinastria) {
  if (sinastria.intensidade === 'Ausencia') {
    return {
      temSimbiose: false,
      condicaoConvivio,
      riscosCristalizacao: [],
      riscoGeral: 'Nenhum',
      orientacao: 'Sem sinastria significativa, sem risco de simbiose.',
    }
  }

  const riscoMap = {
    Continua: 'Alto',
    Intercalada: 'Médio',
    Eventual: 'Fraco',
    'Sem risco': 'Nenhum',
  }

  const desafios1 = new Set([mapa1.d1, mapa1.d2, mapa1.dm])
  const desafios2 = new Set([mapa2.d1, mapa2.d2, mapa2.dm])

  const riscosCristalizacao = sinastria.vnsComuns.map((vn) => {
    const em1Desafio = desafios1.has(vn)
    const em2Desafio = desafios2.has(vn)

    let tipo, quemCede, quemRecebe

    if (em1Desafio && !em2Desafio) {
      tipo = 'Exaltacao/Cristalizacao'
      quemCede = 'Pessoa 1'
      quemRecebe = 'Pessoa 2'
    } else if (!em1Desafio && em2Desafio) {
      tipo = 'Exaltacao/Cristalizacao'
      quemCede = 'Pessoa 2'
      quemRecebe = 'Pessoa 1'
    } else if (em1Desafio && em2Desafio) {
      tipo = 'Dificulta'
      quemCede = 'Ambos'
      quemRecebe = 'Ambos'
    } else {
      tipo = 'Nao Interfere'
      quemCede = '-'
      quemRecebe = '-'
    }

    return { vn, quemCede, quemRecebe, tipo }
  })

  return {
    temSimbiose: true,
    condicaoConvivio,
    riscosCristalizacao,
    riscoGeral: riscoMap[condicaoConvivio] || 'Nenhum',
    orientacao: condicaoConvivio === 'Continua'
      ? 'Risco ALTO de cristalizacao. Recomenda-se distanciamento minimo de 24h a cada 4 dias.'
      : 'Monitorar as VNs em simbiose. Praticar o distanciamento periodico quando necessario.',
  }
}
