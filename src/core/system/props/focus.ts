import { TVariant } from "../theme";
import { Config } from "../types";

export type FocusProps = {
  focusRing?: boolean;
  focusRingColor?: TVariant;
  focusRingWidth?: number | string;
};

const toSize = (value: number | string) => {
  return typeof value === "number" ? `${value}px` : value;
};

export const FocusConfig: Config<FocusProps> = {
  focusRing: (value: unknown) => {
    if (value === true) return "focus-ring";
    if (value === false) {
      return {
        classes: ["focus-ring"],
        styles: {
          "--bs-focus-ring-x": 0,
          "--bs-focus-ring-y": 0,
          "--bs-focus-ring-width": 0,
          "--bs-focus-ring-color": "transparent",
        } as React.CSSProperties,
      };
    }
  },
  focusRingColor: (value: unknown) => {
    return {
      styles: {
        "--bs-focus-ring-color": `var(--bs-${value})`,
      } as React.CSSProperties,
    };
  },
  focusRingWidth: (value) => {
    return {
      styles: {
        "--bs-focus-ring-width": toSize(value),
      } as React.CSSProperties,
    };
  },
};
