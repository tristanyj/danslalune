<script setup lang="ts">
import dataset from '@/assets/data/dataset.json';
import type { Category, Player } from './types';

const playerConfigStore = usePlayerConfigStore();
const { setPlayers } = playerConfigStore;

const statConfigStore = useStatConfigStore();
const { setCategories } = statConfigStore;

onMounted(() => {
  setCategories(dataset.config.categories as unknown as Category[]);
  setPlayers(dataset.players as unknown as Player[]);
});
</script>

<template>
  <main>
    <NuxtLoadingIndicator />
    <NuxtRouteAnnouncer />
    <NuxtPage />
  </main>
</template>
