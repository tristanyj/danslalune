import type { Tooltip } from '~/types';

export const useInteractionStore = defineStore('interaction', () => {
  // --------------------------------
  // State
  // --------------------------------

  const mousePosition = ref({ x: 0, y: 0 });
  const tooltip = ref<Tooltip | null>(null);

  // --------------------------------
  // Computed
  // --------------------------------

  const isTooltipVisible = computed(() => !!tooltip.value);

  // --------------------------------
  // Methods
  // --------------------------------

  const updateMousePosition = (event: MouseEvent) => {
    mousePosition.value = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  return {
    mousePosition,
    tooltip,
    isTooltipVisible,
    updateMousePosition,
  };
});
