<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { useWindowSize, useEventListener } from '@vueuse/core';

const { width, height } = useWindowSize();

const interactionStore = useInteractionStore();
const { mousePosition, isTooltipVisible, tooltip } = storeToRefs(interactionStore);

const tooltipStyle = computed<CSSProperties>(() => {
  if (!mousePosition.value) return {};

  const paddingX = 25;
  const paddingY = 25;

  const isPastHalfWidth = mousePosition.value.x > width.value * 0.65;
  const isPastHalfHeight = mousePosition.value.y > height.value * 0.65;

  const posX = mousePosition.value.x + paddingX;
  const posY =
    isPastHalfWidth && isPastHalfHeight
      ? mousePosition.value.y - tooltipSize.value.height - paddingY
      : mousePosition.value.y + paddingY;

  const clampedPosX = Math.max(
    paddingX,
    Math.min(posX, width.value - tooltipSize.value.width - paddingX)
  );
  const clampedPosY = Math.max(
    paddingY,
    Math.min(posY, height.value - tooltipSize.value.height - paddingY)
  );

  return {
    transform: `translate(${clampedPosX}px, ${clampedPosY}px)`,
    visibility: isTooltipVisible.value ? 'visible' : 'hidden',
    position: 'fixed',
    top: 0,
    left: 0,
  };
});

const tooltipSize = ref({ width: 0, height: 0 });
const tooltipRef = ref<HTMLElement | null>(null);

watch(
  [tooltip, isTooltipVisible],
  async () => {
    if (!tooltipRef.value) return;

    await nextTick();

    const rect = tooltipRef.value.getBoundingClientRect();
    tooltipSize.value = {
      width: rect.width,
      height: rect.height,
    };
  },
  { immediate: true }
);

useEventListener(window, 'resize', () => {
  if (!tooltipRef.value || !isTooltipVisible.value) return;

  const rect = tooltipRef.value.getBoundingClientRect();
  tooltipSize.value = {
    width: rect.width,
    height: rect.height,
  };
});

onMounted(() => {
  if (!tooltipRef.value) return;

  const resizeObserver = new ResizeObserver((entries) => {
    const rect = entries[0].contentRect;
    tooltipSize.value = {
      width: rect.width,
      height: rect.height,
    };
  });

  resizeObserver.observe(tooltipRef.value);

  onUnmounted(() => {
    resizeObserver.disconnect();
  });
});
</script>

<template>
  <div
    v-show="isTooltipVisible"
    ref="tooltipRef"
    class="fixed stat-tooltip bg-gray-50 border rounded-md z-100 text-sm"
    :style="tooltipStyle"
  >
    <template v-if="tooltip">
      <div class="">lol</div>
    </template>
  </div>
</template>
