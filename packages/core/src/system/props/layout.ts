import CSS from 'csstype';
import { Config } from '../types';
import { toPixel } from '../utils';

const convert = (value: any) => value;

const computeVar = (name: string, conv = convert) => (value: any, breakpoint?: string) => {
  const className = breakpoint
    ? `l-${name}-${breakpoint}`
    : `l-${name}`;

  const styles = {
    [`--${className}`]: conv(value),
  };

  return {
    classes: [className],
    styles,
  };
}

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

export const FlexConfig: Config<FlexProps> = {
  flex: computeVar('flex'),
  flexBasis: computeVar('flex-basis'),
  flexDirection: computeVar('flex-direction'),
  flexFlow: computeVar('flex-flow'),
  flexGrow: computeVar('flex-grow'),
  flexShrink: computeVar('flex-shrink'),
  flexWrap: computeVar('flex-wrap'),
  order: computeVar('order'),
  justifyContent: computeVar('justify-content'),
  alignContent: computeVar('align-content'),
  alignItems: computeVar('align-items'),
  alignSelf: computeVar('align-self'),
  placeContent: computeVar('place-content'),
  placeItems: computeVar('place-items'),
  rowGap: computeVar('row-gap', toPixel),
  columnGap: computeVar('column-gap', toPixel),
  gap: computeVar('gap', toPixel),
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
  gridGap: computeVar('grid-gap', toPixel),
  gridRowGap: computeVar('grid-row-gap', toPixel),
  gridColumnGap: computeVar('grid-column-gap', toPixel),
  gridRow: computeVar('grid-row'),
  gridColumn: computeVar('grid-column'),
  gridRowEnd: computeVar('grid-row-end'),
  gridColumnEnd: computeVar('grid-column-end'),
  gridAutoRows: computeVar('grid-auto-rows'),
  gridAutoColumns: computeVar('grid-auto-columns'),
  gridAutoFlow: computeVar('grid-auto-flow'),
  gridTemplateRows: computeVar('grid-template-rows'),
  gridTemplateColumns: computeVar('grid-template-columns'),
  gridTemplateAreas: computeVar('grid-template-areas'),
  gridArea: computeVar('grid-area'),
};
