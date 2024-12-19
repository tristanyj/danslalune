<script setup lang="ts">
import * as d3 from 'd3';
import type { d3GSelection } from '@/types';

const { width, height } = useChartConfig();
const {
  drawCircleBackground,
  drawOverlayArc,
  drawStatLabelArcs,
  drawStatArcs,
  drawGroupArcs,
  drawOutsideMaxStatScaleArc,
} = useChartDrawArcs();
const { drawCircularSeparators, drawLinearSeparators, drawDonutLine } = useChartDrawLines();
const { drawStatLabels, drawScaleLabels, drawGroupLabels } = useChartDrawLabels();
const { drawStatIntersectionPoints } = useChartDrawPoints();
const { drawCenterImage, drawBackground, drawCenter } = useChartDrawCenter();
const { scales, updateScale } = useChartScales();

const interactionStore = useInteractionStore();
const { hoveredCategory } = storeToRefs(interactionStore);
const { setHoveredCategory } = interactionStore;

const playerConfigStore = usePlayerConfigStore();
const statConfigStore = useStatConfigStore();

const { selectedPlayers, selectedPlayerIds } = storeToRefs(playerConfigStore);
const {
  selectedStatIds,
  selectedStatIdsCount,
  selectedCategories,
  selectedSubCategories,
  selectedStats,
} = storeToRefs(statConfigStore);

const indices = computed(() => {
  let currentIndex = 0;
  const categoryIndices: number[] = [];
  const subCategoryIndices: number[] = [];

  selectedCategories.value.forEach((category) => {
    categoryIndices.push(currentIndex);
    category.subCategories.forEach((subCategory) => {
      subCategoryIndices.push(currentIndex);
      currentIndex += subCategory.stats.length;
    });
  });

  return { group: categoryIndices, subCategory: subCategoryIndices };
});

updateScale('circle', selectedStatIdsCount.value);

const container = ref<HTMLElement | null>(null);
const g = ref<d3GSelection | null>(null);
const isLoading = ref(true);

function createVisualization() {
  if (!g.value) return;

  g.value.selectAll('*').remove();

  // -----------------
  // BACKGROUND
  // -----------------

  drawBackground(g.value);
  drawCircleBackground(g.value);

  // -----------------
  // ARCS
  // -----------------

  drawGroupArcs(g.value, scales.circle, indices.value.group, selectedCategories.value, 0, 'base');
  drawGroupArcs(
    g.value,
    scales.circle,
    indices.value.subCategory,
    selectedSubCategories.value,
    1,
    'base'
  );

  drawStatArcs(g.value, scales.circle, selectedStats.value, selectedPlayers.value, 'base');

  drawStatLabelArcs(
    g.value,
    scales.circle,
    selectedStats.value,
    indices.value.subCategory,
    selectedSubCategories.value,
    'base'
  );

  drawOutsideMaxStatScaleArc(g.value);

  // -----------------
  // LINES
  // -----------------

  drawCircularSeparators(g.value);
  drawLinearSeparators(
    g.value,
    scales.circle,
    indices.value.group,
    indices.value.subCategory,
    selectedStatIdsCount.value
  );

  // -----------------
  // POINTS
  // -----------------

  drawStatIntersectionPoints(g.value, scales.circle, selectedStatIdsCount.value);

  // -----------------
  // CENTER
  // -----------------

  drawCenter(g.value);
  drawDonutLine(g.value);
  drawCenterImage(g.value);

  // -----------------
  // LABELS
  // -----------------

  drawGroupLabels(
    g.value,
    scales.circle,
    indices.value.group,
    selectedStatIdsCount.value,
    selectedCategories.value,
    true
  );
  drawGroupLabels(
    g.value,
    scales.circle,
    indices.value.subCategory,
    selectedStatIdsCount.value,
    selectedSubCategories.value,
    false
  );

  drawStatLabels(g.value, scales.circle, selectedStats.value);
  drawScaleLabels(g.value, scales.circle, selectedStats.value);

  // -----------------
  // OVERLAY
  // -----------------

  drawOverlayArc(
    g.value,
    scales.circle,
    hoveredCategory.value,
    selectedCategories.value,
    selectedSubCategories.value
  );

  // -----------------
  // HIDDEN
  // -----------------

  drawStatArcs(g.value, scales.circle, selectedStats.value, selectedPlayers.value, 'hover');
  drawStatLabelArcs(
    g.value,
    scales.circle,
    selectedStats.value,
    indices.value.subCategory,
    selectedSubCategories.value,
    'hover'
  );
  drawGroupArcs(g.value, scales.circle, indices.value.group, selectedCategories.value, 0, 'hover');
  drawGroupArcs(
    g.value,
    scales.circle,
    indices.value.subCategory,
    selectedSubCategories.value,
    1,
    'hover'
  );
}

function updateVisualization() {
  if (!container.value) return;
  createVisualization();
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

watch(
  () => hoveredCategory.value,
  () => {
    if (!g.value) return;
    drawOverlayArc(
      g.value,
      scales.circle,
      hoveredCategory.value,
      selectedCategories.value,
      selectedSubCategories.value
    );
  }
);

watch(
  () => selectedStatIds.value,
  () => {
    updateVisualization();
  }
);

watch(
  () => selectedPlayerIds.value,
  () => {
    updateVisualization();
  }
);

watch(
  () => selectedStatIdsCount.value,
  (count) => {
    updateScale('circle', count);
    createVisualization();
  }
);

const handleOutsideClick = (event: MouseEvent) => {
  if (container.value && !container.value.contains(event.target as Node)) {
    setHoveredCategory(null);
  }
};

onMounted(() => {
  mountToContainer();
  window.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
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
