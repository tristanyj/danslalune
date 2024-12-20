import type { d3GSelection } from '~/types';

export function useChartDrawGradient() {
  const drawMoonPhaseGradient = (g: d3GSelection) => {
    const defs = g.append('defs');

    const gradient = defs
      .append('radialGradient')
      .attr('id', 'moonGradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%')
      .attr('fx', '50%')
      .attr('fy', '50%');

    gradient.append('stop').attr('offset', '85%').attr('stop-color', '#222');

    gradient.append('stop').attr('offset', '100%').attr('stop-color', '#0096c7');
  };

  return {
    drawMoonPhaseGradient,
  };
}
