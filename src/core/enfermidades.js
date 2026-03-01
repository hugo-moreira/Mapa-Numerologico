/**
 * @module enfermidades
 * @description Tecnica 22: Enfermidades Fisicas e Mentais.
 *
 * Mapeia os possiveis sintomas e areas de saude associadas a cada Vibracao
 * Numerica (VN) quando em duplicidade, triplicidade ou mais no mapa, ou
 * quando bloqueada/usada na polaridade negativa.
 *
 * USO PREVENTIVO: baseado nas duplicidades ou mais do mapa.
 * USO PARA PESSOA JA DOENTE: VN bloqueada ou em polaridade negativa pode
 * gerar enfermidades em ate 5 anos apos o inicio do desequilibrio.
 */

/**
 * Tabela completa de sintomas e areas de saude por VN.
 * Extraida das Apostilas - Aula 7 do curso de formacao.
 * @type {Object.<number, string[]>}
 */
export const SINTOMAS_POR_VN = {
  1: ['Anemia', 'Anorexia', 'Audicao', 'Cardio', 'Dentes', 'Diabetes',
    'Digestivo', 'Disturbio Bipolar', 'Fala', 'Insonia', 'Medo',
    'Musculos', 'Nervosismo', 'Ossos', 'Palpitacoes', 'Pele', 'Pressao',
    'Ressecamento', 'Rins', 'Visao'],
  2: ['Colesterol', 'Depressao', 'Enxaqueca', 'Mama', 'Tireoide'],
  3: ['Audicao', 'Anorexia', 'Fala', 'Disturbio Bipolar', 'Genitais',
    'Medo', 'Palpitacoes', 'Pele', 'Reprodutores', 'Respiratorios', 'Venereas'],
  4: ['Anemia', 'Dentes', 'Insonia', 'Musculos', 'Nervosismo', 'Ossos',
    'Pressao', 'Rins'],
  5: ['Audicao', 'Anorexia', 'Diabetes', 'Digestivo', 'Disturbio Bipolar',
    'Fala', 'Genitais', 'Medo', 'Palpitacoes', 'Pele', 'Ressecamento',
    'Reprodutores', 'Respiratorios', 'Venereas'],
  6: ['Cardio', 'Colesterol', 'Depressao', 'Enxaqueca', 'Mama', 'Tireoide'],
  7: ['Diabetes', 'Digestivo', 'Genitais', 'Insonia', 'Mente', 'Nervosismo',
    'Ressecamento', 'Reprodutores', 'Respiratorios', 'Rins', 'Venereas', 'Visao'],
  8: ['Anemia', 'Cardio', 'Dentes', 'Diabetes', 'Digestivo', 'Insonia',
    'Musculos', 'Nervosismo', 'Ossos', 'Pressao', 'Ressecamento', 'Rins'],
  9: ['Audicao', 'Anorexia', 'Cardio', 'Colesterol', 'Depressao',
    'Disturbio Bipolar', 'Enxaqueca', 'Fala', 'Genitais', 'Medo', 'Mente',
    'Mama', 'Palpitacoes', 'Pele', 'Reprodutores', 'Respiratorios',
    'Tireoide', 'Venereas', 'Visao'],
  11: ['Colesterol', 'Depressao', 'Enxaqueca', 'Mama', 'Mente', 'Tireoide'],
  22: ['Anemia', 'Dentes', 'Mente', 'Musculos', 'Ossos', 'Pressao', 'Visao'],
}

/**
 * Retorna as areas de saude a monitorar com base nas duplicidades do mapa.
 *
 * Regra: apenas duplicidades ou mais sao consideradas.
 * - Duplicidade nas VNs fixas: atencao a vida toda.
 * - Duplicidade apenas nas VNs ciclicas: atencao somente naquele periodo.
 *
 * @param {Array<{vn: number, quantidade: number, tipo: string}>} duplicidades
 * Resultado de calcularDuplicidades (do modulo analises.js).
 * @param {import('./analises.js').MapaCompleto} mapa - Mapa completo (para determinar fixas vs ciclicas).
 * @returns {Array<{vn: number, tipo: string, sintomas: string[], atencao: string}>}
 * Array de alertas de saude ordenados por intensidade (Qt > Qd > T > D).
 */
export function calcularEnfermidades(duplicidades, mapa) {
  if (duplicidades.length === 0) return []

  const fixas = new Set([mapa.mo, mapa.eu, mapa.ex, mapa.cd, mapa.dm, mapa.merito, mapa.tributo])
  const ordemIntensidade = { Qt: 0, Qd: 1, T: 2, D: 3 }

  return duplicidades
    .filter((d) => SINTOMAS_POR_VN[d.vn])
    .map((d) => ({
      vn: d.vn,
      tipo: d.tipo,
      sintomas: SINTOMAS_POR_VN[d.vn],
      atencao: fixas.has(d.vn)
        ? 'Atenção a vida toda'
        : 'Atenção no período de vivência desta VN',
    }))
    .sort((a, b) => ordemIntensidade[a.tipo] - ordemIntensidade[b.tipo])
}

/**
 * Retorna orientacoes gerais sobre enfermidades para uma VN especifica
 * que esteja em bloqueio ou polaridade negativa.
 *
 * Em ate 5 anos apos o inicio do bloqueio/negativo, podem surgir enfermidades
 * nas areas mapeadas para aquela VN.
 *
 * @param {number} vn - VN bloqueada ou em polaridade negativa.
 * @returns {{ vn: number, sintomas: string[], aviso: string }}
 */
export function enfermidadesPorBloqueio(vn) {
  return {
    vn,
    sintomas: SINTOMAS_POR_VN[vn] || [],
    aviso: `Bloqueio ou uso negativo da VN ${vn} pode gerar enfermidades nas areas listadas em ate 5 anos. Desbloquear praticando as caracteristicas positivas desta VN.`,
  }
}
