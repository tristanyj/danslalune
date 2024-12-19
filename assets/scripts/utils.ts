import type { d3GSelection, FormatType } from '~/types';

function wrapText(text: string, width: number): string[] {
  const words = text.split(/\s+/).reverse();
  const lines: string[] = [];
  let line: string[] = [];
  let lineLength = 0;
  const spaceWidth = 4; // Approximate space width

  while (words.length > 0) {
    const word = words.pop()!;
    const wordWidth = word.length * 5.5; // Approximate width per character

    if (lineLength + wordWidth + (line.length > 0 ? spaceWidth : 0) > width) {
      if (line.length > 0) {
        lines.push(line.join(' '));
        line = [word];
        lineLength = wordWidth;
      } else {
        // If single word is too long, just add it
        lines.push(word);
      }
    } else {
      line.push(word);
      lineLength += wordWidth + (line.length > 0 ? spaceWidth : 0);
    }
  }

  if (line.length > 0) {
    lines.push(line.join(' '));
  }

  return lines;
}

function formatNumber(value: number, decimals?: number): string {
  if (value < 1e3) return value.toFixed(decimals ?? 1);
  if (value < 1e6) return `${(value / 1e3).toFixed(decimals ?? 1)}k`;
  if (value < 1e9) return `${value / 1e6}M`;
  return `${value / 1e9}B`;
}

function shouldFlipText(midAngle: number) {
  return midAngle > Math.PI / 2 && midAngle < (3 * Math.PI) / 2;
}

function calcTextLength(g: d3GSelection, id: string, text: string, fontSize: number) {
  const tempText = g
    .append('text')
    .text(text)
    .style('font-size', `${fontSize}px`)
    .style('visibility', 'hidden');

  const bbox = tempText.node()?.getBBox();
  const textLength = bbox ? bbox.width : 0;
  tempText.remove();
  return textLength;
}

function withUnit(value: number, formatType: FormatType) {
  switch (formatType) {
    case 'percent':
      return `${value}%`;
    default:
      return `${value}`;
  }
}

const escapeSelector = (id: string) => {
  return id.replace(/[.]/g, '\\.');
};

const heightToInches = (height: string): number => {
  const [feet, inches] = height.split('-').map(Number);
  return feet * 12 + inches;
};

const formatString = (str: string): string => {
  return str
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const isDefaultRange = (range: number[], defaultRange: number[]) => {
  return range[0] === defaultRange[0] && range[1] === defaultRange[1];
};

const getChunks = (
  array: {
    id: string;
    name: string;
  }[],
  columns: number
) => {
  const numberOfChunks = array.length < 4 ? 1 : array.length < 7 ? 2 : columns;

  const chunkSize = Math.ceil(array.length / numberOfChunks);
  const chunks: (typeof array)[] = Array(numberOfChunks)
    .fill([])
    .map(() => []);

  array.forEach((item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    if (chunkIndex < numberOfChunks) {
      chunks[chunkIndex].push(item);
    }
  });

  return chunks;
};

export {
  wrapText,
  formatNumber,
  shouldFlipText,
  calcTextLength,
  withUnit,
  escapeSelector,
  heightToInches,
  formatString,
  isDefaultRange,
  getChunks,
};
