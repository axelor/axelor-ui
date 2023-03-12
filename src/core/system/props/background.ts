import { TBackground } from "../theme";
import { Config } from "../types";

export interface BackgroundProps {
  bg?: TBackground;
  bgColor?: TBackground;
  bgGradient?: boolean;
}

export const BackgroundConfig: Config<BackgroundProps> = {
  bg: (value) => `bg-${value}`,
  bgColor: (value) => `bg-${value}`,
  bgGradient: (value) => value && `bg-gradient`,
};
