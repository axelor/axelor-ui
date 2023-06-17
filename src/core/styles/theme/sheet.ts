import Color from "color";

import { toButtonVars } from "./buttons";
import { ThemeOptions } from "./types";
import { rgbColor, shadeColor, tintColor } from "./utils";

interface ColorRecord extends Record<string, string | undefined> {}

interface GrayColors extends ColorRecord {
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

interface CommonColors extends ColorRecord {
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
}

interface ThemeColors extends ColorRecord {
  primary: string;
  secondary: string;
  success: string;
  info: string;
  warning: string;
  danger: string;
  light: string;
  dark: string;
}

const GRAYS: GrayColors = {
  100: "#f8f9fa",
  200: "#e9ecef",
  300: "#dee2e6",
  400: "#ced4da",
  500: "#adb5bd",
  600: "#6c757d",
  700: "#495057",
  800: "#343a40",
  900: "#212529",
};

const COMMON: CommonColors = {
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
};

const THEME: ThemeColors = {
  primary: COMMON.blue,
  secondary: GRAYS[600],
  success: COMMON.green,
  info: COMMON.cyan,
  warning: COMMON.yellow,
  danger: COMMON.red,
  light: GRAYS[100],
  dark: GRAYS[900],
};

const COMMON_COLOR_NAMES = [
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
] as const;

const THEME_COLOR_NAMES = [
  "primary",
  "secondary",
  "success",
  "warning",
  "danger",
  "info",
  "light",
  "dark",
] as const;

function findColor(name: string): string | undefined {
  return COMMON[name] ?? THEME[name] ?? GRAYS[name];
}

function findGrayColors({ palette = {} }: ThemeOptions) {
  const { grays, ...colors } = palette;
  return {
    dark: colors.dark ?? grays?.[800],
    100: grays?.[100] ?? colors.light,
    200: grays?.[200],
    300: grays?.[300],
    400: grays?.[400],
    500: grays?.[500] ?? colors.gray,
    600: grays?.[600],
    700: grays?.[700],
    800: grays?.[800] ?? colors.dark,
    900: grays?.[900],
  };
}

function findThemeColors({ palette = {} }: ThemeOptions) {
  const grays = findGrayColors({ palette });
  const look = (name: any) => (palette as any)[name] ?? findColor(name);
  return {
    primary: look(palette.primary) ?? palette.primary ?? palette.blue,
    secondary: look(palette.secondary) ?? palette.secondary ?? palette.gray,
    success: look(palette.success) ?? palette.success ?? palette.green,
    info: look(palette.info) ?? palette.info ?? palette.cyan,
    warning: look(palette.warning) ?? palette.warning ?? palette.yellow,
    danger: look(palette.danger) ?? palette.danger ?? palette.red,
    light: look(palette.light) ?? palette.light ?? grays[100],
    dark: look(palette.dark) ?? palette.dark ?? grays[800],
  };
}

function toColorVars({ palette = {} }: ThemeOptions) {
  const commonColors = COMMON_COLOR_NAMES.reduce(
    (prev, name) => ({ ...prev, [`--bs-${name}`]: palette[name] }),
    {}
  );

  const grays = findGrayColors({ palette });
  const grayColors = Object.entries(grays || {}).reduce(
    (prev, [k, v]) => ({ ...prev, [`--bs-gray-${k}`]: v }),
    {}
  );

  return {
    ...commonColors,
    ...grayColors,
  };
}

function toThemeVars({ palette = {} }: ThemeOptions) {
  const themeColors = findThemeColors({ palette });
  return THEME_COLOR_NAMES.reduce((prev, name) => {
    const color = themeColors[name];
    return {
      ...prev,
      [`--bs-${name}`]: color,
      [`--bs-${name}-rgb`]: color && rgbColor(color, true),
      [`--bs-${name}-text-emphasis`]: color && shadeColor(color, 0.6),
      [`--bs-${name}-bg-subtle`]: color && tintColor(color, 0.8),
      [`--bs-${name}-border-subtle`]: color && tintColor(color, 0.6),
    };
  }, {});
}

function toBodyVars({ palette = {}, typography = {} }: ThemeOptions) {
  const text = palette.text || palette.grays?.[900];
  const body = palette.body || palette.white;
  const black = palette.black;

  const gray200 = palette.grays?.[200];
  const gray100 = palette.grays?.[100];

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

  const { input = {} } = components;
  const { focus = {}, valid = {}, invalid = {} } = input;
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
    "--bs-form-valid-color": valid.color ?? palette.success,
    "--bs-form-valid-border-color": valid.borderColor ?? palette.success,
    "--bs-form-invalid-color": invalid.color ?? palette.danger,
    "--bs-form-invalid-border-color": invalid.borderColor ?? palette.danger,
  };
}

function joinVars(vars: Record<string, any>) {
  return Object.entries(vars)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}:${v};`)
    .join("");
}

function createRootRule(options: ThemeOptions) {
  const vars = {
    ...toColorVars(options),
    ...toThemeVars(options),
    ...toBodyVars(options),
    ...toBorderVars(options),
    ...toLinkVars(options),
    ...toMiscVars(options),
  };

  const text = joinVars(vars);

  return `:root{${text}}`;
}

function createButtonRules(
  { palette = {} }: ThemeOptions,
  classes: CSSModuleClasses = {}
) {
  const themeColors = findThemeColors({ palette });
  const rules: string[] = [];

  for (const name of THEME_COLOR_NAMES) {
    const color = themeColors[name];
    if (color) {
      for (const prefix of ["btn", "btn-outline"]) {
        const cls = classes[`${prefix}-${name}`];
        const outline = prefix === "btn-outline";
        if (cls) {
          const vars = toButtonVars(name, color, outline);
          const text = joinVars(vars);
          const rule = `.${cls}{${text}}`;
          rules.push(rule);
        }
      }
    }
  }

  return rules.join("");
}

export function createStyleSheet(
  options: ThemeOptions,
  classes?: CSSModuleClasses
) {
  const root = createRootRule(options);
  const buttons = createButtonRules(options, classes);

  const text = [root, buttons].filter(Boolean).join("");
  const sheet = new CSSStyleSheet();

  sheet.replaceSync(text);

  return sheet;
}
