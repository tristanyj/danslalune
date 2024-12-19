export function useChartConfig() {
  // ------------------------------
  // Main Config
  // ------------------------------

  const width = 1400;
  const height = 1400;
  const margin = 1;

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
  const innerRadiusPadding = 0.2;
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
    columnCount: 2,
    statLabel: 'Statistic Name',
    categoryLabel: 'Category',
    subCategoryLabel: 'Type',
    scaleLabel: 'Scale Label',
    scales: scalePositions.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: curr === 1 ? 'NBA Record' : curr,
      };
    }, {}),
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

  const colors = {
    default: '#fefefe',
    white: '#fff',
    black: '#123',
  };

  const colorModifier = {
    default: colors.default,
    white: colors.white,
    black: colors.black,
    categoryLabel: {
      background: {
        opacity: 0.9,
      },
    },
    subCategoryLabel: {
      background: {
        opacity: {
          even: 0.6,
          odd: 0.2,
        },
      },
    },
    statLabel: {
      background: {
        opacity: {
          even: 0.7,
          odd: 0.6,
        },
      },
    },
    scaleLabel: {
      last: {
        background: {
          color: colors.white,
          opacity: 0.75,
        },
      },
      background: {
        color: colors.white,
        opacity: 0.9,
      },
    },
    separator: {
      stroke: colors.black,
      lowOpacity: 0.075,
      highOpacity: 0.7,
    },
  };

  const fontModifier = {
    statLabel: 11,
    categoryLabel: 11,
    subCategoryLabel: 11,
    scaleLabel: 10,
  };

  const spaceModifier = {
    donut: {
      arc: {
        top: 24,
        bottom: 16,
      },
    },
    categoryLabel: {
      standard: 14,
      flip: 22,
    },
    subCategoryLabel: {
      standard: 12,
      flip: 20,
    },
    scaleLabel: {
      standard: 0,
      flip: 7.5,
      start: 5,
      end: 4,
      text: {
        height: 8,
        padding: 1.5,
      },
      background: {
        standard: 4,
        flip: -3.5,
      },
    },
  };

  const radiusModifier = {
    outsideMaxStatScale: 1.0325,
    insideMinStatScale: 0.9,
    statLabel: 1.08,
  };

  const modifier = {
    radius: radiusModifier,
    space: spaceModifier,
    font: fontModifier,
    color: colorModifier,
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
    layerCount,
    legend,
    modifier,
    innerRadiusPadding,
    scalePositions,
  };
}
