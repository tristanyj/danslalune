<script setup lang="ts">
import { getChunks } from '~/assets/scripts/utils';

const statConfigStore = useStatConfigStore();
const { selectedStatIds, filteredCategories, sortedCategories } = storeToRefs(statConfigStore);
const { toggleSubCategorySelection, setSelectedStatIds } = statConfigStore;

const hasResults = computed(() => {
  return filteredCategories.value.some((category) =>
    category.subCategories.some((sub) => sub.stats.length > 0)
  );
});

const selectionStats = computed({
  get: () => selectedStatIds.value,
  set: (newValue) => {
    setSelectedStatIds(newValue);
  },
});
</script>

<template>
  <UiPickerContent
    :has-results="hasResults"
    type="stats"
    class="pb-10"
  >
    <div class="grid md:grid-cols-2 xl:grid-cols-3 gap-10 xl:gap-20 items-start">
      <div
        v-for="(group, i) in sortedCategories"
        :key="`group-${i}`"
        class="grid gap-3 items-start"
        :class="i === 0 ? 'border-transparent' : 'border-gray-200'"
      >
        <div class="flex">
          <div class="relative text-lg font-bold">
            <div
              class="absolute left-0 top-0 w-full h-full inline-block transform scale-110 rounded-sm mr-1"
              :style="{
                background: `${group.color}66`,
              }"
            />
            <h3 class="relative">
              {{ group.name }}
            </h3>
          </div>
        </div>
        <div class="grid gap-4 items-start">
          <div
            v-for="(subCategory, j) in group.subCategories"
            :key="`sub-group-${j}`"
            class="grid gap-2"
          >
            <div class="flex">
              <div
                class="darken relative text-md font-bold cursor-pointer"
                @click="toggleSubCategorySelection(subCategory.id)"
              >
                <div
                  class="absolute left-0 top-0 w-full h-full inline-block transform scale-110 rounded-sm mr-1"
                  :style="{
                    background: `${subCategory.color}33`,
                  }"
                />
                <h4 class="relative">
                  {{ subCategory.name }}
                </h4>
              </div>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 items-start gap-x-2 sm:gap-x-5">
              <div
                v-for="(chunk, k) in getChunks(subCategory.stats, 3)"
                :key="`chunk-${k}`"
                class="grid gap-y-1 items-start"
              >
                <div
                  v-for="(column, index) in chunk"
                  :key="`column-${index}`"
                  class=""
                >
                  <UCheckbox
                    v-model="selectionStats"
                    :ui="{ inner: 'ms-1.5 flex flex-col' }"
                    :value="column.id"
                    :label="column.name"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UiPickerContent>
</template>
