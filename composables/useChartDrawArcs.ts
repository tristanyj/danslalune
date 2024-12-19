import * as d3 from 'd3';

import type { d3GSelection, DayArc } from '~/types';

export function useChartDrawArcs() {
  const interactionStore = useInteractionStore();
  const { updateMousePosition, setTooltip } = interactionStore;
  const { arcGenerator } = useChartGenerators();
  const { radius, minRadius, proportions, restRadius } = useChartConfig();

  function drawCircleBackground(g: d3GSelection) {
    g.append('circle').attr('cx', 0).attr('cy', 0).attr('r', radius).attr('fill', '#fff');
  }

  function drawStatArcs(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    layer: 'base' | 'hover'
  ) {
    const className = `stat-arc-${layer}`;
    const arcData: Array<DayArc> = [];
  }

  return {
    drawCircleBackground,
    drawStatArcs,
  };
}
