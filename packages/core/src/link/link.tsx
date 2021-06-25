import React from 'react';

import { Box } from '@axelor-ui/core';
import { styleNames } from '../styles';
import { TVariant, SystemProps, makeStyles, omitStyles } from '../system';

export interface LinkProps extends SystemProps {
  href: string;
  color?: TVariant;
  underline?: boolean;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ color = 'primary', underline, className, ...props }, ref) => {
    props.textDecoration = underline ? 'underline' : 'none';

    const styles = makeStyles(props);
    const rest = omitStyles(props);

    return (
      <Box
        as="a"
        ref={ref}
        linkColor={color}
        className={styleNames(styles, className)}
        {...rest}
      />
    );
  }
);
