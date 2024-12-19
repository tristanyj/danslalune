<script setup lang="ts">
defineProps<{
  value: string;
  holder: string;
}>();
</script>

<template>
  <div class="rounded-b-md px-2 py-2">
    <div class="uppercase text-xs opacity-60">Nba Record</div>
    <div class="flex text-sm">
      <span class="">{{ value }}</span>
      <span class="mx-1">:</span>
      <span>{{ holder }}</span>
    </div>
  </div>
</template>
