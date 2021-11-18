import { forwardRef } from 'react';

import styles from './linear-progress.module.css';
import { styleNames } from '../styles';
import { makeStyles, omitStyles, SystemProps } from '../system';

export interface LinearProgressProps extends SystemProps {
  indeterminate?: boolean;
  striped?: boolean;
  animated?: boolean;
  thickness?: number;
  value?: number;
}

export const LinearProgress = forwardRef<
  HTMLDivElement,
  LinearProgressProps
>(
  (
    {
      className,
      indeterminate,
      striped,
      animated,
      thickness,
      value = 0,
      style: styleProp,
      ...props
    },
    ref
  ) => {
    const $styles = makeStyles(props);
    const rest = omitStyles(props);
    const classes = styleNames($styles, 'progress', className);

    const style = { ...(thickness ? { height: thickness } : {}), ...styleProp };
    const percentageWidth = (value * 100) / 100;

    return (
      <div ref={ref} className={classes} {...rest} style={style}>
        <div
          role="progressbar"
          className={styleNames('progress-bar', {
            'progress-bar-striped': striped,
            'progress-bar-animated': animated,
            [styles.indeterminate]: indeterminate,
          })}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ width: `${percentageWidth}%` }}
        />
      </div>
    );
  }
);
