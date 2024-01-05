import iconNames from "bootstrap-icons/font/bootstrap-icons.json";
import { forwardRef } from "react";

import { Box, TForeground } from "../../core";
import { clsx } from "../../core/clsx";

import styles from "./bootstrap-icon.module.scss";

export type BootstrapIconName = keyof typeof iconNames;

export interface BootstrapIconProps {
  icon: BootstrapIconName;
  fill?: boolean;
  fontSize?: number | string;
  color?: TForeground;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export const BootstrapIcon = forwardRef<HTMLElement, BootstrapIconProps>(
  (props, ref) => {
    const { className, onClick, icon, fill, color, fontSize } = props;
    const name = fill && !icon.endsWith("-fill") ? `${icon}-fill` : icon;
    const cls = `bi-${name}`;
    const clsName = clsx(className, styles.icon, styles.bi, styles[cls]);

    return (
      <Box
        as="span"
        className={clsName}
        color={color}
        style={{ fontSize }}
        onClick={onClick}
        ref={ref}
      />
    );
  },
);
