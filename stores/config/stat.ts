import type {
  Stat,
  EnrichedStat,
  EnrichedCategory,
  SubCategoryKey,
  Category,
  StatKey,
  StatFilters,
} from '~/types';

import {
  DEFAULT_STAT_IDS,
  STAT_SORT_OPTIONS,
  DEFAULT_STAT_FILTERS,
} from '~/assets/scripts/constants';

import { formatString } from '~/assets/scripts/utils';

export const useStatConfigStore = defineStore('config/stat', () => {
  const cacheStore = useCacheStore();
  const { getScale, getFormat } = cacheStore;

  const configStore = useConfigStore();
  const { searchInput } = storeToRefs(configStore);

  // --------------------------------
  // State
  // --------------------------------

  const categories = ref<Category[]>([]);
  const selectedStatIds = ref<StatKey[]>([...DEFAULT_STAT_IDS]);

  const currentSort = ref(STAT_SORT_OPTIONS[0]);
  const isSortAscending = ref(true);

  const filters = ref<StatFilters>(DEFAULT_STAT_FILTERS);

  // --------------------------------
  // Computed
  // --------------------------------

  const isLoaded = computed(() => categories.value.length > 0);

  const enrichedCategories = computed(
    () =>
      categories.value.map((category) => ({
        ...category,
        subCategories: category.subCategories.map((subCategory) => ({
          ...subCategory,
          stats: subCategory.stats.map((stat) => getEnrichedStat(stat, subCategory.color)),
        })),
      })) as EnrichedCategory[]
  );

  const selectedCategories = computed(() => {
    return enrichedCategories?.value
      ? enrichedCategories.value
          .map((group) => ({
            ...group,
            subCategories: group.subCategories
              .map((subCategory) => ({
                ...subCategory,
                stats: subCategory.stats.filter((column) =>
                  selectedStatIds.value.includes(column.id)
                ),
              }))
              .filter((subCategory) => subCategory.stats.length > 0),
          }))
          .filter((group) => group.subCategories.length > 0)
      : [];
  });

  const selectedSubCategories = computed(() => {
    return selectedCategories.value.flatMap((group) => group.subCategories);
  });

  const selectedStats = computed(() => {
    return selectedCategories.value
      .flatMap((group) => group.subCategories)
      .flatMap((subCategory) => subCategory.stats);
  });

  const selectedStatIdsCount = computed(() => selectedStatIds.value.length);

  const selectableCategories = computed(() => {
    return categories.value.map(({ id, name, color, subCategories }) => ({
      id,
      name,
      color,
      subCategories: subCategories.map(({ id, name, stats }) => ({
        id,
        name,
        color,
        stats: stats.map(({ id, name }) => ({ id, name })),
      })),
    }));
  });

  const selectableStats = computed(() => {
    return categories.value.flatMap((category) =>
      category.subCategories.flatMap((subCategory) => subCategory.stats)
    );
  });

  const sortedCategories = computed(() => {
    const copy = [...filteredCategories.value];

    switch (currentSort.value.key) {
      case 'name':
        return copy
          .map((category) => ({
            ...category,
            subCategories: category.subCategories
              .map((subCategory) => ({
                ...subCategory,
                stats: subCategory.stats.sort((a, b) =>
                  isSortAscending.value
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name)
                ),
              }))
              .sort((a, b) =>
                isSortAscending.value ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
              ),
          }))
          .sort((a, b) =>
            isSortAscending.value ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
          );
      default:
        return copy;
    }
  });

  const isFiltered = computed(() => {
    return (
      filters.value.selectedOnly ||
      Object.values(filters.value.categories).some((category) => !category) ||
      Object.values(filters.value.subCategories).some((subCategory) => !subCategory)
    );
  });

  const filteredCategories = computed(() => {
    const searchTerm = searchInput.value.toLowerCase();

    return selectableCategories.value
      .map((category) => ({
        ...category,
        subCategories: category.subCategories
          .map((subCategory) => ({
            ...subCategory,
            stats: subCategory.stats
              .filter((stat) => (searchTerm ? stat.name.toLowerCase().includes(searchTerm) : true))
              .filter((stat) =>
                filters.value.selectedOnly ? selectedStatIds.value.includes(stat.id) : true
              )
              .filter((stat) => {
                const [categoryId, subCategoryId] = stat.id.split('.');
                const parsedCategoryId = formatString(categoryId);
                const parsedSubCategoryId = formatString(subCategoryId);

                return (
                  filters.value.categories[
                    parsedCategoryId as keyof typeof filters.value.categories
                  ] &&
                  filters.value.subCategories[
                    parsedSubCategoryId as keyof typeof filters.value.subCategories
                  ]
                );
              }),
          }))
          .filter((subCategory) => subCategory.stats.length > 0),
      }))
      .filter((category) => category.subCategories.length > 0);
  });

  const filteredStats = computed(() => {
    return filteredCategories.value.flatMap((category) =>
      category.subCategories.flatMap((subCategory) => subCategory.stats)
    );
  });

  // --------------------------------
  // Methods
  // --------------------------------

  const getEnrichedStat = (stat: Stat, color: `#${string}`): EnrichedStat => ({
    ...stat,
    color,
    meta: {
      ...stat.meta,
      scale: getScale(stat),
      format: getFormat(stat),
    },
  });

  const getCategoryById = (id: string) => {
    return categories.value.find((category) => category.id === id);
  };
  const getSubCategoryById = (category: Category, subCategoryId: string) => {
    return category?.subCategories.find(
      (subCategory) => subCategory.id === `${category.id}.${subCategoryId}`
    );
  };

  const setCategories = (d: Category[]) =>
    (categories.value = d.map((category) => {
      const subCategories = category.subCategories.map((subCategory) => {
        const stats = subCategory.stats.map((stat) => ({
          ...stat,
          description: stat.description ? stat.description : null,
        }));
        return { ...subCategory, stats };
      });
      return { ...category, subCategories };
    }));

  const setSelectedStatIds = (newselectedStatIds: StatKey[]) =>
    (selectedStatIds.value = newselectedStatIds);

  const restoreDefaultStatSelection = () => {
    selectedStatIds.value = [...DEFAULT_STAT_IDS];
  };

  const toggleSubCategorySelection = (subCategoryId: SubCategoryKey) => {
    const stats = filteredCategories.value
      .flatMap((category) => category.subCategories)
      .find((subCategory) => subCategory.id === subCategoryId)?.stats;

    if (!stats) return;

    const allSelected = stats.every((stat) => selectedStatIds.value.includes(stat.id));

    if (allSelected) {
      setSelectedStatIds(selectedStatIds.value.filter((id) => !id.includes(subCategoryId)));
    } else {
      setSelectedStatIds(
        [
          ...selectedStatIds.value,
          ...stats.map((stat) => stat.id).filter((id, index, self) => self.indexOf(id) === index),
        ].filter((id, index, self) => self.indexOf(id) === index)
      );
    }
  };

  const clearFiltersStats = () => {
    filters.value = JSON.parse(JSON.stringify(DEFAULT_STAT_FILTERS));
  };

  const selectAllFilteredStats = () => {
    setSelectedStatIds(
      [
        ...selectedStatIds.value,
        ...filteredCategories.value
          .flatMap((category) => category.subCategories)
          .flatMap((subCategory) => subCategory.stats)
          .map((stat) => stat.id),
      ].filter((id, index, self) => self.indexOf(id) === index)
    );
  };

  const clearSelection = () => {
    setSelectedStatIds([]);
  };

  return {
    isLoaded,
    isFiltered,
    currentSort,
    isSortAscending,
    filters,
    filteredStats,
    sortedCategories,
    selectedStatIds,
    selectedStatIdsCount,
    selectableCategories,
    selectableStats,
    filteredCategories,
    selectedCategories,
    selectedSubCategories,
    selectedStats,
    setCategories,
    setSelectedStatIds,
    getCategoryById,
    getSubCategoryById,
    restoreDefaultStatSelection,
    selectAllFilteredStats,
    clearSelection,
    toggleSubCategorySelection,
    clearFiltersStats,
  };
});
