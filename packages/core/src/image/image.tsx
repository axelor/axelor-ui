import React from 'react';

import { styleNames } from '../styles';
import { makeStyles, omitStyles, SystemProps } from '../system';

export interface ImageProps extends SystemProps {
  alt: string;
  src: string;
  srcSet?: string | string[];
  sizes?: string | string[];
  responsive?: boolean;
  thumbnail?: boolean;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ className, responsive, thumbnail, srcSet, sizes, ...props }, ref) => {
    const styles = makeStyles(props);
    const rest = omitStyles(props);

    const classes = styleNames(
      styles,
      {
        'img-fluid': responsive,
        'img-thumbnail': thumbnail,
      },
      className
    );

    srcSet = Array.isArray(srcSet) ? srcSet.join(',') : srcSet;
    sizes = Array.isArray(sizes) ? sizes.join(',') : sizes;

    return (
      <img
        ref={ref}
        className={classes}
        srcSet={srcSet}
        sizes={sizes}
        {...rest}
      />
    );
  }
);
