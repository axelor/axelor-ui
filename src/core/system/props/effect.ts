import { Config } from "../types";

export interface EffectProps {
  opacity?: 0 | 25 | 50 | 75 | 100;
  shadow?: boolean | "sm" | "md" | "lg" | "xl" | "2xl" | "inner";
  dropShadow?: boolean | "sm" | "md" | "lg" | "xl" | "2xl";
}

export const EffectConfig: Config<EffectProps> = {
  opacity: (value) => `opacity-${value}`,
  shadow: (value) => ({
    classes: {
      [`box-shadow`]: value === true,
      [`box-shadow-none`]: value === false,
      [`box-shadow-${value}`]: typeof value === "string" && value,
    },
  }),
  dropShadow: (value) => ({
    classes: {
      [`drop-shadow`]: value === true,
      [`drop-shadow-none`]: value === false,
      [`drop-shadow-${value}`]: typeof value === "string" && value,
    },
  }),
};
