<template>
  <div class="space-y-3">
    <!-- PERSONALIDADE -->
    <template v-if="secao === 'personalidade'">
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div v-for="item in personalidade" :key="item.sigla" class="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
          <NumeroCard :vn="item.vn" tamanho="medio" />
          <div>
            <p class="text-xs text-stone-400">{{ item.sigla }}</p>
            <p class="text-sm text-stone-700">{{ item.nome }}</p>
          </div>
        </div>
      </div>
    </template>

    <!-- JORNADA -->
    <template v-else-if="secao === 'jornada'">
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div v-for="item in jornada" :key="item.sigla" class="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
          <NumeroCard :vn="item.vn" tamanho="medio" />
          <div>
            <p class="text-xs text-stone-400">{{ item.sigla }}</p>
            <p class="text-sm text-stone-700">{{ item.nome }}</p>
            <p v-if="item.periodo" class="text-xs text-stone-400">{{ item.periodo }}</p>
          </div>
        </div>
      </div>
    </template>

    <!-- DUPLICIDADES -->
    <template v-else-if="secao === 'duplicidades'">
      <div v-if="mapa.duplicidades.length === 0" class="text-sm text-stone-400">Nenhuma duplicidade.</div>
      <div v-for="dup in mapa.duplicidades" :key="dup.vn" class="flex items-center gap-3 p-3 rounded-xl bg-stone-50">
        <NumeroCard :vn="dup.vn" tamanho="medio" />
        <span class="text-sm text-stone-700">{{ dup.tipo }} ({{ dup.quantidade }}x)</span>
      </div>
      <div class="mt-3">
        <p class="text-xs text-stone-500 uppercase tracking-wider mb-2">Ausências</p>
        <div class="flex flex-wrap gap-2">
          <span v-if="mapa.ausencias.length === 0" class="text-sm text-stone-400">Nenhuma ausência.</span>
          <NumeroCard v-for="aus in mapa.ausencias" :key="aus" :vn="aus" tamanho="pequeno" />
        </div>
      </div>
      <div v-if="mapa.avp.avpc.length > 0 || mapa.avp.avpf.length > 0" class="mt-2">
        <p class="text-xs text-stone-500 uppercase tracking-wider mb-2">AVPs</p>
        <div class="flex flex-wrap gap-2">
          <span v-for="vn in mapa.avp.avpc" :key="`c${vn}`" class="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-full">AVPc {{ vn }}</span>
          <span v-for="vn in mapa.avp.avpf" :key="`f${vn}`" class="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded-full">AVPf {{ vn }}</span>
        </div>
      </div>
    </template>

    <!-- POTENCIAIS -->
    <template v-else-if="secao === 'potenciais'">
      <div class="grid grid-cols-2 gap-3">
        <div class="p-3 rounded-xl bg-stone-50">
          <p class="text-xs text-stone-400 mb-1">Razão vs Emoção</p>
          <p class="text-sm text-stone-700 font-medium">{{ mapa.razaoEmocao.predominante }}</p>
          <p class="text-xs text-stone-400 mt-1">Razão: {{ mapa.razaoEmocao.razao }}% · Emoção: {{ mapa.razaoEmocao.emocao }}%</p>
        </div>
        <div class="p-3 rounded-xl bg-stone-50">
          <p class="text-xs text-stone-400 mb-1">Como Reagem</p>
          <p class="text-sm text-stone-700 font-medium">{{ mapa.comoReagem.predominantes.join(', ') }}</p>
        </div>
      </div>
      <div class="p-3 rounded-xl bg-stone-50 mt-2">
        <p class="text-xs text-stone-400 mb-1">Expressão</p>
        <p class="text-sm text-stone-700 font-medium">{{ mapa.expressao.perfil }}</p>
        <p class="text-xs text-stone-500 mt-1">{{ mapa.expressao.orientacao }}</p>
      </div>
    </template>

    <!-- RISCOS -->
    <template v-else-if="secao === 'riscos'">
      <div class="grid grid-cols-3 gap-3">
        <div :class="['p-3 rounded-xl', mapa.riscos.cp > 40 ? 'bg-red-50' : 'bg-stone-50']">
          <p class="text-xs text-stone-400">CP</p>
          <p class="text-lg font-light text-stone-800">{{ mapa.riscos.cp }}%</p>
          <p class="text-xs text-stone-500 mt-1">{{ mapa.riscos.cp > 40 ? 'Alto' : mapa.riscos.cp > 15 ? 'Médio' : 'Fraco' }}</p>
        </div>
        <div :class="['p-3 rounded-xl', mapa.riscos.vg > 40 ? 'bg-amber-50' : 'bg-stone-50']">
          <p class="text-xs text-stone-400">VG</p>
          <p class="text-lg font-light text-stone-800">{{ mapa.riscos.vg }}%</p>
          <p class="text-xs text-stone-500 mt-1">{{ mapa.riscos.vg > 40 ? 'Alto' : mapa.riscos.vg > 15 ? 'Médio' : 'Fraco' }}</p>
        </div>
        <div :class="['p-3 rounded-xl', mapa.riscos.sc > 40 ? 'bg-red-50' : 'bg-stone-50']">
          <p class="text-xs text-stone-400">SC</p>
          <p class="text-lg font-light text-stone-800">{{ mapa.riscos.sc }}%</p>
          <p class="text-xs text-stone-500 mt-1">{{ mapa.riscos.sc > 40 ? 'Alto' : mapa.riscos.sc > 15 ? 'Médio' : 'Fraco' }}</p>
        </div>
      </div>
      <div v-if="mapa.riscos.riscoCP || mapa.riscos.riscoSC" class="mt-3 p-3 bg-red-50 rounded-xl">
        <p v-if="mapa.riscos.riscoCP" class="text-sm text-red-700">Risco de CP detectado (CP + SC > 80%).</p>
        <p v-if="mapa.riscos.riscoSC" class="text-sm text-red-700">Risco de SC detectado (CP + VG > 80%).</p>
      </div>
    </template>

    <!-- VIDA PESSOAL -->
    <template v-else-if="secao === 'vidaPessoal'">
      <div class="space-y-3">
        <div class="p-3 rounded-xl bg-stone-50">
          <p class="text-xs text-stone-400 uppercase tracking-wider mb-1">Prática Afetiva</p>
          <p class="text-sm text-stone-700 font-medium">{{ mapa.praticaAfetiva.condicao }}</p>
          <p class="text-xs text-stone-500 mt-1">{{ mapa.praticaAfetiva.orientacao }}</p>
        </div>
        <div class="p-3 rounded-xl bg-stone-50">
          <p class="text-xs text-stone-400 uppercase tracking-wider mb-1">Fertilidade e Filhos</p>
          <p class="text-sm text-stone-700 font-medium">{{ mapa.fertilidade.condicao }}</p>
          <p class="text-xs text-stone-500 mt-1">{{ mapa.fertilidade.orientacao }}</p>
        </div>
        <div class="p-3 rounded-xl bg-stone-50">
          <p class="text-xs text-stone-400 uppercase tracking-wider mb-1">Intensidade Sexual</p>
          <p class="text-sm text-stone-700 font-medium">{{ mapa.intensidadeSexual.intensidade }}</p>
          <p class="text-xs text-stone-400">{{ mapa.intensidadeSexual.percentual }}% VNs ímpares</p>
        </div>
      </div>
    </template>

    <!-- ESPECIAIS -->
    <template v-else-if="secao === 'especiais'">
      <div class="space-y-3">
        <div v-if="mapa.renascimento.length > 0" v-for="r in mapa.renascimento" :key="r.realizacao" class="p-3 rounded-xl bg-amber-50 border border-amber-200">
          <p class="text-xs text-amber-600 uppercase tracking-wider mb-1">Renascimento — {{ r.realizacao }}</p>
          <p class="text-sm text-stone-700">Início: {{ r.idadeInicio }} anos</p>
          <p class="text-xs text-stone-500 mt-1">Preparação: {{ r.preparacao }}</p>
          <p class="text-xs text-stone-500">Período proveitoso: {{ r.periodoProveitoso }}</p>
        </div>
        <div v-if="mapa.legado.length > 0" v-for="l in mapa.legado" :key="l.realizacao" class="p-3 rounded-xl bg-stone-50">
          <p class="text-xs text-stone-400 uppercase tracking-wider mb-1">Legado — {{ l.tipo }} na {{ l.realizacao }}</p>
          <p class="text-sm text-stone-700">A partir dos {{ l.idadeInicio }} anos</p>
        </div>
        <div v-if="mapa.conquistaEspontanea.length > 0" v-for="c in mapa.conquistaEspontanea" :key="c.desafio+c.realizacao" class="p-3 rounded-xl bg-stone-50">
          <p class="text-xs text-stone-400 uppercase tracking-wider mb-1">Conquista Espontânea</p>
          <p class="text-sm text-stone-700">{{ c.desafio }} = {{ c.realizacao }} ({{ c.periodo }})</p>
        </div>
        <div v-if="mapa.realizacaoEspontanea.length > 0" v-for="r in mapa.realizacaoEspontanea" :key="r.posicao+r.realizacao" class="p-3 rounded-xl bg-stone-50">
          <p class="text-xs text-stone-400 uppercase tracking-wider mb-1">Realização Espontânea</p>
          <p class="text-sm text-stone-700">{{ r.posicao }} = {{ r.realizacao }} ({{ r.periodo }})</p>
        </div>
        <div v-if="mapa.renascimento.length === 0 && mapa.legado.length === 0 && mapa.conquistaEspontanea.length === 0 && mapa.realizacaoEspontanea.length === 0" class="text-sm text-stone-400">
          Nenhuma característica especial detectada.
        </div>
      </div>
    </template>

    <!-- ENFERMIDADES -->
    <template v-else-if="secao === 'enfermidades'">
      <div v-if="mapa.enfermidades.length === 0" class="text-sm text-stone-400">Sem duplicidades — nenhuma área de atenção preventiva.</div>
      <div v-for="e in mapa.enfermidades" :key="e.vn" class="p-3 rounded-xl bg-stone-50">
        <div class="flex items-center gap-2 mb-2">
          <NumeroCard :vn="e.vn" tamanho="pequeno" />
          <span class="text-xs text-stone-500">{{ e.tipo }} · {{ e.atencao }}</span>
        </div>
        <div class="flex flex-wrap gap-1">
          <span v-for="s in e.sintomas" :key="s" class="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">{{ s }}</span>
        </div>
      </div>
    </template>

    <!-- PROFISSIONAL -->
    <template v-else-if="secao === 'profissional'">
      <div class="space-y-3">
        <div>
          <p class="text-xs text-stone-500 uppercase tracking-wider mb-2">1ª Opção</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="p in mapa.orientacaoProfissional.primeiraOpcao" :key="p" class="text-sm bg-stone-800 text-white px-3 py-1 rounded-full">{{ p }}</span>
          </div>
        </div>
        <div>
          <p class="text-xs text-stone-500 uppercase tracking-wider mb-2">2ª Opção</p>
          <div class="flex flex-wrap gap-2">
            <span v-for="p in mapa.orientacaoProfissional.segundaOpcao" :key="p" class="text-sm bg-stone-100 text-stone-700 px-3 py-1 rounded-full">{{ p }}</span>
          </div>
        </div>
        <div v-if="mapa.orientacaoProfissional.profissionalEspiritualidade" class="p-3 rounded-xl bg-amber-50 border border-amber-200">
          <p class="text-sm text-amber-700">Profissional de Espiritualidade indicado.</p>
        </div>
        <div v-if="mapa.orientacaoProfissional.atividadeArtistica" class="p-3 rounded-xl bg-stone-50">
          <p class="text-sm text-stone-700">VN 3 fixa: indicar atividade artística contínua como lazer/hobby.</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import NumeroCard from './NumeroCard.vue'

const props = defineProps({
  mapa: Object,
  secao: String,
})

const personalidade = computed(() => [
  { sigla: 'MO', nome: 'Motivação (Alma)', vn: props.mapa.mo },
  { sigla: 'EU', nome: 'Eu Íntimo (Sonho)', vn: props.mapa.eu },
  { sigla: 'EX', nome: 'Expressão (Talento)', vn: props.mapa.ex },
  { sigla: 'Mérito', nome: 'Mérito', vn: props.mapa.merito },
  { sigla: 'Tributo', nome: 'Tributo', vn: props.mapa.tributo },
])

const jornada = computed(() => [
  { sigla: 'CD', nome: 'Caminho de Destino', vn: props.mapa.cd, periodo: 'Toda a vida' },
  { sigla: 'C1', nome: '1º Ciclo', vn: props.mapa.c1, periodo: '0 a 28 anos' },
  { sigla: 'C2', nome: '2º Ciclo', vn: props.mapa.c2, periodo: '29 a 56 anos' },
  { sigla: 'C3', nome: '3º Ciclo', vn: props.mapa.c3, periodo: '57+ anos' },
  { sigla: 'D1', nome: '1º Desafio', vn: props.mapa.d1, periodo: '0 a 28 anos' },
  { sigla: 'D2', nome: '2º Desafio', vn: props.mapa.d2, periodo: '29 a 56 anos' },
  { sigla: 'DM', nome: 'Desafio Maior', vn: props.mapa.dm, periodo: 'Toda a vida' },
  ...props.mapa.realizacoes.map((r, i) => ({
    sigla: `R${i + 1}`,
    nome: `${i + 1}ª Realização`,
    vn: r.vn,
    periodo: r.fim ? `${r.inicio} a ${r.fim} anos` : `${r.inicio}+ anos`,
  })),
])
</script>
