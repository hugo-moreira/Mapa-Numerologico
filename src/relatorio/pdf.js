/**
 * @module relatorio/pdf
 * @description Geracao do relatorio PDF profissional do Mapa Numerologico.
 *
 * Utiliza a biblioteca jsPDF para criar um documento A4 de 3 paginas:
 * - Pagina 1: Cabecalho, dados do cliente, piramide visual e numeros principais.
 * - Pagina 2: Jornada de vida (ciclos, desafios, realizacoes) e potenciais.
 * - Pagina 3: Riscos, orientacao profissional e rodape do numerologista.
 *
 * O PDF e baixado automaticamente no navegador do usuario.
 * Nao requer servidor - toda a geracao e feita no lado do cliente.
 *
 * @param {import('../analises.js').MapaCompleto} mapa - Mapa completo calculado.
 * @param {string} nome - Nome completo do cliente.
 * @returns {Promise<void>}
 */

/**
 * Gera e faz o download do relatorio PDF do mapa numerologico.
 *
 * @param {Object} mapa - Objeto com todos os resultados das 33 tecnicas.
 * @param {string} nome - Nome do cliente para o cabecalho e nome do arquivo.
 * @returns {Promise<void>}
 */
export async function gerarRelatorioPDF(mapa, nome) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const MARGEM = 20
  const LARGURA = 210 - MARGEM * 2
  let y = MARGEM

  const titulo = (texto, tamanho = 11) => {
    doc.setFontSize(tamanho)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(40, 40, 40)
    doc.text(texto, MARGEM, y)
    y += tamanho * 0.5 + 3
  }

  const texto = (t, tamanho = 9) => {
    doc.setFontSize(tamanho)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(80, 80, 80)
    const linhas = doc.splitTextToSize(t, LARGURA)
    doc.text(linhas, MARGEM, y)
    y += linhas.length * (tamanho * 0.4 + 1.5) + 1
  }

  const separador = () => {
    doc.setDrawColor(200, 200, 200)
    doc.line(MARGEM, y, MARGEM + LARGURA, y)
    y += 5
  }

  const novaPagina = () => {
    doc.addPage()
    y = MARGEM
  }

  const numBox = (sigla, vn, x, yPos) => {
    doc.setFillColor(248, 247, 244)
    doc.roundedRect(x, yPos, 28, 18, 3, 3, 'F')
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(150, 150, 150)
    doc.text(sigla, x + 14, yPos + 6, { align: 'center' })
    doc.setFontSize(13)
    doc.setFont('helvetica', 'light')
    doc.setTextColor(40, 40, 40)
    doc.text(String(vn), x + 14, yPos + 14, { align: 'center' })
  }

  // PAGINA 1 - Cabecalho e dados principais
  titulo('Mapa Numerológico Pitagórico', 16)
  y += 2
  separador()

  titulo(nome, 13)
  texto(`Data de nascimento: ${mapa.idade ? `(${mapa.idade} anos)` : ''}`)
  texto(`Relatório gerado em: ${new Date().toLocaleDateString('pt-BR')}`)
  y += 4
  separador()

  titulo('Pirâmide Numerológica')
  y += 2
  const cx = MARGEM + LARGURA / 2
  numBox('CD', mapa.cd, cx - 14, y)
  y += 22
  numBox('MO', mapa.mo, cx - 40, y)
  numBox('DM', mapa.dm, cx + 12, y)
  y += 22
  numBox('EU', mapa.eu, cx - 14, y)
  y += 24
  separador()

  titulo('Personalidade')
  y += 2
  const persFila1 = [['MO', mapa.mo], ['EU', mapa.eu], ['EX', mapa.ex], ['Mérito', mapa.merito], ['Tributo', mapa.tributo]]
  let xPos = MARGEM
  for (const [s, v] of persFila1) {
    numBox(s, v, xPos, y)
    xPos += 32
  }
  y += 24

  titulo('Piramide - Texto')
  texto(mapa.piramide?.textoCD || '')
  texto(mapa.piramide?.textoMO || '')
  texto(mapa.piramide?.textoDM || '')

  // PAGINA 2 - Jornada e Potenciais
  novaPagina()
  titulo('Jornada de Vida')
  y += 2

  const linhaJornada = (items) => {
    let xPos = MARGEM
    for (const [s, v] of items) {
      numBox(s, v, xPos, y)
      xPos += 32
    }
    y += 22
  }

  linhaJornada([['CD', mapa.cd], ['C1', mapa.c1], ['C2', mapa.c2], ['C3', mapa.c3]])
  linhaJornada([['D1', mapa.d1], ['D2', mapa.d2], ['DM', mapa.dm]])
  if (mapa.realizacoes) {
    linhaJornada(mapa.realizacoes.map((r, i) => [`R${i + 1}`, r.vn]))
  }
  separador()

  titulo('Potenciais')
  texto(`Razão vs Emoção: ${mapa.razaoEmocao?.predominante || '-'}`)
  texto(`Como Reagem: ${mapa.comoReagem?.predominantes?.join(', ') || '-'}`)
  texto(`Expressão: ${mapa.expressao?.perfil || '-'}`)
  separador()

  titulo('Pureza')
  if (mapa.pureza?.temPureza) {
    texto(`VN ${mapa.pureza.vn} — ${mapa.pureza.tipo}`)
  } else {
    texto('Sem Pureza detectada.')
  }

  titulo('Duplicidades')
  if (mapa.duplicidades?.length > 0) {
    for (const d of mapa.duplicidades) {
      texto(`VN ${d.vn}: ${d.tipo} (${d.quantidade}x)`)
    }
  } else {
    texto('Sem duplicidades.')
  }

  titulo('Ausencias e AVPs')
  texto(`Ausentes: ${mapa.ausencias?.join(', ') || 'Nenhuma'}`)
  if (mapa.avp?.avpc?.length > 0) texto(`AVPc: ${mapa.avp.avpc.join(', ')}`)
  if (mapa.avp?.avpf?.length > 0) texto(`AVPf: ${mapa.avp.avpf.join(', ')}`)

  // PAGINA 3 - Riscos e Profissional
  novaPagina()
  titulo('Riscos')
  texto(`CP: ${mapa.riscos?.cp || 0}% | VG: ${mapa.riscos?.vg || 0}% | SC: ${mapa.riscos?.sc || 0}%`)
  if (mapa.riscos?.altos?.length > 0) texto(`Riscos altos: ${mapa.riscos.altos.join(', ')}`)
  separador()

  titulo('Orientação Profissional')
  texto(`1ª Opção: ${mapa.orientacaoProfissional?.primeiraOpcao?.join(', ') || '-'}`)
  texto(`2ª Opção: ${mapa.orientacaoProfissional?.segundaOpcao?.join(', ') || '-'}`)
  if (mapa.orientacaoProfissional?.profissionalEspiritualidade) {
    texto('Profissional de Espiritualidade indicado.')
  }
  separador()

  titulo('Características Especiais')
  if (mapa.renascimento?.length > 0) {
    for (const r of mapa.renascimento) {
      texto(`Renascimento em ${r.realizacao} — início aos ${r.idadeInicio} anos`)
    }
  }
  if (mapa.legado?.length > 0) {
    for (const l of mapa.legado) {
      texto(`Legado (${l.tipo}) em ${l.realizacao} — a partir dos ${l.idadeInicio} anos`)
    }
  }
  if (mapa.conquistaEspontanea?.length > 0) {
    for (const c of mapa.conquistaEspontanea) {
      texto(`Conquista Espontânea: ${c.desafio} = ${c.realizacao} (${c.periodo})`)
    }
  }

  // Rodape
  separador()
  doc.setFontSize(7)
  doc.setTextColor(150, 150, 150)
  doc.text('Mapa Numerológico Pitagórico — Confidencial. Gerado pelo Sistema de Mapa Numerológico.', MARGEM, 285)

  const nomeArquivo = nome.replace(/\s+/g, '_').toLowerCase()
  doc.save(`mapa_numerologico_${nomeArquivo}.pdf`)
}
