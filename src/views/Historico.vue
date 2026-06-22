<template>
  <div class="historico-page">

    <p class="section-title">✦ Histórico de Clientes</p>

    <div class="card busca-card mb">
      <input
        v-model="busca"
        type="text"
        placeholder="Buscar por nome ou data..."
        class="m-input"
      />
    </div>

    <div v-if="registrosFiltrados.length === 0" class="vazio">
      <div class="vazio-inner">
        <span class="vazio-glyph">◎</span>
        <p>Nenhum cliente salvo ainda.</p>
        <router-link to="/" class="link-gold">Calcular primeiro mapa</router-link>
      </div>
    </div>

    <div v-else class="registros-lista">
      <div
        v-for="registro in registrosFiltrados"
        :key="registro.id"
        class="card registro-card"
      >
        <div class="reg-info">
          <p class="reg-nome">{{ registro.nome }}</p>
          <p class="reg-data">{{ registro.dataNascimento }}</p>
          <p class="reg-calc">Calculado em {{ formatarData(registro.dataCalculo) }}</p>
        </div>
        <div class="reg-acoes">
          <button @click="reabrir(registro)" class="btn-sm">Abrir Mapa</button>
          <button @click="remover(registro.id)" class="btn-sm btn-danger">Remover</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useHistoricoStore } from '../stores/historico.js'
import { useMapaStore } from '../stores/mapa.js'

const router = useRouter()
const historicoStore = useHistoricoStore()
const mapaStore = useMapaStore()
const busca = ref('')

const registrosFiltrados = computed(() => {
  if (!busca.value.trim()) return historicoStore.registros
  return historicoStore.buscar(busca.value)
})

function formatarData(iso) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function reabrir(registro) {
  const [d, m, a] = registro.dataNascimento.split('/')
  mapaStore.calcular(registro.nome, Number(d), Number(m), Number(a))
  router.push('/mapa')
}

function remover(id) {
  if (confirm('Remover este cliente do histórico?')) {
    historicoStore.remover(id)
  }
}
</script>

<style scoped>
.historico-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 28px 20px 60px;
}

.card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 16px; }
.mb { margin-bottom: 16px; }

.section-title { font-size: 11px; font-weight: 600; color: var(--gold); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }

.busca-card {}
.m-input {
  width: 100%;
  padding: 11px 14px;
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

.vazio {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
}

.vazio-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--text-dim);
}

.vazio-glyph { font-size: 36px; color: var(--border); }
.link-gold { color: var(--gold); text-decoration: none; font-size: 13px; }
.link-gold:hover { text-decoration: underline; }

.registros-lista { display: flex; flex-direction: column; gap: 10px; }

.registro-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.reg-info {}
.reg-nome { font-size: 15px; font-weight: 600; color: var(--text); }
.reg-data { font-size: 13px; color: var(--text-dim); margin-top: 2px; }
.reg-calc { font-size: 11px; color: var(--border-blue2); margin-top: 2px; }

.reg-acoes { display: flex; gap: 8px; }

.btn-sm {
  border: 1px solid var(--gold);
  color: var(--gold);
  background: transparent;
  font-size: 11px;
  padding: 6px 14px;
  border-radius: 5px;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
}
.btn-sm:hover { background: var(--gold); color: var(--text-dark); }

.btn-danger {
  border-color: #e05a5a;
  color: #e05a5a;
}
.btn-danger:hover { background: #e05a5a; color: white; }
</style>
