import React from 'react';
import { GridFooterRow } from './grid-footer-row';
import { doAggregate } from './utils';
import * as TYPES from './types';

export interface GridFooterProps
  extends Pick<TYPES.GridState, 'columns'>,
    Pick<TYPES.GridProps, 'records' | 'className'> {
  rowRenderer?: TYPES.Renderer;
}

export function GridFooter(props: GridFooterProps) {
  const { className, records, columns, rowRenderer } = props;
  const data = React.useMemo(
    () => ({
      aggregate: columns
        .filter(x => x.aggregate)
        .reduce(
          (data, column) => ({
            ...data,
            [column.name]: doAggregate(records, column),
          }),
          {}
        ),
    }),
    [columns, records]
  );

  return (
    <GridFooterRow
      className={className}
      index={-1}
      columns={columns}
      data={data as TYPES.GridRow}
      renderer={rowRenderer}
    />
  );
}
