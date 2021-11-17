import { computeCss, computeStyle, ComputeStyles, Config } from '../theme';
import CSS from 'csstype';

export type TVerticalAlignment =
  | 'baseline'
  | 'top'
  | 'middle'
  | 'bottom'
  | 'text-top'
  | 'text-bottom';

export interface LayoutProps {
  verticalAlign?: TVerticalAlignment;
  overflow?: 'auto' | 'hidden' | 'visible' | 'scroll';
  float?: 'start' | 'end' | 'none';

  w?: CSS.Property.Width | number;
  width?: CSS.Property.Width | number;

  h?: CSS.Property.Height | number;
  height?: CSS.Property.Height | number;

  maxW?: CSS.Property.MaxWidth | number;
  maxWidth?: CSS.Property.MaxWidth | number;
  maxH?: CSS.Property.MaxHeight | number;
  maxHeight?: CSS.Property.MaxWidth | number;

  vw?: boolean;
  vh?: boolean;

  minVW?: boolean;
  minVH?: boolean;
}

export const LayoutConfig: Config<LayoutProps> = {
  verticalAlign: true,
  overflow: true,
  float: true,

  w: true,
  width: true,

  h: true,
  height: true,

  maxW: true,
  maxWidth: true,
  maxH: true,
  maxHeight: true,

  vw: true,
  vh: true,

  minVW: true,
  minVH: true,
};

export const layoutStyles: ComputeStyles<LayoutProps> = ({
  verticalAlign,
  overflow,
  float,

  w,
  width,

  h,
  height,

  maxW,
  maxWidth,
  maxH,
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
    computeCss('width', w ?? width),
    computeCss('height', h ?? height),
    computeCss('minWidth', maxW ?? maxWidth),
    computeCss('minHeight', maxH ?? maxHeight),
    computeStyle('vw', vw),
    computeStyle('vh', vh),
    computeStyle('min-vw', minVW),
    computeStyle('min-vh', minVH),
  ];
};
