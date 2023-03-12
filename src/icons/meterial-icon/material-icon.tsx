import { MaterialSymbol } from "material-symbols";
import { forwardRef, useMemo } from "react";
import { Box } from "../../core";
import { clsx } from "../../core/styles";
import { TForeground } from "../../core/system";

import styles from "./material-icon.module.scss";

export interface MaterialIconProps {
  icon: MaterialSymbol;
  variant?: "outlined" | "rounded" | "sharp";
  fill?: 0 | 1;
  weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
  grade?: -25 | 0 | 200;
  opticalSize?: 20 | 24 | 40 | 48;
  color?: TForeground;
  className?: string;
}

const styleNames = ["fill", "grade", "weight", "opticalSize"] as const;

const hasStyles = (props: Partial<MaterialIconProps>) => {
  return styleNames.some((name) => props[name] !== void 0);
};

const getStyles = ({
  fill,
  grade,
  weight,
  opticalSize: size,
}: Partial<MaterialIconProps>) => {
  const FILL = fill ?? "var(--ax-material-icon-fill)";
  const GRAD = grade ?? "var(--ax-material-icon-grad)";
  const wght = weight ?? "var(--ax-material-icon-wght)";
  const opsz = size ?? "var(--ax-material-icon-opsz)";

  const fontVariationSettings = `"FILL" ${FILL}, "GRAD" ${GRAD}, "wght" ${wght}, "opsz" ${opsz}`;
  const fontSize = size ? `${size}px` : "var(--ax-material-icon-fnsz)";

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
      weight,
      grade,
      opticalSize,
      color,
    } = props;

    const cls = `material-symbols-${variant}`;
    const clsName = clsx(className, styles[cls]);
    const style = useMemo(() => {
      const props = { fill, weight, grade, opticalSize };
      return hasStyles(props) ? getStyles(props) : undefined;
    }, [fill, weight, grade, opticalSize]);

    return (
      <Box as="span" className={clsName} color={color} style={style} ref={ref}>
        {icon}
      </Box>
    );
  }
);
