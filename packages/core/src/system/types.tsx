import * as React from 'react';

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
  SizeProps,
  SizeConfig,
  sizeStyles,
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
  GridProps,
  GridConfig,
  gridStyles,
} from './props';
import { styleNames } from '../styles';

export interface StyleProps
  extends BackgroundProps,
    BorderProps,
    EffectProps,
    InteractiveProps,
    DisplayProps,
    DisplayPrintProps,
    SizeProps,
    PositionProps,
    SpaceProps,
    TextProps,
    TextAlignProps,
    FlexProps,
    GridProps {}

export interface SystemProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof StyleProps>,
    StyleProps,
    Responsive<
      SpaceProps & DisplayProps & TextAlignProps & FlexProps & GridProps
    > {}

const sizes = ['sm', 'md', 'lg', 'xl', 'xxl'];

const configs = [
  BackgroundConfig,
  BorderConfig,
  SpaceConfig,
  EffectConfig,
  InteractiveConfig,
  DisplayConfig,
  SizeConfig,
  PositionConfig,
  TextConfig,
  FlexConfig,
  GridConfig,
];

const compute = [
  backgroundStyles,
  borderStyles,
  spaceStyles,
  effectStyles,
  interactiveStyles,
  displayStyles,
  sizeStyles,
  positionStyles,
  textStyles,
  flexStyles,
  gridStyles,
];

const compact = (value: any) =>
  Array.isArray(value) ? value.flat(2).filter(Boolean) : value;

const collectStyles = (value: any, styles: object) => {
  if (value.className) {
    Object.assign(styles, value.style);
    return value.className;
  }
  return value;
};

const extractStyles = (props: Record<string, any>) => {
  let base = compute.map(fn => fn(props));
  let resp = sizes.map(sz => {
    let nested = (props as any)[sz];
    if (nested) {
      return compute.filter(fn => fn.length === 2).map(fn => fn(nested, sz));
    }
  });

  let styles = {};

  base = compact(base).map((item: any) => collectStyles(item, styles));
  resp = compact(resp).map((item: any) => collectStyles(item, styles));

  return {
    classes: [...base, ...resp],
    styles,
  };
};

export function useStyleProps(props: Record<string, any>) {
  const { className, style, ...otherProps } = props;
  const { classes, styles } = extractStyles(otherProps);
  const rest = omitStyles(otherProps);
  return {
    className: styleNames(className, classes),
    style: {
      ...style,
      ...styles,
    },
    ...rest,
  };
}

export const omitStyles = (props: Record<string, any>) => {
  const keys = configs.flatMap(c => Object.keys(c));
  const result: any = { ...props };
  keys.forEach(k => delete result[k]);
  sizes.forEach(k => delete result[k]);
  return result;
};

export const makeStyles = (props: Record<string, any>) => {
  const { classes } = extractStyles(props);
  return classes;
};
