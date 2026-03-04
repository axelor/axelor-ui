import React, { KeyboardEvent, useCallback, useEffect, useRef } from "react";

import { clsx } from "../core/clsx";
import { findDataProp, makeTestId } from "../core/system/utils";
import { GridColumn } from "./grid-column";

import * as TYPES from "./types";

import styles from "./grid.module.scss";

interface GridSearchRowProps
  extends
    Pick<TYPES.GridRowProps, "columns">,
    Pick<TYPES.GridProps, "searchRowRenderer" | "searchColumnRenderer"> {}

export const GridSearchRow = React.memo(function GridSearchRow(
  props: GridSearchRowProps,
) {
  const { columns = [], searchRowRenderer, searchColumnRenderer } = props;
  const SearchRow = searchRowRenderer || "div";
  const ColumnRenderer = searchColumnRenderer;
  const testId = findDataProp(props, "data-testid");

  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const keysToStop = [
      "Enter",
      "ArrowRight",
      "ArrowLeft",
      "ArrowUp",
      "ArrowDown",
      "Tab",
    ];

    if (keysToStop.includes(e.key)) {
      e.stopPropagation();
    }

    if (e.key !== "Tab") return;

    const inputs = containerRef.current
      ? Array.from(
          containerRef.current.querySelectorAll<HTMLInputElement>(
            "input, select",
          ),
        ).filter((el) => !el.disabled && el.tabIndex >= 0)
      : [];

    if (inputs.length === 0) return;

    const first = inputs[0];
    const last = inputs.at(-1) as HTMLElement;
    const active = document.activeElement as HTMLElement | null;

    // Tab on last -> focus first
    if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }

    // Shift+Tab on first -> focus last
    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    }
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production" && searchRowRenderer) {
      if (!containerRef.current) {
        console.warn(
          "Grid: searchRowRenderer must forward refs for keyboard navigation to work. " +
            "Use React.forwardRef() or a component that supports ref forwarding.",
        );
      }
    }
  }, [searchRowRenderer]);

  return (
    <SearchRow
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className={clsx(styles.row, styles.searchRow)}
      data-testid={testId}
      role="row"
    >
      {columns.map((column, index) => {
        const { $css, ...rest } = column;
        return (
          <GridColumn
            key={column.id ?? column.name}
            data={rest}
            index={index}
            data-testid={makeTestId(testId, "column", column.name)}
          >
            {ColumnRenderer && (
              <ColumnRenderer column={rest} columnIndex={index} />
            )}
          </GridColumn>
        );
      })}
    </SearchRow>
  );
});
