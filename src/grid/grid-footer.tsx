import React from "react";
import { GridFooterRow } from "./grid-footer-row";
import { findDataProp, makeTestId } from "../core/system/utils";
import { doAggregate } from "./utils";
import * as TYPES from "./types";

export interface GridFooterProps
  extends
    Pick<TYPES.GridState, "columns">,
    Pick<TYPES.GridProps, "records" | "className"> {
  rowRenderer?: TYPES.Renderer;
}

export function GridFooter(props: GridFooterProps) {
  const { className, records, columns, rowRenderer } = props;
  const testId = findDataProp(props, "data-testid");
  const data = React.useMemo(
    () => ({
      aggregate: columns
        .filter((x) => x.aggregate)
        .reduce(
          (_data, column) => ({
            ..._data,
            [column.name]: doAggregate(records, column),
          }),
          {},
        ),
    }),
    [columns, records],
  );

  return (
    <div role="rowgroup" data-testid={testId}>
      <GridFooterRow
        className={className}
        index={-1}
        columns={columns}
        data={data as TYPES.GridRow}
        renderer={rowRenderer}
        data-testid={makeTestId(testId, "footer-row")}
      />
    </div>
  );
}
