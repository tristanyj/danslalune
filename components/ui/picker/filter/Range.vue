<script setup lang="ts">
import { useVModel } from '@vueuse/core';

interface Props {
  min: number;
  max: number;
  label: string;
  unit: string;
  rangeValue: number[];
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 0,
  label: '',
  unit: '"',
  rangeValue: () => [0, 0],
});

const emit = defineEmits<{
  'update:rangeValue': [value: number[]];
}>();

const absMin = computed(() => Math.min(props.rangeValue[0], props.rangeValue[1]));
const absMax = computed(() => Math.max(props.rangeValue[0], props.rangeValue[1]));

const rangeValue = useVModel(props, 'rangeValue', emit);
</script>

<template>
  <div class="slider-container mb-5">
    <label class="block text-sm text-gray-700 mb-2">
      {{ label }} ({{ absMin }}{{ unit }} - {{ absMax }}{{ unit }})
    </label>
    <div class="relative h-1">
      <div class="absolute h-full rounded-full bg-gray-300 w-full" />
      <div
        class="absolute h-full bg-primary-950/50 rounded-full"
        :style="{
          left: `${Math.min(
            ((rangeValue[0] - min) / (max - min)) * 100,
            ((rangeValue[1] - min) / (max - min)) * 100
          )}%`,
          right: `${
            100 -
            Math.max(
              ((rangeValue[0] - min) / (max - min)) * 100,
              ((rangeValue[1] - min) / (max - min)) * 100
            )
          }%`,
        }"
      />
      <input
        v-model="rangeValue[0]"
        type="range"
        :min="min"
        :max="max"
        class="range-slider"
      />
      <input
        v-model="rangeValue[1]"
        type="range"
        :min="min"
        :max="max"
        class="range-slider"
      />
    </div>
  </div>
</template>

<style scoped>
.slider-container {
  @apply relative w-full;
}

.range-slider {
  @apply absolute w-full appearance-none bg-transparent pointer-events-none;
  top: -11px;
  height: 1rem;
}

.range-slider::-webkit-slider-thumb {
  @apply h-4 w-4 rounded-full border-none bg-primary-800 cursor-pointer pointer-events-auto relative;
  -webkit-appearance: none;
}

.range-slider::-moz-range-thumb {
  @apply h-4 w-4 rounded-full border-none bg-primary-800 cursor-pointer pointer-events-auto relative;
}

.range-slider::-webkit-slider-runnable-track {
  @apply w-full h-1 bg-transparent cursor-pointer;
}

.range-slider::-moz-range-track {
  @apply w-full h-1 bg-transparent cursor-pointer;
}

.range-slider {
  @apply z-20;
}

.range-slider::-webkit-slider-thumb:hover,
.range-slider::-moz-range-thumb:hover {
  @apply bg-primary-800;
}

.range-slider:focus {
  @apply outline-none;
}

.range-slider:focus::-webkit-slider-thumb {
  @apply ring-1 ring-primary-800;
}

.range-slider:focus::-moz-range-thumb {
  @apply ring-1 ring-primary-800;
}
</style>
