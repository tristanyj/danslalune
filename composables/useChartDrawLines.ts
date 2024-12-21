// import * as d3Pkg from 'd3';
import type { d3GSelection, Line } from '~/types';

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
  const { radius, minRadius, color, radiusPadding } = useChartConfig();

  const { lineGenerator } = useChartGenerators();

  const configStore = useConfigStore();
  const { filteredDays, groupedByMonth } = storeToRefs(configStore);

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

    g.append('circle')
      .attr('r', minRadius - 28)
      .attr('fill', 'none')
      .attr('stroke', color.separator.stroke)
      .attr('stroke-opacity', 0.15);
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
        opacity: 0.02,
      });
    }

    // const group = g.append('g').attr('class', 'separator-lines');

    // monthIndices.value.forEach((index) => {
    //   const startAngle = circleScale(index);

    //   createLine(group, {
    //     className: 'separator',
    //     y1: minRadius,
    //     y2: radius + 25,
    //     transform: `rotate(${180 + (startAngle * 180) / Math.PI})`,
    //     stroke: color.separator.stroke,
    //     opacity: 0.1,
    //   });
    // });

    // createLine(g, {
    //   className: 'separator',
    //   y1: minRadius,
    //   y2: radius + 25,
    //   transform: `rotate(${180 + (circleScale(filteredDays.value.length - 1) * 180) / Math.PI})`,
    //   stroke: color.separator.stroke,
    //   opacity: 0.1,
    // });
  }

  function drawCategoryCurve(g: d3GSelection, circleScale: d3.ScaleLinear<number, number>) {
    const group = g.append('g').attr('class', 'category-curve');

    group
      .append('path')
      .datum(
        filteredDays.value.map((d, i) => ({
          angle: circleScale(i),
          radius: minRadius + d.value * radiusPadding,
        }))
      )
      .attr('fill', 'none')
      .attr('stroke', '#777')
      .attr('stroke-width', 1)
      .attr('d', lineGenerator);
  }

  const drawMoonLines = (g: d3GSelection, circleScale: d3.ScaleLinear<number, number>) => {
    groupedByMonth.value.forEach((group) => {
      const lowestMoon = group.sort((a, b) => a.moon - b.moon)[0];
      const highestMoon = group.sort((a, b) => b.moon - a.moon)[0];

      const lowestMoonIndex = filteredDays.value.findIndex((d) => d.id === lowestMoon.id);
      const highestMoonIndex = filteredDays.value.findIndex((d) => d.id === highestMoon.id);

      const startAngle = circleScale(highestMoonIndex);

      createLine(g, {
        className: 'separator',
        y1: minRadius,
        y2: radius - highestMoon.moon * 1.5,
        transform: `rotate(${180 + (startAngle * 180) / Math.PI})`,
        stroke: 'darkblue',
        opacity: 0.45,
      });

      const startAngleLow = circleScale(lowestMoonIndex);

      createLine(g, {
        className: 'separator',
        y1: minRadius,
        y2: radius - lowestMoon.moon,
        transform: `rotate(${180 + (startAngleLow * 180) / Math.PI})`,
        stroke: color.separator.stroke,
        opacity: 0.15,
      });
    });
  };

  return {
    drawCircularSeparators,
    drawLinearSeparators,
    drawCategoryCurve,
    drawMoonLines,
  };
}
