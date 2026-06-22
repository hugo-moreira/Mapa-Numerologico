<template>
  <div class="previsao-page">

    <div v-if="!mapaStore.calculado" class="vazio">
      <p>Nenhum mapa calculado. <router-link to="/" class="link-gold">Calcular agora</router-link></p>
    </div>

    <div v-else>
      <p class="section-title">✦ Previsão Anual</p>

      <div class="card mb cabecalho">
        <div class="cab-info">
          <p class="cab-nome">{{ mapaStore.nome }}</p>
          <p class="cab-data">{{ mapaStore.dia }}/{{ mapaStore.mes }}/{{ mapaStore.ano }}</p>
        </div>
        <div class="cab-form">
          <label class="m-label">Ano de interesse</label>
          <div class="form-row">
            <input
              v-model.number="anoInteresse"
              type="number"
              min="2000" max="2100"
              class="m-input"
            />
            <button @click="calcularPrevisao" class="btn-mystic">Calcular</button>
          </div>
        </div>
      </div>

      <div v-if="previsao" class="resultado">

        <!-- AP do ano -->
        <div class="card mb ap-card">
          <div class="ap-inner">
            <div class="ap-num-wrap">
              <span class="ano-label">Ano Pessoal {{ anoInteresse }}</span>
              <div :class="['ap-num', ehMestre(previsao.ap) ? 'num-mestre' : '']">{{ fmtSlash(previsao.ap) }}</div>
              <span class="ano-label">AP</span>
            </div>
            <div class="ap-texto">
              <p class="ap-caract">{{ previsao.interpretacaoAP.caracteristicas }}</p>
              <p class="ap-risco">{{ previsao.interpretacaoAP.riscos }}</p>
            </div>
          </div>
        </div>

        <!-- CTs -->
        <p class="col-label mb-6">Ciclos Trimestrais</p>
        <div class="cts-grid mb">
          <div
            v-for="ct in previsao.periodosCTs"
            :key="ct.ct"
            class="card ct-card"
          >
            <div class="ct-header">
              <div class="ct-num-wrap">
                <span class="ano-label">{{ ct.ct }}</span>
                <div :class="['ct-num', ehMestre(previsao.cts[ct.ct.toLowerCase()]) ? 'num-mestre' : '']">
                  {{ fmtSlash(previsao.cts[ct.ct.toLowerCase()]) }}
                </div>
              </div>
              <div class="ct-periodo">{{ ct.inicio }} → {{ ct.fim }}</div>
            </div>
            <p class="ct-texto">{{ ct.interpretacao }}</p>
          </div>
        </div>

        <!-- Eventos favoráveis -->
        <div v-if="previsao.eventosFavoraveis.length" class="card mb">
          <p class="analise-title">Eventos Favoráveis</p>
          <ul class="eventos-lista">
            <li v-for="ev in previsao.eventosFavoraveis" :key="ev" class="evento-item">
              <span class="evento-dot">›</span>
              <span>{{ ev }}</span>
            </li>
          </ul>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useMapaStore } from '../stores/mapa.js'
import { calcularPrevisaoAnual } from '../core/previsoes.js'
import { cicloAtivoPorIdade, realizacaoAtivaPorIdade } from '../core/jornada.js'

const mapaStore = useMapaStore()
const anoInteresse = ref(new Date().getFullYear())
const previsao = ref(null)

function fmtSlash(vn) {
  if (vn === 11) return '11/2'
  if (vn === 22) return '22/4'
  return String(vn ?? 0).padStart(2, '0')
}
function ehMestre(vn) { return vn === 11 || vn === 22 }

function calcularPrevisao() {
  if (!mapaStore.calculado) return
  const m = mapaStore.mapa
  const cicloKey = cicloAtivoPorIdade(m.idade)
  const cicloAtual = m[cicloKey]
  const idxReal = realizacaoAtivaPorIdade(m.idade, m.realizacoes)
  const realizacaoAtual = m.realizacoes[idxReal].vn
  previsao.value = calcularPrevisaoAnual(
    mapaStore.dia, mapaStore.mes, anoInteresse.value,
    cicloAtual, realizacaoAtual, m.dm
  )
}
</script>

<style scoped>
.previsao-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 28px 20px 60px;
}

.vazio { display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 56px); color: var(--text-dim); }
.link-gold { color: var(--gold); text-decoration: none; }

.card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px; }
.mb { margin-bottom: 16px; }
.mb-6 { margin-bottom: 6px; }

.section-title { font-size: 11px; font-weight: 600; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }

.cabecalho { display: flex; align-items: flex-start; gap: 24px; flex-wrap: wrap; }
.cab-info {}
.cab-nome { font-size: 17px; font-weight: 600; color: var(--text); }
.cab-data { font-size: 13px; color: var(--text-dim); margin-top: 2px; }
.cab-form { flex: 1; }

.m-label { display: block; font-size: 10px; font-weight: 600; color: var(--text-dim); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
.form-row { display: flex; gap: 10px; align-items: center; }
.m-input {
  padding: 10px 14px;
  background: var(--bg-deep);
  border: 1px solid var(--border);
  border-radius: 7px;
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  width: 100px;
  text-align: center;
  transition: border-color 0.2s;
}
.m-input:focus { border-color: var(--gold); }

.btn-mystic {
  padding: 10px 18px;
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
  transition: opacity 0.2s;
}
.btn-mystic:hover { opacity: 0.9; }

/* AP */
.ap-card {}
.ap-inner { display: flex; gap: 24px; align-items: flex-start; }
.ap-num-wrap { display: flex; flex-direction: column; align-items: center; gap: 4px; min-width: 90px; }
.ano-label { font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; }
.ap-num { font-size: 52px; font-weight: 800; color: var(--gold); text-shadow: 0 0 14px rgba(201,162,39,0.5); line-height: 1; }
.ap-texto { flex: 1; }
.ap-caract { font-size: 13px; color: var(--text); line-height: 1.6; }
.ap-risco { font-size: 12px; color: #e09050; margin-top: 8px; padding: 8px 12px; background: rgba(224,144,80,0.08); border: 1px solid rgba(224,144,80,0.2); border-radius: 6px; }

.num-mestre { color: var(--gold); text-shadow: 0 0 12px rgba(201,162,39,0.6); }

/* CTs */
.col-label { font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; }

.cts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }

.ct-card { display: flex; flex-direction: column; gap: 8px; }
.ct-header { display: flex; align-items: center; gap: 14px; }
.ct-num-wrap { display: flex; flex-direction: column; align-items: center; gap: 2px; min-width: 52px; }
.ct-num { font-size: 28px; font-weight: 800; color: var(--text); line-height: 1; }
.ct-periodo { font-size: 11px; color: var(--text-dim); }
.ct-texto { font-size: 12px; color: var(--text); line-height: 1.6; }

/* Eventos */
.analise-title { font-size: 10px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid var(--border); padding-bottom: 6px; margin-bottom: 10px; }
.eventos-lista { list-style: none; display: flex; flex-direction: column; gap: 6px; }
.evento-item { display: flex; gap: 8px; align-items: flex-start; font-size: 13px; color: var(--text); }
.evento-dot { color: var(--gold); flex-shrink: 0; }
</style>
