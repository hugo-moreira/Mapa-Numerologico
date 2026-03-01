/**
 * @module pitagorico
 * @description Fundacao do sistema numerologico pitagorico.
 * Contem a tabela de correspondencia letra-numero, a logica de reducao
 * numerologica com preservacao de numeros mestres (11 e 22), e as regras
 * de classificacao da letra Y como vogal ou consoante conforme o contexto.
 */

/**
 * Tabela pitagorica: mapeia cada letra do alfabeto ao seu valor numerico (1-8).
 * Vogais e consoantes compartilham a mesma tabela de conversao.
 * @type {Object.<string, number>}
 */
export const TABELA_PITAGORICA = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8,
  I: 9, J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7,
  Q: 8, R: 9, S: 1, T: 2, U: 3, V: 4, W: 5, X: 6,
  Y: 7, Z: 8,
}

/**
 * Conjunto de vogais fixas do alfabeto (excluindo Y, que e tratado separadamente).
 * @type {Set<string>}
 */
const VOGAIS_FIXAS = new Set(['A', 'E', 'I', 'O', 'U'])

/**
 * Determina se a letra Y em uma posicao especifica de uma palavra deve ser
 * tratada como vogal ou consoante, conforme as regras da numerologia pitagorica.
 *
 * Regras:
 * - Y e VOGAL quando: e a primeira letra seguida por consoante; e a ultima letra
 *   apos consoante; esta entre duas consoantes.
 * - Y e CONSOANTE quando: esta entre vogais; e seguido por vogal; substitui som J.
 *
 * @param {string} palavra - A palavra onde Y aparece (em maiusculas).
 * @param {number} posicao - Indice da letra Y dentro da palavra.
 * @returns {boolean} true se Y deve ser tratado como vogal, false se consoante.
 */
export function yEhVogal(palavra, posicao) {
  const anterior = posicao > 0 ? palavra[posicao - 1] : null
  const proximo = posicao < palavra.length - 1 ? palavra[posicao + 1] : null

  const anteriorEhVogal = anterior && VOGAIS_FIXAS.has(anterior)
  const proximoEhVogal = proximo && VOGAIS_FIXAS.has(proximo)

  if (!anterior && proximo && !proximoEhVogal) return true
  if (!proximo && anterior && !anteriorEhVogal) return true
  if (anterior && proximo && !anteriorEhVogal && !proximoEhVogal) return true

  return false
}

/**
 * Verifica se um caractere e uma vogal, considerando as regras do Y.
 *
 * @param {string} letra - Letra a verificar (maiuscula).
 * @param {string} palavra - Palavra completa onde a letra aparece (maiuscula).
 * @param {number} posicao - Indice da letra na palavra.
 * @returns {boolean} true se a letra e vogal.
 */
export function ehVogal(letra, palavra, posicao) {
  if (VOGAIS_FIXAS.has(letra)) return true
  if (letra === 'Y') return yEhVogal(palavra, posicao)
  return false
}

/**
 * Reduz um numero para um digito de 1 a 9, preservando os numeros mestres 11 e 22.
 * A reducao e feita somando os digitos do numero repetidamente ate atingir o criterio.
 *
 * @param {number} numero - Numero inteiro positivo a ser reduzido.
 * @returns {number} Numero reduzido (1-9, 11 ou 22).
 *
 * @example
 * reduzir(29) // retorna 11 (numero mestre preservado)
 * reduzir(14) // retorna 5
 * reduzir(22) // retorna 22 (numero mestre preservado)
 */
export function reduzir(numero) {
  if (numero === 11 || numero === 22) return numero
  if (numero <= 9) return numero

  let soma = String(numero)
    .split('')
    .reduce((acc, d) => acc + parseInt(d), 0)

  if (soma === 11 || soma === 22) return soma
  if (soma > 9) return reduzir(soma)
  return soma
}

/**
 * Converte uma letra para seu valor numerico pitagorico.
 *
 * @param {string} letra - Letra do alfabeto (qualquer capitalizacao).
 * @returns {number} Valor numerico de 1 a 9, ou 0 se nao for letra.
 */
export function valorLetra(letra) {
  const l = letra.toUpperCase()
  return TABELA_PITAGORICA[l] || 0
}

/**
 * Normaliza um nome completo: remove acentos, converte para maiusculas
 * e elimina caracteres nao-alfabeticos.
 *
 * @param {string} nome - Nome completo com possivel acentuacao.
 * @returns {string} Nome normalizado em maiusculas sem acentos.
 */
export function normalizarNome(nome) {
  return nome
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z ]/g, '')
    .trim()
}
