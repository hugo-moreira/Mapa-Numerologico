/**
 * @module personalidade
 * @description Calcula as Vibracoes Numericas (VNs) fixas derivadas do nome completo:
 * MO (Motivacao/Alma), EU (Eu Intimo/Sonho), EX (Expressao/Talento),
 * Merito e Tributo.
 * Todas as funcoes utilizam a tabela pitagorica e reducao com preservacao de
 * numeros mestres 11 e 22.
 */

import { normalizarNome, ehVogal, valorLetra, reduzir } from './pitagorico.js'

/**
 * Calcula o MO (Motivacao / Alma): soma numerologica de todas as VOGAIS
 * do nome completo de registro civil.
 *
 * O MO representa quem a pessoa e em sua essencia, sua motivacao interna,
 * o que a move e o que ela precisa para se sentir realizada.
 *
 * @param {string} nome - Nome completo de registro (pode conter acentos).
 * @returns {number} VN do MO (1-9, 11 ou 22).
 *
 * @example
 * calcularMO('Symone dos Santos Mattos') // retorna 11
 */
export function calcularMO(nome) {
  const normalizado = normalizarNome(nome)
  let soma = 0

  const palavras = normalizado.split(' ').filter(Boolean)
  for (const palavra of palavras) {
    for (let i = 0; i < palavra.length; i++) {
      if (ehVogal(palavra[i], palavra, i)) {
        soma += valorLetra(palavra[i])
      }
    }
  }

  return reduzir(soma)
}

/**
 * Calcula o EU (Eu Intimo / Sonho): soma numerologica de todas as CONSOANTES
 * do nome completo de registro civil.
 *
 * O EU representa o sonho de vida da pessoa, o que ela mais deseja conquistar
 * e como ela age em momentos de pressao (valvula de escape).
 *
 * @param {string} nome - Nome completo de registro (pode conter acentos).
 * @returns {number} VN do EU (1-9, 11 ou 22).
 *
 * @example
 * calcularEU('Symone dos Santos Mattos') // retorna 6
 */
export function calcularEU(nome) {
  const normalizado = normalizarNome(nome)
  let soma = 0

  const palavras = normalizado.split(' ').filter(Boolean)
  for (const palavra of palavras) {
    for (let i = 0; i < palavra.length; i++) {
      if (!ehVogal(palavra[i], palavra, i)) {
        soma += valorLetra(palavra[i])
      }
    }
  }

  return reduzir(soma)
}

/**
 * Calcula o EX (Expressao / Talento): soma de MO + EU.
 *
 * O EX representa como a pessoa se expressa para o mundo, seus talentos
 * naturais e o que os outros percebem nela.
 *
 * @param {number} mo - VN do MO ja calculado.
 * @param {number} eu - VN do EU ja calculado.
 * @returns {number} VN do EX (1-9, 11 ou 22).
 *
 * @example
 * calcularEX(11, 6) // retorna 8 (11+6=17, 1+7=8)
 */
export function calcularEX(mo, eu) {
  return reduzir(mo + eu)
}

/**
 * Calcula o Merito: soma de MO + CD.
 *
 * O Merito representa habilidades e dons adquiridos em vidas anteriores,
 * funcionando como catalisador que facilita a combinacao entre MO e CD.
 * Quando ativado, torna-se o numero mais forte do mapa.
 *
 * Regras especiais:
 * - Merito = Realizacao: maior facilidade para usar o Merito naquele periodo.
 * - Merito = Desafio: maior dificuldade para usar o Merito naquele periodo.
 * - Merito = Ausencia: pouca ajuda para utilizar o Merito.
 *
 * @param {number} mo - VN do MO.
 * @param {number} cd - VN do CD (Caminho de Destino).
 * @returns {number} VN do Merito (1-9, 11 ou 22).
 */
export function calcularMerito(mo, cd) {
  return reduzir(mo + cd)
}

/**
 * Calcula o Tributo: soma de MO + EX.
 *
 * O Tributo representa o que deve ser praticado nesta vida como um "imposto"
 * obrigatorio. Quando praticado no positivo, facilita a manifestacao da MO.
 * Quando ignorado, interfere negativamente na EX.
 *
 * @param {number} mo - VN do MO.
 * @param {number} ex - VN do EX.
 * @returns {number} VN do Tributo (1-9, 11 ou 22).
 */
export function calcularTributo(mo, ex) {
  return reduzir(mo + ex)
}

/**
 * Calcula todos os numeros de personalidade de uma vez.
 *
 * @param {string} nome - Nome completo de registro.
 * @param {number} cd - VN do CD (necessario para Merito).
 * @returns {{ mo: number, eu: number, ex: number, merito: number, tributo: number }}
 * Objeto com todos os valores de personalidade.
 */
export function calcularPersonalidade(nome, cd) {
  const mo = calcularMO(nome)
  const eu = calcularEU(nome)
  const ex = calcularEX(mo, eu)
  const merito = calcularMerito(mo, cd)
  const tributo = calcularTributo(mo, ex)
  return { mo, eu, ex, merito, tributo }
}
