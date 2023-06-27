import Color from "color";

export type ColorParam =
  | Color
  | string
  | ArrayLike<number>
  | number
  | { [key: string]: any };

export function hexColor(color: ColorParam) {
  return Color(color).hex().toLowerCase();
}

export function rgbColor(color: ColorParam, tuple?: boolean) {
  const nums = Color(color).rgb().round().array();
  const text = nums.join(", ");
  return tuple ? text : nums.length === 4 ? `rgba(${text})` : `rgb(${text})`;
}

export function tintColor(
  color: ColorParam,
  weight: number,
  white: ColorParam = "white"
) {
  return Color(color).mix(Color(white), weight);
}

export function shadeColor(
  color: ColorParam,
  weight: number,
  black: ColorParam = "black"
) {
  return Color(color).mix(Color(black), weight);
}

export function colorEquals(color1: ColorParam, color2: ColorParam) {
  return color1 === color2 || hexColor(color1) === hexColor(color2);
}

export function colorContrast(
  background: ColorParam,
  colorContrastLight: ColorParam = "white",
  colorContrastDark: ColorParam = "black",
  minContrastRatio: number = 4.5
) {
  let maxRatio = 0;
  let maxRatioColor = null;

  for (const color of [colorContrastLight, colorContrastDark]) {
    const ratio = Color(background).contrast(Color(color));
    if (ratio > minContrastRatio) {
      return color;
    }
    if (ratio > maxRatio) {
      maxRatio = ratio;
      maxRatioColor = color;
    }
  }

  if (maxRatioColor === null) {
    throw new Error(`Unable to find contrast color.`);
  }

  return maxRatioColor;
}
