import type { d3GSelection } from '~/types';
import { calcTextLength } from '~/assets/scripts/utils';

import basket from '~/assets/images/basket.svg';

export function useChartDrawCenter() {
  const { openPicker, setHoveredCategory } = useInteractionStore();

  const { arcGenerator } = useChartGenerators();
  const { width, height, minRadius, modifier } = useChartConfig();

  function drawBackground(g: d3GSelection) {
    g.append('rect')
      .attr('class', 'background')
      .attr('x', -width / 2)
      .attr('y', -height / 2)
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'transparent')
      .on('click', () => {
        setHoveredCategory(null);
      });
  }

  function drawCenterImage(g: d3GSelection) {
    const imageSize = 60;

    g.append('image')
      .attr('class', 'spin-mid')
      .attr('href', basket)
      .attr('width', imageSize)
      .attr('height', imageSize)
      .attr('x', -imageSize / 2)
      .attr('y', -imageSize / 2);
  }

  function drawCenter(g: d3GSelection) {
    g.selectAll('.center').remove();

    const fontSize = 12;
    const arcGroup = g.append('g').attr('class', 'center');

    const textArcs = [
      {
        id: 'top-arc',
        text: 'Click here to select players',
        radius: minRadius * modifier.radius.insideMinStatScale - modifier.space.donut.arc.top,
        startAngle: (3 * Math.PI) / 2,
        endAngle: (5 * Math.PI) / 2,
        color: modifier.color.black,
      },
      {
        id: 'bottom-arc',
        text: `Click here to select stats`,
        radius: minRadius * modifier.radius.insideMinStatScale - modifier.space.donut.arc.bottom,
        startAngle: (3 * Math.PI) / 2,
        endAngle: Math.PI / 2,
        color: modifier.color.black,
      },
    ];

    const clickableArcs = [
      {
        id: 'top-clickable',
        startAngle: -Math.PI / 2,
        endAngle: Math.PI / 2,
        radius: minRadius * modifier.radius.insideMinStatScale,
        background: '#f9f9f9',
        onClick: () => {
          openPicker('players');
          setHoveredCategory(null);
        },
      },
      {
        id: 'bottom-clickable',
        startAngle: Math.PI / 2,
        endAngle: (3 * Math.PI) / 2,
        radius: minRadius * modifier.radius.insideMinStatScale,
        background: '#f9f9f9',
        onClick: () => {
          openPicker('stats');
          setHoveredCategory(null);
        },
      },
    ];

    clickableArcs.forEach((arc) => {
      arcGroup
        .append('path')
        .attr('class', `${arc.id}-base`)
        .attr(
          'd',
          arcGenerator({
            innerRadius: 0,
            outerRadius: arc.radius,
            startAngle: arc.startAngle,
            endAngle: arc.endAngle,
            data: null,
          })
        )
        .attr('fill', arc.background)
        .style('cursor', 'pointer')
        .on('click', arc.onClick);
    });

    textArcs.forEach((arc) => {
      const textArc = arcGenerator({
        innerRadius: arc.radius,
        outerRadius: arc.radius,
        startAngle: arc.startAngle,
        endAngle: arc.endAngle,
        data: null,
      });

      const textLength = calcTextLength(g, arc.id, arc.text, fontSize);

      const arcLength = Math.abs(arc.endAngle - arc.startAngle) * arc.radius;
      const textPercentage = (textLength / arcLength) * 100;
      const textOffsetPercentage = (100 - textPercentage) / 4;

      arcGroup.append('path').attr('id', arc.id).attr('d', textArc);

      arcGroup
        .append('text')
        .append('textPath')
        .attr('href', `#${arc.id}`)
        .attr('startOffset', `${textOffsetPercentage}%`)
        .style('font-size', fontSize)
        .style('fill', '#222')
        .text(arc.text);
    });

    clickableArcs.forEach((arc) => {
      arcGroup
        .append('path')
        .attr('class', `${arc.id}-overlay`)
        .attr(
          'd',
          arcGenerator({
            innerRadius: 0,
            outerRadius: arc.radius,
            startAngle: arc.startAngle,
            endAngle: arc.endAngle,
            data: null,
          })
        )
        .attr('fill', '#000');
      arcGroup
        .append('path')
        .attr('class', `${arc.id}-hover`)
        .attr(
          'd',
          arcGenerator({
            innerRadius: 0,
            outerRadius: arc.radius,
            startAngle: arc.startAngle,
            endAngle: arc.endAngle,
            data: null,
          })
        )
        .attr('fill', arc.background)
        .style('cursor', 'pointer')
        .on('click', arc.onClick)
        .on('mouseenter', () => {
          const halfCircle = arcGroup.select(`.${arc.id}-overlay`);
          halfCircle.classed('hover', true);
        })
        .on('mouseout', () => {
          const halfCircle = arcGroup.select(`.${arc.id}-overlay`);
          halfCircle.classed('hover', false);
        });
    });
  }

  return {
    drawBackground,
    drawCenterImage,
    drawCenter,
  };
}
