import styled, { withStyled } from "../styled";
import { useTheme } from "../styles";
import styles from "./linear-progress.module.css";

export interface LinearProgressProps {
  /** If `true`, the progress bar animates continuously (ignores `value`). */
  indeterminate?: boolean;
  /** If `true`, applies a striped pattern to the progress bar. */
  striped?: boolean;
  /** If `true`, animates the striped pattern. */
  animated?: boolean;
  /** The height of the progress bar in pixels. */
  thickness?: number;
  /**
   * The current value of the progress bar.
   * @default 0
   */
  value?: number;
  /**
   * The minimum value of the progress bar range.
   * @default 0
   */
  min?: number;
  /**
   * The maximum value of the progress bar range.
   * @default 100
   */
  max?: number;
}

const Inner = styled.div<LinearProgressProps & { dir: string }>(
  ({ indeterminate, striped, animated, dir }) => [
    "progress-bar",
    {
      "progress-bar-striped": striped,
      [styles.animated]: animated,
      [styles.indeterminate]: indeterminate,
      [styles[dir]]: dir,
    },
  ],
);

const Outer = styled.div<LinearProgressProps>(
  () => ["progress"],
  ({ thickness }) => ({
    style: { height: thickness },
  }),
);

export const LinearProgress = withStyled(Outer)((
  {
    indeterminate,
    striped,
    animated,
    value = 0,
    min = 0,
    max = 100,
    role = indeterminate ? "status" : "progressbar",
    ...props
  },
  ref,
) => {
  const { dir = "" } = useTheme();
  return (
    <Outer
      role={role}
      aria-valuenow={indeterminate ? undefined : value}
      aria-valuemin={indeterminate ? undefined : min}
      aria-valuemax={indeterminate ? undefined : max}
      aria-busy={indeterminate ? "true" : undefined}
      {...props}
      ref={ref}
    >
      <Inner
        dir={dir}
        indeterminate={indeterminate}
        animated={animated}
        striped={striped}
        style={{ width: `${((value - min) / (max - min)) * 100}%` }}
      />
    </Outer>
  );
});
