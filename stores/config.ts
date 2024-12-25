import type { CategoryKey, Day, FilteredDay } from '~/types';
import { MONTHS } from '~/assets/scripts/constants';

export const useConfigStore = defineStore('config', () => {
  // --------------------------------
  // State
  // --------------------------------

  const selectedCategory = ref<CategoryKey>('velage');

  const colors = {
    velage: '#d90368',
    matrice: '#fb8b24',
    veau_perf: '#6a994e',
  };

  const coef = {
    velage: 2.25,
    matrice: 3,
    veau_perf: 1.18,
  };

  const currentColor = computed(() => colors[selectedCategory.value]);
  const currentCoef = computed(() => coef[selectedCategory.value]);

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
    }).filter((month) => month.length > 0);

    return grouped;
  });

  // const highestMoons = computed(() => {
  //   const indices = [];

  //   groupedByMonth.value.forEach((group, i) => {
  //     // const lowestMoon = group.sort((a, b) => a.moon - b.moon)[0];
  //     const highestMoon = group.sort((a, b) => b.moon - a.moon).filter((d, i) => i < 1);

  //     // const lowestMoonIndex = filteredDays.value.findIndex((d) => d.id === lowestMoon.id);
  //     const highestMoonIndex = filteredDays.value.findIndex((d) => d.id === highestMoon.id);
  //     console.log(highestMoonIndex);

  //   });
  // });

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
    console.log(d);
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
    currentCoef,
    selectedCategory,
    monthIndices,
    groupedByMonth,
    setCategory,
    setDays,
  };
});
