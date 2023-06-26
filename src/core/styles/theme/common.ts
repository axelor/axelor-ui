import Color from "color";

import { toComponentVars } from "./components";
import { ThemeOptions, ThemePalette } from "./types";
import { rgbColor, shadeColor, tintColor } from "./utils";

export interface ColorRecord extends Record<string, string | undefined> {}

export interface CommonColors extends ColorRecord {
  blue: string;
  indigo: string;
  purple: string;
  pink: string;
  red: string;
  orange: string;
  yellow: string;
  green: string;
  teal: string;
  cyan: string;
  white: string;
  black: string;
  gray: string;
  gray_dark: string;
  gray_100: string;
  gray_200: string;
  gray_300: string;
  gray_400: string;
  gray_500: string;
  gray_600: string;
  gray_700: string;
  gray_800: string;
  gray_900: string;
}

export interface ThemeColors extends ColorRecord {
  primary: string;
  secondary: string;
  success: string;
  info: string;
  warning: string;
  danger: string;
  light: string;
  dark: string;
}

export const COMMON: CommonColors = {
  blue: "#0d6efd",
  indigo: "#6610f2",
  purple: "#6f42c1",
  pink: "#d63384",
  red: "#dc3545",
  orange: "#fd7e14",
  yellow: "#ffc107",
  green: "#198754",
  teal: "#20c997",
  cyan: "#0dcaf0",
  white: "#ffffff",
  black: "#000000",
  gray: "#adb5bd",
  gray_dark: "#343a40",
  gray_100: "#f8f9fa",
  gray_200: "#e9ecef",
  gray_300: "#dee2e6",
  gray_400: "#ced4da",
  gray_500: "#adb5bd",
  gray_600: "#6c757d",
  gray_700: "#495057",
  gray_800: "#343a40",
  gray_900: "#212529",
};

export const THEME: ThemeColors = {
  primary: COMMON.blue,
  secondary: COMMON.gray_600,
  success: COMMON.green,
  info: COMMON.cyan,
  warning: COMMON.yellow,
  danger: COMMON.red,
  light: COMMON.gray_100,
  dark: COMMON.gray_900,
};

export const COMMON_COLOR_NAMES = [
  "blue",
  "indigo",
  "purple",
  "pink",
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "cyan",
  "white",
  "black",
  "gray",
  "gray_dark",
  "gray_100",
  "gray_200",
  "gray_300",
  "gray_400",
  "gray_500",
  "gray_600",
  "gray_700",
  "gray_800",
  "gray_900",
] as const;

export const THEME_COLOR_NAMES = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
  "light",
  "dark",
] as const;

function findDefaultColor(name: string): string | undefined {
  return COMMON[name] ?? THEME[name];
}

export function findColor({ palette = {} }: ThemeOptions, color?: string) {
  const name = color as keyof ThemePalette;
  const value =
    palette[name] ??
    findThemeColors({ palette })[name] ??
    findDefaultColor(name) ??
    color;
  return value;
}

export function findThemeColors({ palette = {} }: ThemeOptions): ThemeColors {
  const look = (name: any) => (palette as any)[name] ?? findDefaultColor(name);
  return {
    primary: look(palette.primary) ?? palette.primary ?? palette.blue,
    secondary: look(palette.secondary) ?? palette.secondary ?? palette.gray,
    success: look(palette.success) ?? palette.success ?? palette.green,
    info: look(palette.info) ?? palette.info ?? palette.cyan,
    warning: look(palette.warning) ?? palette.warning ?? palette.yellow,
    danger: look(palette.danger) ?? palette.danger ?? palette.red,
    light: look(palette.light) ?? palette.light ?? palette.gray_100,
    dark: look(palette.dark) ?? palette.dark ?? palette.gray_800,
  };
}

export function processVars(options: ThemeOptions, vars: Record<string, any>) {
  return Object.entries(vars)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => [k, findColor(options, v)])
    .map(([k, v]) => `${k}:${v};`)
    .join("");
}

function toColorVars({ palette = {} }: ThemeOptions) {
  return COMMON_COLOR_NAMES.reduce((prev, name) => {
    const variable = name.replace("_", "-");
    return { ...prev, [`--bs-${variable}`]: palette[name] };
  }, {});
}

function toThemeVars({ palette = {} }: ThemeOptions) {
  const themeColors = findThemeColors({ palette });
  return THEME_COLOR_NAMES.reduce((prev, name) => {
    const color = themeColors[name];
    const variable = name.replace("_", "-");
    return {
      ...prev,
      [`--bs-${variable}`]: color,
      [`--bs-${variable}-rgb`]: color && rgbColor(color, true),
      [`--bs-${variable}-text-emphasis`]: color && shadeColor(color, 0.6),
      [`--bs-${variable}-bg-subtle`]: color && tintColor(color, 0.8),
      [`--bs-${variable}-border-subtle`]: color && tintColor(color, 0.6),
    };
  }, {});
}

function toBodyVars({ palette = {}, typography = {} }: ThemeOptions) {
  const text = palette.text || palette.gray_900;
  const body = palette.body || palette.white;
  const black = palette.black;

  const gray200 = palette.gray_200;
  const gray100 = palette.gray_100;

  const secondary = Color(text).alpha(0.75);
  const tertiary = Color(body).alpha(0.5);

  return {
    "--bs-body-bg": body,
    "--bs-body-bg-rgb": body && rgbColor(body, true),
    "--bs-body-color": text,
    "--bs-body-color-rgb": text && rgbColor(text, true),
    "--bs-body-font-family": typography.body?.fontFamily,
    "--bs-body-font-size": typography.body?.fontSize,
    "--bs-body-font-weight": typography.body?.fontWeight,
    "--bs-body-line-height": typography.body?.lineHeight,
    "--bs-emphasis-color": black,
    "--bs-emphasis-color-rgb": black && rgbColor(black, true),
    "--bs-secondary-color": text && rgbColor(secondary),
    "--bs-secondary-color-rgb": text && rgbColor(secondary, true),
    "--bs-secondary-bg": gray200,
    "--bs-secondary-bg-rgb": gray200 && rgbColor(gray200, true),
    "--bs-tertiary-color": body && rgbColor(tertiary),
    "--bs-tertiary-color-rgb": body && rgbColor(tertiary, true),
    "--bs-tertiary-bg": gray100,
    "--bs-tertiary-bg-rgb": gray100 && rgbColor(gray100, true),
  };
}

function toBorderVars({ border = {} }: ThemeOptions) {
  return {
    "--bs-border-width": border.width,
    "--bs-border-style": border.style,
    "--bs-border-color": border.color,
  };
}

function toLinkVars({ link = {} }: ThemeOptions) {
  return {
    "--bs-link-color": link.color,
    "--bs-link-color-rgb": link.color && rgbColor(link.color, true),
    "--bs-link-decoration": link.decoration,
    "--bs-link-hover-color": link.hover,
    "--bs-link-hover-color-rgb": link.hover && rgbColor(link.hover, true),
  };
}

function toMiscVars({ palette = {}, components = {} }: ThemeOptions) {
  const yellow = palette.yellow;
  const yellow100 = yellow && tintColor(yellow, 0.8);

  const black = palette.black || "black";

  const { Input: input = {} } = components;
  const { focus = {}, invalid = {} } = input;
  const { ring = {} } = focus;

  const ringColor = ring.color
    ? ring.color
    : palette.primary
    ? Color(palette.primary).alpha(0.25)
    : undefined;

  return {
    "--bs-black-rgb": rgbColor(black, true), // for button shadow
    "--bs-code-color": palette.pink,
    "--bs-highlight-bg": yellow100,
    "--bs-focus-ring-width": ring.width,
    "--bs-focus-ring-opacity": ring.opacity,
    "--bs-focus-ring-color": ringColor && rgbColor(ringColor),
    "--bs-form-invalid-color": invalid.color ?? palette.danger,
    "--bs-form-invalid-border-color": invalid.borderColor ?? palette.danger,
  };
}

export function toCommonVars(options: ThemeOptions) {
  return {
    ...toColorVars(options),
    ...toThemeVars(options),
    ...toBodyVars(options),
    ...toBorderVars(options),
    ...toLinkVars(options),
    ...toMiscVars(options),
    ...toComponentVars(options),
  };
}
