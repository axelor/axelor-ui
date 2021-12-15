import { forwardRef } from 'react';
import {
  OverridableComponent,
  OverridableProps,
  SystemProps,
  useStyleProps,
} from '../system';

export interface BoxProps extends SystemProps, OverridableProps {}

export const Box: OverridableComponent<'div', BoxProps> = forwardRef<
  HTMLDivElement,
  BoxProps
>(({ as: Component = 'div', ...props }, ref) => {
  const rest = useStyleProps(props);
  return <Component ref={ref} {...rest}></Component>;
});
