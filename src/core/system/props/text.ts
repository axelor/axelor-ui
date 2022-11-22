import { TForeground } from '../theme';
import { Config, Responsive } from '../types';

export interface TextProps {
  color?: TForeground;
  linkColor?: TForeground;
  textAlign?: Responsive<'start' | 'center' | 'end'>;
  textWrap?: boolean;
  textBreak?: boolean;
  textTruncate?: boolean;
  textTransform?: 'none' | 'lowercase' | 'uppercase' | 'capitalize';
  textDecoration?: 'none' | 'underline' | 'line-through';
  fontSize?: 1 | 2 | 3 | 4 | 5 | 6;
  fontWeight?: 'bold' | 'bolder' | 'normal' | 'light' | 'lighter';
  fontStyle?: 'italic' | 'normal';
  fontMono?: boolean;
  lineHeight?: 1 | 'sm' | 'base' | 'lg';
}

const textStyle = (name: string) => (value: any, breakpoint?: string) => {
  return breakpoint ? `${name}-${breakpoint}-${value}` : `${name}-${value}`;
};

export const TextConfig: Config<TextProps> = {
  color: textStyle('text'),
  linkColor: textStyle('link'),
  textAlign: textStyle('text'),
  textWrap: value => ({
    classes: {
      [`text-wrap`]: value === true,
      [`text-nowrap`]: value === false,
    },
  }),
  textBreak: value => value && `text-break`,
  textTruncate: value => value && `text-truncate`,
  textTransform: textStyle('text'),
  textDecoration: textStyle('text-decoration'),
  fontSize: textStyle('fs'),
  fontWeight: textStyle('fw'),
  fontStyle: textStyle('fst'),
  fontMono: value => value && `font-monospace`,
  lineHeight: textStyle('lh'),
};
