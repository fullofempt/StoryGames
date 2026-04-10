<script setup lang="ts">
const text =
  'FRACTURED RED. Принимая во внимание повышенный уровень общественного интереса к делу о Марсианском Разломе • STORY GAMES • INDIE DEV STUDIO •';
</script>

<template>
  <section class="relative overflow-hidden border-y border-cyan-300/40 bg-[#EED200]">
    <div class="absolute inset-x-0 top-1/2 h-16 -translate-y-1/2 bg-[#00A8CE] blur-xl"></div>
    <div class="relative bg-[#00A8CE]">
      <div class="ticker-wrap flex items-center justify-center overflow-hidden">
        <div class="ticker font-space whitespace-nowrap text-[20px] mb-2 text-white md:text-2xl">
          <span class="mx-3">{{ text }}</span>
          <span class="mx-3">{{ text }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.ticker-wrap {
  width: 100%;
}

.ticker {
  display: inline-flex;
  align-items: center;
  min-width: max-content;
  animation: ticker 24s linear infinite;
}

@keyframes ticker {
  0% {
    transform: translateX(25%);
  }
  100% {
    transform: translateX(-25%);
  }
}
</style>