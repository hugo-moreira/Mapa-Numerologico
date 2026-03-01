/**
 * @module afetivo
 * @description Tecnicas de vida pessoal e afetiva do mapa:
 * Tecnica 18 (Pratica Afetiva / Casamento), Tecnica 19 (Fertilidade e Filhos)
 * e Tecnica 29 (DM como Pedagio Cosmico / 2a leitura).
 *
 * As VNs que regem casamento sao 2 (uniao/parceria) e 6 (amor/afetividade).
 * A VN que rege filhos e fertilidade e a 3 (criacao/crescimento).
 */

/**
 * Analisa as condicoes de Pratica Afetiva e Casamento (Tecnica 18).
 *
 * Regras:
 * - Facilidade no casamento: VNs 2 e 6 presentes sem estar em desafio.
 * - Dificuldade caso 1: VN 2 presente (exceto desafio) + VN 6 em desafio.
 *   Uniao espontanea, mas aprendizado na pratica afetiva.
 * - Dificuldade caso 2: VN 6 presente (exceto desafio) + VN 2 em desafio.
 *   Pratica afetiva espontanea, mas aprendizado na uniao.
 * - Dificuldade caso 3: Ambas (2 e 6) somente em desafios.
 *   Aprendizados na uniao e na pratica afetiva; possivel casamento duplo.
 * - Ausencia de VN 2: pratica afetiva sem necessidade de uniao formal.
 * - Ausencia de VN 6: uniao prevista sem necessidade de pratica afetiva intensa.
 *
 * @param {import('./analises.js').MapaCompleto} mapa - Mapa completo.
 * @returns {{ tem2: boolean, tem6: boolean, em2Desafio: boolean, em6Desafio: boolean, condicao: string, orientacao: string }}
 */
export function analisarPraticaAfetiva(mapa) {
  const desafios = new Set([mapa.d1, mapa.d2, mapa.dm])
  const todasVNs = new Set([
    mapa.mo, mapa.eu, mapa.ex, mapa.cd, mapa.merito, mapa.tributo,
    mapa.c1, mapa.c2, mapa.c3,
    ...mapa.realizacoes.map((r) => r.vn),
  ])

  const tem2 = todasVNs.has(2) || todasVNs.has(11)
  const tem6 = todasVNs.has(6)
  const em2Desafio = desafios.has(2) || desafios.has(11)
  const em6Desafio = desafios.has(6)

  let condicao, orientacao

  if (!tem2 && !em2Desafio && !tem6 && !em6Desafio) {
    condicao = 'Sem previsão de casamento ou pratica afetiva'
    orientacao = 'O mapa nao indica necessidade de uniao formal ou pratica afetiva como prioridade de vida.'
  } else if (tem2 && !em2Desafio && tem6 && !em6Desafio) {
    condicao = 'Facilidade no casamento'
    orientacao = 'As duas vibracoes do amor estao ativas e livres. Condicoes favoraveis para uniao e pratica afetiva.'
  } else if (tem2 && !em2Desafio && em6Desafio) {
    condicao = 'Dificuldade na pratica afetiva'
    orientacao = 'Uniao espontanea, mas aprendizado na pratica afetiva (VN 6 em desafio). Precisa aprender a amar e se sentir amado.'
  } else if (tem6 && !em6Desafio && em2Desafio) {
    condicao = 'Dificuldade na uniao'
    orientacao = 'Pratica afetiva espontanea, mas aprendizado na construcao de uniao estavel (VN 2 em desafio).'
  } else if (em2Desafio && em6Desafio) {
    condicao = 'Aprendizados na uniao e na pratica afetiva'
    orientacao = 'Ambas as vibracoes em desafio. Possivel casamento duplo. Exige muito trabalho no campo afetivo.'
  } else if (!tem2 && tem6) {
    condicao = 'Pratica afetiva sem uniao formal'
    orientacao = 'Pratica afetiva prevista sem necessidade de casamento formal (ausencia da VN 2).'
  } else if (tem2 && !tem6) {
    condicao = 'Uniao sem pratica afetiva intensa'
    orientacao = 'Uniao prevista, mas sem necessidade de pratica afetiva como prioridade (ausencia da VN 6).'
  } else {
    condicao = 'Analise especifica necessaria'
    orientacao = 'Consulte o numerologista para interpretacao detalhada.'
  }

  return { tem2, tem6, em2Desafio, em6Desafio, condicao, orientacao }
}

/**
 * Analisa as condicoes de Fertilidade e Filhos (Tecnica 19).
 *
 * A VN 3 rege criacao, crescimento e relacao com filhos.
 *
 * Regras:
 * - VN 3 presente sem desafio: condicoes favoraveis de fertilidade.
 * - VN 3 em desafio: aprendizado na relacao com filhos.
 * - Ausencia da VN 3 sem Desafio Zero: sem necessidade de pratica com filhos.
 * - Desafio Zero com ausencia da VN 3: condicao diferenciada.
 *
 * @param {import('./analises.js').MapaCompleto} mapa - Mapa completo.
 * @returns {{ tem3: boolean, em3Desafio: boolean, condicao: string, orientacao: string }}
 */
export function analisarFertilidade(mapa) {
  const desafios = new Set([mapa.d1, mapa.d2, mapa.dm])
  const todasVNs = new Set([
    mapa.mo, mapa.eu, mapa.ex, mapa.cd, mapa.merito, mapa.tributo,
    mapa.c1, mapa.c2, mapa.c3,
    ...mapa.realizacoes.map((r) => r.vn),
  ])

  const tem3 = todasVNs.has(3)
  const em3Desafio = desafios.has(3)
  const desafioZero = mapa.d1 === 0 || mapa.d2 === 0 || mapa.dm === 0

  let condicao, orientacao

  if (tem3 && !em3Desafio) {
    condicao = 'Fertilidade favoravel'
    orientacao = 'A VN 3 esta presente e livre. Condicoes favoraveis para ter filhos e uma boa relacao com eles.'
  } else if (em3Desafio || desafioZero) {
    condicao = 'Aprendizado na relacao com filhos'
    orientacao = 'A VN 3 em desafio indica aprendizados na relacao com filhos. Requer consciencia e dedicacao.'
  } else if (!tem3 && !desafioZero) {
    condicao = 'Sem necessidade de filhos'
    orientacao = 'A ausencia da VN 3 sem Desafio Zero indica que ter filhos nao e uma necessidade prevista neste mapa.'
  } else {
    condicao = 'Condicao especial (Desafio Zero)'
    orientacao = 'Combinacao especial com Desafio Zero. Consulte o numerologista.'
  }

  return { tem3, em3Desafio, condicao, orientacao }
}

/**
 * Gera o texto do Pedagio Cosmico - 2a leitura do DM (Tecnica 29).
 *
 * O Pedagio Cosmico representa o que a pessoa deve pagar pelo direito de
 * permanecer no planeta e ter oportunidade de evolucao. Conforme o DM,
 * ha um "legado" especifico a deixar para os descendentes.
 *
 * @param {number} dm - VN do Desafio Maior.
 * @returns {{ pedagio: string, legado: string }}
 */
export function gerarPedagioCósmico(dm) {
  const PEDAGOGIOS = {
    1: 'Ser pioneiro, determinado e corajoso. Conquistar tudo sozinho, sem esperar nada de ninguem.',
    2: 'Aprender a conviver com todo tipo de pessoa. Concedendo, colaborando e mantendo unioes e parcerias.',
    3: 'Ser alegre e comunicativo. Transmitir a beleza de estar vivo e mostrar para as pessoas o belo da vida.',
    4: 'Trabalhar muito sendo persistente, dedicado e incansavel. Gerar ao redor estrutura, estabilidade e seguranca.',
    5: 'Chegar na vida alheia e gerar mudancas, alterando a realidade. Nao se prender e buscar sempre novos caminhos.',
    6: 'Produzir calma, paz e tranquilidade ao redor. Demonstrar o valor de praticar a afetividade.',
    7: 'Estar preparado para desnudar as pessoas por onde passar. Mostrar nas situacoes a pura realidade.',
    8: 'Produzir a justica e a retidao por onde passar. Separar o sonho da realidade. Gerar verdade.',
    0: 'Aceitar com resignacao orientar as pessoas em todos os aspectos da vida (Desafio com Zero).',
  }

  return {
    pedagio: PEDAGOGIOS[dm] || `Pedagio especifico para DM ${dm}`,
    legado: 'Conforme praticamos o DM, deixamos o caminho aberto para os descendentes.',
  }
}
