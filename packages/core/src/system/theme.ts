import { styleNames } from '../styles';

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

export const computeVar = (name: string, value: any, size?: string) => {
  if (value === null || value === undefined) {
    return value;
  }
  const classVar = size ? `l-${name}-${size}` : `l-${name}`;
  const className = styleNames(classVar);

  const style = {
    [`--${classVar}`]: value,
  };

  return {
    className,
    style,
  };
};
