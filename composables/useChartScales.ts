import * as d3 from 'd3';

export function useChartScales() {
  const scales = {
    circle: d3
      .scaleLinear()
      .domain([0, 365])
      .range([0, 2 * Math.PI]),
  };

  function updateScale(key: keyof typeof scales, count: number) {
    const totalColumns = count;
    scales[key].domain([0, totalColumns]).range([0, 2 * Math.PI]);
  }

  return {
    scales,
    updateScale,
  };
}
