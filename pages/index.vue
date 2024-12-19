<script setup lang="ts">
import basket from '@/assets/images/basket.svg';
import basketCircle from '@/assets/images/basket-circle.svg';

useHead({ title: "Stats don't lie — A visualization of NBA legends" });

const playerConfigStore = usePlayerConfigStore();
const { isLoaded: isPlayersLoaded } = storeToRefs(playerConfigStore);
const statConfigStore = useStatConfigStore();
const { isLoaded: isStatsLoaded } = storeToRefs(statConfigStore);
</script>

<template>
  <div class="grid content">
    <div class="relative">
      <div
        v-for="i in 10"
        :key="`line-${i}`"
        class="absolute top-0 h-full w-1 bg-gray-50"
        :style="{ left: `${i * 10}%`, opacity: 0.04 }"
      />

      <UContainer class="relative">
        <div class="relative py-12">
          <div class="flex justify-center relative mb-5">
            <div class="relative">
              <img
                :src="basketCircle"
                alt="Basketball Circle"
                class="w-32 h-32 md:w-36 md:h-36 spin-slow opacity-70"
              />
              <div
                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 md:w-28 h-24 md:h-28"
              >
                <img
                  :src="basket"
                  alt="Basketball"
                  class="w-full spin-mid-reverse"
                />
              </div>
            </div>
          </div>
          <h1 class="uppercase text-gray-50 text-center text-7xl md:text-8xl my-8 pb-1 font-anton">
            Stats don't lie
          </h1>
          <div class="mt-8 mb-3">
            <div class="grid md:grid-cols-2 gap-6 text-justify">
              <p class="text-gray-100">
                I follow sports for storylines and numbers. I like statistics, records, rivalries. I
                probably like that better than actually watching the thing. In this visualization, I
                tried conveying what fascinates me about sports by comparing some of the greatest
                basketball players of all time.
              </p>
              <p class="text-gray-100 text-justify">
                I collected data for 50 players and 130+ statistics from
                <a
                  href="https://www.basketball-reference.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="underline"
                  >Basketball Reference</a
                >. You can click the center of the chart to choose players and stats to compare.
                Stats are mapped around a circle on a scale from usually 0 to the NBA record. Each
                player has its own color.
              </p>
            </div>
          </div>
        </div>
      </UContainer>
      <div class="relative px-4">
        <UiChart v-if="isPlayersLoaded && isStatsLoaded" />
        <div
          v-else
          class="relative max-w-[1400px] w-full mx-auto"
        >
          <div class="pb-[100%]" />
          <div class="absolute inset-0 animate-pulse rounded-full bg-gray-100 opacity-20" />
        </div>
      </div>
      <UContainer>
        <div class="relative py-16 text-center lowercase">
          <p class="text-gray-50">
            Created by Tristan Lanoye
            <span class="relative right-1 mx-3 opacity-50">|</span>
            <a
              href="https://tristanyj.com"
              class="underline"
              target="_blank"
              >tristanyj.com</a
            >
          </p>
          <div class="max-w-80 mx-auto h-px bg-gray-50 my-4 opacity-25" />
          <div class="text-gray-200 text-sm lowercase">
            Data from
            <a
              href="https://www.basketball-reference.com/"
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-gray-100 transition-colors duration-50 underline"
              >Basketball Reference</a
            >; <br />
            up to date as of november 2024.
          </div>
        </div>
      </UContainer>
    </div>
    <UiPicker />
  </div>
</template>
