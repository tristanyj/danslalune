import * as d3Pkg from 'd3';
import type { d3GSelection, FilteredDay, Line } from '~/types';
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
  const { radius, minRadius, color } = useChartConfig();

  const { arcGenerator } = useChartGenerators();

  const configStore = useConfigStore();
  const { filteredDays } = storeToRefs(configStore);

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

    createLine(g, {
      className: 'separator',
      y1: minRadius,
      y2: radius,
      transform: `rotate(${180 + (circleScale(0) * 180) / Math.PI})`,
      stroke: color.separator.stroke,
      opacity: 0.25,
    });

    createLine(g, {
      className: 'separator',
      y1: minRadius,
      y2: radius,
      transform: `rotate(${180 + (circleScale(filteredDays.value.length - 1) * 180) / Math.PI})`,
      stroke: color.separator.stroke,
      opacity: 0.25,
    });
  }

  function drawCategoryCurve(g: d3GSelection, circleScale: d3.ScaleLinear<number, number>) {
    const group = g.append('g').attr('class', 'category-curve');
    const radiusScope = minRadius;
    const padding = 42;

    for (let i = 0; i < 7; i++) {
      group
        .append('circle')
        .attr('r', radiusScope + i * padding)
        .attr('fill', 'none')
        .attr('stroke', 'blue')
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

    group
      .append('path')
      .datum(closedData)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .attr('d', lineGenerator);

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
    console.log(values);

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
      .attr('fill', 'green')
      .attr('opacity', 0.5)
      .attr('d', areaBaseGenerator);

    group
      .append('path')
      .datum(smoothedData)
      .attr('fill', 'lightblue') // Fill color for the area
      .attr('opacity', 0.5) // Opacity for better visualization
      .attr('d', areaGenerator);

    // arc

    // for (let i = 0; i < closedData.length; i++) {
    //   const d = closedData[i];
    //   const startAngle = circleScale(i);
    //   const endAngle = circleScale(i + 1);
    //   const arc = arcGenerator({
    //     innerRadius: minRadius,
    //     outerRadius: minRadius + d.value * padding,
    //     startAngle,
    //     endAngle,
    //     data: d,
    //   });
    //   group.append('path').attr('d', arc).attr('fill', 'red').attr('opacity', 0.5);
    // }
  }

  return {
    drawCircularSeparators,
    drawLinearSeparators,
    drawCategoryCurve,
  };
}
