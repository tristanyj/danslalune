<script setup lang="ts">
import { STAT_SORT_OPTIONS } from '~/assets/scripts/constants';
import type { SortOption } from '~/types';

const statConfigStore = useStatConfigStore();
const {
  filters,
  selectableStats,
  selectedStatIds,
  currentSort,
  isSortAscending,
  isFiltered,
  filteredStats,
} = storeToRefs(statConfigStore);
const { restoreDefaultStatSelection, clearSelection, selectAllFilteredStats, clearFiltersStats } =
  statConfigStore;

const isFiltersOpenStats = ref(false);
const isSortOpen = ref(false);

const selectOption = (option: SortOption) => {
  if (currentSort.value.key === option.key) {
    isSortAscending.value = !isSortAscending.value;
  }
  currentSort.value = option;
  isSortOpen.value = false;
};
</script>

<template>
  <UiPickerFilter
    v-model:isFiltersOpen="isFiltersOpenStats"
    v-model:isSortOpen="isSortOpen"
    :is-sort-ascending="isSortAscending"
    :is-filtered="isFiltered"
    :selectable-length="selectableStats.length"
    :selected-length="selectedStatIds.length"
    :filtered-length="filteredStats.length"
    :total-length="selectableStats.length"
    :sort-options="STAT_SORT_OPTIONS"
    :current-sort="currentSort"
    @clear-selection="clearSelection"
    @restore-default-selection="restoreDefaultStatSelection"
    @select-all-filtered="selectAllFilteredStats"
    @clear-filters="clearFiltersStats"
    @select-option="selectOption"
  >
    <div class="filters-container rounded-lg w-60">
      <div class="mb-3">
        <label class="block text-sm text-gray-700">Selected Only</label>
        <UToggle v-model="filters.selectedOnly" />
      </div>
      <div class="mb-3">
        <label class="block text-sm text-gray-700 mb-1">Categories</label>
        <div class="flex flex-wrap gap-x-3 gap-y-2">
          <label
            v-for="(checked, category) in filters.categories"
            :key="category"
            class="flex items-center"
          >
            <div class="checkbox">
              <UCheckbox
                v-model="filters.categories[category]"
                :ui="{ inner: 'ms-1 flex flex-col' }"
                :label="category"
              />
            </div>
          </label>
        </div>
      </div>
      <div>
        <label class="block text-sm text-gray-700 mb-1">Sub Categories</label>
        <div class="flex flex-wrap gap-x-3 gap-y-2">
          <label
            v-for="(checked, category) in filters.subCategories"
            :key="category"
            class="flex items-center"
          >
            <div class="checkbox">
              <UCheckbox
                v-model="filters.subCategories[category]"
                :ui="{ inner: 'ms-1 flex flex-col' }"
                :label="category"
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  </UiPickerFilter>
</template>
