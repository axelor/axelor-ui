import { CSSProperties } from 'react';

export const Breakpoints = [
  'base',
  'sm',
  'md',
  'lg',
  'xl',
  'xxl'
] as const;

export type ResponsiveObject<T> = {
  base?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
}

export type Responsive<T> = T | ResponsiveObject<T>;

export type ComputeResult = undefined | string | {
  classes?: string | string[] | Record<string, any>;
  styles?: CSSProperties;
}

export type Compute = (value: any, breakpoint?: string) => ComputeResult | ComputeResult[];

export type Config<T> = {
  [K in keyof T]: Compute;
};
