<template>
  <div v-if="!store.calculado" class="flex items-center justify-center min-h-screen bg-stone-100">
    <p class="text-stone-500">
      Nenhum mapa calculado.
      <router-link to="/" class="underline">Voltar</router-link>
    </p>
  </div>

  <div v-else class="mapa-wrapper" ref="mapaRef">
    <!-- ============================================================
         FOLHA 1 — Cabeçalho + Grid de números + Frases
    ============================================================ -->
    <div class="folha">

      <!-- === CABEÇALHO ESCURO === -->
      <div class="cabecalho">
        <div class="cab-esquerda">
          <div class="cab-linha">
            <span class="cab-label">nome:</span>
            <span class="cab-valor nome-valor">{{ store.nome }}</span>
          </div>
          <div class="cab-linha">
            <span class="cab-label">dia:</span>
            <span class="cab-campo">{{ store.dia }}</span>
            <span class="cab-label ml">mês:</span>
            <span class="cab-campo">{{ store.mes }}</span>
            <span class="cab-label ml">ano:</span>
            <span class="cab-campo">{{ store.ano }}</span>
          </div>
          <div class="cab-linha">
            <span class="cab-label">idade:</span>
            <span class="cab-campo">{{ m.idade }}</span>
            <span class="cab-label ml">excel:</span>
            <span class="cab-campo">Brasil</span>
            <span class="cab-label ml">gerado em:</span>
            <span class="cab-valor">{{ dataGerado }}</span>
          </div>
        </div>

        <!-- Pirâmide SVG -->
        <div class="cab-piramide">
          <svg viewBox="0 0 140 110" width="140" height="110">
            <!-- Linhas externas da pirâmide -->
            <polygon points="70,5 135,90 5,90" fill="none" stroke="white" stroke-width="1.5"/>
            <!-- Linhas internas -->
            <line x1="70" y1="5" x2="70" y2="90" stroke="white" stroke-width="1"/>
            <line x1="37" y1="47" x2="103" y2="47" stroke="white" stroke-width="1"/>
            <!-- Números -->
            <text x="70" y="2" text-anchor="middle" fill="white" font-size="10" font-weight="bold">{{ fmt(m.cd) }}</text>
            <text x="5" y="100" text-anchor="middle" fill="white" font-size="10" font-weight="bold">{{ fmt(m.mo) }}</text>
            <text x="135" y="100" text-anchor="middle" fill="white" font-size="10" font-weight="bold">{{ fmt(m.eu) }}</text>
            <text x="70" y="100" text-anchor="middle" fill="white" font-size="10" font-weight="bold">{{ fmt(m.dm) }}</text>
            <text x="70" y="60" text-anchor="middle" fill="white" font-size="11" font-weight="bold">{{ fmtSlash(m.ex) }}</text>
          </svg>
        </div>

        <!-- Logo / Botões de ação -->
        <div class="cab-acoes">
          <button @click="salvar" class="btn-acao">Salvar</button>
          <router-link to="/" class="btn-acao">Novo</router-link>
          <button @click="imprimir" class="btn-acao">Imprimir</button>
        </div>
      </div>

      <!-- === GRID PRINCIPAL DE NÚMEROS === -->
      <div class="grid-numeros">

        <!-- Cabeçalhos das colunas -->
        <div class="col-headers">
          <div class="ch-vazio"></div>
          <div class="ch-vazio"></div>
          <div class="ch-tag">ciclo</div>
          <div class="ch-tag">desafio</div>
          <div class="ch-tag">realização</div>
          <div class="ch-vazio"></div>
        </div>

        <!-- LINHA 1: MO | CD | C1 >>> D1 | R1 -->
        <div class="grid-linha">
          <div class="vn-cell">
            <div v-if="ehMestre(m.mo)" class="vn-superscript">{{ m.mo }}</div>
            <div :class="['vn-box', corBox(m.mo, 'mo')]">{{ fmtBase(m.mo) }}</div>
            <div class="vn-label">MO</div>
          </div>
          <div class="vn-cell">
            <div :class="['vn-box', corBox(m.cd, 'cd')]">{{ fmtBase(m.cd) }}</div>
            <div class="vn-label">CD</div>
          </div>
          <div class="ciclo-cell">
            <span class="periodo-texto">00 / {{ m.realizacoes[0].fim }}</span>
            <span class="seta">&gt;&gt;&gt;</span>
            <div class="vn-box destaque">{{ fmtBase(m.c1) }}</div>
            <div class="vn-label-sub">C<sub>1</sub></div>
          </div>
          <div class="desafio-cell">
            <span class="seta">&gt;&gt;&gt;</span>
            <div class="vn-box destaque">{{ fmtBase(m.d1) }}</div>
            <div class="vn-label-sub">D<sub>1</sub></div>
          </div>
          <div class="realizacao-cell">
            <div :class="['vn-box', ehAtivo('r1') ? 'destaque' : '']">{{ fmtBase(m.realizacoes[0].vn) }}</div>
            <div class="vn-label-sub">R<sub>1</sub></div>
            <span class="seta-esq">&lt;&lt;&lt;</span>
            <span class="periodo-texto">00 / {{ m.realizacoes[0].fim }}</span>
          </div>
          <div class="especial-cell"></div>
        </div>

        <!-- LINHA 2: EU | MÉRITO | C2 >>> D2 | R2 (Legado) -->
        <div class="grid-linha">
          <div class="vn-cell">
            <div :class="['vn-box', corBox(m.eu, 'eu')]">{{ fmtBase(m.eu) }}</div>
            <div class="vn-label">EU</div>
          </div>
          <div class="vn-cell">
            <div :class="['vn-box', corBox(m.merito, 'merito')]">{{ fmtBase(m.merito) }}</div>
            <div class="vn-label">MÉRITO</div>
          </div>
          <div class="ciclo-cell">
            <span class="periodo-texto">29 / 56</span>
            <span class="seta">&gt;&gt;&gt;</span>
            <div class="vn-box destaque">{{ fmtBase(m.c2) }}</div>
            <div class="vn-label-sub">C<sub>2</sub></div>
          </div>
          <div class="desafio-cell">
            <span class="seta">&gt;&gt;&gt;</span>
            <div class="vn-box destaque">{{ fmtBase(m.d2) }}</div>
            <div class="vn-label-sub">D<sub>2</sub></div>
          </div>
          <div class="realizacao-cell">
            <div v-if="ehMestre(m.realizacoes[1].vn)" class="vn-superscript">{{ m.realizacoes[1].vn }}</div>
            <div :class="['vn-box', ehAtivo('r2') ? 'destaque' : '']">{{ fmtBase(m.realizacoes[1].vn) }}</div>
            <div class="vn-label-sub">R<sub>2</sub></div>
            <span class="seta-esq">&lt;&lt;&lt;</span>
            <span class="periodo-texto">{{ m.realizacoes[1].inicio }} / {{ m.realizacoes[1].fim }}</span>
          </div>
          <div class="especial-cell">
            <span v-if="m.legado?.length" class="badge-especial">Legado</span>
          </div>
        </div>

        <!-- Linha de Realização Espontânea (entre R2 e R3) -->
        <div class="grid-linha realizacao-espontanea-linha" v-if="m.realizacaoEspontanea?.length">
          <div class="vn-cell"></div>
          <div class="vn-cell"></div>
          <div class="ciclo-cell"></div>
          <div class="desafio-cell"></div>
          <div class="realizacao-cell"></div>
          <div class="especial-cell">
            <span class="badge-especial">Realização Espontânea</span>
          </div>
        </div>

        <!-- LINHA 3: EX | TRIBUTO | C3 >>> DM | R3 -->
        <div class="grid-linha">
          <div class="vn-cell">
            <div :class="['vn-box', corBox(m.ex, 'ex')]">{{ fmtBase(m.ex) }}</div>
            <div class="vn-label">EX</div>
          </div>
          <div class="vn-cell">
            <div :class="['vn-box', corBox(m.tributo, 'tributo')]">{{ fmtBase(m.tributo) }}</div>
            <div class="vn-label">TRIBUTO</div>
          </div>
          <div class="ciclo-cell">
            <span class="periodo-texto">+ 57</span>
            <span class="seta">&gt;&gt;&gt;</span>
            <div class="vn-box destaque">{{ fmtBase(m.c3) }}</div>
            <div class="vn-label-sub">C<sub>3</sub></div>
          </div>
          <div class="desafio-cell">
            <span class="seta">&gt;&gt;&gt;</span>
            <div class="vn-box dm-box">{{ fmtBase(m.dm) }}</div>
            <div class="vn-label-sub">DM</div>
          </div>
          <div class="realizacao-cell">
            <div :class="['vn-box', ehAtivo('r3') ? 'destaque' : '']">{{ fmtBase(m.realizacoes[2].vn) }}</div>
            <div class="vn-label-sub">R<sub>3</sub></div>
            <span class="seta-esq">&lt;&lt;&lt;</span>
            <span class="periodo-texto">{{ m.realizacoes[2].inicio }} / {{ m.realizacoes[2].fim }}</span>
          </div>
          <div class="especial-cell"></div>
        </div>

        <!-- LINHA 4: R4 -->
        <div class="grid-linha">
          <div class="vn-cell"></div>
          <div class="vn-cell"></div>
          <div class="ciclo-cell"></div>
          <div class="desafio-cell"></div>
          <div class="realizacao-cell">
            <div :class="['vn-box', ehAtivo('r4') ? 'destaque' : '']">{{ fmtBase(m.realizacoes[3].vn) }}</div>
            <div class="vn-label-sub">R<sub>4</sub></div>
            <span class="seta-esq">&lt;&lt;&lt;</span>
            <span class="periodo-texto">+ {{ m.realizacoes[3].inicio }}</span>
          </div>
          <div class="especial-cell">
            <span v-if="m.conquistaEspontanea?.length" class="badge-especial">Realização Espontânea</span>
          </div>
        </div>
      </div>

      <!-- === FRASES === -->
      <div class="secao-frases">
        <div class="frase-linha">
          <span class="frase-titulo">Frase Curta</span>
          <div class="frase-conteudo">{{ m.frases?.fraseCurta }}</div>
        </div>
        <div class="frase-linha">
          <span class="frase-titulo">Frase mais expandida</span>
          <div class="frase-conteudo">{{ m.frases?.fraseExpandida }}</div>
        </div>
        <div class="frase-linha">
          <span class="frase-titulo">Frase Final <small>(humana / ajuste fino)</small></span>
          <div class="frase-conteudo frase-vazia">&nbsp;</div>
        </div>
      </div>

      <!-- === AP ATUAL + LINHA DE ANOS AP9 === -->
      <div class="secao-ap-atual">
        <div class="ap-atual-linha">
          <div class="ap-box-grande">
            <span class="ap-label">AP</span>
            <div class="vn-box destaque grande">{{ fmtBase(apAtual.ap) }}</div>
          </div>
          <div class="ap-periodo-texto">
            {{ periodoAPAtual }}
          </div>
        </div>

        <div class="linha-anos-ap9">
          <span v-for="(item, i) in m.anosAP9" :key="item.ano" class="ano-ap9">
            {{ item.ano }} ({{ item.idade }}a.)
            <span v-if="i < m.anosAP9.length - 1"> &gt; </span>
          </span>
        </div>
      </div>

    </div><!-- fim folha 1 -->

    <!-- ============================================================
         FOLHA 2 — Tabela de Duplicidades + Percentuais
    ============================================================ -->
    <div class="folha folha-quebra">

      <!-- === TABELA DE DUPLICIDADES POR IDADE === -->
      <div class="secao-dup-titulo">
        <span v-if="vnComMaisDup" class="dup-badge">Dup {{ vnComMaisDup }}</span>
      </div>
      <div class="tabela-dup-wrapper">
        <div class="tabela-dup" v-if="idadesTabela.length">
          <!-- Navegação -->
          <div class="dup-nav">
            <button @click="offsetDup = Math.max(0, offsetDup - 14)" class="dup-nav-btn">&lt;</button>
            <span class="dup-nav-label">idades {{ idadesVisiveis[0] }} a {{ idadesVisiveis[idadesVisiveis.length-1] }}</span>
            <button @click="offsetDup = Math.min(idadesTabela.length - 14, offsetDup + 14)" class="dup-nav-btn">&gt;&gt;</button>
          </div>

          <!-- Linha de idades -->
          <div class="dup-linha-header">
            <div class="dup-cell-label"></div>
            <div v-for="idade in idadesVisiveis" :key="idade" class="dup-cell-idade">
              {{ idade }}
            </div>
          </div>

          <!-- Linha de status global (D/T/Qd/Qt) -->
          <div class="dup-linha-status">
            <div class="dup-cell-label dup-cell-label-sm"></div>
            <div v-for="idade in idadesVisiveis" :key="idade" class="dup-cell-status">
              <span v-if="statusGlobal(idade)" :class="['dup-badge-cell', tipoCor(statusGlobal(idade))]">
                {{ statusGlobal(idade) }}
              </span>
            </div>
          </div>

          <!-- Uma linha por VN (1-9) -->
          <div v-for="vn in [1,2,3,4,5,6,7,8,9]" :key="vn" class="dup-linha-vn">
            <div class="dup-cell-label">{{ String(vn).padStart(2,'0') }}</div>
            <div v-for="idade in idadesVisiveis" :key="idade" class="dup-cell-vn">
              <span v-if="m.dupPorIdade[idade]?.[vn]"
                :class="['dup-badge-cell', tipoCor(m.dupPorIdade[idade][vn].tipo)]">
                {{ m.dupPorIdade[idade][vn].tipo }}
              </span>
              <span v-else class="dup-num">{{ String(vn).padStart(2,'0') }}</span>
            </div>
          </div>

        </div>
      </div>

      <!-- === PERCENTUAIS POR CICLO === -->
      <div class="secao-percentuais">
        <table class="tabela-pct">
          <thead>
            <tr>
              <th class="pct-th-label"></th>
              <th class="pct-th">Total</th>
              <th class="pct-th">1º. Ciclo:</th>
              <th class="pct-th">2º. Ciclo:</th>
              <th class="pct-th">3º. Ciclo:</th>
              <th class="pct-th-obs"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="pct-td-label">Racional <span class="pct-dots">........................................</span></td>
              <td class="pct-td">{{ m.percentuaisCiclo?.total?.razao }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c1?.razao }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c2?.razao }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c3?.razao }}%</td>
              <td class="pct-td-obs"></td>
            </tr>
            <tr>
              <td class="pct-td-label">Emocional <span class="pct-dots">.......................................</span></td>
              <td class="pct-td">{{ m.percentuaisCiclo?.total?.emocao }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c1?.emocao }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c2?.emocao }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c3?.emocao }}%</td>
              <td class="pct-td-obs"></td>
            </tr>

            <tr class="pct-spacer"><td colspan="6"></td></tr>

            <tr>
              <td class="pct-td-label">Espiritual <span class="pct-dots">......................................</span></td>
              <td class="pct-td">{{ m.percentuaisCiclo?.total?.espiritual }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c1?.espiritual }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c2?.espiritual }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c3?.espiritual }}%</td>
              <td class="pct-td-obs"></td>
            </tr>
            <tr>
              <td class="pct-td-label pct-td-indent">Possuir <span class="pct-dots">.............</span></td>
              <td class="pct-td">{{ m.percentuaisCiclo?.total?.possuir }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c1?.possuir }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c2?.possuir }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c3?.possuir }}%</td>
              <td class="pct-td-obs"></td>
            </tr>
            <tr>
              <td class="pct-td-label pct-td-indent">Compartilhar <span class="pct-dots">.........</span></td>
              <td class="pct-td">{{ m.percentuaisCiclo?.total?.compartilhar }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c1?.compartilhar }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c2?.compartilhar }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c3?.compartilhar }}%</td>
              <td class="pct-td-obs"></td>
            </tr>
            <tr>
              <td class="pct-td-label pct-td-indent">Vivenciar <span class="pct-dots">............</span></td>
              <td class="pct-td">{{ m.percentuaisCiclo?.total?.vivenciar }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c1?.vivenciar }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c2?.vivenciar }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c3?.vivenciar }}%</td>
              <td class="pct-td-obs"></td>
            </tr>

            <tr class="pct-spacer"><td colspan="6"></td></tr>

            <tr>
              <td class="pct-td-label">Intensa <span class="pct-dots">...................................</span></td>
              <td class="pct-td">{{ m.percentuaisCiclo?.total?.intensa }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c1?.intensa }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c2?.intensa }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c3?.intensa }}%</td>
              <td class="pct-td-obs"></td>
            </tr>
            <tr>
              <td class="pct-td-label">Média <span class="pct-dots">.....................................</span></td>
              <td class="pct-td">{{ m.percentuaisCiclo?.total?.media }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c1?.media }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c2?.media }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c3?.media }}%</td>
              <td class="pct-td-obs"></td>
            </tr>
            <tr>
              <td class="pct-td-label">Fraca <span class="pct-dots">.....................................</span></td>
              <td class="pct-td">{{ m.percentuaisCiclo?.total?.fraca }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c1?.fraca }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c2?.fraca }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c3?.fraca }}%</td>
              <td class="pct-td-obs"></td>
            </tr>

            <tr class="pct-spacer"><td colspan="6"></td></tr>

            <tr>
              <td class="pct-td-label">Agressividade <span class="pct-dots">.........................</span></td>
              <td class="pct-td">{{ m.percentuaisCiclo?.total?.agressividade }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c1?.agressividade }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c2?.agressividade }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c3?.agressividade }}%</td>
              <td class="pct-td-obs"></td>
            </tr>
            <tr>
              <td class="pct-td-label">Insegurança / Instabilidade: <span class="pct-dots">...</span></td>
              <td class="pct-td">{{ m.percentuaisCiclo?.total?.inseguranca }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c1?.inseguranca }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c2?.inseguranca }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c3?.inseguranca }}%</td>
              <td class="pct-td-obs"></td>
            </tr>
            <tr>
              <td class="pct-td-label">Dependência <span class="pct-dots">.................................</span></td>
              <td class="pct-td">{{ m.percentuaisCiclo?.total?.dependencia }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c1?.dependencia }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c2?.dependencia }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c3?.dependencia }}%</td>
              <td class="pct-td-obs"></td>
            </tr>

            <tr class="pct-linha-cp">
              <td class="pct-td-label pct-label-cp">CP</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.total?.cp }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c1?.cp }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c2?.cp }}%</td>
              <td class="pct-td">{{ m.percentuaisCiclo?.c3?.cp }}%</td>
              <td class="pct-td-obs"></td>
            </tr>
          </tbody>
        </table>
      </div>

    </div><!-- fim folha 2 -->

    <!-- ============================================================
         FOLHA 3 — Multi-Ano AP (Anterior, Atual, Próximo)
    ============================================================ -->
    <div class="folha folha-quebra">
      <div v-for="(anoData, idx) in m.multiAnoAP" :key="anoData.ano" class="bloco-ano-ap">

        <div class="bloco-ano-lateral">
          <span class="label-periodo">{{ anoData.label }}</span>
        </div>

        <div class="bloco-ano-conteudo">
          <!-- AP block (canto superior esquerdo) -->
          <div class="ap-ano-header">
            <div class="ap-ano-codigo">
              <div class="ap-codigo-letras">
                <span>A</span><span>N</span><span>T</span>
              </div>
              <div class="ap-ano-numero">{{ anoData.ano }}</div>
              <div class="vn-box" :class="idx === 1 ? 'destaque-preto' : ''">{{ fmtBase(anoData.ap) }}</div>
            </div>

            <!-- CTs com datas -->
            <div class="cts-lista">
              <div v-for="(ct, qi) in [anoData.cts.ct1, anoData.cts.ct2, anoData.cts.ct3, anoData.cts.ct4]"
                   :key="qi" class="ct-item">
                <div class="ct-label">CT<sub>{{ qi+1 }}</sub>:</div>
                <div :class="['vn-box ct-box', idx === 1 ? 'destaque-preto' : '']">
                  {{ String(ct).padStart(2,'0') }}
                </div>
                <div class="ct-periodo">
                  {{ anoData.periodosCT[qi]?.inicio }} à {{ anoData.periodosCT[qi]?.fim }}
                </div>
              </div>
            </div>

            <!-- Valores mensais -->
            <div class="mensais-lista">
              <div v-for="mes in anoData.mensais" :key="mes.mesNum" class="mensal-item">
                <span class="mensal-nome">{{ mes.mes }}</span>
                <span class="mensal-sep">=</span>
                <span class="mensal-valor">{{ String(mes.valor).padStart(2,'0') }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bloco-ano-ano-vert">
          <span class="ano-vertical">{{ anoData.ano }}</span>
        </div>

      </div>
    </div><!-- fim folha 3 -->

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMapaStore } from '../stores/mapa.js'
import { useHistoricoStore } from '../stores/historico.js'

const store = useMapaStore()
const historico = useHistoricoStore()
const router = useRouter()
const mapaRef = ref(null)
const offsetDup = ref(20)

const m = computed(() => store.mapa)

// Data de geração formatada
const dataGerado = computed(() => {
  const agora = new Date()
  return agora.toLocaleDateString('pt-BR') + ' ' + agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' ' +
    (agora.getHours() < 12 ? 'AM' : 'PM')
})

// AP do ano atual
const apAtual = computed(() => {
  return m.value?.multiAnoAP?.[1] ?? { ap: 0, periodosCT: [] }
})

// Texto do período do AP atual
const periodoAPAtual = computed(() => {
  if (!apAtual.value?.periodosCT?.length) return ''
  const inicio = apAtual.value.periodosCT[0]?.inicio ?? ''
  const fim = apAtual.value.periodosCT[3]?.fim ?? ''
  return `${inicio} à ${fim}`
})

// Formata VN como string com zero à esquerda
function fmtBase(vn) {
  if (!vn && vn !== 0) return '00'
  const base = vn === 11 ? 2 : vn === 22 ? 4 : vn
  return String(base).padStart(2, '0')
}

// Formata VN mostrando a barra para mestres (ex: 11/2)
function fmtSlash(vn) {
  if (vn === 11) return '11/2'
  if (vn === 22) return '22/4'
  return String(vn).padStart(2, '0')
}

// Formata VN completo (inclui valor mestre se existir)
function fmt(vn) {
  return String(vn === 11 ? 2 : vn === 22 ? 4 : vn).padStart(2, '0')
}

function ehMestre(vn) {
  return vn === 11 || vn === 22
}

// Retorna classe de cor para box baseado em duplicidades
function corBox(vn, posicao) {
  if (!m.value?.duplicidades) return ''
  const base = vn === 11 ? 2 : vn === 22 ? 4 : vn
  const dup = m.value.duplicidades.find(d => {
    const db = d.vn === 11 ? 2 : d.vn === 22 ? 4 : d.vn
    return db === base
  })
  if (dup) return 'destaque'
  return ''
}

// Verifica se a realizacao está ativa na idade atual
function ehAtivo(qual) {
  if (!m.value?.realizacoes) return false
  const idade = m.value.idade
  const r = m.value.realizacoes
  if (qual === 'r1') return idade <= r[0].fim
  if (qual === 'r2') return idade >= r[1].inicio && (r[1].fim === null || idade <= r[1].fim)
  if (qual === 'r3') return idade >= r[2].inicio && (r[2].fim === null || idade <= r[2].fim)
  if (qual === 'r4') return idade >= r[3].inicio
  return false
}

// Tabela de duplicidades: idades disponíveis
const idadesTabela = computed(() => {
  return Array.from({ length: 81 }, (_, i) => i)
})

const idadesVisiveis = computed(() => {
  return idadesTabela.value.slice(offsetDup.value, offsetDup.value + 29)
})

// VN que mais aparece em duplicidade (para mostrar no título)
const vnComMaisDup = computed(() => {
  if (!m.value?.duplicidades?.length) return null
  const t = [...m.value.duplicidades].sort((a, b) => b.quantidade - a.quantidade)
  return t[0]?.vn === 11 ? 2 : t[0]?.vn === 22 ? 4 : t[0]?.vn
})

// Status global de duplicidade em uma idade (maior tipo)
function statusGlobal(idade) {
  const dup = m.value?.dupPorIdade?.[idade]
  if (!dup || Object.keys(dup).length === 0) return null
  const tipos = Object.values(dup).map(d => d.tipo)
  if (tipos.includes('Qt')) return 'Qt'
  if (tipos.includes('Qd')) return 'Qd'
  if (tipos.includes('T')) return 'T'
  if (tipos.includes('D')) return 'D'
  return null
}

function tipoCor(tipo) {
  if (tipo === 'T' || tipo === 'Qt' || tipo === 'Qd') return 'badge-t'
  return 'badge-d'
}

function salvar() {
  historico.salvar(store.nome, store.dia, store.mes, store.ano, store.mapa)
  alert('Salvo no histórico.')
}

function imprimir() {
  window.print()
}
</script>

<style scoped>
/* ============================================================
   WRAPPER GERAL
============================================================ */
.mapa-wrapper {
  font-family: 'Arial', sans-serif;
  font-size: 11px;
  background: #f5f5f0;
  color: #111;
}

.folha {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  background: white;
  padding: 0;
  border: 1px solid #ccc;
  margin-bottom: 16px;
}

.folha-quebra {
  page-break-before: always;
}

/* ============================================================
   CABEÇALHO ESCURO
============================================================ */
.cabecalho {
  background: #1c2a3a;
  color: white;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 10px;
}

.cab-esquerda {
  flex: 1;
}

.cab-linha {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 2px;
  flex-wrap: wrap;
}

.cab-label {
  color: #aaa;
  font-size: 10px;
}

.cab-label.ml {
  margin-left: 10px;
}

.cab-campo {
  background: white;
  color: #111;
  padding: 1px 6px;
  min-width: 32px;
  text-align: center;
  font-weight: bold;
  font-size: 11px;
  border: 1px solid #555;
}

.cab-valor {
  color: white;
  font-size: 11px;
}

.nome-valor {
  font-size: 13px;
  font-weight: bold;
  background: white;
  color: #111;
  padding: 1px 8px;
  flex: 1;
}

.cab-piramide {
  display: flex;
  align-items: center;
  justify-content: center;
}

.cab-acoes {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.btn-acao {
  background: #2d4a6a;
  color: white;
  border: 1px solid #4a6a8a;
  padding: 2px 8px;
  font-size: 10px;
  cursor: pointer;
  text-decoration: none;
  display: block;
  text-align: center;
}

.btn-acao:hover {
  background: #3a5a7a;
}

/* ============================================================
   GRID DE NÚMEROS
============================================================ */
.grid-numeros {
  border-top: 2px solid #ccc;
  padding: 6px 8px;
}

.col-headers {
  display: grid;
  grid-template-columns: 72px 72px 1fr 1fr 1fr 100px;
  margin-bottom: 4px;
}

.ch-vazio {}

.ch-tag {
  background: #1c2a3a;
  color: white;
  text-align: center;
  padding: 1px 4px;
  font-size: 10px;
  font-weight: bold;
  margin: 0 2px;
}

.grid-linha {
  display: grid;
  grid-template-columns: 72px 72px 1fr 1fr 1fr 100px;
  align-items: center;
  min-height: 54px;
  border-bottom: 1px solid #eee;
}

.realizacao-espontanea-linha {
  min-height: 20px;
  border-bottom: none;
}

/* Células individuais */
.vn-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 2px;
  position: relative;
}

.vn-superscript {
  font-size: 9px;
  color: #555;
  line-height: 1;
  margin-bottom: 1px;
}

.vn-box {
  width: 34px;
  height: 30px;
  border: 1.5px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  background: white;
}

.vn-box.destaque {
  background: #d4873a;
  color: white;
  border-color: #b36820;
}

.vn-box.destaque-preto {
  background: #1c2a3a;
  color: white;
  border-color: #0a1520;
}

.vn-box.dm-box {
  background: #1c2a3a;
  color: white;
  border-color: #0a1520;
}

.vn-box.grande {
  width: 44px;
  height: 38px;
  font-size: 18px;
}

.vn-label {
  font-size: 9px;
  color: #444;
  margin-top: 2px;
  text-align: center;
}

.vn-label-sub {
  font-size: 9px;
  color: #444;
  line-height: 1;
}

/* Células de ciclo, desafio e realização */
.ciclo-cell,
.desafio-cell,
.realizacao-cell {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 4px 2px;
  flex-wrap: wrap;
}

.seta {
  font-size: 9px;
  color: #666;
}

.seta-esq {
  font-size: 9px;
  color: #666;
}

.periodo-texto {
  font-size: 9px;
  color: #555;
  white-space: nowrap;
}

/* Especiais (Legado, Realização Espontânea) */
.especial-cell {
  display: flex;
  align-items: center;
  padding: 0 4px;
}

.badge-especial {
  font-size: 9px;
  color: #333;
  white-space: nowrap;
  border-top: 1px solid #333;
  padding-top: 2px;
}

/* ============================================================
   FRASES
============================================================ */
.secao-frases {
  border-top: 2px solid #aaa;
  padding: 6px 10px;
}

.frase-linha {
  margin-bottom: 6px;
}

.frase-titulo {
  font-weight: bold;
  font-size: 10px;
  color: #111;
  display: block;
  margin-bottom: 2px;
}

.frase-titulo small {
  font-weight: normal;
  color: #666;
}

.frase-conteudo {
  background: #f8e8c8;
  border: 1px solid #ccc;
  padding: 4px 8px;
  font-size: 11px;
  min-height: 22px;
}

.frase-vazia {
  background: white;
  min-height: 28px;
}

/* ============================================================
   AP ATUAL + LINHA DE ANOS AP9
============================================================ */
.secao-ap-atual {
  border-top: 1px solid #ccc;
  padding: 6px 10px;
}

.ap-atual-linha {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 6px;
}

.ap-box-grande {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ap-label {
  font-size: 10px;
  color: #666;
}

.ap-periodo-texto {
  font-size: 11px;
  color: #333;
}

.linha-anos-ap9 {
  font-size: 10px;
  color: #333;
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}

.ano-ap9 {
  white-space: nowrap;
}

/* ============================================================
   TABELA DE DUPLICIDADES
============================================================ */
.secao-dup-titulo {
  padding: 6px 10px;
  border-top: 2px solid #ccc;
}

.dup-badge {
  font-size: 11px;
  font-weight: bold;
  background: #1c2a3a;
  color: white;
  padding: 2px 8px;
}

.tabela-dup-wrapper {
  overflow-x: auto;
  padding: 0 6px;
}

.tabela-dup {
  min-width: 600px;
}

.dup-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  font-size: 10px;
}

.dup-nav-btn {
  background: #1c2a3a;
  color: white;
  border: none;
  padding: 1px 6px;
  cursor: pointer;
  font-size: 11px;
}

.dup-nav-label {
  color: #555;
}

.dup-linha-header,
.dup-linha-status,
.dup-linha-vn {
  display: flex;
  align-items: center;
}

.dup-cell-label {
  width: 24px;
  font-size: 9px;
  font-weight: bold;
  color: #333;
  text-align: right;
  padding-right: 4px;
  flex-shrink: 0;
}

.dup-cell-label-sm {
  font-size: 8px;
}

.dup-cell-idade {
  width: 24px;
  text-align: center;
  font-size: 9px;
  color: #444;
  flex-shrink: 0;
  padding: 1px;
}

.dup-cell-status {
  width: 24px;
  text-align: center;
  flex-shrink: 0;
  padding: 1px;
}

.dup-cell-vn {
  width: 24px;
  text-align: center;
  font-size: 8px;
  color: #999;
  flex-shrink: 0;
  padding: 1px;
}

.dup-num {
  font-size: 8px;
  color: #bbb;
}

.dup-badge-cell {
  display: inline-block;
  font-size: 8px;
  font-weight: bold;
  padding: 0 2px;
}

.badge-d {
  background: #d4873a;
  color: white;
}

.badge-t {
  background: #1c2a3a;
  color: white;
}

/* ============================================================
   PERCENTUAIS POR CICLO
============================================================ */
.secao-percentuais {
  padding: 8px 16px;
  border-top: 2px solid #ccc;
}

.tabela-pct {
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
}

.pct-th-label {
  text-align: left;
  width: 260px;
  padding: 2px 0;
}

.pct-th {
  text-align: center;
  font-size: 10px;
  color: #333;
  padding: 2px 4px;
  width: 70px;
}

.pct-th-obs {
  width: 80px;
}

.pct-td-label {
  font-size: 11px;
  color: #222;
  padding: 1px 0;
}

.pct-td-indent {
  padding-left: 16px;
}

.pct-dots {
  color: #aaa;
  font-size: 9px;
}

.pct-td {
  text-align: center;
  font-size: 11px;
  color: #333;
}

.pct-td-obs {
  border-left: 1px solid #ccc;
}

.pct-spacer td {
  height: 8px;
}

.pct-linha-cp td {
  border-top: 1.5px solid #333;
  padding-top: 2px;
}

.pct-label-cp {
  font-weight: bold;
  font-size: 10px;
  padding-left: 120px;
}

/* ============================================================
   MULTI-ANO AP (Anterior, Atual, Próximo)
============================================================ */
.bloco-ano-ap {
  display: flex;
  border: 1px solid #333;
  margin: 8px;
  min-height: 120px;
}

.bloco-ano-lateral {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  background: #1c2a3a;
  color: white;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px 3px;
  width: 22px;
  letter-spacing: 1px;
}

.label-periodo {
  white-space: nowrap;
}

.bloco-ano-conteudo {
  flex: 1;
  padding: 6px 8px;
}

.ap-ano-header {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.ap-ano-codigo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  min-width: 60px;
}

.ap-codigo-letras {
  display: flex;
  gap: 2px;
  font-size: 9px;
  color: #555;
  font-weight: bold;
}

.ap-ano-numero {
  font-size: 13px;
  font-weight: bold;
  color: #111;
}

.cts-lista {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.ct-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ct-label {
  font-size: 10px;
  font-weight: bold;
  color: #333;
  min-width: 28px;
}

.ct-box {
  width: 32px;
  height: 26px;
  font-size: 12px;
}

.ct-periodo {
  font-size: 9px;
  color: #555;
}

.mensais-lista {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px 8px;
  font-size: 10px;
}

.mensal-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.mensal-nome {
  width: 32px;
  color: #333;
}

.mensal-sep {
  color: #999;
}

.mensal-valor {
  font-weight: bold;
  color: #111;
}

.bloco-ano-ano-vert {
  writing-mode: vertical-rl;
  background: white;
  border-left: 1px solid #333;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  font-size: 11px;
  color: #333;
}

.ano-vertical {
  transform: rotate(180deg);
  font-weight: bold;
}

/* ============================================================
   PRINT
============================================================ */
@media print {
  .btn-acao, .cab-acoes, .dup-nav-btn {
    display: none !important;
  }
  .folha {
    border: none;
    margin: 0;
    page-break-after: always;
  }
}
</style>
