import { MaterialSymbol } from 'material-symbols';
import { forwardRef } from 'react';
import { Box } from '../../core';
import { clsx } from '../../core/styles';
import { TForeground } from '../../core/system';

import styles from './material-icon.module.scss';

export interface MaterialIconProps {
  icon: MaterialSymbol;
  variant?: 'outlined' | 'rounded' | 'sharp';
  fill?: 0 | 1;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  grade?: -25 | 0 | 200;
  opticalSize?: 20 | 24 | 40 | 48;
  color?: TForeground;
  className?: string;
}

export const MaterialIcon = forwardRef<HTMLSpanElement, MaterialIconProps>(
  (props, ref) => {
    const {
      className,
      icon,
      variant = 'outlined',
      fill = 0,
      weight = 400,
      grade = 0,
      opticalSize = 48,
      color,
    } = props;

    const cls = `material-symbols-${variant}`;
    const clsName = clsx(className, styles[cls]);

    const fontVariationSettings = `"FILL" ${fill}, "wght" ${weight}, "GRAD" ${grade}, "opsz" ${opticalSize}`;
    const fontSize = `${opticalSize}px`;

    const style = { fontVariationSettings, fontSize };

    return (
      <Box as="span" className={clsName} color={color} style={style} ref={ref}>
        {icon}
      </Box>
    );
  }
);
