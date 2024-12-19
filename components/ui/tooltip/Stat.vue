<script setup lang="ts">
import type { PlayerKey } from '~/types';

defineProps<{
  player: {
    id: PlayerKey;
    name: string;
    color: string;
  };
  stat: {
    abbreviation: string;
  };
  value: string;
}>();

const getImageUrl = (playerId: PlayerKey) => {
  return new URL(`../../../assets/images/player/${playerId}.jpg`, import.meta.url).href;
};
</script>

<template>
  <div
    class="flex space-x-2 items-center p-2"
    :style="{ background: `${player.color}33` }"
  >
    <img
      :src="getImageUrl(player.id)"
      class="h-16 object-contain rounded-sm"
      alt=""
    />
    <div class="grid items-center">
      <div class="text-2xl">
        <span class="font-semibold mr-1">{{ value }}</span>
        <span class="text-sm">{{ stat.abbreviation }}</span>
      </div>
      <div class="flex space-x-1 items-center">
        <div
          class="w-2 h-2 rounded-full"
          :style="{
            background: player.color,
          }"
        />
        <div class="text-sm">{{ player.name }}</div>
      </div>
    </div>
  </div>
</template>
