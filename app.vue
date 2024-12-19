<script setup lang="ts">
import dataset from '@/assets/data/dataset.json';
import type { Day } from './types';

const configStore = useConfigStore();
const { setDays } = configStore;

onMounted(() => {
  setDays(dataset.days as unknown as Day[]);
});
</script>

<template>
  <main>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </main>
</template>
