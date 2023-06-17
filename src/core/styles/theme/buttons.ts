import Color from "color";

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
};

export function toButtonVars(
  variant: string,
  color: ColorParam,
  outline: boolean
) {
  if (outline) return buttonOutlineVariant({ background: color });
  const opts: ButtonOptions = { background: color, border: color };
  if (variant === "light") {
    opts.hoverBackground = shadeColor(color, hoverBgShadeAmount);
    opts.hoverBorder = shadeColor(color, hoverBorderShadeAmount);
    opts.activeBackground = shadeColor(color, activeBgShadeAmount);
    opts.activeBorder = shadeColor(color, activeBorderShadeAmount);
  }
  if (variant === "dark") {
    opts.hoverBackground = tintColor(color, hoverBgTintAmount);
    opts.hoverBorder = tintColor(color, hoverBorderTintAmount);
    opts.activeBackground = tintColor(color, activeBgTintAmount);
    opts.activeBorder = tintColor(color, activeBorderTintAmount);
  }
  return buttonVariant(opts);
}

function buttonVariant(options: ButtonOptions) {
  const background = options.background;
  const {
    border = background,
    color = colorContrast(background),
    hoverBackground = colorEquals(color, colorContrastLight)
      ? shadeColor(background, hoverBgShadeAmount)
      : tintColor(background, hoverBgTintAmount),
    hoverBorder = colorEquals(color, colorContrastLight)
      ? shadeColor(border, hoverBorderShadeAmount)
      : tintColor(border, hoverBorderTintAmount),
    hoverColor = colorContrast(hoverBackground),
    activeBackground = colorEquals(color, colorContrastLight)
      ? shadeColor(background, activeBgShadeAmount)
      : tintColor(background, activeBgTintAmount),
    activeBorder = colorEquals(color, colorContrastLight)
      ? shadeColor(border, activeBorderShadeAmount)
      : tintColor(border, activeBorderTintAmount),
    activeColor = colorContrast(activeBackground),
    disabledBackground = background,
    disabledBorder = border,
    disabledColor = colorContrast(disabledBackground),
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
  const {
    hoverColor = colorContrast(color),
    activeBackground = color,
    activeBorder = color,
    activeColor = colorContrast(activeBackground),
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
