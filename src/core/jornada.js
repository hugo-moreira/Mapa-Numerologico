/**
 * @module jornada
 * @description Calcula as Vibracoes Numericas (VNs) da Jornada de Vida derivadas
 * da data de nascimento: CD (Caminho de Destino), Ciclos de Vida (C1, C2, C3),
 * Desafios (D1, D2, DM), Realizacoes (R1, R2, R3, R4) e Ano Pessoal (AP) com
 * seus Ciclos Trimestrais (CT1 a CT4).
 *
 * Regra geral: numeros mestres 11 e 22 sao preservados em todos os calculos,
 * EXCETO nos Ciclos de Vida e Desafios (conforme especificacao do curso).
 */

import { reduzir } from './pitagorico.js'

/**
 * Reduz um numero sem preservar numeros mestres (usado em Ciclos e Desafios).
 *
 * @param {number} numero - Numero a reduzir.
 * @returns {number} Numero reduzido de 1 a 9 (sem excecao para 11 e 22).
 */
function reduzirSimples(numero) {
  if (numero <= 9) return numero
  const soma = String(numero).split('').reduce((a, d) => a + parseInt(d), 0)
  return soma > 9 ? reduzirSimples(soma) : soma
}

/**
 * Calcula o CD (Caminho de Destino): soma numerologica completa da data de
 * nascimento (dia + mes + ano), com preservacao de numeros mestres.
 *
 * O CD representa o proposito de vida, o que a pessoa veio fazer no mundo.
 * E o numero mais importante da Jornada de Vida.
 *
 * Formula: reduzir(soma_digitos_dia + soma_digitos_mes + soma_digitos_ano)
 *
 * @param {number} dia - Dia de nascimento (1-31).
 * @param {number} mes - Mes de nascimento (1-12).
 * @param {number} ano - Ano de nascimento (ex: 1986).
 * @returns {number} VN do CD (1-9, 11 ou 22).
 *
 * @example
 * calcularCD(23, 9, 1986) // retorna 2
 * // 23=(2+3=5) + 9=(9) + 1986=(1+9+8+6=24,2+4=6) => 5+9+6=20 => 2+0=2
 */
export function calcularCD(dia, mes, ano) {
  const somaDia = reduzir(dia)
  const somaMes = reduzir(mes)
  const somaAno = reduzir(
    String(ano).split('').reduce((a, d) => a + parseInt(d), 0)
  )
  return reduzir(somaDia + somaMes + somaAno)
}

/**
 * Calcula os tres Ciclos de Vida (C1, C2, C3).
 *
 * Os ciclos representam os tres grandes periodos da vida humana:
 * - C1 (Ciclo Formativo, 0-28 anos): baseado no MES de nascimento.
 *   Formacao da personalidade, relacao familiar, infancia e adolescencia.
 * - C2 (Ciclo Produtivo, 29-56 anos): baseado no DIA de nascimento.
 *   O mais importante - periodo de missao, propósito e construcao.
 * - C3 (Ciclo da Colheita, 57+ anos): baseado no ANO de nascimento.
 *   Colhe-se o que foi plantado nos ciclos anteriores.
 *
 * ATENCAO: Numeros mestres NAO sao preservados nos ciclos.
 *
 * @param {number} dia - Dia de nascimento.
 * @param {number} mes - Mes de nascimento.
 * @param {number} ano - Ano de nascimento.
 * @returns {{ c1: number, c2: number, c3: number }} Objeto com os tres ciclos.
 */
export function calcularCiclos(dia, mes, ano) {
  return {
    c1: reduzirSimples(mes),
    c2: reduzirSimples(dia),
    c3: reduzirSimples(
      String(ano).split('').reduce((a, d) => a + parseInt(d), 0)
    ),
  }
}

/**
 * Calcula os tres Desafios de Vida (D1, D2, DM).
 *
 * Os desafios representam os aprendizados da vida. Sao sentidos sempre
 * na polaridade negativa; o aprendizado consiste em transforma-los em positivos.
 *
 * - D1 (1o Desafio Menor, 0-28 anos): |dia - mes|
 * - D2 (2o Desafio Menor, 29-56 anos): |mes - soma_ano|
 * - DM (Desafio Maior, vida toda): |D1 - D2|
 *
 * ATENCAO: Numeros mestres NAO aparecem nos desafios.
 * Se o resultado for 0, e o "Desafio com Zero" (caso especial muito raro).
 *
 * @param {number} dia - Dia de nascimento.
 * @param {number} mes - Mes de nascimento.
 * @param {number} ano - Ano de nascimento.
 * @returns {{ d1: number, d2: number, dm: number }} Objeto com os tres desafios.
 *
 * @example
 * calcularDesafios(23, 9, 1986)
 * // d1 = |23-9| = 14 => reduzir => 5
 * // d2 = |9-6| = 3
 * // dm = |5-3| = 2... (ver exemplo real no Levantamento)
 */
export function calcularDesafios(dia, mes, ano) {
  const somaDia = reduzirSimples(dia)
  const somaMes = reduzirSimples(mes)
  const somaAno = reduzirSimples(
    String(ano).split('').reduce((a, d) => a + parseInt(d), 0)
  )

  const d1 = Math.abs(somaDia - somaMes)
  const d2 = Math.abs(somaMes - somaAno)
  const dm = Math.abs(d1 - d2)

  return { d1, d2, dm }
}

/**
 * Calcula as quatro Realizacoes de Vida (R1, R2, R3, R4) com suas faixas etarias.
 *
 * As realizacoes representam momentos positivos de conquista, com vibracao
 * exclusivamente positiva. As idades sao calculadas em funcao do CD.
 *
 * Formulas:
 * - R1 = reduzir(dia + mes) | periodo: 0 ate (36 - CD)
 * - R2 = reduzir(dia + soma_ano) | periodo: fim_R1+1 ate fim_R1+9
 * - R3 = reduzir(R1 + R2) | periodo: fim_R2+1 ate fim_R2+9
 * - R4 = reduzir(mes + soma_ano) | periodo: fim_R3+1 ate fim da vida
 *
 * @param {number} dia - Dia de nascimento.
 * @param {number} mes - Mes de nascimento.
 * @param {number} ano - Ano de nascimento.
 * @param {number} cd - VN do CD (para calcular as faixas etarias).
 * @returns {Array<{vn: number, inicio: number, fim: number|null}>}
 * Array de 4 realizacoes com VN e faixa etaria.
 */
export function calcularRealizacoes(dia, mes, ano, cd) {
  const somaDia = reduzir(dia)
  const somaMes = reduzir(mes)
  const somaAno = reduzir(
    String(ano).split('').reduce((a, d) => a + parseInt(d), 0)
  )

  const cdBase = cd === 11 ? 2 : cd === 22 ? 4 : cd
  const fimR1 = 36 - cdBase

  const r1 = reduzir(somaDia + somaMes)
  const r2 = reduzir(somaDia + somaAno)
  const r3 = reduzir(r1 + r2)
  const r4 = reduzir(somaMes + somaAno)

  return [
    { vn: r1, inicio: 0, fim: fimR1 },
    { vn: r2, inicio: fimR1 + 1, fim: fimR1 + 9 },
    { vn: r3, inicio: fimR1 + 10, fim: fimR1 + 18 },
    { vn: r4, inicio: fimR1 + 19, fim: null },
  ]
}

/**
 * Calcula o Ano Pessoal (AP) para um determinado ano de interesse.
 *
 * O AP revela as condicoes vibratories numericas do ano em curso.
 * Formula: reduzir(dia_nasc + mes_nasc + ano_interesse)
 *
 * ATENCAO: Se a pessoa ainda nao fez aniversario no ano de interesse,
 * considerar o AP anterior ao encontrado na somatoria.
 *
 * @param {number} diaNasc - Dia de nascimento.
 * @param {number} mesNasc - Mes de nascimento.
 * @param {number} anoInteresse - Ano para o qual calcular o AP.
 * @param {number} [mesAtual] - Mes atual (para ajuste pre-aniversario). Opcional.
 * @param {number} [diaAtual] - Dia atual (para ajuste pre-aniversario). Opcional.
 * @returns {number} VN do Ano Pessoal (1-9, 11 ou 22).
 *
 * @example
 * calcularAP(23, 9, 2024)
 * // reduzir(23+9+2024) = reduzir(5+9+8) = reduzir(22) = 22
 */
export function calcularAP(diaNasc, mesNasc, anoInteresse, mesAtual, diaAtual) {
  const somaDia = reduzir(diaNasc)
  const somaMes = reduzir(mesNasc)
  const somaAno = reduzir(
    String(anoInteresse).split('').reduce((a, d) => a + parseInt(d), 0)
  )
  let ap = reduzir(somaDia + somaMes + somaAno)

  if (mesAtual !== undefined && diaAtual !== undefined) {
    const jaFezAniversario =
      mesAtual > mesNasc || (mesAtual === mesNasc && diaAtual >= diaNasc)
    if (!jaFezAniversario) {
      ap = reduzir(ap - 1 === 0 ? 9 : ap - 1)
    }
  }

  return ap
}

/**
 * Calcula os quatro Ciclos Trimestrais (CTs) do Ano Pessoal.
 *
 * Os CTs dividem o AP em 4 periodos de aproximadamente 3 meses cada,
 * afinados com o ciclo e a realizacao vigentes na idade atual da pessoa.
 *
 * Formulas:
 * - CT1 = reduzir(AP + cicloAtual)
 * - CT2 = reduzir(AP + realizacaoAtual)
 * - CT3 = reduzir(AP + DM)  [subtracao: AP - DM]
 * - CT4 = reduzir(CT1 + CT2 + CT3)
 *
 * @param {number} ap - Ano Pessoal calculado.
 * @param {number} cicloAtual - VN do ciclo vigente na idade atual (C1, C2 ou C3).
 * @param {number} realizacaoAtual - VN da realizacao vigente na idade atual.
 * @param {number} dm - VN do Desafio Maior.
 * @returns {{ ct1: number, ct2: number, ct3: number, ct4: number }}
 */
export function calcularCTs(ap, cicloAtual, realizacaoAtual, dm) {
  const ct1 = reduzir(ap + cicloAtual)
  const ct2 = reduzir(ap + realizacaoAtual)
  const ct3 = reduzir(Math.abs(ap - dm))
  const ct4 = reduzir(ct1 + ct2 + ct3)
  return { ct1, ct2, ct3, ct4 }
}

/**
 * Retorna a idade atual com base na data de nascimento e na data de hoje.
 *
 * @param {number} dia - Dia de nascimento.
 * @param {number} mes - Mes de nascimento (1-12).
 * @param {number} ano - Ano de nascimento.
 * @returns {number} Idade em anos completos.
 */
export function calcularIdade(dia, mes, ano) {
  const hoje = new Date()
  let idade = hoje.getFullYear() - ano
  const mesAtual = hoje.getMonth() + 1
  const diaAtual = hoje.getDate()
  if (mesAtual < mes || (mesAtual === mes && diaAtual < dia)) idade--
  return idade
}

/**
 * Determina qual ciclo (C1, C2 ou C3) esta ativo em uma determinada idade.
 *
 * @param {number} idade - Idade da pessoa.
 * @returns {'c1'|'c2'|'c3'} Chave do ciclo ativo.
 */
export function cicloAtivoPorIdade(idade) {
  if (idade <= 28) return 'c1'
  if (idade <= 56) return 'c2'
  return 'c3'
}

/**
 * Determina qual realizacao (R1, R2, R3 ou R4) esta ativa em uma determinada idade,
 * com base nas faixas calculadas por calcularRealizacoes.
 *
 * @param {number} idade - Idade da pessoa.
 * @param {Array<{vn: number, inicio: number, fim: number|null}>} realizacoes
 * Array retornado por calcularRealizacoes.
 * @returns {number} Indice (0-3) da realizacao ativa.
 */
export function realizacaoAtivaPorIdade(idade, realizacoes) {
  for (let i = 0; i < realizacoes.length; i++) {
    const r = realizacoes[i]
    if (r.fim === null || idade <= r.fim) return i
  }
  return 3
}
