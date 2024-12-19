import type { d3GSelection, EnrichedStat, Category, SubCategory } from '~/types';

import { wrapText, shouldFlipText, calcTextLength, withUnit } from '~/assets/scripts/utils';

export function useChartDrawLabels() {
  const { radius, minRadius, scalePositions, proportions, wrap, modifier, legend } =
    useChartConfig();
  const { arcGenerator } = useChartGenerators();

  function drawStatLabels(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    stats: EnrichedStat[]
  ) {
    const className = 'stat-label';

    for (let i = 0; i < stats.length + 1; i++) {
      const isLegend = i === stats.length;
      const text = isLegend ? legend.statLabel : stats[i]?.name;
      const startAngle = circleScale(i);
      const endAngle = circleScale(isLegend ? i + legend.columnCount : i + 1);
      const midAngle = (startAngle + endAngle) / 2;
      const textAnchor = midAngle > Math.PI ? 'end' : 'start';
      const labelRadius = radius * proportions[0] * modifier.radius.statLabel;

      const textGroup = g.append('g').attr('class', className);
      const lines = wrapText(text, wrap.maxWidth);

      const rotation = (midAngle * 180) / Math.PI - 90 + (midAngle > Math.PI ? 180 : 0);
      const x = labelRadius * Math.cos(midAngle - Math.PI / 2);
      const y = labelRadius * Math.sin(midAngle - Math.PI / 2);
      const totalHeight = lines.length * wrap.lineHeight;
      const startY = y - totalHeight / 2 + wrap.lineHeight / 2;

      lines.forEach((line, i) => {
        textGroup
          .append('text')
          .attr('x', x)
          .attr('y', startY + i * wrap.lineHeight)
          .attr('text-anchor', textAnchor)
          .attr('dominant-baseline', 'middle')
          .attr('fill', modifier.color.black)
          .attr('font-size', modifier.font.statLabel)
          .attr('transform', `rotate(${rotation},${x},${y})`)
          .text(line);
      });
    }
  }

  function drawGroupLabels(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    indices: number[],
    selectedStatIdsCount: number,
    groups: Category[] | SubCategory[],
    isGroup: boolean
  ) {
    const layerModifier = isGroup ? 0 : 1;
    const spaceModifier = isGroup ? modifier.space.categoryLabel : modifier.space.subCategoryLabel;

    for (let groupIndex = 0; groupIndex < indices.length + 1; groupIndex++) {
      const isLegend = groupIndex === indices.length;
      const startIndex = isLegend ? selectedStatIdsCount : indices[groupIndex];
      const group = isLegend ? null : groups[groupIndex];
      const text = isLegend
        ? isGroup
          ? legend.categoryLabel
          : legend.subCategoryLabel
        : group?.name ?? '';

      const id = `label-path-${group?.id ?? `legend-${isGroup ? 'group' : 'sub-group'}`}`;

      const nextGroupStartIndex = isLegend
        ? startIndex + legend.columnCount
        : indices[groupIndex + 1] ??
          startIndex +
            (isGroup
              ? (group as Category).subCategories.reduce((sum, sg) => sum + sg.stats.length, 0)
              : (group as SubCategory).stats.length);

      const startAngle = circleScale(startIndex);
      const endAngle = circleScale(nextGroupStartIndex);
      const midAngle = (startAngle + endAngle) / 2;

      const shouldFlip = shouldFlipText(midAngle);
      const offset = shouldFlip ? spaceModifier.flip : spaceModifier.standard;
      const labelRadius = radius * proportions[2 - layerModifier] + offset;

      const textArc = arcGenerator({
        innerRadius: labelRadius,
        outerRadius: labelRadius,
        startAngle: shouldFlip ? endAngle : startAngle,
        endAngle: shouldFlip ? startAngle : endAngle,
        data: group,
      });

      const fontSize =
        layerModifier !== 0 ? modifier.font.subCategoryLabel : modifier.font.categoryLabel;
      const textLength = calcTextLength(g, id, text, fontSize);

      const arcLength = Math.abs(endAngle - startAngle) * labelRadius;
      const textPercentage = (textLength / arcLength) * 100;
      const textOffsetPercentage = (100 - textPercentage) / 4;

      g.append('path').attr('id', id).attr('d', textArc).attr('fill', 'none');

      g.append('text')
        .append('textPath')
        .attr('href', `#${id}`)
        .attr('startOffset', `${textOffsetPercentage}%`)
        .style('font-size', fontSize)
        .style('font-weight', isGroup ? 'normal' : 'normal')
        .text(text);
    }
  }

  function drawScaleLabels(
    g: d3GSelection,
    circleScale: d3.ScaleLinear<number, number>,
    stats: EnrichedStat[]
  ) {
    const statsCount = stats.length;

    for (let i = 0; i < stats.length + 1; i++) {
      const d = stats[i];
      const isLegend = i === stats.length;

      const startAngle = circleScale(i);
      const endAngle = circleScale(isLegend ? i + legend.columnCount : i + 1);
      const midAngle = (startAngle + endAngle) / 2;
      const shouldFlip = shouldFlipText(midAngle);

      scalePositions
        .filter((position) => {
          if (statsCount <= 45) {
            return true;
          } else if (statsCount <= 60) {
            return position > 0.2;
          } else {
            return position > 0.6;
          }
        })
        .forEach((position) => {
          const id = `label-path-${d?.id ?? 'legend'}-${position}`;

          const scaleOffset = position * (radius * proportions[0] - minRadius);
          const flipOffset = shouldFlip
            ? modifier.space.scaleLabel.flip
            : modifier.space.scaleLabel.standard;
          const startOffset = position === 0.0 ? modifier.space.scaleLabel.start : 0;
          const endOffset = position === 1.0 ? modifier.space.scaleLabel.end : 0;

          const labelRadius = minRadius + scaleOffset + flipOffset + startOffset + endOffset;
          const backgroundRadius = shouldFlip
            ? labelRadius + modifier.space.scaleLabel.background.flip
            : labelRadius + modifier.space.scaleLabel.background.standard;

          const value = isLegend
            ? legend.scales[position as keyof typeof legend.scales]
            : position === 1.0
            ? // @ts-expect-error - TS doesn't know about the scale function
              withUnit(d.meta.scale.invert(position), d.meta.formatType)
            : // @ts-expect-error - TS doesn't know about the scale function
              d.meta.format(d.meta.scale.invert(position), position === 0.0 ? 0 : 1);

          g.append('path')
            .attr('id', id)
            .attr(
              'd',
              arcGenerator({
                innerRadius: labelRadius,
                outerRadius: labelRadius,
                startAngle: shouldFlip ? endAngle : startAngle,
                endAngle: shouldFlip ? startAngle : endAngle,
                data: position,
              })
            )
            .attr('fill', 'none');

          const fontSize = modifier.font.scaleLabel;
          const textLength = calcTextLength(g, id, value, fontSize);
          const textHeight = modifier.space.scaleLabel.text.height;

          const padding = modifier.space.scaleLabel.text.padding;
          const arcLength = Math.abs(endAngle - startAngle) * labelRadius;
          const textPercentage = (textLength / arcLength) * 100;
          const restPercentage = 100 - textPercentage;
          const textOffsetPercentage = restPercentage / 4;

          const backgroundArcLength = textLength + padding * 2;
          const angleForArc = backgroundArcLength / backgroundRadius;

          const bgStartAngle = midAngle - angleForArc / 2;
          const bgEndAngle = midAngle + angleForArc / 2;

          if (position !== 1.0) {
            g.append('path')
              .attr(
                'd',
                arcGenerator({
                  innerRadius: backgroundRadius - (textHeight / 2 + padding),
                  outerRadius: backgroundRadius + (textHeight / 2 + padding),
                  startAngle: bgStartAngle,
                  endAngle: bgEndAngle,
                  data: position,
                })
              )
              .attr('fill', modifier.color.scaleLabel.background.color)
              .attr('opacity', modifier.color.scaleLabel.background.opacity);
          }

          g.append('text')
            .append('textPath')
            .attr('href', `#${id}`)
            .attr('startOffset', `${textOffsetPercentage}%`)
            .style('font-size', fontSize)
            .text(value);
        });
    }
  }

  return {
    drawGroupLabels,
    drawStatLabels,
    drawScaleLabels,
  };
}
