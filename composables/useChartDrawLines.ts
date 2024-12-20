import * as d3 from 'd3';
import type { d3GSelection, FilteredDay, Line } from '~/types';

const createLine = (g: d3GSelection, params: Line) => {
  g.append('line')
    .attr('class', params.className)
    .attr('x1', 0)
    .attr('y1', params.y1)
    .attr('x2', 0)
    .attr('y2', params.y2)
    .attr('stroke', params.stroke ?? '#000')
    .attr('opacity', params.opacity ?? 1)
    .attr('stroke-width', params.strokeWidth ?? 1)
    .attr('transform', params.transform);
};

export function useChartDrawLines() {
  const { radius, minRadius, color } = useChartConfig();

  const configStore = useConfigStore();
  const { filteredDays, selectedCategory } = storeToRefs(configStore);

  function drawCircularSeparators(g: d3GSelection) {
    g.append('circle')
      .attr('r', minRadius)
      .attr('fill', 'none')
      .attr('stroke', color.separator.stroke)
      .attr('stroke-opacity', color.separator.highOpacity);

    g.append('circle')
      .attr('r', radius)
      .attr('fill', 'none')
      .attr('stroke', color.separator.stroke)
      .attr('stroke-opacity', color.separator.highOpacity);
  }

  function drawLinearSeparators(g: d3GSelection, circleScale: d3.ScaleLinear<number, number>) {
    for (let i = 0; i < filteredDays.value.length; i++) {
      const startAngle = circleScale(i);

      const y1 = minRadius;
      const y2 = radius;

      createLine(g, {
        className: 'separator',
        y1,
        y2,
        transform: `rotate(${180 + (startAngle * 180) / Math.PI})`,
        stroke: color.separator.stroke,
        opacity: 0.1,
      });
    }
  }

  function drawCategoryCurve(g: d3GSelection, circleScale: d3.ScaleLinear<number, number>) {
    const group = g.append('g').attr('class', 'category-curve');
    const radius = 350;
    const padding = 30;

    for (let i = 0; i < 6; i++) {
      group
        .append('circle')
        .attr('r', radius + i * padding)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('opacity', 0.25);
    }

    const closedData = [...filteredDays.value];

    const lineGenerator = d3
      .lineRadial<FilteredDay>()
      .angle((d, i) => circleScale(i))
      .radius((d) => radius + d.value * padding)
      .curve(d3.curveLinearClosed);

    group
      .append('path')
      .datum(closedData)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);
  }

  return {
    drawCircularSeparators,
    drawLinearSeparators,
    drawCategoryCurve,
  };
}
