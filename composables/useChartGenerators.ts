import * as d3 from 'd3';
import type { Arc, Area, Point } from '~/types';

export function useChartGenerators() {
  const arcGenerator = d3
    .arc<Arc>()
    .innerRadius((d) => d.innerRadius)
    .outerRadius((d) => d.outerRadius)
    .startAngle((d) => d.startAngle)
    .endAngle((d) => d.endAngle);

  const areaGenerator = d3
    .areaRadial<Area>()
    .angle((d) => d.angle)
    .innerRadius((d) => d.minRadius)
    .outerRadius((d) => d.maxRadius)
    .curve(d3.curveLinear);

  const lineGenerator = d3
    .lineRadial<Point>()
    .angle((d) => d.angle)
    .radius((d) => d.radius)
    .curve(d3.curveLinear);

  return {
    arcGenerator,
    areaGenerator,
    lineGenerator,
  };
}
