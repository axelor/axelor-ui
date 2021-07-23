import { computeStyle, ComputeStyles, Config } from '../theme';

export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';

export type AlignSelf =
  | 'auto'
  | 'start'
  | 'end'
  | 'center'
  | 'baseline'
  | 'stretch';

export type AlignItems = 'start' | 'end' | 'center' | 'baseline' | 'stretch';

export type AlignContent =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'
  | 'stretch';

export type JustifyContent =
  | 'start'
  | 'end'
  | 'center'
  | 'space-around'
  | 'space-between'
  | 'space-evenly'
  | 'stretch';

export type Order = 0 | 1 | 2 | 3 | 4 | 5 | 'first' | 'last';

export interface FlexProps {
  flexDirection?: FlexDirection;
  flexWrap?: boolean | 'reverse';
  flexGrow?: 0 | 1;
  flexShrink?: 0 | 1;
  flexFill?: boolean;
  order?: Order;
  alignSelf?: AlignSelf;
  alignItems?: AlignItems;
  alignContent?: AlignContent;
  justifyContent?: JustifyContent;
}

export const FlexConfig: Config<FlexProps> = {
  flexDirection: true,
  flexWrap: true,
  flexGrow: true,
  flexShrink: true,
  flexFill: true,
  order: true,
  alignSelf: true,
  alignItems: true,
  alignContent: true,
  justifyContent: true,
};

const withSpace = (value?: string) => value?.replace('space-', '');

export const flexStyles: ComputeStyles<FlexProps> = (
  {
    flexDirection,
    flexWrap,
    flexGrow,
    flexShrink,
    flexFill,
    order,
    alignSelf,
    alignItems,
    alignContent,
    justifyContent,
  },
  size
) => {
  return [
    computeStyle('flex', flexDirection, size),
    computeStyle('justify-content', withSpace(justifyContent), size),
    computeStyle('align-items', alignItems, size),
    computeStyle('align-self', alignSelf, size),
    computeStyle('flex', flexFill ? 'fill' : null, size),
    computeStyle('flex-grow', flexGrow, size),
    computeStyle('flex-shrink', flexShrink, size),
    computeStyle('flex', flexWrap === true ? 'wrap' : null, size),
    computeStyle('flex', flexWrap === false ? 'nowrap' : null, size),
    computeStyle('flex', flexWrap === 'reverse' ? 'wrap-reverse' : null, size),
    computeStyle('order', order, size),
    computeStyle('align-content', withSpace(alignContent), size),
  ];
};
