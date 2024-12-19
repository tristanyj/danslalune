<script setup lang="ts">
interface Props {
  hasResults: boolean;
  type: 'players' | 'stats';
}

defineProps<Props>();
</script>

<template>
  <div class="overflow-y-auto h-full">
    <div
      v-if="hasResults"
      class="grid h-full"
    >
      <div class="p-4 pt-3">
        <slot />
      </div>
    </div>
    <div
      v-else
      class="p-4 text-center text-gray-500"
    >
      No {{ type }} found matching criteria
    </div>
  </div>
</template>
