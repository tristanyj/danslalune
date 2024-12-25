<script setup lang="ts">
import type { CategoryKey } from '~/types';

const configStore = useConfigStore();
const { selectedCategory } = storeToRefs(configStore);
const { setCategory } = configStore;

interface Category {
  name: CategoryKey;
  title: string;
}

const categories: Category[] = [
  {
    name: 'velage',
    title: 'velages',
  },
  {
    name: 'matrice',
    title: 'matrice',
  },
  {
    name: 'veau_perf',
    title: 'veau perf',
  },
];
</script>

<template>
  <div class="grid grid-flow-col justify-center items-center gap-3 py-10">
    <button
      v-for="category in categories"
      :key="category.name"
      class="border p-1 rounded-xl"
      :class="{
        'bg-gray-200': selectedCategory === category.name,
      }"
      @click="setCategory(category.name)"
    >
      {{ category.title }}
    </button>
  </div>
</template>
