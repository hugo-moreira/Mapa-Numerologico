/**
 * @module relatorio/pdf
 * @description Gera o relatorio PDF do Mapa Numerologico orientado ao cliente.
 *
 * O relatorio e projetado para ser intuitivo e explicativo: cada numero e
 * acompanhado de uma descricao do que significa na vida da pessoa.
 *
 * Estrutura:
 * - Pagina 1: Capa, numeros principais (MO, EU, EX, CD, Merito) e Frases de Vida
 * - Pagina 2: Jornada de Vida (Ciclos, Desafios, Realizacoes) e Ano Pessoal Atual
 * - Pagina 3: Potenciais e Caracteristicas Especiais
 * - Pagina 4: Orientacao Profissional (Tradicionais e Novas Profissoes)
 */

/** Descricoes interpretativas dos VNs para o cliente */
const DESC_VN = {
  1:  { curta: 'Independência e Liderança', longa: 'Você nasceu para liderar e agir com autonomia. Sua força está na iniciativa, na coragem e na capacidade de abrir novos caminhos.' },
  2:  { curta: 'União e Diplomacia',        longa: 'Você tem o dom da parceria e da sensibilidade. Constrói pontes entre pessoas e encontra força na colaboração e no cuidado com o outro.' },
  3:  { curta: 'Comunicação e Crescimento', longa: 'Você é criativo, expressivo e naturalmente otimista. Sua alegria e talento para comunicar inspiram as pessoas ao redor.' },
  4:  { curta: 'Organização e Trabalho',    longa: 'Você constrói com dedicação e método. Sua estabilidade e senso de responsabilidade são a base de tudo que realiza.' },
  5:  { curta: 'Liberdade e Transformação', longa: 'Você veio para viver intensamente e transformar. Adaptável e dinâmico, cresce através das mudanças e das experiências diversas.' },
  6:  { curta: 'Amor e Responsabilidade',   longa: 'Você irradia afeto e cuidado. Sua missão envolve a família, a harmonia nos relacionamentos e o compromisso com o bem-estar dos seus.' },
  7:  { curta: 'Espiritualidade e Sabedoria', longa: 'Você busca a verdade com profundidade. Sua introspecção, intuição e busca pelo autoconhecimento são seus maiores presentes.' },
  8:  { curta: 'Justiça e Conquista',       longa: 'Você age com determinação e objetividade. Sua força está na honestidade, na justiça e na capacidade de conquistar o que se propõe.' },
  9:  { curta: 'Humanidade e Doação',       longa: 'Você tem um coração universal. Sua completude e generosidade inspiram e tocam muitas vidas ao longo da sua jornada.' },
  11: { curta: 'Sensibilidade Espiritual',  longa: 'Você possui uma conexão espiritual profunda e intuição elevada. Sua sensibilidade é um dom que, bem canalizado, inspira e transforma.' },
  22: { curta: 'Mestria e Grande Construção', longa: 'Você carrega o potencial da grande realização. Sua missão é construir algo de impacto coletivo com visão ampla e maestria.' },
}

/** Descricoes dos ciclos de vida */
const DESC_CICLO = {
  c1: 'Período de formação (0–28 anos): infância, adolescência e primeiras escolhas. Influenciado pelo ambiente familiar.',
  c2: 'Período produtivo (29–56 anos): o mais importante da vida. Missão, realizações e construção do legado pessoal.',
  c3: 'Período da colheita (57+ anos): integração de tudo que foi vivido. Sabedoria, espiritualidade e descanso merecido.',
}

/** Descricoes dos desafios */
const DESC_DESAFIO = {
  d1: 'Desafio do primeiro período (0–28 anos): o aprendizado central da fase de formação.',
  d2: 'Desafio do período produtivo (29–56 anos): o aprendizado central da fase de maior realização.',
  dm: 'Desafio Maior (a vida toda): o aprendizado mais profundo e permanente da sua existência.',
}

/** Nomes dos meses em português */
const MESES_PT = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez']
const MESES_COMPLETO = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

/**
 * Gera e baixa o relatorio PDF do Mapa Numerologico do cliente.
 *
 * @param {Object} mapa - Objeto completo do mapa calculado pelo store.
 * @param {string} nome - Nome completo do cliente.
 * @param {number} diaNasc - Dia de nascimento.
 * @param {number} mesNasc - Mes de nascimento (1-12).
 * @param {number} anoNasc - Ano de nascimento.
 * @returns {Promise<void>}
 */
export async function gerarRelatorioPDF(mapa, nome, diaNasc, mesNasc, anoNasc) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // ── Constantes de layout ────────────────────────────────────────────
  const M = 14          // margem esquerda/direita
  const W = 210 - M * 2 // largura util
  const NAVY   = [28, 42, 58]
  const ORANGE = [212, 135, 58]
  const CREAM  = [252, 246, 236]
  const LGRAY  = [245, 245, 245]
  const WHITE  = [255, 255, 255]
  const DARK   = [30, 30, 30]
  const MID    = [90, 90, 90]
  const LIGHT  = [160, 160, 160]

  let y = M

  // ── Helpers ─────────────────────────────────────────────────────────

  const novaPage = () => { doc.addPage(); y = M }

  const rodape = () => {
    doc.setFontSize(6.5)
    doc.setTextColor(...LIGHT)
    doc.setFont('helvetica', 'normal')
    doc.text('Mapa Numerológico Pitagórico  •  Confidencial  •  Escola of Healing', 105, 292, { align: 'center' })
  }

  const cabSecao = (titulo, cor = NAVY) => {
    doc.setFillColor(...cor)
    doc.rect(M, y, W, 7, 'F')
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    doc.text(titulo.toUpperCase(), M + 3, y + 5)
    y += 9
  }

  const separador = (cor = [220, 220, 220]) => {
    doc.setDrawColor(...cor)
    doc.setLineWidth(0.3)
    doc.line(M, y, M + W, y)
    y += 4
  }

  const txtBold = (t, tamanho = 9, cor = DARK) => {
    doc.setFontSize(tamanho)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...cor)
    doc.text(t, M, y)
    y += tamanho * 0.42 + 2
  }

  const txtNormal = (t, tamanho = 8.5, cor = MID, x = M, maxW = W) => {
    doc.setFontSize(tamanho)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...cor)
    const linhas = doc.splitTextToSize(t, maxW)
    doc.text(linhas, x, y)
    y += linhas.length * (tamanho * 0.42 + 1.2) + 0.5
    return linhas.length
  }

  const txt2col = (rotulo, valor, cor = MID) => {
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DARK)
    doc.text(rotulo + ':', M, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...cor)
    const linhas = doc.splitTextToSize(valor, W - 30)
    doc.text(linhas, M + 28, y)
    y += Math.max(1, linhas.length) * 4.5
  }

  const fmtVN = (vn) => {
    if (!vn && vn !== 0) return '–'
    const base = vn === 11 ? 2 : vn === 22 ? 4 : vn
    return vn === 11 ? '11/2' : vn === 22 ? '22/4' : String(base).padStart(2, '0')
  }

  const fmtBase = (vn) => {
    const base = vn === 11 ? 2 : vn === 22 ? 4 : vn
    return String(base).padStart(2, '0')
  }

  /** Caixa de VN: sigla embaixo, numero no centro */
  const caixaVN = (sigla, vn, cx, cy, destaque = false, largura = 24, altura = 20) => {
    if (destaque) {
      doc.setFillColor(...ORANGE)
    } else {
      doc.setFillColor(...LGRAY)
    }
    doc.roundedRect(cx - largura / 2, cy, largura, altura, 2, 2, 'F')
    doc.setDrawColor(destaque ? 170 : 210, destaque ? 100 : 210, destaque ? 40 : 210)
    doc.setLineWidth(0.4)
    doc.roundedRect(cx - largura / 2, cy, largura, altura, 2, 2, 'S')

    // Superscript para mestres
    if (vn === 11 || vn === 22) {
      doc.setFontSize(6)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...(destaque ? WHITE : DARK))
      doc.text(String(vn), cx - largura / 2 + 2, cy + 4)
    }

    // Número principal
    doc.setFontSize(13)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...(destaque ? WHITE : DARK))
    doc.text(fmtBase(vn), cx, cy + altura - 6, { align: 'center' })

    // Sigla
    doc.setFontSize(6.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(...(destaque ? [240, 220, 200] : LIGHT))
    doc.text(sigla, cx, cy + altura + 4, { align: 'center' })
  }

  const checkarPagina = (espacoNecessario = 20) => {
    if (y + espacoNecessario > 282) { rodape(); novaPage() }
  }

  // ════════════════════════════════════════════════════════════════════
  // PÁGINA 1 — Capa e Números Principais
  // ════════════════════════════════════════════════════════════════════

  // Banner de topo
  doc.setFillColor(...NAVY)
  doc.rect(0, 0, 210, 28, 'F')
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...WHITE)
  doc.text('MAPA NUMEROLÓGICO PITAGÓRICO', 105, 11, { align: 'center' })
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(180, 210, 240)
  doc.text('Relatório Pessoal e Confidencial', 105, 18, { align: 'center' })
  doc.setTextColor(180, 210, 240)
  const dataGerado = new Date().toLocaleDateString('pt-BR')
  doc.text(`Gerado em: ${dataGerado}`, 105, 24, { align: 'center' })

  y = 34

  // Nome e data de nascimento
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...DARK)
  doc.text(nome, 105, y, { align: 'center' })
  y += 6
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...MID)
  const nascStr = `${String(diaNasc).padStart(2,'0')}/${String(mesNasc).padStart(2,'0')}/${anoNasc}  •  ${mapa.idade} anos`
  doc.text(nascStr, 105, y, { align: 'center' })
  y += 8

  separador()

  // ── Números Principais ──────────────────────────────────────────────
  cabSecao('Seus Números Principais')
  y += 3

  const centros = [M + 17, M + 51, M + 85, M + 119, M + 153]
  const siglas  = ['MO', 'EU', 'EX', 'CD', 'MÉRITO']
  const vns     = [mapa.mo, mapa.eu, mapa.ex, mapa.cd, mapa.merito]

  for (let i = 0; i < 5; i++) {
    caixaVN(siglas[i], vns[i], centros[i], y, true)
  }
  y += 28

  // Descrições dos 5 números
  const rotulosPos = ['MO — Motivação / Alma', 'EU — Eu Íntimo / Sonho', 'EX — Expressão / Talento', 'CD — Caminho de Destino', 'Mérito']
  for (let i = 0; i < 5; i++) {
    const desc = DESC_VN[vns[i] === 11 ? 11 : vns[i] === 22 ? 22 : (vns[i] === 11 ? 2 : vns[i] === 22 ? 4 : vns[i])]
    if (!desc) continue
    checkarPagina(14)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DARK)
    doc.text(`${rotulosPos[i]} — ${fmtVN(vns[i])} — ${desc.curta}`, M, y)
    y += 4
    txtNormal(desc.longa, 8, MID)
    y += 1
  }

  separador()

  // ── Pirâmide ────────────────────────────────────────────────────────
  checkarPagina(36)
  cabSecao('Pirâmide do Destino')
  y += 2

  if (mapa.piramide) {
    txt2col('Missão', mapa.piramide.textoCD || '')
    txt2col('Jeito de Ser', mapa.piramide.textoMO || '')
    txt2col('Aprendizado', mapa.piramide.textoDM || '')
    txt2col('Sonho de Vida', mapa.piramide.textoEU || '')
  }

  separador()

  // ── Frases de Vida ──────────────────────────────────────────────────
  checkarPagina(24)
  cabSecao('Frase de Vida')
  y += 3

  if (mapa.frases?.fraseCurta) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bolditalic')
    doc.setTextColor(...NAVY)
    const fraseCurtaLinhas = doc.splitTextToSize(`"${mapa.frases.fraseCurta}"`, W)
    doc.text(fraseCurtaLinhas, 105, y, { align: 'center' })
    y += fraseCurtaLinhas.length * 5.5 + 2
  }

  if (mapa.frases?.fraseExpandida) {
    doc.setFillColor(...CREAM)
    const expandLines = doc.splitTextToSize(mapa.frases.fraseExpandida, W - 6)
    const hCream = expandLines.length * 4.5 + 6
    doc.roundedRect(M, y, W, hCream, 2, 2, 'F')
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(...MID)
    doc.text(expandLines, M + 3, y + 5)
    y += hCream + 4
  }

  rodape()

  // ════════════════════════════════════════════════════════════════════
  // PÁGINA 2 — Jornada de Vida + Ano Pessoal
  // ════════════════════════════════════════════════════════════════════
  novaPage()

  cabSecao('Jornada de Vida — Ciclos')
  y += 2

  const ciclosData = [
    { key: 'c1', label: '1º Ciclo', periodo: '0 a 28 anos', vn: mapa.c1 },
    { key: 'c2', label: '2º Ciclo', periodo: '29 a 56 anos', vn: mapa.c2 },
    { key: 'c3', label: '3º Ciclo', periodo: '57+ anos', vn: mapa.c3 },
  ]

  for (const c of ciclosData) {
    checkarPagina(20)
    const desc = DESC_VN[c.vn]
    doc.setFillColor(...LGRAY)
    const hBloco = desc ? 18 : 12
    doc.roundedRect(M, y, W, hBloco, 2, 2, 'F')

    caixaVN(c.label, c.vn, M + 18, y + 1, false, 28, 16)

    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DARK)
    doc.text(`${c.periodo}  —  ${desc?.curta || ''}`, M + 36, y + 6)

    if (desc) {
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(...MID)
      const linhas = doc.splitTextToSize(DESC_CICLO[c.key], W - 38)
      doc.text(linhas, M + 36, y + 11)
    }
    y += hBloco + 4
  }

  separador()

  // ── Desafios ─────────────────────────────────────────────────────────
  checkarPagina(40)
  cabSecao('Desafios de Vida')
  y += 2

  const desafiosData = [
    { key: 'd1', label: 'D1', periodo: '0 a 28 anos', vn: mapa.d1 },
    { key: 'd2', label: 'D2', periodo: '29 a 56 anos', vn: mapa.d2 },
    { key: 'dm', label: 'DM', periodo: 'Vida toda', vn: mapa.dm },
  ]

  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...MID)
  txtNormal('Os desafios representam aprendizados — a vida os apresenta na polaridade negativa para que você os transforme em virtude.', 7.5, MID)
  y += 1

  for (const d of desafiosData) {
    checkarPagina(16)
    const desc = DESC_VN[d.vn]
    doc.setFillColor(...(d.key === 'dm' ? [240, 232, 218] : LGRAY))
    doc.roundedRect(M, y, W, 14, 2, 2, 'F')

    caixaVN(d.label, d.vn, M + 15, y + 1, d.key === 'dm', 24, 12)

    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...(d.key === 'dm' ? NAVY : DARK))
    doc.text(`${d.periodo}${desc ? '  —  Aprender: ' + desc.curta : ''}`, M + 32, y + 6)

    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(...MID)
    const dDesc = doc.splitTextToSize(DESC_DESAFIO[d.key], W - 34)
    doc.text(dDesc, M + 32, y + 11)
    y += 18
  }

  separador()

  // ── Realizações ───────────────────────────────────────────────────────
  checkarPagina(35)
  cabSecao('Realizações de Vida')
  y += 2
  txtNormal('Momentos de conquista e positividate garantida. Períodos em que a vida te entrega bênçãos.', 7.5, MID)
  y += 1

  const realizNomes = ['R1', 'R2', 'R3', 'R4']
  for (let i = 0; i < 4; i++) {
    const r = mapa.realizacoes?.[i]
    if (!r) continue
    checkarPagina(14)
    const periodo = r.fim ? `${r.inicio} a ${r.fim} anos` : `${r.inicio}+ anos`
    const desc = DESC_VN[r.vn === 11 ? 11 : r.vn === 22 ? 22 : r.vn]
    const ehAtiva = mapa.idade >= r.inicio && (r.fim === null || mapa.idade <= r.fim)

    doc.setFillColor(...(ehAtiva ? CREAM : LGRAY))
    doc.roundedRect(M, y, W, 12, 2, 2, 'F')
    if (ehAtiva) {
      doc.setDrawColor(...ORANGE)
      doc.setLineWidth(0.5)
      doc.roundedRect(M, y, W, 12, 2, 2, 'S')
    }

    caixaVN(realizNomes[i], r.vn, M + 14, y + 0.5, ehAtiva, 22, 11)

    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...(ehAtiva ? NAVY : DARK))
    doc.text(`${periodo}  —  ${desc?.curta || ''}${ehAtiva ? '  ← período atual' : ''}`, M + 30, y + 7)
    y += 15
  }

  separador()

  // ── Ano Pessoal Atual ─────────────────────────────────────────────────
  checkarPagina(60)
  const apAtual = mapa.multiAnoAP?.[1]
  if (apAtual) {
    cabSecao(`Ano Pessoal ${apAtual.ano} — AP ${fmtVN(apAtual.ap)}`, ORANGE)
    y += 2

    // Bloco AP
    const descAP = DESC_VN[apAtual.ap === 11 ? 11 : apAtual.ap === 22 ? 22 : (apAtual.ap > 9 ? apAtual.ap - 9 : apAtual.ap)]
    if (descAP) {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...DARK)
      doc.text(`AP ${fmtVN(apAtual.ap)} — ${descAP.curta}`, M, y)
      y += 5
      txtNormal(descAP.longa, 8, MID)
    }

    // Período e CTs
    const cts = apAtual.cts
    const pcts = apAtual.periodosCT
    const ctLabels = ['CT1', 'CT2', 'CT3', 'CT4']
    const ctVNs = [cts.ct1, cts.ct2, cts.ct3, cts.ct4]

    y += 2
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DARK)
    doc.text('Ciclos Trimestrais:', M, y)
    y += 5

    for (let i = 0; i < 4; i++) {
      checkarPagina(8)
      doc.setFillColor(...LGRAY)
      doc.roundedRect(M, y, W, 8, 1, 1, 'F')
      caixaVN(ctLabels[i], ctVNs[i], M + 12, y + 0.5, false, 20, 7)
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...MID)
      doc.text(`${pcts[i]?.inicio || ''} à ${pcts[i]?.fim || ''}`, M + 30, y + 5.5)
      y += 10
    }

    // Valores mensais
    y += 2
    checkarPagina(20)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DARK)
    doc.text('Vibrações mensais:', M, y)
    y += 5

    const mensais = apAtual.mensais || []
    const colunas = 6
    const larguraCel = W / colunas
    for (let i = 0; i < mensais.length; i++) {
      const col = i % colunas
      const lin = Math.floor(i / colunas)
      const cx = M + col * larguraCel + larguraCel / 2
      const cy = y + lin * 12

      if (checkarPagina === undefined || cy < 270) {
        doc.setFillColor(...LGRAY)
        doc.roundedRect(M + col * larguraCel + 1, cy, larguraCel - 2, 10, 1, 1, 'F')
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...LIGHT)
        doc.text(mensais[i].mes, cx, cy + 4, { align: 'center' })
        doc.setFontSize(9)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(...DARK)
        doc.text(String(mensais[i].valor).padStart(2, '0'), cx, cy + 9, { align: 'center' })
      }
    }
    y += Math.ceil(mensais.length / colunas) * 12 + 3
  }

  rodape()

  // ════════════════════════════════════════════════════════════════════
  // PÁGINA 3 — Potenciais e Características Especiais
  // ════════════════════════════════════════════════════════════════════
  novaPage()

  cabSecao('Como Você Sente e Decide')
  y += 3

  const re = mapa.razaoEmocao
  if (re) {
    const pRazao = re.razao
    const pEmocao = re.emocao

    // Barra Racional/Emocional
    const barW = W - 10
    doc.setFillColor(...LGRAY)
    doc.roundedRect(M, y, barW, 8, 2, 2, 'F')
    doc.setFillColor(...NAVY)
    doc.roundedRect(M, y, barW * pRazao / 100, 8, 2, 2, 'F')
    doc.setFillColor(...ORANGE)
    doc.roundedRect(M + barW * pRazao / 100, y, barW * pEmocao / 100, 8, 2, 2, 'F')

    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...WHITE)
    if (pRazao > 15) doc.text(`Racional ${pRazao}%`, M + 3, y + 5.5)
    if (pEmocao > 15) doc.text(`Emocional ${pEmocao}%`, M + barW * pRazao / 100 + 3, y + 5.5)
    y += 12

    doc.setFontSize(7.5)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(...MID)
    if (pEmocao > pRazao) {
      txtNormal('Você toma decisões predominantemente pelo coração. Sua sensibilidade é sua maior inteligência.', 7.5, MID)
    } else if (pRazao > pEmocao) {
      txtNormal('Você toma decisões predominantemente pela razão. Sua objetividade é um diferencial.', 7.5, MID)
    } else {
      txtNormal('Você equilibra razão e emoção em suas decisões — uma combinação poderosa.', 7.5, MID)
    }
  }

  separador()

  // Como você pratica a vida
  checkarPagina(35)
  cabSecao('Como Você Pratica a Vida')
  y += 3

  const cr = mapa.comoReagem
  if (cr) {
    const planos = [
      { label: 'Espiritual', valor: cr.espiritual, cor: [100, 140, 200] },
      { label: 'Físico — Possuir', valor: cr.possuir, cor: [90, 170, 90] },
      { label: 'Físico — Compartilhar', valor: cr.compartilhar, cor: [...ORANGE] },
      { label: 'Físico — Vivenciar', valor: cr.vivenciar, cor: [200, 80, 80] },
    ]

    for (const p of planos) {
      checkarPagina(8)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...DARK)
      doc.text(`${p.label}:`, M, y + 4.5)
      doc.setFillColor(...LGRAY)
      doc.roundedRect(M + 52, y, W - 60, 6, 1, 1, 'F')
      doc.setFillColor(...p.cor)
      doc.roundedRect(M + 52, y, (W - 60) * p.valor / 100, 6, 1, 1, 'F')
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...WHITE)
      if (p.valor > 8) doc.text(`${p.valor}%`, M + 54, y + 4.5)
      y += 9
    }
  }

  separador()

  // Duplicidades e Ausências
  checkarPagina(35)
  cabSecao('Duplicidades e Ausências')
  y += 3

  if (mapa.duplicidades?.length > 0) {
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DARK)
    doc.text('Duplicidades (VNs que se repetem no mapa):', M, y)
    y += 5
    for (const d of mapa.duplicidades) {
      const desc = DESC_VN[d.vn === 11 ? 11 : d.vn === 22 ? 22 : d.vn]
      const tipo = d.tipo === 'D' ? 'Duplicidade' : d.tipo === 'T' ? 'Triplicidade' : d.tipo === 'Qd' ? 'Quadruplicidade' : 'Quintuplicidade'
      checkarPagina(10)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...DARK)
      doc.text(`VN ${fmtVN(d.vn)} — ${tipo} (${d.quantidade}×)`, M + 3, y)
      y += 4
      if (desc) txtNormal(`${desc.curta}: energia amplificada. ${d.tipo === 'T' || d.tipo === 'Qd' ? 'Recomenda-se acompanhamento para equilibrar.' : 'Você tem facilidade natural para lidar com essa energia.'}`, 7.5, MID)
      y += 1
    }
  }

  if (mapa.ausencias?.length > 0) {
    checkarPagina(14)
    y += 2
    doc.setFontSize(8)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DARK)
    doc.text('Ausências (VNs não presentes no mapa):', M, y)
    y += 4
    for (const vn of mapa.ausencias) {
      const desc = DESC_VN[vn]
      if (desc) txtNormal(`VN ${vn} — ${desc.curta}: área de aprendizado ou domínio já conquistado.`, 7.5, MID)
    }
  }

  separador()

  // Características especiais
  checkarPagina(20)
  const temEspeciais = (mapa.legado?.length > 0) || (mapa.conquistaEspontanea?.length > 0) ||
    (mapa.realizacaoEspontanea?.length > 0) || (mapa.renascimento?.length > 0) || mapa.pureza?.temPureza

  if (temEspeciais) {
    cabSecao('Características Especiais')
    y += 3

    if (mapa.pureza?.temPureza) {
      checkarPagina(10)
      const tipoP = mapa.pureza.tipo === 'PA' ? 'Pureza Adquirida' : mapa.pureza.tipo === 'PPI' ? 'Processo de Pureza Iniciado' : 'Processo de Pureza em Conquista'
      txt2col('Pureza', `VN ${fmtVN(mapa.pureza.vn)} — ${tipoP}. O número mais importante do seu mapa.`, [180, 80, 0])
    }

    if (mapa.legado?.length > 0) {
      for (const l of mapa.legado) {
        checkarPagina(8)
        txt2col('Legado', `${l.realizacao} a partir dos ${l.idadeInicio} anos — você deixará uma marca duradoura.`, NAVY)
      }
    }

    if (mapa.conquistaEspontanea?.length > 0) {
      for (const c of mapa.conquistaEspontanea) {
        checkarPagina(8)
        txt2col('Conquista Espontânea', `${c.desafio} = ${c.realizacao} (${c.periodo}) — a vida realiza este aprendizado por você.`, [60, 140, 60])
      }
    }

    if (mapa.realizacaoEspontanea?.length > 0) {
      for (const r of mapa.realizacaoEspontanea) {
        checkarPagina(8)
        txt2col('Realiz. Espontânea', `${r.realizacao || r} — bênção garantida neste período.`, [180, 80, 0])
      }
    }

    if (mapa.renascimento?.length > 0) {
      for (const r of mapa.renascimento) {
        checkarPagina(8)
        txt2col('Renascimento', `${r.realizacao} aos ${r.idadeInicio} anos — recomeço profundo de vida.`, [80, 80, 180])
      }
    }
    separador()
  }

  // Ligações Familiares
  checkarPagina(30)
  if (mapa.ligacoesFamiliares?.length > 0) {
    cabSecao('Ligações Familiares')
    y += 3

    for (const lig of mapa.ligacoesFamiliares) {
      if (!lig.familiar && !lig.descricao) continue
      checkarPagina(7)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...DARK)
      doc.text(`${lig.posicao}  ${String(lig.vn).padStart(2,'0')}`, M, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...MID)
      if (lig.descricao) doc.text(lig.descricao, M + 22, y)
      if (lig.familiar) {
        doc.setTextColor(...NAVY)
        doc.text(lig.familiar, M + 90, y)
      }
      y += 5
    }
    separador()
  }

  rodape()

  // ════════════════════════════════════════════════════════════════════
  // PÁGINA 4 — Orientação Profissional
  // ════════════════════════════════════════════════════════════════════
  novaPage()

  cabSecao('Orientação Profissional')
  y += 3

  const op = mapa.orientacaoProfissional
  if (op) {
    if (op.profissionalEspiritualidade) {
      doc.setFillColor(220, 240, 210)
      doc.roundedRect(M, y, W, 8, 2, 2, 'F')
      doc.setFontSize(8.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(40, 120, 40)
      doc.text('Profissional de Espiritualidade: Este mapa indica forte vocação espiritual.', M + 3, y + 5.5)
      y += 11
    }

    // 1ª e 2ª opção
    txt2col('1ª Opção', op.primeiraOpcao?.join('  •  ') || '–', NAVY)
    txt2col('2ª Opção', op.segundaOpcao?.join('  •  ') || '–', MID)
    y += 3

    separador()

    // Tabela de Profissões Tradicionais — Passo 1
    checkarPagina(50)
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DARK)
    doc.text('Profissões Tradicionais — Incidência por Passo', M, y)
    y += 5

    const tabTrad = op.tabela?.tradicionais
    if (tabTrad) {
      // Cabeçalho da tabela
      const colW = [W * 0.45, W * 0.18, W * 0.18, W * 0.18]
      const colX = [M, M + colW[0], M + colW[0] + colW[1], M + colW[0] + colW[1] + colW[2]]

      doc.setFillColor(...NAVY)
      doc.rect(M, y, W, 6, 'F')
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...WHITE)
      doc.text('Profissão', colX[0] + 1, y + 4.2)
      doc.text('Passo 1', colX[1] + colW[1] / 2, y + 4.2, { align: 'center' })
      doc.text('Passo 2', colX[2] + colW[2] / 2, y + 4.2, { align: 'center' })
      doc.text('Passo 3', colX[3] + colW[3] / 2, y + 4.2, { align: 'center' })
      y += 6

      let linAlt = false
      for (let i = 0; i < tabTrad.passo1.length; i++) {
        checkarPagina(6)
        const item = tabTrad.passo1[i]
        const p2 = tabTrad.passo2[i]?.inc || 0
        const p3 = tabTrad.passo3[i]?.inc || 0
        const destaque = item.inc >= tabTrad.maxP1 && item.inc > 0

        doc.setFillColor(...(destaque ? CREAM : (linAlt ? [250, 250, 250] : WHITE)))
        doc.rect(M, y, W, 5, 'F')

        doc.setFontSize(7)
        doc.setFont('helvetica', destaque ? 'bold' : 'normal')
        doc.setTextColor(...(destaque ? NAVY : (item.inc > 0 ? DARK : LIGHT)))
        doc.text(item.prof, colX[0] + 1, y + 3.5)

        doc.setTextColor(...(item.inc > 0 ? DARK : LIGHT))
        if (item.inc > 0) doc.text(String(item.inc), colX[1] + colW[1] / 2, y + 3.5, { align: 'center' })
        if (p2 > 0) doc.text(String(p2), colX[2] + colW[2] / 2, y + 3.5, { align: 'center' })
        if (p3 > 0) doc.text(String(p3), colX[3] + colW[3] / 2, y + 3.5, { align: 'center' })

        y += 5
        linAlt = !linAlt
      }
    }

    separador()

    // Novas Profissões
    checkarPagina(40)
    doc.setFontSize(8.5)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...DARK)
    doc.text('Novas Profissões — Incidência por Passo', M, y)
    y += 5

    const tabNovas = op.tabela?.novas
    if (tabNovas) {
      const colW = [W * 0.50, W * 0.17, W * 0.17, W * 0.16]
      const colX = [M, M + colW[0], M + colW[0] + colW[1], M + colW[0] + colW[1] + colW[2]]

      doc.setFillColor(...ORANGE)
      doc.rect(M, y, W, 6, 'F')
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...WHITE)
      doc.text('Nova Profissão', colX[0] + 1, y + 4.2)
      doc.text('Passo 1', colX[1] + colW[1] / 2, y + 4.2, { align: 'center' })
      doc.text('Passo 2', colX[2] + colW[2] / 2, y + 4.2, { align: 'center' })
      doc.text('Passo 3', colX[3] + colW[3] / 2, y + 4.2, { align: 'center' })
      y += 6

      let linAlt = false
      for (let i = 0; i < tabNovas.passo1.length; i++) {
        checkarPagina(6)
        const item = tabNovas.passo1[i]
        const p2 = tabNovas.passo2[i]?.inc || 0
        const p3 = tabNovas.passo3[i]?.inc || 0
        const destaque = item.inc > 0

        doc.setFillColor(...(destaque ? [255, 248, 235] : (linAlt ? [250, 250, 250] : WHITE)))
        doc.rect(M, y, W, 5, 'F')

        doc.setFontSize(7)
        doc.setFont('helvetica', item.inc > 1 ? 'bold' : 'normal')
        doc.setTextColor(...(destaque ? DARK : LIGHT))
        doc.text(item.prof, colX[0] + 1, y + 3.5)

        if (item.inc > 0) {
          doc.setTextColor(...DARK)
          doc.text(String(item.inc), colX[1] + colW[1] / 2, y + 3.5, { align: 'center' })
          if (p2 > 0) doc.text(String(p2), colX[2] + colW[2] / 2, y + 3.5, { align: 'center' })
          if (p3 > 0) doc.text(String(p3), colX[3] + colW[3] / 2, y + 3.5, { align: 'center' })
        }

        y += 5
        linAlt = !linAlt
      }
    }
  }

  // Nota final
  checkarPagina(20)
  separador()
  y += 2
  doc.setFontSize(7.5)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(...LIGHT)
  const notaFinal = 'Este mapa é um guia de autoconhecimento baseado na Numerologia Pitagórica. Os números representam tendências e potenciais — você tem livre-arbítrio para escolher como viver cada vibração.'
  const notaLinhas = doc.splitTextToSize(notaFinal, W)
  doc.text(notaLinhas, 105, y, { align: 'center' })

  rodape()

  // ── Download ────────────────────────────────────────────────────────
  const nomeArquivo = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_').toLowerCase()
  doc.save(`mapa_numerologico_${nomeArquivo}.pdf`)
}
