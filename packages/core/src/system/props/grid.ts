import { computeCss, ComputeStyles, Config } from '../theme';

export type GridGap = string | number | 'normal';
export type GridLine = string | 'auto';
export type GridAutoLine = GridLine | 'min-content' | 'max-content';
export type GridTemplate =
  | string
  | 'none'
  | 'auto'
  | 'subgrid'
  | 'masonry'
  | 'min-content'
  | 'max-content';

export interface GridProps {
  gridGap?: GridGap;
  gridRowGap?: GridGap;
  gridColumnGap?: GridGap;
  gridRow?: GridLine;
  gridColumn?: GridLine;
  gridRowEnd?: GridLine;
  gridColumnEnd?: GridLine;
  gridAutoRows?: GridAutoLine;
  gridAutoColumns?: GridAutoLine;
  gridAutoFlow?: 'row' | 'column' | 'dense';
  gridTemplateRows?: GridTemplate;
  gridTemplateColumns?: GridTemplate;
  gridTemplateAreas?: 'none' | string;
  gridArea?: 'auto' | string;
}

export const GridConfig: Config<GridProps> = {
  gridGap: true,
  gridRowGap: true,
  gridColumnGap: true,
  gridRow: true,
  gridColumn: true,
  gridRowEnd: true,
  gridColumnEnd: true,
  gridAutoRows: true,
  gridAutoColumns: true,
  gridAutoFlow: true,
  gridTemplateRows: true,
  gridTemplateColumns: true,
  gridTemplateAreas: true,
  gridArea: true,
};

export const gridStyles: ComputeStyles<GridProps> = (
  {
    gridGap,
    gridRowGap,
    gridColumnGap,
    gridRow,
    gridColumn,
    gridRowEnd,
    gridColumnEnd,
    gridAutoRows,
    gridAutoColumns,
    gridAutoFlow,
    gridTemplateRows,
    gridTemplateColumns,
    gridTemplateAreas,
    gridArea,
  },
  size
) => {
  return [
    computeCss('gridGap', gridGap, size),
    computeCss('gridRowGap', gridRowGap, size),
    computeCss('gridColumnGap', gridColumnGap, size),
    computeCss('gridRow', gridRow, size),
    computeCss('gridColumn', gridColumn, size),
    computeCss('gridRowEnd', gridRowEnd, size),
    computeCss('gridColumnEnd', gridColumnEnd, size),
    computeCss('gridAutoRows', gridAutoRows, size),
    computeCss('gridAutoColumns', gridAutoColumns, size),
    computeCss('gridAutoFlow', gridAutoFlow, size),
    computeCss('gridTemplateRows', gridTemplateRows, size),
    computeCss('gridTemplateColumns', gridTemplateColumns, size),
    computeCss('gridTemplateAreas', gridTemplateAreas, size),
    computeCss('gridArea', gridArea, size),
  ];
};
