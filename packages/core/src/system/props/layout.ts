import CSS from 'csstype';
import { computeVar, ComputeStyles, Config } from '../theme';

export interface FlexProps {
  flex?: CSS.Property.Flex;
  flexBasis?: CSS.Property.FlexBasis;
  flexDirection?: CSS.Property.FlexDirection;
  flexFlow?: CSS.Property.FlexFlow;
  flexGrow?: CSS.Property.FlexGrow;
  flexShrink?: CSS.Property.FlexShrink;
  flexWrap?: CSS.Property.FlexWrap;
  order?: CSS.Property.Order;
  justifyContent?: CSS.Property.JustifyContent;
  alignContent?: CSS.Property.AlignContent;
  alignItems?: CSS.Property.AlignItems;
  alignSelf?: CSS.Property.AlignSelf;
  placeContent?: CSS.Property.PlaceContent;
  placeItems?: CSS.Property.PlaceItems;
  rowGap?: CSS.Property.RowGap | number;
  columnGap?: CSS.Property.ColumnGap | number;
  gap?: CSS.Property.Gap | number;
}

export const FlexConfig = {
  flex: true,
  flexBasis: true,
  flexDirection: true,
  flexFlow: true,
  flexGrow: true,
  flexShrink: true,
  flexWrap: true,
  order: true,
  justifyContent: true,
  alignContent: true,
  alignItems: true,
  alignSelf: true,
  placeContent: true,
  placeItems: true,
  rowGap: true,
  columnGap: true,
  gap: true,
};

export interface GridProps {
  gridGap?: CSS.Property.GridGap | number;
  gridRowGap?: CSS.Property.GridRowGap | number;
  gridColumnGap?: CSS.Property.GridColumnGap | number;
  gridRow?: CSS.Property.GridRow;
  gridColumn?: CSS.Property.GridColumn;
  gridRowEnd?: CSS.Property.GridRowEnd;
  gridColumnEnd?: CSS.Property.GridColumnEnd;
  gridAutoRows?: CSS.Property.GridAutoRows;
  gridAutoColumns?: CSS.Property.GridAutoColumns;
  gridAutoFlow?: CSS.Property.GridAutoFlow;
  gridTemplate?: CSS.Property.GridTemplate;
  gridTemplateRows?: CSS.Property.GridTemplateRows;
  gridTemplateColumns?: CSS.Property.GridTemplateColumns;
  gridTemplateAreas?: CSS.Property.GridTemplateAreas;
  gridArea?: CSS.Property.GridArea;
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

const toPixel = (value: any) =>
  typeof value === 'number' ? `${value}px` : value;

export const flexStyles: ComputeStyles<FlexProps> = (
  {
    flex,
    flexBasis,
    flexDirection,
    flexFlow,
    flexGrow,
    flexShrink,
    flexWrap,
    order,
    justifyContent,
    alignContent,
    alignItems,
    alignSelf,
    placeContent,
    placeItems,
    rowGap,
    columnGap,
    gap,
  },
  size
) => {
  return [
    computeVar('flex', flex, size),
    computeVar('flex-basis', flexBasis, size),
    computeVar('flex-direction', flexDirection, size),
    computeVar('flex-flow', flexFlow, size),
    computeVar('flex-grow', flexGrow, size),
    computeVar('flex-shrink', flexShrink, size),
    computeVar('flex-wrap', flexWrap, size),
    computeVar('order', order, size),
    computeVar('justify-content', justifyContent, size),
    computeVar('align-content', alignContent, size),
    computeVar('align-items', alignItems, size),
    computeVar('align-self', alignSelf, size),
    computeVar('place-content', placeContent, size),
    computeVar('place-items', placeItems, size),
    computeVar('row-gap', toPixel(rowGap), size),
    computeVar('column-gap', toPixel(columnGap), size),
    computeVar('gap', toPixel(gap), size),
  ];
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
    computeVar('grid-gap', toPixel(gridGap), size),
    computeVar('grid-row-gap', toPixel(gridRowGap), size),
    computeVar('grid-column-gap', toPixel(gridColumnGap), size),
    computeVar('grid-row', gridRow, size),
    computeVar('grid-column', gridColumn, size),
    computeVar('grid-row-end', gridRowEnd, size),
    computeVar('grid-column-end', gridColumnEnd, size),
    computeVar('grid-auto-rows', gridAutoRows, size),
    computeVar('grid-auto-columns', gridAutoColumns, size),
    computeVar('grid-auto-flow', gridAutoFlow, size),
    computeVar('grid-template-rows', gridTemplateRows, size),
    computeVar('grid-template-columns', gridTemplateColumns, size),
    computeVar('grid-template-areas', gridTemplateAreas, size),
    computeVar('grid-area', gridArea, size),
  ];
};
