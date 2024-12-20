import type { CategoryKey, Day, FilteredDay } from '~/types';

export const useConfigStore = defineStore('config', () => {
  // --------------------------------
  // State
  // --------------------------------

  const selectedCategory = ref<CategoryKey>('velage');

  const days = ref<Day[]>([]);

  const filteredDays = computed<FilteredDay[]>(() =>
    days.value
      .filter((_, i) => i < 1000)
      .map((day) => {
        return {
          id: day.date,
          moon: day.moon,
          value: day[selectedCategory.value],
        };
      })
  );

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

  const setCategory = (category: CategoryKey) => {
    selectedCategory.value = category;
  };

  return {
    isLoaded,
    days,
    filteredDays,
    selectedCategory,
    setCategory,
    setDays,
  };
});
