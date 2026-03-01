<template>
  <div class="bg-white rounded-2xl border border-stone-200 shadow-sm mb-4 overflow-hidden">
    <button
      @click="aberto = !aberto"
      class="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-stone-50 transition"
    >
      <span class="text-sm font-medium text-stone-700 uppercase tracking-wider">{{ titulo }}</span>
      <span class="text-stone-400 text-lg leading-none">{{ aberto ? '−' : '+' }}</span>
    </button>
    <div v-show="aberto" class="px-6 pb-6 pt-2 border-t border-stone-100">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  titulo: String,
  aberto: {
    type: Boolean,
    default: false,
  },
})

const aberto = ref(props.aberto)
</script>
