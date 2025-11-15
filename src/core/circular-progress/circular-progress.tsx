import { useMemo } from "react";
import styled, { withStyled } from "../styled";
import { useClassNames } from "../styles";
import styles from "./circular-progress.module.css";

const SIZE = 40;
const VIEW_BOX = `${SIZE / 2} ${SIZE / 2} ${SIZE} ${SIZE}`;

export interface CircularProgressProps {
  /** If `true`, the progress indicator animates continuously (ignores `value`). */
  indeterminate?: boolean;
  /**
   * The size of the circular progress indicator (width and height).
   * @default 40
   */
  size?: number | string;
  /**
   * The thickness of the circle stroke in pixels.
   * @default 4
   */
  thickness?: number;
  /**
   * The current value of the progress indicator.
   * @default 0
   */
  value?: number;
  /**
   * The minimum value of the progress indicator range.
   * @default 0
   */
  min?: number;
  /**
   * The maximum value of the progress indicator range.
   * @default 100
   */
  max?: number;
}

const CircularProgressRoot = styled.div<CircularProgressProps>();

export const CircularProgress = withStyled(CircularProgressRoot)((
  {
    indeterminate,
    className,
    style,
    thickness = 4,
    value = 0,
    min = 0,
    max = 100,
    size = 40,
    ...props
  },
  ref,
) => {
  const classNames = useClassNames();
  const rootClass = classNames([
    styles.root,
    {
      [styles["root-determinate"]]: !indeterminate,
    },
  ]);

  const svgClass = classNames({
    [styles["svg-indeterminate"]]: indeterminate,
  });

  const circleClass = classNames({
    [styles["indeterminate"]]: indeterminate,
    [styles["determinate"]]: !indeterminate,
  });

  const radius = (SIZE - thickness) / 2;

  const circleStyle = useMemo(() => {
    if (indeterminate) {
      return;
    }
    const circumference = 2 * Math.PI * radius; // 2πr
    const strokeDasharray = circumference.toFixed(3);
    const normalized = ((value - min) / (max - min)) * 100;
    const offset = (((100 - normalized) / 100) * circumference).toFixed(3);
    return {
      strokeDasharray,
      strokeDashoffset: `${offset}px`,
    };
  }, [indeterminate, radius, value, min, max]);

  return (
    <CircularProgressRoot
      {...props}
      className={rootClass}
      style={{ height: size, width: size, ...style }}
      ref={ref}
      role={indeterminate ? "status" : "progressbar"}
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={indeterminate ? undefined : min}
      aria-valuemax={indeterminate ? undefined : max}
      aria-busy={indeterminate ? "true" : undefined}
    >
      <svg className={svgClass} viewBox={VIEW_BOX} aria-hidden="true">
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
});
