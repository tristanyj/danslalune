import type { d3GSelection } from '~/types';

export function useChartDrawPoints() {
  const { minRadius, restRadius, modifier, layerCount, legend } = useChartConfig();

  function drawStatIntersectionPoints(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    selectedStatIdsCount: number
  ) {
    for (let i = 0; i <= selectedStatIdsCount; i++) {
      const isLastStat = i === selectedStatIdsCount;
      const startAngle = circleScale(i);
      const nextAngle = circleScale(isLastStat ? i + legend.columnCount : i + 1);
      const midAngle = (startAngle + nextAngle) / 2 + (3 * Math.PI) / 2;

      for (let j = 1; j <= layerCount - 1; j++) {
        const circleRadius = minRadius + restRadius * (j / layerCount);

        g.append('circle')
          .attr('r', 2)
          .attr('cx', circleRadius * Math.cos(midAngle))
          .attr('cy', circleRadius * Math.sin(midAngle))
          .attr('fill', modifier.color.separator.stroke)
          .attr('opacity', modifier.color.separator.lowOpacity);
      }
    }
  }

  return {
    drawStatIntersectionPoints,
  };
}
