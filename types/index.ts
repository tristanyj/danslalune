import type { StatKey, CategoryKey, SubCategoryKey, PlayerKey } from './dataset';

export * from './dataset';

// --------------------------------
// Dataset
// --------------------------------

export type ScaleType = 'linear' | 'log';
export type FormatType = 'number' | 'percent';

interface BasePlayer {
  id: PlayerKey;
  color: `#${string}`;
  info: {
    name: string;
    nickname: string;
    position: string;
    shooting_hand: string;
    height: string;
    weight: string;
    birth_date: string;
    draft: [number, number];
    experience: number;
    teams: string[];
  };
}

export interface SelectablePlayer extends BasePlayer {
  winShares: number;
}

export interface Player extends BasePlayer {
  stats: Record<StatKey, number>;
}

export interface Category {
  id: CategoryKey;
  name: string;
  color: `#${string}`;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: SubCategoryKey;
  name: string;
  color: `#${string}`;
  stats: Stat[];
}

export interface Stat {
  id: StatKey;
  name: string;
  description: string | null;
  abbreviation: string;
  color: `#${string}`;
  meta: {
    domain: [number, number];
    scaleType: ScaleType;
    formatType: FormatType;
  };
  record: {
    value: number;
    name: string;
  };
}

export interface EnrichedCategory extends Category {
  subCategories: EnrichedSubCategory[];
}

export interface EnrichedSubCategory extends SubCategory {
  stats: EnrichedStat[];
}

export interface EnrichedStat extends Stat {
  meta: Stat['meta'] & {
    scale: (value: number) => number;
    format: (value: number, decimals: number) => string;
  };
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

export interface StatLabelArc {
  id: string;
  index: number;
  stat: EnrichedStat;
  category: Category;
  subCategory: SubCategory;
  startAngle: number;
  endAngle: number;
}

export interface StatArc extends StatLabelArc {
  value: number;
  statValue: string;
  player: Player;
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

export type SortOption = {
  label: string;
  key: string;
};

interface Tooltip {
  id: string;
  category: {
    name: string;
    color: `#${string}`;
  };
  subCategory: {
    name: string;
  };
  stat: {
    name: string;
    description: string | null;
    abbreviation: string;
  };
  record: {
    value: string;
    holder: string;
  };
}

export interface TooltipStat extends Tooltip {
  player: {
    id: PlayerKey;
    name: string;
    color: `#${string}`;
  };
  value: string;
}

export interface ToolTipStatLabel extends Tooltip {
  id: string;
}

// --------------------------------
// Player
// --------------------------------

export interface StatFilters {
  selectedOnly: boolean;
  categories: Record<string, boolean>;
  subCategories: Record<string, boolean>;
}

export interface PlayerFilters {
  selectedOnly: boolean;
  heightRange: [number, number];
  weightRange: [number, number];
  yearsRange: [number, number];
  positions: Record<'PG' | 'SG' | 'SF' | 'PF' | 'C', boolean>;
}
