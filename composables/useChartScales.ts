import * as d3 from 'd3';

export function useChartScales() {
  const scales = {
    circle: d3
      .scaleLinear()
      .domain([0, 365])
      .range([0, 2 * Math.PI]),
  };

  function updateScale(key: keyof typeof scales, count: number) {
    scales[key].domain([0, count]).range([0, 2 * Math.PI]);
  }

  return {
    scales,
    updateScale,
  };
}
