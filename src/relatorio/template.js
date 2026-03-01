/**
 * @module relatorio/template
 * @description Templates e constantes de layout para o relatorio PDF.
 *
 * Define as configuracoes visuais do documento: cores, fontes, margens,
 * tamanhos dos elementos e estrutura das paginas.
 *
 * Utilizado pelo modulo pdf.js para manter consistencia visual no relatorio.
 */

/**
 * Configuracao de cores do relatorio em formato RGB.
 * @type {Object}
 */
export const CORES = {
  titulo: [40, 40, 40],
  texto: [80, 80, 80],
  subtitulo: [120, 120, 120],
  separador: [200, 200, 200],
  destaque: [180, 130, 50],
  fundo: [248, 247, 244],
  mestre: [180, 130, 50],
}

/**
 * Configuracao de fontes e tamanhos.
 * @type {Object}
 */
export const FONTES = {
  tituloPrincipal: 16,
  titulo: 11,
  subtitulo: 9,
  corpo: 8,
  rodape: 7,
}

/**
 * Margens e dimensoes do documento A4 em mm.
 * @type {Object}
 */
export const LAYOUT = {
  margem: 20,
  largura: 170,
  altura: 297,
  alturaUtil: 257,
  rodapeY: 280,
}

/**
 * Estrutura das 3 paginas do relatorio.
 * Define o titulo e as secoes de cada pagina.
 * @type {Array<{pagina: number, titulo: string, secoes: string[]}>}
 */
export const ESTRUTURA_PAGINAS = [
  {
    pagina: 1,
    titulo: 'Dados Pessoais e Pirâmide',
    secoes: ['cabecalho', 'piramide', 'personalidade'],
  },
  {
    pagina: 2,
    titulo: 'Jornada de Vida e Potenciais',
    secoes: ['jornada', 'potenciais', 'pureza', 'duplicidades'],
  },
  {
    pagina: 3,
    titulo: 'Riscos, Características Especiais e Orientação Profissional',
    secoes: ['riscos', 'especiais', 'profissional', 'rodape'],
  },
]
