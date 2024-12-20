import type { d3GSelection } from '~/types';

export function useChartDrawLabels() {
  const { radius } = useChartConfig();

  const configStore = useConfigStore();
  const { filteredDays } = storeToRefs(configStore);

  function drawDayLabels(g: d3GSelection, circleScale: d3.ScaleLinear<number, number>) {
    const className = 'day-label';

    for (let i = 0; i < filteredDays.value.length; i++) {
      const startIndex = i;
      const nextIndex = i === filteredDays.value.length ? 0 : i + 1;

      const startAngle = circleScale(startIndex);
      const endAngle = circleScale(nextIndex);
      const midAngle = (startAngle + endAngle) / 2;

      const textGroup = g.append('g').attr('class', className);

      const text = filteredDays.value[i].id;
      const textAnchor = midAngle > Math.PI ? 'end' : 'start';
      const labelRadius = radius + 10;

      const rotation = (midAngle * 180) / Math.PI - 90 + (midAngle > Math.PI ? 180 : 0);
      const x = labelRadius * Math.cos(midAngle - Math.PI / 2);
      const y = labelRadius * Math.sin(midAngle - Math.PI / 2);

      textGroup
        .append('text')
        .attr('x', x)
        .attr('y', y)
        .attr('text-anchor', textAnchor)
        .attr('dominant-baseline', 'middle')
        .attr('fill', '#000')
        .attr('font-size', 11)
        .attr('transform', `rotate(${rotation},${x},${y})`)
        .text(text);
    }
  }

  return {
    drawDayLabels,
  };
}
