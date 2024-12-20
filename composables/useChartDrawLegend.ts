import type { d3GSelection } from '~/types';

export function useChartDrawLegend() {
  const { minRadius, radiusPadding } = useChartConfig();

  const configStore = useConfigStore();
  const { currentColor } = storeToRefs(configStore);

  const drawCurveLegend = (g: d3GSelection) => {
    const group = g.append('g').attr('class', 'curve-legend');

    for (let i = 0; i < 7; i++) {
      group
        .append('circle')
        .attr('r', minRadius + i * radiusPadding)
        .attr('fill', 'none')
        .attr('stroke', currentColor.value)
        .attr('opacity', 0.25);
    }
  };

  return {
    drawCurveLegend,
  };
}
