import { MaterialSymbol } from "@material-symbols/font-400";
import { forwardRef, useMemo } from "react";

import { Box } from "../../core";
import { clsx } from "../../core/clsx";
import { TForeground } from "../../core/system";
import { findAriaProp, findDataProp } from "../../core/system/utils";

import styles from "./material-icon.module.scss";

export interface MaterialIconProps {
  icon: MaterialSymbol;
  variant?: "outlined" | "rounded" | "sharp";
  fill?: boolean;
  fontSize?: number | string;
  color?: TForeground;
  className?: string;
  role?: string;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

const styleNames = ["fill", "fontSize"] as const;

const hasStyles = (props: Partial<MaterialIconProps>) => {
  return styleNames.some((name) => props[name] !== void 0);
};

const getStyles = ({ fill, fontSize }: Partial<MaterialIconProps>) => {
  const fontVariationSettings = fill
    ? `"FILL" 1, "GRAD" 0, "wght" 400, "opsz" 48`
    : undefined;

  return {
    fontVariationSettings,
    fontSize,
  };
};

export const MaterialIcon = forwardRef<HTMLSpanElement, MaterialIconProps>(
  (props, ref) => {
    const {
      role,
      className,
      icon,
      variant = "outlined",
      fill,
      fontSize,
      color,
      onClick,
    } = props;

    const cls = `material-symbols-${variant}`;
    const clsName = clsx(className, styles.icon, styles[cls], "notranslate");
    const style = useMemo(() => {
      const attrs = { fill, fontSize };
      return hasStyles(attrs) ? getStyles(attrs) : undefined;
    }, [fill, fontSize]);

    const testId = findDataProp(props, "data-testid");
    const ariaLabel = findAriaProp(props, "aria-label");
    const ariaHidden =
      findAriaProp(props, "aria-hidden") ?? (onClick ? undefined : true);

    return (
      <Box
        as="span"
        className={clsName}
        color={color}
        onClick={onClick}
        style={style}
        ref={ref}
        role={role}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden}
        data-testid={testId}
      >
        {icon}
      </Box>
    );
  },
);
