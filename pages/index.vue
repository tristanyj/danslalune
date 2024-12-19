<script setup lang="ts">
useHead({ title: 'Vache — Projet' });

const configStore = useConfigStore();
const { isLoaded } = storeToRefs(configStore);
</script>

<template>
  <div class="grid content">
    <div class="relative">
      <div class="relative px-4">
        <UiChart v-if="isLoaded" />
        <div
          v-else
          class="relative max-w-[1400px] w-full mx-auto"
        >
          <div class="pb-[100%]" />
          <div class="absolute inset-0 animate-pulse rounded-full bg-gray-100 opacity-20" />
        </div>
      </div>
    </div>
  </div>
</template>
