import { ComputeStyles, Config } from '../theme';

export interface EffectProps {
  shadow?: boolean | 'sm' | 'lg';
}

export const EffectConfig: Config<EffectProps> = {
  shadow: true,
};

export const effectStyles: ComputeStyles<EffectProps> = ({ shadow }) => {
  return [
    shadow === true && `shadow`,
    shadow === false && `shadow-none`,
    shadow === 'sm' && `shadow-sm`,
    shadow === 'lg' && `shadow-lg`,
  ];
};
