<script setup lang="ts">
defineProps<{
  category: {
    name: string;
    color: `#${string}`;
  };
  subCategory: {
    name: string;
  };
  stat?: {
    name: string;
    description: string | null;
  };
}>();
</script>

<template>
  <div
    class="pb-1 p-2"
    :style="{ background: `${category.color}1A` }"
  >
    <div class="flex gap-1 mb-1 text-sm">
      <div
        class="px-1"
        :style="{ background: `${category.color}` }"
      >
        {{ category.name }}
      </div>
      <div
        class="px-1 text-gray-900"
        :style="{ background: `${category.color}80` }"
      >
        {{ subCategory.name }}
      </div>
    </div>
    <div
      v-if="stat?.name"
      class="font-semibold"
    >
      {{ stat.name }}
    </div>
    <div
      v-if="stat?.description"
      class="text-sm mb-1 max-w-60 opacity-80"
    >
      {{ stat.description }}
    </div>
  </div>
</template>
