/**
 * @module previsoes
 * @description Tecnica 26: Previsoes Anuais.
 *
 * Calcula e interpreta o Ano Pessoal (AP), os quatro Ciclos Trimestrais (CTs),
 * o Ano Universal (AU), Mes Universal (MU), Dia Universal (DU) e fornece
 * tabelas de interpretacao e eventos favoraveis por VN.
 *
 * Conceito: As previsoes nao sao adivinhacao. Os fatos da vida estao programados,
 * respeitando o livre arbitrio. A polaridade (positiva, negativa, parcial,
 * extrapolacao ou bloqueio) determina como os fatos se manifestam.
 */

import { reduzir } from './pitagorico.js'
import { calcularAP, calcularCTs } from './jornada.js'

/**
 * Tabela de interpretacao dos Anos Pessoais (1-9, 11, 22).
 * @type {Object.<number, {caracteristicas: string, riscos: string}>}
 */
export const INTERPRETACAO_AP = {
  1: {
    caracteristicas: 'Renascimento. Abrir novos caminhos. Desenvolver independencia, ousadia, coragem, determinacao e autoconfianca.',
    riscos: 'Nao aproveitar novas possibilidades comprometendo o ciclo de 9 anos. Ou querer aproveitar tudo sem energia suficiente.',
  },
  2: {
    caracteristicas: 'Momento de parcerias e unioes. Com concessao, flexibilidade e paciencia.',
    riscos: 'Nao conceder (perdas acentuadas). Ou conceder em excesso (perda de oportunidades).',
  },
  3: {
    caracteristicas: 'Momento de crescimento e expansao. Aproveitar chances em todas as areas da vida.',
    riscos: 'Contemplar o crescimento sem aproveita-lo. Ou querer aproveitar tudo, criando desordem.',
  },
  4: {
    caracteristicas: 'Conquistar estabilidade e seguranca. Muito trabalho, persistencia, dedicacao.',
    riscos: 'Recusar-se a trabalhar muito. Ou trabalhar em excesso deixando outras VNs paradas.',
  },
  5: {
    caracteristicas: 'Momento de mudancas, liberdade e viagens. Transformacoes interiores e exteriores.',
    riscos: 'A vida muda e a pessoa nao efetua as mudancas. Ou muda em excesso promovendo desequilibrio.',
  },
  6: {
    caracteristicas: 'Momento de pratica afetiva e relacionamentos familiares. Dedicar-se a familia original e constituida.',
    riscos: 'Afastar-se da pratica afetiva. Acomodacao. Bigamia. Excesso de valorizacao da pratica afetiva.',
  },
  7: {
    caracteristicas: 'Encontro consigo mesmo, questionamentos e descobertas. A vida retira ilusoes mostrando a realidade. Momento de pratica espiritual.',
    riscos: 'Nao valorizar as descobertas. Nao praticar espiritualidade. Ou supervalorizar a intuicao interferindo na vida alheia.',
  },
  8: {
    caracteristicas: 'Acentuado desenvolvimento material. Conquistas financeiras. Momento de justica, reticao e honestidade.',
    riscos: 'Gastar excessivamente comprometendo os proximos anos. Ou desenvolver ilusao de que so o financeiro tem valor.',
  },
  9: {
    caracteristicas: 'Momento de limpezas, mudancas e transformacoes. Encerramento de um ciclo de 9 anos. Limpar tudo com acentuadas dificuldades, desencontros ou sofrimentos.',
    riscos: 'Prender-se a situacoes sendo eliminadas. Ou limpar em excesso desfazendo-se do que nao deveria.',
  },
  11: {
    caracteristicas: 'AP 2 com intensidade espiritual acentuada. Aumento da sensibilidade e intuicao. Necessidade de pratica espiritual.',
    riscos: 'Sem pratica espiritual: irritabilidade e descontrole emocional. Mesmos riscos do AP 2.',
  },
  22: {
    caracteristicas: 'AP 4 com intensidade espiritual acentuada. Descobertas e transmissao de conhecimentos. Necessidade espiritual.',
    riscos: 'Nao praticar espiritualidade. Mesmos riscos do AP 4.',
  },
}

/**
 * Tabela de interpretacao dos Ciclos Trimestrais (CTs).
 * @type {Object.<number, string>}
 */
export const INTERPRETACAO_CT = {
  1: 'Recomecar. Proporcionar nova maneira de se relacionar ou vivenciar a VN do AP.',
  2: 'Desligar-se dos fatos da vida permitindo o curso natural sem interferir. Aguardar.',
  3: 'Produzir desenvolvimento e crescimento na VN do AP.',
  4: 'Organizar e estruturar na vida humana a VN do AP.',
  5: 'Mudar e transformar a VN do AP.',
  6: 'Harmonizar, produzindo conciliacao na VN do AP.',
  7: 'Descobrir e incorporar as caracteristicas da VN do AP.',
  8: 'Visualizar e enxergar as caracteristicas da VN do AP.',
  9: 'Concretizar, fazer acontecer, realizar as caracteristicas da VN do AP.',
  0: 'Vácuo do Ano Pessoal: estagnacao e paralisacao. Nenhuma atitude nova deve ser implantada.',
  11: 'CT 2 com sensibilidade e intuicao ampliadas. Praticar relaxamento e meditacao.',
  22: 'CT 4 com sensibilidade e pratica espiritual acentuadas.',
}

/**
 * Tabela de eventos favoraveis por VN do AP ou CT.
 * Nao utilizar quando AP 9 ou nos Vacuos do Renascimento.
 * @type {Object.<string, number[]>}
 */
export const EVENTOS_FAVORAVEIS = {
  'Afetividade / casamento - rompimento/separacao': [1, 2, 5, 6, 9],
  'Afetividade / casamento - inicio ou firmar': [1, 2, 6],
  'Automovel - compra ou venda': [4, 5, 8],
  'Cirurgia de estetica': [3, 5, 6],
  'Cirurgias em geral': [2, 6, 7, 9],
  'Divulgacao, propaganda e comunicacao': [1, 3, 5],
  'Engenharia': [1, 4, 8],
  'Esportes - iniciar': [1, 4, 5],
  'Imovel - compra/locacao para moradia': [1, 4, 5, 6],
  'Imovel - compra/locacao para investimento': [1, 4, 7, 8],
  'Imovel - mudanca': [1, 3, 5, 6],
  'Imovel - venda': [1, 5, 6, 9],
  'Investimentos no mercado financeiro': [1, 4, 7, 8],
  'Justica - processos e acordos': [1, 7, 8, 9],
  'Livro - editar e imprimir': [4, 7, 9, 22],
  'Livro - iniciar e escrever': [1, 4, 7],
  'Livro - lancar e distribuir': [1, 3, 5],
  'Negociacoes e contratos': [1, 2, 4, 7, 8, 9],
  'Pesquisa, Doutorado, Mestrado, cursos': [1, 7, 11, 22],
  'Terapia - inicio ou termino': [2, 6, 11],
  'Trabalho remunerado - trocar ou contratar': [1, 2, 3, 4, 5, 8],
  'Viagem a trabalho': [1, 3, 4, 5, 8],
  'Viagem de lazer': [1, 3, 5, 9],
}

/**
 * Calcula o Ano Universal (AU) para um determinado ano.
 *
 * @param {number} ano - Ano de interesse.
 * @returns {number} VN do Ano Universal.
 */
export function calcularAnoUniversal(ano) {
  return reduzir(
    String(ano).split('').reduce((a, d) => a + parseInt(d), 0)
  )
}

/**
 * Calcula o Mes Universal (MU) para um mes em um ano.
 *
 * @param {number} mes - Mes de interesse (1-12).
 * @param {number} au - Ano Universal calculado.
 * @returns {number} VN do Mes Universal.
 */
export function calcularMesUniversal(mes, au) {
  return reduzir(mes + au)
}

/**
 * Calcula a previsao anual completa para uma pessoa.
 *
 * Retorna o AP, os 4 CTs com suas interpretacoes, os periodos de cada CT
 * baseados na data de aniversario, e os eventos favoraveis para o ano.
 *
 * @param {number} diaNasc - Dia de nascimento.
 * @param {number} mesNasc - Mes de nascimento.
 * @param {number} anoInteresse - Ano para previsao.
 * @param {number} cicloAtual - VN do ciclo vigente.
 * @param {number} realizacaoAtual - VN da realizacao vigente.
 * @param {number} dm - VN do Desafio Maior.
 * @returns {{
 *   ap: number,
 *   interpretacaoAP: {caracteristicas: string, riscos: string},
 *   cts: {ct1: number, ct2: number, ct3: number, ct4: number},
 *   periodosCTs: Array<{ct: string, inicio: string, fim: string, interpretacao: string}>,
 *   eventosFavoraveis: string[]
 * }}
 */
export function calcularPrevisaoAnual(diaNasc, mesNasc, anoInteresse, cicloAtual, realizacaoAtual, dm) {
  const ap = calcularAP(diaNasc, mesNasc, anoInteresse)
  const cts = calcularCTs(ap, cicloAtual, realizacaoAtual, dm)

  const mesNascStr = String(mesNasc).padStart(2, '0')
  const diaNascStr = String(diaNasc).padStart(2, '0')

  const mesMap = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const m = mesNasc - 1

  const periodosCTs = [
    {
      ct: 'CT1',
      inicio: `${diaNascStr}/${mesNascStr}`,
      fim: `${diaNascStr}/${String(((m + 3) % 12) + 1).padStart(2, '0')}`,
      interpretacao: INTERPRETACAO_CT[cts.ct1] || '',
    },
    {
      ct: 'CT2',
      inicio: `${diaNascStr}/${String(((m + 3) % 12) + 1).padStart(2, '0')}`,
      fim: `${diaNascStr}/${String(((m + 6) % 12) + 1).padStart(2, '0')}`,
      interpretacao: INTERPRETACAO_CT[cts.ct2] || '',
    },
    {
      ct: 'CT3',
      inicio: `${diaNascStr}/${String(((m + 6) % 12) + 1).padStart(2, '0')}`,
      fim: `${diaNascStr}/${String(((m + 9) % 12) + 1).padStart(2, '0')}`,
      interpretacao: INTERPRETACAO_CT[cts.ct3] || '',
    },
    {
      ct: 'CT4',
      inicio: `${diaNascStr}/${String(((m + 9) % 12) + 1).padStart(2, '0')}`,
      fim: `${diaNascStr}/${mesNascStr} (proximo ano)`,
      interpretacao: INTERPRETACAO_CT[cts.ct4] || '',
    },
  ]

  const eventosFavoraveis = Object.entries(EVENTOS_FAVORAVEIS)
    .filter(([, vns]) => vns.includes(ap))
    .map(([evento]) => evento)

  return {
    ap,
    interpretacaoAP: INTERPRETACAO_AP[ap] || { caracteristicas: '', riscos: '' },
    cts,
    periodosCTs,
    eventosFavoraveis,
  }
}
