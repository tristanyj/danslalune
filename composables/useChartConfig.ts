export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const width = 1400;
  const height = 1400;
  const margin = 50;

  // ------------------------------
  // Proportions
  // ------------------------------

  const percentages = [68, 22, 5, 5];
  const proportions = percentages.reduce<number[]>(
    (acc, curr) => [...acc, (acc[acc.length - 1] || 0) + curr / 100],
    []
  );

  // ------------------------------
  // Radius
  // ------------------------------

  const radius = Math.min(width, height) / 2 - margin;
  const innerRadiusPadding = 0.375;
  const minRadius = radius * proportions[0] * innerRadiusPadding;
  const maxRadius = radius;
  const radiusPadding = 50;

  // ------------------------------
  // Legend
  // ------------------------------

  const legend = {
    columnCount: 5,
  };

  // ------------------------------
  // Text wrapping
  // ------------------------------

  const maxWidth = 90;
  const lineHeight = 14;

  const wrap = {
    maxWidth,
    lineHeight,
  };

  // ------------------------------
  // Modifiers
  // ------------------------------

  const color = {
    separator: {
      stroke: '#168aad',
      highOpacity: 0.5,
    },
  };

  const coefficient = {
    velage: 1,
    matrice: 1,
    veau_perf: 1,
  };

  return {
    width,
    height,
    margin,
    radius,
    minRadius,
    maxRadius,
    proportions,
    wrap,
    color,
    legend,
    innerRadiusPadding,
    radiusPadding,
    coefficient,
  };
}
