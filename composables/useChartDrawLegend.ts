import type { d3GSelection } from '~/types';

import { createLine } from './useChartDrawLines';

export function useChartDrawLegend() {
  const { radius, minRadius, radiusPadding } = useChartConfig();

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

  // Function to draw a full moon (white circle)
  const drawFullMoon = (g: d3GSelection, cx: number, cy: number, radius: number) => {
    g.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', radius)
      .attr('stroke', 'black')
      .attr('fill', 'black');
  };

  // Function to draw a half moon
  const drawHalfMoon = (g: d3GSelection, cx: number, cy: number, radius: number) => {
    // Full moon circle
    g.append('circle').attr('cx', cx).attr('cy', cy).attr('r', radius).attr('fill', 'white');

    // Overlay a dark circle to create the half-moon effect
    g.append('circle')
      .attr('cx', cx + radius / 2) // Adjust this to create the half-moon effect
      .attr('cy', cy)
      .attr('r', radius)
      .attr('fill', 'black');
  };

  // Example function to add icons to the visualization
  const drawMoonPhaseIcons = (g: d3GSelection, circleScale: d3.ScaleLinear<number, number>) => {
    const iconRadius = 5; // Radius of moon icons
    const iconSpacing = 15; // Spacing between icons

    groupedByMonth.value.forEach((group, i) => {
      const angleOffset = -Math.PI / 2;

      const lowestMoon = group.sort((a, b) => a.moon - b.moon)[0];
      const highestMoon = group.sort((a, b) => b.moon - a.moon)[0];

      const lowestMoonIndex = filteredDays.value.findIndex((d) => d.id === lowestMoon.id);
      const highestMoonIndex = filteredDays.value.findIndex((d) => d.id === highestMoon.id);

      const angleHigh = circleScale(highestMoonIndex) + angleOffset;
      const angleLow = circleScale(lowestMoonIndex) + angleOffset;

      const highX = (radius - highestMoon.moon - iconSpacing) * Math.cos(angleHigh);
      const highY = (radius - highestMoon.moon - iconSpacing) * Math.sin(angleHigh);

      const lowX = (radius - lowestMoon.moon - iconSpacing) * Math.cos(angleLow);
      const lowY = (radius - lowestMoon.moon - iconSpacing) * Math.sin(angleLow);

      drawNewMoon(g, lowX, lowY, iconRadius);
      // drawHalfMoon(g, lowX, lowY, iconRadius);
      drawFullMoon(g, highX, highY, iconRadius);
    });

    // Draw each moon phase icon
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

  return {
    drawCurveLegend,
    drawMoonPhaseIcons,
  };
}
