import { computeStyle, ComputeStyles, Config } from '../theme';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type FlexJustify =
  | 'start'
  | 'end'
  | 'center'
  | 'between'
  | 'around'
  | 'evenly';

export type FlexAlign = 'start' | 'end' | 'center' | 'baseline' | 'stretch';

export type FlexAlignContent =
  | 'start'
  | 'end'
  | 'center'
  | 'around'
  | 'stretch';

export type FlexOrder = 0 | 1 | 2 | 3 | 4 | 5 | 'first' | 'last';

export interface FlexProps {
  flexDirection?: FlexDirection;
  flexWrap?: boolean | 'reverse';
  flexGrow?: 0 | 1;
  flexShrink?: 0 | 1;
  flexFill?: boolean;
  flexOrder?: FlexOrder;
  alignSelf?: FlexAlign;
  alignItems?: FlexAlign;
  alignContent?: FlexAlignContent;
  justifyContent?: FlexJustify;
}

export const FlexConfig: Config<FlexProps> = {
  flexDirection: true,
  flexWrap: true,
  flexGrow: true,
  flexShrink: true,
  flexFill: true,
  flexOrder: true,
  alignSelf: true,
  alignItems: true,
  alignContent: true,
  justifyContent: true,
};

export const flexStyles: ComputeStyles<FlexProps> = (
  {
    flexDirection,
    flexWrap,
    flexGrow,
    flexShrink,
    flexFill,
    flexOrder,
    alignSelf,
    alignItems,
    alignContent,
    justifyContent,
  },
  size
) => {
  return [
    computeStyle('flex', flexDirection, size),
    computeStyle('justify-content', justifyContent, size),
    computeStyle('align-items', alignItems, size),
    computeStyle('align-self', alignSelf, size),
    computeStyle('flex', flexFill ? 'fill' : null, size),
    computeStyle('flex-grow', flexGrow, size),
    computeStyle('flex-shrink', flexShrink, size),
    computeStyle('flex', flexWrap === true ? 'wrap' : null, size),
    computeStyle('flex', flexWrap === false ? 'nowrap' : null, size),
    computeStyle('flex', flexWrap === 'reverse' ? 'wrap-reverse' : null, size),
    computeStyle('order', flexOrder, size),
    computeStyle('align-content', alignContent, size),
  ];
};
