import { computeCss, computeStyle, ComputeStyles, Config } from '../theme';
import CSS from 'csstype';

export type TVerticalAlignment =
  | 'baseline'
  | 'top'
  | 'middle'
  | 'bottom'
  | 'text-top'
  | 'text-bottom';

export type TDimension = 25 | 50 | 75 | 100 | 'auto';

export interface LayoutProps {
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

  width?: CSS.Property.Width | number;
  height?: CSS.Property.Height | number;

  minWidth?: CSS.Property.MinWidth | number;
  minHeight?: CSS.Property.MinWidth | number;

  maxWidth?: CSS.Property.MaxWidth | number;
  maxHeight?: CSS.Property.MaxWidth | number;
}

export const LayoutConfig: Config<LayoutProps> = {
  verticalAlign: true,
  overflow: true,
  float: true,

  w: true,
  h: true,

  maxW: true,
  maxH: true,

  vw: true,
  vh: true,

  minVW: true,
  minVH: true,

  width: true,
  height: true,

  minWidth: true,
  minHeight: true,

  maxWidth: true,
  maxHeight: true,
};

export const layoutStyles: ComputeStyles<LayoutProps> = ({
  verticalAlign,
  overflow,
  float,

  w,
  h,

  maxW,
  maxH,

  width,
  height,

  minWidth,
  minHeight,

  maxWidth,
  maxHeight,

  vw,
  vh,

  minVW,
  minVH,
}) => {
  return [
    computeStyle('align', verticalAlign),
    computeStyle('overflow', overflow),
    computeStyle('float', float),
    computeStyle('w', w),
    computeStyle('h', h),
    computeStyle('mw', maxW),
    computeStyle('mh', maxH),
    computeStyle('vw', vw),
    computeStyle('vh', vh),
    computeStyle('min-vw', minVW),
    computeStyle('min-vh', minVH),
    computeCss('width', width),
    computeCss('height', height),
    computeCss('maxWidth', maxWidth),
    computeCss('maxHeight', maxHeight),
    computeCss('minWidth', minWidth),
    computeCss('minHeight', minHeight),
  ];
};
