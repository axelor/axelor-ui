import { MaterialSymbol } from "@material-symbols/font-400";
import { forwardRef, useMemo } from "react";

import { Box } from "../../core";
import { TForeground } from "../../core/system";
import { clsx } from "../../core/clsx";

import styles from "./material-icon.module.scss";

export interface MaterialIconProps {
  icon: MaterialSymbol;
  variant?: "outlined" | "rounded" | "sharp";
  fill?: boolean;
  fontSize?: number | string;
  color?: TForeground;
  className?: string;
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
      const props = { fill, fontSize };
      return hasStyles(props) ? getStyles(props) : undefined;
    }, [fill, fontSize]);

    return (
      <Box
        as="span"
        className={clsName}
        color={color}
        onClick={onClick}
        style={style}
        ref={ref}
      >
        {icon}
      </Box>
    );
  },
);
