/**
 * @module frases
 * @description Gera as tres frases resumo do Mapa Numerologico Pitagorico:
 * Frase Curta, Frase mais Expandida e Frase Final (espaco para ajuste humano).
 *
 * A Frase Curta combina o CD (o que a pessoa veio fazer) com o modificador do MO
 * (como ela faz isso). A Frase mais Expandida acrescenta EU, EX e DM, formando
 * a descricao mais completa da missao da pessoa.
 *
 * A Frase Final fica em branco: e preenchida manualmente pelo numerologista
 * apos o ajuste humano/intuitivo na sessao.
 */

/**
 * Palavras-chave do CD (o que a pessoa veio fazer nesta vida).
 * Usadas na forma verbal/nominal na Frase Curta e Expandida.
 * @type {Object.<number, {curto: string, expandido: string}>}
 */
const CD_PALAVRAS = {
  1: { curto: 'Ser independente; Liderar',            expandido: 'Independência, Liderança, Pioneirismo' },
  2: { curto: 'Unir / Conciliar',                     expandido: 'Unir / Conciliar' },
  3: { curto: 'Crescer / Comunicar',                  expandido: 'Crescimento, Comunicação, Criatividade' },
  4: { curto: 'Organizar / Estruturar',                expandido: 'Organização, Trabalho, Estabilidade' },
  5: { curto: 'Transformar / Libertar',                expandido: 'Transformação, Liberdade, Vivências' },
  6: { curto: 'Harmonizar / Amar',                    expandido: 'Harmonia, Amor, Responsabilidade afetiva' },
  7: { curto: 'Autoconhecer / Descobrir',              expandido: 'Autoconhecimento, Espiritualidade, Sabedoria' },
  8: { curto: 'Aplicar justiça / Conquistar',          expandido: 'Justiça, Objetividade, Conquista material' },
  9: { curto: 'Servir / Completar',                   expandido: 'Humanidade, Doação, Completude' },
  11: { curto: 'Unir com Espiritualidade',             expandido: 'União Espiritual, Sensibilidade, Intuição' },
  22: { curto: 'Construir com Mestria',                expandido: 'Mestria, Grande Construção, Liderança espiritual' },
}

/**
 * Modificador do MO: como a pessoa pratica o CD (o estilo, o instrumento).
 * O modificador aparece na Frase Curta como complemento do CD.
 * @type {Object.<number, string>}
 */
const MO_MODIFICADOR = {
  1: 'com Independência e Liderança',
  2: 'com Parceria e Diplomacia',
  3: 'com Criatividade e Comunicação',
  4: 'com Dedicação e Organização',
  5: 'com Liberdade e Transformação',
  6: 'com Amor e Harmonia',
  7: 'com Espiritualidade e Autoconhecimento',
  8: 'com Justiça e Objetividade',
  9: 'com Humanidade e Doacao',
  11: 'com Sensibilidade; Conexão',
  22: 'com Mestria e Espiritualidade',
}

/**
 * Palavras-chave do EU (o sonho de vida; o que a pessoa deseja interiormente).
 * Aparece na Frase Expandida como plano afetivo/interior.
 * @type {Object.<number, string>}
 */
const EU_PALAVRAS = {
  1: 'Autoestima e identidade própria',
  2: 'Sensibilidade emocional',
  3: 'Expressão e alegria de viver',
  4: 'Segurança e estrutura sólida',
  5: 'Liberdade e novas experiências',
  6: 'Compromisso afetivo',
  7: 'Introspecção e espiritualidade',
  8: 'Conquista e reconhecimento',
  9: 'Doação e cuidado com o próximo',
  11: 'Intuição e sensibilidade espiritual',
  22: 'Visão ampla e realização coletiva',
}

/**
 * Palavras-chave do EX (talento natural; como a pessoa se expressa para o mundo).
 * Aparece na Frase Expandida como plano de expressão.
 * @type {Object.<number, string>}
 */
const EX_PALAVRAS = {
  1: 'Expressão com liderança e independência',
  2: 'Expressão com diplomacia e parceria',
  3: 'Expressão criativa e comunicativa',
  4: 'Expressão com precisão e metodologia',
  5: 'Expressão versátil e dinâmica',
  6: 'Expressão com afeto e responsabilidade',
  7: 'Expressão analítica e espiritual',
  8: 'Aplicar justiça, verdade e objetividade na matéria',
  9: 'Expressão humanitária e abrangente',
  11: 'Expressão com sensibilidade e inspiração espiritual',
  22: 'Expressão com mestria e visão coletiva',
}

/**
 * Palavras-chave do DM (o principal aprendizado da vida toda).
 * Aparece no final da Frase Expandida como o desafio central a superar.
 * @type {Object.<number, string>}
 */
const DM_PALAVRAS = {
  0: '',
  1: 'Liderando com Identidade',
  2: 'Unindo com Diplomacia',
  3: 'Crescendo com Comunicação',
  4: 'Organizando com Dedicação',
  5: 'Transformando com Liberdade',
  6: 'Harmonizando com Amor',
  7: 'Descobrindo com Espiritualidade',
  8: 'Construindo com Justiça',
  9: 'Servindo com Humanidade',
  11: 'Conectando com Sensibilidade Espiritual',
  22: 'Construindo com Mestria Espiritual',
}

/**
 * Gera as tres frases do Mapa Numerologico a partir das quatro VNs principais.
 *
 * - Frase Curta: CD + modificador do MO. Frase concisa para o cliente reconhecer
 *   sua missao de forma imediata.
 * - Frase mais Expandida: acrescenta EU, EX e DM. Descreve o instrumento
 *   (como pratica), o sonho interior, o talento e o aprendizado central.
 * - Frase Final: retorna string vazia. E preenchida manualmente pelo numerologista
 *   apos o ajuste humano na sessao com o cliente.
 *
 * @param {number} mo - VN do MO (Motivacao / Alma).
 * @param {number} eu - VN do EU (Eu Intimo / Sonho de vida).
 * @param {number} ex - VN do EX (Expressao / Talento).
 * @param {number} cd - VN do CD (Caminho de Destino).
 * @param {number} dm - VN do DM (Desafio Maior).
 * @returns {{ fraseCurta: string, fraseExpandida: string, fraseFinal: string }}
 * Objeto com as tres frases geradas.
 *
 * @example
 * gerarFrases(11, 6, 8, 2, 1)
 * // {
 * //   fraseCurta: 'Unir / Conciliar com Sensibilidade; Conexão',
 * //   fraseExpandida: 'Unir / Conciliar, Sensibilidade, Conexão, Compromisso afetivo, Aplicar justiça, verdade e objetividade na matéria, Liderando com Identidade',
 * //   fraseFinal: ''
 * // }
 */
export function gerarFrases(mo, eu, ex, cd, dm) {
  const cdPalavras = CD_PALAVRAS[cd] || { curto: String(cd), expandido: String(cd) }
  const moMod = MO_MODIFICADOR[mo] || ''
  const euPalavra = EU_PALAVRAS[eu] || ''
  const exPalavra = EX_PALAVRAS[ex] || ''
  const dmPalavra = DM_PALAVRAS[dm] || ''

  // Frase Curta: "{CD_curto} {MO_modificador}"
  const fraseCurta = moMod
    ? `${cdPalavras.curto} ${moMod}`
    : cdPalavras.curto

  // Frase Expandida: combina todos os elementos em lista
  const partes = [cdPalavras.expandido]

  // Extrair apenas palavras do MO modificador (sem "com " prefixo)
  const moSemPrefixo = moMod.replace(/^com\s+/i, '')
  if (moSemPrefixo && moSemPrefixo !== cdPalavras.expandido) {
    partes.push(moSemPrefixo)
  }

  if (euPalavra) partes.push(euPalavra)
  if (exPalavra) partes.push(exPalavra)
  if (dmPalavra) partes.push(dmPalavra)

  const fraseExpandida = partes.join(', ')

  return {
    fraseCurta,
    fraseExpandida,
    fraseFinal: '',
  }
}
