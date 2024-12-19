import type { Day } from '~/types';

export const usePlayerConfigStore = defineStore('config/player', () => {
  // --------------------------------
  // State
  // --------------------------------

  const days = ref<Day[]>([]);

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
    setDays,
  };
});
