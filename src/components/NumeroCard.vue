<template>
  <div
    :class="[
      'rounded-lg font-light text-stone-800 border border-stone-200 bg-white flex items-center justify-center leading-none',
      tamanhoClass,
      eMestre ? 'border-amber-300 bg-amber-50 text-amber-800' : '',
    ]"
  >
    {{ display }}
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

const display = computed(() => {
  if (props.vn === 11) return '11/2'
  if (props.vn === 22) return '22/4'
  return props.vn
})

const tamanhoClass = computed(() => {
  if (eMestre.value) {
    return props.tamanho === 'grande' ? 'w-20 h-14 text-xl' :
           props.tamanho === 'medio' ? 'w-16 h-10 text-base' :
           'w-14 h-8 text-sm'
  }
  return props.tamanho === 'grande' ? 'w-14 h-14 text-2xl' :
         props.tamanho === 'medio' ? 'w-10 h-10 text-lg' :
         'w-8 h-8 text-sm'
})
</script>
