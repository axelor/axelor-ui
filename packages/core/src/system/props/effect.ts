import { Config } from "../types";

export interface EffectProps {
  shadow?: boolean | 'sm' | 'lg';
}

export const EffectConfig: Config<EffectProps> = {
  shadow: value => ({
    classes: {
      [`shadow`]: value === true,
      [`shadow-none`]: value === false,
      [`shadow-${value}`]: value,
    }
  })
};
