/**
 * @module stores/historico
 * @description Store Pinia para o historico de clientes.
 *
 * Persiste os mapas calculados no localStorage do navegador, permitindo
 * ao numerologista reabrir mapas de clientes anteriores sem recalcular.
 *
 * Limite de armazenamento: ~5MB no localStorage. Cada mapa ocupa ~5-10KB.
 * Capacidade estimada: 500-1000 clientes.
 */

import { defineStore } from 'pinia'
import { ref } from 'vue'

const CHAVE_STORAGE = 'mapa-numerologico-historico'

export const useHistoricoStore = defineStore('historico', () => {
  /**
   * Lista de registros salvos. Cada registro contem:
   * - id: string (timestamp)
   * - nome: string
   * - dataNascimento: string (DD/MM/AAAA)
   * - dataCalculo: string (ISO)
   * - mapa: objeto completo retornado pelo store de mapa
   * @type {import('vue').Ref<Array>}
   */
  const registros = ref([])

  function carregar() {
    try {
      const dados = localStorage.getItem(CHAVE_STORAGE)
      registros.value = dados ? JSON.parse(dados) : []
    } catch {
      registros.value = []
    }
  }

  function salvar(nome, dia, mes, ano, mapaCompleto) {
    const registro = {
      id: Date.now().toString(),
      nome,
      dataNascimento: `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`,
      dataCalculo: new Date().toISOString(),
      mapa: mapaCompleto,
    }
    registros.value.unshift(registro)
    _persistir()
    return registro.id
  }

  function remover(id) {
    registros.value = registros.value.filter((r) => r.id !== id)
    _persistir()
  }

  function buscar(termoBusca) {
    const termo = termoBusca.toLowerCase()
    return registros.value.filter(
      (r) =>
        r.nome.toLowerCase().includes(termo) ||
        r.dataNascimento.includes(termo)
    )
  }

  function _persistir() {
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(registros.value))
    } catch {
      console.warn('Historico: espaco de armazenamento esgotado.')
    }
  }

  carregar()

  return { registros, salvar, remover, buscar, carregar }
})
