<script setup lang="ts">
import type { CategoryKey } from '~/types';

const configStore = useConfigStore();
const { selectedCategory, colors } = storeToRefs(configStore);
const { setCategory } = configStore;

interface Category {
  name: CategoryKey;
  title: string;
  description: string;
  color: string;
}

const categories = computed<Category[]>(() => {
  if (!colors?.value) return [];

  return [
    {
      name: 'velage',
      title: 'Vêlages',
      description: 'Le vêlage est la mise bas chez les vaches.',
      color: colors.value.velage,
    },
    {
      name: 'matrice',
      title: 'Matrices',
      description: "Intervention ou examen lié à l'utérus de la vache.",
      color: colors.value.matrice,
    },
    {
      name: 'veau_perf',
      title: 'Perfusions de veau',
      description: 'Liquide administré dans la circulation sanguine du veau.',
      color: colors.value.veau_perf,
    },
  ];
});
</script>

<template>
  <div class="flex justify-center text-sm">
    <div
      class="grid xl:grid-flow-col justify-center items-center gap-2 p-2 border border-gray-950 border-opacity-20 rounded-md"
    >
      <button
        v-for="category in categories"
        :key="category.name"
        class="grid gap-1 justify-center border border-gray-950 p-2 rounded-md transition-all duration-100"
        :class="{
          'bg-primary-50/20 border-primary': selectedCategory === category.name,
          'bg-white opacity-75': selectedCategory !== category.name,
        }"
        @click="setCategory(category.name)"
      >
        <div class="flex justify-center mb-1">
          <div
            class="w-6 h-2 rounded-full"
            :style="{
              backgroundColor: category.color,
            }"
          />
        </div>
        <div class="font-semibold leading-tight">
          {{ category.title }}
        </div>
        <p class="max-w-56 px-1">{{ category.description }}</p>
      </button>
    </div>
  </div>
</template>
