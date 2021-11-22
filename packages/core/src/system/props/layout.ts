import CSS from 'csstype';
import { computeCss, ComputeStyles, Config } from '../theme';

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
    computeCss('flex', flex, size),
    computeCss('flexBasis', flexBasis, size),
    computeCss('flexDirection', flexDirection, size),
    computeCss('flexFlow', flexFlow, size),
    computeCss('flexGrow', flexGrow, size),
    computeCss('flexShrink', flexShrink, size),
    computeCss('flexWrap', flexWrap, size),
    computeCss('order', order, size),
    computeCss('justifyContent', justifyContent, size),
    computeCss('alignContent', alignContent, size),
    computeCss('alignItems', alignItems, size),
    computeCss('alignSelf', alignSelf, size),
    computeCss('placeContent', placeContent, size),
    computeCss('placeItems', placeItems, size),
    computeCss('rowGap', rowGap, size),
    computeCss('columnGap', columnGap, size),
    computeCss('gap', gap, size),
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
