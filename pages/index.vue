<script setup lang="ts">
useHead({ title: 'Vache — Projet' });

const configStore = useConfigStore();
const { isLoaded, selectedCategory, currentColor } = storeToRefs(configStore);
</script>

<template>
  <div class="grid content bg-[#fff]">
    <div class="relative p-4">
      <div class="grid border-2 border-gray-900">
        <div
          class="grid grid-cols-2 justify-between items-center border-b-2 border-gray-900 p-6 py-3 text-sm"
        >
          <div class="flex font-medium font-bodoni">Dans la lune</div>
          <div class="flex justify-end">
            créé par
            <a
              href="https://tristanyj.com"
              class="underline ml-1"
              target="_blank"
            >
              tristan lanoye
            </a>
          </div>
        </div>
        <div class="grid items-start gap-10">
          <div class="grid grid-cols-[2fr,3fr] items-start gap-10 p-6">
            <h1 class="text-7xl font-bodoni leading-[1.15]">
              Est-ce que les phases de la lune influencent les
              <span :style="{ backgroundColor: `${currentColor}19` }">
                <template v-if="selectedCategory === 'velage'">vêlages</template>
                <template v-else-if="selectedCategory === 'matrice'">matrices</template>
                <template v-else-if="selectedCategory === 'veau_perf'">
                  perfusions de veau
                </template>
              </span>
              ?
            </h1>
            <div class="grid gap-2 pt-5">
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
          <div class="grid gap-10 justify-center pb-10">
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
      </div>
    </div>
  </div>
</template>
