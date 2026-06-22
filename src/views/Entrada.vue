<template>
  <div class="entrada-shell">
    <div class="entrada-glow"></div>

    <div class="entrada-hero">
      <p class="eyebrow">Numerologia Pitagórica</p>
      <h1 class="headline">Descubra sua<br><em>Jornada Numerológica</em></h1>
      <p class="subline">Insira nome e data de nascimento para revelar os padrões que governam sua existência</p>

      <div class="form-mystic">
        <form @submit.prevent="calcular" novalidate>
          <label class="m-label">Nome completo de registro</label>
          <input
            v-model="nome"
            type="text"
            placeholder="Ex: Maria Aparecida da Silva"
            class="m-input"
            autocomplete="off"
          />

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

          <p v-if="mapaStore.erro" class="m-erro">{{ mapaStore.erro }}</p>

          <button type="submit" class="btn-mystic">Revelar Mapa Numerológico</button>
        </form>
      </div>

      <div class="entrada-features">
        <div class="feature-item">
          <span class="feature-glyph">✦</span>
          <span>5 Núcleos do Ser</span>
        </div>
        <div class="feature-item">
          <span class="feature-glyph">◎</span>
          <span>Ciclos de Vida</span>
        </div>
        <div class="feature-item">
          <span class="feature-glyph">△</span>
          <span>Realizações</span>
        </div>
        <div class="feature-item">
          <span class="feature-glyph">⊕</span>
          <span>Previsão Anual</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMapaStore } from '../stores/mapa.js'

const router = useRouter()
const mapaStore = useMapaStore()

const nome = ref('')
const dia = ref(null)
const mes = ref(null)
const ano = ref(null)

function calcular() {
  mapaStore.calcular(nome.value, dia.value, mes.value, ano.value)
  if (mapaStore.calculado) {
    router.push('/mapa')
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
  font-size: 14px;
  color: var(--text-dim);
  text-align: center;
  margin-bottom: 40px;
  max-width: 380px;
  line-height: 1.6;
}

.form-mystic {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 32px 36px;
  width: 100%;
  position: relative;
}

.form-mystic::before {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(201,162,39,0.2) 0%, transparent 50%);
  pointer-events: none;
  z-index: -1;
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

/* Remove spinners dos inputs numéricos */
.m-input[type=number]::-webkit-inner-spin-button,
.m-input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; }
.m-input[type=number] { -moz-appearance: textfield; }

.m-date-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr;
  gap: 12px;
  margin-bottom: 0;
}

.m-date-grid .m-input {
  text-align: center;
  margin-bottom: 20px;
}

.m-erro {
  color: #e05a5a;
  font-size: 13px;
  text-align: center;
  margin-bottom: 16px;
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

.entrada-features {
  display: flex;
  gap: 28px;
  margin-top: 36px;
  flex-wrap: wrap;
  justify-content: center;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-dim);
}

.feature-glyph {
  color: var(--gold);
  font-size: 14px;
}
</style>
