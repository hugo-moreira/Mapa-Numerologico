<template>
  <div class="sinastria-page">

    <p class="section-title">✦ Sinastria entre Mapas</p>

    <div class="grid-pessoas mb">
      <!-- Pessoa 1 -->
      <div class="card pessoa-card">
        <p class="pessoa-label">Pessoa 1</p>
        <input v-model="nome1" type="text" placeholder="Nome completo" class="m-input" />
        <div class="date-grid">
          <input v-model.number="dia1" type="number" placeholder="Dia" class="m-input date-inp" />
          <input v-model.number="mes1" type="number" placeholder="Mês" class="m-input date-inp" />
          <input v-model.number="ano1" type="number" placeholder="Ano" class="m-input date-inp" />
        </div>
      </div>

      <!-- Divisor -->
      <div class="vs-divider">
        <span class="vs-label">×</span>
      </div>

      <!-- Pessoa 2 -->
      <div class="card pessoa-card">
        <p class="pessoa-label">Pessoa 2</p>
        <input v-model="nome2" type="text" placeholder="Nome completo" class="m-input" />
        <div class="date-grid">
          <input v-model.number="dia2" type="number" placeholder="Dia" class="m-input date-inp" />
          <input v-model.number="mes2" type="number" placeholder="Mês" class="m-input date-inp" />
          <input v-model.number="ano2" type="number" placeholder="Ano" class="m-input date-inp" />
        </div>
      </div>
    </div>

    <!-- Condição de convívio -->
    <div class="card mb condicao-card">
      <label class="m-label">Condição de convívio</label>
      <select v-model="condicaoConvivio" class="m-select">
        <option value="Continua">Contínua (diária, mesmo quarto)</option>
        <option value="Intercalada">Intercalada (intervalo de 24h)</option>
        <option value="Eventual">Eventual (intervalo 24h a 96h)</option>
        <option value="Sem risco">Sem risco (intervalo &gt; 96h)</option>
      </select>
    </div>

    <button @click="calcularSinastria" class="btn-mystic btn-full mb">Analisar Sinastria</button>

    <!-- Resultado -->
    <div v-if="resultado" class="resultado">

      <div class="card mb sinastria-resumo">
        <div class="sinastria-header">
          <span class="sinastria-intens">{{ resultado.sinastria.intensidade }}</span>
          <span class="sinastria-badge">Sinastria</span>
        </div>
        <p class="sinastria-desc">{{ resultado.sinastria.descricaoIntensidade }}</p>
        <div v-if="resultado.sinastria.aspectosRelacao.length" class="aspectos-wrap">
          <p class="m-label" style="margin-bottom:8px;">Relação baseada em</p>
          <div class="aspectos-list">
            <span v-for="a in resultado.sinastria.aspectosRelacao" :key="a" class="aspecto-tag">{{ a }}</span>
          </div>
        </div>
      </div>

      <div v-if="resultado.simbiose.temSimbiose" class="card mb">
        <p class="analise-title">Simbiose — Risco {{ resultado.simbiose.riscoGeral }}</p>
        <p class="simbiose-orientacao">{{ resultado.simbiose.orientacao }}</p>
        <div class="riscos-lista">
          <div
            v-for="r in resultado.simbiose.riscosCristalizacao"
            :key="r.vn"
            class="risco-item"
          >
            <div class="risco-vn">{{ String(r.vn).padStart(2,'0') }}</div>
            <span class="risco-tipo">{{ r.tipo }}</span>
            <span v-if="r.tipo !== 'Nao Interfere'" class="risco-detalhe">
              {{ r.quemCede }} → {{ r.quemRecebe }}
            </span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { calcularCD, calcularCiclos, calcularDesafios, calcularRealizacoes } from '../core/jornada.js'
import { calcularPersonalidade } from '../core/personalidade.js'
import { calcularSinastria as _calcularSinastria, calcularSimbiose } from '../core/sinastria.js'

const nome1 = ref(''); const dia1 = ref(null); const mes1 = ref(null); const ano1 = ref(null)
const nome2 = ref(''); const dia2 = ref(null); const mes2 = ref(null); const ano2 = ref(null)
const condicaoConvivio = ref('Continua')
const resultado = ref(null)

function montarMapa(nome, dia, mes, ano) {
  const cd = calcularCD(dia, mes, ano)
  const { mo, eu, ex, merito, tributo } = calcularPersonalidade(nome, cd)
  const { c1, c2, c3 } = calcularCiclos(dia, mes, ano)
  const { d1, d2, dm } = calcularDesafios(dia, mes, ano)
  const realizacoes = calcularRealizacoes(dia, mes, ano, cd)
  return { mo, eu, ex, cd, merito, tributo, c1, c2, c3, d1, d2, dm, realizacoes }
}

function calcularSinastria() {
  const m1 = montarMapa(nome1.value, dia1.value, mes1.value, ano1.value)
  const m2 = montarMapa(nome2.value, dia2.value, mes2.value, ano2.value)
  const sinastria = _calcularSinastria(m1, m2)
  const simbiose = calcularSimbiose(m1, m2, condicaoConvivio.value, sinastria)
  resultado.value = { sinastria, simbiose }
}
</script>

<style scoped>
.sinastria-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 28px 20px 60px;
}

.card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px; }
.mb { margin-bottom: 16px; }

.section-title { font-size: 11px; font-weight: 600; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }

.grid-pessoas {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 14px;
  align-items: center;
}

.pessoa-card { display: flex; flex-direction: column; gap: 10px; }
.pessoa-label { font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; }

.vs-divider { display: flex; align-items: center; justify-content: center; }
.vs-label { font-size: 20px; color: var(--border); }

.date-grid { display: grid; grid-template-columns: 1fr 1fr 1.4fr; gap: 8px; }

.m-label { display: block; font-size: 10px; font-weight: 600; color: var(--text-dim); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }

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
}
.m-input:focus { border-color: var(--gold); }
.m-input::placeholder { color: #3a5070; }

.date-inp { text-align: center; }
.date-inp::-webkit-inner-spin-button, .date-inp::-webkit-outer-spin-button { -webkit-appearance: none; }
.date-inp { -moz-appearance: textfield; }

.condicao-card {}
.m-select {
  width: 100%;
  padding: 10px 12px;
  background: var(--bg-deep);
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--text);
  font-size: 13px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  appearance: none;
}
.m-select:focus { border-color: var(--gold); }

.btn-mystic {
  padding: 12px 20px;
  background: linear-gradient(135deg, var(--gold), #a8841d);
  color: var(--text-dark);
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s;
}
.btn-mystic:hover { opacity: 0.9; }
.btn-full { width: 100%; }

/* Resultado */
.sinastria-resumo {}
.sinastria-header { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.sinastria-intens { font-size: 26px; font-weight: 300; color: var(--text); }
.sinastria-badge { font-size: 10px; background: var(--gold-dim); border: 1px solid var(--gold-border); color: var(--gold); padding: 3px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.08em; }
.sinastria-desc { font-size: 13px; color: var(--text-dim); line-height: 1.6; }

.aspectos-wrap { margin-top: 12px; }
.aspectos-list { display: flex; flex-wrap: wrap; gap: 6px; }
.aspecto-tag { font-size: 11px; background: var(--bg-deep); border: 1px solid var(--border); color: var(--text-dim); padding: 3px 10px; border-radius: 4px; }

.analise-title { font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid var(--border); padding-bottom: 6px; margin-bottom: 10px; }
.simbiose-orientacao { font-size: 13px; color: var(--text); line-height: 1.6; margin-bottom: 12px; }

.riscos-lista { display: flex; flex-direction: column; gap: 6px; }
.risco-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; background: var(--bg-deep); border: 1px solid var(--border); border-radius: 6px; }
.risco-vn { width: 32px; height: 32px; border-radius: 5px; background: var(--blue-surface); border: 1px solid var(--border-blue); color: var(--text); font-size: 14px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.risco-tipo { font-size: 12px; color: var(--text); font-weight: 500; }
.risco-detalhe { font-size: 11px; color: var(--text-dim); }
</style>
