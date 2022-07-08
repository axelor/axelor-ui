import React from 'react';
import { GridColumn } from './grid-column';
import * as TYPES from './types';
import styles from './grid.module.scss';

interface GridSearchRowProps
  extends Pick<TYPES.GridRowProps, 'columns'>,
    Pick<TYPES.GridProps, 'searchRowRenderer' | 'searchColumnRenderer'> {}

export const GridSearchRow = React.memo(function GridSearchRow(
  props: GridSearchRowProps
) {
  const { columns = [], searchRowRenderer, searchColumnRenderer } = props;
  const SearchRow = searchRowRenderer || 'div';
  const ColumnRenderer = searchColumnRenderer;

  return (
    <SearchRow className={styles.row}>
      {columns.map((column, index) => (
        <GridColumn key={column.name} data={column} index={index}>
          {ColumnRenderer && (
            <ColumnRenderer column={column} columnIndex={index} />
          )}
        </GridColumn>
      ))}
    </SearchRow>
  );
});
