import { CSSProperties } from "react";

export interface ThemePalette {
  // common colors
  blue?: string;
  indigo?: string;
  purple?: string;
  pink?: string;
  red?: string;
  orange?: string;
  yellow?: string;
  green?: string;
  teal?: string;
  cyan?: string;

  // gray
  white?: string;
  black?: string;
  gray?: string;
  grays?: {
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    dark?: string;
  };

  // base colors
  body?: string;
  text?: string;

  // theme colors
  primary?: string;
  secondary?: string;
  success?: string;
  warning?: string;
  danger?: string;
  info?: string;
  light?: string;
  dark?: string;
}

export interface ThemeTypograpy {
  fontFamily?: string | string[];
  fontSize?: number | string;
  fontWeight?: number | string;
  lineHeight?: number | string;
}

export interface ThemeOptions {
  palette?: ThemePalette;
  typography?: {
    body?: ThemeTypograpy;
    code?: ThemeTypograpy;
  };
  border?: {
    width?: number | string;
    color?: string;
    style?: CSSProperties["borderStyle"];
  };
  link?: {
    color?: string;
    hover?: string;
    decoration?: CSSProperties["textDecorationStyle"];
  };
  components?: {
    input?: {
      focus?: {
        ring?: {
          width?: number | string;
          color?: string;
          opacity?: number;
        };
      };
      valid?: {
        color?: string;
        borderColor?: string;
        shadow?: string;
      };
      invalid?: {
        color?: string;
        borderColor?: string;
        shadow?: string;
      };
    };
  };
}
