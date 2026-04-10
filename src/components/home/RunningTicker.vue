<script setup lang="ts">
const text =
  'FRACTURED RED. Принимая во внимание повышенный уровень общественного интереса к делу о Марсианском Разломе • STORY GAMES • INDIE DEV STUDIO •';
</script>

<template>
  <section class="relative overflow-hidden border-y border-cyan-300/40 bg-[#EED200]">
    <div class="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 bg-[#00A8CE] blur-xl"></div>
    <div class="relative bg-[#00A8CE] py-2">
      <div class="ticker whitespace-nowrap font-orbitron text-lg uppercase text-white md:text-2xl">
        <span class="mx-6">{{ text }}</span>
        <span class="mx-6">{{ text }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ticker {
  display: inline-block;
  min-width: 200%;
  animation: ticker 24s linear infinite;
}
@keyframes ticker {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>