// import * as d3 from 'd3';

import { MONTHS } from '~/assets/scripts/constants';
import { calcTextLength, shouldFlipText } from '~/assets/scripts/utils';
import type { d3GSelection } from '~/types';

export function useChartDrawArcs() {
  const { minRadius, radius, legend, radiusPadding } = useChartConfig();

  const { arcGenerator } = useChartGenerators();

  const configStore = useConfigStore();
  const { filteredDays, monthIndices, groupedByMonth } = storeToRefs(configStore);

  const drawCircleBackground = (g: d3GSelection) => {
    g.append('circle').attr('cx', 0).attr('cy', 0).attr('r', radius).attr('fill', '#fff');
  };

  const drawMonthArcs = (g: d3GSelection, circleScale: d3.ScaleLinear<number, number>) => {
    const indices = monthIndices.value;

    for (let groupIndex = 0; groupIndex < indices.length + 1; groupIndex++) {
      const id = `${groupIndex < 9 ? `0${groupIndex + 1}` : groupIndex + 1}`;
      const elId = `month-${id}`;
      const isLegend = groupIndex + 1 === indices.length + 1;

      const month = !isLegend ? MONTHS.find((m) => m.id === id) : null;
      const groupMonth = groupedByMonth.value[groupIndex];
      console.log(id, month, groupMonth);
      if (!isLegend && (!month || !groupMonth)) continue;
      if (isLegend) continue;

      const startIndex = isLegend ? filteredDays.value.length - 1 : indices[groupIndex];
      const text = isLegend ? 'Mois' : month?.name ?? 'Mois';

      const nextGroupStartIndex = isLegend
        ? startIndex + legend.columnCount + 1
        : indices[groupIndex + 1] ?? startIndex + groupMonth.length;

      const startAngle = circleScale(startIndex);
      const endAngle = circleScale(nextGroupStartIndex);
      const midAngle = (startAngle + endAngle) / 2;

      const shouldFlip = shouldFlipText(midAngle);
      const offset = shouldFlip ? -8 : 0;
      const labelRadius = minRadius - offset - 18;

      const textArc = arcGenerator({
        innerRadius: labelRadius,
        outerRadius: labelRadius,
        startAngle: shouldFlip ? endAngle : startAngle,
        endAngle: shouldFlip ? startAngle : endAngle,
        data: null,
      });

      const fontSize = 11;
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
            innerRadius: 20,
            outerRadius: radius + 38,
            startAngle,
            endAngle,
            data: null,
          })
        )
        .attr('fill', isOdd ? '#f4f4f9' : '#168aad')
        .attr('opacity', 0.15);
    }
  };

  const drawCategoryArcs = (g: d3GSelection, circleScale: d3.ScaleLinear<number, number>) => {
    const group = g.append('g').attr('class', 'category-curve');

    for (let i = 0; i < filteredDays.value.length; i++) {
      const d = filteredDays.value[i];
      const startAngle = circleScale(i);
      const endAngle = circleScale(i + 1);
      const arc = arcGenerator({
        innerRadius: minRadius,
        outerRadius: Math.max(minRadius + d.value * radiusPadding, minRadius),
        startAngle,
        endAngle,
        data: d,
      });
      group.append('path').attr('d', arc).attr('fill', 'red').attr('opacity', 0.5);
    }
  };

  return {
    drawCircleBackground,
    drawMonthArcs,
    drawCategoryArcs,
  };
}
