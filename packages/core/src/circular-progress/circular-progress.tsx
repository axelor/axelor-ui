import { useMemo } from 'react';
import styled, { withStyled } from '../styled';
import { useStyleNames } from '../system';
import styles from './circular-progress.module.css';

const SIZE = 40;
const VIEW_BOX = `${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`;

export interface CircularProgressProps {
  indeterminate?: boolean;
  size?: number | string;
  thickness?: number;
  value?: number;
}

const CircularProgressRoot = styled.div<CircularProgressProps>();

export const CircularProgress = withStyled(CircularProgressRoot)(
  (
    {
      indeterminate,
      className,
      style,
      thickness = 4,
      value = 0,
      size = 40,
      ...props
    },
    ref
  ) => {
    const rootClass = useStyleNames(
      () => [
        styles.root,
        {
          [styles['root-determinate']]: !indeterminate,
        },
      ],
      [className, indeterminate]
    );

    const svgClass = useStyleNames(
      () => ({ [styles['svg-indeterminate']]: indeterminate }),
      [indeterminate]
    );

    const circleClass = useStyleNames(
      () => ({
        [styles['indeterminate']]: indeterminate,
        [styles['determinate']]: !indeterminate,
      }),
      [indeterminate]
    );

    const radius = (SIZE - thickness) / 2;

    const circleStyle = useMemo(() => {
      if (indeterminate) {
        return;
      }
      const circumference = 2 * Math.PI * radius; // 2πr
      const strokeDasharray = circumference.toFixed(3);
      const offset = (((100 - value) / 100) * circumference).toFixed(3);
      return {
        strokeDasharray,
        strokeDashoffset: `${offset}px`,
      };
    }, [indeterminate, radius, value]);

    return (
      <CircularProgressRoot
        {...props}
        className={rootClass}
        style={{ height: size, width: size, ...style }}
        ref={ref}
      >
        <svg className={svgClass} viewBox={VIEW_BOX}>
          <circle
            className={circleClass}
            cx={SIZE}
            cy={SIZE}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={thickness}
            style={circleStyle}
          />
        </svg>
      </CircularProgressRoot>
    );
  }
);
