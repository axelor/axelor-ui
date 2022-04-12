import React from 'react';
import {
  GridHeaderColumn,
  GridHeaderColumnProps,
  ResizeHandler,
} from './grid-header-column';
import { DropHandler } from './grid-drag-element';
import { GridSearchRow } from './grid-search-row';
import * as TYPES from './types';
import styles from './grid.module.css';
import { isRowCheck } from './utils';

export interface GridHeaderProps
  extends Pick<
      TYPES.GridState,
      'selectedCols' | 'columns' | 'orderBy' | 'groupBy'
    >,
    Pick<
      TYPES.GridProps,
      'selectionType' | 'searchRowRenderer' | 'searchColumnRenderer'
    > {
  className?: string;
  hiddenColumns?: TYPES.GridColumn[];
  rowRenderer?: TYPES.Renderer;
  checkType?: GridHeaderColumnProps['checkType'];
  onCheckAll?: (checked: boolean) => void;
  onColumnDrop?: DropHandler;
  onColumnResizeStart?: ResizeHandler;
  onColumnResize?: ResizeHandler;
  onColumnResizeEnd?: ResizeHandler;
  onColumnClick?: (
    e: React.SyntheticEvent,
    column: TYPES.GridColumn,
    columnIndex: number,
    sortOrder?: 'asc' | 'desc'
  ) => void;
  onColumnShow?: GridHeaderColumnProps['onShow'];
  onColumnHide?: GridHeaderColumnProps['onHide'];
  onColumnCustomize?: GridHeaderColumnProps['onCustomize'];
  onColumnGroupAdd?: GridHeaderColumnProps['onGroup'];
  onColumnGroupRemove?: GridHeaderColumnProps['onUngroup'];
  onColumnSort?: GridHeaderColumnProps['onSort'];
}

export const GridHeader = React.memo(function GridHeader(
  props: GridHeaderProps
) {
  const {
    className,
    columns = [],
    hiddenColumns,
    orderBy,
    checkType,
    selectionType,
    groupBy,
    searchRowRenderer,
    searchColumnRenderer,
    rowRenderer,
    onCheckAll,
    onColumnDrop,
    onColumnClick,
    onColumnSort,
    onColumnCustomize,
    onColumnShow,
    onColumnHide,
    onColumnGroupAdd,
    onColumnGroupRemove,
    onColumnResizeStart,
    onColumnResize,
    onColumnResizeEnd,
  } = props;
  const RowRenderer = rowRenderer || 'div';

  return (
    <div className={className}>
      <RowRenderer className={styles.row}>
        {columns.map((column, index) => {
          const sortColumn = (orderBy || []).find(
            col => col.name === column.name
          );
          return (
            <GridHeaderColumn
              key={column.name}
              index={index}
              data={column}
              sort={sortColumn ? sortColumn.order : null}
              hiddenColumns={hiddenColumns}
              groupBy={groupBy}
              onCheckAll={onCheckAll}
              onSort={onColumnSort}
              onShow={onColumnShow}
              onHide={onColumnHide}
              onGroup={onColumnGroupAdd}
              onUngroup={onColumnGroupRemove}
              onCustomize={onColumnCustomize}
              onClick={onColumnClick}
              onDrop={onColumnDrop}
              onResize={onColumnResize}
              onResizeStart={onColumnResizeStart}
              onResizeEnd={onColumnResizeEnd}
              {...(isRowCheck(column) ? { checkType, selectionType } : {})}
            />
          );
        })}
      </RowRenderer>

      {searchRowRenderer && searchColumnRenderer && (
        <GridSearchRow
          {...{
            columns,
            searchRowRenderer,
            searchColumnRenderer,
          }}
        />
      )}
    </div>
  );
});
