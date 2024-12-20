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
  const innerRadiusPadding = 0.5;
  const minRadius = radius * proportions[0] * innerRadiusPadding;
  const restRadius = radius * proportions[0] * (1 - innerRadiusPadding);
  const maxRadius = radius;

  // ------------------------------
  // Positions
  // ------------------------------

  const scalePositions = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0];
  const layerCount = 20;

  // ------------------------------
  // Legend
  // ------------------------------

  const legend = {
    columnCount: 10,
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
      stroke: '#000',
      highOpacity: 0.5,
    },
  };

  return {
    width,
    height,
    margin,
    radius,
    minRadius,
    maxRadius,
    restRadius,
    proportions,
    wrap,
    color,
    legend,
    layerCount,
    innerRadiusPadding,
    scalePositions,
  };
}
