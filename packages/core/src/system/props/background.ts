import { TBackground, Config, ComputeStyles } from '../theme';

export interface BackgroundProps {
  bg?: TBackground;
  bgColor?: TBackground;
  bgGradient?: boolean;
}

export const BackgroundConfig: Config<BackgroundProps> = {
  bg: true,
  bgColor: true,
  bgGradient: true,
};

export const backgroundStyles: ComputeStyles<BackgroundProps> = ({
  bg,
  bgColor,
  bgGradient,
}) => {
  return {
    [`bg-${bg}`]: bg,
    [`bg-${bgColor}`]: bgColor,
    [`bg-gradient`]: bgGradient,
  };
};
