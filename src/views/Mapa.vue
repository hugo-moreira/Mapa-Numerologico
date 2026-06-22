<template>
  <div v-if="!store.calculado" class="vazio">
    <p>Nenhum mapa calculado. <router-link to="/" class="link-gold">Calcular agora</router-link></p>
  </div>

  <div v-else class="mapa-page" ref="mapaRef">

    <!-- ── CABEÇALHO DO CLIENTE ── -->
    <div class="mapa-cabecalho card mb">
      <div class="cab-info">
        <h2>{{ store.nome }}</h2>
        <p>{{ store.dia }} / {{ store.mes }} / {{ store.ano }} · {{ m.idade }} anos</p>
      </div>

      <!-- Pirâmide SVG -->
      <div class="cab-piramide">
        <svg viewBox="0 0 160 122" width="140" height="107" aria-label="Pirâmide do destino">
          <polygon points="80,10 148,100 12,100" fill="none" stroke="#c9a227" stroke-width="1.5"/>
          <line x1="80" y1="10" x2="80" y2="100" stroke="#c9a22750" stroke-width="1"/>
          <line x1="46" y1="55" x2="114" y2="55" stroke="#c9a22750" stroke-width="1"/>
          <text x="80" y="7" text-anchor="middle" fill="#c9a227" font-size="10" font-weight="700">{{ fmtSlash(m.cd) }}</text>
          <text x="14" y="112" text-anchor="middle" fill="#c9a227" font-size="9" font-weight="600">{{ fmtSlash(m.mo) }}</text>
          <text x="146" y="112" text-anchor="middle" fill="#c9a227" font-size="9" font-weight="600">{{ fmtSlash(m.eu) }}</text>
          <text x="80" y="112" text-anchor="middle" fill="#8899aa" font-size="9">{{ fmtBase(m.dm) }}</text>
          <text x="80" y="72" text-anchor="middle" fill="#c9a227" font-size="11" font-weight="700">{{ fmtSlash(m.ex) }}</text>
        </svg>
      </div>

      <div class="cab-acoes">
        <button @click="salvar" class="btn-sm">Salvar Ficha</button>
        <router-link to="/previsao" class="btn-sm">Previsão Anual</router-link>
        <button @click="imprimir" class="btn-sm">Imprimir</button>
        <button @click="baixarPDF" :disabled="gerandoPDF" class="btn-sm btn-gold">
          {{ gerandoPDF ? 'Gerando...' : 'Gerar PDF' }}
        </button>
      </div>
    </div>

    <!-- ── SEÇÃO: MAPA NUMEROLÓGICO ── -->
    <p class="section-title">✦ Mapa Numerológico</p>
    <div class="grid-principal mb">

      <!-- PERSONALIDADE (MO · EU · EX) -->
      <div class="col-nucleos card">
        <p class="col-label">Personalidade</p>
        <div class="nucleo-item">
          <span class="nucleo-top">MO</span>
          <div :class="['box-num box-gold', ehMestre(m.mo) ? 'box-mestre' : '']">{{ fmtSlash(m.mo) }}</div>
          <span class="nucleo-bot">Alma</span>
        </div>
        <div class="nucleo-item">
          <span class="nucleo-top">EU</span>
          <div :class="['box-num box-gold', ehMestre(m.eu) ? 'box-mestre' : '']">{{ fmtSlash(m.eu) }}</div>
          <span class="nucleo-bot">Sonho</span>
        </div>
        <div class="nucleo-item">
          <span class="nucleo-top">EX</span>
          <div :class="['box-num box-gold', ehMestre(m.ex) ? 'box-mestre' : '']">{{ fmtSlash(m.ex) }}</div>
          <span class="nucleo-bot">Talento</span>
        </div>
      </div>

      <!-- ALMA (CD · MÉRITO · TRIBUTO) -->
      <div class="col-jornada card">
        <p class="col-label">Alma</p>
        <div class="nucleo-item">
          <span class="nucleo-top">CD</span>
          <div :class="['box-num box-gold', ehMestre(m.cd) ? 'box-mestre' : '']">{{ fmtSlash(m.cd) }}</div>
          <span class="nucleo-bot">Caminho do Destino</span>
        </div>
        <div class="nucleo-item">
          <span class="nucleo-top">MÉRITO</span>
          <div :class="['box-num box-gold', ehMestre(m.merito) ? 'box-mestre' : '']">{{ fmtSlash(m.merito) }}</div>
          <span class="nucleo-bot">Dom</span>
        </div>
        <div class="nucleo-item">
          <span class="nucleo-top">TRIBUTO</span>
          <div :class="['box-num box-gold', ehMestre(m.tributo) ? 'box-mestre' : '']">{{ fmtSlash(m.tributo) }}</div>
          <span class="nucleo-bot">Tributo</span>
        </div>
      </div>

      <!-- JORNADA DE VIDA (Ciclos · Aprendizados · Realizações) -->
      <div class="col-ciclos card">
        <p class="col-label">Jornada de Vida</p>

        <div class="ciclos-header">
          <span></span>
          <span>Ciclos</span>
          <span></span>
          <span>Aprendizados</span>
          <span></span>
          <span>Realizações</span>
          <span></span>
        </div>

        <!-- Linha 1 -->
        <div class="ciclo-row">
          <div class="ciclo-per">00<br>28</div>
          <div class="box-ciclo box-ciclo-c">
            <span>{{ fmtBase(m.c1) }}</span><span class="sub-lbl">C1</span>
          </div>
          <div class="arr">›</div>
          <div class="box-ciclo box-ciclo-d">
            <span>{{ fmtBase(m.d1) }}</span><span class="sub-lbl">D1</span>
          </div>
          <div class="arr">›</div>
          <div :class="['box-ciclo box-ciclo-r', temLegadoEm('R1') ? 'legado-border' : '']">
            <span :class="ehMestre(m.realizacoes[0].vn) ? 'num-mestre' : ''">{{ fmtSlash(m.realizacoes[0].vn) }}</span>
            <span class="sub-lbl">R1</span>
          </div>
          <div class="ciclo-per-right">
            <span>00 / {{ m.realizacoes[0].fim }}</span>
            <span v-if="temLegadoEm('R1')" class="legado-badge">LEGADO</span>
          </div>
        </div>

        <!-- Linha 2 -->
        <div class="ciclo-row">
          <div class="ciclo-per">29<br>56</div>
          <div class="box-ciclo box-ciclo-c">
            <span>{{ fmtBase(m.c2) }}</span><span class="sub-lbl">C2</span>
          </div>
          <div class="arr">›</div>
          <div class="box-ciclo box-ciclo-d">
            <span>{{ fmtBase(m.d2) }}</span><span class="sub-lbl">D2</span>
          </div>
          <div class="arr">›</div>
          <div :class="['box-ciclo box-ciclo-r', temLegadoEm('R2') ? 'legado-border' : '']">
            <span :class="ehMestre(m.realizacoes[1].vn) ? 'num-mestre' : ''">{{ fmtSlash(m.realizacoes[1].vn) }}</span>
            <span class="sub-lbl">R2</span>
          </div>
          <div class="ciclo-per-right">
            <span>{{ m.realizacoes[1].inicio }} / {{ m.realizacoes[1].fim }}</span>
            <span v-if="temLegadoEm('R2')" class="legado-badge">LEGADO</span>
          </div>
        </div>

        <!-- Linha 3 -->
        <div class="ciclo-row">
          <div class="ciclo-per">+57</div>
          <div class="box-ciclo box-ciclo-c">
            <span>{{ fmtBase(m.c3) }}</span><span class="sub-lbl">C3</span>
          </div>
          <div class="arr">›</div>
          <div class="box-ciclo box-ciclo-d">
            <span>{{ fmtBase(m.dm) }}</span><span class="sub-lbl">DM</span>
          </div>
          <div class="arr">›</div>
          <div :class="['box-ciclo box-ciclo-r', temLegadoEm('R3') ? 'legado-border' : '']">
            <span :class="ehMestre(m.realizacoes[2].vn) ? 'num-mestre' : ''">{{ fmtSlash(m.realizacoes[2].vn) }}</span>
            <span class="sub-lbl">R3</span>
          </div>
          <div class="ciclo-per-right">
            <span>{{ m.realizacoes[2].inicio }} / {{ m.realizacoes[2].fim }}</span>
            <span v-if="temLegadoEm('R3')" class="legado-badge">LEGADO</span>
          </div>
        </div>

        <!-- Linha 4: R4 -->
        <div class="ciclo-row">
          <div class="ciclo-per"></div>
          <div class="box-ciclo" style="background:transparent;border:none;"></div>
          <div class="arr"></div>
          <div class="box-ciclo" style="background:transparent;border:none;"></div>
          <div class="arr"></div>
          <div :class="['box-ciclo box-ciclo-r', temLegadoEm('R4') ? 'legado-border' : '']">
            <span :class="ehMestre(m.realizacoes[3].vn) ? 'num-mestre' : ''">{{ fmtSlash(m.realizacoes[3].vn) }}</span>
            <span class="sub-lbl">R4</span>
          </div>
          <div class="ciclo-per-right">
            <span>+ {{ m.realizacoes[3].inicio }}</span>
            <span v-if="temLegadoEm('R4')" class="legado-badge">LEGADO</span>
            <span v-if="m.conquistaEspontanea?.length" class="legado-badge">Realiz. Esp.</span>
          </div>
        </div>

      </div>
    </div>

    <!-- ── FRASES ── -->
    <p class="section-title">✦ Frases Numerológicas</p>
    <div class="frases-grid mb">
      <div class="frase-card card">
        <p class="frase-lbl">Frase Curta</p>
        <p class="frase-txt frase-curta">{{ m.frases?.fraseCurta }}</p>
      </div>
      <div class="frase-card card">
        <p class="frase-lbl">Frase Expandida</p>
        <p class="frase-txt">{{ m.frases?.fraseExpandida }}</p>
      </div>
    </div>

    <!-- ── ORIENTAÇÃO PROFISSIONAL ── -->
    <p class="section-title">✦ Orientação Profissional</p>
    <div class="prof-grid mb">
      <div class="card prof-card">
        <p class="col-label">1ª Opção</p>
        <div class="prof-tags">
          <template v-if="m.orientacaoProfissional?.primeiraOpcao?.length">
            <span v-for="p in m.orientacaoProfissional.primeiraOpcao" :key="p" class="prof-tag prof-tag-gold">{{ p }}</span>
          </template>
          <span v-else class="text-dim-sm">—</span>
        </div>
      </div>
      <div class="card prof-card">
        <p class="col-label">2ª Opção</p>
        <div class="prof-tags">
          <template v-if="m.orientacaoProfissional?.segundaOpcao?.length">
            <span v-for="p in m.orientacaoProfissional.segundaOpcao" :key="p" class="prof-tag">{{ p }}</span>
          </template>
          <span v-else class="text-dim-sm">—</span>
        </div>
      </div>
      <div class="card prof-card prof-obs">
        <p class="col-label">Orientação</p>
        <p class="prof-orientacao">{{ m.orientacaoProfissional?.orientacao || '—' }}</p>
        <div class="prof-flags">
          <span v-if="m.orientacaoProfissional?.profissionalEspiritualidade" class="prof-flag">Espiritualidade</span>
          <span v-if="m.orientacaoProfissional?.atividadeArtistica" class="prof-flag">Atividade Artística</span>
        </div>
      </div>
    </div>

    <!-- ── ANO PESSOAL ── -->
    <p class="section-title">✦ Ano Pessoal {{ apAtual?.ano }}</p>
    <div class="ano-card card mb">
      <div class="ano-inner">
        <div class="ano-numero-wrap">
          <span class="ano-label">AP</span>
          <div :class="['ano-numero', ehMestre(apAtual.ap) ? 'num-mestre' : '']">{{ fmtSlash(apAtual.ap) }}</div>
          <span class="ano-label">{{ apAtual.ano }}</span>
        </div>
        <div class="cts-wrap">
          <div v-for="(ct, i) in [apAtual.cts?.ct1, apAtual.cts?.ct2, apAtual.cts?.ct3, apAtual.cts?.ct4]" :key="i" class="ct-item">
            <div :class="['box-ciclo box-ciclo-c ct-box', ehMestre(ct) ? 'num-mestre' : '']">
              <span>{{ fmtSlash(ct) }}</span>
              <span class="sub-lbl">CT{{ i + 1 }}</span>
            </div>
          </div>
        </div>
        <div class="periodo-ap">
          <p class="frase-lbl">Período</p>
          <p class="periodo-txt">{{ periodoAPAtual }}</p>
        </div>
      </div>
    </div>

    <!-- ── ANÁLISES ── -->
    <p class="section-title">✦ Análises</p>
    <div class="analises-grid mb">

      <div class="card analise-card">
        <p class="analise-title">Ausências</p>
        <div class="analise-boxes">
          <div v-for="a in m.ausencias" :key="a" class="box-ausencia">{{ String(a).padStart(2,'0') }}</div>
          <span v-if="!m.ausencias?.length" class="text-dim-sm">Nenhuma</span>
        </div>
      </div>

      <div class="card analise-card">
        <p class="analise-title">Duplicidades</p>
        <div class="analise-boxes">
          <div v-for="d in m.duplicidades" :key="d.vn" class="badge-dupla">
            {{ fmtBase(d.vn) }} <small>{{ d.tipo }}</small>
          </div>
          <span v-if="!m.duplicidades?.length" class="text-dim-sm">Nenhuma</span>
        </div>
      </div>

      <div class="card analise-card">
        <p class="analise-title">Pureza</p>
        <div class="pureza-rows">
          <div class="pureza-item">
            <span class="text-dim-sm">PA — Pureza do Alma</span>
            <span class="pureza-val">{{ m.pureza?.pa }}</span>
          </div>
          <div class="pureza-item">
            <span class="text-dim-sm">PPI — Pureza Pessoal I</span>
            <span class="pureza-val">{{ m.pureza?.ppi }}</span>
          </div>
          <div class="pureza-item">
            <span class="text-dim-sm">PPC — Pureza Pessoal C</span>
            <span class="pureza-val">{{ m.pureza?.ppc }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- ── LINHA DE ANOS AP9 ── -->
    <div class="card mb anos-ap9">
      <p class="analise-title" style="margin-bottom:8px;">Anos com AP 9</p>
      <div class="ap9-lista">
        <span v-for="(item, i) in m.anosAP9" :key="item.ano" class="ap9-item">
          {{ item.ano }} ({{ item.idade }}a.)<span v-if="i < m.anosAP9.length - 1"> › </span>
        </span>
      </div>
    </div>

    <!-- ── TABELA DUPLICIDADES POR IDADE ── -->
    <p class="section-title">✦ Duplicidades por Idade</p>
    <div class="card mb tabela-dup-wrap">
      <div class="dup-nav">
        <button @click="offsetDup = Math.max(0, offsetDup - 14)" class="btn-nav">&lt;</button>
        <span class="text-dim-sm">idades {{ idadesVisiveis[0] }} a {{ idadesVisiveis[idadesVisiveis.length-1] }}</span>
        <button @click="offsetDup = Math.min(80-14, offsetDup + 14)" class="btn-nav">&gt;</button>
      </div>
      <div class="tabela-dup">
        <div class="dup-linha-header">
          <div class="dup-cell-lbl"></div>
          <div v-for="idade in idadesVisiveis" :key="idade" class="dup-cell">{{ idade }}</div>
        </div>
        <div class="dup-linha-status">
          <div class="dup-cell-lbl"></div>
          <div v-for="idade in idadesVisiveis" :key="idade" class="dup-cell">
            <span v-if="statusGlobal(idade)" :class="['dup-badge', tipoCor(statusGlobal(idade))]">{{ statusGlobal(idade) }}</span>
          </div>
        </div>
        <div v-for="vn in [1,2,3,4,5,6,7,8,9]" :key="vn" class="dup-linha-vn">
          <div class="dup-cell-lbl">{{ String(vn).padStart(2,'0') }}</div>
          <div v-for="idade in idadesVisiveis" :key="idade" class="dup-cell">
            <span v-if="m.dupPorIdade[idade]?.[vn]" :class="['dup-badge', tipoCor(m.dupPorIdade[idade][vn].tipo)]">{{ m.dupPorIdade[idade][vn].tipo }}</span>
            <span v-else class="dup-num">{{ String(vn).padStart(2,'0') }}</span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMapaStore } from '../stores/mapa.js'
import { useHistoricoStore } from '../stores/historico.js'
import { gerarRelatorioPDF } from '../relatorio/pdf.js'

const store = useMapaStore()
const historico = useHistoricoStore()
const router = useRouter()
const mapaRef = ref(null)
const offsetDup = ref(20)
const gerandoPDF = ref(false)

const m = computed(() => store.mapa)

function fmtSlash(vn) {
  if (vn === 11) return '11/2'
  if (vn === 22) return '22/4'
  return String(vn ?? 0).padStart(2, '0')
}

function fmtBase(vn) {
  if (!vn && vn !== 0) return '00'
  const base = vn === 11 ? 2 : vn === 22 ? 4 : vn
  return String(base).padStart(2, '0')
}

function ehMestre(vn) { return vn === 11 || vn === 22 }
function temLegadoEm(r) { return m.value?.legado?.some(l => l.realizacao === r) }

const apAtual = computed(() => m.value?.multiAnoAP?.[1] ?? { ap: 0, cts: {}, periodosCT: [] })

const periodoAPAtual = computed(() => {
  if (!apAtual.value?.periodosCT?.length) return ''
  const ini = apAtual.value.periodosCT[0]?.inicio ?? ''
  const fim = apAtual.value.periodosCT[3]?.fim ?? ''
  return `${ini} → ${fim}`
})

const idadesTabela = computed(() => Array.from({ length: 81 }, (_, i) => i))
const idadesVisiveis = computed(() => idadesTabela.value.slice(offsetDup.value, offsetDup.value + 22))

function statusGlobal(idade) {
  const dup = m.value?.dupPorIdade?.[idade]
  if (!dup || !Object.keys(dup).length) return null
  const tipos = Object.values(dup).map(d => d.tipo)
  if (tipos.includes('Qt')) return 'Qt'
  if (tipos.includes('Qd')) return 'Qd'
  if (tipos.includes('T')) return 'T'
  if (tipos.includes('D')) return 'D'
  return null
}

function tipoCor(tipo) {
  return tipo === 'T' || tipo === 'Qt' || tipo === 'Qd' ? 'badge-gold' : 'badge-dim'
}

function salvar() {
  historico.salvar(store.nome, store.dia, store.mes, store.ano, store.mapa)
  alert('Salvo no histórico.')
}

function imprimir() { window.print() }

async function baixarPDF() {
  if (!m.value) return
  gerandoPDF.value = true
  try {
    await gerarRelatorioPDF(m.value, store.nome, store.dia, store.mes, store.ano)
  } finally {
    gerandoPDF.value = false
  }
}
</script>

<style scoped>
/* ── LAYOUT ── */
.mapa-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 28px 20px 60px;
}

.vazio {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 56px);
  color: var(--text-dim);
}

.link-gold { color: var(--gold); text-decoration: none; }
.link-gold:hover { text-decoration: underline; }

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
}

.mb { margin-bottom: 16px; }

.section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--gold);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

/* ── CABEÇALHO ── */
.mapa-cabecalho {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cab-info { flex: 1; }
.cab-info h2 { font-size: 18px; font-weight: 600; color: var(--text); }
.cab-info p { font-size: 13px; color: var(--text-dim); margin-top: 3px; }

.cab-piramide { flex-shrink: 0; }

.cab-acoes {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
}

.btn-sm {
  border: 1px solid var(--gold);
  color: var(--gold);
  background: transparent;
  font-size: 11px;
  padding: 5px 12px;
  border-radius: 5px;
  cursor: pointer;
  font-family: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: background 0.15s, color 0.15s;
}

.btn-sm:hover, .btn-sm:not(:disabled):hover {
  background: var(--gold);
  color: var(--text-dark);
}

.btn-sm:disabled { opacity: 0.5; cursor: default; }

.btn-gold {
  background: var(--gold);
  color: var(--text-dark);
  font-weight: 700;
}

.btn-gold:hover { opacity: 0.85; }

/* ── GRID PRINCIPAL ── */
.grid-principal {
  display: grid;
  grid-template-columns: 1fr 1fr 2.6fr;
  gap: 14px;
}

.col-nucleos,
.col-jornada {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.col-ciclos {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.col-label {
  font-size: 10px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
  margin-bottom: 4px;
}

.nucleo-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.nucleo-top {
  font-size: 10px;
  color: var(--text-dim);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nucleo-bot {
  font-size: 10px;
  color: var(--text-dim);
  text-align: center;
}

.box-num {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
}

.box-gold {
  background: var(--gold);
  color: var(--text-dark);
}

.box-mestre {
  font-size: 17px;
}

/* ── CICLOS HEADER ── */
.ciclos-header {
  display: grid;
  grid-template-columns: 28px 1fr 10px 1fr 10px 1fr 48px;
  align-items: center;
  gap: 4px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}

.ciclos-header span {
  font-size: 9px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-align: center;
}

.ciclo-row {
  display: grid;
  grid-template-columns: 28px 1fr 10px 1fr 10px 1fr 48px;
  align-items: center;
  gap: 4px;
}

.ciclo-per {
  font-size: 8px;
  color: var(--text-dim);
  text-align: right;
  line-height: 1.4;
}

.ciclo-per-right {
  font-size: 8px;
  color: var(--text-dim);
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 4px;
}

.arr {
  font-size: 10px;
  color: var(--text-dim);
  text-align: center;
}

.box-ciclo {
  height: 42px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  gap: 1px;
}

.sub-lbl {
  font-size: 8px;
  font-weight: 400;
  color: var(--text-dim);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.box-ciclo-c, .box-ciclo-d {
  background: var(--bg-deep);
  border: 1px solid var(--border);
  color: var(--text);
}

.box-ciclo-r {
  background: var(--blue-surface);
  border: 1px solid var(--border-blue);
  color: var(--text);
}

.legado-border { border-color: var(--gold); }

.legado-badge {
  font-size: 7px;
  background: var(--gold);
  color: var(--text-dark);
  border-radius: 3px;
  padding: 1px 4px;
  font-weight: 700;
  letter-spacing: 0.03em;
  white-space: nowrap;
}

.num-mestre {
  color: var(--gold);
  text-shadow: 0 0 10px rgba(201,162,39,0.5);
}

/* ── FRASES ── */
.frases-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 14px;
}

.frase-card { display: flex; flex-direction: column; gap: 6px; }
.frase-lbl {
  font-size: 10px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.frase-txt {
  font-size: 13px;
  color: var(--text);
  line-height: 1.6;
}

.frase-curta {
  font-style: italic;
  color: var(--gold);
}

/* ── PROFISSÕES ── */
.prof-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.2fr;
  gap: 14px;
}

.prof-card { display: flex; flex-direction: column; gap: 8px; }

.prof-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.prof-tag {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 4px;
  background: var(--bg-deep);
  border: 1px solid var(--border);
  color: var(--text-dim);
}

.prof-tag-gold {
  background: var(--gold-dim);
  border-color: var(--gold-border);
  color: var(--gold);
  font-weight: 600;
}

.prof-obs {}
.prof-orientacao {
  font-size: 12px;
  color: var(--text);
  line-height: 1.6;
}

.prof-flags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.prof-flag {
  font-size: 10px;
  padding: 2px 8px;
  border-radius: 3px;
  background: var(--blue-surface);
  border: 1px solid var(--border-blue);
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── ANO PESSOAL ── */
.ano-card {}

.ano-inner {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.ano-numero-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 80px;
}

.ano-label {
  font-size: 10px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.ano-numero {
  font-size: 44px;
  font-weight: 800;
  color: var(--gold);
  text-shadow: 0 0 12px rgba(201,162,39,0.5);
  line-height: 1;
}

.cts-wrap {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.ct-box {
  width: 52px;
  height: 52px;
  font-size: 16px;
}

.periodo-ap { display: flex; flex-direction: column; gap: 4px; }
.periodo-txt { font-size: 13px; color: var(--text); }

/* ── ANÁLISES ── */
.analises-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.analise-card { display: flex; flex-direction: column; gap: 8px; }
.analise-title {
  font-size: 10px;
  color: var(--text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-bottom: 1px solid var(--border);
  padding-bottom: 6px;
}

.analise-boxes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.box-ausencia {
  background: var(--bg-deep);
  border: 1px solid var(--border);
  color: var(--text-dim);
  font-size: 13px;
  font-weight: 600;
  width: 34px;
  height: 34px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-dupla {
  background: var(--gold-dim);
  border: 1px solid var(--gold-border);
  color: var(--gold);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.badge-dupla small {
  font-size: 10px;
  font-weight: 400;
  opacity: 0.7;
}

.pureza-rows { display: flex; flex-direction: column; gap: 6px; }

.pureza-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pureza-val {
  font-size: 16px;
  font-weight: 700;
  color: var(--text);
}

.text-dim-sm { font-size: 12px; color: var(--text-dim); }

/* ── ANOS AP9 ── */
.anos-ap9 {}
.ap9-lista { display: flex; flex-wrap: wrap; gap: 4px; font-size: 12px; color: var(--text-dim); }
.ap9-item { white-space: nowrap; }

/* ── TABELA DUPLICIDADES ── */
.tabela-dup-wrap {}

.dup-nav {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.btn-nav {
  background: var(--bg-deep);
  color: var(--gold);
  border: 1px solid var(--border);
  padding: 2px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.tabela-dup { overflow-x: auto; }

.dup-linha-header,
.dup-linha-status,
.dup-linha-vn {
  display: flex;
  align-items: center;
}

.dup-cell-lbl {
  width: 26px;
  font-size: 8px;
  font-weight: 700;
  color: var(--text-dim);
  text-align: right;
  padding-right: 4px;
  flex-shrink: 0;
}

.dup-cell {
  width: 26px;
  text-align: center;
  font-size: 8px;
  color: var(--text-dim);
  flex-shrink: 0;
  padding: 1px;
}

.dup-num { font-size: 7px; color: var(--border); }

.dup-badge {
  display: inline-block;
  font-size: 7px;
  font-weight: 700;
  padding: 0 2px;
  border-radius: 2px;
}

.badge-gold { background: var(--gold); color: var(--text-dark); }
.badge-dim { background: var(--blue-surface); color: var(--text); }

/* ── PRINT ── */
@media print {
  .cab-acoes, .btn-sm, .dup-nav { display: none !important; }
  .card { border: 1px solid #333; }
  body { background: white; color: black; }
}
</style>
