/**
 * @module profissional
 * @description Tecnica 33: Orientacao Profissional, Tecnica 30 (Nome de Bebe),
 * Tecnica 31 (Nome Profissional/Assinatura) e Tecnica 32 (Numero do Imovel).
 *
 * A Orientacao Profissional identifica as areas de atuacao mais alinhadas
 * com o proposito do mapa, cruzando CD, MO, DM, EU, Merito e EX com a
 * tabela de 22 areas profissionais x 12 VNs.
 */

import { reduzir, normalizarNome, ehVogal, valorLetra } from './pitagorico.js'

/**
 * Tabela completa de Profissoes por VN.
 * Extraida da Apostila - Orientacao Profissional do curso de formacao.
 * @type {Object.<number, string[]>}
 */
export const PROFISSOES_POR_VN = {
  1: ['Administracao', 'Agricultura', 'Alimentacao', 'Arquitetura', 'Assessor de Creators',
    'Ciencias Exatas', 'Cientista', 'Coach', 'Comunicacao', 'Desenho', 'Digital Influencer',
    'Direito', 'Engenharia', 'Escritor', 'Esportes', 'Mercado Financeiro', 'MKT Digital',
    'Securitario', 'Seguranca', 'Tecnologia', 'Turismo', 'Vendas'],
  2: ['Administracao', 'Assistente Social', 'Ciencias Naturais', 'Assessor de Creators',
    'Coach', 'Diplomacia', 'Ensino', 'Especialista Emocional', 'Matematica',
    'MKT Relacionamento', 'Personal Style', 'Politica', 'Psicologia', 'Saude',
    'Secretariado', 'Veterinaria'],
  3: ['Administracao', 'Analista', 'Arquitetura', 'Artes', 'Assessor de Creators',
    'Beleza', 'Comunicacao', 'Decoracao', 'Desenho', 'Digital Influencer',
    'MKT Digital', 'Personal Style', 'Turismo', 'Vendas'],
  4: ['Administracao', 'Arquitetura', 'Biblioteconomia', 'Ciencias Exatas', 'Coach',
    'Editor', 'Educacao Fisica', 'Engenharia', 'Escritor', 'Esportes',
    'Matematica', 'Mercado Financeiro', 'MKT Digital', 'Personal Organizer',
    'Securitario', 'Tecnologia'],
  5: ['Artes', 'Assessor de Creators', 'Beleza', 'Comunicacao', 'Decoracao',
    'Desenho', 'Digital Influencer', 'Educacao Fisica', 'Esportes', 'MKT Digital',
    'MKT Relacionamento', 'Politica', 'Seguranca', 'Turismo', 'Vendas'],
  6: ['Administracao', 'Agricultura', 'Alimentacao', 'Assistente Social', 'Beleza',
    'Ciencias Naturais', 'Decoracao', 'Diplomacia', 'Especialista Emocional',
    'MKT Relacionamento', 'Personal Organizer', 'Psicologia', 'Saude',
    'Secretariado', 'Veterinaria'],
  7: ['Agricultura', 'Alimentacao', 'Analista', 'Arquitetura', 'Biblioteconomia',
    'Ciencias Exatas', 'Ciencias Naturais', 'Ciencias Sociais', 'Cientista', 'Coach',
    'Decoracao', 'Direito', 'Editor', 'Educacao Fisica', 'Engenharia', 'Escritor',
    'Espiritualidade', 'Matematica', 'Mercado Financeiro', 'MKT Digital',
    'Personal Organizer', 'Psicologia', 'Saude', 'Tecnologia', 'Veterinaria'],
  8: ['Administracao', 'Arquitetura', 'Biblioteconomia', 'Direito', 'Engenharia',
    'Esportes', 'Matematica', 'Mercado Financeiro', 'MKT Digital', 'MKT Relacionamento',
    'Politica', 'Securitario', 'Seguranca', 'Tecnologia'],
  9: ['Agricultura', 'Alimentacao', 'Artes', 'Assessor de Creators', 'Assistente Social',
    'Beleza', 'Ciencias Naturais', 'Ciencias Sociais', 'Coach', 'Comunicacao',
    'Desenho', 'Diplomacia', 'Digital Influencer', 'Direito', 'Educacao Fisica',
    'Especialista Emocional', 'Espiritualidade', 'MKT Digital', 'MKT Relacionamento',
    'Personal Style', 'Politica', 'Psicologia', 'Saude', 'Secretariado',
    'Seguranca', 'Turismo', 'Vendas', 'Veterinaria'],
  11: ['Analista', 'Artes', 'Assistente Social', 'Ciencias Sociais', 'Cientista',
    'Diplomacia', 'Ensino', 'Espiritualidade', 'Psicologia', 'Secretariado', 'Securitario'],
  22: ['Analista', 'Biblioteconomia', 'Ciencias Exatas', 'Ciencias Sociais', 'Editor',
    'Engenharia', 'Ensino', 'Espiritualidade', 'Escritor', 'Matematica'],
}

/**
 * VNs consideradas de Espiritualidade (para regra D3 - Profissional de Espiritualidade).
 * @type {number[]}
 */
export const VNS_ESPIRITUALIDADE = [7, 9, 11, 22]

/**
 * Calcula a Orientacao Profissional completa (Tecnica 33).
 *
 * Passo 1: Cruzar VNs fixas (CD, MO, DM, EU, Merito, EX) para encontrar
 * profissoes com maior incidencia. Ate 4 = encerrar como 1a opcao.
 *
 * Passo 2: Se mais de 4 empatadas, somar anos de vivencia das VNs restantes
 * e cruzar a de maior tempo com as fixas.
 *
 * Regras especiais:
 * - D1 (Pureza): profissoes devem constar na lista da VN da Pureza.
 * - D3 (Espiritualidade): indicar quando VNs 7, 9, 11, 22 nas fixas ou DM=0 ou >40%.
 * - D4 (VN 3 fixo): indicar atividade artistica como lazer mesmo sem Artes na lista.
 *
 * @param {import('./analises.js').MapaCompleto} mapa - Mapa completo.
 * @param {{ temPureza: boolean, vn: number|null }} pureza - Resultado de calcularPureza.
 * @param {number[]} percentualEspiritualidade - Percentual de VNs espirituais no mapa.
 * @returns {{
 *   primeiraOpcao: string[],
 *   segundaOpcao: string[],
 *   profissionalEspiritualidade: boolean,
 *   atividadeArtistica: boolean,
 *   orientacao: string
 * }}
 */
export function calcularOrientacaoProfissional(mapa, pureza, percentualEspiritualidade) {
  const fixas = [mapa.cd, mapa.mo, mapa.dm, mapa.eu, mapa.merito, mapa.ex]

  const contagem = {}
  for (const vn of fixas) {
    const profissoes = PROFISSOES_POR_VN[vn] || []
    for (const prof of profissoes) {
      contagem[prof] = (contagem[prof] || 0) + 1
    }
  }

  const todasOrdenadas = Object.entries(contagem)
    .sort(([, a], [, b]) => b - a)

  const maxIncidencia = todasOrdenadas[0]?.[1] || 0
  const empatadas = todasOrdenadas.filter(([, v]) => v === maxIncidencia).map(([p]) => p)

  let primeiraOpcao = []
  let segundaOpcao = []

  if (empatadas.length <= 4) {
    primeiraOpcao = empatadas
    segundaOpcao = todasOrdenadas
      .filter(([p]) => !empatadas.includes(p))
      .map(([p]) => p)
      .slice(0, 6)
  } else {
    primeiraOpcao = empatadas.slice(0, 4)
    segundaOpcao = [...empatadas.slice(4), ...todasOrdenadas
      .filter(([p]) => !empatadas.includes(p))
      .map(([p]) => p)].slice(0, 6)
  }

  if (pureza.temPureza && pureza.vn) {
    const profissoesPureza = PROFISSOES_POR_VN[pureza.vn] || []
    const primeiraFiltrada = primeiraOpcao.filter((p) => profissoesPureza.includes(p))
    const movidas = primeiraOpcao.filter((p) => !profissoesPureza.includes(p))
    primeiraOpcao = primeiraFiltrada.length > 0 ? primeiraFiltrada : primeiraOpcao
    segundaOpcao = [...movidas, ...segundaOpcao].slice(0, 6)
  }

  const fixasSet = new Set(fixas)
  const temEspiritual = VNS_ESPIRITUALIDADE.some((v) => fixasSet.has(v))
  const profissionalEspiritualidade = temEspiritual || mapa.dm === 0 || percentualEspiritualidade > 40

  const temVN3Fixa = [mapa.mo, mapa.eu, mapa.cd, mapa.dm, mapa.merito].includes(3)
  const atividadeArtistica = temVN3Fixa && !primeiraOpcao.includes('Artes')

  return {
    primeiraOpcao,
    segundaOpcao,
    profissionalEspiritualidade,
    atividadeArtistica,
    orientacao: profissionalEspiritualidade
      ? 'Este mapa indica vocacao para Espiritualidade. Recomenda-se combinar com outra area da 1a opcao.'
      : 'Desenvolver somente a 1a opcao ou combinar 1a com 2a opcao.',
  }
}

/**
 * Avalia um nome alternativo (profissional, artistico, assinatura, apelido) - Tecnica 31.
 *
 * O nome alternativo NAO altera o Mapa Natal, mas pode reunir condicoes
 * mais favoraveis para uso profissional e expressao pessoal.
 *
 * Regra basica: O nome alternativo NAO pode ter em MO, EU ou EX a VN que
 * for Desafio, Ausencia, AVP ou Triplicidade ou mais no Mapa Natal.
 *
 * @param {string} nomeAlternativo - Nome a avaliar.
 * @param {import('./analises.js').MapaCompleto} mapaOriginal - Mapa do nome de registro.
 * @param {number[]} ausencias - VNs ausentes do mapa original.
 * @param {number[]} avpTotal - Todas as VNs em AVP (avpc + avpf).
 * @param {Array<{vn: number, tipo: string}>} duplicidades - Duplicidades do mapa.
 * @returns {{ mo: number, eu: number, ex: number, favoravel: boolean, alertas: string[] }}
 */
export function avaliarNomeAlternativo(nomeAlternativo, mapaOriginal, ausencias, avpTotal, duplicidades) {
  const calcMO = (nome) => {
    const normalizado = normalizarNome(nome)
    let soma = 0
    for (const palavra of normalizado.split(' ').filter(Boolean)) {
      for (let i = 0; i < palavra.length; i++) {
        if (ehVogal(palavra[i], palavra, i)) soma += valorLetra(palavra[i])
      }
    }
    return reduzir(soma)
  }

  const calcEU = (nome) => {
    const normalizado = normalizarNome(nome)
    let soma = 0
    for (const palavra of normalizado.split(' ').filter(Boolean)) {
      for (let i = 0; i < palavra.length; i++) {
        if (!ehVogal(palavra[i], palavra, i)) soma += valorLetra(palavra[i])
      }
    }
    return reduzir(soma)
  }

  const mo = calcMO(nomeAlternativo)
  const eu = calcEU(nomeAlternativo)
  const ex = reduzir(mo + eu)

  const desafios = new Set([mapaOriginal.d1, mapaOriginal.d2, mapaOriginal.dm])
  const ausenciasSet = new Set(ausencias)
  const avpSet = new Set(avpTotal)
  const triplosSet = new Set(duplicidades.filter((d) => d.tipo === 'T' || d.tipo === 'Qd' || d.tipo === 'Qt').map((d) => d.vn))

  const alertas = []
  for (const [posicao, vn] of [['MO', mo], ['EU', eu], ['EX', ex]]) {
    if (desafios.has(vn)) alertas.push(`${posicao} (${vn}) e Desafio no mapa natal - nao recomendado.`)
    if (ausenciasSet.has(vn)) alertas.push(`${posicao} (${vn}) e Ausencia no mapa natal - nao recomendado.`)
    if (avpSet.has(vn)) alertas.push(`${posicao} (${vn}) e AVP no mapa natal - nao recomendado.`)
    if (triplosSet.has(vn)) alertas.push(`${posicao} (${vn}) tem Triplicidade ou mais - nao recomendado.`)
  }

  return { mo, eu, ex, favoravel: alertas.length === 0, alertas }
}

/**
 * Avalia o numero de um imovel para os moradores (Tecnica 32).
 *
 * So se estuda o numero da unidade (apartamento/casa). O numero e reduzido
 * para um digito de 1 a 9 (sem numeros mestres).
 *
 * Um imovel e desfavoravel quando seu numero corresponde a uma VN que, no
 * mapa dos moradores, aparece como Desafio, Ausencia, AVP ou Triplicidade+.
 *
 * @param {number|string} numeroImovel - Numero da unidade (pode ser 101, 204, etc).
 * @param {import('./analises.js').MapaCompleto[]} mapas - Mapas de todos os moradores.
 * @param {Array<number[]>} ausenciasPorMapa - Ausencias de cada mapa.
 * @param {Array<Array<{vn: number, tipo: string}>>} duplicidadesPorMapa - Duplicidades.
 * @returns {{ vn: number, favoravel: boolean, alertas: string[], contratempos: string }}
 */
export function avaliarNumeroImovel(numeroImovel, mapas, ausenciasPorMapa, duplicidadesPorMapa) {
  const CONTRATEMPOS = {
    1: 'Problemas com rachadura, estrutural, corrente eletrica ou iluminacao.',
    4: 'Problemas com rachadura, estrutural, corrente eletrica ou iluminacao.',
    8: 'Problemas com rachadura, estrutural, corrente eletrica ou iluminacao.',
    2: 'Problemas de deterioracao de alimentos. Solidao. Desconforto na cozinha e banheiro.',
    6: 'Problemas de deterioracao de alimentos. Solidao. Desconforto na cozinha e banheiro.',
    3: 'Problemas nos revestimentos, pintura e pisos.',
    5: 'Problemas nos revestimentos, pintura e pisos.',
    7: 'Problemas de infiltracoes, vazamentos, bolor e odores indesejaveis. Barulhos inexplicaveis.',
    9: 'Problemas de infiltracoes, vazamentos, bolor e odores indesejaveis. Barulhos inexplicaveis.',
  }

  const numStr = String(numeroImovel).replace(/\D/g, '')
  let soma = numStr.split('').reduce((a, d) => a + parseInt(d), 0)
  while (soma > 9) soma = String(soma).split('').reduce((a, d) => a + parseInt(d), 0)
  const vn = soma

  const alertas = []

  for (let i = 0; i < mapas.length; i++) {
    const mapa = mapas[i]
    const ausencias = ausenciasPorMapa[i] || []
    const duplicidades = duplicidadesPorMapa[i] || []

    const desafios = [mapa.d1, mapa.d2, mapa.dm]
    if (desafios.includes(vn)) alertas.push(`VN ${vn} e Desafio no mapa do morador ${i + 1}.`)
    if (ausencias.includes(vn)) alertas.push(`VN ${vn} e Ausencia no mapa do morador ${i + 1}.`)
    const emTrip = duplicidades.some((d) => d.vn === vn && ['T', 'Qd', 'Qt'].includes(d.tipo))
    if (emTrip) alertas.push(`VN ${vn} tem Triplicidade ou mais no mapa do morador ${i + 1}.`)
  }

  return {
    vn,
    favoravel: alertas.length === 0,
    alertas,
    contratempos: alertas.length > 0 ? CONTRATEMPOS[vn] || '' : '',
  }
}
