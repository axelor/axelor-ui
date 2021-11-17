import { css } from '@emotion/css';

export type TVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

export type TColor =
  | 'red'
  | 'pink'
  | 'purple'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'grey'
  | 'black'
  | 'white';

export type TBackground = TVariant | TColor | 'body' | 'transparent';
export type TForeground =
  | TVariant
  | TColor
  | 'black-50'
  | 'white-50'
  | 'body'
  | 'muted';

export interface Responsive<T> {
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  xxl?: T;
}

export interface ThemeProps {
  variant?: TVariant;
}

export type Config<T> = {
  [K in keyof T]: boolean;
};

export type ComputeStyles<T> = (props: T, size?: string) => any;

export const computeStyle = (name: string, value: any, size?: string) => {
  if (value !== undefined && value !== null) {
    return (size ? [name, size, value] : [name, value]).join('-');
  }
};

// as per bootstrap break points
const breakpoints: any = {
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1400,
};

export const computeCss = (name: string, value: any, size?: string) => {
  if (value == undefined || value == null) return value;
  const style = { [name]: value };
  if (size) {
    const bp = breakpoints[size];
    return css({ [`@media (min-width: ${bp}px)`]: style });
  }
  return css(style);
};
