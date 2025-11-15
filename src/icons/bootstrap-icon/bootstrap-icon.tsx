import iconNames from "bootstrap-icons/font/bootstrap-icons.json";
import { forwardRef } from "react";

import { Box, TForeground } from "../../core";
import { clsx } from "../../core/clsx";
import { findAriaProp, findDataProp } from "../../core/system/utils";

import styles from "./bootstrap-icon.module.scss";

export type BootstrapIconName = keyof typeof iconNames;

export interface BootstrapIconProps {
  icon: BootstrapIconName;
  fill?: boolean;
  fontSize?: number | string;
  color?: TForeground;
  className?: string;
  role?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

export const BootstrapIcon = forwardRef<HTMLElement, BootstrapIconProps>(
  (props, ref) => {
    const { role, className, onClick, icon, fill, color, fontSize } = props;
    const name = fill && !icon.endsWith("-fill") ? `${icon}-fill` : icon;
    const cls = `bi-${name}`;
    const clsName = clsx(className, styles.icon, styles.bi, styles[cls]);

    const testId = findDataProp(props, "data-testid");
    const ariaLabel = findAriaProp(props, "aria-label");
    const ariaHidden =
      findAriaProp(props, "aria-hidden") ?? (onClick ? undefined : true);

    return (
      <Box
        as="span"
        className={clsName}
        color={color}
        style={{ fontSize }}
        onClick={onClick}
        ref={ref}
        role={role}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        data-testid={testId}
      />
    );
  },
);
