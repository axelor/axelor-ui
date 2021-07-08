import React from 'react';

import { Box } from '../box';
import { styleNames } from '../styles';
import {
  makeStyles,
  omitStyles,
  StyleProps,
  SystemProps,
  TBackground,
  TForeground,
} from '../system';

export interface BadgeProps extends SystemProps {
  bg?: TBackground;
  color?: TForeground;
  rounded?: StyleProps['rounded'];
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, bg = 'secondary', ...props }, ref) => {
    const styles = makeStyles(props);
    const rest = omitStyles(props);

    const classes = styleNames(styles, 'badge', className);

    return <Box ref={ref} className={classes} bg={bg} {...rest} as="span" />;
  }
);
