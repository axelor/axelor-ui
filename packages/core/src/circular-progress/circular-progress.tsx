import React from 'react';

import styles from './circular-progress.module.css';
import { styleNames } from '../styles';
import { makeStyles, omitStyles, SystemProps } from '../system';

const SIZE = 40;

export interface CircularProgressProps extends SystemProps {
  indeterminate?: boolean;
  size?: number | string;
  thickness?: number;
  value?: number;
}

export const CircularProgress = React.forwardRef<
  HTMLDivElement,
  CircularProgressProps
>(
  (
    {
      className,
      indeterminate,
      size = 40,
      thickness = 4,
      value = 0,
      style: styleProp,
      ...props
    },
    ref
  ) => {
    const $styles = makeStyles(props);
    const rest = omitStyles(props);
    const determinate = !indeterminate;
    const style = { height: size, width: size, ...styleProp };

    const classes = styleNames(
      styles.root,
      { [styles['root-determinate']]: determinate },
      $styles,
      className
    );

    const radius = (SIZE - thickness) / 2;

    const getCircleStyle = () => {
      if (indeterminate) return;

      const circumference = 2 * Math.PI * radius; // 2πr
      const strokeDasharray = circumference.toFixed(3);
      const offset = (((100 - value) / 100) * circumference).toFixed(3);
      return {
        strokeDasharray,
        strokeDashoffset: `${offset}px`,
      };
    };

    return (
      <div
        role="progressbar"
        ref={ref}
        className={classes}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        {...rest}
        style={style}
      >
        <svg
          className={styleNames({
            [styles['svg-indeterminate']]: indeterminate,
          })}
          viewBox={`${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`}
        >
          <circle
            className={styleNames({
              [styles['indeterminate']]: indeterminate,
              [styles['determinate']]: determinate,
            })}
            cx={SIZE}
            cy={SIZE}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={thickness}
            style={getCircleStyle()}
          ></circle>
        </svg>
      </div>
    );
  }
);
