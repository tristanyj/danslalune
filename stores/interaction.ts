import type { Category, SubCategory, TooltipStat, ToolTipStatLabel } from '~/types';

export const useInteractionStore = defineStore('interaction', () => {
  // --------------------------------
  // State
  // --------------------------------

  const isPickerOpen = ref(false);
  const pickerType = ref<'players' | 'stats'>('players');

  const mousePosition = ref({ x: 0, y: 0 });
  const hoveredCategory = ref<Category | SubCategory | null>(null);
  const tooltipStat = ref<TooltipStat | null>(null);
  const tooltipStatLabel = ref<ToolTipStatLabel | null>(null);

  // --------------------------------
  // Computed
  // --------------------------------

  const isTooltipVisible = computed(() => !!tooltipStat.value || !!tooltipStatLabel.value);

  // --------------------------------
  // Methods
  // --------------------------------

  const updateMousePosition = (event: MouseEvent) => {
    mousePosition.value = {
      x: event.clientX,
      y: event.clientY,
    };
  };

  const setHoveredCategory = (category: Category | SubCategory | null) => {
    hoveredCategory.value = category;
  };

  const setTooltipStat = (data: TooltipStat | null) => {
    tooltipStat.value = data;
  };

  const setTooltipStatLabel = (data: ToolTipStatLabel | null) => {
    tooltipStatLabel.value = data;
  };

  const openPicker = (key: 'players' | 'stats') => {
    pickerType.value = key;
    isPickerOpen.value = true;
  };

  return {
    hoveredCategory,
    pickerType,
    mousePosition,
    tooltipStat,
    tooltipStatLabel,
    isPickerOpen,
    isTooltipVisible,
    openPicker,
    updateMousePosition,
    setTooltipStat,
    setTooltipStatLabel,
    setHoveredCategory,
  };
});
