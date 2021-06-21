import React from 'react';
import { Responsive } from './theme';
import {
  BackgroundProps,
  BackgroundConfig,
  backgroundStyles,
  BorderProps,
  BorderConfig,
  borderStyles,
  EffectProps,
  EffectConfig,
  effectStyles,
  InteractiveProps,
  InteractiveConfig,
  interactiveStyles,
  DisplayProps,
  DisplayPrintProps,
  DisplayConfig,
  displayStyles,
  LayoutProps,
  LayoutConfig,
  layoutStyles,
  PositionProps,
  PositionConfig,
  positionStyles,
  SpaceProps,
  SpaceConfig,
  spaceStyles,
  TextProps,
  TextAlignProps,
  TextConfig,
  textStyles,
  FlexProps,
  FlexConfig,
  flexStyles,
} from './props';

export interface StyleProps
  extends BackgroundProps,
    BorderProps,
    EffectProps,
    InteractiveProps,
    DisplayProps,
    DisplayPrintProps,
    LayoutProps,
    PositionProps,
    SpaceProps,
    TextProps,
    TextAlignProps,
    FlexProps {}

export interface SystemProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof StyleProps>,
    StyleProps,
    Responsive<SpaceProps & DisplayProps & TextAlignProps & FlexProps> {}

const sizes = ['sm', 'md', 'lg', 'xl', 'xxl'];

const configs = [
  BackgroundConfig,
  BorderConfig,
  SpaceConfig,
  EffectConfig,
  InteractiveConfig,
  DisplayConfig,
  LayoutConfig,
  PositionConfig,
  TextConfig,
  FlexConfig,
];

const compute = [
  backgroundStyles,
  borderStyles,
  spaceStyles,
  effectStyles,
  interactiveStyles,
  displayStyles,
  layoutStyles,
  positionStyles,
  textStyles,
  flexStyles,
];

export const omitStyles = (props: SystemProps) => {
  var keys = configs.flatMap(c => Object.keys(c));
  var result: any = { ...props };
  keys.forEach(k => delete result[k]);
  sizes.forEach(k => delete result[k]);
  return result;
};

export const makeStyles = (props: SystemProps) => {
  var base = compute;
  var resp = compute.filter(fn => fn.length === 2);
  return [
    base.flatMap(fn => fn(props)),
    (sizes as Array<any>).flatMap(n => {
      const nested = (props as any)[n];
      return nested ? resp.flatMap(fn => fn((props as any)[n], n)) : [];
    }),
  ];
};
