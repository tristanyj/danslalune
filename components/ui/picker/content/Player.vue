<script setup lang="ts">
import type { PlayerKey } from '~/types';

const getImageUrl = (playerId: PlayerKey) => {
  return new URL(`../../../../assets/images/player/${playerId}.jpg`, import.meta.url).href;
};

const playerConfigStore = usePlayerConfigStore();
const { selectedPlayerIds, sortedPlayers, filteredPlayers } = storeToRefs(playerConfigStore);
const { setSelectedPlayerIds } = playerConfigStore;

const hasResults = computed(() => {
  return filteredPlayers.value.length > 0;
});

const selectionPlayers = computed({
  get: () => selectedPlayerIds.value,
  set: (newValue) => {
    setSelectedPlayerIds(newValue);
  },
});

const togglePlayer = (playerId: PlayerKey) => {
  if (selectionPlayers.value.includes(playerId)) {
    setSelectedPlayerIds(selectionPlayers.value.filter((id) => id !== playerId));
  } else {
    setSelectedPlayerIds([...selectionPlayers.value, playerId]);
  }
};
</script>

<template>
  <UiPickerContent
    :has-results="hasResults"
    type="players"
  >
    <div
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-4"
    >
      <button
        v-for="(player, i) in sortedPlayers"
        :key="`player-${i}`"
        class="group relative p-2 border transition-all duration-50 rounded-sm bg-white focus:outline-primary-950/50"
        @click="togglePlayer(player.id)"
      >
        <div
          class="absolute inset-0 opacity-0 transition-opacity duration-0"
          :class="[selectionPlayers.includes(player.id) ? 'opacity-50' : 'group-hover:opacity-10']"
        >
          <div
            class="absolute inset-0 transform scale-x-[1.06] scale-y-[1.04] rounded-md bg-primary-950"
          />
          <div class="absolute inset-0 bg-white rounded-sm" />
        </div>

        <div class="relative h-full flex flex-col justify-between">
          <div class="grid grid-flow-col justify-center items-center text-xs text-gray-400 mb-2">
            {{ player.info.nickname }}
          </div>
          <div class="flex flex-col items-center">
            <img
              :src="getImageUrl(player.id)"
              class="h-20 object-contain rounded-sm"
              alt=""
            />
            <div class="text-center mt-2">
              <div class="items-start font-medium leading-[18px]">
                <div
                  class="relative left-[3px] bottom-[2px] inline-block w-2 h-2 rounded-full mr-1"
                  :style="{
                    background: player.color,
                  }"
                />
                {{ player.info.name }}
              </div>
              <div class="text-sm text-gray-500 mt-1">
                {{ player.info.position }}
              </div>
              <div class="text-sm text-gray-500">
                {{ player.info.height }} {{ player.info.weight }}lb
              </div>
            </div>
          </div>
          <div class="grid justify-center items-center text-xs text-gray-400 mt-2">
            <div>
              {{ player.info.draft[1] }}-{{ player.info.draft[1] + player.info.experience }}
            </div>
          </div>
        </div>
      </button>
    </div>
  </UiPickerContent>
</template>
