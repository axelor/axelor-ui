import { forwardRef } from "react";
import { clsx } from "../clsx";

import styles from "./scrollable.module.scss";

export type ScrollableProps = {
  overflowX?: boolean;
  overflowY?: boolean;
} & React.HTMLProps<HTMLDivElement>;

export const Scrollable = forwardRef<HTMLDivElement, ScrollableProps>(
  (props, ref) => {
    const { overflowX = false, overflowY = true, ...restProps } = props;
    const className = clsx(props.className, styles.scrollable, {
      [styles.overflowX]: overflowX,
      [styles.overflowY]: overflowY,
    });
    return <div {...restProps} className={className} ref={ref} />;
  }
);

Scrollable.displayName = "Scrollable";
