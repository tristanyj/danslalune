<script setup lang="ts">
import * as d3 from 'd3';
import type { d3GSelection } from '@/types';

const { width, height } = useChartConfig();
const { drawCircleBackground, drawMonthArcs, drawCategoryArcs } = useChartDrawArcs();
const { drawDayLabels } = useChartDrawLabels();
const { drawCurveLegend, drawMoonPhaseIcons, drawRingsLegend, drawMoonLegend, drawAreaLegend } =
  useChartDrawLegend();
const { drawMoonPhaseArea, drawCategoryArea } = useChartDrawAreas();
const { drawMoonPhaseGradient } = useChartDrawGradient();
const { drawCircularSeparators, drawLinearSeparators, drawCategoryCurve, drawMoonLines } =
  useChartDrawLines();
const { scales, updateScale } = useChartScales();

const configStore = useConfigStore();
const { filteredDays, selectedCategory } = storeToRefs(configStore);

updateScale('circle', filteredDays.value.length);

const container = ref<HTMLElement | null>(null);
const g = ref<d3GSelection | null>(null);
const isLoading = ref(true);

function createVisualization() {
  if (!g.value) return;

  g.value.selectAll('*').remove();

  drawMoonPhaseGradient(g.value);

  // -----------------
  // BACKGROUND
  // -----------------

  drawCircleBackground(g.value);
  drawCurveLegend(g.value);
  drawMoonLines(g.value, scales.circle);
  drawMonthArcs(g.value, scales.circle);
  drawCategoryArcs(g.value, scales.circle);

  drawMoonPhaseArea(g.value, scales.circle);

  drawRingsLegend(g.value, scales.circle);
  drawCircularSeparators(g.value);
  drawCategoryArea(g.value, scales.circle);
  drawCategoryCurve(g.value, scales.circle);
  drawLinearSeparators(g.value, scales.circle);
  drawMoonPhaseIcons(g.value, scales.circle);
  drawMoonLegend(g.value);
  drawAreaLegend(g.value);

  drawDayLabels(g.value, scales.circle);
}

const mountToContainer = () => {
  if (!container.value) {
    return;
  }

  d3.select(container.value).selectAll('*').remove();
  const svg = d3
    .select(container.value)
    .append('svg')
    .attr('width', width)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('class', 'mx-auto');
  g.value = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

  createVisualization();

  isLoading.value = false;
};

function updateVisualization() {
  if (!container.value) return;
  createVisualization();
}

watch(
  () => selectedCategory.value,
  () => {
    updateVisualization();
  }
);

watch(
  () => filteredDays.value,
  (days) => {
    updateScale('circle', days.length);
    updateVisualization();
  }
);

onMounted(() => {
  mountToContainer();
});
</script>

<template>
  <div class="relative z-10">
    <UiTooltip />
    <div
      id="container"
      ref="container"
      @click.stop
    />
  </div>
</template>
