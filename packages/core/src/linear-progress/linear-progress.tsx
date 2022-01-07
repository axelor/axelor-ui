import styled, { withStyled } from '../styled';
import styles from './linear-progress.module.css';

export interface LinearProgressProps {
  indeterminate?: boolean;
  striped?: boolean;
  animated?: boolean;
  thickness?: number;
  value?: number;
}

const Inner = styled.div<LinearProgressProps>(
  ({ indeterminate, striped, animated }) => [
    'progress-bar',
    {
      'progress-bar-striped': striped,
      [styles.animated]: animated,
      [styles.indeterminate]: indeterminate,
    },
  ]
);

const Outer = styled.div<LinearProgressProps>(
  () => ['progress'],
  ({ thickness }) => ({
    style: { height: thickness },
  })
);

export const LinearProgress = withStyled(Outer)(
  (
    {
      indeterminate,
      striped,
      animated,
      value = 0,
      role = 'progressbar',
      ...props
    },
    ref
  ) => {
    return (
      <Outer {...props} ref={ref}>
        <Inner
          indeterminate={indeterminate}
          animated={animated}
          striped={striped}
          value={value}
          role={role}
          style={{ width: `${(value * 100) / 100}%` }}
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </Outer>
    );
  }
);
