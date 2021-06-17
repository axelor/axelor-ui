import { computeStyle, ComputeStyles, Config } from '../theme';

export type SpaceValue = 0 | 1 | 2 | 3 | 4 | 5;
export type SpaceType<T> = T | [T, T, T, T] | [T, T, T] | [T, T] | [T];

export type MarginValue = SpaceValue | 'auto';
export type PaddingValue = SpaceValue;

export interface SpaceProps {
  /**
   * Margin
   */
  m?: SpaceType<MarginValue>;

  /**
   * Margin on top
   */
  mt?: MarginValue;

  /**
   * Margin on bottom
   */
  mb?: MarginValue;

  /**
   * Margin on start (left, or right if RTL)
   */
  ms?: MarginValue;

  /**
   * Margin on end (right, or left if RTL)
   */
  me?: MarginValue;

  /**
   * Margin on start and end
   */
  mx?: MarginValue;

  /**
   * Margin on top and bottom
   */
  my?: MarginValue;

  /**
   * Padding
   */
  p?: SpaceType<PaddingValue>;

  /**
   * Padding on top
   */
  pt?: PaddingValue;

  /**
   * Padding on bottom
   */
  pb?: PaddingValue;

  /**
   * Padding on start (left, or right if RTL)
   */
  ps?: PaddingValue;

  /**
   * Padding on end (right, or left if RTL)
   */
  pe?: PaddingValue;

  /**
   * Padding on start and end
   */
  px?: PaddingValue;

  /**
   * Padding on top and bottom
   */
  py?: PaddingValue;
}

export const SpaceConfig: Config<SpaceProps> = {
  m: true,
  mt: true,
  mb: true,
  ms: true,
  me: true,
  mx: true,
  my: true,
  p: true,
  pt: true,
  pb: true,
  ps: true,
  pe: true,
  px: true,
  py: true,
};

const names = [[''], ['y', 'x'], ['t', 'x', 'b'], ['t', 'e', 'b', 's']];

const computeSides = (n: any, v: any, s: any) => {
  const values = [v].flat().filter(x => x !== undefined);
  const sides = names[values.length - 1] || [];
  return sides.map((x, i) => computeStyle(n + x, values[i], s));
};

export const spaceStyles: ComputeStyles<SpaceProps> = (
  { m, mt, mb, ms, me, mx, my, p, pt, pb, ps, pe, px, py },
  size
) => {
  return [
    computeSides('m', m, size),
    computeStyle('mt', mt, size),
    computeStyle('mb', mb, size),
    computeStyle('me', me, size),
    computeStyle('ms', ms, size),
    computeStyle('mx', mx, size),
    computeStyle('my', my, size),
    computeSides('p', p, size),
    computeStyle('pt', pt, size),
    computeStyle('pb', pb, size),
    computeStyle('pe', pe, size),
    computeStyle('ps', ps, size),
    computeStyle('px', px, size),
    computeStyle('py', py, size),
  ];
};
