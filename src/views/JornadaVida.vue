<template>
  <div class="jornada-page">

    <!-- Formulário -->
    <div class="card form-card mb">
      <p class="section-title">✦ Jornada de Vida</p>
      <p class="sub-desc">Caminho de Destino · Ciclos · Aprendizados · Realizações · Ano Pessoal</p>
      <form @submit.prevent="calcular" novalidate class="jornada-form">
        <div class="date-grid">
          <div>
            <label class="m-label">Dia</label>
            <input v-model.number="dia" type="number" min="1" max="31" placeholder="Dia" class="m-input" />
          </div>
          <div>
            <label class="m-label">Mês</label>
            <input v-model.number="mes" type="number" min="1" max="12" placeholder="Mês" class="m-input" />
          </div>
          <div>
            <label class="m-label">Ano</label>
            <input v-model.number="ano" type="number" min="1900" max="2100" placeholder="Ano" class="m-input" />
          </div>
          <div class="btn-col">
            <button type="submit" class="btn-mystic">Calcular</button>
          </div>
        </div>
        <p v-if="store.erro" class="m-erro">{{ store.erro }}</p>
      </form>
    </div>

    <!-- Resultado -->
    <div v-if="store.calculado && d">

      <!-- CD destaque -->
      <div class="cd-card card mb">
        <div class="cd-inner">
          <div class="cd-num-wrap">
            <span class="ano-label">Caminho do Destino</span>
            <div :class="['cd-num', ehMestre(d.cd) ? 'num-mestre' : '']">{{ fmtSlash(d.cd) }}</div>
            <span class="ano-label">CD</span>
          </div>
          <div class="cd-info">
            <p class="cd-data">{{ dia }}/{{ mes }}/{{ ano }}</p>
            <p class="cd-idade">{{ d.idade }} anos</p>
          </div>
        </div>
      </div>

      <!-- Grid Ciclos · Aprendizados · Realizações -->
      <p class="section-title">✦ Jornada de Vida</p>
      <div class="jornada-grid card mb">

        <div class="ciclos-header">
          <span></span>
          <span>Ciclos</span>
          <span></span>
          <span>Aprendizados</span>
          <span></span>
          <span>Realizações</span>
          <span></span>
        </div>

        <div v-for="(row, idx) in rows" :key="idx" class="ciclo-row">
          <div class="ciclo-per">{{ row.periodo }}</div>
          <div :class="['box-ciclo box-ciclo-c', d.cicloKey === row.cicloKey ? 'ciclo-ativo' : '']">
            <span>{{ fmtBase(row.cicloVn) }}</span>
            <span class="sub-lbl">{{ row.cicloLabel }}</span>
          </div>
          <div class="arr">›</div>
          <div class="box-ciclo box-ciclo-d">
            <span>{{ fmtBase(row.desafioVn) }}</span>
            <span class="sub-lbl">{{ row.desafioLabel }}</span>
          </div>
          <div class="arr">›</div>
          <div :class="['box-ciclo box-ciclo-r', realizacaoAtiva(row.realIdx) ? 'ciclo-ativo-r' : '']">
            <span :class="ehMestre(d.realizacoes[row.realIdx]?.vn) ? 'num-mestre' : ''">{{ fmtSlash(d.realizacoes[row.realIdx]?.vn) }}</span>
            <span class="sub-lbl">{{ row.realLabel }}</span>
          </div>
          <div class="ciclo-per-right">
            <span>{{ d.realizacoes[row.realIdx]?.inicio }} / {{ d.realizacoes[row.realIdx]?.fim ?? '+' }}</span>
            <span v-if="realizacaoAtiva(row.realIdx)" class="ativo-badge">atual</span>
          </div>
        </div>

        <!-- R4 extra -->
        <div class="ciclo-row">
          <div class="ciclo-per"></div>
          <div class="box-ciclo" style="background:transparent;border:none;"></div>
          <div class="arr"></div>
          <div class="box-ciclo" style="background:transparent;border:none;"></div>
          <div class="arr"></div>
          <div :class="['box-ciclo box-ciclo-r', realizacaoAtiva(3) ? 'ciclo-ativo-r' : '']">
            <span :class="ehMestre(d.realizacoes[3]?.vn) ? 'num-mestre' : ''">{{ fmtSlash(d.realizacoes[3]?.vn) }}</span>
            <span class="sub-lbl">R4</span>
          </div>
          <div class="ciclo-per-right">
            <span>+ {{ d.realizacoes[3]?.inicio }}</span>
            <span v-if="realizacaoAtiva(3)" class="ativo-badge">atual</span>
          </div>
        </div>

      </div>

      <!-- Ano Pessoal -->
      <p class="section-title">✦ Ano Pessoal {{ d.anoAtual }}</p>
      <div class="card mb ano-card">
        <div class="ano-inner">
          <div class="ano-numero-wrap">
            <span class="ano-label">AP</span>
            <div :class="['ano-numero', ehMestre(d.ap) ? 'num-mestre' : '']">{{ fmtSlash(d.ap) }}</div>
            <span class="ano-label">{{ d.anoAtual }}</span>
          </div>
          <div class="cts-wrap">
            <div v-for="(ct, i) in [d.cts.ct1, d.cts.ct2, d.cts.ct3, d.cts.ct4]" :key="i" class="ct-item">
              <div :class="['box-ciclo box-ciclo-c ct-box']">
                <span :class="ehMestre(ct) ? 'num-mestre' : ''">{{ fmtSlash(ct) }}</span>
                <span class="sub-lbl">CT{{ i + 1 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useJornadaStore } from '../stores/jornadaStore.js'

const store = useJornadaStore()
const dia = ref(null)
const mes = ref(null)
const ano = ref(null)

const d = computed(() => store.dados)

function calcular() { store.calcular(dia.value, mes.value, ano.value) }

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

function realizacaoAtiva(idx) {
  if (!d.value) return false
  const r = d.value.realizacoes[idx]
  if (!r) return false
  const idade = d.value.idade
  return idade >= r.inicio && (r.fim === null || idade <= r.fim)
}

const rows = computed(() => {
  if (!d.value) return []
  return [
    { periodo: '00/28', cicloKey: 'c1', cicloVn: d.value.ciclos.c1, cicloLabel: 'C1', desafioVn: d.value.desafios.d1, desafioLabel: 'D1', realIdx: 0, realLabel: 'R1' },
    { periodo: '29/56', cicloKey: 'c2', cicloVn: d.value.ciclos.c2, cicloLabel: 'C2', desafioVn: d.value.desafios.d2, desafioLabel: 'D2', realIdx: 1, realLabel: 'R2' },
    { periodo: '+57', cicloKey: 'c3', cicloVn: d.value.ciclos.c3, cicloLabel: 'C3', desafioVn: d.value.desafios.dm, desafioLabel: 'DM', realIdx: 2, realLabel: 'R3' },
  ]
})
</script>

<style scoped>
.jornada-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 28px 20px 60px;
}

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

.sub-desc {
  font-size: 12px;
  color: var(--text-dim);
  margin-bottom: 16px;
}

.jornada-form {}

.date-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr auto;
  gap: 12px;
  align-items: end;
}

.m-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-dim);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.m-input {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-deep);
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  text-align: center;
}

.m-input:focus { border-color: var(--gold); }
.m-input[type=number]::-webkit-inner-spin-button,
.m-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
.m-input[type=number] { -moz-appearance: textfield; }

.btn-col { display: flex; align-items: flex-end; }

.btn-mystic {
  padding: 10px 20px;
  background: linear-gradient(135deg, var(--gold), #a8841d);
  color: var(--text-dark);
  border: none;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  cursor: pointer;
  font-family: inherit;
  white-space: nowrap;
  transition: opacity 0.2s;
}

.btn-mystic:hover { opacity: 0.9; }

.m-erro { color: #e05a5a; font-size: 13px; margin-top: 10px; text-align: center; }

/* CD */
.cd-card {}
.cd-inner { display: flex; align-items: center; gap: 24px; }
.cd-num-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 80px; }
.cd-num { font-size: 48px; font-weight: 800; color: var(--gold); text-shadow: 0 0 12px rgba(201,162,39,0.5); line-height: 1; }
.cd-info {}
.cd-data { font-size: 16px; color: var(--text); font-weight: 500; }
.cd-idade { font-size: 13px; color: var(--text-dim); margin-top: 4px; }
.ano-label { font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; }

/* GRID */
.jornada-grid { display: flex; flex-direction: column; gap: 6px; }

.ciclos-header {
  display: grid;
  grid-template-columns: 28px 1fr 10px 1fr 10px 1fr 60px;
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
  grid-template-columns: 28px 1fr 10px 1fr 10px 1fr 60px;
  align-items: center;
  gap: 4px;
}

.ciclo-per { font-size: 8px; color: var(--text-dim); text-align: right; line-height: 1.4; }
.ciclo-per-right { font-size: 8px; color: var(--text-dim); display: flex; flex-direction: column; gap: 2px; padding-left: 4px; }
.arr { font-size: 10px; color: var(--text-dim); text-align: center; }

.box-ciclo {
  height: 44px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  gap: 1px;
}

.sub-lbl { font-size: 8px; font-weight: 400; color: var(--text-dim); letter-spacing: 0.05em; text-transform: uppercase; }

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

.ciclo-ativo { border-color: var(--gold) !important; }
.ciclo-ativo-r { border-color: var(--gold) !important; }

.ativo-badge {
  font-size: 7px;
  background: var(--gold-dim);
  border: 1px solid var(--gold-border);
  color: var(--gold);
  border-radius: 3px;
  padding: 1px 4px;
  font-weight: 600;
}

.num-mestre { color: var(--gold); text-shadow: 0 0 10px rgba(201,162,39,0.5); }

/* ANO */
.ano-card {}
.ano-inner { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.ano-numero-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 80px; }
.ano-numero { font-size: 44px; font-weight: 800; color: var(--gold); text-shadow: 0 0 12px rgba(201,162,39,0.5); line-height: 1; }
.cts-wrap { display: flex; gap: 8px; flex-wrap: wrap; }
.ct-box { width: 52px; height: 52px; font-size: 15px; }
</style>
