import type { Config, Responsive } from '../types';

export type SpaceValue = 0 | 1 | 2 | 3 | 4 | 5;
export type SpaceType<T> = Responsive<T | [T, T, T, T] | [T, T, T] | [T, T] | [T]>;

export type MarginValue = SpaceValue | 'auto';
export type PaddingValue = SpaceValue;

export type MarginType = Responsive<MarginValue>;
export type PaddingType = Responsive<PaddingValue>;

export interface SpaceProps {
  /**
   * Margin
   */
  m?: SpaceType<MarginValue>;

  /**
   * Margin on top
   */
  mt?: MarginType;

  /**
   * Margin on bottom
   */
  mb?: MarginType;

  /**
   * Margin on start (left, or right if RTL)
   */
  ms?: MarginType;

  /**
   * Margin on end (right, or left if RTL)
   */
  me?: MarginType;

  /**
   * Margin on start and end
   */
  mx?: MarginType;

  /**
   * Margin on top and bottom
   */
  my?: MarginType;

  /**
   * Padding
   */
  p?: SpaceType<PaddingValue>;

  /**
   * Padding on top
   */
  pt?: PaddingType;

  /**
   * Padding on bottom
   */
  pb?: PaddingType;

  /**
   * Padding on start (left, or right if RTL)
   */
  ps?: PaddingType;

  /**
   * Padding on end (right, or left if RTL)
   */
  pe?: PaddingType;

  /**
   * Padding on start and end
   */
  px?: PaddingType;

  /**
   * Padding on top and bottom
   */
  py?: PaddingType;
}

const suffixes = [[''], ['y', 'x'], ['t', 'x', 'b'], ['t', 'e', 'b', 's']];

const space = (cls: string) => (value: any, breakpoint?: string) => {
  const className = breakpoint
    ? `${cls}-${breakpoint}-${value}`
    : `${cls}-${value}`;
  return {
    classes: [className],
    styles: {},
  };
}

const spaces = (cls: string) => (value: any, breakpoints?: string) => {
  const values = Array.isArray(value) ? value : [value];
  const names = suffixes[values.length - 1];
  return names
    .map(x => cls + x)
    .map((x, i) => space(x)(values[i], breakpoints));
}

export const SpaceConfig: Config<SpaceProps> = {
  m: spaces('m'),
  mt: space('mt'),
  mb: space('mb'),
  ms: space('ms'),
  me: space('me'),
  mx: space('mx'),
  my: space('my'),
  p: spaces('p'),
  pt: space('pt'),
  pb: space('pb'),
  ps: space('ps'),
  pe: space('pe'),
  px: space('px'),
  py: space('py'),
};
