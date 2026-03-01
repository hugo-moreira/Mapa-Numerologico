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
 * Lista canonica de todas as profissoes tradicionais (para exibicao ordenada).
 * @type {string[]}
 */
export const LISTA_PROFISSOES = [
  'Administração', 'Agricultura', 'Alimentação', 'Arquitetura', 'Artes',
  'Assessor de Creators', 'Assistente Social', 'Beleza', 'Biblioteconomia',
  'Ciências Exatas', 'Ciências Naturais', 'Ciências Sociais', 'Cientista',
  'Coach', 'Comunicação', 'Decoração', 'Desenho', 'Digital Influencer',
  'Diplomacia', 'Direito', 'Editor', 'Educação Física', 'Engenharia',
  'Ensino', 'Escritor', 'Espiritualidade', 'Esportes',
  'Especialista Emocional', 'Matemática', 'Mercado Financeiro',
  'MKT Digital', 'MKT Relacionamento', 'Personal Organizer', 'Personal Style',
  'Política', 'Psicologia', 'Saúde', 'Secretariado', 'Securitário',
  'Segurança', 'Tecnologia', 'Turismo', 'Vendas', 'Veterinária',
]

/**
 * Lista canonica de Novas Profissoes (profissoes da nova economia e era digital).
 * @type {string[]}
 */
export const LISTA_NOVAS_PROFISSOES = [
  'Analista de IA Ética',
  'Arquiteto Sustentável / Bioarquiteto',
  'Artista Digital / NFT Designer',
  'Cientista de Dados',
  'Consultor de Finanças Sustentáveis / ESG',
  'Criador de Conteúdo / Influencer de Propósito',
  'Criador de Escolas de Consciência',
  'Criador de Experiências Espirituais (Retiros, Eventos)',
  'Curador de Conteúdo Humano + IA',
  'Designer de Ambientes Saudáveis',
  'Designer de Experiências (UX/UI)',
  'Educador de Inteligência Emocional',
  'Educador para Nova Consciência',
  'Empreendedor Digital',
  'Engenheiro de Automação / Robótica',
  'Engenheiro de Energia Renovável',
  'Especialista em Diversidade e Inclusão',
  'Especialista em IA e Dados',
  'Fundador de Startups',
  'Gestor de Cibersegurança',
  'Gestor de Experiências Imersivas (AR/VR)',
  'Gestor de Startups de Impacto',
  'Líder de Causas Sociais Globais',
  'Mentor de Carreira com Propósito',
  'Pesquisador de Consciência / Neurociência',
  'Profissional de Blockchain',
  'Profissional de Sustentabilidade Humana',
  'Profissional de Wellness Corporativo',
  'Storyteller / Roteirista de IA',
  'Terapeuta Integrativo / Holístico',
]

/**
 * Novas Profissoes mapeadas por VN.
 * Cada VN lista as novas profissoes alinhadas com aquela vibracao.
 * @type {Object.<number, string[]>}
 */
export const NOVAS_PROFISSOES_POR_VN = {
  1: ['Empreendedor Digital', 'Fundador de Startups', 'Gestor de Startups de Impacto',
    'Especialista em IA e Dados', 'Profissional de Blockchain'],
  2: ['Especialista em Diversidade e Inclusão', 'Educador de Inteligência Emocional',
    'Curador de Conteúdo Humano + IA', 'Mentor de Carreira com Propósito',
    'Profissional de Wellness Corporativo', 'Terapeuta Integrativo / Holístico'],
  3: ['Artista Digital / NFT Designer', 'Criador de Conteúdo / Influencer de Propósito',
    'Designer de Experiências (UX/UI)', 'Storyteller / Roteirista de IA'],
  4: ['Analista de IA Ética', 'Arquiteto Sustentável / Bioarquiteto',
    'Curador de Conteúdo Humano + IA', 'Designer de Experiências (UX/UI)',
    'Engenheiro de Automação / Robótica', 'Engenheiro de Energia Renovável',
    'Especialista em Diversidade e Inclusão', 'Especialista em IA e Dados',
    'Gestor de Cibersegurança', 'Mentor de Carreira com Propósito',
    'Profissional de Blockchain'],
  5: ['Artista Digital / NFT Designer', 'Criador de Conteúdo / Influencer de Propósito',
    'Empreendedor Digital', 'Gestor de Experiências Imersivas (AR/VR)',
    'Storyteller / Roteirista de IA'],
  6: ['Arquiteto Sustentável / Bioarquiteto', 'Consultor de Finanças Sustentáveis / ESG',
    'Designer de Ambientes Saudáveis', 'Educador de Inteligência Emocional',
    'Engenheiro de Energia Renovável', 'Especialista em Diversidade e Inclusão',
    'Gestor de Startups de Impacto', 'Mentor de Carreira com Propósito',
    'Profissional de Sustentabilidade Humana', 'Profissional de Wellness Corporativo',
    'Terapeuta Integrativo / Holístico'],
  7: ['Cientista de Dados', 'Criador de Escolas de Consciência',
    'Criador de Experiências Espirituais (Retiros, Eventos)',
    'Gestor de Experiências Imersivas (AR/VR)',
    'Pesquisador de Consciência / Neurociência'],
  8: ['Analista de IA Ética', 'Empreendedor Digital', 'Engenheiro de Automação / Robótica',
    'Especialista em IA e Dados', 'Fundador de Startups',
    'Gestor de Cibersegurança', 'Profissional de Blockchain'],
  9: ['Consultor de Finanças Sustentáveis / ESG',
    'Criador de Conteúdo / Influencer de Propósito',
    'Designer de Ambientes Saudáveis', 'Educador para Nova Consciência',
    'Gestor de Startups de Impacto', 'Líder de Causas Sociais Globais',
    'Profissional de Sustentabilidade Humana'],
  11: ['Criador de Escolas de Consciência',
    'Criador de Experiências Espirituais (Retiros, Eventos)',
    'Educador para Nova Consciência', 'Líder de Causas Sociais Globais',
    'Pesquisador de Consciência / Neurociência'],
  22: ['Analista de IA Ética', 'Arquiteto Sustentável / Bioarquiteto',
    'Cientista de Dados', 'Engenheiro de Automação / Robótica',
    'Engenheiro de Energia Renovável', 'Especialista em IA e Dados',
    'Fundador de Startups'],
}

/**
 * Tabela completa de Profissoes tradicionais por VN.
 * Extraida da Apostila - Orientacao Profissional do curso de formacao.
 * @type {Object.<number, string[]>}
 */
export const PROFISSOES_POR_VN = {
  1: ['Administração', 'Agricultura', 'Alimentação', 'Arquitetura', 'Assessor de Creators',
    'Ciências Exatas', 'Cientista', 'Coach', 'Comunicação', 'Desenho', 'Digital Influencer',
    'Direito', 'Engenharia', 'Escritor', 'Esportes', 'Mercado Financeiro', 'MKT Digital',
    'Securitário', 'Segurança', 'Tecnologia', 'Turismo', 'Vendas'],
  2: ['Administração', 'Assistente Social', 'Ciências Naturais', 'Assessor de Creators',
    'Coach', 'Diplomacia', 'Ensino', 'Especialista Emocional', 'Matemática',
    'MKT Relacionamento', 'Personal Style', 'Política', 'Psicologia', 'Saúde',
    'Secretariado', 'Veterinária'],
  3: ['Administração', 'Arquitetura', 'Artes', 'Assessor de Creators',
    'Beleza', 'Comunicação', 'Decoração', 'Desenho', 'Digital Influencer',
    'MKT Digital', 'Personal Style', 'Turismo', 'Vendas'],
  4: ['Administração', 'Arquitetura', 'Biblioteconomia', 'Ciências Exatas', 'Coach',
    'Editor', 'Educação Física', 'Engenharia', 'Escritor', 'Esportes',
    'Matemática', 'Mercado Financeiro', 'MKT Digital', 'Personal Organizer',
    'Securitário', 'Tecnologia'],
  5: ['Artes', 'Assessor de Creators', 'Beleza', 'Comunicação', 'Decoração',
    'Desenho', 'Digital Influencer', 'Educação Física', 'Esportes', 'MKT Digital',
    'MKT Relacionamento', 'Política', 'Segurança', 'Turismo', 'Vendas'],
  6: ['Administração', 'Agricultura', 'Alimentação', 'Assistente Social', 'Beleza',
    'Ciências Naturais', 'Decoração', 'Diplomacia', 'Especialista Emocional',
    'MKT Relacionamento', 'Personal Organizer', 'Psicologia', 'Saúde',
    'Secretariado', 'Veterinária'],
  7: ['Agricultura', 'Alimentação', 'Arquitetura', 'Biblioteconomia',
    'Ciências Exatas', 'Ciências Naturais', 'Ciências Sociais', 'Cientista', 'Coach',
    'Decoração', 'Direito', 'Editor', 'Educação Física', 'Engenharia', 'Escritor',
    'Espiritualidade', 'Matemática', 'Mercado Financeiro', 'MKT Digital',
    'Personal Organizer', 'Psicologia', 'Saúde', 'Tecnologia', 'Veterinária'],
  8: ['Administração', 'Arquitetura', 'Biblioteconomia', 'Direito', 'Engenharia',
    'Esportes', 'Matemática', 'Mercado Financeiro', 'MKT Digital', 'MKT Relacionamento',
    'Política', 'Securitário', 'Segurança', 'Tecnologia'],
  9: ['Agricultura', 'Alimentação', 'Artes', 'Assessor de Creators', 'Assistente Social',
    'Beleza', 'Ciências Naturais', 'Ciências Sociais', 'Coach', 'Comunicação',
    'Desenho', 'Diplomacia', 'Digital Influencer', 'Direito', 'Educação Física',
    'Especialista Emocional', 'Espiritualidade', 'MKT Digital', 'MKT Relacionamento',
    'Personal Style', 'Política', 'Psicologia', 'Saúde', 'Secretariado',
    'Segurança', 'Turismo', 'Vendas', 'Veterinária'],
  11: ['Artes', 'Assistente Social', 'Ciências Sociais', 'Cientista',
    'Diplomacia', 'Ensino', 'Espiritualidade', 'Psicologia', 'Secretariado', 'Securitário'],
  22: ['Biblioteconomia', 'Ciências Exatas', 'Ciências Sociais', 'Editor',
    'Engenharia', 'Ensino', 'Espiritualidade', 'Escritor', 'Matemática'],
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

  // --- Calcula incidencias para profissoes tradicionais ---
  function calcIncidencias(lista, tabelaPorVN, vns) {
    const contagem = {}
    for (const vn of vns) {
      for (const prof of (tabelaPorVN[vn] || [])) {
        contagem[prof] = (contagem[prof] || 0) + 1
      }
    }
    return lista.map(prof => ({ prof, inc: contagem[prof] || 0 }))
  }

  // Passo 1: VNs fixas (cd, mo, dm, eu, merito, ex)
  const passo1 = calcIncidencias(LISTA_PROFISSOES, PROFISSOES_POR_VN, fixas)
  const maxP1 = Math.max(...passo1.map(p => p.inc))

  // Passo 2: Passo 1 + ciclos (c1, c2, c3) com mais vivencia
  const ciclos = [mapa.c1, mapa.c2, mapa.c3]
  const passo2 = calcIncidencias(LISTA_PROFISSOES, PROFISSOES_POR_VN, [...fixas, ...ciclos])
  const maxP2 = Math.max(...passo2.map(p => p.inc))

  // Passo 3: Passo 2 + realizacoes
  const realizacoes = (mapa.realizacoes || []).map(r => r.vn)
  const passo3 = calcIncidencias(LISTA_PROFISSOES, PROFISSOES_POR_VN, [...fixas, ...ciclos, ...realizacoes])
  const maxP3 = Math.max(...passo3.map(p => p.inc))

  // --- Calcula incidencias para novas profissoes ---
  const novasP1 = calcIncidencias(LISTA_NOVAS_PROFISSOES, NOVAS_PROFISSOES_POR_VN, fixas)
  const novasP2 = calcIncidencias(LISTA_NOVAS_PROFISSOES, NOVAS_PROFISSOES_POR_VN, [...fixas, ...ciclos])
  const novasP3 = calcIncidencias(LISTA_NOVAS_PROFISSOES, NOVAS_PROFISSOES_POR_VN, [...fixas, ...ciclos, ...realizacoes])

  // --- Determina primeira/segunda opcao (compatibilidade com comportamento anterior) ---
  const todasOrdenadas = [...passo1].sort((a, b) => b.inc - a.inc)
  const empatadas = todasOrdenadas.filter(p => p.inc === maxP1).map(p => p.prof)

  let primeiraOpcao = empatadas.length <= 4 ? empatadas : empatadas.slice(0, 4)
  let segundaOpcao = todasOrdenadas
    .filter(p => !primeiraOpcao.includes(p.prof) && p.inc > 0)
    .map(p => p.prof)
    .slice(0, 6)

  if (pureza.temPureza && pureza.vn) {
    const profPureza = PROFISSOES_POR_VN[pureza.vn] || []
    const filtrada = primeiraOpcao.filter(p => profPureza.includes(p))
    if (filtrada.length > 0) primeiraOpcao = filtrada
  }

  const fixasSet = new Set(fixas)
  const temEspiritual = VNS_ESPIRITUALIDADE.some(v => fixasSet.has(v))
  const profissionalEspiritualidade = temEspiritual || mapa.dm === 0 || percentualEspiritualidade > 40
  const temVN3Fixa = [mapa.mo, mapa.eu, mapa.cd, mapa.dm, mapa.merito].includes(3)
  const atividadeArtistica = temVN3Fixa && !primeiraOpcao.includes('Artes')

  return {
    primeiraOpcao,
    segundaOpcao,
    profissionalEspiritualidade,
    atividadeArtistica,
    orientacao: profissionalEspiritualidade
      ? 'Este mapa indica vocação para Espiritualidade. Recomenda-se combinar com outra área da 1ª opção.'
      : 'Desenvolver somente a 1ª opção ou combinar 1ª com 2ª opção.',
    // Dados tabulares completos para exibicao
    tabela: {
      tradicionais: { passo1, passo2, passo3, maxP1, maxP2, maxP3 },
      novas: { passo1: novasP1, passo2: novasP2, passo3: novasP3 },
    },
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
