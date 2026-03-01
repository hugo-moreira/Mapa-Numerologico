<template>
  <div
    :class="[
      'rounded-lg font-light text-stone-800 border border-stone-200 bg-white flex items-center justify-center leading-none',
      tamanho === 'grande' ? 'w-14 h-14 text-2xl' : tamanho === 'medio' ? 'w-10 h-10 text-lg' : 'w-8 h-8 text-sm',
      eMestre ? 'border-amber-300 bg-amber-50 text-amber-800' : '',
    ]"
  >
    {{ vn }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  vn: Number,
  tamanho: {
    type: String,
    default: 'medio',
  },
})

const eMestre = computed(() => props.vn === 11 || props.vn === 22)
</script>
