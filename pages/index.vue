<script setup lang="ts">
useHead({ title: 'Vache — Projet' });

const configStore = useConfigStore();
const { isLoaded } = storeToRefs(configStore);
</script>

<template>
  <div class="grid content bg-[#fff]">
    <div class="relative p-2">
      <div class="grid border-2 border-gray-900">
        <div
          class="grid grid-cols-3 justify-between items-center border-b-2 border-gray-900 p-5 py-2"
        >
          <div class="">left</div>
          <div class="flex justify-center">Est-ce que la lune influence les vêlages ?</div>
          <div class="flex justify-end">right</div>
        </div>
        <div class="grid grid-cols-[1fr,2fr] items-start gap-10">
          <div class="grid gap-2 p-5 font-bodoni">
            <h1 class="text-7xl">Est-ce que la lune influence les vêlages ?</h1>
            <div class="grid gap-2 pt-7">
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat minus deleniti
                ratione recusandae magni, accusamus, aliquid inventore, placeat optio in iusto
                aperiam repudiandae debitis voluptatem amet consequatur sit nam sapiente.
              </p>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat minus deleniti
                ratione recusandae magni, accusamus, aliquid inventore, placeat optio in iusto
                aperiam repudiandae debitis voluptatem amet consequatur sit nam sapiente.
              </p>
              <p>
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat minus deleniti
                ratione recusandae magni, accusamus, aliquid inventore, placeat optio in iusto
                aperiam repudiandae debitis voluptatem amet consequatur sit nam sapiente.
              </p>
            </div>
          </div>
          <div class="">
            <UiPicker />
            <div class="relative px-4">
              <UiChart v-if="isLoaded" />
              <div
                v-else
                class="relative max-w-[1400px] w-full mx-auto"
              >
                <div class="pb-[100%]" />
                <div class="absolute inset-0 animate-pulse rounded-full bg-gray-100 opacity-20" />
              </div>
            </div>
          </div>
        </div>
        <div
          class="grid grid-cols-3 justify-between items-center border-t-2 border-gray-900 p-5 py-2"
        >
          <div class="">Date</div>
          <div class="flex justify-center">Created by</div>
          <div class="flex justify-end">Data from</div>
        </div>
      </div>
    </div>
  </div>
</template>
