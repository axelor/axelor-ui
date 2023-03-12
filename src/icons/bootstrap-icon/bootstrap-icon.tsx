import styles from "./bootstrap-icon.module.scss";

import iconNames from "bootstrap-icons/font/bootstrap-icons.json";
import { forwardRef } from "react";
import { clsx } from "../../core";

export type BootstrapIconName = keyof typeof iconNames;

export interface BootstrapIconProps {
  icon: BootstrapIconName;
  className?: string;
}

export const BootstrapIcon = forwardRef<HTMLElement, BootstrapIconProps>(
  (props, ref) => {
    const { className, icon } = props;
    const cls = `bi-${icon}`;
    const clsName = clsx(className, styles["bi"], styles[cls]);
    return <i className={clsName} ref={ref} />;
  }
);
