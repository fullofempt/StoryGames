<script setup lang="ts">
import { ref } from 'vue';

const current = ref('RU');
</script>

<template>
  <button
    class="inline-flex items-center gap-2 text-sm uppercase tracking-wide text-white/90 hover:text-white"
    type="button"
  >
    <span>{{ current }}</span>
    <span class="text-xs">▼</span>
  </button>
</template>