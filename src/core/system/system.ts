import React, { CSSProperties, useMemo } from 'react';
import { clsx, useClassNames } from '../styles';
import {
  BackgroundConfig,
  BackgroundProps,
  BorderConfig,
  BorderProps,
  DisplayConfig,
  DisplayPrintProps,
  DisplayProps,
  EffectConfig,
  EffectProps,
  FlexConfig,
  FlexProps,
  GridConfig,
  GridProps,
  InteractiveConfig,
  InteractiveProps,
  PositionConfig,
  PositionProps,
  SizeConfig,
  SizeProps,
  SpaceConfig,
  SpaceProps,
  TextConfig,
  TextProps,
} from './props';
import { ComputeResult } from './types';
import { isReponsive } from './utils';

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
    FlexProps,
    GridProps {}

export interface CSSStyleProps extends StyleProps {
  className?: string;
  style?: CSSProperties;
}

/**
 * @deprecated
 */
export interface SystemProps
  extends Omit<React.HTMLAttributes<HTMLElement>, keyof StyleProps>,
    StyleProps {}

const SystemConfig = {
  ...BackgroundConfig,
  ...BorderConfig,
  ...SpaceConfig,
  ...EffectConfig,
  ...InteractiveConfig,
  ...DisplayConfig,
  ...SizeConfig,
  ...PositionConfig,
  ...TextConfig,
  ...FlexConfig,
  ...GridConfig,
};

type KeyType = keyof typeof SystemConfig;

const toBreakpoints = (value: Record<string, any>) => {
  return isReponsive(value)
    ? Object.entries(value).map(([key, value]) => [value, key])
    : [[value, undefined]];
};

const extractStyle = <T extends StyleProps>(props: T) => {
  const classes: (string | string[] | Record<string, any>)[] = [];
  const styles = {};

  Object.entries(props)
    .filter(
      ([name, value]) =>
        value !== null && value !== undefined && name in SystemConfig
    )
    .map(([name, value]) => {
      const compute = SystemConfig[name as KeyType];
      if (compute) {
        const values = toBreakpoints(value);
        return values.flatMap(([v, b]) => compute(v, b));
      }
      return {} as ComputeResult;
    })
    .flat()
    .forEach(result => {
      if (typeof result === 'string') classes.push(result);
      if (typeof result === 'object') {
        if (result.classes) classes.push(result.classes);
        if (result.styles) Object.assign(styles, result.styles);
      }
    });

  return {
    classes: classes.flat(),
    styles,
  };
};

const extractProps = <T extends StyleProps>(props: T) => {
  const styleProps: Partial<Pick<T, keyof StyleProps>> = {};
  const otherProps: Partial<Omit<T, keyof StyleProps>> = {};
  for (const name in props) {
    const result: any = name in SystemConfig ? styleProps : otherProps;
    result[name] = props[name];
  }
  return { styleProps, otherProps };
};

export const useStyleProps = <T extends CSSStyleProps>(props: T) => {
  const { styleProps, otherProps } = useMemo(
    () => extractProps(props),
    [props]
  );

  const { classes, styles } = useMemo(
    () => extractStyle(styleProps),
    [styleProps]
  );

  const { className, style, ...rest } = otherProps;
  const classNames = useClassNames();

  const computedClassName = useMemo(
    (): string => classNames(classes),
    [classes, classNames]
  );

  const computedStyle = useMemo(
    (): CSSProperties => ({ ...style, ...styles }),
    [style, styles]
  );

  return {
    className: clsx(className, computedClassName),
    style: computedStyle || undefined,
    ...rest,
  };
};

/**
 * @deprecated
 */
export const omitStyles = (props: Record<string, any>) => {
  const keys = Object.keys(SystemConfig);
  const result: any = { ...props };
  keys.forEach(k => delete result[k]);
  ['sm', 'md', 'lg', 'xl', 'xxl'].forEach(k => delete result[k]);
  return result;
};

/**
 * @deprecated
 */
export const makeStyles = (props: Record<string, any>) => {
  const { classes } = extractStyle(props);
  return classes;
};
