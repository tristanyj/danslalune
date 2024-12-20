import * as d3Pkg from 'd3';
import type { d3GSelection, FilteredDay, Line } from '~/types';
import { calcTextLength, shouldFlipText } from '~/assets/scripts/utils';
import { MONTHS } from '~/assets/scripts/constants';
// import { regressionLoess } from 'd3-regression';

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
  const { radius, minRadius, color, legend } = useChartConfig();

  const { arcGenerator } = useChartGenerators();

  const configStore = useConfigStore();
  const { filteredDays, monthIndices, groupedByMonth, currentColor } = storeToRefs(configStore);

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
    // for (let i = 0; i < filteredDays.value.length; i++) {
    //   const startAngle = circleScale(i);
    //   const y1 = minRadius;
    //   const y2 = radius;
    //   createLine(g, {
    //     className: 'separator',
    //     y1,
    //     y2,
    //     transform: `rotate(${180 + (startAngle * 180) / Math.PI})`,
    //     stroke: color.separator.stroke,
    //     opacity: 0.1,
    //   });
    // }
    // createLine(g, {
    //   className: 'separator',
    //   y1: minRadius,
    //   y2: radius,
    //   transform: `rotate(${180 + (circleScale(0) * 180) / Math.PI})`,
    //   stroke: color.separator.stroke,
    //   opacity: 0.25,
    // });
    // createLine(g, {
    //   className: 'separator',
    //   y1: minRadius,
    //   y2: radius,
    //   transform: `rotate(${180 + (circleScale(filteredDays.value.length - 1) * 180) / Math.PI})`,
    //   stroke: color.separator.stroke,
    //   opacity: 0.25,
    // });
  }

  function drawCategoryCurve(g: d3GSelection, circleScale: d3.ScaleLinear<number, number>) {
    const group = g.append('g').attr('class', 'category-curve');
    const radiusScope = minRadius;
    const padding = 50;

    for (let i = 0; i < 7; i++) {
      group
        .append('circle')
        .attr('r', radiusScope + i * padding)
        .attr('fill', 'none')
        .attr('stroke', currentColor.value)
        .attr('opacity', 0.25);
    }

    const closedData = [...filteredDays.value];

    const lineGenerator = d3Pkg
      .lineRadial<FilteredDay>()
      .angle((d, i) => circleScale(i))
      .radius((d) => radiusScope + d.value * padding)
      .curve(d3Pkg.curveLinear);

    const areaBaseGenerator = d3Pkg
      .areaRadial<FilteredDay>()
      .angle((d, i) => circleScale(i))
      .innerRadius((d, i) => radius - d.value)
      .outerRadius(radius)
      .curve(d3Pkg.curveLinear);

    const areaGenerator = d3Pkg
      .areaRadial<any>()
      .angle((d) => d.angle)
      .innerRadius(radiusScope) // Base radius
      .outerRadius((d) => radiusScope + Math.pow(d.smoothedValue, 1.5) * padding * 1.75)
      .curve(d3Pkg.curveLinear); // Smooth curve

    // group
    //   .append('path')
    //   .datum(closedData)
    //   .attr('fill', 'none')
    //   .attr('stroke', '#777')
    //   .attr('stroke-width', 1)
    //   .attr('d', lineGenerator);

    const regressionGenerator = d3
      .regressionLoess()
      .x((_, i) => i)
      .y((d) => d.value)
      .bandwidth(0.1);
    const values = regressionGenerator(closedData);
    const smoothedData = values.map((d, i) => ({
      angle: circleScale(i),
      smoothedValue: d[1], // The second element is the y (smoothed value)
    }));

    const moonData = closedData.map((d) => {
      return {
        id: d.id,
        value: d.moon,
        moon: d.moon,
      };
    });

    group
      .append('path')
      .datum(moonData)
      .attr('fill', 'url(#moonGradient)')
      .attr('opacity', 0.5)
      .attr('d', areaBaseGenerator);

    group
      .append('path')
      .datum(smoothedData)
      .attr('fill', currentColor.value) // Fill color for the area
      .attr('opacity', 0.5) // Opacity for better visualization
      .attr('d', areaGenerator);

    // arc

    for (let i = 0; i < closedData.length; i++) {
      const d = closedData[i];
      const startAngle = circleScale(i);
      const endAngle = circleScale(i + 1);
      const arc = arcGenerator({
        innerRadius: minRadius,
        outerRadius: Math.max(minRadius + d.value * padding, minRadius),
        startAngle,
        endAngle,
        data: d,
      });
      group.append('path').attr('d', arc).attr('fill', 'red').attr('opacity', 0.5);
    }

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

    // text
    const indices = monthIndices.value;

    for (let groupIndex = 0; groupIndex < indices.length + 1; groupIndex++) {
      // if (groupIndex !== 2) continue;

      const id = `${groupIndex < 9 ? `0${groupIndex + 1}` : groupIndex + 1}`;
      const elId = `month-${id}`;
      const isLegend = groupIndex + 1 === indices.length + 1;

      console.log(id, isLegend);
      const month = !isLegend ? MONTHS.find((m) => m.id === id) : null;
      console.log(MONTHS);
      const groupMonth = groupedByMonth.value[groupIndex - 1];
      if (!isLegend && !month && !groupMonth) continue;

      const startIndex = isLegend ? filteredDays.value.length - 1 : indices[groupIndex];
      const text = isLegend ? 'Mois' : month?.name ?? 'Mois';

      const nextGroupStartIndex = isLegend
        ? startIndex + legend.columnCount + 1
        : indices[groupIndex + 1] ?? startIndex + groupMonth.length;

      // if (groupIndex === 0) {
      console.log('startIndex', startIndex, groupIndex);
      console.log('nextGroupStartIndex', nextGroupStartIndex, groupIndex);
      // }

      const startAngle = circleScale(startIndex);
      const endAngle = circleScale(nextGroupStartIndex);
      const midAngle = (startAngle + endAngle) / 2;

      const shouldFlip = shouldFlipText(midAngle);
      const offset = shouldFlip ? 10 : 0;
      const labelRadius = radius + offset + 10;

      const textArc = arcGenerator({
        innerRadius: labelRadius,
        outerRadius: labelRadius,
        startAngle: shouldFlip ? endAngle : startAngle,
        endAngle: shouldFlip ? startAngle : endAngle,
        data: group,
      });

      const fontSize = 13;
      const textLength = calcTextLength(g, elId, text, fontSize);

      const arcLength = Math.abs(endAngle - startAngle) * labelRadius;
      const textPercentage = (textLength / arcLength) * 100;
      const textOffsetPercentage = (100 - textPercentage) / 4;

      g.append('path').attr('id', elId).attr('d', textArc).attr('fill', 'none');

      g.append('text')
        .append('textPath')
        .attr('href', `#${elId}`)
        .attr('startOffset', `${textOffsetPercentage}%`)
        .style('font-size', fontSize)
        .style('font-weight', 'normal')
        .text(text);

      // arc
      const isOdd = groupIndex % 2 === 0;

      g.append('path')
        .attr(
          'd',
          arcGenerator({
            innerRadius: minRadius,
            outerRadius: radius,
            startAngle,
            endAngle,
            data: group,
          })
        )
        .attr('fill', isOdd ? '#fff' : '#999')
        .attr('opacity', 0.1);
    }
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
        y2: radius - highestMoon.moon,
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
