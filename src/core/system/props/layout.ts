import CSS from "csstype";
import { SpaceValue } from ".";
import { Config, Responsive } from "../types";
import { toPixel } from "../utils";

const convert = (value: any) => value;

const computeVar =
  (name: string, conv = convert) =>
  (value: any, breakpoint?: string) => {
    const className = breakpoint ? `l-${name}-${breakpoint}` : `l-${name}`;

    const styles = {
      [`--${className}`]: conv(value),
    };

    return {
      classes: [className],
      styles,
    };
  };

const computeGap = (value: SpaceValue | undefined, breakpoint?: string) => {
  return value || value === 0
    ? breakpoint
      ? `gap-${breakpoint}-${value}`
      : `gap-${value}`
    : undefined;
};

export interface FlexProps {
  flex?: Responsive<CSS.Property.Flex>;
  flexBasis?: Responsive<CSS.Property.FlexBasis>;
  flexDirection?: Responsive<CSS.Property.FlexDirection>;
  flexFlow?: Responsive<CSS.Property.FlexFlow>;
  flexGrow?: Responsive<CSS.Property.FlexGrow>;
  flexShrink?: Responsive<CSS.Property.FlexShrink>;
  flexWrap?: Responsive<CSS.Property.FlexWrap>;
  order?: Responsive<CSS.Property.Order>;
  justifyContent?: Responsive<CSS.Property.JustifyContent>;
  alignContent?: Responsive<CSS.Property.AlignContent>;
  alignItems?: Responsive<CSS.Property.AlignItems>;
  alignSelf?: Responsive<CSS.Property.AlignSelf>;
  placeContent?: Responsive<CSS.Property.PlaceContent>;
  placeItems?: Responsive<CSS.Property.PlaceItems>;
  rowGap?: Responsive<CSS.Property.RowGap | number>;
  columnGap?: Responsive<CSS.Property.ColumnGap | number>;
  gap?: Responsive<CSS.Property.Gap | number>;
  g?: Responsive<SpaceValue>;
}

export const FlexConfig: Config<FlexProps> = {
  flex: computeVar("flex"),
  flexBasis: computeVar("flex-basis"),
  flexDirection: computeVar("flex-direction"),
  flexFlow: computeVar("flex-flow"),
  flexGrow: computeVar("flex-grow"),
  flexShrink: computeVar("flex-shrink"),
  flexWrap: computeVar("flex-wrap"),
  order: computeVar("order"),
  justifyContent: computeVar("justify-content"),
  alignContent: computeVar("align-content"),
  alignItems: computeVar("align-items"),
  alignSelf: computeVar("align-self"),
  placeContent: computeVar("place-content"),
  placeItems: computeVar("place-items"),
  rowGap: computeVar("row-gap", toPixel),
  columnGap: computeVar("column-gap", toPixel),
  gap: computeVar("gap", toPixel),
  g: computeGap,
};

export interface GridProps {
  gridGap?: Responsive<CSS.Property.GridGap | number>;
  gridRowGap?: Responsive<CSS.Property.GridRowGap | number>;
  gridColumnGap?: Responsive<CSS.Property.GridColumnGap | number>;
  gridRow?: Responsive<CSS.Property.GridRow>;
  gridColumn?: Responsive<CSS.Property.GridColumn>;
  gridRowEnd?: Responsive<CSS.Property.GridRowEnd>;
  gridColumnEnd?: Responsive<CSS.Property.GridColumnEnd>;
  gridAutoRows?: Responsive<CSS.Property.GridAutoRows>;
  gridAutoColumns?: Responsive<CSS.Property.GridAutoColumns>;
  gridAutoFlow?: Responsive<CSS.Property.GridAutoFlow>;
  gridTemplate?: Responsive<CSS.Property.GridTemplate>;
  gridTemplateRows?: Responsive<CSS.Property.GridTemplateRows>;
  gridTemplateColumns?: Responsive<CSS.Property.GridTemplateColumns>;
  gridTemplateAreas?: Responsive<CSS.Property.GridTemplateAreas>;
  gridArea?: Responsive<CSS.Property.GridArea>;
  gap?: Responsive<CSS.Property.Gap | number>;
  g?: Responsive<SpaceValue>;
}

export const GridConfig: Config<GridProps> = {
  gridGap: computeVar("grid-gap", toPixel),
  gridRowGap: computeVar("grid-row-gap", toPixel),
  gridColumnGap: computeVar("grid-column-gap", toPixel),
  gridRow: computeVar("grid-row"),
  gridColumn: computeVar("grid-column"),
  gridRowEnd: computeVar("grid-row-end"),
  gridColumnEnd: computeVar("grid-column-end"),
  gridAutoRows: computeVar("grid-auto-rows"),
  gridAutoColumns: computeVar("grid-auto-columns"),
  gridAutoFlow: computeVar("grid-auto-flow"),
  gridTemplateRows: computeVar("grid-template-rows"),
  gridTemplateColumns: computeVar("grid-template-columns"),
  gridTemplateAreas: computeVar("grid-template-areas"),
  gridArea: computeVar("grid-area"),
  gap: computeVar("gap", toPixel),
  g: computeGap,
};
