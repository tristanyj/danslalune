<script setup lang="ts">
import { useVModel } from '@vueuse/core';

interface Props {
  modelValue: number;
  searchValue: string;
  items: {
    key: string;
    label: string;
    icon: string;
  }[];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: 0,
  searchValue: '',
  items: () => [],
});

const emit = defineEmits<{
  close: [];
  change: [];
  'update:modelValue': [value: number];
  'update:searchValue': [value: string];
}>();

const selectedIndex = useVModel(props, 'modelValue', emit);
const searchValue = useVModel(props, 'searchValue', emit);

const placeholder = computed(() => `Search ${selectedIndex.value === 0 ? 'players' : 'stats'}...`);
</script>

<template>
  <div class="grid md:grid-cols-[auto,1fr,auto] gap-3 lg:gap-10 items-center border-b p-4">
    <div class="order-3 md:order-1">
      <UTabs
        v-model="selectedIndex"
        :items="items"
        :ui="{ content: false }"
        @change="emit('change')"
      />
    </div>
    <div class="order-2">
      <UInput
        v-model="searchValue"
        icon="i-radix-icons:magnifying-glass"
        :placeholder="placeholder"
        padded
        size="md"
        color="gray"
        variant="outline"
        clearable
      />
    </div>
    <div class="order-1 md:order-3">
      <UButton
        color="gray"
        size="md"
        icon="i-radix-icons:cross-2"
        square
        padded
        @click="emit('close')"
      />
    </div>
  </div>
</template>
