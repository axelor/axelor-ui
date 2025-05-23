import React from "react";
import { GridColumn } from "./grid-column";
import * as TYPES from "./types";
import styles from "./grid.module.scss";
import { clsx } from "../core/clsx";

interface GridSearchRowProps
  extends Pick<TYPES.GridRowProps, "columns">,
    Pick<TYPES.GridProps, "searchRowRenderer" | "searchColumnRenderer"> {}

export const GridSearchRow = React.memo(function GridSearchRow(
  props: GridSearchRowProps,
) {
  const { columns = [], searchRowRenderer, searchColumnRenderer } = props;
  const SearchRow = searchRowRenderer || "div";
  const ColumnRenderer = searchColumnRenderer;

  return (
    <SearchRow className={clsx(styles.row, styles.searchRow)}>
      {columns.map((column, index) => {
        const { $css, ...rest } = column;
        return (
          <GridColumn key={column.id ?? column.name} data={rest} index={index}>
            {ColumnRenderer && (
              <ColumnRenderer column={rest} columnIndex={index} />
            )}
          </GridColumn>
        );
      })}
    </SearchRow>
  );
});
