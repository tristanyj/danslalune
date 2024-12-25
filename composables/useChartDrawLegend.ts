import { calcTextLength } from '~/assets/scripts/utils';
import type { d3GSelection, Line } from '~/types';

export const createLine = (g: d3GSelection, params: Line & { x1: number; x2: number }) => {
  g.append('line')
    .attr('class', params.className)
    .attr('x1', params.x1)
    .attr('y1', params.y1)
    .attr('x2', params.x2)
    .attr('y2', params.y2)
    .attr('stroke', params.stroke ?? '#000')
    .attr('opacity', params.opacity ?? 1)
    .attr('stroke-width', params.strokeWidth ?? 1)
    .attr('transform', '');
};

export function useChartDrawLegend() {
  const { radius, minRadius, radiusPadding, legend } = useChartConfig();

  const { arcGenerator } = useChartGenerators();

  const configStore = useConfigStore();
  const { currentColor, filteredDays, groupedByMonth } = storeToRefs(configStore);

  const drawNewMoon = (g: d3GSelection, cx: number, cy: number, radius: number) => {
    g.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', radius)
      .attr('stroke', 'black')
      .attr('fill', 'none');
  };

  const drawFullMoon = (g: d3GSelection, cx: number, cy: number, radius: number) => {
    g.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', radius)
      .attr('stroke', 'black')
      .attr('fill', 'black');
  };

  const drawMoonPhaseIcons = (g: d3GSelection, circleScale: d3.ScaleLinear<number, number>) => {
    const iconRadius = 5;
    const iconSpacing = 15;

    const getCoordinates = (index: number, value: number, offset: number) => {
      const angle = circleScale(index) + offset;

      const highX = (radius - value - iconSpacing) * Math.cos(angle);
      const highY = (radius - value - iconSpacing) * Math.sin(angle);

      return { x: highX, y: highY };
    };

    const angleOffset = -Math.PI / 2;

    groupedByMonth.value.forEach((group) => {
      const lowestMoon = group.sort((a, b) => a.moon - b.moon)[0];
      const highestMoon = group.sort((a, b) => b.moon - a.moon)[0];

      const lowestMoonIndex = filteredDays.value.findIndex((d) => d.id === lowestMoon.id);
      const highestMoonIndex = filteredDays.value.findIndex((d) => d.id === highestMoon.id);

      const { x: lowX, y: lowY } = getCoordinates(lowestMoonIndex, lowestMoon.moon, angleOffset);
      const { x: highX, y: highY } = getCoordinates(
        highestMoonIndex,
        highestMoon.moon,
        angleOffset
      );

      drawNewMoon(g, lowX, lowY, iconRadius);
      drawFullMoon(g, highX, highY, iconRadius);
    });

    const day = filteredDays.value.find((d) => d.id === '2023-08-01');
    const dayIndex = filteredDays.value.findIndex((d) => d.id === '2023-08-01');
    if (!day) return;

    const { x: highX, y: highY } = getCoordinates(dayIndex, day.moon, angleOffset);
    drawFullMoon(g, highX, highY, iconRadius);
  };

  const drawCurveLegend = (g: d3GSelection) => {
    const group = g.append('g').attr('class', 'curve-legend');

    for (let i = 0; i < 7; i++) {
      group
        .append('circle')
        .attr('r', minRadius + i * radiusPadding)
        .attr('fill', 'none')
        .attr('stroke', currentColor.value)
        .attr('opacity', 0.25);
    }
  };

  const drawRingsLegend = (g: d3GSelection, circleScale: d3.ScaleLinear<number, number>) => {
    const startAngle = circleScale(0 - legend.columnCount * 2);
    const endAngle = circleScale(0 + legend.columnCount);

    for (let i = 0; i < 7; i++) {
      const id = `legend-${i}`;

      const labelRadius = minRadius + i * radiusPadding + 4;

      const fontSize = 12;
      const textLength = calcTextLength(g, id, i.toString(), fontSize);

      const arcLength = Math.abs(endAngle - startAngle) * labelRadius;
      const textPercentage = (textLength / arcLength) * 100;
      const restPercentage = 100 - textPercentage;
      const textOffsetPercentage = restPercentage / 4;

      g.append('path')
        .attr('id', id)
        .attr(
          'd',
          arcGenerator({
            innerRadius: labelRadius,
            outerRadius: labelRadius,
            startAngle: startAngle,
            endAngle: endAngle,
            data: null,
          })
        )
        .attr('fill', 'none');

      g.append('text')
        .append('textPath')
        .attr('href', `#${id}`)
        .attr('startOffset', `${textOffsetPercentage}%`)
        .style('font-size', fontSize)
        .text(i.toString())
        .attr('opacity', 0.75);
    }
  };

  const drawMoonLegend = (g: d3GSelection) => {
    const newMoonX1 = -220;
    const newMoonY1 = -585;
    const newMoonX2 = newMoonX1 + 30;
    const newMoonY2 = newMoonY1 + 25;

    const fullMoonX1 = -77;
    const fullMoonY1 = -523;
    const fullMoonX2 = fullMoonX1 - 30;
    const fullMoonY2 = fullMoonY1 + 25;

    createLine(g, {
      className: 'separator',
      x1: newMoonX1,
      x2: newMoonX2,
      y1: newMoonY1,
      y2: newMoonY2,
      stroke: 'black',
      transform: '',
    });

    createLine(g, {
      className: 'separator',
      x1: fullMoonX1,
      x2: fullMoonX2,
      y1: fullMoonY1,
      y2: fullMoonY2,
      stroke: 'black',
      transform: '',
    });

    g.append('text')
      .attr('x', newMoonX2 - 25)
      .attr('y', newMoonY2 + 15)
      .text('New Moon')
      .style('font-size', 12);

    g.append('text')
      .attr('x', fullMoonX2 - 25)
      .attr('y', fullMoonY2 + 15)
      .text('Full Moon')
      .style('font-size', 12);
  };

  return {
    drawCurveLegend,
    drawMoonPhaseIcons,
    drawRingsLegend,
    drawMoonLegend,
  };
}
