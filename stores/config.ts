import type { CategoryKey, Day, FilteredDay } from '~/types';
import { MONTHS } from '~/assets/scripts/constants';

export const useConfigStore = defineStore('config', () => {
  // --------------------------------
  // State
  // --------------------------------

  const selectedCategory = ref<CategoryKey>('velage');

  const colors = {
    velage: '#FFC107',
    matrice: '#FF5722',
    veau_perf: '#4CAF50',
    agnelage: '#2196F3',
  };

  const currentColor = computed(() => colors[selectedCategory.value]);

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

  const groupedByMonth = computed(() => {
    const grouped = MONTHS.map((month) => {
      const days = filteredDays.value.filter((day) => day.id.includes(`-${month.id}-`));
      return days;
    });

    return grouped;
  });

  const monthIndices = computed(() => {
    const indices = [];

    for (let i = 1; i <= 12; i++) {
      const id = `-${i < 10 ? `0${i}` : i}-`;
      const firstIndex = filteredDays.value.findIndex((day) => day.id.includes(id));
      indices.push(firstIndex);
    }

    return indices;
  });

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
    currentColor,
    selectedCategory,
    monthIndices,
    groupedByMonth,
    setCategory,
    setDays,
  };
});
