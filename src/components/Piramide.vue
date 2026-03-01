<template>
  <div class="space-y-4">
    <!-- Visual da piramide -->
    <div class="flex flex-col items-center gap-2 py-4">
      <div class="flex flex-col items-center">
        <p class="text-xs text-stone-400 uppercase tracking-wider mb-1">CD</p>
        <NumeroCard :vn="cd" tamanho="grande" />
      </div>
      <div class="w-px h-6 bg-stone-300"></div>
      <div class="flex gap-16 items-center">
        <div class="flex flex-col items-center">
          <p class="text-xs text-stone-400 uppercase tracking-wider mb-1">MO</p>
          <NumeroCard :vn="mo" tamanho="grande" />
        </div>
        <div class="w-12 h-px bg-stone-300"></div>
        <div class="flex flex-col items-center">
          <p class="text-xs text-stone-400 uppercase tracking-wider mb-1">DM</p>
          <NumeroCard :vn="dm" tamanho="grande" />
        </div>
      </div>
      <div class="w-px h-4 bg-stone-300"></div>
      <div class="flex flex-col items-center">
        <p class="text-xs text-stone-400 uppercase tracking-wider mb-1">EU</p>
        <NumeroCard :vn="eu" tamanho="medio" />
      </div>
    </div>

    <!-- Texto corrido -->
    <div class="bg-stone-50 rounded-xl p-4 space-y-2">
      <p class="text-sm text-stone-700">{{ piramide.textoCD }}</p>
      <p class="text-sm text-stone-700">{{ piramide.textoMO }}</p>
      <p class="text-sm text-stone-700">{{ piramide.textoDM }}</p>
      <p class="text-sm text-stone-500 italic">{{ piramide.textoEU }}</p>
    </div>
  </div>
</template>

<script setup>
import NumeroCard from './NumeroCard.vue'

defineProps({
  mo: Number,
  cd: Number,
  dm: Number,
  eu: Number,
  piramide: Object,
})
</script>
