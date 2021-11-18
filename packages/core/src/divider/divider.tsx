import { styleNames } from '../styles';
import {
  forwardRef,
  makeStyles,
  omitStyles,
  OverridableProps,
  SystemProps
} from '../system';
import cssStyles from './divider.module.css';

export interface DividerProps extends SystemProps, OverridableProps {
  vertical?: boolean;
}

export const Divider = forwardRef<'div', DividerProps>(
  ({ as, className, vertical, ...props }, ref) => {
    const classes = makeStyles(props);
    const rest = omitStyles(props);
    const Component = as || 'hr';
    return (
      <Component
        ref={ref}
        className={styleNames(cssStyles.divider, className, classes, {
          [cssStyles.vertical]: vertical,
        })}
        {...rest}
      ></Component>
    );
  }
);
