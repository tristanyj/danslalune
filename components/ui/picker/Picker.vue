<script setup lang="ts">
const configStore = useConfigStore();
const { searchInput } = storeToRefs(configStore);

const interactionStore = useInteractionStore();
const { isPickerOpen, pickerType } = storeToRefs(interactionStore);
const { openPicker } = interactionStore;

const items = [
  {
    key: 'players',
    label: 'Select players',
    icon: 'i-radix-icons:avatar',
  },
  {
    key: 'stats',
    label: 'Select stats',
    icon: 'i-radix-icons:crosshair-2',
  },
];

const selectedIndex = computed({
  get: () => items.findIndex((item) => item.key === pickerType.value),
  set: (newValue: number) => {
    openPicker(items[newValue].key as 'players' | 'stats');
  },
});

const isOpen = computed({
  get: () => isPickerOpen.value,
  set: (newValue) => {
    isPickerOpen.value = newValue;
  },
});

watch(
  () => isOpen.value,
  (newValue) => {
    if (newValue) {
      searchInput.value = '';
    }
  }
);
</script>

<template>
  <USlideover
    v-model="isOpen"
    side="bottom"
    class="font-host"
  >
    <div class="grid grid-rows-[auto,auto,1fr] h-full">
      <UiPickerHeader
        v-model="selectedIndex"
        v-model:searchValue="searchInput"
        :items="items"
        @change="searchInput = ''"
        @close="isOpen = false"
      />
      <template v-if="selectedIndex === 0">
        <UiPickerFilterPlayer />
        <UiPickerContentPlayer />
      </template>
      <template v-else>
        <UiPickerFilterStat />
        <UiPickerContentStat />
      </template>
    </div>
  </USlideover>
</template>
