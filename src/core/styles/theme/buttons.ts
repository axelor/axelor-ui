import Color from "color";

import {
  THEME_COLOR_NAMES,
  findColor,
  findThemeColors,
  processVars,
} from "./common";
import { ThemeOptions } from "./types";
import {
  ColorParam,
  colorContrast,
  colorEquals,
  hexColor,
  rgbColor,
  shadeColor,
  tintColor,
} from "./utils";

const hoverBgShadeAmount = 0.15;
const hoverBgTintAmount = 0.15;
const hoverBorderShadeAmount = 0.2;
const hoverBorderTintAmount = 0.1;
const activeBgShadeAmount = 0.2;
const activeBgTintAmount = 0.2;
const activeBorderShadeAmount = 0.25;
const activeBorderTintAmount = 0.1;

const colorContrastLight = "white";

export type ButtonOptions = {
  background: ColorParam;
  border?: ColorParam;
  color?: ColorParam;
  hoverBackground?: ColorParam;
  hoverBorder?: ColorParam;
  hoverColor?: ColorParam;
  activeBackground?: ColorParam;
  activeBorder?: ColorParam;
  activeColor?: ColorParam;
  disabledBackground?: ColorParam;
  disabledBorder?: ColorParam;
  disabledColor?: ColorParam;
  black?: ColorParam;
  white?: ColorParam;
};

export function toButtonVars(
  variant: string,
  color: ColorParam,
  outline: boolean,
  white: ColorParam,
  black: ColorParam
) {
  if (outline) return buttonOutlineVariant({ background: color, white, black });
  const opts: ButtonOptions = {
    background: color,
    border: color,
    white,
    black,
  };
  if (variant === "light") {
    opts.hoverBackground = shadeColor(color, hoverBgShadeAmount, black);
    opts.hoverBorder = shadeColor(color, hoverBorderShadeAmount, black);
    opts.activeBackground = shadeColor(color, activeBgShadeAmount, black);
    opts.activeBorder = shadeColor(color, activeBorderShadeAmount, black);
  }
  if (variant === "dark") {
    opts.hoverBackground = tintColor(color, hoverBgTintAmount, white);
    opts.hoverBorder = tintColor(color, hoverBorderTintAmount, white);
    opts.activeBackground = tintColor(color, activeBgTintAmount, white);
    opts.activeBorder = tintColor(color, activeBorderTintAmount, white);
  }
  return buttonVariant(opts);
}

function buttonVariant(options: ButtonOptions) {
  const background = options.background;
  const white = options.white;
  const black = options.black;
  const {
    border = background,
    color = colorContrast(background, white, black),
    hoverBackground = colorEquals(color, colorContrastLight)
      ? shadeColor(background, hoverBgShadeAmount, black)
      : tintColor(background, hoverBgTintAmount, white),
    hoverBorder = colorEquals(color, colorContrastLight)
      ? shadeColor(border, hoverBorderShadeAmount, black)
      : tintColor(border, hoverBorderTintAmount, white),
    hoverColor = colorContrast(hoverBackground, white, black),
    activeBackground = colorEquals(color, colorContrastLight)
      ? shadeColor(background, activeBgShadeAmount, black)
      : tintColor(background, activeBgTintAmount, white),
    activeBorder = colorEquals(color, colorContrastLight)
      ? shadeColor(border, activeBorderShadeAmount, black)
      : tintColor(border, activeBorderTintAmount, white),
    activeColor = colorContrast(activeBackground, white, black),
    disabledBackground = background,
    disabledBorder = border,
    disabledColor = colorContrast(disabledBackground, white, black),
  } = options;

  const shadowColor = Color(border).mix(Color(color), 0.15);
  return {
    "--bs-btn-color": hexColor(color),
    "--bs-btn-bg": hexColor(background),
    "--bs-btn-border-color": hexColor(border),
    "--bs-btn-hover-color": hexColor(hoverColor),
    "--bs-btn-hover-bg": hexColor(hoverBackground),
    "--bs-btn-hover-border-color": hexColor(hoverBorder),
    "--bs-btn-focus-shadow-rgb": rgbColor(shadowColor, true),
    "--bs-btn-active-color": hexColor(activeColor),
    "--bs-btn-active-bg": hexColor(activeBackground),
    "--bs-btn-active-border-color": hexColor(activeBorder),
    "--bs-btn-active-shadow": `inset 0 3px 5px rgba(var(--bs-black-rgb, 0, 0, 0), .125)`,
    "--bs-btn-disabled-color": hexColor(disabledColor),
    "--bs-btn-disabled-bg": hexColor(disabledBackground),
    "--bs-btn-disabled-border-color": hexColor(disabledBorder),
  };
}

function buttonOutlineVariant(options: ButtonOptions) {
  const color = options.background;
  const white = options.white;
  const black = options.black;
  const {
    hoverColor = colorContrast(color, white, black),
    activeBackground = color,
    activeBorder = color,
    activeColor = colorContrast(activeBackground, white, black),
  } = options;

  return {
    "--bs-btn-color": color,
    "--bs-btn-border-color": color,
    "--bs-btn-hover-color": hoverColor,
    "--bs-btn-hover-bg": activeBackground,
    "--bs-btn-hover-border-color": activeBorder,
    "--bs-btn-focus-shadow-rgb": rgbColor(color, true),
    "--bs-btn-active-color": activeColor,
    "--bs-btn-active-bg": activeBackground,
    "--bs-btn-active-border-color": activeBorder,
    "--bs-btn-active-shadow": `inset 0 3px 5px rgba(var(--bs-black-rgb, 0, 0, 0), .125)`,
    "--bs-btn-disabled-color": color,
    "--bs-btn-disabled-bg": "transparent",
    "--bs-btn-disabled-border-color": color,
    "--bs-gradient": "none",
  };
}

export function createButtonRules(
  options: ThemeOptions,
  classes: CSSModuleClasses = {}
) {
  const { palette = {} } = options;
  const themeColors = findThemeColors({ palette });
  const rules: string[] = [];

  const white = findColor(options, "white") ?? "white";
  const black = findColor(options, "black") ?? "black";

  for (const name of THEME_COLOR_NAMES) {
    const color = themeColors[name];
    if (color) {
      for (const prefix of ["btn", "btn-outline"]) {
        const cls = classes[`${prefix}-${name}`];
        const outline = prefix === "btn-outline";
        if (cls) {
          const vars = toButtonVars(name, color, outline, white, black);
          const text = processVars(options, vars);
          const rule = `.${cls}{${text}}`;
          rules.push(rule);
        }
      }
    }
  }

  return rules.join("");
}
