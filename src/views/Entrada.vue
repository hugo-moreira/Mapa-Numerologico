<template>
  <div class="entrada-shell">
    <div class="entrada-glow"></div>

    <div class="entrada-hero">
      <p class="eyebrow">Numerologia Pitagórica</p>
      <h1 class="headline">Descubra sua<br><em>Jornada Numerológica</em></h1>
      <p class="subline">Insira apenas a data para a jornada de vida, ou adicione o nome para o mapa completo</p>

      <div class="form-mystic">
        <form @submit.prevent="calcular" novalidate>

          <!-- Seletor de modo -->
          <div class="modo-toggle">
            <button
              type="button"
              :class="['modo-btn', modo === 'jornada' ? 'modo-ativo' : '']"
              @click="modo = 'jornada'"
            >
              <span class="modo-glyph">◎</span>
              Apenas data
            </button>
            <button
              type="button"
              :class="['modo-btn', modo === 'mapa' ? 'modo-ativo' : '']"
              @click="modo = 'mapa'"
            >
              <span class="modo-glyph">✦</span>
              Mapa completo
            </button>
          </div>

          <!-- Nome — só no modo mapa -->
          <div v-if="modo === 'mapa'" class="campo-wrap">
            <label class="m-label">Nome completo de registro</label>
            <input
              v-model="nome"
              type="text"
              placeholder="Ex: Maria Aparecida da Silva"
              class="m-input"
              autocomplete="off"
            />
          </div>

          <!-- Data -->
          <label class="m-label">Data de nascimento</label>
          <div class="m-date-grid">
            <div>
              <input v-model.number="dia" type="number" min="1" max="31" placeholder="Dia" class="m-input" />
            </div>
            <div>
              <input v-model.number="mes" type="number" min="1" max="12" placeholder="Mês" class="m-input" />
            </div>
            <div>
              <input v-model.number="ano" type="number" min="1900" max="2100" placeholder="Ano" class="m-input" />
            </div>
          </div>

          <p v-if="erro" class="m-erro">{{ erro }}</p>

          <button type="submit" class="btn-mystic">
            {{ modo === 'mapa' ? 'Revelar Mapa Completo' : 'Ver Jornada de Vida' }}
          </button>
        </form>
      </div>

      <!-- Descrição dos modos -->
      <div class="modos-desc">
        <div class="modo-desc-item" :class="{ 'modo-desc-ativo': modo === 'jornada' }">
          <p class="modo-desc-titulo">Jornada de Vida (só data)</p>
          <p class="modo-desc-txt">CD · Ciclos · Aprendizados · Realizações · Ano Pessoal</p>
        </div>
        <div class="modo-desc-sep">ou</div>
        <div class="modo-desc-item" :class="{ 'modo-desc-ativo': modo === 'mapa' }">
          <p class="modo-desc-titulo">Mapa Completo (nome + data)</p>
          <p class="modo-desc-txt">Personalidade · Alma · Jornada · Profissões · Previsões</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMapaStore } from '../stores/mapa.js'
import { useJornadaStore } from '../stores/jornadaStore.js'

const router = useRouter()
const mapaStore = useMapaStore()
const jornadaStore = useJornadaStore()

const modo = ref('jornada')
const nome = ref('')
const dia = ref(null)
const mes = ref(null)
const ano = ref(null)
const erro = ref('')

function calcular() {
  erro.value = ''

  if (!dia.value || !mes.value || !ano.value) {
    erro.value = 'Preencha dia, mês e ano de nascimento.'
    return
  }

  if (modo.value === 'mapa') {
    if (!nome.value.trim()) {
      erro.value = 'Informe o nome completo para o mapa completo.'
      return
    }
    mapaStore.calcular(nome.value.trim(), dia.value, mes.value, ano.value)
    if (mapaStore.calculado) {
      router.push('/mapa')
    } else if (mapaStore.erro) {
      erro.value = mapaStore.erro
    }
  } else {
    jornadaStore.calcular(dia.value, mes.value, ano.value)
    if (jornadaStore.calculado) {
      router.push('/jornada')
    } else if (jornadaStore.erro) {
      erro.value = jornadaStore.erro
    }
  }
}
</script>

<style scoped>
.entrada-shell {
  min-height: calc(100vh - 56px);
  background: var(--bg-deep);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  position: relative;
  overflow: hidden;
}

.entrada-glow {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 500px;
  background: radial-gradient(ellipse at center, rgba(201,162,39,0.07) 0%, transparent 70%);
  pointer-events: none;
}

.entrada-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 1;
}

.eyebrow {
  font-size: 11px;
  font-weight: 600;
  color: var(--gold);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 16px;
  text-align: center;
}

.headline {
  font-size: 32px;
  font-weight: 200;
  color: var(--text);
  text-align: center;
  line-height: 1.3;
  letter-spacing: -0.3px;
  margin-bottom: 12px;
}

.headline em {
  font-style: normal;
  color: var(--gold);
  font-weight: 400;
}

.subline {
  font-size: 13px;
  color: var(--text-dim);
  text-align: center;
  margin-bottom: 36px;
  max-width: 380px;
  line-height: 1.6;
}

/* ── FORM ── */
.form-mystic {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 28px 32px;
  width: 100%;
  position: relative;
}

.form-mystic::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(201,162,39,0.15) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
}

/* ── TOGGLE DE MODO ── */
.modo-toggle {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 24px;
  background: var(--bg-deep);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 4px;
}

.modo-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 12px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: var(--text-dim);
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.18s;
  font-weight: 400;
}

.modo-btn:hover {
  color: var(--text);
}

.modo-btn.modo-ativo {
  background: var(--gold);
  color: var(--text-dark);
  font-weight: 700;
}

.modo-glyph {
  font-size: 14px;
}

/* ── CAMPOS ── */
.campo-wrap {
  margin-bottom: 0;
}

.m-label {
  display: block;
  font-size: 10px;
  font-weight: 600;
  color: var(--text-dim);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.m-input {
  width: 100%;
  padding: 12px 14px;
  background: var(--bg-deep);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 14px;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  margin-bottom: 20px;
}

.m-input:focus {
  border-color: var(--gold);
}

.m-input::placeholder {
  color: #3a5070;
}

.m-input[type=number]::-webkit-inner-spin-button,
.m-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
.m-input[type=number] { -moz-appearance: textfield; }

.m-date-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr;
  gap: 12px;
}

.m-date-grid .m-input {
  text-align: center;
}

.m-erro {
  color: #e05a5a;
  font-size: 12px;
  text-align: center;
  margin-bottom: 12px;
  margin-top: -8px;
}

.btn-mystic {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, var(--gold), #a8841d);
  color: var(--text-dark);
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  cursor: pointer;
  font-family: inherit;
  transition: opacity 0.2s;
  margin-top: 4px;
}

.btn-mystic:hover {
  opacity: 0.9;
}

/* ── DESCRIÇÃO DOS MODOS ── */
.modos-desc {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 28px;
  width: 100%;
}

.modo-desc-item {
  flex: 1;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  transition: border-color 0.2s, background 0.2s;
}

.modo-desc-item.modo-desc-ativo {
  border-color: var(--gold-border);
  background: var(--gold-dim);
}

.modo-desc-titulo {
  font-size: 11px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.modo-desc-ativo .modo-desc-titulo {
  color: var(--gold);
}

.modo-desc-txt {
  font-size: 11px;
  color: var(--text-dim);
  line-height: 1.5;
}

.modo-desc-sep {
  font-size: 11px;
  color: var(--border);
  flex-shrink: 0;
}
</style>
