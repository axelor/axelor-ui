import { Box, BoxProps } from '../box/box';
import { forwardRef } from '../system';
import { styleNames } from '../styles';

export interface StackProps extends Omit<BoxProps, 'gap'> {
  gap?: 0 | 1 | 2 | 3 | 4 | 5;
  horizontal?: boolean;
}

export const Stack = forwardRef<'div', StackProps>(
  ({ gap = 0, horizontal = false, className, ...props }, ref) => {
    const cls = styleNames(className, `gap-${gap}`, {
      vstack: !horizontal,
      hstack: !!horizontal,
    });
    return <Box display="flex" className={cls} ref={ref} {...props} />;
  }
);
