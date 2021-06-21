import { computeStyle, ComputeStyles, Config, TForeground } from '../theme';

export interface TextProps {
  color?: TForeground;
  linkColor?: TForeground;
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

export interface TextAlignProps {
  textAlign?: 'start' | 'center' | 'end';
}

export const TextConfig: Config<TextProps & TextAlignProps> = {
  color: true,
  linkColor: true,
  textAlign: true,
  textWrap: true,
  textBreak: true,
  textTruncate: true,
  textTransform: true,
  textDecoration: true,
  fontSize: true,
  fontWeight: true,
  fontStyle: true,
  fontMono: true,
  lineHeight: true,
};

export const textStyles: ComputeStyles<TextProps & TextAlignProps> = (
  {
    color,
    linkColor,
    textAlign,
    textWrap,
    textBreak,
    textTruncate,
    textTransform,
    textDecoration,
    fontSize,
    fontWeight,
    fontStyle,
    fontMono,
    lineHeight,
  },
  size
) => {
  return [
    computeStyle('text', color),
    computeStyle('link', linkColor),
    computeStyle('text', textAlign, size),
    textWrap === true && 'text-wrap',
    textWrap === false && 'text-nowrap',
    textBreak === true && 'text-break',
    textTruncate === true && 'text-truncate',
    computeStyle('text', textTransform),
    computeStyle('text-decoration', textDecoration),
    computeStyle('fs', fontSize),
    computeStyle('fw', fontWeight),
    computeStyle('fst', fontStyle),
    fontMono === true && 'font-monospace',
    computeStyle('lh', lineHeight),
  ];
};
