import * as d3 from 'd3';

export function useChartScales() {
  const { legend } = useChartConfig();

  const scales = {
    circle: d3
      .scaleLinear()
      .domain([0, 365 + legend.columnCount])
      .range([0, 2 * Math.PI]),
  };

  function updateScale(key: keyof typeof scales, count: number) {
    const totalColumns = count + legend.columnCount;
    const columnWidth = (2 * Math.PI) / totalColumns;
    const rotationOffset = 0 + (legend.columnCount * columnWidth) / 2;

    scales[key].domain([0, totalColumns]).range([rotationOffset, 2 * Math.PI + rotationOffset]);
  }

  return {
    scales,
    updateScale,
  };
}
