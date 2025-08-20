import { cloneElement, forwardRef } from "react";
import { ClassValue, cssx } from "../clsx";
import { useRefs } from "../hooks";
import { useStyles } from "../styles";

export interface DecorateProps {
  style?: React.CSSProperties;
  classes?: ClassValue;
  children: React.ReactElement<any>;
}

/**
 * This component can be used to style a child element with
 * the given class names and style.
 *
 */
export const Decorate = forwardRef<HTMLElement, DecorateProps>(
  (props, forwardedRef) => {
    const { children } = props;
    const styles = useStyles();

    const className = props.classes
      ? cssx(styles, props.classes, children.props?.className)
      : children.props?.className;

    const style = props.style
      ? { ...props.style, ...children.props?.style }
      : children.props?.style;

    const ref = useRefs(forwardedRef, (children as any)?.props?.ref);

    return cloneElement(children, {
      ...children.props,
      className,
      style,
      ref,
    });
  },
);
