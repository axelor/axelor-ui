import React from "react";

import { clsx } from "../core/clsx";
import { findDataProp, makeTestId } from "../core/system/utils";
import { GridColumn } from "./grid-column";

import * as TYPES from "./types";

import styles from "./grid.module.scss";

interface GridSearchRowProps
  extends Pick<TYPES.GridRowProps, "columns">,
    Pick<TYPES.GridProps, "searchRowRenderer" | "searchColumnRenderer"> {}

export const GridSearchRow = React.memo(function GridSearchRow(
  props: GridSearchRowProps,
) {
  const { columns = [], searchRowRenderer, searchColumnRenderer } = props;
  const SearchRow = searchRowRenderer || "div";
  const ColumnRenderer = searchColumnRenderer;
  const testId = findDataProp(props, "data-testid");

  return (
    <SearchRow
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
