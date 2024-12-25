// import * as d3 from 'd3';
// import { filter } from 'd3';
import type { d3GSelection } from '~/types';

export function useChartDrawAreas() {
  const { radius, minRadius, radiusPadding } = useChartConfig();

  const { areaGenerator } = useChartGenerators();

  const configStore = useConfigStore();
  const { filteredDays, currentColor, currentCoef } = storeToRefs(configStore);

  const drawMoonPhaseArea = (g: d3GSelection, circleScale: d3.ScaleLinear<number, number>) => {
    const group = g.append('g').attr('class', 'moon-phase-area');

    const moonData = filteredDays.value
      .map((d, i) => {
        return {
          angle: circleScale(i),
          minRadius: radius - d.moon,
          maxRadius: radius,
        };
      })
      .concat({
        angle: circleScale(filteredDays.value.length),
        minRadius: radius - filteredDays.value[0].moon - 8,
        maxRadius: radius,
      });

    group
      .append('path')
      .datum(moonData)
      .attr('fill', 'url(#moonGradient)')
      .attr('opacity', 0.75)
      .attr('d', areaGenerator);
  };

  const drawCategoryArea = (g: d3GSelection, circleScale: d3.ScaleLinear<number, number>) => {
    const group = g.append('g').attr('class', 'category-area');
    // @ts-expect-error - TS doesn't know about the bandwidth method
    const regressionGenerator = d3
      // @ts-expect-error - TS doesn't know about the bandwidth method
      .regressionLoess()
      // @ts-expect-error - TS doesn't know about the bandwidth method
      .x((_, i) => i)
      // @ts-expect-error - TS doesn't know about the bandwidth method
      .y((d) => d.value)
      .bandwidth(0.1);

    // TODO: change offset based on selected category to prolong the area
    const offset = 5;

    const values: [[number, number]] = regressionGenerator(filteredDays.value);
    const smoothedData = values
      .map((d, i) => ({
        angle: circleScale(i),
        minRadius: minRadius,
        maxRadius: minRadius + Math.pow(d[1], 1.6) * radiusPadding * currentCoef.value,
      }))
      .concat({
        angle: circleScale(filteredDays.value.length),
        minRadius: minRadius,
        maxRadius:
          minRadius +
          Math.pow(values[values.length - 1][1], 1.6) * radiusPadding * currentCoef.value +
          offset,
      });

    group
      .append('path')
      .datum(smoothedData)
      .attr('fill', currentColor.value)
      .attr('opacity', 0.35)
      .attr('d', areaGenerator);
  };

  return {
    drawMoonPhaseArea,
    drawCategoryArea,
  };
}
