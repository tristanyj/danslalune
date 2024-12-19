import type { Day } from '~/types';

export const useConfigStore = defineStore('config', () => {
  // --------------------------------
  // State
  // --------------------------------

  const days = ref<Day[]>([]);

  const filteredDays = computed(() => days.value);

  // --------------------------------
  // Computed
  // --------------------------------

  const isLoaded = computed(() => days.value.length > 0);

  // --------------------------------
  // Methods
  // --------------------------------

  const setDays = (d: Day[]) => {
    days.value = d.map((day) => ({
      ...day,
    }));
  };

  return {
    isLoaded,
    days,
    filteredDays,
    setDays,
  };
});
