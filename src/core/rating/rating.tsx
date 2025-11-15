import { CSSProperties, useCallback } from "react";

import { BootstrapIcon, BootstrapIconName } from "../../icons/bootstrap-icon";
import { Box } from "../box";
import { clsx } from "../clsx";
import { useRovingFocus } from "../hooks";
import { findDataProp, makeTestId } from "../system/utils";

import styles from "./rating.module.scss";

export type RatingProps = {
  /**
   * The rating value.
   */
  value: number;
  /**
   * The text label, ie `title` attribute.
   */
  text?: string;
  /**
   * The Bootstrap icon(s) to display. Many icons can be given if separated with comma.
   * @default `star`
   */
  icon?: BootstrapIconName | string;
  /**
   * The html colors for each icon. The colors must be comma separated.
   */
  color?: string;
  /**
   * Whether the icon should use fill style when checked
   * @default true
   */
  fill?: boolean;
  /**
   * If `true`, only the selected icon will be highlighted.
   * @default false
   */
  highlightSelected?: boolean;
  /**
   * Toggle the readonly state for the component.
   * @default false
   */
  readonly?: boolean;
  /**
   * Maximum rating.
   * @default 5
   */
  max?: number;
  /**
   * Callback fired when the value changes.
   * @param {number} position The new value.
   */
  handleClick?: (position: number) => void;
};

export function Rating(props: RatingProps) {
  const {
    icon = "star",
    color,
    fill = true,
    highlightSelected = false,
    readonly = false,
    max = 5,
    value,
    text,
    handleClick,
  } = props;

  const testId = findDataProp(props, "data-testid");
  const getIcon = useCallback(
    (position: number): BootstrapIconName => {
      const icons = icon.trim().split(/\s*,\s*/) as BootstrapIconName[];
      if (icons.length <= 1) {
        return icon as BootstrapIconName;
      }
      return icons[position - 1];
    },
    [icon],
  );

  const getColor = useCallback(
    (position: number): string | null => {
      const colors = color ? color.trim().split(/\s*,\s*/) : [];
      if (colors.length <= 0) {
        return null;
      }
      return colors[position - 1];
    },
    [color],
  );

  const getPartialWidth = useCallback(
    (position: number): number | null => {
      const intValue = Math.floor(value ?? 0);
      const decimalValue = (value ?? 0) - intValue;
      return position === intValue + 1 && decimalValue > 0
        ? Math.min(Math.max(decimalValue * 100 - 1, 25), 75)
        : null;
    },
    [value],
  );

  const { getRootProps, getItemProps } = useRovingFocus({
    orientation: "horizontal",
    index: value != null ? Math.ceil(value) - 1 : undefined,
    onSelect: (index) => {
      if (!readonly) {
        handleClick?.(index + 1);
      }
    },
    disabled: readonly,
  });

  return (
    <Box
      m={0}
      d="flex"
      role="radiogroup"
      aria-label={text}
      aria-disabled={readonly}
      className={clsx([styles.container], {
        [styles.pointer]: !readonly,
      })}
      data-testid={testId}
      {...getRootProps()}
    >
      {Array.from({ length: max }, (_, k) => k + 1).map((position) => {
        const partialWidth = getPartialWidth(position);
        const checked = position <= Math.ceil(value ?? 0);
        const posIcon = getIcon(position);
        const highlightMe = highlightSelected ? value === position : true;
        const iconColor = getColor(position);
        const style =
          (iconColor ? { style: { color: iconColor } } : null) ??
          PREDEFINED_ICONS[posIcon] ??
          {};

        return (
          <Box
            key={position}
            role="radio"
            aria-label={`${position}`}
            aria-checked={checked}
            aria-disabled={readonly}
            style={{ ...(checked && highlightMe ? style.style : {}) }}
            title={text}
            data-testid={makeTestId(testId, "icon", position)}
            {...getItemProps(position - 1)}
          >
            {partialWidth !== null ? (
              <Box
                style={{
                  overflow: "hidden",
                  position: "relative",
                }}
                aria-hidden="true"
              >
                <Box
                  style={{
                    overflow: "hidden",
                    position: "relative",
                    width: `${partialWidth}%`,
                  }}
                >
                  <BootstrapIcon
                    icon={posIcon}
                    fill={fill}
                    className={clsx([styles.icon], {
                      [styles.iconHover]: !readonly,
                    })}
                  />
                </Box>
                <Box
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                  }}
                >
                  <BootstrapIcon
                    icon={posIcon}
                    fill={false}
                    className={clsx([styles.icon], {
                      [styles.iconHover]: !readonly,
                    })}
                  />
                </Box>
              </Box>
            ) : (
              <BootstrapIcon
                icon={posIcon}
                fill={fill && checked}
                className={clsx([styles.icon], {
                  [styles.iconHover]: !readonly,
                })}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
}

const PREDEFINED_ICONS: Record<string, { style: CSSProperties }> = {
  star: {
    style: {
      color: "#faaf00",
    },
  },
  heart: {
    style: {
      color: "#ff6d75",
    },
  },
};
