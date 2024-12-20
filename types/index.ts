// --------------------------------
// Dataset
// --------------------------------

export type CategoryKey = 'velage' | 'matrice' | 'veau_perf' | 'agnelage';

export interface Day extends Record<CategoryKey, number> {
  date: string;
  moon: number;
}

export interface FilteredDay {
  id: string;
  moon: number;
  value: number;
}

// --------------------------------
// D3
// --------------------------------

export type d3GSelection = d3.Selection<SVGGElement, unknown, null, undefined>;

export interface Arc {
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export interface Area {
  angle: number;
  minRadius: number;
  maxRadius: number;
}

export interface Point {
  angle: number;
  radius: number;
}

export interface DayArc {
  id: string;
  index: number;
  color: `#${string}`;
  startAngle: number;
  endAngle: number;
}

export interface Line {
  className: string;
  y1: number;
  y2: number;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  transform: string;
}

// --------------------------------
// UI
// --------------------------------

export interface Tooltip {
  id: string;
}
