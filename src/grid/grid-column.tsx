import React, { memo } from "react";
import { useClassNames } from "../core";
import * as TYPES from "./types";
import styles from "./grid.module.scss";

export const GridColumn = memo(function GridColumn(
  props: TYPES.GridColumnProps & {
    renderChildren?: (
      column: TYPES.GridColumn,
      value: TYPES.GridColumnProps["value"],
    ) => React.ReactNode;
  },
) {
  const {
    children: _children,
    className,
    data,
    value,
    index,
    selected,
    renderer,
    renderChildren,
    onClick,
  } = props;

  const children = renderChildren ? renderChildren(data, value) : _children;

  const { width, minWidth } = data;
  const ColumnComponent = renderer || "div";
  const rendererProps = renderer ? props : {};
  const columnRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (selected && columnRef.current) {
      const focusable = columnRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable) {
        const timer = setTimeout(() => {
          (focusable as HTMLElement).focus();
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [selected]);

  const classNames = useClassNames();
  const $width = Math.max(width || 0, minWidth || 0);
  return (
    <ColumnComponent
      {...(renderer ? {} : { ref: columnRef })}
      {...rendererProps}
      onClick={(e) => onClick && onClick(e, data, index)}
      className={classNames(styles.column, className, data.$css, {
        [styles.center]: ["row-checked"].includes(data.type || ""),
        [styles.selected]: selected,
      })}
      style={
        $width > 0
          ? {
              width: $width,
              maxWidth: $width,
            }
          : { flex: 1 }
      }
    >
      {children && typeof children === "object" ? (
        children
      ) : (
        <span>{children}</span>
      )}
    </ColumnComponent>
  );
});
