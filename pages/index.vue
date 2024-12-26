<script setup lang="ts">
useHead({ title: "Dans la lune — Visualisation de l'influence de la lune sur les vêlages" });

const configStore = useConfigStore();
const { isLoaded, selectedCategory, currentColor } = storeToRefs(configStore);
</script>

<template>
  <div class="grid content bg-[#fff]">
    <div class="relative p-4">
      <div class="grid border-2 border-gray-900">
        <div
          class="grid grid-flow-col justify-between items-center border-b-2 border-gray-900 p-6 py-3 text-sm"
        >
          <div class="flex font-medium">Dans la lune</div>
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
        <div class="grid items-start gap-5 xl:gap-10">
          <div class="grid xl:grid-cols-2 items-start gap-3 md:gap-6 xl:gap-10 p-6">
            <h1
              class="text-3xl md:text-5xl xl:text-7xl font-bodoni"
              :style="{ lineHeight: '1.15 !important' }"
            >
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
                Depuis des générations, de nombreux éleveurs sont convaincus que les phases de la
                lune influencent non seulement le comportement des animaux, mais aussi des
                événements clés tels que les vêlages et les interventions vétérinaires. Ce projet de
                data visualisation explore cette croyance en examinant les corrélations possibles
                entre les cycles lunaires et les activités d'élevage.
              </p>
              <p>
                Les données proviennent d'une clinique vétérinaire située en Aveyron et représentent
                trois types d'intervention effectuées durant l'année 2023 : les vêlages, les
                matrices et les perfusions de veau.
              </p>
              <p>
                En comparant les pics d'activité de chaque catégorie avec les phases de la lune,
                découvrez par vous-même si la croyance populaire est fondée ou non.
              </p>
            </div>
          </div>
          <div class="grid gap-8 justify-center pb-6 xl:pb-10">
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
