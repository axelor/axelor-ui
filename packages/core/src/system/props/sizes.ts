import { Config } from "../types";

export type TVerticalAlignment =
  | 'baseline'
  | 'top'
  | 'middle'
  | 'bottom'
  | 'text-top'
  | 'text-bottom';

export type TDimension = 25 | 50 | 75 | 100 | 'auto';

export interface SizeProps {
  verticalAlign?: TVerticalAlignment;
  overflow?: 'auto' | 'hidden' | 'visible' | 'scroll';
  float?: 'start' | 'end' | 'none';

  w?: TDimension;
  h?: TDimension;

  maxW?: boolean;
  maxH?: boolean;

  vw?: boolean;
  vh?: boolean;

  minVW?: boolean;
  minVH?: boolean;
}

const size = (cls: string) => (value: any, breakpoint?: string) => {
  return breakpoint
    ? `${cls}-${breakpoint}-${value}`
    : `${cls}-${value}`;
}

export const SizeConfig: Config<SizeProps> = {
  verticalAlign: size('align'),
  overflow: size('overflow'),
  float: size('float'),

  w: size('w'),
  h: size('h'),

  maxW: size('mw'),
  maxH: size('mh'),

  vw: size('vw'),
  vh: size('vh'),

  minVW: size('min-vw'),
  minVH: size('min-vh'),
};
