<template>
  <div
    id="pattern"
    ref="pattern"
    class="relative top-[200px] left-[200px]"
  />
</template>

<script setup>
import { select } from 'd3';

onMounted(() => {
  const width = 250;
  const height = 250;
  const numLines = 45;
  const innerRadius = 87;
  const outerRadius = 100;
  const strokeWidth = 4;

  const svg = select('#pattern').append('svg').attr('width', width).attr('height', height);
  const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);
  const group = g.append('g').attr('class', 'pattern-group');

  for (let i = 0; i < numLines; i++) {
    const angle = (i / numLines) * (Math.PI * 2);

    group
      .append('line')
      .attr('x1', Math.cos(angle) * innerRadius)
      .attr('y1', Math.sin(angle) * innerRadius)
      .attr('x2', Math.cos(angle) * outerRadius)
      .attr('y2', Math.sin(angle) * outerRadius)
      .attr('stroke', 'white')
      .attr('stroke-width', strokeWidth);
  }

  group
    .append('circle')
    .attr('r', innerRadius)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', strokeWidth);

  group
    .append('circle')
    .attr('r', outerRadius)
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', strokeWidth);
});
</script>
